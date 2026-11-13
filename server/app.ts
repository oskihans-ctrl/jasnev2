import express, { type Express, type Request, type Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { config } from './config';
import { createRateLimiter, type RateLimiter } from './rateLimit';
import { originGuard } from './middleware/originGuard';
import { identifyUser } from './middleware/auth';
import { securityHeaders } from './middleware/securityHeaders';
import { centralErrorHandler } from './middleware/errorHandler';
import { createHealthRouter } from './routes/health.routes';
import { createAiRouter } from './routes/ai.routes';
import { createJevRouter } from './routes/jev.routes';

export interface CreateAppOptions {
  enableFrontend?: boolean;
  apiLimiter?: RateLimiter;
  aiLimiter?: RateLimiter;
  httpServer?: import('http').Server;
}

export async function createApp(options?: CreateAppOptions): Promise<{
  app: Express;
  apiLimiter: RateLimiter;
  aiLimiter: RateLimiter;
}> {
  const app = express();

  // Za reverse-proxy (Vercel / Cloud Run / nginx) tylko zaufanie do pierwszego
  // hopu daje poprawne req.ip — bez tego rate limiting jest obchodzony nagłówkiem
  // X-Forwarded-For.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(securityHeaders);

  app.use(express.json({ limit: config.jsonBodyLimit }));

  const apiLimiter =
    options?.apiLimiter ??
    createRateLimiter({
      rules: [{ bucket: 'api', windowMs: config.rateLimits.apiWindowMs, max: config.rateLimits.apiMax }],
    });

  const aiLimiter =
    options?.aiLimiter ??
    createRateLimiter({
      rules: [
        {
          bucket: 'ai',
          windowMs: config.rateLimits.apiWindowMs,
          max: config.rateLimits.aiMax,
          guestMax: config.rateLimits.aiGuestMax,
        },
        {
          bucket: 'ai-day',
          windowMs: 24 * 60 * 60 * 1000,
          max: config.rateLimits.aiDailyMax,
          guestMax: config.rateLimits.aiGuestDailyMax,
        },
      ],
    });

  // identifyUser musi działać przed limiterami — klucz limitu to zweryfikowany uid.
  app.use('/api', originGuard, identifyUser, apiLimiter.middleware);

  // Mount API routers
  app.use('/api', createHealthRouter(apiLimiter));
  app.use('/api', createAiRouter(aiLimiter));
  app.use('/api', createJevRouter(aiLimiter));

  // Twarde 404 dla nieznanych endpointów API — nigdy nie oddajemy SPA w JSON-owym API.
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Nieznany endpoint API.', code: 'not_found' });
  });

  // Frontend SPA (Vite dev server or static dist)
  if (options?.enableFrontend !== false) {
    if (!config.isProduction) {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          ...(options?.httpServer ? { hmr: { server: options.httpServer } } : {}),
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(
        express.static(distPath, {
          maxAge: '1y',
          immutable: true,
          setHeaders: (res, filePath) => {
            // HTML files should never be cached permanently so deployments reflect instantly
            if (filePath.endsWith('.html')) {
              res.setHeader('Cache-Control', 'no-cache, must-revalidate');
            }
          },
        })
      );
      app.get('*', (_req: Request, res: Response) => {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  // Centralny error handler — musi być zarejestrowany jako ostatni.
  app.use(centralErrorHandler);

  return { app, apiLimiter, aiLimiter };
}

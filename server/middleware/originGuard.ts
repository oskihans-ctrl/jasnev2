import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Ochrona same-origin dla /api.
 *
 * Aplikacja korzysta z BFF (ten sam origin), więc przeglądarka nie powinna
 * wysyłać tu żądań z obcej domeny. Guard blokuje wykorzystanie naszego backendu
 * jako darmowej bramki do płatnych modeli AI z cudzej strony. W trybie
 * deweloperskim przepuszczamy lokalne origin Vite/Express.
 */
const devOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
]);

export const originGuard = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  if (typeof origin !== 'string' || origin.length === 0) {
    // Brak Origin = żądanie nieprzeglądarkowe (aplikacja mobilna, curl, SSR).
    // Guard chroni tylko przed cudzymi stronami w przeglądarce; przed skryptami
    // chronią identifyUser + limity per uid/IP (gość ma ostrzejsze).
    next();
    return;
  }
  if (config.allowedOrigins.includes(origin)) {
    next();
    return;
  }
  if (!config.isProduction && devOrigins.has(origin)) {
    next();
    return;
  }
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host;
  if (host) {
    try {
      const originHost = new URL(origin).host;
      // Bez wyjątku dla całego `*.vercel.app` — każdy może tam postawić własny
      // frontend. Domeny naszych deploymentów Vercela są w config.allowedOrigins.
      if (originHost === host) {
        next();
        return;
      }
    } catch {
      // nieprawidłowy Origin traktujemy jak obcy
    }
  }
  logger.warn('forbidden_origin', { origin, host, path: req.path });
  res.status(403).json({ error: 'Żądanie z niedozwolonego origin.', code: 'forbidden_origin' });
};

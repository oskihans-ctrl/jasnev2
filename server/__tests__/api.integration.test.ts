import { beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../app';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('AI offline'));
    const created = await createApp({ enableFrontend: false });
    app = created.app;
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status metadata', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.providers).toBeDefined();
      expect(response.body.rateLimit).toBeDefined();
    });

    it('should send security headers', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['content-security-policy']).toBe("frame-ancestors 'none'");
      expect(response.headers['strict-transport-security']).toContain('max-age=');
    });
  });

  describe('Origin Guard Middleware', () => {
    it('should reject requests with an untrusted Origin header', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://malicious-website.com');

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('forbidden_origin');
    });

    it('should allow requests from local dev origins in non-production mode', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
    });

    it('should allow non-browser requests without Origin header', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });
  });

  describe('404 for unhandled API routes', () => {
    it('should return 404 JSON for unknown /api subpaths', async () => {
      const response = await request(app).get('/api/non-existent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('not_found');
      expect(response.body.error).toBe('Nieznany endpoint API.');
    });
  });

  describe('POST /api/hint', () => {
    it('should return a hint response using fallback when external AI is offline', async () => {
      const response = await request(app)
        .post('/api/hint')
        .send({
          question: 'Wykaż, że dla dowolnych liczb rzeczywistych $x, y$ zachodzi nierówność...',
          staticHint: 'Skorzystaj ze wzoru na kwadrat różnicy.',
        });

      expect(response.status).toBe(200);
      expect(response.body.reply).toBeDefined();
      expect(typeof response.body.reply).toBe('string');
      expect(response.body.provider).toBeDefined();
    });
  });

  describe('POST /api/evaluate-task', () => {
    it('should evaluate a mathematics answer using rubric fallback', async () => {
      const response = await request(app)
        .post('/api/evaluate-task')
        .send({
          question: 'Oblicz wartość wyrażenia...',
          scoring_key: '2/5',
          studentAnswer: 'Rozwiązanie to \\frac{2}{5}',
          maxPoints: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(2);
      expect(response.body.maxPoints).toBe(2);
      expect(response.body.isPassed).toBe(true);
    }, 30000);

    it('should handle empty/gibberish answers with 0 points immediately', async () => {
      const response = await request(app)
        .post('/api/evaluate-task')
        .send({
          question: 'Wyjaśnij sens motywu...',
          studentAnswer: 'asdf',
          taskType: 'OPEN_POLISH',
          maxPoints: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(0);
      expect(response.body.isPassed).toBe(false);
      expect(response.body.errors).toContain('Brak merytorycznej odpowiedzi.');
    });
  });
});

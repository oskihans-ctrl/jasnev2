import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../app';

describe('Jev System 1 Diagnostic API Tests', () => {
  let app: Express;

  beforeAll(async () => {
    const created = await createApp({ enableFrontend: false });
    app = created.app;
  });

  describe('POST /api/jev/diagnose', () => {
    it('should reject missing required fields with 400', async () => {
      const response = await request(app)
        .post('/api/jev/diagnose')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('bad_request');
    });

    it('should reject oversized fields and malformed options with 400', async () => {
      const tooLong = await request(app)
        .post('/api/jev/diagnose')
        .send({ question: 'x'.repeat(100_000), studentAnswer: '1' });
      expect(tooLong.status).toBe(400);

      const tooManyOptions = await request(app)
        .post('/api/jev/diagnose')
        .send({
          question: 'Q',
          studentAnswer: 'A',
          options: Array.from({ length: 50 }, (_, i) => ({ id: String(i), text: 'opcja' })),
        });
      expect(tooManyOptions.status).toBe(400);

      const badOption = await request(app)
        .post('/api/jev/diagnose')
        .send({ question: 'Q', studentAnswer: 'A', options: ['nie-obiekt'] });
      expect(badOption.status).toBe(400);
    });

    it('should return diagnostic output with latency and classification', async () => {
      const response = await request(app)
        .post('/api/jev/diagnose')
        .send({
          taskId: 'task-1-1-1',
          question: 'Liczba (2^3)^4 jest równa:',
          studentAnswer: '2^7',
          correctAnswer: '2^12',
          ckeTrap: 'Nigdy nie dodawaj wykładników przy potęgowaniu potęgi (3+4=7)! Wykładniki mnożymy: 3*4=12.',
          options: [
            { id: 'A', text: '2^7' },
            { id: 'B', text: '2^12' }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.isCorrect).toBeDefined();
      expect(response.body.classification).toBeDefined();
      expect(response.body.diagnosticAdvice).toBeDefined();
      expect(response.body.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });
});

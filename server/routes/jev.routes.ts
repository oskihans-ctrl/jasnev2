import { Router, type NextFunction, type Request, type Response } from 'express';
import { failRoute } from '../middleware/errorHandler';
import type { RateLimiter } from '../rateLimit';
import { diagnoseWithJev, type JevDiagnosticInput } from '../services/jevDiagnostic.service';
import { config } from '../config';
import { badRequest, isRecord, optionalText } from '../validation';

const MAX_OPTIONS = 10;

function sanitizeOptions(value: unknown): JevDiagnosticInput['options'] {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw badRequest('Pole "options" musi być tablicą.', { field: 'options' });
  if (value.length > MAX_OPTIONS) {
    throw badRequest(`Zbyt wiele opcji (limit ${MAX_OPTIONS}).`, { field: 'options', length: value.length });
  }
  return value.map((option, index) => {
    if (!isRecord(option)) throw badRequest(`Pole "options[${index}]" musi być obiektem.`);
    return {
      id: optionalText(option.id, 16, `options[${index}].id`),
      text: optionalText(option.text, 500, `options[${index}].text`),
    };
  });
}

export const createJevRouter = (aiLimiter: RateLimiter): Router => {
  const router = Router();

  /**
   * POST /api/jev/diagnose
   * Ultra-fast System 1 AI classification of student mistakes using TypeSafe AI Jev 1.13.
   */
  router.post('/jev/diagnose', aiLimiter.middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId, question, studentAnswer, correctAnswer, explanation, ckeTrap, options } = req.body;

      if (!question || typeof question !== 'string' || !studentAnswer || typeof studentAnswer !== 'string') {
        return res.status(400).json({
          error: 'Brakujące wymagane pola: question oraz studentAnswer są wymagane.',
          code: 'bad_request'
        });
      }

      // Te same twarde limity co w sanitizeAiBody — inaczej ten endpoint byłby
      // furtką do wysyłania wielomegabajtowych promptów do płatnego modelu.
      const max = config.maxPromptChars;
      const input: JevDiagnosticInput = {
        taskId: optionalText(taskId, 64, 'taskId') || undefined,
        question: optionalText(question, max, 'question'),
        studentAnswer: optionalText(studentAnswer, max, 'studentAnswer'),
        correctAnswer: optionalText(correctAnswer, max, 'correctAnswer') || undefined,
        explanation: optionalText(explanation, max, 'explanation') || undefined,
        ckeTrap: optionalText(ckeTrap, 2000, 'ckeTrap') || undefined,
        options: sanitizeOptions(options),
      };

      const diagnostic = await diagnoseWithJev(input);
      return res.json(diagnostic);
    } catch (error) {
      return failRoute(res, next, error, 'Nie udało się przeprowadzić diagnostyki błędu.');
    }
  });

  return router;
};

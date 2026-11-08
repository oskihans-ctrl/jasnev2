import { resolveOpenRouterApiKey } from '../config';
import { logger } from '../logger';

export interface JevDiagnosticInput {
  taskId?: string;
  question: string;
  studentAnswer: string;
  correctAnswer?: string;
  explanation?: string;
  ckeTrap?: string;
  options?: Array<{ id: string; text: string }>;
}

export interface JevDiagnosticResult {
  isCorrect: boolean;
  classification: 'PRAWIDLOWA' | 'PULAPKA_CKE' | 'BLAD_RACHUNKOWY' | 'NIEZROZUMIENIE_POLECENIA' | 'NIEZNANY';
  confidence: number;
  diagnosticAdvice: string;
  latencyMs: number;
  provider: string;
}

export async function diagnoseWithJev(input: JevDiagnosticInput): Promise<JevDiagnosticResult> {
  const apiKey = resolveOpenRouterApiKey();
  const startTime = Date.now();

  if (!apiKey) {
    logger.warn('jev_diagnostic_skipped_no_key', { hint: 'OPENROUTER_API_KEY is not configured.' });
    return createFallbackDiagnostic(input, Date.now() - startTime);
  }

  const payload = {
    model: 'typesafe/jev-1.13',
    state: {
      task_id: input.taskId || 'unknown',
      question: input.question,
      student_answer: input.studentAnswer,
      correct_answer: input.correctAnswer,
      cke_trap: input.ckeTrap,
      options: input.options || []
    },
    questions: {
      is_correct: {
        type: 'choice',
        instructions: 'Determine if the student answer is mathematically equivalent to the correct answer.',
        criteria: {
          CORRECT: 'The student answer is correct.',
          INCORRECT: 'The student answer is incorrect.'
        }
      },
      error_type: {
        type: 'choice',
        instructions: 'If incorrect, classify the primary mistake type.',
        criteria: {
          PULAPKA_CKE: 'Student fell into a typical CKE exam trap or misapplied an algebraic rule.',
          BLAD_RACHUNKOWY: 'Student made an arithmetic calculation error or sign slip.',
          NIEZROZUMIENIE_POLECENIA: 'Student answered a different question or misread the premise.',
          BRAK_BLEDU: 'The answer is actually correct.'
        }
      }
    }
  };

  try {
    const response = await fetch('https://openrouter.ai/api/alpha/decisions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000) // Fast 4-second timeout for System 1
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      // Przycięte: odpowiedź providera może zawierać fragmenty promptu z odpowiedzią ucznia.
      logger.warn('jev_api_error', { status: response.status, body: errText.slice(0, 500) });
      return createFallbackDiagnostic(input, latencyMs);
    }

    const data = await response.json();
    const isCorrectChoice = data.answers?.is_correct?.choice;
    const errorTypeChoice = data.answers?.error_type?.choice;
    const confidence = data.answers?.error_type?.confidence ?? 0.85;

    const isCorrect = isCorrectChoice === 'CORRECT';
    let classification: JevDiagnosticResult['classification'] = 'NIEZNANY';

    if (isCorrect) {
      classification = 'PRAWIDLOWA';
    } else if (errorTypeChoice === 'PULAPKA_CKE') {
      classification = 'PULAPKA_CKE';
    } else if (errorTypeChoice === 'BLAD_RACHUNKOWY') {
      classification = 'BLAD_RACHUNKOWY';
    } else if (errorTypeChoice === 'NIEZROZUMIENIE_POLECENIA') {
      classification = 'NIEZROZUMIENIE_POLECENIA';
    }

    let diagnosticAdvice = input.explanation || 'Przeanalizuj ponownie treść zadania.';
    if (!isCorrect && input.ckeTrap) {
      diagnosticAdvice = input.ckeTrap;
    }

    return {
      isCorrect,
      classification,
      confidence,
      diagnosticAdvice,
      latencyMs,
      provider: 'typesafe/jev-1.13'
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    logger.warn('jev_call_failed', { error: error instanceof Error ? error.message : String(error) });
    return createFallbackDiagnostic(input, latencyMs);
  }
}

function createFallbackDiagnostic(input: JevDiagnosticInput, latencyMs: number): JevDiagnosticResult {
  const isMatch = input.correctAnswer
    ? input.studentAnswer.trim().toLowerCase() === input.correctAnswer.trim().toLowerCase()
    : false;

  return {
    isCorrect: isMatch,
    classification: isMatch ? 'PRAWIDLOWA' : 'PULAPKA_CKE',
    confidence: 0.7,
    diagnosticAdvice: !isMatch && input.ckeTrap ? input.ckeTrap : (input.explanation || 'Sprawdź rozwiązanie krok po kroku.'),
    latencyMs,
    provider: 'local_rule_engine'
  };
}

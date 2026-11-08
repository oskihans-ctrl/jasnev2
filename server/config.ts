/**
 * Konfiguracja serwera czytana wyłącznie ze zmiennych środowiskowych.
 *
 * Zasada: żaden klucz API nie może być wysyłany do klienta. Zmienne z prefiksem
 * `VITE_` są wstrzykiwane przez Vite do bundle'a przeglądarki, dlatego klucze AI
 * czytamy z nazw bez tego prefiksu. Fallback na `VITE_OPENROUTER_API_KEY`
 * istnieje tylko po to, aby nie zepsuć istniejących deploymentów — przy starcie
 * logowane jest ostrzeżenie z prośbą o zmianę nazwy.
 */

// dotenv musi zostać załadowany PRZED odczytem zmiennych — dlatego robimy to
// w tym module (a nie w server.ts), bo importy wykonują się przed ciałem pliku.
import dotenv from 'dotenv';
import firebaseAppletConfig from '../firebase-applet-config.json';

dotenv.config();

function readString(name: string, fallback = ''): string {
  const raw = process.env[name];
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function readInt(name: string, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(readString(name, ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function readList(name: string): string[] {
  return readString(name, '')
    .split(',')
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);
}

const nodeEnv = readString('NODE_ENV', 'development');

export const config = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: readInt('PORT', 3000, 1, 65535),

  /** Górny limit body JSON. Obrazy z tablicy przychodzą jako base64, stąd kilka MB. */
  jsonBodyLimit: readString('JSON_BODY_LIMIT', '8mb'),

  /** Maksymalny rozmiar pojedynczego obrazu (po zdekodowaniu base64), w bajtach. */
  maxImageBytes: readInt('MAX_IMAGE_BYTES', 4 * 1024 * 1024, 64 * 1024, 8 * 1024 * 1024),

  /** Maksymalna długość tekstu zadania/odpowiedzi ucznia przekazywanego do AI. */
  maxPromptChars: readInt('MAX_PROMPT_CHARS', 8000, 500, 60000),

  geminiApiKey: readString('GEMINI_API_KEY'),

  openRouterApiKey: readString('OPENROUTER_API_KEY'),
  /** @deprecated klucz z prefiksem VITE_ — trafia do bundle'a klienta, do usunięcia. */
  legacyOpenRouterApiKey: readString('VITE_OPENROUTER_API_KEY'),

  /**
   * Projekt Firebase, dla którego weryfikujemy ID tokeny (`aud` tokenu).
   * Kolejność: jawny FIREBASE_PROJECT_ID → wspólna z klientem zmienna Vite →
   * zmienna środowiska Google Cloud → projectId z firebase-applet-config.json.
   */
  firebaseProjectId: readString(
    'FIREBASE_PROJECT_ID',
    readString('VITE_FIREBASE_PROJECT_ID', readString('GOOGLE_CLOUD_PROJECT', firebaseAppletConfig.projectId ?? ''))
  ),

  /**
   * Lista dozwolonych Origin (rozdzielona przecinkami). Puste = tylko same-origin.
   * Na Vercelu domeny bieżącego deploymentu dopisywane są automatycznie.
   */
  allowedOrigins: [
    ...readList('ALLOWED_ORIGINS'),
    ...['VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL']
      .map(name => readString(name))
      .filter(host => host.length > 0)
      .map(host => `https://${host}`),
  ],

  rateLimits: {
    /** Ogólny limit na całą powierzchnię /api. */
    apiWindowMs: readInt('RATE_LIMIT_WINDOW_MS', 60_000, 1_000, 3_600_000),
    apiMax: readInt('RATE_LIMIT_API_MAX', 120, 1, 100_000),
    /** Osobny, ostrzejszy limit na endpointy, które wołają płatne modele AI. */
    aiMax: readInt('RATE_LIMIT_AI_MAX', 20, 1, 10_000),
    /** Limit AI dla gościa (bez zweryfikowanego tokenu Firebase), liczony per IP. */
    aiGuestMax: readInt('RATE_LIMIT_AI_GUEST_MAX', 8, 0, 10_000),
    /** Dobowy sufit wywołań AI — chroni koszty przed powolnym, ciągłym nadużyciem. */
    aiDailyMax: readInt('RATE_LIMIT_AI_DAILY_MAX', 300, 1, 100_000),
    aiGuestDailyMax: readInt('RATE_LIMIT_AI_GUEST_DAILY_MAX', 40, 0, 100_000),
  },
} as const;

export type AiModelConfig = {
  hint: string;
  grade: string;
  task: string;
  openRouterText: string;
  openRouterVision: string;
  geminiCandidates: string[];
};

/**
 * Modele można nadpisać z env bez zmiany kodu — dzięki temu awaria lub wycofanie
 * modelu przez dostawcę nie wymaga deployu nowej wersji aplikacji.
 */
export function getAiModelConfig(): AiModelConfig {
  const hint = readString('AI_HINT_MODEL', 'gemini-3.8-flash');
  const grade = readString('AI_GRADE_MODEL', 'gemini-2.5-flash');
  const task = readString('AI_TASK_MODEL', 'gemini-3.8-flash');

  const geminiCandidates = readList('AI_GEMINI_FALLBACK_MODELS');
  const defaultGeminiChain = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  return {
    hint,
    grade,
    task,
    openRouterText: readString('OPENROUTER_TEXT_MODEL', readString('OPENROUTER_MODEL', 'qwen/qwen3.7-flash')),
    openRouterVision: readString('OPENROUTER_VISION_MODEL', readString('OPENROUTER_MODEL', 'qwen/qwen3.7-flash')),
    geminiCandidates: Array.from(new Set([hint, grade, task, ...(geminiCandidates.length > 0 ? geminiCandidates : defaultGeminiChain)])),
  };
}

/** Klucz OpenRouter do wywołań serwerowych (nowa nazwa ma priorytet). */
export function resolveOpenRouterApiKey(): string {
  return config.openRouterApiKey || config.legacyOpenRouterApiKey;
}

export function warnAboutLegacySecrets(): void {
  if (!config.openRouterApiKey && config.legacyOpenRouterApiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: 'warn',
        msg: 'Używasz VITE_OPENROUTER_API_KEY po stronie serwera. Zmień nazwę na OPENROUTER_API_KEY i zrotuj klucz — wersja z prefiksem VITE_ jest wstrzykiwana do bundle\'a klienta.',
      })
    );
  }
}

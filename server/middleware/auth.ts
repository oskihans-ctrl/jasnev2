import type { NextFunction, Request, Response } from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from '../config';
import { logger } from '../logger';

/**
 * Identyfikacja użytkownika na podstawie Firebase ID tokenu (`Authorization: Bearer`).
 *
 * Tryb gościa jest częścią produktu (Time-to-Value bez logowania), więc brak tokenu
 * nie blokuje żądania — gość dostaje jednak osobne, ostrzejsze limity per IP.
 * Token, którego nie da się zweryfikować, traktujemy tak samo jak jego brak:
 * gość to najniższy poziom uprawnień, więc nic nie zyskuje się podrabiając token.
 *
 * `uid` w body żądania NIGDY nie jest źródłem tożsamości — można go dowolnie podmienić.
 */

export type VerifyIdToken = (token: string) => Promise<{ uid: string }>;

let defaultVerifier: VerifyIdToken | null = null;

function getDefaultVerifier(): VerifyIdToken | null {
  if (defaultVerifier) return defaultVerifier;
  if (!config.firebaseProjectId) return null;
  // Weryfikacja ID tokenu wymaga tylko projectId (klucze publiczne Google),
  // bez Service Account — działa także w funkcji serverless Vercela.
  const app = getApps().find(existing => existing.name === 'bff-auth')
    ?? initializeApp({ projectId: config.firebaseProjectId }, 'bff-auth');
  const auth = getAuth(app);
  defaultVerifier = token => auth.verifyIdToken(token);
  return defaultVerifier;
}

/** Zweryfikowany uid z bieżącego żądania albo undefined dla gościa. */
export function getVerifiedUid(res: Response): string | undefined {
  const uid = res.locals?.uid;
  return typeof uid === 'string' && uid.length > 0 ? uid : undefined;
}

function readBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (typeof header !== 'string') return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) return null;
  // ID tokeny Firebase mają ~1 kB; odrzucamy śmieci, zanim trafią do weryfikacji.
  return match[1].length <= 4096 ? match[1] : null;
}

export function createIdentifyUser(verify?: VerifyIdToken) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = readBearerToken(req);
    if (!token) {
      next();
      return;
    }

    const verifier = verify ?? getDefaultVerifier();
    if (!verifier) {
      logger.warn('auth_verifier_unavailable', { hint: 'Ustaw FIREBASE_PROJECT_ID, aby weryfikować ID tokeny.' });
      next();
      return;
    }

    try {
      const decoded = await verifier(token);
      res.locals.uid = decoded.uid;
    } catch (error) {
      logger.warn('auth_token_rejected', {
        path: req.path,
        error: error instanceof Error ? error.message.slice(0, 200) : String(error),
      });
    }
    next();
  };
}

export const identifyUser = createIdentifyUser();

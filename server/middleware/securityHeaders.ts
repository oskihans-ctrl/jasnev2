import type { NextFunction, Request, Response } from 'express';

/**
 * Nagłówki bezpieczeństwa dla odpowiedzi Expressa (API i SPA poza Vercelem).
 * Na Vercelu pliki statyczne serwuje CDN — tam te same nagłówki ustawia vercel.json.
 * Trzymaj obie listy zgodne.
 *
 * Świadomie bez pełnego CSP dla skryptów: Firebase Auth (popup Google), KaTeX
 * i style inline wymagają dopracowanej listy źródeł — tu blokujemy tylko
 * osadzanie w ramkach (clickjacking). Bez COOP, bo signInWithPopup go nie znosi.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
  next();
};

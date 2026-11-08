import { auth } from '../firebase';

/**
 * Nagłówki dla żądań do BFF (/api/*). Zalogowany użytkownik wysyła Firebase ID token,
 * dzięki czemu serwer liczy limity AI na jego zweryfikowanym uid (wyższe niż gościa).
 * Gość (lub błąd odświeżenia tokenu) wysyła żądanie bez tokenu — dalej działa,
 * tylko w puli limitów gościa.
 */
export async function apiHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token = await auth.currentUser?.getIdToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.warn('[apiClient] Nie udało się pobrać ID tokenu, żądanie jako gość:', error);
  }
  return headers;
}

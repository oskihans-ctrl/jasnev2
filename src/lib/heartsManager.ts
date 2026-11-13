import { UserState } from '../types';
import { auth, db } from '../firebase';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';

export const MAX_HEARTS = 5;
export const REGEN_INTERVAL_MS = 30 * 60 * 1000; // 30 minut na 1 serce
export const HEARTS_REFILL_COIN_COST = 150; // 150 monet za pełne odnowienie
export const DAILY_FREE_AI_VISION_LIMIT = 3; // 3 darmowe skany tablicy AI dziennie dla darmowych kont
export const AI_VISION_EXTRA_SCAN_COIN_COST = 30; // 30 monet za dodatkowy skan tablicy AI po wyczerpaniu limitu 3 darmowych
export const PRO_WELCOME_COINS_GRANT = 300; // 300 monet jednorazowo przy aktywacji/odnowieniu PRO
export const PRO_DAILY_DROP_COINS = 30; // 30 monet dziennie w ramach Złotego Zrzutu PRO po min. 1 lekcji

export interface SyncedHeartsResult {
  userState: UserState;
  hearts: number;
  maxHearts: number;
  timeToNextRegenMs: number;
  formattedTime: string;
  isPro: boolean;
}

export interface DeductHeartResult {
  updatedState: UserState;
  wasDeducted: boolean;
  isOutOfHearts: boolean;
}

export interface RefillHeartsResult {
  success: boolean;
  updatedState: UserState;
  error?: string;
}

/**
 * Formatuje milisekundy do formatu MM:SS
 */
export function formatRegenTimer(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Pasywna regeneracja serc w oparciu o czas (Date.now())
 */
export function getSyncedHearts(userState?: UserState | null): SyncedHeartsResult {
  if (!userState) {
    return {
      userState: {} as UserState,
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      timeToNextRegenMs: 0,
      formattedTime: '00:00',
      isPro: false
    };
  }

  const isPro = Boolean(userState.isPro);
  const maxHearts = userState.maxHearts || MAX_HEARTS;

  // Użytkownicy PRO mają zawsze nielimitowane serca
  if (isPro) {
    return {
      userState: {
        ...userState,
        hearts: maxHearts,
        maxHearts,
        isPro: true
      },
      hearts: maxHearts,
      maxHearts,
      timeToNextRegenMs: 0,
      formattedTime: '∞',
      isPro: true
    };
  }

  const currentHearts = typeof userState.hearts === 'number' ? userState.hearts : maxHearts;
  const lastRegenTimestamp = typeof userState.lastHeartRegenTimestamp === 'number' && userState.lastHeartRegenTimestamp > 0
    ? userState.lastHeartRegenTimestamp
    : Date.now();

  // Jeśli gracz ma już pełne serca, timer stoi
  if (currentHearts >= maxHearts) {
    return {
      userState: {
        ...userState,
        hearts: maxHearts,
        maxHearts
      },
      hearts: maxHearts,
      maxHearts,
      timeToNextRegenMs: 0,
      formattedTime: 'Pełne',
      isPro: false
    };
  }

  // Obliczenie ile serc zregenerowało się od ostatniego timestampu
  const now = Date.now();
  const elapsedMs = Math.max(0, now - lastRegenTimestamp);
  const heartsToAdd = Math.floor(elapsedMs / REGEN_INTERVAL_MS);

  if (heartsToAdd > 0) {
    const newHearts = Math.min(maxHearts, currentHearts + heartsToAdd);
    const newTimestamp = (newHearts >= maxHearts)
      ? now
      : lastRegenTimestamp + (heartsToAdd * REGEN_INTERVAL_MS);

    const updatedState: UserState = {
      ...userState,
      hearts: newHearts,
      maxHearts,
      lastHeartRegenTimestamp: newTimestamp
    };

    const remainingToNextHeartMs = (newHearts >= maxHearts)
      ? 0
      : Math.max(0, REGEN_INTERVAL_MS - (now - newTimestamp));

    return {
      userState: updatedState,
      hearts: newHearts,
      maxHearts,
      timeToNextRegenMs: remainingToNextHeartMs,
      formattedTime: formatRegenTimer(remainingToNextHeartMs),
      isPro: false
    };
  }

  // Żadne serce jeszcze się nie zregenerowało, oblicz czas do kolejnego
  const timeToNextRegenMs = Math.max(0, REGEN_INTERVAL_MS - elapsedMs);

  return {
    userState,
    hearts: currentHearts,
    maxHearts,
    timeToNextRegenMs,
    formattedTime: formatRegenTimer(timeToNextRegenMs),
    isPro: false
  };
}

/**
 * Odbiera 1 serce przy błędnej odpowiedzi (z uwzględnieniem ochrony PRO)
 */
export function deductHeart(userState: UserState): DeductHeartResult {
  const synced = getSyncedHearts(userState);

  // Użytkownicy PRO nie tracą serc!
  if (synced.isPro) {
    return {
      updatedState: synced.userState,
      wasDeducted: false,
      isOutOfHearts: false
    };
  }

  // Jeśli gracz nie ma już serc
  if (synced.hearts <= 0) {
    return {
      updatedState: synced.userState,
      wasDeducted: false,
      isOutOfHearts: true
    };
  }

  const newHearts = Math.max(0, synced.hearts - 1);
  const now = Date.now();

  // Jeśli schodzimy z pełnych serc, uruchamiamy zegar regeneracji
  const lastHeartRegenTimestamp = (synced.hearts >= synced.maxHearts)
    ? now
    : (synced.userState.lastHeartRegenTimestamp || now);

  const updatedState: UserState = {
    ...synced.userState,
    hearts: newHearts,
    lastHeartRegenTimestamp
  };

  return {
    updatedState,
    wasDeducted: true,
    isOutOfHearts: newHearts <= 0
  };
}

/**
 * Uzupełnia serca do pełna za monety w grze
 */
export function refillHeartsWithCoins(
  userState: UserState, 
  cost: number = HEARTS_REFILL_COIN_COST
): RefillHeartsResult {
  const synced = getSyncedHearts(userState);
  const coins = synced.userState.coins || 0;

  if (coins < cost) {
    return {
      success: false,
      updatedState: synced.userState,
      error: `Brakuje Ci ${cost - coins} monet do uzupełnienia serc!`
    };
  }

  const updatedState: UserState = {
    ...synced.userState,
    coins: coins - cost,
    hearts: synced.maxHearts,
    lastHeartRegenTimestamp: Date.now()
  };

  return {
    success: true,
    updatedState
  };
}

/**
 * Aktywuje pakiet PRO (nielimitowane serca, brak limitu AI)
 */
export function activatePro(userState: UserState): UserState {
  return {
    ...userState,
    isPro: true,
    coins: (userState.coins || 0) + PRO_WELCOME_COINS_GRANT,
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    lastHeartRegenTimestamp: Date.now()
  };
}

export interface ProActivationResult {
  ok: boolean;
  error?: string;
}

/**
 * Aktywacja PRO kodem jednorazowym.
 *
 * Reguły Firestore nie pozwalają klientowi samodzielnie ustawić `isPro = true`.
 * Jedyne legalne przejście to atomowy batch:
 *   1) users/{uid}: { isPro: true, proCode: '<kod>' }
 *   2) system/proCodes/items/{kod}: { usedBy: <uid>, usedAt: ... }
 * Dzięki temu kod nie może być użyty dwa razy, a pole `isPro` nie da się
 * włączyć z konsoli przeglądarki.
 */
export async function activateProWithCode(code: string): Promise<ProActivationResult> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return { ok: false, error: 'Zaloguj się, aby aktywować PRO. Kod przypisujemy do Twojego konta.' };
  }

  const normalized = String(code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,64}$/.test(normalized)) {
    return { ok: false, error: 'Nieprawidłowy format kodu. Kod ma min. 6 znaków (litery, cyfry, myślnik).' };
  }

  try {
    const batch = writeBatch(db);
    batch.update(doc(db, 'users', uid), {
      isPro: true,
      proCode: normalized,
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      lastHeartRegenTimestamp: Date.now()
    });
    batch.update(doc(db, 'system', 'proCodes', 'items', normalized), {
      usedBy: uid,
      usedAt: serverTimestamp()
    });
    await batch.commit();
    return { ok: true };
  } catch (err: any) {
    const code = String(err?.code || '');
    if (code.includes('permission-denied')) {
      return {
        ok: false,
        error: 'Kod jest nieprawidłowy lub został już wykorzystany. Sprawdź kod i spróbuj ponownie.'
      };
    }
    if (code.includes('unavailable') || code.includes('network')) {
      return { ok: false, error: 'Brak połączenia z internetem. Spróbuj ponownie za chwilę.' };
    }
    console.warn('[heartsManager] PRO activation failed:', err);
    return { ok: false, error: 'Nie udało się aktywować PRO. Spróbuj ponownie.' };
  }
}

/**
 * Sprawdza dzienny limit użycia oceny AI Vision dla tablicy odręcznej
 */
export function canUseAiVision(userState: UserState): { 
  allowed: boolean; 
  remainingDaily: number; 
  isPro: boolean; 
  canBuyWithCoins: boolean; 
  coinCost: number; 
} {
  if (userState.isPro) {
    return { allowed: true, remainingDaily: Infinity, isPro: true, canBuyWithCoins: false, coinCost: 0 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = userState.lastVisionDate || '';
  const currentDailyCount = (lastDate === todayStr) ? (userState.aiVisionDailyCount || 0) : 0;
  const remaining = Math.max(0, DAILY_FREE_AI_VISION_LIMIT - currentDailyCount);
  const coins = userState.coins || 0;

  return {
    allowed: remaining > 0,
    remainingDaily: remaining,
    isPro: false,
    canBuyWithCoins: remaining === 0 && coins >= AI_VISION_EXTRA_SCAN_COIN_COST,
    coinCost: remaining === 0 ? AI_VISION_EXTRA_SCAN_COIN_COST : 0
  };
}

/**
 * Dokupuje dodatkowy skan AI Vision za monety po wyczerpaniu limitu darmowych
 */
export function purchaseExtraAiVisionScan(userState: UserState): { success: boolean; updatedState: UserState } {
  if (userState.isPro) return { success: true, updatedState: userState };
  const coins = userState.coins || 0;
  if (coins < AI_VISION_EXTRA_SCAN_COIN_COST) {
    return { success: false, updatedState: userState };
  }
  return {
    success: true,
    updatedState: {
      ...userState,
      coins: coins - AI_VISION_EXTRA_SCAN_COIN_COST
    }
  };
}

/**
 * Zapisuje użycie oceny tablicy przez AI
 */
export function recordAiVisionUse(userState: UserState): UserState {
  if (userState.isPro) return userState;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = userState.lastVisionDate || '';
  const currentDailyCount = (lastDate === todayStr) ? (userState.aiVisionDailyCount || 0) : 0;

  return {
    ...userState,
    lastVisionDate: todayStr,
    aiVisionDailyCount: currentDailyCount + 1
  };
}

/**
 * Pierwsza lekcja nowego ucznia jest „na próbę”: dopóki nie ukończył żadnej lekcji,
 * błędy nie zabierają serc. Chroni to pierwsze minuty w aplikacji (Time-to-Value)
 * przed blokadą po 5 pomyłkach; stałe ekonomii serc pozostają bez zmian.
 */
export function isFirstLessonGrace(user?: Pick<UserState, 'completed_lessons' | 'completedLessonsPolish' | 'completedLessonsEnglish'> | null): boolean {
  if (!user) return false;
  return !(user.completed_lessons?.length || user.completedLessonsPolish?.length || user.completedLessonsEnglish?.length);
}

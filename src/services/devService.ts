import { UserState } from '../types';
import { ALL_MATH_TASKS } from '../data/math/allMathTasks';
import { ALL_ENGLISH_TASKS } from '../data/english/allEnglishTasks';
import { ALL_POLISH_TASKS } from '../data/polish';

export const DEV_STORAGE_KEY = 'jasne_dev_mode_active';

export function getAllDevMathLessons(): string[] {
  const ids: string[] = [];
  for (let topic = 1; topic <= 15; topic++) {
    for (let lesson = 1; lesson <= 5; lesson++) {
      ids.push(`math-lesson-${topic}-${lesson}`);
      ids.push(`${topic}.${lesson}`);
      ids.push(`lesson-${topic}-${lesson}`);
    }
  }
  return ids;
}

export function getAllDevPolishLessons(): string[] {
  const ids: string[] = [];
  for (let topic = 1; topic <= 15; topic++) {
    for (let lesson = 1; lesson <= 5; lesson++) {
      ids.push(`pol-lesson-${topic}-${lesson}`);
      ids.push(`pol-${topic}-${lesson}`);
      ids.push(`lesson-${topic}-${lesson}`);
    }
  }
  return ids;
}

export function getAllDevEnglishLessons(): string[] {
  const ids: string[] = [];
  for (let topic = 1; topic <= 15; topic++) {
    for (let lesson = 1; lesson <= 5; lesson++) {
      ids.push(`eng-lesson-${topic}-${lesson}`);
      ids.push(`eng-${topic}-${lesson}`);
      ids.push(`lesson-${topic}-${lesson}`);
    }
  }
  return ids;
}

export function getAllDevMathTaskIds(): string[] {
  return ALL_MATH_TASKS.map(t => t.id);
}

export function getAllDevPolishTaskIds(): string[] {
  return ALL_POLISH_TASKS.map(t => t.id);
}

export function getAllDevEnglishTaskIds(): string[] {
  return ALL_ENGLISH_TASKS.map(t => t.id);
}

export function getAllDevTaskIds(): string[] {
  return Array.from(new Set([
    ...getAllDevMathTaskIds(),
    ...getAllDevPolishTaskIds(),
    ...getAllDevEnglishTaskIds()
  ]));
}

/**
 * Czy ten build w ogóle zawiera narzędzia deweloperskie. Produkcja: zawsze false,
 * niezależnie od localStorage i parametrów URL — inaczej każdy użytkownik mógłby
 * włączyć sobie PRO, serca i wszystkie lekcje (`?dev=1`). Build testowy (np. Vercel
 * Preview na telefon) włączasz zmienną `VITE_ENABLE_DEV_TOOLS=true`.
 */
export function isDevBuild(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';
}

export function isDevModeActive(): boolean {
  if (!isDevBuild()) return false;
  try {
    return localStorage.getItem(DEV_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Czy wolno automatycznie nadać pełny dostęp deweloperski przy starcie aplikacji.
 * Na produkcji nowy użytkownik MUSI startować z prawdziwą ekonomią (5 serc, 0 monet,
 * zablokowane lekcje) – inaczej PRO, serca i doładowania BLIK nie mają żadnej wartości.
 * Dostęp dev istnieje wyłącznie w buildzie deweloperskim (patrz isDevBuild()).
 * ?dev=0 wyłącza go zawsze — podgląd doświadczenia nowego użytkownika.
 */
export function isDevAccessAllowed(): boolean {
  if (!isDevBuild()) return false;
  let devParam: string | null = null;
  try {
    devParam = new URLSearchParams(window.location.search).get('dev');
  } catch {}
  return devParam !== '0';
}

export function applyFullDeveloperAccess(currentState: UserState): UserState {
  const mathLessons = getAllDevMathLessons();
  const polishLessons = getAllDevPolishLessons();
  const englishLessons = getAllDevEnglishLessons();
  const mathTasks = getAllDevMathTaskIds();
  const polishTasks = getAllDevPolishTaskIds();
  const englishTasks = getAllDevEnglishTaskIds();
  const allTasks = [...mathTasks, ...polishTasks, ...englishTasks];

  const devState: UserState = {
    ...currentState,
    isDev: true,
    isPro: true,
    coins: 99999,
    gems: 99999,
    masteryTokens: 99999,
    xp: 150000,
    level: 99,
    hearts: 999,
    maxHearts: 999,
    streakDays: Math.max(currentState.streakDays || 0, 45),
    campusRust: 0,
    arenaRating: 1650,
    arenaWins: 25,
    maturaAttempts: 5,
    maturaBestScore: 98,
    hasCompletedOnboarding: true,
    onboardingPreferences: {
      targetExam: 'matura_2025',
      targetScore: '100',
      dailyMinutes: 15,
    },
    perks: {
      streakFreezes: 99,
      arenaShields: 99,
      xpBoostPercent: 50,
      coinBoostPercent: 50,
      arenaTokenBonusPercent: 50,
      temporaryXpBoostCharges: 99,
    },
    claimedAchievements: {
      first_step: 1,
      powers_master: 2,
      streak_3_days: 1,
      flawless_exam: 1,
      tasks_master: 5,
      arena_warrior: 4,
      arena_rating: 4,
      matura_specialist: 3,
      streak_keeper: 4,
      level_ascent: 4,
    },
    completed_lessons: Array.from(new Set([...(currentState.completed_lessons || []), ...mathLessons])),
    completedLessonsPolish: Array.from(new Set([...(currentState.completedLessonsPolish || []), ...polishLessons])),
    completedLessonsEnglish: Array.from(new Set([...(currentState.completedLessonsEnglish || []), ...englishLessons])),
    completedTasksPolish: polishTasks,
    completedTasksEnglish: englishTasks,
    aiVisionDailyCount: 0,
  };

  try {
    localStorage.setItem(DEV_STORAGE_KEY, 'true');
    localStorage.setItem('matura_quest_cached_user', JSON.stringify(devState));
    localStorage.setItem('matura_quest_guest_user', JSON.stringify(devState));
    localStorage.setItem('matura_quest_completed_tasks', JSON.stringify(allTasks));
    localStorage.setItem('jasne_completed_math_tasks', JSON.stringify(mathTasks));
    localStorage.setItem('jasne_completed_english_tasks', JSON.stringify(englishTasks));
    localStorage.setItem('jasne_completed_lessons', JSON.stringify(polishLessons));
    localStorage.setItem('jasne_completed_math_lessons', JSON.stringify(mathLessons));

    // Prefill Skarbiec Argumentów (Argument Vault) for 100% unlocked status
    const devVault = {
      unlockedBlocks: [
        {
          id: 'block-lalka-wokulski-idealizm',
          bookId: 'lalka',
          bookTitle: 'Lalka (B. Prus)',
          character: 'Stanisław Wokulski',
          theme: 'Idealizm i marzenia',
          claim: 'Starcie idealizmu pozytywistycznego z romantycznym prowadzi do wewnętrznego rozdarcia jednostki.',
          evidence: 'Wokulski łączy naukowe ambicje i wiarę w pracę organiczną z destrukcyjną, romantyczną miłością do Izabeli Łęckiej.',
          contextType: 'LITERARY',
          contextDescription: 'Pozytywistyczna koncepcja scjentyzmu kontra romantyczny kult nieszczęśliwej miłości.',
          linkToThesis: 'Bohater jest postacią tragiczną, zawieszoną między dwiema epokami.',
          ckeSafetyRating: '100%_SAFE',
          unlockedAt: Date.now()
        },
        {
          id: 'block-dziady-konrad-bunt',
          bookId: 'dziady-cz-3',
          bookTitle: 'Dziady cz. III (A. Mickiewicz)',
          character: 'Konrad',
          theme: 'Bunt przeciw Bogu',
          claim: 'Prometejski bunt w obronie narodu może prowadzić do pychy i graniczyć z bluźnierstwem.',
          evidence: 'W Wielkiej Improwizacji Konrad żąda od Boga rządu dusz, stawiając swoje cierpienie ponad boską mądrość.',
          contextType: 'PHILOSOPHICAL',
          contextDescription: 'Mit prometejski oraz koncepcja mesjanizmu narodowego.',
          linkToThesis: 'Miłość do ojczyzny popycha Konrada do skrajnej pychy, z której ratuje go dopiero pokorna modlitwa ks. Piotra.',
          ckeSafetyRating: '100%_SAFE',
          unlockedAt: Date.now()
        },
        {
          id: 'block-wesele-gospodarz-chochol',
          bookId: 'wesele',
          bookTitle: 'Wesele (S. Wyspiański)',
          character: 'Gospodarz i Jasiek',
          theme: 'Uśpienie i niegotowość narodu',
          claim: 'Wewnętrzne podziały i mitomania uniemożliwiają narodowi podjęcie wspólnego czynu zbrojnego.',
          evidence: 'Gospodarz oddaje Złoty Róg nieodpowiedzialnemu Jaśkowi, a uczestnicy wesela zastygają w hipnotycznym chocholim tańcu.',
          contextType: 'HISTORICAL',
          contextDescription: 'Krytyka mitu o braterstwie chłopów i inteligencji (chłopomania) na przełomie XIX i XX wieku.',
          linkToThesis: 'Polacy na przełomie wieków nie dojrzeli do niepodległości z powodu braku prawdziwego przywództwa.',
          ckeSafetyRating: '100%_SAFE',
          unlockedAt: Date.now()
        },
        {
          id: 'block-zbrodnia-raskolnikow-moralnosc',
          bookId: 'zbrodnia-i-kara',
          bookTitle: 'Zbrodnia i kara (F. Dostojewski)',
          character: 'Rodion Raskolnikow',
          theme: 'Wina i odkupienie',
          claim: 'Uznanie istnienia ludzi nadzwyczajnych stojących ponad prawem moralnym prowadzi do katastrofy psychicznej i etycznej.',
          evidence: 'Raskolnikow morduje lichwiarkę w imię teorii o Napoleonach, lecz nie wytrzymuje presji sumienia i doznaje moralnego odrodzenia na Syberii dzięki Sonii.',
          contextType: 'PHILOSOPHICAL',
          contextDescription: 'Krytyka utylitaryzmu, nihilizmu i teorii nadczłowieka przed Nietzschem.',
          linkToThesis: 'Jedyną drogą do oczyszczenia jest przyznanie się do winy i przyjęcie chrześcijańskiej pokory.',
          ckeSafetyRating: '100%_SAFE',
          unlockedAt: Date.now()
        }
      ],
      customBlocks: []
    };
    localStorage.setItem('jasne_argument_vault_v1', JSON.stringify(devVault));
  } catch (e) {
    console.warn('[DevService] Error persisting dev state:', e);
  }

  return devState;
}

export function disableDeveloperAccess(currentState: UserState): UserState {
  const regularState: UserState = {
    ...currentState,
    isDev: false,
    isPro: false,
  };

  try {
    localStorage.removeItem(DEV_STORAGE_KEY);
    localStorage.setItem('matura_quest_cached_user', JSON.stringify(regularState));
    localStorage.setItem('matura_quest_guest_user', JSON.stringify(regularState));
  } catch (e) {
    console.warn('[DevService] Error persisting regular state:', e);
  }

  return regularState;
}

export function addDevResources(currentState: UserState, amount: { coins?: number; gems?: number; xp?: number; streak?: number }): UserState {
  const updated: UserState = {
    ...currentState,
    coins: (currentState.coins || 0) + (amount.coins || 0),
    gems: (currentState.gems || 0) + (amount.gems || 0),
    xp: (currentState.xp || 0) + (amount.xp || 0),
    streakDays: (currentState.streakDays || 0) + (amount.streak || 0),
    level: Math.max(currentState.level || 1, Math.floor(((currentState.xp || 0) + (amount.xp || 0)) / 1000) + 1),
    isDev: true,
    isPro: true,
    hearts: 999,
    maxHearts: 999,
  };

  try {
    localStorage.setItem(DEV_STORAGE_KEY, 'true');
    localStorage.setItem('matura_quest_cached_user', JSON.stringify(updated));
    localStorage.setItem('matura_quest_guest_user', JSON.stringify(updated));
  } catch (e) {
    console.warn('[DevService] Error persisting resources:', e);
  }

  return updated;
}

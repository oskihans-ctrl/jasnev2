import { PolishLesson } from '../../types/lessonTypes';
import { PolishTask } from '../../types/maturaTypes';
import { Task800Item } from './types';
import { PART1_JEZYK_W_UZYCIU_TASKS } from './part1_jezyk_w_uzyciu';
import { PART2_TEST_HISTORYCZNY_TASKS } from './part2_test_historyczny';
import { PART3_WYPRACOWANIE_TASKS } from './part3_wypracowanie';

/**
 * Pełna baza 800+ zadań z języka polskiego CKE Formuła 2023:
 * - 280 zadań z Części I (Język polski w użyciu)
 * - 570 zadań z Części II (Test historycznoliteracki - pokrycie 11 epok i 30 jednostek, w tym lektury PP z podstawy 2024)
 * - 60 zadań z Części III (Warsztat wypracowania)
 */
export const ALL_POLISH_TASKS_800: Task800Item[] = [
  ...PART1_JEZYK_W_UZYCIU_TASKS,
  ...PART2_TEST_HISTORYCZNY_TASKS,
  ...PART3_WYPRACOWANIE_TASKS,
];

// Tasowanie tablicy metodą Fishera-Yatesa
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

import { shuffleTaskOptions as universalShuffleTaskOptions } from '../../utils/taskShuffler';

/**
 * Losowo tasuje opcje w zadaniach jednokrotnego wyboru (single_choice),
 * gwarantując równomierny rozkład poprawnej odpowiedzi na pozycjach A, B, C i D (0, 1, 2, 3),
 * eliminując schemat stałej poprawnej odpowiedzi nr 2 (B).
 */
export function shuffleTaskOptions(task: PolishTask): PolishTask {
  return universalShuffleTaskOptions(task);
}

// Sprawdzenie, czy zadanie jest zamknięte
function isClosedTask(task: Task800Item | PolishTask): boolean {
  return task.taskType === 'single_choice' || task.taskType === 'true_false' || task.taskType === 'matching';
}

/**
 * Zwraca proporcje liczby zadań do czasu trwania lekcji w minutach:
 * Zgodnie ze standardem mikro-nauki i praktyki CKE:
 * - Domyślna sesja bojowa CKE (45 min): 7 zbalansowanych zadań (4 zamknięte + 3 otwarte)
 * - 60 min -> 9 zadań (5 zamkniętych + 4 otwarte)
 * - 45-50 min -> 7 zadań (4 zamknięte + 3 otwarte)
 * - 30-35 min -> 6 zadań (4 zamknięte + 2 otwarte)
 * - 20-25 min -> 5 zadań (3 zamknięte + 2 otwarte)
 */
export function getTargetCounts(durationMinutes = 45): { total: number; closed: number; open: number } {
  if (durationMinutes >= 60) {
    return { total: 9, closed: 5, open: 4 };
  }
  if (durationMinutes >= 45) {
    return { total: 7, closed: 4, open: 3 };
  }
  if (durationMinutes >= 30) {
    return { total: 6, closed: 4, open: 2 };
  }
  if (durationMinutes >= 20) {
    return { total: 5, closed: 3, open: 2 };
  }
  return { total: 7, closed: 4, open: 3 };
}

/**
 * Normalizuje nazwę epoki z lekcji do kanonicznej nazwy w bazie zadań Part 2
 */
export function resolveEpochForLesson(lesson: PolishLesson): string | null {
  const epoch = (lesson.epoch || '').toLowerCase();
  const title = (lesson.title || '').toLowerCase();
  const combined = `${epoch} ${title}`;

  if (combined.includes('antyk') || combined.includes('bibli') || combined.includes('starożytn')) return 'Starożytność i Biblia';
  if (combined.includes('średniowiecz')) return 'Średniowiecze';
  if (combined.includes('renesans') || combined.includes('odrodzen')) return 'Renesans';
  if (combined.includes('barok')) return 'Barok';
  if (combined.includes('oświecen')) return 'Oświecenie';
  if (combined.includes('romantyzm')) return 'Romantyzm';
  if (combined.includes('pozytywiz')) return 'Pozytywizm';
  if (combined.includes('młoda polska')) return 'Młoda Polska';
  if (combined.includes('dwudziestolec') || combined.includes('międzywojenn')) return 'Dwudziestolecie międzywojenne';
  if (combined.includes('wojen') || combined.includes('okupac') || combined.includes('lagr') || combined.includes('gułag')) return 'Wojna i okupacja';
  if (combined.includes('współczesn')) return 'Współczesność';
  return null;
}

/**
 * Rozpoznaje dedykowaną lekturę z metadanych lub tytułu/podtytułu lekcji
 */
export function resolveLekturaFromLesson(lesson: PolishLesson): string | null {
  if (lesson.lektura) return lesson.lektura;
  const combined = `${lesson.title} ${lesson.subtitle || ''}`.toLowerCase();

  if (combined.includes('lalka') || combined.includes('wokulski') || combined.includes('rzecki')) return 'Lalka';
  if (combined.includes('dziady cz. iii') || combined.includes('wielka improwizacja') || combined.includes('ksiądz piotr') || combined.includes('konrad')) return 'Dziady cz. III';
  if (combined.includes('dziady cz. ii') || combined.includes('dziady cz. iv') || combined.includes('ballad')) return 'Ballady i Dziady';
  if (combined.includes('kordian')) return 'Kordian';
  if (combined.includes('pan tadeusz') || combined.includes('soplicow') || combined.includes('robak')) return 'Pan Tadeusz';
  if (combined.includes('wesele') || combined.includes('chochol') || combined.includes('stańczyk')) return 'Wesele';
  if (combined.includes('przedwiośnie') || combined.includes('baryk') || combined.includes('szklan')) return 'Przedwiośnie';
  if (combined.includes('antygon') || combined.includes('kreon') || combined.includes('hajmon')) return 'Antygona';
  if (combined.includes('zbrodnia i kara') || combined.includes('raskolnikow') || combined.includes('soni')) return 'Zbrodnia i kara';
  if (combined.includes('inny świat') || combined.includes('grudziński') || combined.includes('kostylew') || combined.includes('złagrowan')) return 'Inny świat';
  if (combined.includes('borowski') || combined.includes('zlagrowan') || combined.includes('proszę państwa do gazu')) return 'Borowski';
  if (combined.includes('zdążyć przed panem bogiem') || combined.includes('krall') || combined.includes('edelman')) return 'Zdążyć przed Panem Bogiem';
  if (combined.includes('makbet')) return 'Makbet';
  if (combined.includes('mitolog') || combined.includes('mit ') || combined.includes('fatum') || combined.includes('ikara')) return 'Mitologia';
  if (combined.includes('bibli') || combined.includes('hiob') || combined.includes('kohelet') || combined.includes('apokalips')) return 'Biblia';
  if (combined.includes('treny') || combined.includes('pieśni') || combined.includes('fraszk') || combined.includes('odprawa posłów') || combined.includes('kochanowski')) return 'Kochanowski';
  if (combined.includes('krasicki') || combined.includes('bajki') || combined.includes('satyry')) return 'Krasicki';
  if (combined.includes('morsztyn') || combined.includes('naborowski') || combined.includes('barokow')) return 'Poezja barokowa';
  if (combined.includes('bogurodzic') || combined.includes('lament') || combined.includes('aleksy') || combined.includes('polikarp')) return 'Średniowiecze';
  if (combined.includes('ferdydurke') || combined.includes('upupienie') || combined.includes('gęba') || combined.includes('syfon')) return 'Ferdydurke';
  if (combined.includes('baczyński') || combined.includes('kolumb')) return 'Baczyński';
  if (combined.includes('różewicz') || combined.includes('ocalony')) return 'Różewicz';
  if (combined.includes('gloria victis') || combined.includes('orzeszkowa') || combined.includes('powstani')) return 'Gloria victis';
  if (combined.includes('tango') || combined.includes('mrożek') || combined.includes('edek')) return 'Tango';
  if (combined.includes('dżuma') || combined.includes('camus') || combined.includes('rieux')) return 'Dżuma';
  return null;
}

/**
 * Weryfikacja bezwzględnej czystości tematycznej i epokowej zadania względem danej lekcji
 */
export function isTaskValidForLesson(task: Task800Item | PolishTask, lesson: PolishLesson): boolean {
  const isPart1Module =
    lesson.module === 'Język w użyciu' ||
    lesson.epoch === 'Język w użyciu' ||
    lesson.epoch === 'Notatka syntetyzująca' ||
    lesson.epoch === 'Retoryka i Stylistyka' ||
    lesson.id.startsWith('pol-lesson-1-') ||
    lesson.id.startsWith('pol-lesson-2-') ||
    lesson.id.startsWith('pol-lesson-3-');

  if (isPart1Module) {
    if (task.part !== 1) return false;
    // Dział 2: Notatka syntetyzująca
    if (lesson.id.startsWith('pol-lesson-2-') || lesson.epoch === 'Notatka syntetyzująca') {
      return (task as Task800Item).granularType === 'T6_notatka_syntetyzujaca';
    }
    // Dział 3: Retoryka i Stylistyka
    if (lesson.id.startsWith('pol-lesson-3-') || lesson.epoch === 'Retoryka i Stylistyka') {
      const gType = (task as Task800Item).granularType;
      return gType === 'T3_funkcje_jezykowe' || gType === 'T4_srodki_retoryczne_stylistyczne';
    }
    return true;
  }

  const isPart3Module =
    lesson.module === 'Warsztat wypracowania' ||
    lesson.epoch === 'Wypracowanie maturalne' ||
    lesson.id.startsWith('pol-lesson-15-') ||
    lesson.id.startsWith('pol-lesson-22-') ||
    lesson.id.startsWith('pol-lesson-23-') ||
    lesson.id.startsWith('pol-lesson-24-');

  if (isPart3Module) {
    return task.part === 3;
  }

  // Moduł 2: Test historycznoliteracki
  const normEpoch = resolveEpochForLesson(lesson);
  if (normEpoch) {
    return task.part === 2 && task.epoch === normEpoch;
  }

  return task.part === 2;
}

/**
 * Inteligentny randomizer tematyczny:
 * - Gwarantuje 100% czystości epokowej (zero zadań z obcych epok).
 * - Dobiera zadania dedykowane konkretnej lekturze z lekcji (Lalka, Dziady, Kordian itd.).
 * - Dokładnie 7 zbalansowanych zadań CKE (4 zamknięte + 3 otwarte).
 * - Automatycznie unieważnia stary cache v4 i ładuje v5.
 */
export function getTasksForLesson(lesson?: PolishLesson, forceNew = false): PolishTask[] {
  if (!lesson || !lesson.id) {
    return [];
  }

  const duration = lesson.durationMinutes || 45;
  const targetCounts = getTargetCounts(duration);
  const storageKey = `jasne_lesson_tasks_v5_${lesson.id}`;

  // 1. Sprawdzenie pamięci podręcznej (localStorage)
  if (!forceNew && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached) as PolishTask[];
        if (Array.isArray(parsed) && parsed.length === targetCounts.total) {
          const isCacheClean = parsed.every((t) => isTaskValidForLesson(t, lesson));
          if (isCacheClean) {
            return parsed.map(shuffleTaskOptions);
          }
        }
      }
    } catch (e) {
      console.warn('Błąd odczytu zadań lekcji z localStorage:', e);
    }
  }

  // 2. Filtrowanie dozwolonych zadań z bazy 800+
  let allowedTasks = ALL_POLISH_TASKS_800.filter((task) => isTaskValidForLesson(task, lesson));

  // Fallback dla specyficznych podkategorii części 1 (np. gdyby brakowało pytań z wąskiego typu)
  if (allowedTasks.length < targetCounts.total) {
    const isPart1Module =
      lesson.module === 'Język w użyciu' ||
      lesson.epoch === 'Język w użyciu' ||
      lesson.epoch === 'Notatka syntetyzująca' ||
      lesson.epoch === 'Retoryka i Stylistyka' ||
      lesson.id.startsWith('pol-lesson-1-') ||
      lesson.id.startsWith('pol-lesson-2-') ||
      lesson.id.startsWith('pol-lesson-3-');

    if (isPart1Module) {
      allowedTasks = ALL_POLISH_TASKS_800.filter((t) => t.part === 1);
    } else {
      const normEpoch = resolveEpochForLesson(lesson);
      if (normEpoch) {
        allowedTasks = ALL_POLISH_TASKS_800.filter((t) => t.part === 2 && t.epoch === normEpoch);
      }
    }
  }

  // 3. Specjalne traktowanie lektury dedykowanej dla lekcji
  const targetLektura = resolveLekturaFromLesson(lesson);
  if (targetLektura) {
    const lekLower = targetLektura.toLowerCase();
    const lekturaSpecificTasks = allowedTasks.filter((task) => {
      const tLek = (task.lektura || '').toLowerCase();
      const tTitle = (task.title || '').toLowerCase();
      const tQuestion = (task.question || '').toLowerCase();
      const tText = (task.passage?.text || '').toLowerCase();
      return tLek.includes(lekLower) || tTitle.includes(lekLower) || tQuestion.includes(lekLower) || tText.includes(lekLower);
    });

    if (lekturaSpecificTasks.length >= targetCounts.total) {
      allowedTasks = lekturaSpecificTasks;
    } else if (lekturaSpecificTasks.length > 0) {
      const otherSameEpoch = allowedTasks.filter((t) => !lekturaSpecificTasks.some((lst) => lst.id === t.id));
      allowedTasks = [...lekturaSpecificTasks, ...otherSameEpoch];
    }
  }

  // 4. Rozdzielenie na zadania zamknięte i otwarte
  const closedPool = shuffleArray(allowedTasks.filter(isClosedTask));
  const openPool = shuffleArray(allowedTasks.filter((t) => !isClosedTask(t)));

  const selectedClosed: PolishTask[] = [];
  const selectedOpen: PolishTask[] = [];
  const selectedIds = new Set<string>();

  // A. Dobór zadań zamkniętych
  for (const t of closedPool) {
    if (selectedClosed.length >= targetCounts.closed) break;
    if (!selectedIds.has(t.id)) {
      selectedIds.add(t.id);
      selectedClosed.push(t);
    }
  }

  // B. Dobór zadań otwartych
  const remainingNeeded = targetCounts.total - selectedClosed.length;
  for (const t of openPool) {
    if (selectedOpen.length >= remainingNeeded) break;
    if (!selectedIds.has(t.id)) {
      selectedIds.add(t.id);
      selectedOpen.push(t);
    }
  }

  // C. Dopełnienie awaryjne w przypadku braku otwartych lub zamkniętych
  if (selectedClosed.length + selectedOpen.length < targetCounts.total) {
    for (const t of [...closedPool, ...openPool, ...allowedTasks]) {
      if (selectedClosed.length + selectedOpen.length >= targetCounts.total) break;
      if (!selectedIds.has(t.id)) {
        selectedIds.add(t.id);
        if (isClosedTask(t)) {
          selectedClosed.push(t);
        } else {
          selectedOpen.push(t);
        }
      }
    }
  }

  const finalTasks: PolishTask[] = [...selectedClosed, ...selectedOpen].map(shuffleTaskOptions);

  // 5. Zapis do localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(finalTasks));
    } catch (e) {
      console.warn('Błąd zapisu zadań lekcji do localStorage:', e);
    }
  }

  return finalTasks;
}

/**
 * Wymusza wylosowanie nowego zestawu zadań dla danej lekcji i czyści poprzednie odpowiedzi.
 */
export function resetLessonTasks(lesson?: PolishLesson): PolishTask[] {
  if (!lesson || !lesson.id) return [];
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`jasne_lesson_answers_${lesson.id}`);
      localStorage.removeItem(`jasne_lesson_tasks_${lesson.id}`);
      localStorage.removeItem(`jasne_lesson_tasks_v2_${lesson.id}`);
      localStorage.removeItem(`jasne_lesson_tasks_v3_${lesson.id}`);
      localStorage.removeItem(`jasne_lesson_tasks_v4_${lesson.id}`);
    } catch (e) {
      console.warn('Błąd czyszczenia pamięci lekcji:', e);
    }
  }
  return getTasksForLesson(lesson, true);
}

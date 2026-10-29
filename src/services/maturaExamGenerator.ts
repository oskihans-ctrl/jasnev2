import { MaturaTask } from '../types';
import { MathTask } from '../types/mathTypes';
import rawGeneratedTasks from '../data/math/generated/all_1500_tasks.json';
import { shuffleTaskOptions } from '../utils/taskShuffler';

export interface MaturaExamSheet {
  id: string;
  name: string;
  badge: string;
  desc: string;
  description?: string;
  totalPoints: number;
  durationMinutes: number;
  tasks: MaturaTask[];
  breakdown: {
    closedCount: number;
    closedPoints: number;
    openCount: number;
    openPoints: number;
    optimizationPoints: number;
  };
}

/**
 * Kanoniczna numeracja 15 działów matematyki (poziom podstawowy, wymagania 2025+).
 * Zadania w all_1500_tasks.json niosą własne `topicId`, `sectionTitle` i `lessonKey`
 * (np. "6.2" = dział 6, lekcja 2) – nie ma już pośredniego mapowania archetypów.
 */
export const MATH_SECTION_TITLES: Record<string, string> = {
  'dzial-1': 'Dział 1: Liczby rzeczywiste',
  'dzial-2': 'Dział 2: Wyrażenia algebraiczne',
  'dzial-3': 'Dział 3: Równania i nierówności',
  'dzial-4': 'Dział 4: Funkcje i ich własności',
  'dzial-5': 'Dział 5: Funkcja liniowa i układy równań',
  'dzial-6': 'Dział 6: Funkcja kwadratowa',
  'dzial-7': 'Dział 7: Ciągi liczbowe',
  'dzial-8': 'Dział 8: Trygonometria',
  'dzial-9': 'Dział 9: Planimetria',
  'dzial-10': 'Dział 10: Geometria analityczna',
  'dzial-11': 'Dział 11: Stereometria',
  'dzial-12': 'Dział 12: Kombinatoryka',
  'dzial-13': 'Dział 13: Rachunek prawdopodobieństwa',
  'dzial-14': 'Dział 14: Statystyka',
  'dzial-15': 'Dział 15: Optymalizacja'
};

const GENERATED_SOURCE = 'Zadanie autorskie JASNE • w stylu CKE';
const CLOSED_PREFIX = /^Dokończ zdanie\.\s*Wybierz właściwą odpowiedź spośród podanych\.\s*/i;

function lessonKeyOf(raw: any): string {
  if (raw.lessonKey) return String(raw.lessonKey);
  const m = String(raw.id || '').match(/mat-pp-(\d+)-(\d+)-/);
  return m ? `${m[1]}.${m[2]}` : '1.1';
}

/** Zadania otwarte generatora PP niosą etapy oceniania CKE – przekazujemy je dalej bez zmian. */
function openScoring(raw: any) {
  if (!Array.isArray(raw.rubric_stages)) return {};
  return {
    rubric_stages: raw.rubric_stages,
    scoring_key: raw.scoring_key,
    ...(Array.isArray(raw.zero_rules) ? { zero_rules: raw.zero_rules } : {}),
    ...(Array.isArray(raw.official_solution_steps) ? { official_solution_steps: raw.official_solution_steps } : {})
  };
}

/**
 * Standardizes raw json task to full MaturaTask interface.
 */
function normalizeToMaturaTask(raw: any): MaturaTask {
  const topicId = raw.topicId || `dzial-${lessonKeyOf(raw).split('.')[0]}`;

  return shuffleTaskOptions({
    id: raw.id,
    section: raw.section || raw.sectionTitle || MATH_SECTION_TITLES[topicId] || MATH_SECTION_TITLES['dzial-1'],
    topicId,
    type: raw.type || 'SINGLE_CHOICE',
    content: raw.content,
    options: Array.isArray(raw.options) ? raw.options : [],
    correctAnswer: raw.correct_answer || raw.correctAnswer || 'A',
    points: typeof raw.points === 'number' ? raw.points : 1,
    isClosed: raw.isClosed !== undefined ? raw.isClosed : (raw.type === 'SINGLE_CHOICE' || raw.type === 'TRUE_FALSE'),
    explanation: raw.explanation || '',
    ckeTrap: raw.ckeTrap || raw.matura_tip || 'Zwróć uwagę na pułapki rachunkowe i dziedzinę wyrażenia.',
    source: raw.source || GENERATED_SOURCE,
    year: 2025,
    session: 'Zadania autorskie JASNE (wymagania CKE 2025)',
    // Zadania generowane są autorskie – nie są oficjalnymi zadaniami CKE.
    isCke: false,
    diagram: raw.diagram,
    plot: raw.plot,
    // zadania prawda/fałsz: stwierdzenia oceniane osobno, klucz np. "PF" (lib/structuredAnswer.ts)
    ...(Array.isArray(raw.statements) ? { statements: raw.statements } : {}),
    ...openScoring(raw)
  } as MaturaTask);
}

/**
 * All 1500 generated tasks as clean MaturaTask objects.
 */
export const ALL_1500_MATURA_TASKS: MaturaTask[] = (rawGeneratedTasks as any[]).map(normalizeToMaturaTask);

/**
 * Retrieve all 1500 tasks formatted as MaturaTask.
 */
export function getAll1500MaturaTasks(): MaturaTask[] {
  return ALL_1500_MATURA_TASKS;
}

/**
 * Retrieve all 1500 tasks formatted as MathTask for MathStudyHub.
 */
export function getAll1500MathTasks(): MathTask[] {
  return (rawGeneratedTasks as any[]).map(t => {
    const topicId = t.topicId || `dzial-${lessonKeyOf(t).split('.')[0]}`;

    return shuffleTaskOptions({
      id: t.id,
      topicId,
      sectionTitle: t.sectionTitle || MATH_SECTION_TITLES[topicId] || MATH_SECTION_TITLES['dzial-1'],
      taskNumber: String(t.id).replace(/^mat-pp-/, ''),
      type: t.type || 'SINGLE_CHOICE',
      content: t.content,
      options: t.optionsDetailed && t.optionsDetailed.length > 0
        ? t.optionsDetailed
        : (Array.isArray(t.options) && t.options.length > 0
          ? t.options.map((optText: string, idx: number) => ({
              id: String.fromCharCode(65 + idx),
              text: optText,
              is_correct: String.fromCharCode(65 + idx) === (t.correct_answer || t.correctAnswer)
            }))
          : undefined),
      correct_answer: t.correct_answer || t.correctAnswer || 'A',
      explanation: t.explanation,
      matura_tip: t.matura_tip || t.ckeTrap,
      points: t.points || 1,
      sourceYear: 'JASNE • zadanie autorskie w stylu CKE',
      badge: `Lekcja ${lessonKeyOf(t)}`,
      diagram: t.diagram,
      plot: t.plot,
      ...(Array.isArray(t.statements) ? { statements: t.statements } : {}),
      ...openScoring(t)
    });
  });
}

/**
 * Deterministic pseudo-random number generator using linear congruential generator (LCG).
 */
function createPrng(seed: number = 42) {
  let s = Math.abs(seed) % 2147483647;
  if (s === 0) s = 1;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Czy zadanie zamknięte da się uczciwie zamienić na otwarte (pojedyncza wielkość do obliczenia,
 * bez wykresu do odczytu i bez ocen prawda/fałsz)?
 */
function isOpenConvertible(task: MaturaTask): boolean {
  if (task.type === 'NUMERIC_INPUT') return true;
  if (task.type !== 'SINGLE_CHOICE' || task.diagram || task.plot) return false;
  if (/Oceń prawdziwość/i.test(task.content)) return false;
  return CLOSED_PREFIX.test(task.content) && task.options.length === 4;
}

/**
 * Transforms a closed/numeric task into an open calculation task.
 * Poprawną odpowiedzią staje się TREŚĆ właściwej opcji (a nie litera), bo opcje znikają.
 */
function convertToOpenCalculationTask(task: MaturaTask, points: number): MaturaTask {
  let cleanContent = task.content;
  let answerText = task.correctAnswer;

  if (task.type === 'NUMERIC_INPUT') {
    cleanContent = cleanContent.replace(/\s*Wpisz liczbę\.\s*$/i, '').trim();
    cleanContent = `${cleanContent} Zapisz obliczenia.`;
  } else {
    const idx = String(task.correctAnswer).trim().toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < task.options.length) answerText = task.options[idx];
    cleanContent = cleanContent.replace(CLOSED_PREFIX, '').trim();
    cleanContent = `Zadanie otwarte. Zapisz pełne rozwiązanie i podaj wynik, który poprawnie kończy poniższe zdanie.\n\n${cleanContent} …`;
  }

  return {
    ...task,
    id: `${task.id}_open_${points}pkt`,
    type: 'OPEN_CALCULATION',
    points,
    isClosed: false,
    content: cleanContent,
    correctAnswer: answerText,
    options: []
  };
}

/**
 * Group tasks by lesson key ("dział.lekcja") for fast targeted sampling.
 */
const TASKS_BY_LESSON: Record<string, MaturaTask[]> = {};
(rawGeneratedTasks as any[]).forEach((raw, i) => {
  const key = lessonKeyOf(raw);
  if (!TASKS_BY_LESSON[key]) {
    TASKS_BY_LESSON[key] = [];
  }
  TASKS_BY_LESSON[key].push(ALL_1500_MATURA_TASKS[i]);
});

/**
 * Picks a random task from a lesson pool.
 * mode 'closed' – tylko zadania wyboru; mode 'open' – tylko zadania, które można zamienić na otwarte.
 */
function sampleFromLesson(key: string, rng: () => number, excludeIds: Set<string>, mode: 'closed' | 'open' = 'closed'): MaturaTask {
  const base = TASKS_BY_LESSON[key] || ALL_1500_MATURA_TASKS;
  const fits = (t: MaturaTask) => (mode === 'closed' ? t.isClosed : isOpenConvertible(t));
  const pool = base.filter(t => fits(t) && !excludeIds.has(t.id));
  const fallbackPool = base.filter(fits);
  const list = pool.length > 0 ? pool : (fallbackPool.length > 0 ? fallbackPool : base);
  const chosen = list[Math.floor(rng() * list.length)];
  excludeIds.add(chosen.id);
  return shuffleTaskOptions({ ...chosen });
}

/** Zadanie optymalizacyjne za 4 pkt – z lekcji 15.1, 15.3 lub 15.4 (pełne modele z treścią). */
function sampleOptimizationTask(rng: () => number, excludeIds: Set<string>): MaturaTask {
  const keys = ['15.1', '15.3', '15.4'];
  const raw = sampleFromLesson(keys[Math.floor(rng() * keys.length)], rng, excludeIds, 'open');
  const open = convertToOpenCalculationTask(raw, 4);
  return {
    ...open,
    type: 'OPEN_PROOF',
    content: `${open.content}\n\nW rozwiązaniu zapisz funkcję jednej zmiennej, jej dziedzinę oraz obliczenia prowadzące do wyniku.`
  };
}

/**
 * Generates a full mock exam in the CKE layout (wymagania 2025):
 * - Exactly 35 tasks
 * - Exactly 50 points
 * - 25 closed tasks @ 1 pkt = 25 pkt
 * - 7 open calculation tasks @ 2 pkt = 14 pkt
 * - 1 polynomial equation @ 3 pkt = 3 pkt
 * - 2 extended tasks @ 4 pkt (stereometria + optymalizacja) = 8 pkt
 * Sum: 25 + 14 + 3 + 8 = 50 pkt
 */
export function generateFullMaturaExam(seed: string | number = Date.now(), name?: string): MaturaExamSheet {
  const numSeed = typeof seed === 'number' ? seed : seed.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const rng = createPrng(numSeed);
  const usedIds = new Set<string>();

  // 1. Task 35: 4-point optimization task (dział 15)
  const task35Opt = sampleOptimizationTask(rng, usedIds);

  // 2. Task 34: 4-point stereometry task (11.2 Ostrosłupy)
  const task34Stereo = convertToOpenCalculationTask(sampleFromLesson('11.2', rng, usedIds, 'open'), 4);

  // 3. Task 33: 3-point polynomial equation (3.4 Równania wielomianowe)
  const task33Poly = convertToOpenCalculationTask(sampleFromLesson('3.4', rng, usedIds, 'open'), 3);

  // 4. Tasks 26-32: 7 short open calculation tasks @ 2 points each (14 pkt)
  const openLessonKeys = [
    '3.3',  // nierówność kwadratowa
    '7.3',  // suma ciągu arytmetycznego
    '8.3',  // jedynka trygonometryczna
    '9.1',  // twierdzenie Pitagorasa i pola
    '10.2', // równanie prostej
    '13.2', // prawdopodobieństwo – dwie kostki
    '14.2'  // średnia ważona
  ];
  const open2PktTasks = openLessonKeys.map(key => convertToOpenCalculationTask(sampleFromLesson(key, rng, usedIds, 'open'), 2));

  // 5. Tasks 1-25: exactly 25 closed tasks @ 1 point each, przekrój wszystkich działów
  const closedLessonSequence = [
    '1.1', '1.2', '1.3', '1.4', '1.5', // Dział 1: Liczby rzeczywiste (5)
    '2.1', '2.4',                      // Dział 2: Wyrażenia algebraiczne (2)
    '3.1', '3.5',                      // Dział 3: Równania i nierówności (2)
    '4.2', '4.5',                      // Dział 4: Funkcje (2)
    '5.1', '5.3',                      // Dział 5: Funkcja liniowa i układy (2)
    '6.2', '6.3',                      // Dział 6: Funkcja kwadratowa (2)
    '7.2', '7.4',                      // Dział 7: Ciągi (2)
    '8.2',                             // Dział 8: Trygonometria (1)
    '9.2', '9.4',                      // Dział 9: Planimetria (2)
    '10.3',                            // Dział 10: Geometria analityczna (1)
    '11.1',                            // Dział 11: Stereometria (1)
    '12.3',                            // Dział 12: Kombinatoryka (1)
    '13.1',                            // Dział 13: Prawdopodobieństwo (1)
    '14.3'                             // Dział 14: Statystyka (1) -> łącznie 25 zadań
  ];

  const closedTasks = closedLessonSequence.map((key) => {
    const t = sampleFromLesson(key, rng, usedIds, 'closed');
    t.points = 1;
    t.isClosed = true;
    return t;
  });

  const allTasks: MaturaTask[] = [
    ...closedTasks,
    ...open2PktTasks,
    task33Poly,
    task34Stereo,
    task35Opt
  ];

  const totalPoints = allTasks.reduce((sum, t) => sum + t.points, 0); // exactly 50 pkt
  const examId = `jasne-probna-2025-${typeof seed === 'string' ? seed.toLowerCase().replace(/\s+/g, '-') : seed}`;
  const examName = name || `Matura Próbna JASNE • Arkusz w układzie CKE`;

  return {
    id: examId,
    name: examName,
    badge: 'Układ CKE (50 PKT)',
    desc: 'Pełny arkusz próbny: 35 zadań autorskich JASNE, dokładnie 50 punktów (25 pkt zamknięte, 25 pkt otwarte), w tym zadanie optymalizacyjne.',
    description: 'Pełny arkusz próbny: 35 zadań autorskich JASNE, dokładnie 50 punktów (25 pkt zamknięte, 25 pkt otwarte), w tym zadanie optymalizacyjne.',
    totalPoints,
    durationMinutes: 180,
    tasks: allTasks,
    breakdown: {
      closedCount: closedTasks.length,
      closedPoints: closedTasks.length,
      openCount: open2PktTasks.length + 3,
      openPoints: 14 + 3 + 8,
      optimizationPoints: 4
    }
  };
}

/**
 * Generates a Mini Matura Exam:
 * - 'standard' (35 min): 18 tasks, 25 points (13 closed + 4 open @ 2 pkt + 1 optimization @ 4 pkt).
 * - 'express' (20 min): 12 tasks, 15 points (9 closed + 3 open @ 2 pkt).
 */
export function generateMiniMaturaExam(
  variantOrLength: 'standard' | 'express' | number = 'standard',
  sectionChoice: string = 'Wszystkie działy',
  seed: string | number = Date.now()
): MaturaExamSheet {
  const isExpress = variantOrLength === 'express' || variantOrLength === 7 || variantOrLength === 11;
  const numSeed = typeof seed === 'number' ? seed : seed.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const rng = createPrng(numSeed);
  const usedIds = new Set<string>();

  // Filter tasks if specific section chosen
  const isAllSections = !sectionChoice || sectionChoice === 'Wszystkie działy';

  if (!isAllSections) {
    // Specific section drill
    const sectionTasks = ALL_1500_MATURA_TASKS.filter(t => t.section === sectionChoice || t.topicId === sectionChoice);
    const pool = sectionTasks.length > 0 ? sectionTasks : ALL_1500_MATURA_TASKS;
    // Fisher–Yates na deterministycznym PRNG
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const targetCount = isExpress ? 11 : 17;
    const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length)).map(t => ({ ...t }));
    const totalPoints = selected.reduce((sum, t) => sum + t.points, 0);

    return {
      id: `mini-matura-section-${Date.now()}`,
      name: `Mini Matura • ${sectionChoice}`,
      badge: isExpress ? '20 MIN • Trening Działowy' : '35 MIN • Trening Działowy',
      desc: `Zestaw zadań w stylu CKE z działu ${sectionChoice}.`,
      description: `Zestaw zadań w stylu CKE z działu ${sectionChoice}.`,
      totalPoints,
      durationMinutes: isExpress ? 20 : 35,
      tasks: selected,
      breakdown: {
        closedCount: selected.filter(t => t.isClosed).length,
        closedPoints: selected.filter(t => t.isClosed).reduce((s, t) => s + t.points, 0),
        openCount: selected.filter(t => !t.isClosed).length,
        openPoints: selected.filter(t => !t.isClosed).reduce((s, t) => s + t.points, 0),
        optimizationPoints: selected.filter(t => t.points === 4).reduce((s, t) => s + t.points, 0)
      }
    };
  }

  const sampleClosed = (key: string) => {
    const t = sampleFromLesson(key, rng, usedIds, 'closed');
    t.points = 1;
    t.isClosed = true;
    return t;
  };
  const sampleOpen2 = (key: string) => convertToOpenCalculationTask(sampleFromLesson(key, rng, usedIds, 'open'), 2);

  // Cross-curriculum Mini Matura
  if (isExpress) {
    // Express: 12 tasks, 15 points (9 closed @ 1 pkt + 3 open @ 2 pkt)
    const closed = [
      '1.1',  // potęgi
      '1.3',  // logarytmy
      '1.5',  // procenty
      '2.1',  // wzory skróconego mnożenia
      '3.3',  // nierówności kwadratowe
      '6.2',  // wierzchołek paraboli
      '7.2',  // ciąg arytmetyczny
      '8.2',  // trygonometria
      '10.1'  // odległość i środek odcinka
    ].map(sampleClosed);

    const openTasks = ['7.3', '9.1', '13.2'].map(sampleOpen2);

    const allTasks = [...closed, ...openTasks];
    const totalPts = allTasks.reduce((s, t) => s + t.points, 0);

    return {
      id: `mini-matura-express-${Date.now()}`,
      name: `Mini Matura Ekspresowa (20 min)`,
      badge: '20 MIN • 15 PKT',
      desc: 'Ekspresowy przekrój w stylu CKE: 15 punktów, zadania zamknięte i otwarte obliczenia.',
      description: 'Ekspresowy przekrój w stylu CKE: 15 punktów, zadania zamknięte i otwarte obliczenia.',
      totalPoints: totalPts,
      durationMinutes: 20,
      tasks: allTasks,
      breakdown: {
        closedCount: closed.length,
        closedPoints: closed.length,
        openCount: openTasks.length,
        openPoints: 6,
        optimizationPoints: 0
      }
    };
  }

  // Standard Mini Matura: 18 tasks, exactly 25 points
  const closed = [
    '1.1',  // potęgi
    '1.3',  // logarytmy
    '1.4',  // wartość bezwzględna
    '2.1',  // wzory skróconego mnożenia
    '3.5',  // równanie wymierne
    '4.1',  // wzór funkcji
    '6.2',  // wierzchołek paraboli
    '7.2',  // ciąg arytmetyczny
    '7.4',  // ciąg geometryczny
    '8.3',  // jedynka trygonometryczna
    '9.4',  // kąty w okręgu
    '10.1', // środek odcinka
    '11.1'  // graniastosłupy
  ].map(sampleClosed);

  const openTasks = ['3.3', '7.3', '10.2', '13.2'].map(sampleOpen2);

  const optTask = sampleOptimizationTask(rng, usedIds);

  const allTasks = [...closed, ...openTasks, optTask]; // exactly 18 tasks
  const totalPts = allTasks.reduce((s, t) => s + t.points, 0); // exactly 25 pkt

  return {
    id: `mini-matura-standard-${Date.now()}`,
    name: `Mini Matura Standardowa (35 min)`,
    badge: '35 MIN • 25 PKT (1/2 ARKUSZA)',
    desc: 'Połowa pełnego arkusza: 18 zadań, 25 punktów, w tym zadanie optymalizacyjne za 4 pkt.',
    description: 'Połowa pełnego arkusza: 18 zadań, 25 punktów, w tym zadanie optymalizacyjne za 4 pkt.',
    totalPoints: totalPts,
    durationMinutes: 35,
    tasks: allTasks,
    breakdown: {
      closedCount: closed.length,
      closedPoints: closed.length,
      openCount: openTasks.length + 1,
      openPoints: 8 + 4,
      optimizationPoints: 4
    }
  };
}

/**
 * Pre-generated flagship mock exams.
 */
export const FLAGSHIP_JASNE_EXAMS: MaturaExamSheet[] = [
  generateFullMaturaExam(1001, 'Matura Próbna JASNE • Arkusz Wzorcowy A'),
  generateFullMaturaExam(2002, 'Matura Próbna JASNE • Arkusz Wzorcowy B'),
  generateFullMaturaExam(3003, 'Matura Próbna JASNE • Arkusz Wzorcowy C')
];

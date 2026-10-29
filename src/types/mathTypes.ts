export type MathTaskType =
  | 'SINGLE_CHOICE'
  | 'NUMERIC_INPUT'
  | 'OPEN_PROOF'
  | 'OPEN_CALCULATION'
  | 'TRUE_FALSE'
  | 'TWO_PART'
  | 'MULTI_CHOICE';

export interface MathTaskOption {
  id: string;
  text: string;
  is_correct?: boolean;
  numberLine?: any;
  /** Rysunek będący treścią odpowiedzi (np. bryła z zaznaczonym kątem) */
  diagram?: any;
}

export interface MathTask {
  id: string;
  topicId: string;
  sectionTitle: string;
  taskNumber?: string;
  type: MathTaskType;
  content: string;
  options?: MathTaskOption[];
  correct_answer?: string;
  explanation?: string;
  matura_tip?: string;
  points: number;
  sourceYear?: string;
  badge?: string;
  hasVisual?: boolean;
  visualType?: 'diagram' | 'numberLine' | 'plot';
  visualData?: any;
  /** Rysunek do zadania (MathDiagramData lub PlotData) */
  diagram?: any;
  plot?: any;
  numberLine?: any;
  /** Informacja, że forma zadania została dostosowana względem arkusza CKE (np. rysunek opisano słownie) */
  adaptationNote?: string;
  /** Zadanie archiwalnego arkusza spoza zakresu PP od matury 2025 (podstawa 2024); powód w `scopeNote` */
  outsideScope2025?: boolean;
  scopeNote?: string;
  /** Stwierdzenia oceniane jako prawda/fałsz (klucz w `correct_answer`, np. "PF") */
  statements?: { id: string; text: string; correct: 'P' | 'F' }[];
  /** Części odpowiedzi – w każdej wybór jednej opcji (klucz np. "B2" albo "AE") */
  parts?: { prompt?: string; options: { id: string; text: string }[] }[];
  /** 'per_part' – punkt za każdą poprawną część (tabele z dopasowaniem); domyślnie punkt tylko za całość */
  partScoring?: 'per_part';
  /** Liczba odpowiedzi do zaznaczenia w zadaniu wielokrotnego wyboru */
  multiSelect?: number;
}

export interface MathSection {
  id: string;
  numericId: number;
  title: string;
  short_title: string;
  icon: string;
  points_range: string;
  description: string;
  cke_formula_page?: string;
}

/**
 * 15 działów matematyki (poziom podstawowy, wymagania CKE od 2025 r.).
 * Numeracja i opisy są zgodne z src/data/math/generated/math_blueprints.json (generator scripts/math_pp),
 * a numery stron odnoszą się do „Wybranych wzorów matematycznych” CKE (wydanie 2023).
 */
export const MATH_SECTIONS: MathSection[] = [
  {
    id: 'dzial-1',
    numericId: 1,
    title: 'Dział 1: Liczby rzeczywiste',
    short_title: 'Liczby rzeczywiste',
    icon: 'Hash',
    points_range: '3–5 pkt',
    description: 'Potęgi, pierwiastki, logarytmy, wartość bezwzględna oraz procenty i lokaty.',
    cke_formula_page: 'str. 4–5, 10'
  },
  {
    id: 'dzial-2',
    numericId: 2,
    title: 'Dział 2: Wyrażenia algebraiczne',
    short_title: 'Wyrażenia algebraiczne',
    icon: 'Braces',
    points_range: '2–4 pkt',
    description: 'Wzory skróconego mnożenia, działania na wielomianach, rozkład na czynniki, wyrażenia wymierne i dowody.',
    cke_formula_page: 'str. 7'
  },
  {
    id: 'dzial-3',
    numericId: 3,
    title: 'Dział 3: Równania i nierówności',
    short_title: 'Równania i nierówności',
    icon: 'Scale',
    points_range: '4–6 pkt',
    description: 'Równania i nierówności liniowe, kwadratowe, wielomianowe oraz wymierne.',
    cke_formula_page: 'str. 7–8'
  },
  {
    id: 'dzial-4',
    numericId: 4,
    title: 'Dział 4: Funkcje i ich własności',
    short_title: 'Funkcje',
    icon: 'LineChart',
    points_range: '2–4 pkt',
    description: 'Wartości i dziedzina funkcji, odczytywanie własności z wykresu, przesunięcia wykresów oraz funkcja wykładnicza i logarytmiczna.',
    cke_formula_page: 'str. 4–5'
  },
  {
    id: 'dzial-5',
    numericId: 5,
    title: 'Dział 5: Funkcja liniowa i układy równań',
    short_title: 'Funkcja liniowa i układy',
    icon: 'TrendingUp',
    points_range: '2–5 pkt',
    description: 'Współczynniki i wzór funkcji liniowej, układy równań liniowych, ich interpretacja geometryczna i zadania tekstowe.',
    cke_formula_page: 'str. 21–22'
  },
  {
    id: 'dzial-6',
    numericId: 6,
    title: 'Dział 6: Funkcja kwadratowa',
    short_title: 'Funkcja kwadratowa',
    icon: 'Activity',
    points_range: '1–4 pkt',
    description: 'Postać ogólna, kanoniczna i iloczynowa, wierzchołek i oś symetrii, miejsca zerowe oraz wartości skrajne w przedziale.',
    cke_formula_page: 'str. 7–8'
  },
  {
    id: 'dzial-7',
    numericId: 7,
    title: 'Dział 7: Ciągi liczbowe',
    short_title: 'Ciągi',
    icon: 'ListOrdered',
    points_range: '3–4 pkt',
    description: 'Wzór ogólny i rekurencyjny, monotoniczność, ciąg arytmetyczny i geometryczny oraz ich sumy.',
    cke_formula_page: 'str. 9–10'
  },
  {
    id: 'dzial-8',
    numericId: 8,
    title: 'Dział 8: Trygonometria',
    short_title: 'Trygonometria',
    icon: 'Triangle',
    points_range: '1–3 pkt',
    description: 'Sinus, cosinus i tangens w trójkącie prostokątnym, kąty 30°, 45°, 60°, jedynka trygonometryczna, kąty rozwarte i twierdzenie cosinusów.',
    cke_formula_page: 'str. 10–15'
  },
  {
    id: 'dzial-9',
    numericId: 9,
    title: 'Dział 9: Planimetria',
    short_title: 'Planimetria',
    icon: 'Shapes',
    points_range: '3–6 pkt',
    description: 'Twierdzenie Pitagorasa, pola trójkątów i czworokątów, podobieństwo, kąty w okręgu, łuk i wycinek koła.',
    cke_formula_page: 'str. 14–20'
  },
  {
    id: 'dzial-10',
    numericId: 10,
    title: 'Dział 10: Geometria analityczna',
    short_title: 'Geometria analityczna',
    icon: 'Crosshair',
    points_range: '2–6 pkt',
    description: 'Odległość punktów i środek odcinka, równanie prostej, proste równoległe i prostopadłe, równanie okręgu oraz symetrie.',
    cke_formula_page: 'str. 21–23'
  },
  {
    id: 'dzial-11',
    numericId: 11,
    title: 'Dział 11: Stereometria',
    short_title: 'Stereometria',
    icon: 'Box',
    points_range: '2–6 pkt',
    description: 'Graniastosłupy, ostrosłupy, kąty w bryłach, walec, stożek i kula oraz bryły podobne.',
    cke_formula_page: 'str. 24–26'
  },
  {
    id: 'dzial-12',
    numericId: 12,
    title: 'Dział 12: Kombinatoryka',
    short_title: 'Kombinatoryka',
    icon: 'Dices',
    points_range: '1 pkt',
    description: 'Reguła mnożenia i dodawania, liczby o zadanych własnościach, ustawienia bez powtórzeń i zliczanie przez dopełnienie.',
    cke_formula_page: 'str. 26–27'
  },
  {
    id: 'dzial-13',
    numericId: 13,
    title: 'Dział 13: Rachunek prawdopodobieństwa',
    short_title: 'Prawdopodobieństwo',
    icon: 'Percent',
    points_range: '2–3 pkt',
    description: 'Model klasyczny, rzuty kostką i monetą, losowanie liczb i kul, zdarzenie przeciwne.',
    cke_formula_page: 'str. 27'
  },
  {
    id: 'dzial-14',
    numericId: 14,
    title: 'Dział 14: Statystyka',
    short_title: 'Statystyka',
    icon: 'BarChart3',
    points_range: '0–2 pkt',
    description: 'Średnia arytmetyczna i ważona, mediana, dominanta oraz odczytywanie danych z tabel i diagramów.',
    cke_formula_page: 'str. 29–30'
  },
  {
    id: 'dzial-15',
    numericId: 15,
    title: 'Dział 15: Optymalizacja',
    short_title: 'Optymalizacja',
    icon: 'Target',
    points_range: '2–4 pkt',
    description: 'Zadania optymalizacyjne rozwiązywane za pomocą funkcji kwadratowej: pola, ogrodzenia, przychód i zadania liczbowe.',
    cke_formula_page: 'str. 7–8'
  }
];

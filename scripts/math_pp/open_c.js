/**
 * Zadania otwarte (PP) – działy 11–15. Stereometria i optymalizacja 3–4 pkt jak na arkuszach CKE;
 * kombinatoryka, prawdopodobieństwo i statystyka – wynik sprawdzany przez pełne przeliczenie (brute force).
 */
import { T, open, fr, dec, par, poly, xm, sq, need, m } from './lib.js';

const check = (cond, msg) => {
  if (!cond) throw new Error(`kontrola zadania otwartego: ${msg}`);
};
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]];
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const digits = (n) => String(n).split('').map(Number);
const countIf = (arr, f) => arr.filter(f).length;
const perms = (arr) => (arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p])));
/** Odmiana: 1 możliwość, 2–4 możliwości, 5+ możliwości. */
const pl = (n, one, few, many) => (n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many);
const moz = (n) => `$${n}$ ${pl(n, 'możliwość', 'możliwości', 'możliwości')}`;
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const piTex = (num, den = 1, root = '') => {
  const f = fr(num, den);
  return `${f === '1' && !root ? '' : f}${root}\\pi`;
};

// ---------- 11.1 Graniastosłup prawidłowy czworokątny ----------
const prismWallDiag = (r) => {
  const [p, q, w] = r.pick(TRIPLES);
  const [a, H] = r.bool() ? [p, q] : [q, p];
  const V = a * a * H;
  const Pc = 2 * a * a + 4 * a * H;
  return open({
    title: 'Graniastosłup z przekątnej ściany bocznej',
    q: T`Podstawą graniastosłupa prostego jest kwadrat o boku $${a}$. Przekątna ściany bocznej tego graniastosłupa ma długość $${w}$. Oblicz objętość i pole powierzchni całkowitej tego graniastosłupa. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie wysokości graniastosłupa: $H = ${H}$.`],
      [2, 'Etap 2', T`Obliczenie objętości: $V = ${V}$.`],
      [3, 'Komplet', T`Obliczenie pola powierzchni całkowitej: $P_c = ${Pc}$.`]
    ],
    steps: [
      T`Ściana boczna to prostokąt $${a} \times H$, a jej przekątna ma długość $${w}$: $H = \sqrt{${w}^2 - ${a}^2} = ${H}$.`,
      T`$V = a^2 \cdot H = ${a * a} \cdot ${H} = ${V}$.`,
      T`$P_c = 2a^2 + 4aH = ${2 * a * a} + ${4 * a * H} = ${Pc}$.`
    ],
    trap: 'Przekątna ŚCIANY BOCZNEJ to nie przekątna bryły – leży w prostokącie o bokach a i H.',
    tip: 'Karta wzorów, str. 25: graniastosłup $V = P_p \\cdot H$, $P_c = 2P_p + P_b$.',
    answer: T`$V = ${V}$, $P_c = ${Pc}$`
  });
};

// ---------- 11.2 Ostrosłup prawidłowy czworokątny ----------
const pyramidApothem = (r) => {
  const [p, q, hb] = r.pick(TRIPLES);
  const [half, H] = r.bool() ? [p, q] : [q, p];
  const a = 2 * half;
  const V = fr(a * a * H, 3);
  const Pb = 2 * a * hb;
  const Pc = a * a + Pb;
  return open({
    title: 'Ostrosłup prawidłowy czworokątny',
    q: T`Krawędź podstawy ostrosłupa prawidłowego czworokątnego ma długość $${a}$, a wysokość ściany bocznej poprowadzona z wierzchołka ostrosłupa ma długość $${hb}$. Oblicz objętość i pole powierzchni całkowitej tego ostrosłupa. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zauważenie trójkąta prostokątnego o bokach $\frac{a}{2}$, $H$, $h_b$ i obliczenie $H = ${H}$.`],
      [2, 'Etap 2', T`Obliczenie objętości: $V = ${V}$.`],
      [3, 'Etap 3', T`Obliczenie pola powierzchni bocznej: $P_b = ${Pb}$.`],
      [4, 'Komplet', T`Obliczenie pola powierzchni całkowitej: $P_c = ${Pc}$.`]
    ],
    steps: [
      T`Spodek wysokości to środek kwadratu; odległość od niego do środka krawędzi podstawy to $\frac{${a}}{2} = ${half}$.`,
      T`$H = \sqrt{${hb}^2 - ${half}^2} = ${H}$.`,
      T`$V = \frac{1}{3} \cdot ${a}^2 \cdot ${H} = ${V}$.`,
      T`$P_b = 4 \cdot \frac{1}{2} \cdot ${a} \cdot ${hb} = ${Pb}$, $P_c = ${a * a} + ${Pb} = ${Pc}$.`
    ],
    trap: T`W trójkącie z wysokością ostrosłupa bierzemy POŁOWĘ krawędzi podstawy ($${half}$), a we wzorze na objętość nie zapominamy o $\frac{1}{3}$.`,
    tip: 'Karta wzorów, str. 25: ostrosłup $V = \\frac{1}{3}P_p \\cdot H$.',
    answer: T`$V = ${V}$, $P_c = ${Pc}$`
  });
};

// ---------- 11.3 Kąty w bryłach (X.2, X.3) i proste skośne (X.1) ----------
const ANGLES = {
  30: { tg: '\\frac{\\sqrt{3}}{3}', hRoot: (a) => [a, 3, '\\sqrt{6}'] },
  45: { tg: '1', hRoot: (a) => [a, 1, '\\sqrt{2}'] },
  60: { tg: '\\sqrt{3}', hRoot: (a) => [a, 1, '\\sqrt{6}'] }
};
const prismAngle = (r) => {
  const a = r.pick([2, 3, 4, 6]);
  const ang = r.pick([30, 45, 60]);
  const [hn, hd, hroot] = ANGLES[ang].hRoot(a);
  const rt = (num, den) => `${fr(num, den) === '1' ? '' : fr(num, den)}${hroot}`;
  const H = rt(hn, hd);
  const Vtex = rt(a * a * hn, hd);
  const Hnum = (hn / hd) * Math.sqrt(hroot === '\\sqrt{6}' ? 6 : 2);
  check(Math.abs(Math.atan(Hnum / (a * Math.SQRT2)) - (ang * Math.PI) / 180) < 1e-9, '11.3');
  return open({
    title: 'Kąt nachylenia przekątnej graniastosłupa',
    q: T`Podstawą graniastosłupa prostego jest kwadrat o boku $${a}$. Przekątna graniastosłupa tworzy z płaszczyzną podstawy kąt o mierze $${ang}^\circ$. Oblicz objętość tego graniastosłupa. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wskazanie kąta między przekątną bryły a przekątną podstawy i obliczenie przekątnej podstawy $${a}\sqrt{2}$.`],
      [2, 'Etap 2', T`Obliczenie wysokości: $H = ${H}$.`],
      [3, 'Komplet', T`Obliczenie objętości: $V = ${Vtex}$.`]
    ],
    steps: [
      T`Kąt między przekątną a płaszczyzną podstawy to kąt między przekątną bryły a jej rzutem – przekątną podstawy $d = ${a}\sqrt{2}$.`,
      T`$\operatorname{tg} ${ang}^\circ = \frac{H}{d}$, więc $H = ${a}\sqrt{2} \cdot ${ANGLES[ang].tg} = ${H}$.`,
      T`$V = ${a}^2 \cdot ${H} = ${Vtex}$.`
    ],
    trap: 'Rzutem przekątnej bryły na podstawę jest przekątna podstawy, a nie jej bok – kąt mierzymy właśnie względem przekątnej podstawy.',
    tip: 'Kąt między prostą a płaszczyzną to kąt między tą prostą a jej rzutem prostokątnym na płaszczyznę.',
    answer: m(`V = ${Vtex}`)
  });
};
const SKEW = [
  ['AB', 'CG', 'AB leży w płaszczyźnie podstawy $ABCD$, a $CG$ przebija tę płaszczyznę w punkcie $C$, który nie leży na prostej $AB$'],
  ['AD', 'BF', 'AD leży w płaszczyźnie podstawy $ABCD$, a $BF$ przebija tę płaszczyznę w punkcie $B$, który nie leży na prostej $AD$'],
  ['EF', 'DH', 'EF leży w płaszczyźnie górnej ściany $EFGH$, a $DH$ przebija tę płaszczyznę w punkcie $H$, który nie leży na prostej $EF$']
];
const cubeSkew = (r) => {
  const a = r.pick([2, 3, 4, 5, 6]);
  const [l1, l2, why] = r.pick(SKEW);
  return open({
    title: 'Proste skośne i przekątna sześcianu',
    q: T`Dany jest sześcian $ABCDEFGH$ o krawędzi $${a}$ (podstawa $ABCD$, krawędzie boczne $AE$, $BF$, $CG$, $DH$). Uzasadnij, że proste $${l1}$ i $${l2}$ są skośne i prostopadłe. Oblicz długość przekątnej $AG$ sześcianu oraz cosinus kąta między przekątną $AG$ a płaszczyzną podstawy. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Uzasadnienie: proste nie mają punktu wspólnego i nie są równoległe (${why}); kierunek $${l2}$ jest prostopadły do podstawy, więc proste są prostopadłe.`],
      [2, 'Etap 2', T`Obliczenie $|AG| = ${a}\sqrt{3}$.`],
      [3, 'Komplet', T`Obliczenie $\cos\alpha = \frac{${a}\sqrt{2}}{${a}\sqrt{3}} = \frac{\sqrt{6}}{3}$.`]
    ],
    zero: ['Samo stwierdzenie „proste są skośne” bez uzasadnienia – 0 pkt za etap 1.'],
    steps: [
      T`Proste skośne nie leżą w jednej płaszczyźnie: ${why}. Krawędź $${l2}$ jest prostopadła do ścian, w których leży $${l1}$, więc kąt między prostymi wynosi $90^\circ$.`,
      T`Przekątna podstawy: $|AC| = ${a}\sqrt{2}$; przekątna sześcianu: $|AG| = \sqrt{${a * a * 2} + ${a * a}} = ${a}\sqrt{3}$.`,
      T`Rzutem $AG$ na podstawę jest $AC$: $\cos\alpha = \frac{|AC|}{|AG|} = \frac{\sqrt{2}}{\sqrt{3}} = \frac{\sqrt{6}}{3}$.`
    ],
    trap: 'Proste skośne nie przecinają się i NIE są równoległe – prostopadłość prostych w przestrzeni nie wymaga punktu wspólnego.',
    tip: 'Sześcian o krawędzi a: przekątna ściany a√2, przekątna sześcianu a√3.',
    answer: T`$|AG| = ${a}\sqrt{3}$, $\cos\alpha = \frac{\sqrt{6}}{3}$`
  });
};

// ---------- 11.4 Bryły obrotowe ----------
const coneTriple = (r) => {
  const [p, q, l] = r.pick(TRIPLES);
  const [rad, H] = r.bool() ? [p, q] : [q, p];
  const V = piTex(rad * rad * H, 3);
  const Pc = piTex(rad * rad + rad * l);
  return open({
    title: 'Objętość i pole powierzchni stożka',
    q: T`Tworząca stożka ma długość $${l}$, a promień jego podstawy jest równy $${rad}$. Oblicz objętość i pole powierzchni całkowitej tego stożka. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie wysokości stożka: $H = ${H}$.`],
      [2, 'Etap 2', T`Obliczenie objętości: $V = ${V}$.`],
      [3, 'Komplet', T`Obliczenie pola powierzchni całkowitej: $P_c = ${Pc}$.`]
    ],
    steps: [
      T`Wysokość, promień i tworząca tworzą trójkąt prostokątny: $H = \sqrt{${l}^2 - ${rad}^2} = ${H}$.`,
      T`$V = \frac{1}{3}\pi r^2 H = \frac{1}{3}\pi \cdot ${rad * rad} \cdot ${H} = ${V}$.`,
      T`$P_c = \pi r^2 + \pi r l = ${piTex(rad * rad)} + ${piTex(rad * l)} = ${Pc}$.`
    ],
    trap: 'We wzorze na pole powierzchni bocznej stożka jest tworząca l, a we wzorze na objętość – wysokość H.',
    tip: 'Karta wzorów, str. 26: stożek $V = \\frac{1}{3}\\pi r^2 H$, $P_b = \\pi r l$.',
    answer: T`$V = ${V}$, $P_c = ${Pc}$`
  });
};
const cylinderSection = (r) => {
  const rad = r.int(2, 6);
  const H = 2 * rad;
  const d2 = H * H + 4 * rad * rad;
  const V = piTex(rad * rad * H);
  const Pc = piTex(2 * rad * rad + 2 * rad * H);
  return open({
    title: 'Walec o przekroju osiowym w kształcie kwadratu',
    q: T`Przekrojem osiowym walca jest kwadrat o przekątnej długości $${sq(d2)}$. Oblicz objętość i pole powierzchni całkowitej tego walca. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie boku kwadratu $${H}$, czyli $H = ${H}$ i $r = ${rad}$.`],
      [2, 'Etap 2', T`Obliczenie objętości: $V = ${V}$.`],
      [3, 'Komplet', T`Obliczenie pola powierzchni całkowitej: $P_c = ${Pc}$.`]
    ],
    steps: [
      T`Bok kwadratu o przekątnej $${sq(d2)}$ ma długość $\frac{${sq(d2)}}{\sqrt{2}} = ${H}$; bok kwadratu to wysokość walca i średnica podstawy: $H = ${H}$, $r = ${rad}$.`,
      T`$V = \pi r^2 H = \pi \cdot ${rad * rad} \cdot ${H} = ${V}$.`,
      T`$P_c = 2\pi r^2 + 2\pi r H = ${piTex(2 * rad * rad)} + ${piTex(2 * rad * H)} = ${Pc}$.`
    ],
    trap: 'Bok przekroju osiowego to ŚREDNICA podstawy, a nie promień – r jest połową boku kwadratu.',
    tip: 'Karta wzorów, str. 26: walec $V = \\pi r^2 H$, $P_c = 2\\pi r^2 + 2\\pi r H$.',
    answer: T`$V = ${V}$, $P_c = ${Pc}$`
  });
};

// ---------- 11.5 Bryły podobne ----------
const similarSolids = (r) => {
  const [kn, kd] = r.pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2]]);
  const P1 = kd * kd * r.int(2, 9);
  const P2 = (P1 * kn * kn) / (kd * kd);
  const V1 = kd ** 3 * r.int(1, 6);
  const V2 = (V1 * kn ** 3) / kd ** 3;
  check(Number.isInteger(P2) && Number.isInteger(V2), '11.5');
  const solid = r.pick(['stożki', 'ostrosłupy', 'walce']);
  return open({
    title: 'Bryły podobne – pole i objętość',
    q: T`Dwa ${solid} są podobne. Pole powierzchni całkowitej mniejszej bryły jest równe $${P1}$, a większej – $${P2}$. Objętość mniejszej bryły jest równa $${V1}$. Oblicz objętość większej bryły. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie skali podobieństwa: $k^2 = \frac{${P2}}{${P1}}$, $k = ${fr(kn, kd)}$.`],
      [2, 'Komplet', T`Obliczenie objętości większej bryły: $V = ${V2}$.`]
    ],
    steps: [
      T`Stosunek pól brył podobnych to $k^2$: $k^2 = \frac{${P2}}{${P1}} = ${fr(kn * kn, kd * kd)}$, więc $k = ${fr(kn, kd)}$.`,
      T`Stosunek objętości to $k^3 = ${fr(kn ** 3, kd ** 3)}$: $V = ${V1} \cdot ${fr(kn ** 3, kd ** 3)} = ${V2}$.`
    ],
    trap: 'Pola zmieniają się jak k², a objętości jak k³ – nie mnóż objętości przez stosunek pól.',
    tip: 'Bryły podobne w skali k: stosunek pól = k², stosunek objętości = k³.',
    answer: m(`V = ${V2}`)
  });
};

// ---------- 12.1 Reguła mnożenia ----------
const DIGIT_SETS = [
  ['nieparzyste', [1, 3, 5, 7, 9]],
  ['ze zbioru $\\{0, 1, 2, 3, 4\\}$', [0, 1, 2, 3, 4]],
  ['ze zbioru $\\{0, 2, 5, 7, 8\\}$', [0, 2, 5, 7, 8]],
  ['ze zbioru $\\{1, 2, 3, 4, 5, 6\\}$', [1, 2, 3, 4, 5, 6]]
];
const LAST_RULES = [
  ['parzysta', (d) => d % 2 === 0],
  ['podzielna przez $5$', (d) => d % 5 === 0],
  ['nieparzysta', (d) => d % 2 === 1]
];
const multiplyRule = (r) => {
  const n = r.pick([3, 4, 5]);
  const [setName, D] = r.pick(DIGIT_SETS);
  const [ruleName, rule] = r.pick(LAST_RULES);
  const first = D.filter((d) => d !== 0);
  const last = D.filter(rule);
  need(last.length > 0);
  const counts = [first.length, ...Array(n - 2).fill(D.length), last.length];
  const total = counts.reduce((a, b) => a * b, 1);
  const brute = countIf(range(10 ** (n - 1), 10 ** n - 1), (x) => digits(x).every((d) => D.includes(d)) && rule(x % 10));
  check(brute === total, '12.1');
  return open({
    title: 'Reguła mnożenia – liczby o danych cyfrach',
    q: T`Oblicz, ile jest liczb naturalnych ${n}-cyfrowych, których wszystkie cyfry są ${setName}, i które są ${ruleName.startsWith('podzielna') ? 'podzielne przez $5$' : ruleName === 'parzysta' ? 'parzyste' : 'nieparzyste'}. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Ustalenie liczby możliwości na pierwszym miejscu ($${first.length}$) i na ostatnim miejscu ($${last.length}$).`],
      [2, 'Komplet', T`Zastosowanie reguły mnożenia: $${counts.join(' \\cdot ')} = ${total}$.`]
    ],
    steps: [
      T`Pierwsza cyfra nie może być zerem: ${moz(first.length)}. Ostatnia cyfra decyduje o tym, czy liczba jest ${ruleName}: ${moz(last.length)}.`,
      n === 3 ? T`Cyfra środkowa: ${moz(D.length)}.` : T`Każda z pozostałych ${n - 2} cyfr: ${moz(D.length)}.`,
      T`Z reguły mnożenia: $${counts.join(' \\cdot ')} = ${total}$.`
    ],
    trap: D.includes(0) ? 'Zero nie może stać na pierwszym miejscu – na tej pozycji jest o jedną możliwość mniej.' : 'O parzystości i podzielności przez 5 decyduje tylko cyfra jedności – ograniczenie dotyczy ostatniej pozycji.',
    tip: 'Reguła mnożenia: liczbę możliwości dla kolejnych pozycji mnożymy; zacznij od pozycji z ograniczeniami.',
    answer: m(total)
  });
};

// ---------- 12.2 Reguła dodawania (rozbicie na przypadki) ----------
const exactlyOnce = (r) => {
  const k = r.int(0, 9);
  const n = r.pick([3, 4]);
  const cases = range(0, n - 1).map((pos) => {
    if (pos === 0) return k === 0 ? 0 : 9 ** (n - 1);
    return k === 0 ? 9 ** (n - 1) : 8 * 9 ** (n - 2);
  });
  const total = cases.reduce((a, b) => a + b, 0);
  const brute = countIf(range(10 ** (n - 1), 10 ** n - 1), (x) => digits(x).filter((d) => d === k).length === 1);
  check(brute === total, '12.2');
  const caseTxt = cases.map((c, i) => (i === 0 ? (k === 0 ? 'na 1. miejscu – $0$ (zero nie może być pierwsze)' : T`na 1. miejscu – $9^{${n - 1}} = ${c}$`) : k === 0 ? T`na ${i + 1}. miejscu – $9^{${n - 1}} = ${c}$` : T`na ${i + 1}. miejscu – $8 \cdot 9^{${n - 2}} = ${c}$`));
  return open({
    title: 'Reguła dodawania – rozbicie na przypadki',
    q: T`Oblicz, ile jest liczb naturalnych ${n}-cyfrowych, w których zapisie cyfra $${k}$ występuje dokładnie jeden raz. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Rozbicie na przypadki według miejsca cyfry $${k}$ i poprawne zliczenie co najmniej jednego przypadku.`],
      [2, 'Komplet', T`Zsumowanie przypadków: $${cases.join(' + ')} = ${total}$.`]
    ],
    steps: [
      T`Cyfra $${k}$ stoi ${caseTxt.join('; ')}.`,
      T`Na pozostałych miejscach stoją cyfry różne od $${k}$${k === 0 ? '' : ', a pierwsza cyfra nie może być zerem'}.`,
      T`Przypadki się wykluczają, więc je dodajemy: $${cases.join(' + ')} = ${total}$.`
    ],
    trap: k === 0 ? 'Zero nie może stać na pierwszym miejscu – ten przypadek daje 0 liczb.' : T`Gdy $${k}$ nie stoi na pierwszym miejscu, pierwsza cyfra ma tylko $8$ możliwości (nie $0$ i nie $${k}$).`,
    tip: 'Reguła dodawania: rozbij zliczanie na rozłączne przypadki i dodaj ich liczebności.',
    answer: m(total)
  });
};

// ---------- 12.3 Liczby o zadanych własnościach ----------
const noDigitDiv5 = (r) => {
  const c = r.int(0, 9);
  const n = r.pick([3, 4]);
  const first = range(1, 9).filter((d) => d !== c).length;
  const mid = range(0, 9).filter((d) => d !== c).length;
  const last = [0, 5].filter((d) => d !== c).length;
  const counts = [first, ...Array(n - 2).fill(mid), last];
  const total = counts.reduce((a, b) => a * b, 1);
  const brute = countIf(range(10 ** (n - 1), 10 ** n - 1), (x) => x % 5 === 0 && !digits(x).includes(c));
  check(brute === total, '12.3');
  return open({
    title: 'Liczby podzielne przez 5 bez danej cyfry',
    q: T`Oblicz, ile jest liczb naturalnych ${n}-cyfrowych podzielnych przez $5$, w których zapisie nie występuje cyfra $${c}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Ustalenie liczby możliwości dla cyfry jedności ($${last}$) i dla pierwszej cyfry ($${first}$).`],
      [2, 'Komplet', T`Obliczenie: $${counts.join(' \\cdot ')} = ${total}$.`]
    ],
    steps: [
      T`Liczba podzielna przez $5$ kończy się cyfrą $0$ lub $5$; bez cyfry $${c}$ zostaje ${moz(last)}.`,
      T`Pierwsza cyfra: od $1$ do $9$ bez $${c}$ – ${moz(first)}; ${n > 3 ? 'każda z pozostałych cyfr' : 'cyfra środkowa'}: ${moz(mid)}.`,
      T`Z reguły mnożenia: $${counts.join(' \\cdot ')} = ${total}$.`
    ],
    trap: c === 0 || c === 5 ? T`Bez cyfry $${c}$ liczba podzielna przez 5 musi kończyć się cyfrą $${c === 0 ? 5 : 0}$ – zostaje jedna możliwość.` : 'Zakaz cyfry dotyczy każdej pozycji, także pierwszej (tam i tak nie może być zera).',
    tip: 'Podzielność przez 5: cyfra jedności 0 lub 5.',
    answer: m(total)
  });
};

// ---------- 12.4 Ustawienia bez powtórzeń ----------
const queueArrangements = (r) => {
  const n = r.pick([4, 5, 6]);
  const kind = r.pick(['obok', 'nieObok', 'skraj']);
  const people = range(0, n - 1);
  const ps = perms(people);
  const adj = (p) => Math.abs(p.indexOf(0) - p.indexOf(1)) === 1;
  const brute = kind === 'obok' ? countIf(ps, adj) : kind === 'nieObok' ? countIf(ps, (p) => !adj(p)) : countIf(ps, (p) => p[0] === 0 || p[n - 1] === 0);
  const total = kind === 'obok' ? 2 * fact(n - 1) : kind === 'nieObok' ? fact(n) - 2 * fact(n - 1) : 2 * fact(n - 1);
  check(brute === total, '12.4');
  const cond = { obok: 'Ania i Bartek stali obok siebie', nieObok: 'Ania i Bartek nie stali obok siebie', skraj: 'Ania stała na jednym z końców kolejki' }[kind];
  const who = { 4: 'Cztery osoby, wśród nich Ania i Bartek, ustawiają', 5: 'Pięć osób, wśród nich Ania i Bartek, ustawia', 6: 'Sześć osób, wśród nich Ania i Bartek, ustawia' }[n];
  return open({
    title: 'Ustawienia osób w kolejce',
    q: T`${who} się w kolejce. Oblicz, na ile sposobów mogą się ustawić tak, aby ${cond}. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', kind === 'nieObok' ? T`Obliczenie wszystkich ustawień $${n}! = ${fact(n)}$ i ustawień „obok siebie” $2 \cdot ${n - 1}! = ${2 * fact(n - 1)}$.` : kind === 'obok' ? T`Potraktowanie pary Ania–Bartek jako jednego elementu: $${n - 1}! = ${fact(n - 1)}$ ustawień.` : T`Ustalenie miejsca Ani: $2$ możliwości.`],
      [2, 'Komplet', T`Wynik: $${total}$.`]
    ],
    steps: [
      kind === 'obok'
        ? T`Parę Ania–Bartek traktujemy jak jedną osobę: ustawiamy $${n - 1}$ „elementów” na $${n - 1}! = ${fact(n - 1)}$ sposobów, a w parze osoby mogą się zamienić na $2$ sposoby.`
        : kind === 'nieObok'
          ? T`Wszystkich ustawień jest $${n}! = ${fact(n)}$; ustawień, w których stoją obok siebie: $2 \cdot ${n - 1}! = ${2 * fact(n - 1)}$.`
          : T`Ania stoi na pierwszym albo na ostatnim miejscu – $2$ możliwości; pozostałe $${n - 1}$ ${pl(n - 1, 'osobę', 'osoby', 'osób')} ustawiamy na $${n - 1}! = ${fact(n - 1)}$ sposobów.`,
      kind === 'obok' ? T`$2 \cdot ${fact(n - 1)} = ${total}$.` : kind === 'nieObok' ? T`Zdarzenie przeciwne: $${fact(n)} - ${2 * fact(n - 1)} = ${total}$.` : T`$2 \cdot ${fact(n - 1)} = ${total}$.`
    ],
    trap: kind === 'obok' ? 'W „sklejonej” parze osoby mogą stać w dwóch kolejnościach – nie zapomnij pomnożyć przez 2.' : kind === 'nieObok' ? 'Łatwiej policzyć ustawienia „obok siebie” i odjąć je od wszystkich, niż zliczać bezpośrednio.' : 'Kolejka ma dwa końce – Ania może stać na pierwszym albo na ostatnim miejscu.',
    tip: 'Liczba ustawień n różnych elementów w ciąg: n! = 1 · 2 · … · n.',
    answer: m(total)
  });
};

// ---------- 12.5 Pary i dopełnienie ----------
const atLeastOne = (r) => {
  const n = r.pick([3, 4]);
  const kind = r.pick(['parzysta', 'k']);
  const k = r.int(1, 9);
  const all = 9 * 10 ** (n - 1);
  const none = kind === 'parzysta' ? 5 ** n : 8 * 9 ** (n - 1);
  const total = all - none;
  const brute = countIf(range(10 ** (n - 1), 10 ** n - 1), (x) => (kind === 'parzysta' ? digits(x).some((d) => d % 2 === 0) : digits(x).includes(k)));
  check(brute === total, '12.5');
  const prop = kind === 'parzysta' ? 'co najmniej jedna cyfra jest parzysta' : T`co najmniej raz występuje cyfra $${k}$`;
  return open({
    title: 'Zliczanie przez dopełnienie',
    q: T`Oblicz, ile jest liczb naturalnych ${n}-cyfrowych, w których zapisie ${prop}. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie liczby wszystkich liczb ${n}-cyfrowych ($${all}$) i liczby tych, które nie mają tej własności ($${none}$).`],
      [2, 'Komplet', T`Obliczenie: $${all} - ${none} = ${total}$.`]
    ],
    steps: [
      T`Wszystkich liczb ${n}-cyfrowych jest $9 \cdot 10^{${n - 1}} = ${all}$.`,
      kind === 'parzysta' ? T`Liczb o samych cyfrach nieparzystych jest $5^{${n}} = ${none}$.` : T`Liczb bez cyfry $${k}$: pierwsza cyfra – $8$ możliwości, pozostałe – po $9$: $8 \cdot 9^{${n - 1}} = ${none}$.`,
      T`Szukanych liczb: $${all} - ${none} = ${total}$.`
    ],
    trap: '„Co najmniej jedna” – policz dopełnienie („żadna”) i odejmij od wszystkich, zamiast rozpisywać wiele przypadków.',
    tip: 'Dopełnienie: |A| = |wszystkie| − |nie A|.',
    answer: m(total)
  });
};

// ---------- 13.x Prawdopodobieństwo ----------
const probOpen = (o) =>
  open({
    title: o.title,
    q: o.q,
    stages: [
      [1, 'Etap 1', T`Obliczenie liczby wszystkich zdarzeń elementarnych $|\Omega| = ${o.omega}$ i liczby zdarzeń sprzyjających $|A| = ${o.fav}$.`],
      [2, 'Komplet', T`Obliczenie prawdopodobieństwa: $P(A) = ${fr(o.fav, o.omega)}$.`]
    ],
    zero: ['Podanie samego wyniku bez wyznaczenia |Ω| i |A| (lub ich wypisania) – 0 pkt.'],
    steps: [...o.steps, fr(o.fav, o.omega) === `\\frac{${o.fav}}{${o.omega}}` ? T`$P(A) = \frac{${o.fav}}{${o.omega}}$.` : T`$P(A) = \frac{${o.fav}}{${o.omega}} = ${fr(o.fav, o.omega)}$.`],
    trap: o.trap,
    tip: 'Karta wzorów, str. 29: w modelu klasycznym $P(A) = \\frac{|A|}{|\\Omega|}$.',
    answer: m(`P(A) = ${fr(o.fav, o.omega)}`)
  });
const divisibleOr = (r) => {
  const N = r.pick([30, 40, 50, 60, 100]);
  const [a, b] = r.pick([[2, 3], [3, 5], [2, 5], [4, 6], [3, 4]]);
  const fav = countIf(range(1, N), (x) => x % a === 0 || x % b === 0);
  const [na, nb, nab] = [Math.floor(N / a), Math.floor(N / b), countIf(range(1, N), (x) => x % a === 0 && x % b === 0)];
  check(na + nb - nab === fav, '13.1');
  return probOpen({
    title: 'Prawdopodobieństwo – podzielność',
    q: T`Ze zbioru liczb $\{1, 2, 3, \ldots, ${N}\}$ losujemy jedną liczbę. Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że wylosowana liczba jest podzielna przez $${a}$ lub przez $${b}$. Zapisz obliczenia.`,
    omega: N,
    fav,
    steps: [T`$|\Omega| = ${N}$. Liczb podzielnych przez $${a}$: $${na}$, przez $${b}$: $${nb}$, przez obie jednocześnie: $${nab}$.`, T`$|A| = ${na} + ${nb} - ${nab} = ${fav}$.`],
    trap: T`Liczby podzielne jednocześnie przez $${a}$ i $${b}$ policzyliśmy dwa razy – trzeba je raz odjąć.`
  });
};
const DICE_EVENTS = [
  ['suma oczek jest równa $S$', (x, y, s) => x + y === s, [5, 6, 7, 8, 9]],
  ['suma oczek jest większa od $S$', (x, y, s) => x + y > s, [7, 8, 9]],
  ['iloczyn oczek jest podzielny przez $S$', (x, y, s) => (x * y) % s === 0, [3, 4, 6]],
  ['liczby oczek różnią się o $S$', (x, y, s) => Math.abs(x - y) === s, [1, 2, 3]]
];
const twoDice = (r) => {
  const [desc, f, Ss] = r.pick(DICE_EVENTS);
  const s = r.pick(Ss);
  const pairs = range(1, 6).flatMap((x) => range(1, 6).map((y) => [x, y]));
  const favPairs = pairs.filter(([x, y]) => f(x, y, s));
  const list = favPairs.length <= 12 ? favPairs.map(([x, y]) => `(${x}, ${y})`).join(', ') : null;
  return probOpen({
    title: 'Dwukrotny rzut kostką',
    q: T`Rzucamy dwa razy symetryczną sześcienną kostką do gry. Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że ${desc.replace('$S$', `$${s}$`)}. Zapisz obliczenia.`,
    omega: 36,
    fav: favPairs.length,
    steps: [T`Zdarzenia elementarne to pary $(a, b)$ wyników: $|\Omega| = 6 \cdot 6 = 36$.`, list ? T`Zdarzenia sprzyjające: $${list}$ – jest ich $${favPairs.length}$.` : T`Zliczamy pary spełniające warunek (np. w tabeli $6 \times 6$): $|A| = ${favPairs.length}$.`],
    trap: 'Pary (1, 2) i (2, 1) to RÓŻNE zdarzenia elementarne – rzut pierwszy i drugi rozróżniamy.'
  });
};
const TWO_DIGIT_EVENTS = [
  ['cyfra dziesiątek jest większa od cyfry jedności', (t, u) => t > u],
  ['suma cyfr jest równa $9$', (t, u) => t + u === 9],
  ['iloczyn cyfr jest równy $0$', (t, u) => t * u === 0],
  ['obie cyfry są parzyste', (t, u) => t % 2 === 0 && u % 2 === 0],
  ['cyfra jedności jest dwa razy większa od cyfry dziesiątek', (t, u) => u === 2 * t]
];
const drawTwoDigit = (r) => {
  const [desc, f] = r.pick(TWO_DIGIT_EVENTS);
  const fav = countIf(range(10, 99), (x) => f(Math.floor(x / 10), x % 10));
  return probOpen({
    title: 'Losowanie liczby dwucyfrowej',
    q: T`Ze zbioru wszystkich liczb naturalnych dwucyfrowych losujemy jedną liczbę. Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że w wylosowanej liczbie ${desc}. Zapisz obliczenia.`,
    omega: 90,
    fav,
    steps: [T`Liczb dwucyfrowych jest $90$ (od $10$ do $99$), więc $|\Omega| = 90$.`, T`Zliczamy liczby spełniające warunek (np. dla każdej cyfry dziesiątek osobno): $|A| = ${fav}$.`],
    trap: 'Liczb dwucyfrowych jest 90, a nie 99 ani 100 – pierwsza cyfra nie może być zerem.'
  });
};
const urnTwo = (r) => {
  const w = r.int(2, 6);
  const c = r.int(2, 6);
  const kind = r.pick(['same', 'diff']);
  const balls = [...Array(w).fill('b'), ...Array(c).fill('c')];
  const n = balls.length;
  let fav = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && (kind === 'same') === (balls[i] === balls[j])) fav++;
  const omega = n * (n - 1);
  check(fav === (kind === 'same' ? w * (w - 1) + c * (c - 1) : 2 * w * c), '13.4');
  return probOpen({
    title: 'Losowanie dwóch kul bez zwracania',
    q: T`W urnie jest $${w}$ kul białych i $${c}$ kul czarnych. Losujemy kolejno bez zwracania dwie kule. Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że wylosujemy kule ${kind === 'same' ? 'tego samego koloru' : 'różnych kolorów'}. Zapisz obliczenia.`,
    omega,
    fav,
    steps: [
      T`Losujemy kolejno bez zwracania: $|\Omega| = ${n} \cdot ${n - 1} = ${omega}$.`,
      kind === 'same' ? T`Dwie białe: $${w} \cdot ${w - 1} = ${w * (w - 1)}$, dwie czarne: $${c} \cdot ${c - 1} = ${c * (c - 1)}$; $|A| = ${fav}$.` : T`Biała, potem czarna: $${w} \cdot ${c}$; czarna, potem biała: $${c} \cdot ${w}$; $|A| = ${fav}$.`
    ],
    trap: 'Bez zwracania druga kula wybierana jest spośród o jedną mniejszej liczby kul – |Ω| = n(n − 1), a nie n².'
  });
};
const complementDice = (r) => {
  const k = r.pick([5, 6, 3, 4]);
  const kind = k >= 5 ? 'value' : 'div';
  const good = (x) => (kind === 'value' ? x === k : x % k === 0);
  const pairs = range(1, 6).flatMap((x) => range(1, 6).map((y) => [x, y]));
  const fav = countIf(pairs, ([x, y]) => good(x) || good(y));
  const bad = 36 - fav;
  const per = 6 - countIf(range(1, 6), good);
  check(bad === per * per, '13.5');
  return probOpen({
    title: 'Zdarzenie przeciwne',
    q: T`Rzucamy dwa razy symetryczną sześcienną kostką do gry. Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że co najmniej raz wypadnie ${kind === 'value' ? `${k} oczek` : `liczba oczek podzielna przez $${k}$`}. Zapisz obliczenia.`,
    omega: 36,
    fav,
    steps: [
      T`$|\Omega| = 36$. Zdarzenie przeciwne $A'$: w żadnym rzucie nie wypada ${kind === 'value' ? `${k} oczek` : `liczba podzielna przez $${k}$`} – w każdym rzucie $${per}$ możliwości, więc $|A'| = ${per} \cdot ${per} = ${bad}$.`,
      T`$|A| = 36 - ${bad} = ${fav}$.`
    ],
    trap: '„Co najmniej raz” – policz zdarzenie przeciwne („ani razu”) i skorzystaj z P(A) = 1 − P(A′).'
  });
};

// ---------- 14.x Statystyka ----------
const meanUnknown = (r) => {
  const n = r.pick([5, 6, 7]);
  const data = Array.from({ length: n - 1 }, () => r.int(1, 12));
  const mean = r.int(4, 9);
  const x = mean * n - data.reduce((a, b) => a + b, 0);
  need(x >= 1 && x <= 20);
  const all = [...data, x].sort((a, b) => a - b);
  const med = n % 2 ? all[(n - 1) / 2] : (all[n / 2 - 1] + all[n / 2]) / 2;
  return open({
    title: 'Średnia arytmetyczna i mediana',
    q: T`Średnia arytmetyczna zestawu danych: $${data.join(', ')}, x$ jest równa $${mean}$. Oblicz $x$ oraz medianę tego zestawu danych. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie równania $\frac{${data.join(' + ')} + x}{${n}} = ${mean}$ i obliczenie $x = ${x}$.`],
      [2, 'Komplet', T`Uporządkowanie danych i obliczenie mediany: $${dec(med)}$.`]
    ],
    steps: [
      T`$\frac{${data.reduce((a, b) => a + b, 0)} + x}{${n}} = ${mean}$, więc $${data.reduce((a, b) => a + b, 0)} + x = ${mean * n}$ i $x = ${x}$.`,
      T`Dane uporządkowane: $${all.join(', ')}$.`,
      n % 2 ? T`Liczba danych nieparzysta – mediana to środkowa wartość: $${dec(med)}$.` : T`Liczba danych parzysta – mediana to średnia dwóch środkowych: $\frac{${all[n / 2 - 1]} + ${all[n / 2]}}{2} = ${dec(med)}$.`
    ],
    trap: 'Przed wyznaczeniem mediany dane trzeba UPORZĄDKOWAĆ – środkowa liczba z treści zadania nie musi być medianą.',
    tip: 'Karta wzorów, str. 30: średnia $\\bar{x} = \\frac{x_1 + \\ldots + x_n}{n}$; mediana – wartość środkowa danych uporządkowanych.',
    answer: T`$x = ${x}$, mediana $${dec(med)}$`
  });
};
const weightedUnknown = (r) => {
  const grades = [2, 3, 4, 5, 6];
  const counts = grades.map(() => r.int(1, 6));
  const idx = r.int(0, 4);
  const k = counts[idx];
  const sum = grades.reduce((s, g, i) => s + g * counts[i], 0);
  const N = counts.reduce((a, b) => a + b, 0);
  need((sum * 100) % N === 0);
  const mean = sum / N;
  const known = counts.map((c, i) => (i === idx ? 'k' : c));
  const restSum = sum - grades[idx] * k;
  const restN = N - k;
  // (restSum + g k) / (restN + k) = mean  ->  k (g - mean) = mean restN - restSum
  check(Math.abs(k * (grades[idx] - mean) - (mean * restN - restSum)) < 1e-9 && grades[idx] !== mean, '14.2');
  return open({
    title: 'Średnia ważona z niewiadomą liczebnością',
    q: T`W tabeli przedstawiono oceny z klasówki: ocena $2$ – $${known[0]}$ osób, $3$ – $${known[1]}$, $4$ – $${known[2]}$, $5$ – $${known[3]}$, $6$ – $${known[4]}$. Średnia ocen w klasie jest równa $${dec(mean)}$. Oblicz $k$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie równania: $\frac{${restSum} + ${grades[idx]}k}{${restN} + k} = ${dec(mean)}$.`],
      [2, 'Komplet', T`Rozwiązanie równania: $k = ${k}$.`]
    ],
    steps: [
      T`Suma ocen bez niewiadomej grupy: $${restSum}$, liczba osób: $${restN}$.`,
      T`$${restSum} + ${grades[idx]}k = ${dec(mean)}(${restN} + k)$, czyli $${dec(grades[idx] - mean)}k = ${dec(mean * restN - restSum)}$.`,
      T`$k = ${k}$.`
    ],
    trap: 'Średnia ważona: każdą ocenę mnożymy przez liczbę osób, które ją otrzymały, i dzielimy przez liczbę WSZYSTKICH osób (razem z k).',
    tip: 'Karta wzorów, str. 30: średnia ważona $\\frac{w_1x_1 + \\ldots + w_nx_n}{w_1 + \\ldots + w_n}$.',
    answer: m(`k = ${k}`)
  });
};
const medianUnknown = (r) => {
  const n = r.pick([6, 8]);
  const base = Array.from({ length: n - 1 }, () => r.int(1, 15)).sort((a, b) => a - b);
  need(new Set(base).size === n - 1);
  // x wstawiamy jako jedną z dwóch środkowych liczb
  const lo = base[n / 2 - 2];
  const hi = base[n / 2 - 1];
  const x = r.int(lo, hi);
  const all = [...base, x].sort((a, b) => a - b);
  const med = (all[n / 2 - 1] + all[n / 2]) / 2;
  need(Number.isInteger(med * 2));
  // jednoznaczność: x wynika z mediany, gdy x leży między lo i hi
  for (const y of range(lo, hi)) {
    const s = [...base, y].sort((a, b) => a - b);
    if (y !== x) check((s[n / 2 - 1] + s[n / 2]) / 2 !== med, '14.3');
  }
  const mean = all.reduce((a, b) => a + b, 0) / n;
  need(Number.isInteger(mean * 100));
  return open({
    title: 'Mediana z niewiadomą',
    q: T`Dany jest zestaw danych: $${base.slice(0, n / 2 - 1).join(', ')}, x, ${base.slice(n / 2 - 1).join(', ')}$, uporządkowany niemalejąco. Mediana tego zestawu jest równa $${dec(med)}$. Oblicz $x$ oraz średnią arytmetyczną zestawu. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie równania: $\frac{x + ${hi}}{2} = ${dec(med)}$ (dwie środkowe liczby to $x$ i $${hi}$).`],
      [2, 'Komplet', T`Obliczenie $x = ${x}$ i średniej $${dec(mean, 2)}$.`]
    ],
    steps: [
      T`Danych jest $${n}$ (parzyście), więc mediana to średnia ${n / 2}. i ${n / 2 + 1}. wyrazu: $x$ i $${hi}$.`,
      T`$\frac{x + ${hi}}{2} = ${dec(med)}$, więc $x = ${x}$.`,
      T`Średnia: $\frac{${all.reduce((a, b) => a + b, 0)}}{${n}} = ${dec(mean, 2)}$.`
    ],
    trap: 'Przy parzystej liczbie danych mediana to średnia DWÓCH środkowych wartości.',
    tip: 'Mediana danych uporządkowanych: środkowy wyraz (n nieparzyste) albo średnia dwóch środkowych (n parzyste).',
    answer: T`$x = ${x}$, średnia $${dec(mean, 2)}$`
  });
};
const modeTable = (r) => {
  const vals = r.shuffle([1, 2, 3, 4, 5]).slice(0, 4).sort((a, b) => a - b);
  const cnt = vals.map(() => r.int(1, 7));
  const mx = Math.max(...cnt);
  need(cnt.filter((c) => c === mx).length === 1);
  const N = cnt.reduce((a, b) => a + b, 0);
  const sum = vals.reduce((s, v, i) => s + v * cnt[i], 0);
  need(Number.isInteger((sum * 100) / N));
  const mode = vals[cnt.indexOf(mx)];
  const flat = vals.flatMap((v, i) => Array(cnt[i]).fill(v));
  const med = N % 2 ? flat[(N - 1) / 2] : (flat[N / 2 - 1] + flat[N / 2]) / 2;
  return open({
    title: 'Dominanta, średnia i mediana z tabeli',
    q: T`Uczniowie podali, ile książek przeczytali w wakacje: ${vals.map((v, i) => `$${v}$ – $${cnt[i]}$ ${cnt[i] === 1 ? 'osoba' : cnt[i] < 5 ? 'osoby' : 'osób'}`).join(', ')}. Wyznacz dominantę, średnią arytmetyczną i medianę liczby przeczytanych książek. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie dominanty: $${mode}$ i obliczenie średniej: $${dec(sum / N, 2)}$.`],
      [2, 'Komplet', T`Wyznaczenie mediany: $${dec(med)}$.`]
    ],
    steps: [
      T`Dominanta to wartość o największej liczebności: $${mode}$ (liczebność $${mx}$).`,
      T`Średnia: $\frac{${vals.map((v, i) => `${v} \\cdot ${cnt[i]}`).join(' + ')}}{${N}} = \frac{${sum}}{${N}} = ${dec(sum / N, 2)}$.`,
      T`Danych jest $${N}$; mediana to ${N % 2 ? `${(N + 1) / 2}. wartość` : `średnia ${N / 2}. i ${N / 2 + 1}. wartości`} uporządkowanych danych: $${dec(med)}$.`
    ],
    trap: 'Dominanta to WARTOŚĆ (liczba książek), a nie liczebność – nie podawaj liczby osób jako dominanty.',
    tip: 'Dominanta – wartość występująca najczęściej; mediana – wartość środkowa danych uporządkowanych.',
    answer: T`dominanta $${mode}$, średnia $${dec(sum / N, 2)}$, mediana $${dec(med)}$`
  });
};
const percentTable = (r) => {
  const grades = [1, 2, 3, 4, 5, 6];
  const cnt = grades.map(() => r.int(0, 8));
  const N = cnt.reduce((a, b) => a + b, 0);
  need(N >= 10 && [20, 25, 40, 50, 10, 16, 32].includes(N) && cnt[0] + cnt[5] > 0);
  const atLeast4 = cnt[3] + cnt[4] + cnt[5];
  const pct = (atLeast4 * 100) / N;
  need(Number.isInteger(pct * 10));
  const sum = grades.reduce((s, g, i) => s + g * cnt[i], 0);
  return open({
    title: 'Odczytywanie danych z tabeli',
    q: T`W tabeli zestawiono oceny z pracy klasowej: ${grades.map((g, i) => `ocena $${g}$ – $${cnt[i]}$`).join(', ')}. Oblicz, jaki procent uczniów otrzymał ocenę co najmniej $4$, oraz oblicz średnią ocen. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie liczby uczniów ($${N}$) i liczby ocen co najmniej $4$ ($${atLeast4}$), a stąd $${dec(pct, 1)}\%$.`],
      [2, 'Komplet', T`Obliczenie średniej: $${dec(sum / N, 2)}$.`]
    ],
    steps: [
      T`Wszystkich uczniów: $${cnt.join(' + ')} = ${N}$; ocen co najmniej $4$: $${cnt[3]} + ${cnt[4]} + ${cnt[5]} = ${atLeast4}$.`,
      T`$\frac{${atLeast4}}{${N}} \cdot 100\% = ${dec(pct, 1)}\%$.`,
      T`Średnia: $\frac{${sum}}{${N}} = ${dec(sum / N, 2)}$.`
    ],
    trap: '„Co najmniej 4” obejmuje oceny 4, 5 i 6 – razem z czwórką.',
    tip: 'Procent: część / całość · 100%.',
    answer: T`$${dec(pct, 1)}\%$, średnia $${dec(sum / N, 2)}$`
  });
};

// ---------- 15.x Optymalizacja ----------
const optOpen = (o) =>
  open({
    title: o.title,
    q: o.q,
    stages: [
      [1, 'Etap 1', o.model],
      [2, 'Etap 2', o.domain],
      [3, 'Etap 3', o.vertex],
      [4, 'Komplet', o.final]
    ],
    zero: ['Odczytanie wyniku z tabeli kilku wartości bez uzasadnienia, że jest to wartość największa (najmniejsza) – co najwyżej 1 pkt.'],
    steps: o.steps,
    trap: o.trap,
    tip: 'Optymalizacja: zapisz funkcję jednej zmiennej, ustal dziedzinę, wyznacz wierzchołek paraboli i sprawdź, czy należy do dziedziny.',
    answer: o.answer
  });
const rectPerimeter = (r) => {
  const L = 4 * r.int(5, 30);
  const half = L / 2;
  const x = half / 2;
  const P = x * x;
  let best = 0;
  for (let t = 0; t <= half; t += 0.5) best = Math.max(best, t * (half - t));
  check(best === P, '15.1');
  return optOpen({
    title: 'Największe pole prostokąta o danym obwodzie',
    q: T`Z drutu o długości $${L}$ cm wygięto ramkę w kształcie prostokąta. Oblicz wymiary prostokąta, którego pole jest największe, oraz to największe pole. Zapisz obliczenia.`,
    model: T`Zapisanie pola jako funkcji jednej zmiennej: $P(x) = x(${half} - x)$.`,
    domain: T`Określenie dziedziny: $x \in (0, ${half})$.`,
    vertex: T`Wyznaczenie pierwszej współrzędnej wierzchołka: $x = ${x}$.`,
    final: T`Wymiary $${x}$ cm $\times$ $${x}$ cm, największe pole $${P}$ cm$^2$.`,
    steps: [
      T`Boki: $x$ i $${half} - x$ (połowa obwodu to $${half}$).`,
      T`$P(x) = x(${half} - x) = -x^2 + ${half}x$, $x \in (0, ${half})$.`,
      T`Parabola ma ramiona w dół; $x_w = \frac{-${half}}{-2} = ${x}$ należy do dziedziny.`,
      T`Drugi bok: $${half} - ${x} = ${x}$; $P_{\max} = ${x} \cdot ${x} = ${P}$.`
    ],
    trap: T`Suma DWÓCH sąsiednich boków to połowa obwodu ($${half}$), a nie cały obwód.`,
    answer: T`kwadrat $${x} \times ${x}$, $P_{\max} = ${P}$ cm$^2$`
  });
};
const sumSquares = (r) => {
  const S = 5 * r.int(2, 12);
  // x + 2y = S, x, y >= 0; f(y) = (S - 2y)^2 + y^2 = 5y^2 - 4Sy + S^2
  const y = (2 * S) / 5;
  const x = S - 2 * y;
  const fmin = x * x + y * y;
  let best = Infinity;
  for (let t = 0; t <= S / 2; t += 0.5) best = Math.min(best, (S - 2 * t) ** 2 + t * t);
  check(Math.abs(best - fmin) < 1e-9, '15.2');
  return optOpen({
    title: 'Najmniejsza suma kwadratów',
    q: T`Liczby nieujemne $x$ i $y$ spełniają warunek $x + 2y = ${S}$. Wyznacz te liczby, dla których suma $x^2 + y^2$ jest najmniejsza, i oblicz tę najmniejszą sumę. Zapisz obliczenia.`,
    model: T`Zapisanie funkcji jednej zmiennej: $f(y) = (${S} - 2y)^2 + y^2 = ${poly([[5, 'y^2'], [-4 * S, 'y'], [S * S, '']])}$.`,
    domain: T`Określenie dziedziny: $y \in \langle 0, ${dec(S / 2)} \rangle$ (bo $x = ${S} - 2y \ge 0$).`,
    vertex: T`Wyznaczenie wierzchołka: $y = \frac{${4 * S}}{10} = ${y}$ – należy do dziedziny.`,
    final: T`$x = ${x}$, $y = ${y}$, najmniejsza suma $${fmin}$.`,
    steps: [
      T`$x = ${S} - 2y$, a warunek $x \ge 0$ daje $y \le ${dec(S / 2)}$.`,
      T`$f(y) = (${S} - 2y)^2 + y^2 = ${poly([[5, 'y^2'], [-4 * S, 'y'], [S * S, '']])}$, $y \in \langle 0, ${dec(S / 2)} \rangle$.`,
      T`$y_w = \frac{${4 * S}}{2 \cdot 5} = ${y}$; ramiona paraboli w górę, więc w wierzchołku jest minimum.`,
      T`$x = ${S} - ${2 * y} = ${x}$; $x^2 + y^2 = ${x * x} + ${y * y} = ${fmin}$.`
    ],
    trap: 'Dziedzina wynika z warunków zadania (x ≥ 0, y ≥ 0) – sprawdź, czy wierzchołek do niej należy.',
    answer: T`$x = ${x}$, $y = ${y}$, minimum $${fmin}$`
  });
};
const fenceWall = (r) => {
  const k = r.int(0, 3); // liczba przegród
  const c = k + 2; // odcinki prostopadłe do muru
  const L = 2 * c * r.int(3, 12);
  const x = L / (2 * c);
  const y = L - c * x;
  const P = x * y;
  let best = 0;
  for (let t = 0; t <= L / c; t += 0.5) best = Math.max(best, t * (L - c * t));
  check(best === P, '15.3');
  const przeg = k === 0 ? '' : ` i podzielić ${k === 1 ? 'jedną przegrodą prostopadłą' : `${k} przegrodami prostopadłymi`} do muru na ${k + 1} części`;
  return optOpen({
    title: 'Ogrodzenie przy murze',
    q: T`Z siatki o długości $${L}$ m trzeba ogrodzić z trzech stron prostokątny wybieg przylegający czwartym bokiem do muru${przeg}. Oblicz wymiary wybiegu o największym polu. Zapisz obliczenia.`,
    model: T`Zapisanie zależności $${c}x + y = ${L}$ i pola $P(x) = x(${L} - ${c}x)$, gdzie $x$ – długość odcinka prostopadłego do muru.`,
    domain: T`Określenie dziedziny: $x \in (0, ${fr(L, c)})$.`,
    vertex: T`Wyznaczenie wierzchołka: $x = ${x}$.`,
    final: T`Wymiary: $${x}$ m (prostopadle do muru) i $${y}$ m (równolegle), pole $${P}$ m$^2$.`,
    steps: [
      T`Prostopadle do muru ${pl(c, 'biegnie', 'biegną', 'biegnie')} $${c}$ ${pl(c, 'odcinek', 'odcinki', 'odcinków')} siatki długości $x$ (dwa boki${k ? ` i ${k} ${k === 1 ? 'przegroda' : 'przegrody'}` : ''}), równolegle – jeden bok $y$: $${c}x + y = ${L}$.`,
      T`$P(x) = x(${L} - ${c}x) = ${poly([[-c, 'x^2'], [L, 'x']])}$, $x \in (0, ${fr(L, c)})$.`,
      T`$x_w = \frac{-${L}}{-${2 * c}} = ${x}$; ramiona w dół – maksimum.`,
      T`$y = ${L} - ${c} \cdot ${x} = ${y}$, $P_{\max} = ${x} \cdot ${y} = ${P}$.`
    ],
    trap: T`Przy murze ogradzamy tylko trzy boki, a każda przegroda to dodatkowy odcinek długości $x$ – stąd $${c}x$, a nie $2x$.`,
    answer: T`$${x}$ m $\times$ $${y}$ m, $P_{\max} = ${P}$ m$^2$`
  });
};
const revenue = (r) => {
  const c = r.pick([20, 30, 40, 50, 60]);
  const d = r.pick([2, 4, 5, 10]);
  const n = r.pick([40, 60, 80, 100, 120]);
  // obniżka o x zł: cena c - x, sprzedaż n + d x; R(x) = (c - x)(n + d x)
  const xw = (d * c - n) / (2 * d);
  need(Number.isInteger(xw) && xw > 0 && xw < c);
  const R = (c - xw) * (n + d * xw);
  let best = 0;
  for (let t = 0; t <= c; t++) best = Math.max(best, (c - t) * (n + d * t));
  check(best === R, '15.4');
  return optOpen({
    title: 'Cena dająca największy przychód',
    q: T`Kawiarnia sprzedaje dziennie $${n}$ porcji ciasta po $${c}$ zł. Z badań wynika, że każda obniżka ceny o $1$ zł zwiększa sprzedaż o $${d}$ porcji dziennie. Oblicz, przy jakiej cenie dzienny przychód ze sprzedaży ciasta będzie największy, i oblicz ten przychód. Zapisz obliczenia.`,
    model: T`Zapisanie przychodu: $R(x) = (${c} - x)(${n} + ${d}x)$, gdzie $x$ – obniżka w zł.`,
    domain: T`Określenie dziedziny: $x \in \langle 0, ${c})$.`,
    vertex: T`Wyznaczenie wierzchołka: $x = ${xw}$.`,
    final: T`Cena $${c - xw}$ zł, przychód $${R}$ zł.`,
    steps: [
      T`Po obniżce o $x$ zł: cena $${c} - x$, sprzedaż $${n} + ${d}x$ porcji.`,
      T`$R(x) = (${c} - x)(${n} + ${d}x) = ${poly([[-d, 'x^2'], [d * c - n, 'x'], [c * n, '']])}$.`,
      T`$x_w = \frac{-${d * c - n}}{-${2 * d}} = ${xw}$; ramiona w dół – maksimum, $x_w$ należy do dziedziny.`,
      T`Cena: $${c} - ${xw} = ${c - xw}$ zł; przychód: $${c - xw} \cdot ${n + d * xw} = ${R}$ zł.`
    ],
    trap: 'Wierzchołek daje wielkość OBNIŻKI x, a pytanie dotyczy CENY – odpowiedzią jest c − x.',
    answer: T`cena $${c - xw}$ zł, przychód $${R}$ zł`
  });
};
const productDiff = (r) => {
  const D = 2 * r.int(2, 15);
  const kind = r.pick(['diff', 'sum3']);
  if (kind === 'diff') {
    const x = D / 2;
    const P = x * (x - D);
    let best = Infinity;
    for (let t = -50; t <= 50; t += 0.5) best = Math.min(best, t * (t - D));
    check(best === P, '15.5');
    return optOpen({
      title: 'Najmniejszy iloczyn liczb o danej różnicy',
      q: T`Różnica dwóch liczb rzeczywistych jest równa $${D}$. Wyznacz te liczby, dla których ich iloczyn jest najmniejszy, i oblicz ten iloczyn. Zapisz obliczenia.`,
      model: T`Oznaczenie liczb $x$ i $x - ${D}$ oraz zapisanie iloczynu $f(x) = x(x - ${D})$.`,
      domain: T`Stwierdzenie, że $x \in \mathbb{R}$ (brak ograniczeń).`,
      vertex: T`Wyznaczenie wierzchołka: $x = ${x}$.`,
      final: T`Liczby $${x}$ i $${x - D}$, najmniejszy iloczyn $${P}$.`,
      steps: [
        T`Liczby: $x$ oraz $x - ${D}$; iloczyn $f(x) = x^2 - ${D}x$, $x \in \mathbb{R}$.`,
        T`Ramiona paraboli w górę, więc minimum jest w wierzchołku: $x_w = \frac{${D}}{2} = ${x}$.`,
        T`Druga liczba: $${x} - ${D} = ${x - D}$; iloczyn: $${x} \cdot ${par(x - D)} = ${P}$.`
      ],
      trap: 'Najmniejszy iloczyn jest UJEMNY – liczby mają przeciwne znaki; nie szukaj go wśród liczb dodatnich.',
      answer: T`$${x}$ i $${x - D}$, iloczyn $${P}$`
    });
  }
  const S = 6 * r.int(2, 10);
  // x + y = S, x, y > 0; maks. 3x · y? -> f = x(S - x) · 3... zamiast tego maksymalizujemy x · 2y przy x + y = S
  const xw = S / 2;
  const P = 2 * xw * (S - xw);
  return optOpen({
    title: 'Największa wartość wyrażenia przy danej sumie',
    q: T`Liczby dodatnie $x$ i $y$ spełniają warunek $x + y = ${S}$. Wyznacz te liczby, dla których wartość wyrażenia $2xy$ jest największa, i oblicz tę wartość. Zapisz obliczenia.`,
    model: T`Zapisanie funkcji jednej zmiennej: $f(x) = 2x(${S} - x)$.`,
    domain: T`Określenie dziedziny: $x \in (0, ${S})$.`,
    vertex: T`Wyznaczenie wierzchołka: $x = ${xw}$.`,
    final: T`$x = y = ${xw}$, największa wartość $${P}$.`,
    steps: [
      T`$y = ${S} - x$, a z $x > 0$ i $y > 0$: $x \in (0, ${S})$.`,
      T`$f(x) = 2x(${S} - x) = -2x^2 + ${2 * S}x$; ramiona w dół.`,
      T`$x_w = \frac{-${2 * S}}{-4} = ${xw}$, $y = ${xw}$; $f(${xw}) = ${P}$.`
    ],
    trap: 'Po podstawieniu y = S − x zostaje funkcja kwadratowa jednej zmiennej – maksimum leży w wierzchołku, jeśli należy do dziedziny.',
    answer: T`$x = y = ${xw}$, wartość $${P}$`
  });
};

export const OPEN_C = {
  '11.1': [prismWallDiag],
  '11.2': [pyramidApothem],
  '11.3': [prismAngle, cubeSkew],
  '11.4': [coneTriple, cylinderSection],
  '11.5': [similarSolids],
  '12.1': [multiplyRule],
  '12.2': [exactlyOnce],
  '12.3': [noDigitDiv5],
  '12.4': [queueArrangements],
  '12.5': [atLeastOne],
  '13.1': [divisibleOr],
  '13.2': [twoDice],
  '13.3': [drawTwoDigit],
  '13.4': [urnTwo],
  '13.5': [complementDice],
  '14.1': [meanUnknown],
  '14.2': [weightedUnknown],
  '14.3': [medianUnknown],
  '14.4': [modeTable],
  '14.5': [percentTable],
  '15.1': [rectPerimeter],
  '15.2': [sumSquares],
  '15.3': [fenceWall],
  '15.4': [revenue],
  '15.5': [productDiff]
};

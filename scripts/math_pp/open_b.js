/**
 * Zadania otwarte (PP) – działy 6–10. Format i etapy jak w zasadach oceniania CKE (2–3 pkt).
 */
import { T, open, fr, dec, par, poly, quad, lin, xm, sq, need, iv, m } from './lib.js';

const check = (cond, msg) => {
  if (!cond) throw new Error(`kontrola zadania otwartego: ${msg}`);
};
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];
const PRIMITIVE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
const pt = (x, y) => `(${x}, ${y})`;
const canon = (a, p, q) => `${a === 1 ? '' : a === -1 ? '-' : a}(${xm(p)})^2${q === 0 ? '' : ` ${q > 0 ? '+' : '-'} ${Math.abs(q)}`}`;

// ---------- 6.1 Postać kanoniczna z ogólnej ----------
const toCanonical = (r) => {
  const a = r.pick([1, -1, 2, -2, 3]);
  const p = r.intNot(-5, 5, 0);
  const q = r.intNot(-9, 9, 0);
  const [b, c] = [-2 * a * p, a * p * p + q];
  for (const x of [-1, 2]) check(a * x * x + b * x + c === a * (x - p) ** 2 + q, '6.1');
  return open({
    title: 'Postać kanoniczna funkcji kwadratowej',
    q: T`Funkcja kwadratowa $f$ jest określona wzorem $f(x) = ${quad(a, b, c)}$. Zapisz wzór funkcji $f$ w postaci kanonicznej. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie współrzędnych wierzchołka: $p = ${p}$ albo $q = ${q}$.`],
      [2, 'Komplet', T`Zapisanie postaci kanonicznej: $f(x) = ${canon(a, p, q)}$.`]
    ],
    steps: [
      T`$p = \frac{-b}{2a} = \frac{${-b}}{${2 * a}} = ${p}$.`,
      T`$q = f(p) = f(${p}) = ${q}$.`,
      T`Postać kanoniczna: $f(x) = ${canon(a, p, q)}$.`
    ],
    trap: T`W postaci kanonicznej $a(x - p)^2 + q$ przy $p = ${p}$ w nawiasie jest $${xm(p)}$ – znak w nawiasie jest przeciwny do znaku $p$.`,
    tip: 'Karta wzorów, str. 6: wierzchołek paraboli $W = (p, q)$, $p = \\frac{-b}{2a}$, $q = \\frac{-\\Delta}{4a}$.',
    answer: m(`f(x) = ${canon(a, p, q)}`)
  });
};

// ---------- 6.2 Zbiór wartości i monotoniczność ----------
const rangeMonotonic = (r) => {
  const a = r.pick([1, -1, 2, -2]);
  const p = r.intNot(-5, 5, 0);
  const q = r.int(-8, 8);
  const [b, c] = [-2 * a * p, a * p * p + q];
  const range = a > 0 ? iv.rc(q) : iv.lc(q);
  const inc = a > 0 ? iv.rc(p) : iv.lc(p);
  return open({
    title: 'Zbiór wartości i przedział monotoniczności',
    q: T`Funkcja kwadratowa $f$ jest określona wzorem $f(x) = ${quad(a, b, c)}$. Wyznacz zbiór wartości funkcji $f$ oraz przedział, w którym funkcja $f$ jest rosnąca. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie wierzchołka paraboli: $W = ${pt(p, q)}$.`],
      [2, 'Komplet', T`Zbiór wartości $${range}$ i przedział monotoniczności $${inc}$.`]
    ],
    steps: [
      T`$p = \frac{${-b}}{${2 * a}} = ${p}$, $q = f(${p}) = ${q}$.`,
      T`$a = ${a} ${a > 0 ? '> 0' : '< 0'}$ – ramiona paraboli skierowane ${a > 0 ? 'do góry, więc $q$ to wartość najmniejsza' : 'w dół, więc $q$ to wartość największa'}.`,
      T`Zbiór wartości: $${range}$; funkcja rośnie w przedziale $${inc}$.`
    ],
    trap: a > 0 ? 'Dla $a > 0$ funkcja rośnie na prawo od wierzchołka, a zbiór wartości zaczyna się od $q$ (a nie od $p$).' : 'Dla $a < 0$ funkcja rośnie NA LEWO od wierzchołka, a $q$ jest wartością największą.',
    tip: 'Szkic paraboli z wierzchołkiem i kierunkiem ramion wystarczy, by odczytać zbiór wartości i monotoniczność.',
    answer: T`$ZW = ${range}$, rosnąca w $${inc}$`
  });
};

// ---------- 6.3 Miejsca zerowe z postaci kanonicznej ----------
const zerosFromCanonical = (r) => {
  const a = r.pick([1, -1, 2, -2]);
  const p = r.intNot(-5, 5, 0);
  const t = r.int(1, 4);
  const q = -a * t * t;
  const [x1, x2] = [p - t, p + t];
  for (const x of [x1, x2]) check(a * (x - p) ** 2 + q === 0, '6.3');
  const prod = `${a === 1 ? '' : a === -1 ? '-' : a}(${xm(x1)})(${xm(x2)})`;
  return open({
    title: 'Miejsca zerowe i postać iloczynowa',
    q: T`Funkcja kwadratowa $f$ jest określona wzorem $f(x) = ${canon(a, p, q)}$. Wyznacz miejsca zerowe funkcji $f$ i zapisz jej wzór w postaci iloczynowej. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie miejsc zerowych: $x_1 = ${x1}$, $x_2 = ${x2}$.`],
      [2, 'Komplet', T`Postać iloczynowa: $f(x) = ${prod}$.`]
    ],
    steps: [
      T`$${canon(a, p, q)} = 0$, czyli $(${xm(p)})^2 = ${t * t}$.`,
      T`$${xm(p)} = ${t}$ lub $${xm(p)} = -${t}$, więc $x = ${x2}$ lub $x = ${x1}$.`,
      T`Postać iloczynowa: $f(x) = ${prod}$.`
    ],
    trap: T`W postaci iloczynowej zostaje współczynnik $a = ${a}$ – bez niego wzór opisuje inną parabolę.`,
    tip: 'Postać iloczynowa: $f(x) = a(x - x_1)(x - x_2)$, gdzie $x_1, x_2$ to miejsca zerowe.',
    answer: T`$x_1 = ${x1}$, $x_2 = ${x2}$, $f(x) = ${prod}$`
  });
};

// ---------- 6.4 Wartość największa i najmniejsza w przedziale ----------
const extremaInterval = (r) => {
  const a = r.pick([1, -1, 2, -2]);
  const p = r.intNot(-3, 3, 0);
  const q = r.int(-6, 6);
  const lo = p - r.int(1, 3);
  const hi = p + r.int(1, 4);
  need(hi - p !== p - lo);
  const f = (x) => a * (x - p) ** 2 + q;
  const [b, c] = [-2 * a * p, a * p * p + q];
  const vals = [f(lo), f(p), f(hi)];
  const [mn, mx] = [Math.min(...vals), Math.max(...vals)];
  return open({
    title: 'Wartość największa i najmniejsza w przedziale',
    q: T`Funkcja $f$ jest określona wzorem $f(x) = ${quad(a, b, c)}$. Wyznacz najmniejszą i największą wartość funkcji $f$ w przedziale $${iv.cc(lo, hi)}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie pierwszej współrzędnej wierzchołka $p = ${p}$ i stwierdzenie, że $p \in ${iv.cc(lo, hi)}$.`],
      [2, 'Etap 2', T`Obliczenie wartości: $f(${lo}) = ${f(lo)}$, $f(${p}) = ${f(p)}$, $f(${hi}) = ${f(hi)}$.`],
      [3, 'Komplet', T`Wartość najmniejsza $${mn}$, wartość największa $${mx}$.`]
    ],
    steps: [
      T`$p = \frac{${-b}}{${2 * a}} = ${p}$ – wierzchołek leży w przedziale $${iv.cc(lo, hi)}$.`,
      T`$f(${lo}) = ${f(lo)}$, $f(${p}) = ${f(p)}$, $f(${hi}) = ${f(hi)}$.`,
      T`Najmniejsza wartość: $${mn}$, największa: $${mx}$.`
    ],
    trap: 'Gdy wierzchołek leży w przedziale, jedną z wartości skrajnych jest q – nie wystarczy policzyć wartości na końcach przedziału.',
    tip: 'Funkcja kwadratowa na przedziale domkniętym: porównaj wartości na końcach i w wierzchołku (jeśli należy do przedziału).',
    answer: T`$f_{\min} = ${mn}$, $f_{\max} = ${mx}$`
  });
};

// ---------- 6.5 Wzór funkcji z miejsc zerowych i punktu ----------
const formulaFromZeros = (r) => {
  const x1 = r.int(-5, 2);
  const x2 = r.intNot(-2, 6, x1);
  const a = r.pick([1, -1, 2, -2, 3]);
  const x0 = r.intNot(-4, 6, x1, x2);
  const y0 = a * (x0 - x1) * (x0 - x2);
  const [A, B, C] = [a, -a * (x1 + x2), a * x1 * x2];
  return open({
    title: 'Wzór funkcji kwadratowej z miejsc zerowych',
    q: T`Miejscami zerowymi funkcji kwadratowej $f$ są liczby $${Math.min(x1, x2)}$ i $${Math.max(x1, x2)}$, a do wykresu tej funkcji należy punkt $P = ${pt(x0, y0)}$. Wyznacz wzór funkcji $f$ w postaci ogólnej. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie wzoru w postaci iloczynowej $f(x) = a(${xm(x1)})(${xm(x2)})$ i obliczenie $a = ${a}$.`],
      [2, 'Komplet', T`Postać ogólna: $f(x) = ${quad(A, B, C)}$.`]
    ],
    steps: [
      T`$f(x) = a(${xm(x1)})(${xm(x2)})$.`,
      T`$f(${x0}) = ${y0}$: $a \cdot ${par(x0 - x1)} \cdot ${par(x0 - x2)} = ${y0}$, więc $a = ${a}$.`,
      T`$f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(${xm(x1)})(${xm(x2)}) = ${quad(A, B, C)}$.`
    ],
    trap: 'Dwa miejsca zerowe nie wyznaczają paraboli – współczynnik a trzeba obliczyć z trzeciego punktu.',
    tip: 'Znając miejsca zerowe, zacznij od postaci iloczynowej $f(x) = a(x - x_1)(x - x_2)$.',
    answer: m(`f(x) = ${quad(A, B, C)}`)
  });
};

// ---------- 7.1 Ujemne wyrazy ciągu ----------
const negativeTerms = (r) => {
  const r1 = r.int(1, 4);
  const r2 = r1 + r.int(3, 8);
  const [B, C] = [-(r1 + r2), r1 * r2];
  const cnt = r2 - r1 - 1;
  let brute = 0;
  for (let n = 1; n <= 100; n++) if (n * n + B * n + C < 0) brute++;
  check(brute === cnt, '7.1');
  return open({
    title: 'Liczba ujemnych wyrazów ciągu',
    q: T`Ciąg $(a_n)$ jest określony wzorem $a_n = ${poly([[1, 'n^2'], [B, 'n'], [C, '']])}$ dla $n \ge 1$. Oblicz, ile wyrazów tego ciągu jest ujemnych. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Rozwiązanie nierówności $${poly([[1, 'n^2'], [B, 'n'], [C, '']])} < 0$: $n \in (${r1}, ${r2})$.`],
      [2, 'Komplet', T`Wskazanie liczb naturalnych $n = ${r1 + 1}, \ldots, ${r2 - 1}$ i odpowiedź: $${cnt}$ wyrazów.`]
    ],
    steps: [
      T`Pierwiastki trójmianu $${poly([[1, 'n^2'], [B, 'n'], [C, '']])}$: $n = ${r1}$ i $n = ${r2}$.`,
      T`Trójmian jest ujemny dla $n \in (${r1}, ${r2})$.`,
      T`Liczby naturalne w tym przedziale: $${r1 + 1}, ${r1 + 2}, \ldots, ${r2 - 1}$ – jest ich $${cnt}$.`
    ],
    trap: 'Numery wyrazów to liczby naturalne – policz tylko liczby całkowite z przedziału otwartego (końce dają wyrazy równe 0).',
    tip: 'Wyrazy ujemne: rozwiąż nierówność a_n < 0 i wybierz z rozwiązania liczby naturalne n ≥ 1.',
    answer: T`$${cnt}$ wyrazów`
  });
};

// ---------- 7.2 Ciąg arytmetyczny z dwóch wyrazów ----------
const arithTwoTerms = (r) => {
  const a1 = r.int(-10, 12);
  const d = r.intNot(-5, 5, 0);
  const [i, j] = [r.int(2, 4), r.int(6, 10)];
  const [ai, aj] = [a1 + (i - 1) * d, a1 + (j - 1) * d];
  const an = lin(d, a1 - d, 'n');
  return open({
    title: 'Ciąg arytmetyczny z dwóch wyrazów',
    q: T`W ciągu arytmetycznym $(a_n)$ dane są wyrazy $a_{${i}} = ${ai}$ oraz $a_{${j}} = ${aj}$. Wyznacz wzór ogólny tego ciągu. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie różnicy $r = ${d}$ (albo zapisanie układu równań z $a_1$ i $r$).`],
      [2, 'Komplet', T`Obliczenie $a_1 = ${a1}$ i zapisanie wzoru $a_n = ${an}$.`]
    ],
    steps: [
      T`$a_{${j}} - a_{${i}} = ${j - i}r$, więc $${j - i}r = ${aj - ai}$ i $r = ${d}$.`,
      T`$a_{${i}} = a_1 + ${i - 1}r$: $${ai} = a_1 ${(i - 1) * d >= 0 ? '+' : '-'} ${Math.abs((i - 1) * d)}$, więc $a_1 = ${a1}$.`,
      T`$a_n = a_1 + (n - 1)r = ${a1} + (n - 1) \cdot ${par(d)} = ${an}$.`
    ],
    trap: T`Między $a_{${i}}$ a $a_{${j}}$ jest $${j - i}$ różnic, a nie $${j - i + 1}$.`,
    tip: 'Karta wzorów, str. 8: $a_n = a_1 + (n - 1)r$.',
    answer: m(`a_n = ${an}`)
  });
};

// ---------- 7.3 Suma wyrazów ciągu arytmetycznego ----------
const arithSum = (r) => {
  const a1 = r.int(-8, 10);
  const d = r.intNot(-4, 5, 0);
  const n = r.pick([10, 12, 15, 20, 25]);
  const [a2, a5] = [a1 + d, a1 + 4 * d];
  const an = a1 + (n - 1) * d;
  const S = ((a1 + an) * n) / 2;
  let brute = 0;
  for (let k = 0; k < n; k++) brute += a1 + k * d;
  check(brute === S, '7.3');
  return open({
    title: 'Suma początkowych wyrazów ciągu arytmetycznego',
    q: T`W ciągu arytmetycznym $(a_n)$ drugi wyraz jest równy $${a2}$, a piąty wyraz jest równy $${a5}$. Oblicz sumę $${n}$ początkowych wyrazów tego ciągu. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie $r = ${d}$ i $a_1 = ${a1}$.`],
      [2, 'Komplet', T`Obliczenie sumy: $S_{${n}} = ${S}$.`]
    ],
    steps: [
      T`$a_5 - a_2 = 3r$, więc $3r = ${a5 - a2}$, $r = ${d}$, $a_1 = a_2 - r = ${a1}$.`,
      T`$a_{${n}} = ${a1} + ${n - 1} \cdot ${par(d)} = ${an}$.`,
      T`$S_{${n}} = \frac{a_1 + a_{${n}}}{2} \cdot ${n} = \frac{${a1} + ${par(an)}}{2} \cdot ${n} = ${S}$.`
    ],
    trap: T`We wzorze na sumę potrzebny jest wyraz $a_{${n}}$ (albo wzór z $r$), a nie $a_5$ z treści.`,
    tip: 'Karta wzorów, str. 8: $S_n = \\frac{a_1 + a_n}{2} \\cdot n = \\frac{2a_1 + (n - 1)r}{2} \\cdot n$.',
    answer: m(`S_{${n}} = ${S}`)
  });
};

// ---------- 7.4 Ciąg geometryczny ----------
const geomSum = (r) => {
  const a1 = r.pick([1, 2, 3, -1, -2, 4]);
  const q = r.pick([2, 3, -2, -3]);
  const n = r.pick([4, 5, 6]);
  need(Math.abs(a1 * q ** (n - 1)) < 2000);
  const [a2, a4] = [a1 * q, a1 * q ** 3];
  const S = (a1 * (1 - q ** n)) / (1 - q);
  let brute = 0;
  for (let k = 0; k < n; k++) brute += a1 * q ** k;
  check(brute === S, '7.4');
  return open({
    title: 'Suma wyrazów ciągu geometrycznego',
    q: T`W ciągu geometrycznym $(a_n)$ dane są $a_2 = ${a2}$ oraz $a_4 = ${a4}$, a iloraz tego ciągu jest ${q > 0 ? 'dodatni' : 'ujemny'}. Oblicz sumę $${n}$ początkowych wyrazów tego ciągu. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie ilorazu $q = ${q}$ i pierwszego wyrazu $a_1 = ${a1}$.`],
      [2, 'Komplet', T`Obliczenie sumy $S_{${n}} = ${S}$.`]
    ],
    steps: [
      T`$a_4 = a_2 \cdot q^2$, więc $q^2 = ${q * q}$; iloraz jest ${q > 0 ? 'dodatni' : 'ujemny'}, zatem $q = ${q}$.`,
      T`$a_1 = \frac{a_2}{q} = \frac{${a2}}{${q}} = ${a1}$.`,
      T`$S_{${n}} = a_1 \cdot \frac{1 - q^{${n}}}{1 - q} = ${a1} \cdot \frac{1 - ${par(q)}^{${n}}}{1 - ${par(q)}} = ${S}$.`
    ],
    trap: T`Z $q^2 = ${q * q}$ wynikają dwie wartości: $${Math.abs(q)}$ i $${-Math.abs(q)}$ – warunek z treści wybiera jedną z nich.`,
    tip: 'Karta wzorów, str. 8: $a_n = a_1 q^{n-1}$, $S_n = a_1 \\cdot \\frac{1 - q^n}{1 - q}$ dla $q \\neq 1$.',
    answer: m(`S_{${n}} = ${S}`)
  });
};

// ---------- 7.5 Trzy wyrazy ciągu geometrycznego ----------
const threeTermsGeom = (r) => {
  const p = r.intNot(-6, 6, 0);
  const s = r.intNot(-12, 14, 0, 2 * p);
  // (x + p)^2 = x(x + s) -> 2px + p^2 = sx -> x = p^2/(s - 2p)
  need((p * p) % (s - 2 * p) === 0);
  const x = (p * p) / (s - 2 * p);
  need(x !== 0 && x + p !== 0 && x + s !== 0 && Math.abs(x) <= 30);
  const [t1, t2, t3] = [x, x + p, x + s];
  check(t2 * t2 === t1 * t3, '7.5');
  return open({
    title: 'Trzy kolejne wyrazy ciągu geometrycznego',
    q: T`Liczby $x$, $${xm(-p)}$, $${xm(-s)}$ są – w podanej kolejności – pierwszym, drugim i trzecim wyrazem ciągu geometrycznego. Oblicz $x$ oraz iloraz tego ciągu. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie warunku $(${xm(-p)})^2 = x(${xm(-s)})$.`],
      [2, 'Komplet', T`Rozwiązanie $x = ${x}$ i iloraz $q = ${fr(t2, t1)}$.`]
    ],
    steps: [
      T`Dla trzech kolejnych wyrazów ciągu geometrycznego: $(${xm(-p)})^2 = x(${xm(-s)})$.`,
      T`$x^2 ${2 * p > 0 ? '+' : '-'} ${Math.abs(2 * p)}x + ${p * p} = x^2 ${s > 0 ? '+' : '-'} ${Math.abs(s)}x$, czyli $${poly([[s - 2 * p, 'x']])} = ${p * p}$ i $x = ${x}$.`,
      T`Wyrazy: $${t1}, ${t2}, ${t3}$; iloraz $q = \frac{${t2}}{${t1}} = ${fr(t2, t1)}$.`
    ],
    trap: 'Warunek ciągu geometrycznego to „kwadrat środkowego = iloczyn sąsiednich” (b² = ac), a nie średnia arytmetyczna.',
    tip: 'Trzy liczby a, b, c (różne od 0) tworzą ciąg geometryczny, gdy b² = a · c.',
    answer: T`$x = ${x}$, $q = ${fr(t2, t1)}$`
  });
};

// ---------- 8.1 Trójkąt prostokątny z sinusa ----------
const rightTriangleSin = (r) => {
  const [a, b, c] = r.pick(TRIPLES);
  const k = r.int(1, 3);
  const swap = r.bool();
  const [opp, adj] = swap ? [b, a] : [a, b];
  const obw = (a + b + c) * k;
  return open({
    title: 'Obwód trójkąta prostokątnego z sinusa',
    q: T`W trójkącie prostokątnym $ABC$ przeciwprostokątna $AB$ ma długość $${c * k}$, a sinus kąta ostrego $\alpha$ przy wierzchołku $A$ jest równy $${fr(opp, c)}$. Oblicz obwód tego trójkąta. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie przyprostokątnej $BC = ${opp * k}$.`],
      [2, 'Komplet', T`Obliczenie $AC = ${adj * k}$ i obwodu $${obw}$.`]
    ],
    steps: [
      T`$\sin\alpha = \frac{BC}{AB}$, więc $BC = ${c * k} \cdot ${fr(opp, c)} = ${opp * k}$.`,
      T`Z twierdzenia Pitagorasa: $AC = \sqrt{${c * k}^2 - ${opp * k}^2} = ${adj * k}$.`,
      T`Obwód: $${c * k} + ${opp * k} + ${adj * k} = ${obw}$.`
    ],
    trap: 'Sinus kąta to przyprostokątna NAPRZECIW kąta podzielona przez przeciwprostokątną – nie przyprostokątna przyległa.',
    tip: 'Karta wzorów, str. 14: sin α = a/c (naprzeciw / przeciwprostokątna), cos α = b/c, tg α = a/b.',
    answer: m(obw)
  });
};

// ---------- 8.2 Wartość wyrażenia z kątami 30°, 45°, 60° ----------
// wartości w dwunastych częściach, żeby rachować na liczbach całkowitych
const TRIG_SQ = [
  ['\\sin^2 60^\\circ', 9, '\\frac{3}{4}'],
  ['\\cos^2 30^\\circ', 9, '\\frac{3}{4}'],
  ['\\sin^2 45^\\circ', 6, '\\frac{1}{2}'],
  ['\\cos^2 45^\\circ', 6, '\\frac{1}{2}'],
  ['\\sin 30^\\circ', 6, '\\frac{1}{2}'],
  ['\\cos 60^\\circ', 6, '\\frac{1}{2}'],
  ['\\operatorname{tg}^2 60^\\circ', 36, '3'],
  ['\\operatorname{tg}^2 30^\\circ', 4, '\\frac{1}{3}'],
  ['\\operatorname{tg} 45^\\circ', 12, '1'],
  ['\\sin^2 30^\\circ', 3, '\\frac{1}{4}'],
  ['\\cos^2 60^\\circ', 3, '\\frac{1}{4}']
];
const trigValue = (r) => {
  const terms = r.shuffle(TRIG_SQ).slice(0, 3);
  const coef = [r.pick([1, 2, 3, 4]), r.pick([1, -1, 2, -2]), r.pick([1, -1, 3, -3])];
  const total = terms.reduce((s, t, i) => s + coef[i] * t[1], 0);
  const expr = terms.map(([tex], i) => `${i === 0 ? '' : coef[i] > 0 ? ' + ' : ' - '}${Math.abs(coef[i]) === 1 ? '' : `${Math.abs(coef[i])} \\cdot `}${tex}`).join('');
  const subst = terms.map(([, , val], i) => `${i === 0 ? '' : coef[i] > 0 ? ' + ' : ' - '}${Math.abs(coef[i]) === 1 ? '' : `${Math.abs(coef[i])} \\cdot `}${val}`).join('');
  const ans = fr(total, 12);
  return open({
    title: 'Wartość wyrażenia trygonometrycznego',
    q: T`Oblicz wartość wyrażenia $${expr}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Poprawne podstawienie wartości funkcji trygonometrycznych: $${subst}$.`],
      [2, 'Komplet', T`Obliczenie wartości wyrażenia: $${ans}$.`]
    ],
    steps: [T`Z tabeli wartości: $${expr} = ${subst}$.`, T`$${subst} = ${ans}$.`],
    trap: T`$\sin^2 60^\circ$ to $(\sin 60^\circ)^2 = \left(\frac{\sqrt{3}}{2}\right)^2 = \frac{3}{4}$ – podnosimy do kwadratu wartość funkcji, a nie kąt.`,
    tip: 'Karta wzorów, str. 15: tabela wartości sin, cos, tg dla 30°, 45°, 60°.',
    answer: m(ans)
  });
};

// ---------- 8.3 Wartość wyrażenia z tangensa ----------
const tanToExpr = (r) => {
  const [a, b, c] = r.pick(PRIMITIVE);
  const sw = r.bool();
  const [o, p] = sw ? [b, a] : [a, b];
  const kind = r.pick(['prod', 'sum']);
  const val = kind === 'prod' ? fr(o * p, c * c) : fr(o + p, c);
  return open({
    title: 'Funkcje trygonometryczne z tangensa',
    q: T`Kąt $\alpha$ jest ostry i $\operatorname{tg}\alpha = ${fr(o, p)}$. Oblicz wartość wyrażenia $${kind === 'prod' ? '\\sin\\alpha \\cdot \\cos\\alpha' : '\\sin\\alpha + \\cos\\alpha'}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie $\sin\alpha = ${fr(o, c)}$ i $\cos\alpha = ${fr(p, c)}$ (z trójkąta prostokątnego lub z układu $\operatorname{tg}\alpha = \frac{\sin\alpha}{\cos\alpha}$, $\sin^2\alpha + \cos^2\alpha = 1$).`],
      [2, 'Komplet', T`Obliczenie wartości wyrażenia: $${val}$.`]
    ],
    steps: [
      T`Rysujemy trójkąt prostokątny o przyprostokątnych $${o}$ (naprzeciw $\alpha$) i $${p}$; przeciwprostokątna $\sqrt{${o * o} + ${p * p}} = ${c}$.`,
      T`$\sin\alpha = ${fr(o, c)}$, $\cos\alpha = ${fr(p, c)}$.`,
      kind === 'prod' ? T`$\sin\alpha \cdot \cos\alpha = ${fr(o, c)} \cdot ${fr(p, c)} = ${val}$.` : T`$\sin\alpha + \cos\alpha = ${fr(o, c)} + ${fr(p, c)} = ${val}$.`
    ],
    trap: T`$\operatorname{tg}\alpha = ${fr(o, p)}$ nie oznacza, że $\sin\alpha = ${o}$ – to stosunek boków, a sinus kąta ostrego jest mniejszy od 1.`,
    tip: 'Karta wzorów, str. 14: $\\sin^2\\alpha + \\cos^2\\alpha = 1$, $\\operatorname{tg}\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}$.',
    answer: m(val)
  });
};

// ---------- 8.4 Kąt rozwarty ----------
const obtuseAngle = (r) => {
  const [a, b, c] = r.pick(PRIMITIVE);
  const sw = r.bool();
  const [o, p] = sw ? [b, a] : [a, b];
  return open({
    title: 'Funkcje trygonometryczne kąta rozwartego',
    q: T`Kąt $\alpha$ jest rozwarty i $\cos\alpha = -${fr(p, c)}$. Oblicz $\sin\alpha$ oraz $\operatorname{tg}\alpha$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie $\sin\alpha = ${fr(o, c)}$ z jedynki trygonometrycznej (z uzasadnieniem znaku).`],
      [2, 'Komplet', T`Obliczenie $\operatorname{tg}\alpha = -${fr(o, p)}$.`]
    ],
    steps: [
      T`$\sin^2\alpha = 1 - ${fr(p * p, c * c)} = ${fr(o * o, c * c)}$.`,
      T`Dla kąta rozwartego $\sin\alpha > 0$, więc $\sin\alpha = ${fr(o, c)}$.`,
      T`$\operatorname{tg}\alpha = \frac{\sin\alpha}{\cos\alpha} = ${fr(o, c)} : \left(-${fr(p, c)}\right) = -${fr(o, p)}$.`
    ],
    trap: 'Dla kąta rozwartego sinus jest dodatni, a cosinus i tangens – ujemne. Nie bierz ujemnego pierwiastka dla sinusa.',
    tip: 'Kąty od 90° do 180°: sin > 0, cos < 0, tg < 0.',
    answer: T`$\sin\alpha = ${fr(o, c)}$, $\operatorname{tg}\alpha = -${fr(o, p)}$`
  });
};

// ---------- 8.5 Twierdzenie cosinusów i pole ----------
const cosLawArea = (r) => {
  const b = r.int(2, 8);
  const c = r.intNot(2, 9, b);
  const ang = r.pick([60, 120]);
  const a2 = ang === 60 ? b * b + c * c - b * c : b * b + c * c + b * c;
  const area = `${fr(b * c, 4) === '1' ? '' : fr(b * c, 4)}\\sqrt{3}`;
  check(Math.abs(a2 - (b * b + c * c - 2 * b * c * Math.cos((ang * Math.PI) / 180))) < 1e-9, '8.5');
  return open({
    title: 'Twierdzenie cosinusów i pole trójkąta',
    q: T`W trójkącie $ABC$ boki $AC$ i $AB$ mają długości $${b}$ i $${c}$, a kąt $BAC$ ma miarę $${ang}^\circ$. Oblicz długość boku $BC$ oraz pole trójkąta $ABC$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zastosowanie twierdzenia cosinusów: $BC^2 = ${b}^2 + ${c}^2 - 2 \cdot ${b} \cdot ${c} \cdot \cos ${ang}^\circ$.`],
      [2, 'Etap 2', T`Obliczenie $BC = ${sq(a2)}$.`],
      [3, 'Komplet', T`Obliczenie pola: $P = ${area}$.`]
    ],
    steps: [
      T`$\cos ${ang}^\circ = ${ang === 60 ? '\\frac{1}{2}' : '-\\frac{1}{2}'}$, więc $BC^2 = ${b * b} + ${c * c} ${ang === 60 ? '-' : '+'} ${b * c} = ${a2}$ i $BC = ${sq(a2)}$.`,
      T`$P = \frac{1}{2} \cdot ${b} \cdot ${c} \cdot \sin ${ang}^\circ = \frac{1}{2} \cdot ${b * c} \cdot \frac{\sqrt{3}}{2} = ${area}$.`
    ],
    trap: ang === 120 ? T`$\cos 120^\circ = -\frac{1}{2}$, więc w twierdzeniu cosinusów odejmujemy liczbę ujemną – bok $BC$ jest dłuższy niż przy kącie $60^\circ$.` : T`$\sin 60^\circ = \frac{\sqrt{3}}{2}$, a $\cos 60^\circ = \frac{1}{2}$ – nie zamieniaj ich miejscami.`,
    tip: 'Karta wzorów, str. 16: $a^2 = b^2 + c^2 - 2bc\\cos\\alpha$; $P = \\frac{1}{2}bc\\sin\\alpha$.',
    answer: T`$BC = ${sq(a2)}$, $P = ${area}$`
  });
};

// ---------- 9.1 Trójkąt równoramienny ----------
const isoscelesArea = (r) => {
  const [p, h, c] = r.pick(TRIPLES);
  const sw = r.bool();
  const [half, hh] = sw ? [h, p] : [p, h];
  return open({
    title: 'Pole trójkąta równoramiennego',
    q: T`W trójkącie równoramiennym podstawa ma długość $${2 * half}$, a każde z ramion ma długość $${c}$. Oblicz pole tego trójkąta. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie wysokości opuszczonej na podstawę: $h = ${hh}$.`],
      [2, 'Komplet', T`Obliczenie pola: $P = ${half * hh}$.`]
    ],
    steps: [
      T`Wysokość dzieli podstawę na połowy długości $${half}$.`,
      T`Z twierdzenia Pitagorasa: $h = \sqrt{${c}^2 - ${half}^2} = \sqrt{${c * c - half * half}} = ${hh}$.`,
      T`$P = \frac{1}{2} \cdot ${2 * half} \cdot ${hh} = ${half * hh}$.`
    ],
    trap: T`W twierdzeniu Pitagorasa bierzemy POŁOWĘ podstawy ($${half}$), a nie całą podstawę.`,
    tip: 'Wysokość trójkąta równoramiennego opuszczona na podstawę dzieli ją na połowy.',
    answer: m(half * hh)
  });
};

// ---------- 9.2 Twierdzenie Talesa ----------
const talesSegment = (r) => {
  const cd = r.int(2, 9);
  const da = r.int(2, 9);
  const de = r.int(2, 12);
  need((de * (cd + da)) % cd === 0);
  const ab = (de * (cd + da)) / cd;
  return open({
    title: 'Odcinek równoległy do boku trójkąta',
    q: T`W trójkącie $ABC$ punkt $D$ leży na boku $AC$, a punkt $E$ – na boku $BC$, przy czym $DE \parallel AB$. Wiadomo, że $|CD| = ${cd}$, $|DA| = ${da}$ i $|DE| = ${de}$. Oblicz długość boku $AB$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie proporcji z podobieństwa trójkątów $DEC$ i $ABC$ (lub z twierdzenia Talesa): $\frac{|DE|}{|AB|} = \frac{|CD|}{|CA|}$.`],
      [2, 'Komplet', T`Obliczenie $|AB| = ${ab}$.`]
    ],
    steps: [
      T`$|CA| = |CD| + |DA| = ${cd + da}$.`,
      T`Trójkąty $DEC$ i $ABC$ są podobne (cecha kąt–kąt), więc $\frac{${de}}{|AB|} = \frac{${cd}}{${cd + da}}$.`,
      T`$|AB| = \frac{${de} \cdot ${cd + da}}{${cd}} = ${ab}$.`
    ],
    trap: T`W proporcji porównujemy $|CD|$ z całym bokiem $|CA| = ${cd + da}$, a nie z odcinkiem $|DA| = ${da}$.`,
    tip: 'Odcinek równoległy do boku trójkąta odcina trójkąt podobny do danego.',
    answer: m(`|AB| = ${ab}`)
  });
};

// ---------- 9.3 Dowody geometryczne (VIII.11) i wielokąty foremne (VIII.3) ----------
const GEO_PROOFS = [
  {
    q: 'Dany jest równoległobok $ABCD$. Punkt $S$ jest punktem przecięcia przekątnych. Wykaż, że trójkąty $ABS$ i $CDS$ są przystające.',
    s1: 'Zauważenie, że przekątne równoległoboku dzielą się na połowy: $|AS| = |CS|$, $|BS| = |DS|$.',
    s2: 'Zauważenie równości kątów wierzchołkowych $\\angle ASB = \\angle CSD$ i powołanie się na cechę bok–kąt–bok.',
    steps: ['Przekątne równoległoboku dzielą się na połowy, więc $|AS| = |CS|$ i $|BS| = |DS|$.', 'Kąty $ASB$ i $CSD$ są wierzchołkowe, więc równe.', 'Z cechy bok–kąt–bok trójkąty $ABS$ i $CDS$ są przystające.'],
    ans: 'trójkąty przystające (cecha bok–kąt–bok)'
  },
  {
    q: 'W trapezie $ABCD$ podstawy $AB$ i $CD$ są równoległe, a $S$ jest punktem przecięcia przekątnych. Wykaż, że trójkąty $ABS$ i $CDS$ są podobne.',
    s1: 'Zauważenie równości kątów naprzemianległych: $\\angle SAB = \\angle SCD$ (albo $\\angle SBA = \\angle SDC$).',
    s2: 'Zauważenie równości drugiej pary kątów (np. wierzchołkowych przy $S$) i powołanie się na cechę kąt–kąt.',
    steps: ['$AB \\parallel CD$, więc kąty naprzemianległe są równe: $\\angle SAB = \\angle SCD$ oraz $\\angle SBA = \\angle SDC$.', 'Z cechy kąt–kąt trójkąty $ABS$ i $CDS$ są podobne.'],
    ans: 'trójkąty podobne (cecha kąt–kąt)'
  },
  {
    q: 'W trójkącie $ABC$ dwusieczne kątów $A$ i $B$ przecinają się w punkcie $O$. Kąt $ACB$ ma miarę $\\gamma$. Wykaż, że $\\angle AOB = 90^\\circ + \\frac{\\gamma}{2}$.',
    s1: 'Zapisanie $\\angle OAB + \\angle OBA = \\frac{\\alpha + \\beta}{2} = \\frac{180^\\circ - \\gamma}{2}$.',
    s2: 'Obliczenie $\\angle AOB = 180^\\circ - \\frac{180^\\circ - \\gamma}{2} = 90^\\circ + \\frac{\\gamma}{2}$.',
    steps: ['Dwusieczne dzielą kąty na połowy: $\\angle OAB = \\frac{\\alpha}{2}$, $\\angle OBA = \\frac{\\beta}{2}$.', 'Z sumy kątów trójkąta $ABC$: $\\alpha + \\beta = 180^\\circ - \\gamma$.', 'W trójkącie $ABO$: $\\angle AOB = 180^\\circ - \\frac{\\alpha + \\beta}{2} = 180^\\circ - 90^\\circ + \\frac{\\gamma}{2} = 90^\\circ + \\frac{\\gamma}{2}$.'],
    ans: '$\\angle AOB = 90^\\circ + \\frac{\\gamma}{2}$'
  },
  {
    q: 'Dany jest prostokąt $ABCD$. Punkt $M$ jest środkiem boku $AB$. Wykaż, że $|MC| = |MD|$.',
    s1: 'Zauważenie, że $|AM| = |BM|$, $|AD| = |BC|$ i $\\angle DAM = \\angle CBM = 90^\\circ$.',
    s2: 'Powołanie się na cechę bok–kąt–bok przystawania trójkątów $AMD$ i $BMC$ i wniosek $|MD| = |MC|$.',
    steps: ['$M$ jest środkiem $AB$, więc $|AM| = |BM|$; w prostokącie $|AD| = |BC|$ i kąty przy $A$ i $B$ są proste.', 'Z cechy bok–kąt–bok trójkąty $AMD$ i $BMC$ są przystające, więc $|MD| = |MC|$.'],
    ans: '$|MC| = |MD|$'
  },
  {
    q: 'W rombie $ABCD$ kąt ostry ma miarę $\\alpha$. Wykaż, że przekątna $AC$ dzieli kąt $BAD$ na dwa kąty o mierze $\\frac{\\alpha}{2}$, a przekątne rombu są prostopadłe.',
    s1: 'Uzasadnienie przystawania trójkątów $ABC$ i $ADC$ (cecha bok–bok–bok), skąd $\\angle BAC = \\angle DAC = \\frac{\\alpha}{2}$.',
    s2: 'Uzasadnienie prostopadłości przekątnych (np. trójkąt $ABD$ jest równoramienny, a $AS$ jest jego dwusieczną, więc i wysokością).',
    steps: ['Wszystkie boki rombu są równe, więc trójkąty $ABC$ i $ADC$ mają boki $|AB| = |AD|$, $|BC| = |DC|$ i wspólny bok $AC$ – są przystające.', 'Zatem $\\angle BAC = \\angle DAC = \\frac{\\alpha}{2}$.', 'W trójkącie równoramiennym $ABD$ dwusieczna kąta przy wierzchołku jest też wysokością, więc $AC \\perp BD$.'],
    ans: 'przekątna jest dwusieczną, przekątne są prostopadłe'
  }
];
const geoProof = (r) => {
  const t = r.pick(GEO_PROOFS);
  return open({
    title: 'Dowód geometryczny',
    proof: true,
    q: t.q,
    stages: [
      [1, 'Etap 1', t.s1],
      [2, 'Komplet', t.s2]
    ],
    zero: ['Sprawdzenie tezy na rysunku lub dla konkretnych długości nie jest dowodem – 0 pkt.'],
    steps: t.steps,
    trap: 'Każdą równość boków lub kątów uzasadnij własnością figury (np. „przekątne równoległoboku dzielą się na połowy”) – samo „widać z rysunku” nie jest argumentem.',
    tip: 'Dowód geometryczny: zapisz założenia, wskaż cechę przystawania/podobieństwa i nazwij każdą własność, z której korzystasz.',
    answer: t.ans
  });
};
const regularPolygon = (r) => {
  const n = r.pick([5, 6, 8, 9, 10, 12]);
  const angle = ((n - 2) * 180) / n;
  const diag = (n * (n - 3)) / 2;
  const kind = r.pick(['angle', 'diag']);
  return open({
    title: 'Wielokąt foremny',
    q:
      kind === 'angle'
        ? T`Oblicz miarę kąta wewnętrznego ${n}-kąta foremnego oraz miarę kąta, jaki tworzą dwa sąsiednie boki z przedłużeniem jednego z nich (kąt zewnętrzny). Zapisz obliczenia.`
        : T`Oblicz, ile przekątnych ma ${n}-kąt foremny, oraz oblicz miarę jego kąta wewnętrznego. Zapisz obliczenia.`,
    stages:
      kind === 'angle'
        ? [
            [1, 'Etap 1', T`Obliczenie sumy kątów wewnętrznych: $(${n} - 2) \cdot 180^\circ = ${(n - 2) * 180}^\circ$.`],
            [2, 'Komplet', T`Kąt wewnętrzny $${dec(angle, 1)}^\circ$ i kąt zewnętrzny $${dec(180 - angle, 1)}^\circ$.`]
          ]
        : [
            [1, 'Etap 1', T`Obliczenie liczby przekątnych: $\frac{${n} \cdot ${n - 3}}{2} = ${diag}$.`],
            [2, 'Komplet', T`Obliczenie kąta wewnętrznego: $${dec(angle, 1)}^\circ$.`]
          ],
    steps: [
      T`Suma kątów wewnętrznych $${n}$-kąta: $(${n} - 2) \cdot 180^\circ = ${(n - 2) * 180}^\circ$; w wielokącie foremnym wszystkie kąty są równe: $${(n - 2) * 180}^\circ : ${n} = ${dec(angle, 1)}^\circ$.`,
      kind === 'angle' ? T`Kąt zewnętrzny: $180^\circ - ${dec(angle, 1)}^\circ = ${dec(180 - angle, 1)}^\circ$ (to także $360^\circ : ${n}$).` : T`Z każdego wierzchołka wychodzi $${n - 3}$ przekątnych, a każdą liczymy dwa razy: $\frac{${n} \cdot ${n - 3}}{2} = ${diag}$.`
    ],
    trap: kind === 'angle' ? 'Suma kątów n-kąta to (n − 2) · 180°, a nie n · 180°.' : 'Każda przekątna łączy dwa wierzchołki – iloczyn n(n − 3) trzeba podzielić przez 2.',
    tip: 'Wielokąt foremny: wszystkie boki i kąty równe; suma kątów wewnętrznych (n − 2) · 180°.',
    answer: kind === 'angle' ? T`$${dec(angle, 1)}^\circ$ i $${dec(180 - angle, 1)}^\circ$` : T`$${diag}$ przekątnych, kąt $${dec(angle, 1)}^\circ$`
  });
};

// ---------- 9.4 Styczne do okręgu ----------
const tangentLength = (r) => {
  const [a, b, c] = r.pick(TRIPLES);
  const sw = r.bool();
  const [rad, t] = sw ? [b, a] : [a, b];
  return open({
    title: 'Odcinki stycznych do okręgu',
    q: T`Z punktu $P$ poprowadzono dwie styczne do okręgu o środku $O$ i promieniu $${rad}$. Punkty styczności to $A$ i $B$, a $|PO| = ${c}$. Oblicz długość odcinka $PA$ oraz pole czworokąta $PAOB$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zauważenie, że $OA \perp PA$, i obliczenie $|PA| = ${t}$.`],
      [2, 'Komplet', T`Obliczenie pola czworokąta: $${rad * t}$.`]
    ],
    steps: [
      T`Promień poprowadzony do punktu styczności jest prostopadły do stycznej, więc trójkąt $PAO$ jest prostokątny.`,
      T`$|PA| = \sqrt{${c}^2 - ${rad}^2} = \sqrt{${c * c - rad * rad}} = ${t}$.`,
      T`Czworokąt $PAOB$ składa się z dwóch przystających trójkątów prostokątnych: $P = 2 \cdot \frac{1}{2} \cdot ${rad} \cdot ${t} = ${rad * t}$.`
    ],
    trap: 'Przeciwprostokątną trójkąta PAO jest odcinek PO, a nie styczna PA.',
    tip: 'Promień okręgu poprowadzony do punktu styczności jest prostopadły do stycznej; odcinki stycznych z jednego punktu są równe.',
    answer: T`$|PA| = ${t}$, $P = ${rad * t}$`
  });
};

// ---------- 9.5 Łuk, wycinek (VIII.6) i okręgi trójkąta (VIII.10) ----------
const sectorArc = (r) => {
  const rad = r.pick([3, 4, 6, 9, 12]);
  const ang = r.pick([30, 40, 45, 60, 72, 90, 120, 150]);
  const arc = fr(2 * rad * ang, 360);
  const area = fr(rad * rad * ang, 360);
  const piTex = (f) => (f === '1' ? '\\pi' : `${f}\\pi`);
  return open({
    title: 'Długość łuku i pole wycinka',
    q: T`Kąt środkowy w okręgu o promieniu $${rad}$ ma miarę $${ang}^\circ$. Oblicz długość łuku, na którym jest oparty ten kąt, oraz pole wycinka koła wyznaczonego przez ten kąt. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie długości łuku: $${piTex(arc)}$.`],
      [2, 'Komplet', T`Obliczenie pola wycinka: $${piTex(area)}$.`]
    ],
    steps: [
      T`Łuk: $l = \frac{${ang}^\circ}{360^\circ} \cdot 2\pi \cdot ${rad} = ${piTex(arc)}$.`,
      T`Wycinek: $P = \frac{${ang}^\circ}{360^\circ} \cdot \pi \cdot ${rad}^2 = ${piTex(area)}$.`
    ],
    trap: 'Długość łuku liczymy z obwodu (2πr), a pole wycinka z pola koła (πr²) – łatwo pomylić wzory.',
    tip: 'Karta wzorów, str. 11: $l = \\frac{\\alpha}{360^\\circ} \\cdot 2\\pi r$, $P = \\frac{\\alpha}{360^\\circ} \\cdot \\pi r^2$.',
    answer: T`$l = ${piTex(arc)}$, $P = ${piTex(area)}$`
  });
};
const equilateralCircles = (r) => {
  const k = r.pick([2, 3, 4, 6]);
  const a = k * 3; // R = a√3/3 = k√3, r = a√3/6 = k√3/2
  const diff = fr(a * a, 4);
  check((a * a) / 3 - (a * a) / 12 === (a * a) / 4, '9.5');
  return open({
    title: 'Okrąg wpisany i opisany na trójkącie równobocznym',
    q: T`Trójkąt równoboczny ma bok długości $${a}$. Oblicz promień okręgu opisanego na tym trójkącie, promień okręgu wpisanego w ten trójkąt oraz pole pierścienia między tymi okręgami. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie promieni: $R = ${sq(3, k)}$, $r = ${k % 2 === 0 ? sq(3, k / 2) : `\\frac{${sq(3, k)}}{2}`}$.`],
      [2, 'Komplet', T`Obliczenie pola pierścienia: $${diff}\pi$.`]
    ],
    steps: [
      T`Wysokość: $h = \frac{${a}\sqrt{3}}{2}$. Środek okręgu wpisanego i opisanego to środek ciężkości, który dzieli wysokość w stosunku $2 : 1$.`,
      T`$R = \frac{2}{3}h = ${sq(3, k)}$, $r = \frac{1}{3}h = ${k % 2 === 0 ? sq(3, k / 2) : `\\frac{${sq(3, k)}}{2}`}$.`,
      T`Pole pierścienia: $\pi R^2 - \pi r^2 = \pi\left(${3 * k * k} - ${fr(3 * k * k, 4)}\right) = ${diff}\pi$.`
    ],
    trap: 'W trójkącie równobocznym R = 2r: promień okręgu opisanego to 2/3 wysokości, a wpisanego – 1/3, nie odwrotnie.',
    tip: 'Trójkąt równoboczny: środki okręgów wpisanego i opisanego pokrywają się ze środkiem ciężkości; $R = \\frac{a\\sqrt{3}}{3}$, $r = \\frac{a\\sqrt{3}}{6}$.',
    answer: T`$R = ${sq(3, k)}$, pole pierścienia $${diff}\pi$`
  });
};

// ---------- 10.1 Środek i długość odcinka ----------
const midpointLength = (r) => {
  const [ax, ay] = [r.int(-6, 6), r.int(-6, 6)];
  const [sx, sy] = [r.int(-5, 5), r.int(-5, 5)];
  need(sx !== ax || sy !== ay);
  const [bx, by] = [2 * sx - ax, 2 * sy - ay];
  const d2 = (bx - ax) ** 2 + (by - ay) ** 2;
  return open({
    title: 'Drugi koniec odcinka i jego długość',
    q: T`Punkt $S = ${pt(sx, sy)}$ jest środkiem odcinka $AB$, gdzie $A = ${pt(ax, ay)}$. Wyznacz współrzędne punktu $B$ oraz oblicz długość odcinka $AB$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie $B = ${pt(bx, by)}$.`],
      [2, 'Komplet', T`Obliczenie $|AB| = ${sq(d2)}$.`]
    ],
    steps: [
      T`$\frac{${ax} + x_B}{2} = ${sx}$ i $\frac{${ay} + y_B}{2} = ${sy}$, więc $B = ${pt(bx, by)}$.`,
      T`$|AB| = \sqrt{(${bx} - ${par(ax)})^2 + (${by} - ${par(ay)})^2} = \sqrt{${d2}} = ${sq(d2)}$.`
    ],
    trap: 'Środek odcinka to średnia współrzędnych końców – współrzędne B to 2·S − A, a nie S − A.',
    tip: 'Karta wzorów, str. 21: $S = \\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\right)$, $|AB| = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$.',
    answer: T`$B = ${pt(bx, by)}$, $|AB| = ${sq(d2)}$`
  });
};

// ---------- 10.2 Prosta przez dwa punkty w postaci ogólnej ----------
const lineGeneral = (r) => {
  const a = r.intNot(-3, 3, 0);
  const b = r.intNot(-6, 6, 0);
  const [x1, x2] = [r.int(-4, 0), r.int(1, 4)];
  const [y1, y2] = [a * x1 + b, a * x2 + b];
  const px = r.int(-5, 5);
  const on = r.bool();
  const py = a * px + b + (on ? 0 : r.pick([1, -1, 2]));
  const gen = `${a > 0 ? poly([[a, 'x'], [-1, 'y'], [b, '']]) : poly([[-a, 'x'], [1, 'y'], [-b, '']])} = 0`;
  return open({
    title: 'Równanie prostej w postaci ogólnej',
    q: T`Wyznacz równanie prostej przechodzącej przez punkty $A = ${pt(x1, y1)}$ i $B = ${pt(x2, y2)}$ w postaci ogólnej. Sprawdź, czy punkt $P = ${pt(px, py)}$ leży na tej prostej. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie równania prostej $AB$: $y = ${lin(a, b)}$.`],
      [2, 'Komplet', T`Postać ogólna $${gen}$ i poprawne rozstrzygnięcie: punkt $P$ ${on ? 'leży' : 'nie leży'} na prostej.`]
    ],
    steps: [
      T`$a = \frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = ${a}$, $b = ${y1} - ${par(a)} \cdot ${par(x1)} = ${b}$, więc $y = ${lin(a, b)}$.`,
      T`Postać ogólna: $${gen}$.`,
      T`Dla $x = ${px}$: $${a} \cdot ${par(px)} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${a * px + b} ${on ? '=' : '\\neq'} ${py}$, więc $P$ ${on ? 'leży' : 'nie leży'} na prostej.`
    ],
    trap: 'Sprawdzając, czy punkt leży na prostej, podstaw OBIE współrzędne – musi wyjść równość.',
    tip: 'Postać ogólna prostej: $Ax + By + C = 0$; z kierunkowej $y = ax + b$ otrzymasz ją, przenosząc wszystko na jedną stronę.',
    answer: T`$${gen}$, $P$ ${on ? 'leży' : 'nie leży'} na prostej`
  });
};

// ---------- 10.3 Prosta równoległa przez punkt i punkt przecięcia ----------
const parallelAndCross = (r) => {
  const a1 = r.intNot(-3, 3, 0);
  const [px, py] = [r.int(-4, 4), r.int(-5, 5)];
  const b1 = py - a1 * px;
  const a2 = r.intNot(-3, 3, 0, a1);
  const ix = r.intNot(-4, 4, px);
  const iy = a1 * ix + b1;
  const b2 = iy - a2 * ix;
  const c0 = b1 + r.intNot(-6, 6, 0);
  check(a1 * ix + b1 === a2 * ix + b2, '10.3');
  return open({
    title: 'Prosta równoległa i punkt przecięcia',
    q: T`Prosta $l$ przechodzi przez punkt $P = ${pt(px, py)}$ i jest równoległa do prostej $y = ${lin(a1, c0)}$. Wyznacz równanie prostej $l$ oraz współrzędne punktu przecięcia prostej $l$ z prostą $k$: $y = ${lin(a2, b2)}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie równania prostej $l$: $y = ${lin(a1, b1)}$.`],
      [2, 'Komplet', T`Wyznaczenie punktu przecięcia: $${pt(ix, iy)}$.`]
    ],
    steps: [
      T`Proste równoległe mają ten sam współczynnik kierunkowy: $l$: $y = ${a1 === 1 ? '' : a1 === -1 ? '-' : a1}x + b$.`,
      T`$${py} = ${a1} \cdot ${par(px)} + b$, więc $b = ${b1}$ i $l$: $y = ${lin(a1, b1)}$.`,
      T`$${lin(a1, b1)} = ${lin(a2, b2)}$, stąd $x = ${ix}$ i $y = ${iy}$.`
    ],
    trap: 'Prosta równoległa ma ten sam współczynnik kierunkowy, ale INNY wyraz wolny – trzeba go wyznaczyć z punktu P.',
    tip: 'Karta wzorów, str. 22: proste $y = a_1x + b_1$ i $y = a_2x + b_2$ są równoległe, gdy $a_1 = a_2$.',
    answer: T`$l$: $y = ${lin(a1, b1)}$, punkt $${pt(ix, iy)}$`
  });
};

// ---------- 10.4 Okrąg i oś Ox ----------
const circleAxis = (r) => {
  const [t, bb, rad] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]]);
  const a = r.intNot(-4, 4, 0);
  const b = bb * r.pick([1, -1]);
  const xs = [a - t, a + t];
  for (const x of xs) check((x - a) ** 2 + b * b === rad * rad, '10.4');
  const eq = `(${xm(a)})^2 + (${xm(b, 'y')})^2 = ${rad * rad}`;
  return open({
    title: 'Punkty wspólne okręgu z osią Ox',
    q: T`Okrąg ma środek w punkcie $S = ${pt(a, b)}$ i przechodzi przez punkt $A = ${pt(a + t, 0)}$. Zapisz równanie tego okręgu i wyznacz wszystkie jego punkty wspólne z osią $Ox$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie promienia $r = |SA| = ${rad}$ i zapisanie równania $${eq}$.`],
      [2, 'Komplet', T`Punkty wspólne z osią $Ox$: $${pt(xs[0], 0)}$ i $${pt(xs[1], 0)}$.`]
    ],
    steps: [
      T`$r = |SA| = \sqrt{${t}^2 + ${par(b)}^2} = ${rad}$, więc równanie okręgu: $${eq}$.`,
      T`Na osi $Ox$ jest $y = 0$: $(${xm(a)})^2 + ${b * b} = ${rad * rad}$, czyli $(${xm(a)})^2 = ${t * t}$.`,
      T`$x = ${xs[0]}$ lub $x = ${xs[1]}$.`
    ],
    trap: T`W równaniu okręgu po prawej stronie jest $r^2 = ${rad * rad}$, a nie $r = ${rad}$.`,
    tip: 'Karta wzorów, str. 23: okrąg o środku $(a, b)$ i promieniu $r$: $(x - a)^2 + (y - b)^2 = r^2$.',
    answer: T`$${eq}$; punkty $${pt(xs[0], 0)}$, $${pt(xs[1], 0)}$`
  });
};

// ---------- 10.5 Symetrie ----------
const symmetryLength = (r) => {
  const [ax, ay] = [r.intNot(-6, 6, 0), r.intNot(-6, 6, 0)];
  const [bx, by] = [r.intNot(-6, 6, 0), r.intNot(-6, 6, 0)];
  const kindA = r.pick(['Ox', 'Oy']);
  const A2 = kindA === 'Ox' ? [ax, -ay] : [-ax, ay];
  const B2 = [-bx, -by];
  const d2 = (A2[0] - B2[0]) ** 2 + (A2[1] - B2[1]) ** 2;
  need(d2 > 0);
  return open({
    title: 'Obrazy punktów w symetriach',
    q: T`Punkt $A'$ jest obrazem punktu $A = ${pt(ax, ay)}$ w symetrii względem osi $${kindA}$, a punkt $B'$ jest obrazem punktu $B = ${pt(bx, by)}$ w symetrii względem początku układu współrzędnych. Wyznacz współrzędne punktów $A'$ i $B'$ oraz oblicz długość odcinka $A'B'$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie $A' = ${pt(...A2)}$ i $B' = ${pt(...B2)}$.`],
      [2, 'Komplet', T`Obliczenie $|A'B'| = ${sq(d2)}$.`]
    ],
    steps: [
      T`Symetria względem osi $${kindA}$ zmienia znak ${kindA === 'Ox' ? 'drugiej' : 'pierwszej'} współrzędnej: $A' = ${pt(...A2)}$.`,
      T`Symetria względem początku układu zmienia znaki obu współrzędnych: $B' = ${pt(...B2)}$.`,
      T`$|A'B'| = \sqrt{(${B2[0]} - ${par(A2[0])})^2 + (${B2[1]} - ${par(A2[1])})^2} = \sqrt{${d2}} = ${sq(d2)}$.`
    ],
    trap: 'Symetria względem osi Ox zmienia znak współrzędnej y (nie x), a względem osi Oy – współrzędnej x.',
    tip: 'Symetria względem Ox: (x, y) → (x, −y); względem Oy: (x, y) → (−x, y); względem (0, 0): (x, y) → (−x, −y).',
    answer: T`$A' = ${pt(...A2)}$, $B' = ${pt(...B2)}$, $|A'B'| = ${sq(d2)}$`
  });
};

export const OPEN_B = {
  '6.1': [toCanonical],
  '6.2': [rangeMonotonic],
  '6.3': [zerosFromCanonical],
  '6.4': [extremaInterval],
  '6.5': [formulaFromZeros],
  '7.1': [negativeTerms],
  '7.2': [arithTwoTerms],
  '7.3': [arithSum],
  '7.4': [geomSum],
  '7.5': [threeTermsGeom],
  '8.1': [rightTriangleSin],
  '8.2': [trigValue],
  '8.3': [tanToExpr],
  '8.4': [obtuseAngle],
  '8.5': [cosLawArea],
  '9.1': [isoscelesArea],
  '9.2': [talesSegment],
  '9.3': [geoProof, regularPolygon],
  '9.4': [tangentLength],
  '9.5': [sectorArc, equilateralCircles],
  '10.1': [midpointLength],
  '10.2': [lineGeneral],
  '10.3': [parallelAndCross],
  '10.4': [circleAxis],
  '10.5': [symmetryLength]
};

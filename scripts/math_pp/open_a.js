/**
 * Zadania otwarte (PP) – działy 1–5. Format i etapy jak w zasadach oceniania CKE (2–4 pkt).
 * Każdy generator sam sprawdza arytmetykę wyniku (throw Error = błąd generatora, Retry = losuj ponownie).
 */
import { T, open, fr, dec, par, poly, quad, lin, xm, sq, need, gcd, iv, m } from './lib.js';

const check = (cond, msg) => {
  if (!cond) throw new Error(`kontrola zadania otwartego: ${msg}`);
};
const bil = (k, few, many) => (k >= 2 && k <= 4 ? `bilety ${few}` : `biletów ${many}`);
const zl = (x) => `${dec(x, 2).replace(/\{,\}/g, ',')} zł`;

// ---------- 1.1 Potęgi ----------
const powExpression = (r) => {
  const a = r.pick([2, 3, 5]);
  const p = r.int(2, 6);
  const q = r.int(2, 3);
  const k = r.int(2, 3);
  const e = p + 2 * q - 3 * k;
  need(e >= -2 && e <= 3 && e !== 0);
  const val = a ** e;
  return open({
    title: 'Wartość wyrażenia z potęgami',
    q: T`Oblicz wartość wyrażenia $\frac{${a}^{${p}} \cdot \left(${a}^{${q}}\right)^{2}}{${k === 1 ? `${a}^{3}` : `\\left(${a}^{${k}}\\right)^{3}`}}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zastosowanie praw działań na potęgach i zapisanie wyrażenia jako jednej potęgi: $${a}^{${p} + ${2 * q} - ${3 * k}} = ${a}^{${e}}$.`],
      [2, 'Komplet', T`Obliczenie wartości: $${fr(e >= 0 ? val : 1, e >= 0 ? 1 : a ** -e)}$.`]
    ],
    steps: [
      T`$\left(${a}^{${q}}\right)^{2} = ${a}^{${2 * q}}$ oraz $\left(${a}^{${k}}\right)^{3} = ${a}^{${3 * k}}$.`,
      T`$\frac{${a}^{${p}} \cdot ${a}^{${2 * q}}}{${a}^{${3 * k}}} = ${a}^{${p} + ${2 * q} - ${3 * k}} = ${a}^{${e}}$.`,
      T`$${a}^{${e}} = ${fr(e >= 0 ? val : 1, e >= 0 ? 1 : a ** -e)}$.`
    ],
    trap: T`Przy potęgowaniu potęgi wykładniki mnożymy ($\left(${a}^{${q}}\right)^{2} = ${a}^{${2 * q}}$), a przy mnożeniu potęg – dodajemy.`,
    tip: 'Karta wzorów, str. 4: $a^r \\cdot a^s = a^{r+s}$, $\\frac{a^r}{a^s} = a^{r-s}$, $(a^r)^s = a^{r \\cdot s}$.',
    answer: m(fr(e >= 0 ? val : 1, e >= 0 ? 1 : a ** -e))
  });
};

// ---------- 1.2 Pierwiastki ----------
const rootSum = (r) => {
  const a = r.pick([2, 3, 5, 6, 7]);
  const [k, mm, n] = [r.int(2, 5), r.int(2, 6), r.int(1, 4)];
  need(k !== mm && k + mm - n > 0 && new Set([k, mm, n]).size === 3);
  const c = k + mm - n;
  return open({
    title: 'Suma pierwiastków',
    q: T`Oblicz wartość wyrażenia $\sqrt{${a * k * k}} + \sqrt{${a * mm * mm}} - \sqrt{${a * n * n}}$. Wynik zapisz w postaci $c\sqrt{${a}}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyłączenie czynników przed znak pierwiastka: $${k}\sqrt{${a}}$, $${mm}\sqrt{${a}}$, $${n === 1 ? '' : n}\sqrt{${a}}$.`],
      [2, 'Komplet', T`Obliczenie wartości wyrażenia: $${c === 1 ? '' : c}\sqrt{${a}}$.`]
    ],
    steps: [
      T`$\sqrt{${a * k * k}} = \sqrt{${k * k} \cdot ${a}} = ${k}\sqrt{${a}}$, $\sqrt{${a * mm * mm}} = ${mm}\sqrt{${a}}$, $\sqrt{${a * n * n}} = ${n === 1 ? '' : n}\sqrt{${a}}$.`,
      T`$${k}\sqrt{${a}} + ${mm}\sqrt{${a}} - ${n === 1 ? '' : n}\sqrt{${a}} = ${c === 1 ? '' : c}\sqrt{${a}}$.`
    ],
    trap: T`Pierwiastków nie dodajemy pod jednym znakiem: $\sqrt{${a * k * k}} + \sqrt{${a * mm * mm}} \neq \sqrt{${a * k * k + a * mm * mm}}$. Najpierw wyłącz czynniki, potem dodaj „takie same” pierwiastki.`,
    tip: 'Karta wzorów, str. 4: $\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$ dla $a, b \\ge 0$.',
    answer: m(`${c === 1 ? '' : c}\\sqrt{${a}}`)
  });
};

// ---------- 1.3 Logarytmy ----------
const logExpression = (r) => {
  const a = r.pick([2, 3, 5]);
  const e = r.int(1, 4);
  const x = a ** r.int(1, 3) * r.pick([1, 3, 5, 7].filter((t) => t !== a));
  const z = r.pick([1, 3, 5, 7].filter((t) => t !== a && x % t === 0));
  const y = (a ** e * z) / x;
  need(Number.isInteger(y) && y > 1 && y !== a && x > 1 && z > 1 && new Set([x, y, z]).size === 3);
  check((x * y) / z === a ** e, '1.3');
  return open({
    title: 'Wartość wyrażenia z logarytmami',
    q: T`Oblicz wartość wyrażenia $\log_{${a}} ${x} + \log_{${a}} ${y} - \log_{${a}} ${z}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zastosowanie wzorów na logarytm iloczynu i ilorazu: $\log_{${a}} \frac{${x} \cdot ${y}}{${z}}$.`],
      [2, 'Komplet', T`Obliczenie wartości: $\log_{${a}} ${a ** e} = ${e}$.`]
    ],
    steps: [T`$\log_{${a}} ${x} + \log_{${a}} ${y} - \log_{${a}} ${z} = \log_{${a}} \frac{${x} \cdot ${y}}{${z}} = \log_{${a}} ${a ** e}$.`, T`$${a}^{${e}} = ${a ** e}$, więc $\log_{${a}} ${a ** e} = ${e}$.`],
    trap: T`Suma logarytmów to logarytm ILOCZYNU, a nie suma liczb pod logarytmem: $\log_{${a}} ${x} + \log_{${a}} ${y} \neq \log_{${a}} ${x + y}$.`,
    tip: 'Karta wzorów, str. 5: $\\log_a x + \\log_a y = \\log_a (xy)$, $\\log_a x - \\log_a y = \\log_a \\frac{x}{y}$.',
    answer: m(e)
  });
};

// ---------- 1.4 Wartość bezwzględna i przedziały ----------
const absIneq = (r) => {
  const p = r.intNot(-6, 6, 0);
  const rr = r.int(2, 7);
  const le = r.bool();
  const [lo, hi] = [p - rr, p + rr];
  const set = le ? iv.cc(lo, hi) : `${iv.lo(lo)} \\cup ${iv.ro(hi)}`;
  return open({
    title: 'Nierówność z wartością bezwzględną',
    q: T`Rozwiąż nierówność $|${xm(p)}| ${le ? '\\le' : '>'} ${rr}$. Zapisz zbiór rozwiązań w postaci ${le ? 'przedziału' : 'sumy przedziałów'}. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', le ? T`Zapisanie nierówności podwójnej: $-${rr} \le ${xm(p)} \le ${rr}$ (albo: odległość $x$ od $${p}$ jest nie większa niż $${rr}$).` : T`Zapisanie alternatywy: $${xm(p)} < -${rr}$ lub $${xm(p)} > ${rr}$.`],
      [2, 'Komplet', T`Zapisanie zbioru rozwiązań: $${set}$.`]
    ],
    steps: [
      T`$|${xm(p)}|$ to odległość liczby $x$ od $${p}$ na osi liczbowej.`,
      le ? T`$-${rr} \le ${xm(p)} \le ${rr}$, czyli $${lo} \le x \le ${hi}$.` : T`$${xm(p)} < -${rr}$ lub $${xm(p)} > ${rr}$, czyli $x < ${lo}$ lub $x > ${hi}$.`,
      T`Zbiór rozwiązań: $${set}$.`
    ],
    trap: le ? T`Nierówność „$\le$” daje przedział domknięty – oba końce należą do zbioru rozwiązań.` : T`Przy „$>$” rozwiązania leżą NA ZEWNĄTRZ przedziału $${iv.cc(lo, hi)}$, a końce do nich nie należą.`,
    tip: 'Wartość bezwzględna $|x - a|$ to odległość liczby $x$ od liczby $a$ na osi liczbowej.',
    answer: m(set)
  });
};

// ---------- 1.5 Procenty ----------
const deposit = (r) => {
  const K = r.pick([2000, 4000, 5000, 8000, 10000, 20000]);
  const p = r.pick([2, 4, 5, 10]);
  const n = 2;
  const end = Math.round(K * (1 + p / 100) ** n * 100) / 100;
  const gain = Math.round((end - K) * 100) / 100;
  check(Math.abs(end - K * (1 + p / 100) ** 2) < 0.005, '1.5');
  return open({
    title: 'Lokata z kapitalizacją roczną',
    q: T`Pan Adam wpłacił do banku $${K}$ zł na lokatę dwuletnią. Oprocentowanie lokaty wynosi $${p}\%$ w skali roku, a odsetki są dopisywane do kapitału po każdym roku. Oblicz, ile złotych odsetek otrzyma pan Adam po dwóch latach. Pomiń podatki. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie kwoty po dwóch latach: $${K} \cdot ${dec(1 + p / 100, 2)}^{2}$.`],
      [2, 'Komplet', T`Obliczenie odsetek: $${dec(gain, 2)}$ zł.`]
    ],
    steps: [
      T`Po każdym roku kapitał rośnie o $${p}\%$, czyli jest mnożony przez $${dec(1 + p / 100, 2)}$.`,
      T`Po dwóch latach: $${K} \cdot ${dec(1 + p / 100, 2)}^{2} = ${dec(end, 2)}$ zł.`,
      T`Odsetki: $${dec(end, 2)} - ${K} = ${dec(gain, 2)}$ zł.`
    ],
    trap: T`Procent składany to NIE $2 \cdot ${p}\% = ${2 * p}\%$ kapitału – w drugim roku odsetki naliczane są także od odsetek z pierwszego roku.`,
    tip: 'Karta wzorów, str. 3: kapitał po $n$ okresach $K_n = K\\left(1 + \\frac{p}{100}\\right)^n$.',
    answer: zl(gain)
  });
};

// ---------- 2.1 Wzory skróconego mnożenia ----------
const proofShortMult = (r) => {
  const a = r.int(2, 7);
  const v = r.pick(['x', 'a', 'n']);
  return open({
    title: 'Dowód z wzorami skróconego mnożenia',
    proof: true,
    q: T`Wykaż, że dla każdej liczby rzeczywistej $${v}$ prawdziwa jest równość $(${v} + ${a})^2 - (${v} - ${a})^2 = ${4 * a}${v}$.`,
    stages: [
      [1, 'Etap 1', T`Poprawne zastosowanie wzorów skróconego mnożenia do obu nawiasów: $${v}^2 + ${2 * a}${v} + ${a * a}$ oraz $${v}^2 - ${2 * a}${v} + ${a * a}$.`],
      [2, 'Komplet', T`Przeprowadzenie pełnego przekształcenia i uzyskanie $${4 * a}${v}$ (albo zastosowanie wzoru $a^2 - b^2$ i uzyskanie $2${v} \cdot ${2 * a}$).`]
    ],
    zero: ['Sprawdzenie równości tylko dla kilku konkretnych liczb nie jest dowodem – 0 pkt.'],
    steps: [
      T`$(${v} + ${a})^2 = ${v}^2 + ${2 * a}${v} + ${a * a}$ oraz $(${v} - ${a})^2 = ${v}^2 - ${2 * a}${v} + ${a * a}$.`,
      T`Różnica: $${v}^2 + ${2 * a}${v} + ${a * a} - ${v}^2 + ${2 * a}${v} - ${a * a} = ${4 * a}${v}$, co kończy dowód.`
    ],
    trap: T`Odejmując cały nawias, zmieniamy znak KAŻDEGO wyrazu: $-(${v}^2 - ${2 * a}${v} + ${a * a}) = -${v}^2 + ${2 * a}${v} - ${a * a}$.`,
    tip: 'Karta wzorów, str. 2: $(a \\pm b)^2 = a^2 \\pm 2ab + b^2$, $a^2 - b^2 = (a - b)(a + b)$.',
    answer: T`$(${v} + ${a})^2 - (${v} - ${a})^2 = ${4 * a}${v}$`
  });
};

// ---------- 2.2 Działania na wielomianach ----------
const polyProduct = (r) => {
  const a = r.intNot(-5, 5, 0);
  const b = r.intNot(-5, 5, 0);
  const c = r.intNot(-6, 6, 0);
  // (x + a)(x^2 + bx + c) - x^3 = (a + b)x^2 + (ab + c)x + ac
  const [A, B, C] = [a + b, a * b + c, a * c];
  need(A !== 0 && B !== 0);
  const W = poly([[A, 'x^2'], [B, 'x'], [C, '']]);
  const full = poly([[1, 'x^3'], [A, 'x^2'], [B, 'x'], [C, '']]);
  for (const x of [-2, 1, 3]) check((x + a) * (x * x + b * x + c) - x ** 3 === A * x * x + B * x + C, '2.2');
  return open({
    title: 'Iloczyn wielomianów',
    q: T`Dane są wielomiany $P(x) = ${lin(1, a)}$ oraz $Q(x) = ${quad(1, b, c)}$. Wyznacz wielomian $W(x) = P(x) \cdot Q(x) - x^3$ i zapisz go w postaci uporządkowanej. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Poprawne wymnożenie wielomianów: $P(x) \cdot Q(x) = ${full}$.`],
      [2, 'Komplet', T`Zapisanie wielomianu $W(x) = ${W}$.`]
    ],
    steps: [
      T`$(${lin(1, a)})(${quad(1, b, c)}) = ${poly([[1, 'x^3'], [b, 'x^2'], [c, 'x'], [a, 'x^2'], [a * b, 'x'], [a * c, '']])}$.`,
      T`Po redukcji: $${full}$.`,
      T`$W(x) = ${W}$.`
    ],
    trap: 'Każdy wyraz pierwszego wielomianu mnożymy przez KAŻDY wyraz drugiego – łatwo zgubić iloczyn wyrazów wolnych.',
    tip: 'Iloczyn wielomianów: mnożymy każdy wyraz przez każdy i redukujemy wyrazy podobne.',
    answer: m(`W(x) = ${W}`)
  });
};

// ---------- 2.3 Rozkład na czynniki ----------
const factorGrouping = (r) => {
  const p = r.intNot(-6, 6, 0);
  const q = r.int(1, 5);
  need(Math.abs(p) !== q);
  // x^3 - p x^2 - q^2 x + p q^2 = (x - p)(x - q)(x + q)
  const W = poly([[1, 'x^3'], [-p, 'x^2'], [-q * q, 'x'], [p * q * q, '']]);
  for (const x of [-3, 2, 5]) check(x ** 3 - p * x * x - q * q * x + p * q * q === (x - p) * (x - q) * (x + q), '2.3');
  const ans = T`(${xm(p)})(${xm(q)})(${xm(-q)})`;
  return open({
    title: 'Rozkład wielomianu metodą grupowania',
    q: T`Rozłóż wielomian $W(x) = ${W}$ na czynniki liniowe. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Pogrupowanie wyrazów i wyłączenie wspólnego czynnika: $x^2(${xm(p)}) - ${q * q}(${xm(p)}) = (${xm(p)})(x^2 - ${q * q})$.`],
      [2, 'Komplet', T`Rozkład na czynniki liniowe: $${ans}$.`]
    ],
    steps: [
      T`$W(x) = x^2(${xm(p)}) - ${q * q}(${xm(p)})$.`,
      T`$W(x) = (${xm(p)})(x^2 - ${q * q})$.`,
      T`Ze wzoru na różnicę kwadratów: $x^2 - ${q * q} = (${xm(q)})(${xm(-q)})$, więc $W(x) = ${ans}$.`
    ],
    trap: T`Postać $(${xm(p)})(x^2 - ${q * q})$ to jeszcze nie rozkład na czynniki LINIOWE – trzeba rozłożyć różnicę kwadratów.`,
    tip: 'Karta wzorów, str. 2: $a^2 - b^2 = (a - b)(a + b)$.',
    answer: m(ans)
  });
};

// ---------- 2.4 Mnożenie i dzielenie wyrażeń wymiernych ----------
const ratDivide = (r) => {
  const a = r.int(1, 6);
  const b = r.intNot(-5, 5, 0, a, -a);
  const k = r.int(2, 5);
  // (x^2 - a^2)/(x + b) : (k(x - a))/(x + b) = (x + a)/k
  return open({
    title: 'Dzielenie wyrażeń wymiernych',
    q: T`Przedstaw wyrażenie $\frac{x^2 - ${a * a}}{${xm(-b)}} : \frac{${k}x - ${k * a}}{${xm(-b)}}$ w najprostszej postaci. Podaj, dla jakich liczb $x$ to wyrażenie jest określone. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie dziedziny: $x \neq ${-b}$ i $x \neq ${a}$ (dzielnik nie może być równy zero).`],
      [2, 'Komplet', T`Zamiana dzielenia na mnożenie, rozkład $x^2 - ${a * a} = (${xm(a)})(${xm(-a)})$ i uproszczenie do $\frac{${xm(-a)}}{${k}}$.`]
    ],
    steps: [
      T`Wyrażenie jest określone, gdy $${xm(-b)} \neq 0$ oraz $${k}x - ${k * a} \neq 0$, czyli $x \neq ${-b}$ i $x \neq ${a}$.`,
      T`$\frac{x^2 - ${a * a}}{${xm(-b)}} \cdot \frac{${xm(-b)}}{${k}(${xm(a)})} = \frac{(${xm(a)})(${xm(-a)})}{${k}(${xm(a)})}$.`,
      T`Po skróceniu: $\frac{${xm(-a)}}{${k}}$.`
    ],
    trap: T`Dzielimy przez ułamek, więc mnożymy przez jego odwrotność. Licznik dzielnika ($${k}x - ${k * a}$) też musi być różny od zera – stąd warunek $x \neq ${a}$.`,
    tip: 'Dzielenie przez ułamek to mnożenie przez jego odwrotność; skracamy dopiero po rozłożeniu na czynniki.',
    answer: T`$\frac{${xm(-a)}}{${k}}$ dla $x \neq ${-b}$ i $x \neq ${a}$`
  });
};

// ---------- 2.5 Dowody algebraiczne (I.2) ----------
const PROOFS_25 = [
  (k) => ({
    q: T`Wykaż, że dla każdej liczby całkowitej $n$ liczba $(n + ${k})^2 - (n - ${k})^2$ jest podzielna przez $${4 * k}$.`,
    s1: T`Przekształcenie wyrażenia do postaci $${4 * k}n$.`,
    s2: T`Wniosek: $${4 * k}n$ jest podzielne przez $${4 * k}$, bo $n$ jest liczbą całkowitą.`,
    steps: [T`$(n + ${k})^2 - (n - ${k})^2 = n^2 + ${2 * k}n + ${k * k} - n^2 + ${2 * k}n - ${k * k} = ${4 * k}n$.`, T`$n$ jest całkowite, więc $${4 * k}n = ${4 * k} \cdot n$ dzieli się przez $${4 * k}$.`],
    ans: T`$(n + ${k})^2 - (n - ${k})^2 = ${4 * k}n$`
  }),
  (k) => ({
    q: T`Wykaż, że suma ${k === 1 ? 'trzech' : 'pięciu'} kolejnych liczb całkowitych jest podzielna przez $${k + 2}$. Oznacz najmniejszą z tych liczb przez $n$.`,
    s1: T`Zapisanie sumy: $${k + 2}n + ${((k + 1) * (k + 2)) / 2}$.`,
    s2: T`Zapisanie sumy w postaci $${k + 2}\left(n + ${(k + 1) / 2}\right)$ i wniosek o podzielności.`,
    steps: [T`Suma: $n + (n + 1) + \ldots + (n + ${k + 1}) = ${k + 2}n + (1 + 2 + \ldots + ${k + 1}) = ${k + 2}n + ${((k + 1) * (k + 2)) / 2}$.`, T`$${k + 2}n + ${((k + 1) * (k + 2)) / 2} = ${k + 2}(n + ${(k + 1) / 2})$, a $n + ${(k + 1) / 2}$ jest liczbą całkowitą.`],
    ans: T`suma $= ${k + 2}(n + ${(k + 1) / 2})$`
  }),
  (k) => ({
    q: T`Wykaż, że dla każdej liczby całkowitej $n$ liczba $n^2 + ${2 * k + 1}n + ${k * k + k}$ jest parzysta.`,
    s1: T`Rozkład wyrażenia na czynniki: $(n + ${k})(n + ${k + 1})$.`,
    s2: 'Uzasadnienie: iloczyn dwóch kolejnych liczb całkowitych jest parzysty (jedna z nich jest parzysta).',
    steps: [T`$n^2 + ${2 * k + 1}n + ${k * k + k} = (n + ${k})(n + ${k + 1})$ (sprawdzenie: $(n + ${k})(n + ${k + 1}) = n^2 + ${2 * k + 1}n + ${k * (k + 1)}$).`, T`$n + ${k}$ i $n + ${k + 1}$ to dwie kolejne liczby całkowite, więc jedna z nich jest parzysta, a iloczyn jest parzysty.`],
    ans: T`$n^2 + ${2 * k + 1}n + ${k * k + k} = (n + ${k})(n + ${k + 1})$`
  }),
  () => ({
    q: T`Wykaż, że dla każdej liczby całkowitej nieparzystej $n$ liczba $n^2 - 1$ jest podzielna przez $8$.`,
    s1: T`Zapisanie $n = 2k + 1$ i przekształcenie: $n^2 - 1 = 4k(k + 1)$.`,
    s2: T`Uzasadnienie: $k(k + 1)$ jest parzyste, więc $4k(k + 1)$ dzieli się przez $8$.`,
    steps: [T`$n = 2k + 1$, gdzie $k$ jest całkowite: $n^2 - 1 = 4k^2 + 4k = 4k(k + 1)$.`, T`$k(k + 1)$ to iloczyn dwóch kolejnych liczb całkowitych, więc jest parzysty: $k(k + 1) = 2l$. Zatem $n^2 - 1 = 8l$.`],
    ans: T`$n^2 - 1 = 4k(k + 1) = 8l$`
  })
];
const proofDivisibility = (r) => {
  const tpl = r.pick(PROOFS_25);
  const k = r.pick([1, 2, 3]);
  const kk = tpl === PROOFS_25[1] ? r.pick([1, 3]) : k;
  const t = tpl(kk);
  return open({
    title: 'Dowód podzielności',
    proof: true,
    q: t.q,
    stages: [
      [1, 'Etap 1', t.s1],
      [2, 'Komplet', t.s2]
    ],
    zero: ['Sprawdzenie tezy na kilku przykładach nie jest dowodem – 0 pkt.'],
    steps: t.steps,
    trap: 'Dowód musi działać dla KAŻDEJ liczby z treści – zapisz ją ogólnie (np. $n$, $2k + 1$) i przekształcaj wyrażenie, a nie podstawiaj przykładów.',
    tip: 'Liczba jest podzielna przez $d$, gdy da się ją zapisać jako $d \\cdot k$, gdzie $k$ jest liczbą całkowitą.',
    answer: t.ans
  });
};

// ---------- 3.1 Nierówność liniowa ----------
const linIneqFractions = (r) => {
  const [b, d] = r.pick([[2, 3], [3, 2], [2, 5], [3, 4], [4, 3], [5, 2]]);
  const a = r.intNot(-5, 5, 0);
  const c = r.intNot(-5, 5, 0);
  const e = r.int(-3, 3);
  // (x - a)/b - (x + c)/d >= e  ->  d(x - a) - b(x + c) >= e·b·d  ->  (d - b)x >= ebd + da + bc
  const L = d - b;
  const R = e * b * d + d * a + b * c;
  need(L !== 0);
  const bound = fr(R, L);
  const ge = L > 0;
  const set = ge ? iv.rc(bound) : iv.lc(bound);
  return open({
    title: 'Nierówność liniowa z ułamkami',
    q: T`Rozwiąż nierówność $\frac{${xm(a)}}{${b}} - \frac{${xm(-c)}}{${d}} \ge ${e}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Pomnożenie obu stron przez $${b * d}$ i doprowadzenie do postaci $${L === 1 ? '' : L === -1 ? '-' : L}x \ge ${R}$.`],
      [2, 'Komplet', T`Zapisanie zbioru rozwiązań: $${set}$.`]
    ],
    steps: [
      T`Mnożymy obie strony przez $${b * d}$: $${d}(${xm(a)}) - ${b}(${xm(-c)}) \ge ${e * b * d}$.`,
      T`$${d}x ${-d * a >= 0 ? '+' : '-'} ${Math.abs(d * a)} - ${b}x ${-b * c >= 0 ? '+' : '-'} ${Math.abs(b * c)} \ge ${e * b * d}$, czyli $${L === 1 ? '' : L === -1 ? '-' : L}x \ge ${R}$.`,
      ...(L === 1 ? [] : [L > 0 ? T`Dzielimy przez $${L} > 0$: $x \ge ${bound}$.` : T`Dzielimy przez $${L} < 0$ i zmieniamy zwrot nierówności: $x \le ${bound}$.`]),
      T`Zbiór rozwiązań: $${set}$.`
    ],
    trap: L > 0 ? T`Mnożąc przez wspólny mianownik, pomnóż KAŻDY wyraz – także prawą stronę ($${e} \cdot ${b * d}$).` : T`Dzielenie przez liczbę ujemną zmienia zwrot nierówności na przeciwny.`,
    tip: 'Mnożenie lub dzielenie nierówności przez liczbę ujemną zmienia jej zwrot.',
    answer: m(set)
  });
};

// ---------- 3.2 Równanie kwadratowe ----------
const quadEquation = (r) => {
  const p = r.int(-7, 7);
  const q = r.intNot(-7, 7, p);
  const a = r.pick([1, 1, 2, -1]);
  const [B, C] = [-a * (p + q), a * p * q];
  const D = B * B - 4 * a * C;
  check(D === (a * (p - q)) ** 2, '3.2');
  const [x1, x2] = [Math.min(p, q), Math.max(p, q)];
  return open({
    title: 'Równanie kwadratowe',
    q: T`Rozwiąż równanie $${quad(a, B, C)} = 0$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie wyróżnika $\Delta = ${D}$ (lub poprawny rozkład trójmianu na czynniki).`],
      [2, 'Komplet', T`Wyznaczenie rozwiązań: $x_1 = ${x1}$, $x_2 = ${x2}$.`]
    ],
    steps: [
      T`$\Delta = ${par(B)}^2 - 4 \cdot ${par(a)} \cdot ${par(C)} = ${D}$, $\sqrt{\Delta} = ${Math.sqrt(D)}$.`,
      T`$x_1 = \frac{${-B} - ${Math.sqrt(D)}}{${2 * a}}$, $x_2 = \frac{${-B} + ${Math.sqrt(D)}}{${2 * a}}$, czyli rozwiązaniami są $${x1}$ i $${x2}$.`
    ],
    trap: T`We wzorze na pierwiastki jest $-b$: dla $b = ${B}$ licznik zaczyna się od $${-B}$, a mianownik to $2a = ${2 * a}$.`,
    tip: 'Karta wzorów, str. 3: $\\Delta = b^2 - 4ac$, $x_{1,2} = \\frac{-b \\mp \\sqrt{\\Delta}}{2a}$.',
    answer: T`$x = ${x1}$ lub $x = ${x2}$`
  });
};

// ---------- 3.3 Nierówność kwadratowa ----------
const quadIneq = (r) => {
  const p = r.int(-6, 6);
  const q = r.intNot(-6, 6, p);
  const a = r.pick([1, -1, 2, -2]);
  const rel = r.pick(['\\le', '\\ge', '<', '>']);
  const [B, C] = [-a * (p + q), a * p * q];
  const [x1, x2] = [Math.min(p, q), Math.max(p, q)];
  const neg = rel === '\\le' || rel === '<'; // f(x) <= 0
  const closed = rel === '\\le' || rel === '\\ge';
  const inside = (a > 0) === neg;
  const set = inside ? (closed ? iv.cc(x1, x2) : iv.oo(x1, x2)) : closed ? `${iv.lc(x1)} \\cup ${iv.rc(x2)}` : `${iv.lo(x1)} \\cup ${iv.ro(x2)}`;
  // kontrola punktów testowych
  const f = (x) => a * x * x + B * x + C;
  const ok = (v) => (rel === '\\le' ? v <= 0 : rel === '\\ge' ? v >= 0 : rel === '<' ? v < 0 : v > 0);
  check(ok(f((x1 + x2) / 2)) === inside && ok(f(x2 + 1)) === !inside, '3.3');
  return open({
    title: 'Nierówność kwadratowa',
    q: T`Rozwiąż nierówność $${quad(a, B, C)} ${rel} 0$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie pierwiastków trójmianu: $x_1 = ${x1}$, $x_2 = ${x2}$ (albo zaznaczenie ich na wykresie).`],
      [2, 'Komplet', T`Zapisanie zbioru rozwiązań: $${set}$.`]
    ],
    zero: ['Jeżeli zdający popełni błąd przy obliczaniu pierwiastków, ale konsekwentnie zapisze zbiór rozwiązań, otrzymuje 1 pkt.'],
    steps: [
      T`Pierwiastki trójmianu: $\Delta = ${B * B - 4 * a * C}$, $x_1 = ${x1}$, $x_2 = ${x2}$.`,
      T`Współczynnik $a = ${a}$ ${a > 0 ? 'jest dodatni – ramiona paraboli skierowane do góry' : 'jest ujemny – ramiona paraboli skierowane w dół'}.`,
      T`Trójmian jest ${neg ? (closed ? 'niedodatni' : 'ujemny') : closed ? 'nieujemny' : 'dodatni'} ${inside ? 'między pierwiastkami' : 'poza przedziałem między pierwiastkami'}: $${set}$.`
    ],
    trap: T`O tym, czy rozwiązania leżą między pierwiastkami, czy na zewnątrz, decyduje znak współczynnika $a$ – narysuj szkic paraboli.`,
    tip: 'Szkic paraboli: zaznacz miejsca zerowe, kierunek ramion i odczytaj, gdzie wykres jest nad (pod) osią Ox.',
    answer: m(set)
  });
};

// ---------- 3.4 Równanie wielomianowe ----------
const polyEquation = (r) => {
  const p = r.intNot(-5, 5, 0);
  const q = r.int(1, 4);
  need(Math.abs(p) !== q);
  const W = poly([[1, 'x^3'], [-p, 'x^2'], [-q * q, 'x'], [p * q * q, '']]);
  const roots = [p, q, -q].sort((x, y) => x - y);
  for (const x of roots) check(x ** 3 - p * x * x - q * q * x + p * q * q === 0, '3.4');
  return open({
    title: 'Równanie wielomianowe',
    q: T`Rozwiąż równanie $${W} = 0$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Doprowadzenie do postaci iloczynowej: $(${xm(p)})(x^2 - ${q * q}) = 0$.`],
      [2, 'Komplet', T`Wyznaczenie wszystkich rozwiązań: $${roots.join(', ')}$.`]
    ],
    steps: [
      T`Grupujemy: $x^2(${xm(p)}) - ${q * q}(${xm(p)}) = (${xm(p)})(x^2 - ${q * q}) = (${xm(p)})(${xm(q)})(${xm(-q)})$.`,
      T`Iloczyn jest równy zero, gdy jeden z czynników jest zerem: $x = ${p}$, $x = ${q}$ lub $x = ${-q}$.`
    ],
    trap: T`Z $x^2 = ${q * q}$ wynikają DWA rozwiązania: $${q}$ i $${-q}$.`,
    tip: 'Równanie w postaci iloczynowej: iloczyn jest równy zero, gdy co najmniej jeden czynnik jest zerem.',
    answer: T`$x \in \{${roots.join(', ')}\}$`
  });
};

// ---------- 3.5 Równanie wymierne ----------
const ratEquation = (r) => {
  const c = r.intNot(-5, 5, 0);
  const a = r.intNot(-4, 4, 0);
  const d = r.intNot(-5, 5, 0, a);
  const x0 = r.intNot(-6, 6, c);
  // (a x + b)/(x - c) = d  ->  a x + b = d(x - c)  ->  b = d(x0 - c) - a x0
  const b = d * (x0 - c) - a * x0;
  need(b !== 0 && a * c + b !== 0);
  check((a * x0 + b) / (x0 - c) === d, '3.5');
  return open({
    title: 'Równanie wymierne',
    q: T`Rozwiąż równanie $\frac{${lin(a, b)}}{${xm(c)}} = ${d}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie założenia $x \neq ${c}$ i przekształcenie do równania liniowego $${lin(a, b)} = ${d}(${xm(c)})$.`],
      [2, 'Komplet', T`Rozwiązanie $x = ${x0}$ i sprawdzenie, że należy do dziedziny.`]
    ],
    zero: [T`Brak założenia $x \neq ${c}$ przy poprawnym rozwiązaniu – 1 pkt.`],
    steps: [
      T`Założenie: $x \neq ${c}$.`,
      T`$${lin(a, b)} = ${d}(${xm(c)})$, czyli $${lin(a, b)} = ${lin(d, -d * c)}$, stąd $${a - d === 1 ? '' : a - d === -1 ? '-' : a - d}x = ${-d * c - b}$ i $x = ${x0}$.`,
      T`$${x0} \neq ${c}$, więc $x = ${x0}$ jest rozwiązaniem.`
    ],
    trap: 'Mnożąc przez mianownik, zakładasz, że jest różny od zera – sprawdź, czy otrzymane rozwiązanie nie zeruje mianownika.',
    tip: 'Równanie wymierne: dziedzina (mianownik ≠ 0), pomnożenie przez mianownik, sprawdzenie rozwiązania.',
    answer: m(`x = ${x0}`)
  });
};

// ---------- 4.1 Funkcja: argument dla danej wartości ----------
const fnArgument = (r) => {
  const c = r.intNot(-5, 5, 0);
  const a = r.intNot(-4, 4, 0);
  const k = r.intNot(-5, 5, 0, a);
  const x0 = r.intNot(-6, 6, c, c + 1);
  const b = k * (x0 - c) - a * x0;
  need(b !== 0);
  check((a * x0 + b) / (x0 - c) === k, '4.1');
  const fc = a * (c + 1) + b;
  return open({
    title: 'Argument, dla którego funkcja przyjmuje daną wartość',
    q: T`Funkcja $f$ jest określona wzorem $f(x) = \frac{${lin(a, b)}}{${xm(c)}}$ dla $x \neq ${c}$. Oblicz $f(${c + 1})$ oraz wyznacz argument, dla którego funkcja $f$ przyjmuje wartość $${k}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie $f(${c + 1}) = ${fc}$ albo zapisanie równania $\frac{${lin(a, b)}}{${xm(c)}} = ${k}$.`],
      [2, 'Komplet', T`$f(${c + 1}) = ${fc}$ oraz argument $x = ${x0}$.`]
    ],
    steps: [
      T`$f(${c + 1}) = \frac{${a} \cdot ${par(c + 1)} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}}{1} = ${fc}$.`,
      T`$\frac{${lin(a, b)}}{${xm(c)}} = ${k}$, więc $${lin(a, b)} = ${k}(${xm(c)})$ i $x = ${x0}$ (należy do dziedziny).`
    ],
    trap: 'Wartość funkcji to wynik dla danego argumentu; tu szukamy odwrotnie – argumentu dla danej wartości, więc trzeba rozwiązać równanie.',
    tip: 'Wartość funkcji w punkcie: podstaw argument do wzoru. Argument dla danej wartości: rozwiąż równanie f(x) = wartość.',
    answer: T`$f(${c + 1}) = ${fc}$, $x = ${x0}$`
  });
};

// ---------- 4.2 Zbiór wartości funkcji liniowej na przedziale ----------
const linRange = (r) => {
  const a = r.intNot(-4, 4, 0);
  const b = r.int(-6, 6);
  const [lo, hi] = [r.int(-5, 0), r.int(1, 5)];
  const [f1, f2] = [a * lo + b, a * hi + b];
  const [mn, mx] = [Math.min(f1, f2), Math.max(f1, f2)];
  return open({
    title: 'Zbiór wartości funkcji na przedziale',
    q: T`Funkcja $f$ jest określona wzorem $f(x) = ${lin(a, b)}$ dla $x \in ${iv.cc(lo, hi)}$. Wyznacz zbiór wartości funkcji $f$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Obliczenie wartości na końcach przedziału: $f(${lo}) = ${f1}$, $f(${hi}) = ${f2}$.`],
      [2, 'Komplet', T`Zbiór wartości: $${iv.cc(mn, mx)}$ (z uzasadnieniem monotoniczności).`]
    ],
    steps: [
      T`Funkcja liniowa o współczynniku $a = ${a}$ jest ${a > 0 ? 'rosnąca' : 'malejąca'}, więc wartości skrajne przyjmuje na końcach przedziału.`,
      T`$f(${lo}) = ${f1}$, $f(${hi}) = ${f2}$.`,
      T`Zbiór wartości: $${iv.cc(mn, mx)}$.`
    ],
    trap: a < 0 ? T`Funkcja jest malejąca, więc NAJWIĘKSZĄ wartość przyjmuje na LEWYM końcu przedziału.` : T`Zbiór wartości to przedział między $f(${lo})$ a $f(${hi})$, a nie przedział argumentów $${iv.cc(lo, hi)}$.`,
    tip: 'Funkcja liniowa na przedziale domkniętym przyjmuje wartość najmniejszą i największą na jego końcach.',
    answer: m(iv.cc(mn, mx))
  });
};

// ---------- 4.3 Przedział, w którym funkcja jest nieujemna ----------
const linSign = (r) => {
  const a = r.intNot(-4, 4, 0);
  const x0 = r.int(-3, 4);
  const b = -a * x0;
  const [lo, hi] = [r.int(-6, -4), r.int(5, 8)];
  const set = a > 0 ? iv.cc(x0, hi) : iv.cc(lo, x0);
  return open({
    title: 'Argumenty, dla których funkcja jest nieujemna',
    q: T`Funkcja $f$ jest określona wzorem $f(x) = ${lin(a, b)}$ dla $x \in ${iv.cc(lo, hi)}$. Wyznacz zbiór wszystkich argumentów, dla których funkcja $f$ przyjmuje wartości nieujemne. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Rozwiązanie nierówności $${lin(a, b)} \ge 0$: $x ${a > 0 ? '\\ge' : '\\le'} ${x0}$.`],
      [2, 'Komplet', T`Uwzględnienie dziedziny i zapisanie odpowiedzi: $${set}$.`]
    ],
    zero: [T`Pominięcie dziedziny $${iv.cc(lo, hi)}$ w odpowiedzi – 1 pkt.`],
    steps: [T`$${lin(a, b)} \ge 0$, czyli $${a === 1 ? '' : a === -1 ? '-' : a}x \ge ${-b}$, więc $x ${a > 0 ? '\\ge' : '\\le'} ${x0}$${a < 0 ? ' (dzielimy przez liczbę ujemną – zmiana zwrotu)' : ''}.`, T`Część wspólna z dziedziną $${iv.cc(lo, hi)}$: $${set}$.`],
    trap: 'Funkcja jest określona tylko na podanym przedziale – odpowiedź musi być jego podzbiorem.',
    tip: 'Wartości nieujemne: f(x) ≥ 0. Pamiętaj o dziedzinie funkcji.',
    answer: m(set)
  });
};

// ---------- 4.4 Przesunięcie wykresu ----------
const shiftZeros = (r) => {
  const k = r.int(1, 4);
  const p = r.intNot(-4, 4, 0);
  const q = r.intNot(-3, 3, 0);
  // f(x) = x^2 - k^2; g(x) = f(x - p) + q  -> (x - p)^2 = k^2 - q
  const s = k * k - q;
  need(s > 0 && Number.isInteger(Math.sqrt(s)));
  const t = Math.sqrt(s);
  const zs = [p - t, p + t];
  for (const z of zs) check((z - p) ** 2 - k * k + q === 0, '4.4');
  return open({
    title: 'Miejsca zerowe funkcji po przesunięciu',
    q: T`Funkcja $f$ jest określona wzorem $f(x) = x^2 - ${k * k}$. Funkcja $g$ jest określona wzorem $g(x) = f(${xm(p)}) ${q > 0 ? '+' : '-'} ${Math.abs(q)}$. Wyznacz miejsca zerowe funkcji $g$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie wzoru $g(x) = (${xm(p)})^2 - ${s}$.`],
      [2, 'Komplet', T`Miejsca zerowe: $${zs[0]}$ i $${zs[1]}$.`]
    ],
    steps: [T`$g(x) = (${xm(p)})^2 - ${k * k} ${q > 0 ? '+' : '-'} ${Math.abs(q)} = (${xm(p)})^2 - ${s}$.`, T`$(${xm(p)})^2 = ${s}$, więc $${xm(p)} = ${t}$ lub $${xm(p)} = -${t}$, czyli $x = ${zs[1]}$ lub $x = ${zs[0]}$.`],
    trap: T`W $f(${xm(p)})$ zamiast $x$ wstawiamy $${xm(p)}$ – wykres przesuwa się w ${p > 0 ? 'PRAWO' : 'LEWO'} o $${Math.abs(p)}$.`,
    tip: 'Wykres y = f(x − p) + q to wykres y = f(x) przesunięty o p w poziomie i o q w pionie.',
    answer: T`$x = ${zs[0]}$ lub $x = ${zs[1]}$`
  });
};

// ---------- 4.5 Funkcja f(x) = a/x (V.13) i wykładnicza w zastosowaniu (V.14) ----------
const hyperbolaA = (r) => {
  const p = r.intNot(-6, 6, 0, 1, -1);
  const q = r.intNot(-6, 6, 0);
  const a = p * q;
  const x2 = r.pick([2, 3, 4, -2, -3].filter((t) => t !== p && a % t === 0));
  need(x2 !== undefined);
  return open({
    title: 'Funkcja odwrotnie proporcjonalna',
    q: T`Wykres funkcji $f(x) = \frac{a}{x}$, określonej dla $x \neq 0$, przechodzi przez punkt $P = (${p}, ${q})$. Wyznacz współczynnik $a$ i oblicz $f(${x2})$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie $a = ${p} \cdot ${par(q)} = ${a}$.`],
      [2, 'Komplet', T`Obliczenie $f(${x2}) = ${fr(a, x2)}$.`]
    ],
    steps: [T`Punkt $P$ leży na wykresie, więc $${q} = \frac{a}{${p}}$, czyli $a = ${a}$.`, T`$f(${x2}) = \frac{${a}}{${x2}} = ${fr(a, x2)}$.`],
    trap: 'Dla funkcji f(x) = a/x iloczyn współrzędnych każdego punktu wykresu jest stały i równy a.',
    tip: 'Wielkości odwrotnie proporcjonalne: x · y = a (stała).',
    answer: T`$a = ${a}$, $f(${x2}) = ${fr(a, x2)}$`
  });
};
const expGrowth = (r) => {
  const N0 = r.pick([100, 200, 300, 500]);
  const k = r.pick([2, 3, 4]);
  const t = k * r.int(2, 4);
  const N = N0 * 2 ** (t / k);
  return open({
    title: 'Funkcja wykładnicza w zastosowaniu',
    q: T`Liczba bakterii w hodowli po $t$ godzinach jest równa $N(t) = ${N0} \cdot 2^{\frac{t}{${k}}}$. Oblicz, po ilu godzinach liczba bakterii będzie równa $${N}$. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie równania $2^{\frac{t}{${k}}} = ${N / N0}$, czyli $2^{\frac{t}{${k}}} = 2^{${t / k}}$.`],
      [2, 'Komplet', T`Wyznaczenie $t = ${t}$ godzin.`]
    ],
    steps: [T`$${N0} \cdot 2^{\frac{t}{${k}}} = ${N}$, więc $2^{\frac{t}{${k}}} = ${N / N0} = 2^{${t / k}}$.`, T`$\frac{t}{${k}} = ${t / k}$, czyli $t = ${t}$.`],
    trap: T`Liczba bakterii podwaja się co $${k}$ godziny – nie co godzinę. Wykładnik to $\frac{t}{${k}}$.`,
    tip: 'Równanie wykładnicze: zapisz obie strony jako potęgi tej samej podstawy i porównaj wykładniki.',
    answer: T`po $${t}$ godzinach`
  });
};

// ---------- 5.1 Funkcja liniowa z parametrem ----------
const linParamZero = (r) => {
  const p = r.int(1, 4);
  const x0 = r.intNot(-4, 4, 0);
  const q = r.intNot(-8, 8, 0);
  // f(x) = (k - p)x + q, f(x0) = 0 -> k = p - q/x0
  need(q % x0 === 0);
  const k = p - q / x0;
  need(k !== p);
  const slope0 = k - p;
  return open({
    title: 'Parametr we wzorze funkcji liniowej',
    q: T`Funkcja liniowa $f$ jest określona wzorem $f(x) = (k - ${p})x ${q > 0 ? '+' : '-'} ${Math.abs(q)}$. Miejscem zerowym funkcji $f$ jest liczba $${x0}$. Oblicz $k$ i rozstrzygnij, czy funkcja $f$ jest rosnąca. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie równania $(k - ${p}) \cdot ${par(x0)} ${q > 0 ? '+' : '-'} ${Math.abs(q)} = 0$ i obliczenie $k = ${k}$.`],
      [2, 'Komplet', T`Współczynnik kierunkowy $${slope0}$ – funkcja jest ${slope0 > 0 ? 'rosnąca' : 'malejąca'}.`]
    ],
    steps: [T`$f(${x0}) = 0$: $(k - ${p}) \cdot ${par(x0)} ${q > 0 ? '+' : '-'} ${Math.abs(q)} = 0$, więc $k - ${p} = ${slope0}$ i $k = ${k}$.`, T`Współczynnik kierunkowy $a = ${slope0} ${slope0 > 0 ? '> 0' : '< 0'}$, więc funkcja jest ${slope0 > 0 ? 'rosnąca' : 'malejąca'}.`],
    trap: T`O monotoniczności decyduje współczynnik przy $x$, czyli $k - ${p}$, a nie samo $k$.`,
    tip: 'Funkcja liniowa f(x) = ax + b jest rosnąca dla a > 0 i malejąca dla a < 0.',
    answer: T`$k = ${k}$, funkcja jest ${slope0 > 0 ? 'rosnąca' : 'malejąca'}`
  });
};

// ---------- 5.2 Wzór funkcji liniowej z dwóch punktów ----------
const linThroughTwo = (r) => {
  const a = r.intNot(-3, 3, 0);
  const b = r.intNot(-6, 6, 0);
  const x1 = r.int(-4, 0);
  const x2 = r.int(1, 5);
  const [y1, y2] = [a * x1 + b, a * x2 + b];
  const z = fr(-b, a);
  return open({
    title: 'Wzór funkcji liniowej z dwóch punktów',
    q: T`Wykres funkcji liniowej $f$ przechodzi przez punkty $A = (${x1}, ${y1})$ i $B = (${x2}, ${y2})$. Wyznacz wzór funkcji $f$ oraz jej miejsce zerowe. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie współczynnika kierunkowego $a = \frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = ${a}$ (lub ułożenie układu równań).`],
      [2, 'Komplet', T`Wzór $f(x) = ${lin(a, b)}$ i miejsce zerowe $${z}$.`]
    ],
    steps: [T`$a = \frac{${y2 - y1}}{${x2 - x1}} = ${a}$.`, T`$${y2} = ${a} \cdot ${par(x2)} + b$, więc $b = ${b}$. Wzór: $f(x) = ${lin(a, b)}$.`, T`$${lin(a, b)} = 0$, stąd $x = ${z}$.`],
    trap: 'Współczynnik kierunkowy to iloraz różnic: (y₂ − y₁)/(x₂ − x₁) – obie różnice w tej samej kolejności.',
    tip: 'Karta wzorów, str. 22: prosta przez dwa punkty – współczynnik a = (y_B − y_A)/(x_B − x_A).',
    answer: T`$f(x) = ${lin(a, b)}$, miejsce zerowe $${z}$`
  });
};

// ---------- 5.3 Układ równań ----------
const linSystem = (r) => {
  const [x0, y0] = [r.intNot(-5, 5, 0), r.intNot(-5, 5, 0)];
  const [a1, b1, a2, b2] = [r.intNot(-4, 4, 0), r.intNot(-4, 4, 0), r.intNot(-4, 4, 0), r.intNot(-4, 4, 0)];
  need(a1 * b2 - a2 * b1 !== 0);
  const [c1, c2] = [a1 * x0 + b1 * y0, a2 * x0 + b2 * y0];
  const eq = (a, b, c) => `${poly([[a, 'x'], [b, 'y']])} = ${c}`;
  return open({
    title: 'Układ równań liniowych',
    q: T`Rozwiąż układ równań $\begin{cases} ${eq(a1, b1, c1)} \\ ${eq(a2, b2, c2)} \end{cases}$ Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', 'Doprowadzenie do równania z jedną niewiadomą (metodą podstawiania albo przeciwnych współczynników).'],
      [2, 'Komplet', T`Rozwiązanie: $x = ${x0}$, $y = ${y0}$.`]
    ],
    steps: [
      T`Mnożymy pierwsze równanie przez $${par(a2)}$, a drugie przez $${par(a1)}$ i odejmujemy: $${poly([[a2 * b1 - a1 * b2, 'y']])} = ${a2 * c1 - a1 * c2}$.`,
      T`$y = ${y0}$; podstawiamy do pierwszego równania: $${poly([[a1, 'x'], [b1 * y0, '']])} = ${c1}$, więc $x = ${x0}$.`
    ],
    trap: 'Sprawdź parę (x, y) w OBU równaniach – błąd znaku przy odejmowaniu równań to najczęstsza pułapka.',
    tip: 'Metoda przeciwnych współczynników: pomnóż równania tak, aby po dodaniu (odjęciu) zniknęła jedna niewiadoma.',
    answer: T`$x = ${x0}$, $y = ${y0}$`
  });
};

// ---------- 5.4 Pole trójkąta wyznaczonego przez dwie proste i oś Ox ----------
const triangleLines = (r) => {
  const x0 = r.int(-2, 4);
  const y0 = r.int(2, 6);
  const a1 = r.pick([1, 2, 3]);
  const a2 = -r.pick([1, 2, 3]);
  need(y0 % a1 === 0 && y0 % a2 === 0);
  const [b1, b2] = [y0 - a1 * x0, y0 - a2 * x0];
  const [z1, z2] = [-b1 / a1, -b2 / a2];
  const base = z2 - z1;
  const P = (base * y0) / 2;
  check(Number.isInteger(z1) && Number.isInteger(z2) && base > 0 && a1 * z1 + b1 === 0 && a2 * z2 + b2 === 0, '5.4');
  return open({
    title: 'Pole trójkąta ograniczonego prostymi',
    q: T`Proste o równaniach $y = ${lin(a1, b1)}$ oraz $y = ${lin(a2, b2)}$ i oś $Ox$ ograniczają trójkąt. Oblicz pole tego trójkąta. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Wyznaczenie punktu przecięcia prostych: $(${x0}, ${y0})$.`],
      [2, 'Etap 2', T`Wyznaczenie punktów przecięcia prostych z osią $Ox$: $x = ${z1}$ oraz $x = ${z2}$.`],
      [3, 'Komplet', T`Obliczenie pola: $${dec(P)}$.`]
    ],
    steps: [
      T`$${lin(a1, b1)} = ${lin(a2, b2)}$, więc $x = ${x0}$ i $y = ${y0}$ – wierzchołek $(${x0}, ${y0})$; wysokość trójkąta to $${y0}$.`,
      T`Przecięcia z osią $Ox$: $${lin(a1, b1)} = 0$ dla $x = ${z1}$ oraz $${lin(a2, b2)} = 0$ dla $x = ${z2}$.`,
      T`Podstawa: $${z2} - ${par(z1)} = ${base}$, pole: $\frac{1}{2} \cdot ${base} \cdot ${y0} = ${dec(P)}$.`
    ],
    trap: 'Wysokość trójkąta opartego na osi Ox to odległość wierzchołka od osi, czyli jego współrzędna y.',
    tip: 'Pole trójkąta: P = ½ · podstawa · wysokość.',
    answer: m(dec(P))
  });
};

// ---------- 5.5 Zadanie tekstowe prowadzące do układu ----------
const ticketsSystem = (r) => {
  const n = r.pick([24, 28, 30, 32, 36, 40]);
  const u = r.pick([12, 14, 15, 16, 18]);
  const [x, y] = [r.int(3, 8), r.int(2, 7)];
  need(n !== u);
  const [s1, x2, y2] = [x * n + y * u, r.int(2, 5), r.int(2, 9)];
  need(x * y2 !== x2 * y);
  const s2 = x2 * n + y2 * u;
  return open({
    title: 'Zadanie tekstowe – układ równań',
    q: T`Za $${x}$ ${bil(x, 'normalne', 'normalnych')} i $${y}$ ${bil(y, 'ulgowe', 'ulgowych')} do kina zapłacono $${s1}$ zł. Za $${x2}$ ${bil(x2, 'normalne', 'normalnych')} i $${y2}$ ${bil(y2, 'ulgowe', 'ulgowych')} zapłacono $${s2}$ zł. Oblicz cenę biletu normalnego i cenę biletu ulgowego. Zapisz obliczenia.`,
    stages: [
      [1, 'Etap 1', T`Zapisanie układu równań: $${x}n + ${y}u = ${s1}$, $${x2}n + ${y2}u = ${s2}$.`],
      [2, 'Komplet', T`Rozwiązanie: bilet normalny $${n}$ zł, ulgowy $${u}$ zł.`]
    ],
    steps: [T`Oznaczmy: $n$ – cena biletu normalnego, $u$ – ulgowego. $\begin{cases} ${x}n + ${y}u = ${s1} \\ ${x2}n + ${y2}u = ${s2} \end{cases}$`, T`Rozwiązujemy układ (np. metodą przeciwnych współczynników): $n = ${n}$, $u = ${u}$.`, T`Sprawdzenie: $${x} \cdot ${n} + ${y} \cdot ${u} = ${s1}$.`],
    trap: 'Najpierw nazwij niewiadome i zapisz, co oznaczają – to pierwszy etap oceniany przez CKE.',
    tip: 'Zadanie tekstowe: oznacz niewiadome, ułóż dwa równania z dwóch informacji, rozwiąż, sprawdź z treścią.',
    answer: T`normalny $${n}$ zł, ulgowy $${u}$ zł`
  });
};

export const OPEN_A = {
  '1.1': [powExpression],
  '1.2': [rootSum],
  '1.3': [logExpression],
  '1.4': [absIneq],
  '1.5': [deposit],
  '2.1': [proofShortMult],
  '2.2': [polyProduct],
  '2.3': [factorGrouping],
  '2.4': [ratDivide],
  '2.5': [proofDivisibility],
  '3.1': [linIneqFractions],
  '3.2': [quadEquation],
  '3.3': [quadIneq],
  '3.4': [polyEquation],
  '3.5': [ratEquation],
  '4.1': [fnArgument],
  '4.2': [linRange],
  '4.3': [linSign],
  '4.4': [shiftZeros],
  '4.5': [hyperbolaA, expGrowth],
  '5.1': [linParamZero],
  '5.2': [linThroughTwo],
  '5.3': [linSystem],
  '5.4': [triangleLines],
  '5.5': [ticketsSystem]
};

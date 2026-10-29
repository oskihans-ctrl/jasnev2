import { T, mc, num, pf, pill, fr, m, need, gcd, dec } from './lib.js';

const TIP_MEAN = 'Karta wzorów, str. 29: średnia arytmetyczna $\\bar{x} = \\frac{x_1 + x_2 + \\ldots + x_n}{n}$.';
const TIP_W = 'Karta wzorów, str. 29: średnia ważona $\\frac{w_1 x_1 + w_2 x_2 + \\ldots + w_n x_n}{w_1 + w_2 + \\ldots + w_n}$.';
const TIP_MED = 'Karta wzorów, str. 30: mediana uporządkowanego zestawu to wyraz środkowy (dla nieparzystej liczby danych) albo średnia dwóch środkowych (dla parzystej).';
const sum = (a) => a.reduce((s, x) => s + x, 0);
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const modeOf = (a) => {
  const c = {};
  a.forEach((x) => (c[x] = (c[x] || 0) + 1));
  const mx = Math.max(...Object.values(c));
  const ms = Object.keys(c).filter((k) => c[k] === mx).map(Number);
  return ms.length === 1 ? ms[0] : null;
};
const d1 = (x) => dec(x, 2);
const numOpts = (ok, arr) => [...new Set(arr.filter((x) => Number.isFinite(x) && Math.abs(x - ok) > 1e-9).map((x) => d1(x)))].map((x) => m(x));
const rndList = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
/** opis tabeli liczebności jako zdanie */
const freqText = (vals, cnts, unit) => vals.map((v, i) => `${unit} $${v}$ – $${cnts[i]}$`).join(', ');

// ---------- 14.1 Średnia arytmetyczna ----------
const meanSimple = (r) => {
  const n = r.int(4, 7);
  const a = rndList(r, n, 1, 12);
  need((sum(a) * 4) % n === 0 || (sum(a) * 5) % n === 0 || sum(a) % n === 0);
  const v = sum(a) / n;
  need(Number.isInteger(v * 100));
  return mc({
    title: 'Średnia arytmetyczna zestawu liczb',
    q: T`Średnia arytmetyczna zestawu liczb: $${a.join(', ')}$ jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [median(a), sum(a) / (n - 1), sum(a) / (n + 1), v + 1, v - 1, v + 0.5, sum(a)]),
    steps: [T`Suma liczb: $${a.join(' + ')} = ${sum(a)}$.`, T`Liczb jest $${n}$, więc $\bar{x} = \frac{${sum(a)}}{${n}} = ${d1(v)}$.`],
    trap: T`Sumę dzielimy przez LICZBĘ danych ($${n}$), a nie przez największą z nich ani przez $2$.`,
    tip: TIP_MEAN
  });
};
const meanMissing = (r) => {
  const n = r.int(3, 6);
  const a = rndList(r, n, 1, 12);
  const avg = r.int(3, 10);
  const x = avg * (n + 1) - sum(a);
  need(x >= 0 && x <= 30);
  return mc({
    title: 'Brakująca liczba ze średniej',
    q: T`Średnia arytmetyczna zestawu liczb: $${a.join(', ')}, x$ jest równa $${avg}$. Liczba $x$ jest równa`,
    ok: m(x),
    val: x,
    bad: numOpts(x, [avg * n - sum(a), avg, avg * (n + 1) - sum(a) + avg, x + 1, x - 1, Math.abs(avg - sum(a) / n), x + 2]),
    steps: [T`W zestawie jest $${n + 1}$ liczb, więc ich suma to $${avg} \cdot ${n + 1} = ${avg * (n + 1)}$.`, T`Suma znanych liczb: $${sum(a)}$.`, T`$x = ${avg * (n + 1)} - ${sum(a)} = ${x}$.`],
    trap: T`Niewiadoma $x$ też jest jedną z danych – średnią mnożymy przez $${n + 1}$, a nie przez $${n}$.`,
    tip: 'Suma wszystkich danych = średnia · liczba danych. To najkrótsza droga do brakującej liczby.'
  });
};
const meanAfterAdding = (r) => {
  const n = r.int(3, 9);
  const avg = r.int(4, 20);
  const k = r.pick([1, 2, -1, -2, 3]);
  const x = avg + k * (n + 1);
  need(x > 0);
  const kind = r.bool();
  return mc({
    title: 'Średnia po dopisaniu liczby',
    q: kind ? T`Średnia arytmetyczna $${n}$ liczb jest równa $${avg}$. Do tego zestawu dopisano liczbę $${x}$. Średnia arytmetyczna nowego zestawu jest równa` : T`Średnia arytmetyczna $${n}$ liczb jest równa $${avg}$. Po dopisaniu do tego zestawu jeszcze jednej liczby średnia arytmetyczna jest równa $${avg + k}$. Dopisana liczba to`,
    ok: m(kind ? avg + k : x),
    val: kind ? avg + k : x,
    bad: kind ? numOpts(avg + k, [(avg + x) / 2, avg, avg + k + 1, avg + k - 1, (avg * n + x) / n, x]) : numOpts(x, [avg + k, (avg + k) * (n + 1), x - k, x + k, 2 * (avg + k) - avg, avg * n]),
    steps: [T`Suma pierwotnych liczb: $${n} \cdot ${avg} = ${n * avg}$.`, kind ? T`Nowa suma: $${n * avg} + ${x} = ${n * avg + x}$, a liczb jest teraz $${n + 1}$.` : T`Nowa suma: $${n + 1} \cdot ${avg + k} = ${(n + 1) * (avg + k)}$.`, kind ? T`Nowa średnia: $\frac{${n * avg + x}}{${n + 1}} = ${avg + k}$.` : T`Dopisana liczba: $${(n + 1) * (avg + k)} - ${n * avg} = ${x}$.`],
    trap: T`Nowa średnia to NIE jest średnia ze starej średniej i dopisanej liczby. Stara średnia „reprezentuje” aż $${n}$ liczb.`,
    tip: 'Suma wszystkich danych = średnia · liczba danych. To najkrótsza droga do brakującej liczby.'
  });
};
const meanTwoGroups = (r) => {
  const n1 = r.int(2, 6) * 5;
  const n2 = r.intNot(10, 30, n1);
  const s1 = r.int(3, 9) * 10;
  const s2 = r.intNot(30, 90, s1);
  const tot = n1 * s1 + n2 * s2;
  need((tot * 10) % (n1 + n2) === 0);
  const v = tot / (n1 + n2);
  return mc({
    title: 'Średnia dwóch grup',
    q: T`W grupie A jest $${n1}$ osób i średni wynik testu w tej grupie jest równy $${s1}$ punktów. W grupie B jest $${n2}$ osób i średni wynik jest równy $${s2}$ punktów. Średni wynik wszystkich osób z obu grup jest równy`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [(s1 + s2) / 2, v + 1, v - 1, (n1 * s2 + n2 * s1) / (n1 + n2), tot / (n1 * 2), Math.max(s1, s2), Math.min(s1, s2)]),
    steps: [T`Suma punktów w grupie A: $${n1} \cdot ${s1} = ${n1 * s1}$, w grupie B: $${n2} \cdot ${s2} = ${n2 * s2}$.`, T`Łącznie: $${tot}$ punktów na $${n1 + n2}$ osób.`, T`Średnia: $\frac{${tot}}{${n1 + n2}} = ${d1(v)}$.`],
    trap: T`Grupy mają różną liczebność, więc nie wolno wziąć zwykłej średniej z $${s1}$ i $${s2}$. Większa grupa „waży” więcej.`,
    tip: 'Średnia łączna = (suma wszystkich wyników) : (liczba wszystkich osób). To szczególny przypadek średniej ważonej.'
  });
};
const meanShift = (r) => {
  const avg = r.int(4, 30);
  const k = r.int(2, 9);
  const n = r.int(5, 12);
  const kind = r.int(0, 1);
  const v = kind === 0 ? avg + k : avg * k;
  return mc({
    title: 'Zmiana średniej przy zmianie wszystkich danych',
    q: kind === 0 ? T`Średnia arytmetyczna $${n}$ liczb jest równa $${avg}$. Każdą z tych liczb zwiększono o $${k}$. Średnia arytmetyczna nowego zestawu jest równa` : T`Średnia arytmetyczna $${n}$ liczb jest równa $${avg}$. Każdą z tych liczb pomnożono przez $${k}$. Średnia arytmetyczna nowego zestawu jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [avg, kind === 0 ? avg + k * n : avg * k * n, kind === 0 ? avg * k : avg + k, kind === 0 ? avg + k / n : avg * k / n, v + 1, v - 1]),
    steps: [T`Stara suma: $${n} \cdot ${avg} = ${n * avg}$.`, kind === 0 ? T`Nowa suma: $${n * avg} + ${n} \cdot ${k} = ${n * avg + n * k}$.` : T`Nowa suma: $${k} \cdot ${n * avg} = ${k * n * avg}$.`, T`Nowa średnia: $\frac{${kind === 0 ? n * avg + n * k : k * n * avg}}{${n}} = ${v}$.`],
    trap: kind === 0 ? T`Każda liczba rośnie o $${k}$, więc średnia też rośnie o $${k}$ – nie o $${k} \cdot ${n}$.` : T`Pomnożenie wszystkich danych przez $${k}$ mnoży średnią przez $${k}$ – liczba danych nie ma tu znaczenia.`,
    tip: 'Dodanie tej samej liczby do wszystkich danych przesuwa średnią o tę liczbę; pomnożenie – mnoży średnią.'
  });
};

// ---------- 14.2 Średnia ważona ----------
const wGrades = (r) => {
  const k = r.int(3, 4);
  const g = rndList(r, k, 2, 6);
  const w = Array.from({ length: k }, () => r.int(1, 5));
  need(new Set(w).size > 1);
  const top = sum(g.map((x, i) => x * w[i]));
  need((top * 100) % sum(w) === 0);
  const v = top / sum(w);
  const names = ['sprawdzian', 'kartkówkę', 'odpowiedź ustną', 'pracę domową'];
  return mc({
    title: 'Średnia ważona ocen',
    q: T`Uczeń otrzymał oceny: ${g.map((x, i) => `$${x}$ za ${names[i]} (waga $${w[i]}$)`).join(', ')}. Średnia ważona tych ocen jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [sum(g) / k, top / k, v + 0.5, v - 0.5, sum(g) / sum(w), v + 0.25, v - 0.25, v + 1]),
    steps: [T`Licznik: $${g.map((x, i) => `${x} \\cdot ${w[i]}`).join(' + ')} = ${top}$.`, T`Mianownik (suma wag): $${w.join(' + ')} = ${sum(w)}$.`, T`Średnia ważona: $\frac{${top}}{${sum(w)}} = ${d1(v)}$.`],
    trap: T`Dzielimy przez SUMĘ WAG ($${sum(w)}$), a nie przez liczbę ocen ($${k}$).`,
    tip: TIP_W
  });
};
const wMissingGrade = (r) => {
  const g = rndList(r, 2, 2, 5);
  const w = [r.int(1, 3), r.int(1, 3)];
  const w3 = r.int(2, 5);
  const x = r.int(2, 6);
  const top = g[0] * w[0] + g[1] * w[1] + x * w3;
  const sw = w[0] + w[1] + w3;
  need((top * 10) % sw === 0);
  const v = top / sw;
  return mc({
    title: 'Brakująca ocena w średniej ważonej',
    q: T`Uczeń ma ocenę $${g[0]}$ z wagą $${w[0]}$ oraz ocenę $${g[1]}$ z wagą $${w[1]}$. Z ostatniego sprawdzianu, którego waga jest równa $${w3}$, otrzymał ocenę $x$. Średnia ważona wszystkich trzech ocen jest równa $${d1(v)}$. Ocena $x$ jest równa`,
    ok: m(x),
    val: x,
    bad: numOpts(x, [x + 1, x - 1, Math.round(v), x + 2, x - 2, 1].filter((y) => y >= 1 && y <= 6)),
    steps: [T`Suma wag: $${w[0]} + ${w[1]} + ${w3} = ${sw}$, więc licznik musi być równy $${d1(v)} \cdot ${sw} = ${top}$.`, T`Znane składniki: $${g[0]} \cdot ${w[0]} + ${g[1]} \cdot ${w[1]} = ${g[0] * w[0] + g[1] * w[1]}$.`, T`$${w3}x = ${top} - ${g[0] * w[0] + g[1] * w[1]} = ${x * w3}$, więc $x = ${x}$.`],
    trap: T`Różnicę $${x * w3}$ trzeba jeszcze podzielić przez wagę sprawdzianu ($${w3}$) – sama różnica to „ocena razy waga”.`,
    tip: TIP_W
  });
};
const wMixture = (r) => {
  const a = r.int(1, 6);
  const b = r.intNot(1, 6, a);
  const p1 = r.int(10, 40);
  const p2 = r.intNot(10, 60, p1);
  const top = a * p1 + b * p2;
  need((top * 100) % (a + b) === 0);
  const v = top / (a + b);
  const item = r.pick(['herbaty', 'kawy', 'orzechów', 'cukierków']);
  return mc({
    title: 'Średnia cena mieszanki',
    q: T`Zmieszano $${a}$ kg ${item} w cenie $${p1}$ zł za kilogram z $${b}$ kg ${item} w cenie $${p2}$ zł za kilogram. Cena jednego kilograma otrzymanej mieszanki jest równa`,
    ok: `$${d1(v)}$ zł`,
    val: v,
    bad: [...new Set([(p1 + p2) / 2, (a * p2 + b * p1) / (a + b), top / 2, v + 1, v - 1, v + 2].filter((x) => Math.abs(x - v) > 1e-9).map((x) => `$${d1(x)}$ zł`))],
    steps: [T`Wartość mieszanki: $${a} \cdot ${p1} + ${b} \cdot ${p2} = ${top}$ zł.`, T`Masa mieszanki: $${a} + ${b} = ${a + b}$ kg.`, T`Cena kilograma: $\frac{${top}}{${a + b}} = ${d1(v)}$ zł.`],
    trap: T`Składników jest różna ilość, więc cena mieszanki to nie zwykła średnia cen. Wagami są masy.`,
    tip: TIP_W
  });
};
const wFrequency = (r) => {
  const vals = [1, 2, 3, 4, 5, 6].slice(r.int(0, 1), r.int(4, 6));
  need(vals.length >= 3);
  const cnts = vals.map(() => r.int(1, 8));
  const n = sum(cnts);
  const top = sum(vals.map((v, i) => v * cnts[i]));
  need((top * 100) % n === 0 && top * vals.length !== sum(vals) * n);
  const v = top / n;
  return mc({
    title: 'Średnia z danych pogrupowanych',
    q: T`W pewnej klasie wyniki sprawdzianu były następujące (ocena – liczba uczniów): ${freqText(vals, cnts, 'ocena')}. Średnia arytmetyczna ocen z tego sprawdzianu jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [sum(vals) / vals.length, top / vals.length, n / vals.length, v + 0.5, v - 0.5, v + 0.25, v - 0.2, median(vals)]),
    steps: [T`Suma wszystkich ocen: $${vals.map((x, i) => `${x} \\cdot ${cnts[i]}`).join(' + ')} = ${top}$.`, T`Liczba uczniów: $${cnts.join(' + ')} = ${n}$.`, T`Średnia: $\frac{${top}}{${n}} = ${d1(v)}$.`],
    trap: T`Każdą ocenę liczymy tyle razy, ilu uczniów ją dostało. Średnia samych wartości ocen ($${d1(sum(vals) / vals.length)}$) nie uwzględnia liczebności.`,
    tip: 'Dane pogrupowane: średnia = suma (wartość · liczebność) : suma liczebności.'
  });
};

// ---------- 14.3 Mediana ----------
const medOdd = (r) => {
  const n = r.pick([5, 7, 9]);
  const a = rndList(r, n, 1, 15);
  const v = median(a);
  const mid = a[(n - 1) / 2];
  need(mid !== v);
  return mc({
    title: 'Mediana zestawu o nieparzystej liczbie danych',
    q: T`Mediana zestawu liczb: $${a.join(', ')}$ jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [mid, Math.round((sum(a) / n) * 100) / 100, [...a].sort((x, y) => x - y)[(n - 1) / 2 + 1], [...a].sort((x, y) => x - y)[(n - 1) / 2 - 1], v + 1, v - 1]),
    steps: [T`Porządkujemy dane rosnąco: $${[...a].sort((x, y) => x - y).join(', ')}$.`, T`Danych jest $${n}$ (liczba nieparzysta), więc mediana to wyraz stojący na miejscu $${(n + 1) / 2}$.: $${v}$.`],
    trap: T`Przed wyznaczeniem mediany dane TRZEBA uporządkować. Środkowa liczba nieuporządkowanego zestawu ($${mid}$) nie jest medianą.`,
    tip: TIP_MED
  });
};
const medEven = (r) => {
  const n = r.pick([4, 6, 8]);
  const a = rndList(r, n, 1, 15);
  const s = [...a].sort((x, y) => x - y);
  const v = median(a);
  need(s[n / 2 - 1] !== s[n / 2]);
  return mc({
    title: 'Mediana zestawu o parzystej liczbie danych',
    q: T`Mediana zestawu liczb: $${a.join(', ')}$ jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [s[n / 2 - 1], s[n / 2], (a[n / 2 - 1] + a[n / 2]) / 2, Math.round((sum(a) / n) * 100) / 100, v + 1, v - 0.5]),
    steps: [T`Porządkujemy dane rosnąco: $${s.join(', ')}$.`, T`Danych jest $${n}$ (liczba parzysta), więc mediana to średnia dwóch środkowych wyrazów: $\frac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${d1(v)}$.`],
    trap: T`Przy parzystej liczbie danych nie ma jednego środkowego wyrazu – bierzemy średnią arytmetyczną DWÓCH środkowych.`,
    tip: TIP_MED
  });
};
const medWithX = (r) => {
  const a = r.int(1, 5);
  const b = a + r.int(1, 3);
  const c = b + r.int(1, 4);
  const d = c + r.int(2, 5);
  const e = d + r.int(1, 4);
  const f = e + r.int(1, 4);
  // uporządkowany zestaw: a, b, c, x, e, f  z medianą (c + x)/2
  const x = d;
  const med = (c + x) / 2;
  return mc({
    title: 'Niewiadoma w uporządkowanym zestawie',
    q: T`Mediana uporządkowanego niemalejąco zestawu sześciu liczb: $${a}, ${b}, ${c}, x, ${e}, ${f}$ jest równa $${d1(med)}$. Liczba $x$ jest równa`,
    ok: m(x),
    val: x,
    bad: numOpts(x, [med, 2 * med, x + 1, x - 1, (c + e) / 2, med * 2 - b].filter((y) => Number.isInteger(y * 2))),
    steps: [T`Danych jest sześć, więc mediana to średnia trzeciej i czwartej liczby: $\frac{${c} + x}{2} = ${d1(med)}$.`, T`$${c} + x = ${2 * med}$, więc $x = ${x}$.`],
    trap: T`Mediana to nie $x$, tylko średnia z $${c}$ i $x$. Trzeba rozwiązać równanie.`,
    tip: TIP_MED
  });
};
const medFrequency = (r) => {
  const vals = [1, 2, 3, 4, 5, 6].slice(r.int(0, 1), r.int(4, 6));
  need(vals.length >= 3);
  const cnts = vals.map(() => r.int(1, 7));
  const all = vals.flatMap((v, i) => Array(cnts[i]).fill(v));
  const n = all.length;
  const v = median(all);
  need(n >= 9);
  return mc({
    title: 'Mediana z danych pogrupowanych',
    q: T`W pewnej klasie wyniki sprawdzianu były następujące (ocena – liczba uczniów): ${freqText(vals, cnts, 'ocena')}. Mediana ocen z tego sprawdzianu jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [median(vals), vals[cnts.indexOf(Math.max(...cnts))], v + 1, v - 1, v + 0.5, v - 0.5, Math.round((sum(all) / n) * 100) / 100].filter((y) => y >= vals[0] && y <= vals[vals.length - 1])),
    steps: [T`Uczniów jest $${cnts.join(' + ')} = ${n}$.`, n % 2 ? T`Mediana to ocena na miejscu $${(n + 1) / 2}$. w uporządkowanym ciągu.` : T`Mediana to średnia ocen na miejscach $${n / 2}$. i $${n / 2 + 1}$. w uporządkowanym ciągu.`, T`Zliczając liczebności od najniższej oceny, dochodzimy do ${n % 2 ? `oceny $${v}$` : `ocen $${all[n / 2 - 1]}$ i $${all[n / 2]}$`}, więc mediana to $${d1(v)}$.`],
    trap: T`Mediana zależy od liczebności, nie tylko od samych wartości. Środkowa spośród różnych ocen to zwykle coś innego.`,
    tip: 'Dane pogrupowane: ustal numer środkowej obserwacji i zliczaj liczebności, aż do niego dojdziesz.'
  });
};
const medAfterAdding = (r) => {
  const n = r.pick([4, 6]);
  const a = [...new Set(rndList(r, 12, 1, 20))].slice(0, n).sort((x, y) => x - y);
  need(a.length === n);
  const x = r.int(1, 22);
  need(!a.includes(x));
  const v = median([...a, x]);
  const old = median(a);
  need(v !== old);
  return mc({
    title: 'Mediana po dopisaniu liczby',
    q: T`Do zestawu liczb: $${a.join(', ')}$ dopisano liczbę $${x}$. Mediana nowego zestawu jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [old, x, (old + x) / 2, v + 1, v - 1, a[n / 2], a[n / 2 - 1]]),
    steps: [T`Nowy zestaw po uporządkowaniu: $${[...a, x].sort((p, q) => p - q).join(', ')}$.`, T`Danych jest teraz $${n + 1}$ (liczba nieparzysta), więc mediana to wyraz środkowy: $${v}$.`],
    trap: T`Po dopisaniu liczby zmienia się liczba danych z parzystej na nieparzystą – mediana przestaje być średnią dwóch wyrazów.`,
    tip: TIP_MED
  });
};

// ---------- 14.4 Dominanta i dane pogrupowane ----------
const modeSimple = (r) => {
  const n = r.int(7, 10);
  const a = rndList(r, n, 1, 9);
  const v = modeOf(a);
  need(v !== null);
  const c = {};
  a.forEach((x) => (c[x] = (c[x] || 0) + 1));
  need(c[v] >= 3);
  return mc({
    title: 'Dominanta zestawu liczb',
    q: T`Dominanta zestawu liczb: $${a.join(', ')}$ jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [median(a), Math.max(...a), c[v], Math.round((sum(a) / n) * 100) / 100, Math.min(...a), v + 1].filter((y) => Number.isInteger(y * 4))),
    steps: [T`Zliczamy, ile razy występuje każda liczba.`, T`Najczęściej, bo $${c[v]}$ razy, występuje liczba $${v}$ – to jest dominanta.`],
    trap: T`Dominanta to WARTOŚĆ, która występuje najczęściej ($${v}$), a nie liczba jej wystąpień ($${c[v]}$) i nie największa liczba w zestawie.`,
    tip: 'Dominanta (moda) to wartość występująca w zestawie najczęściej.'
  });
};
const modeFrequency = (r) => {
  const vals = [1, 2, 3, 4, 5, 6].slice(r.int(0, 1), r.int(4, 6));
  need(vals.length >= 3);
  const cnts = vals.map(() => r.int(1, 9));
  const mx = Math.max(...cnts);
  need(cnts.filter((x) => x === mx).length === 1);
  const v = vals[cnts.indexOf(mx)];
  const all = vals.flatMap((x, i) => Array(cnts[i]).fill(x));
  return mc({
    title: 'Dominanta z danych pogrupowanych',
    q: T`W pewnej klasie wyniki sprawdzianu były następujące (ocena – liczba uczniów): ${freqText(vals, cnts, 'ocena')}. Dominanta ocen z tego sprawdzianu jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [mx, median(all), vals[vals.length - 1], vals[0], median(vals), v + 1, v - 1].filter((y) => Number.isInteger(y * 2))),
    steps: [T`Dominanta to ocena o największej liczebności.`, T`Największa liczebność to $${mx}$ i odpowiada ocenie $${v}$.`],
    trap: T`Odpowiedzią jest ocena ($${v}$), a nie liczba uczniów, którzy ją otrzymali ($${mx}$).`,
    tip: 'Dominanta (moda) to wartość występująca w zestawie najczęściej.'
  });
};
// Podstawa 2024 (XII.2): średnia, średnia ważona, mediana i dominanta. Wariancji i odchylenia standardowego
// nie ma już w zakresie podstawowym, więc ta lekcja ćwiczy dominantę także na danych pogrupowanych.
const modeAfterAdding = (r) => {
  const vals = [2, 3, 4, 5, 6];
  const cnts = vals.map(() => r.int(2, 9));
  const mx = Math.max(...cnts);
  need(cnts.filter((x) => x === mx).length === 1);
  const old = vals[cnts.indexOf(mx)];
  const gIdx = r.intNot(0, 4, cnts.indexOf(mx));
  const g = vals[gIdx];
  const k = mx - cnts[gIdx] + r.int(1, 2);
  const after = cnts.map((c, i) => (i === gIdx ? c + k : c));
  const mx2 = Math.max(...after);
  need(after.filter((x) => x === mx2).length === 1);
  const v = vals[after.indexOf(mx2)];
  return mc({
    title: 'Dominanta po dopisaniu danych',
    q: T`Wyniki sprawdzianu w klasie (ocena – liczba uczniów): ${freqText(vals, cnts, 'ocena')}. Dopisano oceny $${k}$ uczniów, którzy pisali sprawdzian w drugim terminie – każdy z nich otrzymał ocenę $${g}$. Dominanta wszystkich ocen jest równa`,
    ok: m(v),
    val: v,
    bad: numOpts(v, [old, mx2, k, g === v ? old : g, vals[(after.indexOf(mx2) + 1) % 5], mx].filter((y) => y !== v)),
    steps: [T`Nowe liczebności: ${freqText(vals, after, 'ocena')}.`, T`Największa liczebność to teraz $${mx2}$ i odpowiada ocenie $${v}$.`],
    trap: T`Po dopisaniu danych liczebności się zmieniają – dominanta nie musi zostać ta sama co wcześniej ($${old}$). Odpowiedzią jest ocena, a nie liczba uczniów.`,
    tip: 'Dominanta (moda) to wartość występująca w zestawie najczęściej.'
  });
};
const statCompare = (r) => {
  const n = r.pick([5, 7]);
  // zestaw z jedną dominantą: trzy razy ta sama liczba, reszta różna (bez odrzuceń w build.js)
  const moV = r.int(1, 9);
  const rest = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== moV)).slice(0, n - 3);
  const a = r.shuffle([moV, moV, moV, ...rest]);
  const mo = modeOf(a);
  const me = median(a);
  const mean = sum(a) / n;
  need(Number.isInteger(mean * 100));
  const pool = [
    [T`Mediana tego zestawu jest równa $${r.bool() ? me : me + 1}$.`, null, 'me'],
    [T`Dominanta tego zestawu jest równa $${r.bool() ? mo : (mo % 9) + 1}$.`, null, 'mo'],
    [T`Średnia arytmetyczna tego zestawu jest większa od jego mediany.`, mean > me, T`średnia to $${d1(mean)}$, a mediana to $${me}$`],
    [T`Dominanta tego zestawu jest mniejsza od jego mediany.`, mo < me, T`dominanta to $${mo}$, a mediana to $${me}$`]
  ];
  pool[0][1] = pool[0][0].includes(`$${me}$`);
  pool[0][2] = T`po uporządkowaniu środkowym wyrazem jest $${me}$`;
  pool[1][1] = pool[1][0].includes(`$${mo}$`);
  pool[1][2] = T`najczęściej występuje liczba $${mo}$`;
  const [s1, s2] = r.shuffle(pool).slice(0, 2);
  return pf({
    title: 'Prawda czy fałsz: parametry zestawu danych',
    q: T`Dany jest zestaw liczb: $${a.join(', ')}$.`,
    s1: [s1[0], s1[1], `${s1[2]}. Zdanie jest ${s1[1] ? 'prawdziwe' : 'fałszywe'}.`],
    s2: [s2[0], s2[1], `${s2[2]}. Zdanie jest ${s2[1] ? 'prawdziwe' : 'fałszywe'}.`],
    trap: 'Średnia, mediana i dominanta to trzy różne parametry – w tym samym zestawie zwykle mają różne wartości.',
    tip: 'Średnia: suma przez liczbę danych. Mediana: środek po uporządkowaniu. Dominanta: wartość najczęstsza.'
  });
};
const modeAndMean = (r) => {
  const n = r.int(6, 8);
  const a = rndList(r, n, 1, 9);
  const mo = modeOf(a);
  need(mo !== null);
  const me = median(a);
  const v = mo + me;
  need(Number.isInteger(me * 2));
  return mc({
    title: 'Suma dominanty i mediany',
    q: T`Dany jest zestaw liczb: $${a.join(', ')}$. Suma dominanty i mediany tego zestawu jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [2 * mo, 2 * me, v + 1, v - 1, mo + Math.round((sum(a) / n) * 2) / 2, v + 0.5, v - 0.5]),
    steps: [T`Po uporządkowaniu: $${[...a].sort((x, y) => x - y).join(', ')}$.`, T`Dominanta: $${mo}$ (występuje najczęściej). Mediana: $${d1(me)}$.`, T`Suma: $${mo} + ${d1(me)} = ${d1(v)}$.`],
    trap: T`Dominantę odczytasz z nieuporządkowanego zestawu, ale mediana wymaga uporządkowania danych.`,
    tip: 'Średnia: suma przez liczbę danych. Mediana: środek po uporządkowaniu. Dominanta: wartość najczęstsza.'
  });
};

// ---------- 14.5 Diagramy i tabele ----------
const tableData = (r) => {
  const ctxs = [
    ['Zestawiono liczbę goli strzelonych przez drużynę w kolejnych meczach sezonu (liczba goli – liczba meczów)', 'liczba goli', 'meczów', [0, 1, 2, 3, 4]],
    ['Zestawiono liczbę rodzeństwa uczniów pewnej klasy (liczba rodzeństwa – liczba uczniów)', 'liczba rodzeństwa', 'uczniów', [0, 1, 2, 3]],
    ['Zestawiono oceny z pracy klasowej w pewnej klasie (ocena – liczba uczniów)', 'ocena', 'uczniów', [1, 2, 3, 4, 5, 6]],
    ['Zestawiono liczbę książek przeczytanych w ciągu miesiąca przez uczestników ankiety (liczba książek – liczba osób)', 'liczba książek', 'osób', [0, 1, 2, 3, 4, 5]]
  ];
  const [intro, unit, who, vals] = r.pick(ctxs);
  const cnts = vals.map(() => r.int(1, 8));
  const n = sum(cnts);
  const all = vals.flatMap((v, i) => Array(cnts[i]).fill(v));
  return { intro, unit, who, vals, cnts, n, all, text: `${intro}: ${freqText(vals, cnts, unit)}.` };
};
const tabMean = (r) => {
  const d = tableData(r);
  const top = sum(d.all);
  need((top * 100) % d.n === 0);
  const v = top / d.n;
  return mc({
    title: 'Średnia z zestawienia danych',
    q: T`${d.text} Średnia arytmetyczna tych danych jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [sum(d.vals) / d.vals.length, d.n / d.vals.length, top / d.vals.length, v + 0.5, v - 0.5, v + 0.25, median(d.all)]),
    steps: [T`Suma: $${d.vals.map((x, i) => `${x} \\cdot ${d.cnts[i]}`).join(' + ')} = ${top}$.`, T`Liczba ${d.who}: $${d.cnts.join(' + ')} = ${d.n}$.`, T`Średnia: $\frac{${top}}{${d.n}} = ${d1(v)}$.`],
    trap: T`Druga liczba w każdej parze to liczebność, a nie wartość. Każdą wartość mnożymy przez jej liczebność.`,
    tip: 'Dane pogrupowane: średnia = suma (wartość · liczebność) : suma liczebności.'
  });
};
const tabPercent = (r) => {
  const d = tableData(r);
  const k = r.int(1, d.vals.length - 1);
  const cnt = sum(d.cnts.slice(k));
  need((cnt * 100) % d.n === 0 && cnt < d.n);
  const v = (cnt * 100) / d.n;
  return mc({
    title: 'Procent z zestawienia danych',
    q: T`${d.text} W przypadku jakiego procentu wszystkich ${d.who} ${d.unit} jest równa co najmniej $${d.vals[k]}$?`,
    ask: true,
    ok: m(`${v}\\%`),
    val: v,
    bad: [100 - v, Math.round((d.cnts[k] * 100) / d.n), v + 10, v - 10, cnt, v + 5].filter((x, i, arr) => x > 0 && x < 100 && x !== v && arr.indexOf(x) === i).map((x) => m(`${x}\\%`)),
    steps: [T`Wszystkich ${d.who} jest $${d.cnts.join(' + ')} = ${d.n}$.`, T`Warunek „co najmniej $${d.vals[k]}$” spełnia $${d.cnts.slice(k).join(' + ')} = ${cnt}$.`, T`$\frac{${cnt}}{${d.n}} \cdot 100\% = ${v}\%$.`],
    trap: T`„Co najmniej $${d.vals[k]}$” obejmuje także wartość $${d.vals[k]}$ – sumujemy liczebności od niej w górę.`,
    tip: 'Procent grupy = liczebność grupy : liczebność całości · 100%.'
  });
};
const tabMedian = (r) => {
  const d = tableData(r);
  need(d.n >= 9);
  const v = median(d.all);
  return mc({
    title: 'Mediana z zestawienia danych',
    q: T`${d.text} Mediana tych danych jest równa`,
    ok: m(d1(v)),
    val: v,
    bad: numOpts(v, [median(d.vals), d.vals[d.cnts.indexOf(Math.max(...d.cnts))], v + 1, v - 1, v + 0.5, v - 0.5, median(d.cnts)].filter((y) => y >= d.vals[0] && y <= d.vals[d.vals.length - 1])),
    steps: [T`Danych jest $${d.n}$, więc mediana to ${d.n % 2 ? `wartość na miejscu $${(d.n + 1) / 2}$.` : `średnia wartości na miejscach $${d.n / 2}$. i $${d.n / 2 + 1}$.`}`, T`Sumujemy liczebności kolejnych wartości, aż dojdziemy do tego miejsca: mediana to $${d1(v)}$.`],
    trap: T`Mediany nie szukamy wśród liczebności ani wśród samych różnych wartości – trzeba „rozwinąć” dane zgodnie z liczebnościami.`,
    tip: 'Dane pogrupowane: ustal numer środkowej obserwacji i zliczaj liczebności, aż do niego dojdziesz.'
  });
};
const tabAboveMean = (r) => {
  const d = tableData(r);
  const mean = sum(d.all) / d.n;
  need(Number.isInteger(mean * 4) && !d.vals.includes(mean));
  const cnt = d.all.filter((x) => x > mean).length;
  return num({
    title: 'Dane powyżej średniej',
    q: T`${d.text} Dla ilu ${d.who} ${d.unit} jest większa od średniej arytmetycznej wszystkich danych? Wpisz liczbę.`,
    ans: cnt,
    steps: [T`Średnia: $\frac{${sum(d.all)}}{${d.n}} = ${d1(mean)}$.`, T`Wartości większe od $${d1(mean)}$ to: $${d.vals.filter((x) => x > mean).join(', ')}$.`, T`Sumujemy ich liczebności: $${d.cnts.filter((_, i) => d.vals[i] > mean).join(' + ')} = ${cnt}$.`],
    trap: T`Najpierw trzeba policzyć średnią, uwzględniając liczebności – dopiero potem porównywać z nią poszczególne wartości.`,
    tip: 'Dane pogrupowane: średnia = suma (wartość · liczebność) : suma liczebności.'
  });
};
const tabMode = (r) => {
  const d = tableData(r);
  const mx = Math.max(...d.cnts);
  need(d.cnts.filter((x) => x === mx).length === 1);
  const mo = d.vals[d.cnts.indexOf(mx)];
  const me = median(d.all);
  const claimMo = r.bool() ? mo : mx;
  const claimN = r.bool() ? d.n : d.vals.length;
  need(d.n !== d.vals.length);
  return pf({
    title: 'Prawda czy fałsz: odczyt z zestawienia danych',
    q: d.text,
    s1: [T`Dominanta tych danych jest równa $${claimMo}$.`, claimMo === mo, T`największa liczebność ($${mx}$) odpowiada wartości $${mo}$. Zdanie jest ${claimMo === mo ? 'prawdziwe' : 'fałszywe'}.`],
    s2: [T`Liczba wszystkich ${d.who} jest równa $${claimN}$.`, claimN === d.n, T`suma liczebności to $${d.cnts.join(' + ')} = ${d.n}$. Zdanie jest ${claimN === d.n ? 'prawdziwe' : 'fałszywe'}.`],
    trap: 'W zestawieniu pierwsza liczba to wartość, a druga – liczebność (na diagramie słupkowym: wysokość słupka). Nie zamieniaj ich.',
    tip: 'Dominanta to wartość o największej liczebności. Liczba wszystkich danych to suma liczebności.'
  });
};

export default {
  numericId: 14,
  title: 'Statystyka',
  short_title: 'Statystyka',
  description: 'Średnia arytmetyczna i ważona, mediana, dominanta oraz odczytywanie danych z tabel i diagramów.',
  icon: 'BarChart3',
  color: '#2DD4BF',
  matura_points_range: '2–3 pkt',
  importance: 'HIGH',
  cke_formula_page: 'str. 29–30',
  lessons: [
    {
      title: 'Średnia arytmetyczna',
      short_title: 'Średnia arytmetyczna',
      pill: pill({
        essence: T`Średnia arytmetyczna to suma wszystkich danych podzielona przez ich liczbę. Najważniejsza sztuczka: wzór działa też „od tyłu” – suma danych to średnia razy liczba danych. Dzięki temu znajdziesz brakującą liczbę, policzysz średnią po dopisaniu nowej danej albo połączysz dwie grupy o różnych średnich.`,
        context: 'Zadanie 31–32 w arkuszu • 1 pkt. Statystyka pojawia się w każdym arkuszu.',
        pl: T`Średnia to „po równo”. Pięć osób zebrało razem $40$ zł – średnio po $8$ zł. I odwrotnie: jeśli średnio wyszło po $8$ zł na pięć osób, to razem było $40$ zł. Tę drugą wersję wykorzystujesz w większości zadań.`,
        steps: [
          ['Policz sumę', T`Dane: $3, 5, 8, 4$. Suma: $20$.`, 'Albo: średnia · liczba danych.'],
          ['Policz liczbę danych', T`$n = 4$.`, 'Niewiadoma x też jest daną.'],
          ['Podziel', T`$\bar{x} = \frac{20}{4} = 5$.`, 'Suma przez liczbę danych.']
        ],
        formulas: [
          ['Średnia arytmetyczna', T`\bar{x} = \frac{x_1 + x_2 + \ldots + x_n}{n}`, 29],
          ['Suma ze średniej', T`x_1 + x_2 + \ldots + x_n = n \cdot \bar{x}`]
        ],
        examples: [
          ['Brakująca liczba', '1 pkt', T`Średnia liczb $4, 6, 8, 9, x$ jest równa $7$. Oblicz $x$.`, T`1. Suma pięciu liczb: $5 \cdot 7 = 35$.` + '\n' + T`2. $4 + 6 + 8 + 9 = 27$.` + '\n' + T`3. $x = 35 - 27 = 8$.`, 'Liczb jest pięć, razem z x.'],
          ['Dwie grupy', '1 pkt', T`$10$ osób ma średnią $60$ pkt, a $30$ osób – $80$ pkt. Oblicz średnią wszystkich.`, T`1. $10 \cdot 60 + 30 \cdot 80 = 3000$.` + '\n' + T`2. $\frac{3000}{40} = 75$.`, 'Nie 70 – grupy są różnej wielkości.']
        ],
        trap: T`Średnia dwóch grup to NIE jest średnia z ich średnich – chyba że grupy są równoliczne.`,
        fail: T`„Średnie $60$ i $80$, więc średnia łączna to $70$.”`,
        win: T`$\frac{10 \cdot 60 + 30 \cdot 80}{40} = 75$.`,
        why: 'Większa grupa wnosi więcej wyników, więc mocniej „ciągnie” średnią w swoją stronę.',
        ckeTip: 'W zadaniu z niewiadomą zawsze zacznij od policzenia sumy: średnia razy liczba danych.',
        points: [T`Średnia = suma : liczba danych.`, T`Suma = średnia · liczba danych.`, T`Niewiadoma też liczy się jako dana.`]
      }),
      gens: [meanSimple, meanMissing, meanAfterAdding, meanTwoGroups, meanShift]
    },
    {
      title: 'Średnia ważona',
      short_title: 'Średnia ważona',
      pill: pill({
        essence: T`W średniej ważonej dane nie są równie ważne – każda ma swoją wagę. Mnożysz każdą wartość przez jej wagę, sumujesz iloczyny i dzielisz przez sumę wag. Tak liczy się średnią ocen w dzienniku elektronicznym, cenę mieszanki dwóch towarów i średnią z danych pogrupowanych, gdzie wagą jest liczebność.`,
        context: 'Zadanie 31–32 w arkuszu • 1 pkt, często z tabelą lub diagramem.',
        pl: T`Sprawdzian ma wagę $3$, kartkówka wagę $1$. To tak, jakbyś ocenę ze sprawdzianu wpisał do dziennika trzy razy. Piątka ze sprawdzianu i dwójka z kartkówki to $5, 5, 5, 2$ – średnia $4{,}25$, a nie $3{,}5$.`,
        steps: [
          ['Pomnóż wartości przez wagi', T`$5$ (waga $3$) i $2$ (waga $1$): $5 \cdot 3 + 2 \cdot 1 = 17$.`, 'To będzie licznik.'],
          ['Zsumuj wagi', T`$3 + 1 = 4$.`, 'To będzie mianownik.'],
          ['Podziel', T`$\frac{17}{4} = 4{,}25$.`, 'Przez sumę wag, nie przez liczbę ocen.']
        ],
        formulas: [
          ['Średnia ważona', T`\frac{w_1 x_1 + w_2 x_2 + \ldots + w_n x_n}{w_1 + w_2 + \ldots + w_n}`, 29]
        ],
        examples: [
          ['Oceny z wagami', '1 pkt', T`Oceny: $4$ (waga $3$), $5$ (waga $2$), $2$ (waga $1$). Oblicz średnią ważoną.`, T`1. $4 \cdot 3 + 5 \cdot 2 + 2 \cdot 1 = 24$.` + '\n' + T`2. $3 + 2 + 1 = 6$.` + '\n' + T`3. $\frac{24}{6} = 4$.`, 'Dzielimy przez 6, nie przez 3.'],
          ['Mieszanka', '1 pkt', T`Zmieszano $2$ kg herbaty po $30$ zł i $3$ kg po $50$ zł. Ile kosztuje kilogram mieszanki?`, T`1. $2 \cdot 30 + 3 \cdot 50 = 210$ zł.` + '\n' + T`2. $\frac{210}{5} = 42$ zł.`, 'Wagami są kilogramy.']
        ],
        trap: T`W mianowniku średniej ważonej stoi SUMA WAG, a nie liczba danych.`,
        fail: T`„$\frac{4 \cdot 3 + 5 \cdot 2 + 2 \cdot 1}{3} = 8$” – średnia ocen większa od szóstki!`,
        win: T`$\frac{24}{3 + 2 + 1} = 4$.`,
        why: 'Waga 3 oznacza, że ocena liczy się jak trzy oceny – w sumie mamy więc sześć „ocen”, nie trzy.',
        ckeTip: 'Wynik średniej ważonej musi leżeć między najmniejszą a największą wartością. Jeśli nie leży – błąd jest w mianowniku.',
        points: [T`Licznik: suma iloczynów wartość · waga.`, T`Mianownik: suma wag.`, T`Dane pogrupowane: wagą jest liczebność.`]
      }),
      gens: [wGrades, wMissingGrade, wMixture, wFrequency]
    },
    {
      title: 'Mediana',
      short_title: 'Mediana',
      pill: pill({
        essence: T`Mediana to wartość środkowa uporządkowanego zestawu danych: połowa danych jest od niej nie większa, połowa – nie mniejsza. Pierwszy krok jest zawsze ten sam: uporządkuj dane rosnąco. Gdy liczba danych jest nieparzysta, medianą jest wyraz środkowy. Gdy parzysta – średnia arytmetyczna dwóch środkowych wyrazów.`,
        context: 'Zadanie 31–32 w arkuszu • 1 pkt. Mediana pojawia się na maturze częściej niż średnia.',
        pl: T`Ustaw ludzi w szeregu od najniższego do najwyższego. Mediana to wzrost tego, kto stoi dokładnie pośrodku. Jeśli osób jest parzysta liczba i pośrodku stoi dwóch – bierzesz średnią z ich wzrostów.`,
        steps: [
          ['Uporządkuj dane rosnąco', T`$8, 3, 10, 5, 12$ zamień na $3, 5, 8, 10, 12$.`, 'Bez tego wynik będzie błędny.'],
          ['Policz dane', T`$n = 5$ – liczba nieparzysta.`, 'Parzysta czy nieparzysta?'],
          ['Wskaż środek', T`Trzeci wyraz: $8$.`, 'Dla parzystej liczby danych: średnia dwóch środkowych.']
        ],
        formulas: [
          ['Liczba danych nieparzysta', T`M = x_{\frac{n+1}{2}}`, 30],
          ['Liczba danych parzysta', T`M = \frac{x_{\frac{n}{2}} + x_{\frac{n}{2}+1}}{2}`, 30]
        ],
        examples: [
          ['Parzysta liczba danych', '1 pkt', T`Wyznacz medianę zestawu $7, 2, 9, 4, 6, 3$.`, T`1. Po uporządkowaniu: $2, 3, 4, 6, 7, 9$.` + '\n' + T`2. Środkowe: $4$ i $6$.` + '\n' + T`3. $M = \frac{4 + 6}{2} = 5$.`, 'Mediana nie musi być jedną z danych.'],
          ['Niewiadoma', '1 pkt', T`Mediana uporządkowanego zestawu $1, 3, x, 8, 10, 12$ jest równa $6$. Oblicz $x$.`, T`1. Środkowe wyrazy to $x$ i $8$.` + '\n' + T`2. $\frac{x + 8}{2} = 6$.` + '\n' + T`3. $x = 4$.`, 'Sześć danych – średnia trzeciej i czwartej.']
        ],
        trap: T`Mediany NIE wyznacza się z nieuporządkowanego zestawu. Środkowa liczba „jak leci” to przypadkowa wartość.`,
        fail: T`„Zestaw $8, 3, 10, 5, 12$ – środkowa liczba to $10$, więc mediana to $10$.”`,
        win: T`Po uporządkowaniu: $3, 5, 8, 10, 12$ – mediana to $8$.`,
        why: 'Mediana dzieli dane na połowę mniejszych i połowę większych, a to ma sens tylko w uporządkowanym ciągu.',
        ckeTip: 'Po uporządkowaniu policz dane jeszcze raz – łatwo zgubić albo zdublować jedną liczbę przy przepisywaniu.',
        points: [T`Najpierw porządkujemy dane.`, T`Nieparzysta liczba danych: wyraz środkowy.`, T`Parzysta: średnia dwóch środkowych.`]
      }),
      gens: [medOdd, medEven, medWithX, medFrequency, medAfterAdding]
    },
    {
      title: 'Dominanta i dane pogrupowane',
      short_title: 'Dominanta',
      pill: pill({
        essence: T`Dominanta (moda) to wartość, która występuje w zestawie najczęściej. W danych pogrupowanych (tabela „wartość – liczebność”) dominantą jest wartość z największą liczebnością. Po dopisaniu nowych danych liczebności się zmieniają, więc dominantę trzeba wyznaczyć od nowa.`,
        context: 'Zadania zamknięte za 1 pkt (dominanta, porównanie średniej, mediany i dominanty) oraz otwarte za 2 pkt z danymi z tabeli.',
        pl: T`Dominanta to „najpopularniejsza odpowiedź”. Jeśli w klasie najwięcej osób dostało czwórkę, dominantą jest $4$ – niezależnie od tego, czy czwórek było $7$, czy $12$.`,
        steps: [
          ['Zlicz wystąpienia', T`$2, 5, 3, 5, 4, 5, 2$: piątka występuje trzy razy.`, 'Odpowiedzią jest wartość, nie liczba wystąpień.'],
          ['Tabela: największa liczebność', T`Ocena $3$ – $7$ osób, ocena $4$ – $5$ osób: dominanta $3$.`, 'Szukasz największej liczby w kolumnie liczebności.'],
          ['Po zmianie danych – policz od nowa', T`Dopisano $4$ czwórki: czwórek jest $9$, więc dominanta to teraz $4$.`, 'Nowe liczebności, nowa dominanta.']
        ],
        formulas: [
          ['Dominanta', T`\text{wartość o największej liczebności}`],
          ['Mediana (n nieparzyste)', T`\text{środkowy wyraz uporządkowanego zestawu}`, 30]
        ],
        examples: [
          ['Dominanta z tabeli', '1 pkt', T`Oceny: dwójka – $3$ osoby, trójka – $7$ osób, czwórka – $5$ osób. Podaj dominantę.`, T`1. Największa liczebność to $7$.` + '\n' + T`2. Odpowiada jej ocena $3$.` + '\n' + T`3. Dominanta: $3$.`, 'Dominantą jest ocena, nie liczba osób.'],
          ['Po dopisaniu danych', '1 pkt', T`Do tej samej klasy dopisano $3$ osoby z oceną $4$. Podaj nową dominantę.`, T`1. Czwórek jest teraz $5 + 3 = 8$.` + '\n' + T`2. $8 > 7$, więc dominanta to $4$.`, 'Liczebności zmieniają się po dopisaniu danych.']
        ],
        trap: T`Dominanta to WARTOŚĆ, a nie liczba jej wystąpień. Jeśli piątka pojawia się trzy razy, dominantą jest $5$, nie $3$.`,
        fail: T`„W zestawie $2, 5, 3, 5, 4, 5$ dominanta to $3$, bo piątka występuje trzy razy.”`,
        win: T`Dominanta to $5$.`,
        why: 'Pytanie brzmi „która wartość jest najczęstsza”, a nie „ile razy występuje”.',
        ckeTip: 'Od 2025 r. w zakresie podstawowym są średnia, średnia ważona, mediana i dominanta – bez odchylenia standardowego.',
        points: [T`Dominanta: wartość najczęstsza.`, T`W tabeli: wartość z największą liczebnością.`, T`Zmiana danych – nowa dominanta.`]
      }),
      gens: [modeSimple, modeFrequency, modeAfterAdding, statCompare, modeAndMean]
    },
    {
      title: 'Odczytywanie danych z tabel i diagramów',
      short_title: 'Tabele i diagramy',
      pill: pill({
        essence: T`Dane statystyczne na maturze są najczęściej podane w tabeli lub na diagramie słupkowym: każdej wartości towarzyszy liczebność, czyli informacja, ile razy ta wartość wystąpiła. Liczba wszystkich danych to suma liczebności. Średnią liczysz jak średnią ważoną (wagą jest liczebność), medianę – zliczając liczebności do środkowej pozycji, a dominantę wskazuje najwyższy słupek.`,
        context: 'Zadanie 31–32 w arkuszu • 1–2 pkt, zwykle z diagramem słupkowym lub tabelą.',
        pl: T`Diagram to skrócony zapis długiej listy. „Ocena $3$ – $7$ uczniów” znaczy, że na liście trójka jest wypisana siedem razy. Zanim cokolwiek policzysz, zsumuj słupki – musisz wiedzieć, ile danych w ogóle masz.`,
        steps: [
          ['Policz liczbę danych', T`Liczebności $3, 7, 5$: razem $15$.`, 'Suma wysokości słupków.'],
          ['Średnia', T`$\frac{2 \cdot 3 + 3 \cdot 7 + 4 \cdot 5}{15} = \frac{47}{15}$.`, 'Wartość razy liczebność.'],
          ['Mediana i dominanta', T`Ósma dana z $15$ to trójka (miejsca $4$–$10$). Dominanta: $3$.`, 'Zliczaj liczebności po kolei.']
        ],
        formulas: [
          ['Liczba danych', T`n = n_1 + n_2 + \ldots + n_k`],
          ['Średnia z danych pogrupowanych', T`\bar{x} = \frac{x_1 n_1 + x_2 n_2 + \ldots + x_k n_k}{n}`, 29],
          ['Procent grupy', T`\frac{n_i}{n} \cdot 100\%`]
        ],
        examples: [
          ['Procent', '1 pkt', T`Oceny: dwójka – $4$ osoby, trójka – $6$, czwórka – $8$, piątka – $2$. Jaki procent uczniów dostał co najmniej czwórkę?`, T`1. Wszystkich: $20$.` + '\n' + T`2. Co najmniej czwórka: $8 + 2 = 10$.` + '\n' + T`3. $\frac{10}{20} = 50\%$.`, '„Co najmniej 4” to czwórki i piątki.'],
          ['Mediana', '1 pkt', T`Dla tych samych danych wyznacz medianę.`, T`1. Dane jest $20$: mediana to średnia dziesiątej i jedenastej.` + '\n' + T`2. Miejsca $1$–$4$: dwójki, $5$–$10$: trójki, $11$–$18$: czwórki.` + '\n' + T`3. $M = \frac{3 + 4}{2} = 3{,}5$.`, 'Dziesiąta dana to 3, jedenasta to 4.']
        ],
        trap: T`Wysokość słupka to LICZEBNOŚĆ, a nie wartość. Średnia z wysokości słupków nic nie znaczy.`,
        fail: T`„Słupki mają wysokości $4, 6, 8, 2$, więc średnia to $\frac{20}{4} = 5$.”`,
        win: T`$\frac{2 \cdot 4 + 3 \cdot 6 + 4 \cdot 8 + 5 \cdot 2}{20} = 3{,}4$.`,
        why: 'Słupki mówią, ile razy dana wartość wystąpiła – wartości trzeba wziąć z osi poziomej.',
        ckeTip: 'Przepisz dane z diagramu do tabelki „wartość – liczebność” na marginesie. To eliminuje błędy odczytu.',
        points: [T`Liczba danych: suma liczebności.`, T`Średnia: wartość · liczebność, podzielone przez liczbę danych.`, T`Dominanta: najwyższy słupek.`]
      }),
      gens: [tabMean, tabPercent, tabMedian, tabAboveMean, tabMode]
    }
  ]
};

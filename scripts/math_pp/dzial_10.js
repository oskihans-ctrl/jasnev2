import { T, mc, num, pf, pill, fr, par, sq, lin, xm, m, need, gcd, isSquare } from './lib.js';
import { figPoints } from './figures.js';

const P = (x, y) => m(`(${x}, ${y})`);
const Pf = (xn, xd, yn, yd) => m(`\\left(${fr(xn, xd)}, ${fr(yn, yd)}\\right)`);
const eqy = (a, b) => m(`y = ${lin(a, b)}`);
const sqTerm = (p, v) => (p === 0 ? `${v}^2` : `(${xm(p, v)})^2`);
const circ = (a, b, r2) => `${sqTerm(a, 'x')} + ${sqTerm(b, 'y')} = ${r2}`;
const TIP_DIST = 'Karta wzorów, str. 21: długość odcinka $|AB| = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$, środek $S = \\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\right)$.';
const TIP_LINE = 'Karta wzorów, str. 22: proste $y = a_1x + b_1$ i $y = a_2x + b_2$ są równoległe, gdy $a_1 = a_2$; przy różnych wyrazach wolnych nie mają punktu wspólnego.';
const TIP_CIRC = 'Karta wzorów, str. 23: równanie okręgu o środku $S = (a, b)$ i promieniu $r$: $(x - a)^2 + (y - b)^2 = r^2$.';
const slope = (n, d) => {
  const s = fr(n, d);
  return s === '1' ? '' : s === '-1' ? '-' : s;
};

// ---------- 10.1 Odległość punktów i środek odcinka ----------
const midPoint = (r) => {
  const [x1, y1, x2, y2] = [r.int(-9, 9), r.int(-9, 9), r.int(-9, 9), r.int(-9, 9)];
  need((x1 !== x2 || y1 !== y2) && x1 + x2 !== 0 && y1 + y2 !== 0);
  return mc({
    diagram: figPoints([{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }]),
    title: 'Środek odcinka',
    q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dane są punkty $A = (${x1}, ${y1})$ oraz $B = (${x2}, ${y2})$. Środkiem odcinka $AB$ jest punkt`,
    ok: Pf(x1 + x2, 2, y1 + y2, 2),
    bad: [P(x1 + x2, y1 + y2), Pf(x2 - x1, 2, y2 - y1, 2), Pf(x1 + y1, 2, x2 + y2, 2), Pf(y1 + y2, 2, x1 + x2, 2), P(x2 - x1, y2 - y1)],
    steps: [T`Współrzędne środka to średnie arytmetyczne współrzędnych końców.`, T`$x_S = \frac{${x1} + ${par(x2)}}{2} = ${fr(x1 + x2, 2)}$, $y_S = \frac{${y1} + ${par(y2)}}{2} = ${fr(y1 + y2, 2)}$.`],
    trap: T`Współrzędne DODAJEMY i dzielimy przez $2$. Odejmowanie służy do liczenia długości odcinka, nie środka.`,
    tip: TIP_DIST
  });
};
const segLength = (r) => {
  const [x1, y1] = [r.int(-7, 7), r.int(-7, 7)];
  const [dx, dy] = r.rnd() < 0.5 ? r.pick([[3, 4], [4, 3], [6, 8], [5, 12], [12, 5], [8, 6], [8, 15]]) : [r.int(1, 7), r.int(1, 7)];
  const [sx, sy] = [r.pick([1, -1]), r.pick([1, -1])];
  const [x2, y2] = [x1 + sx * dx, y1 + sy * dy];
  const d2 = dx * dx + dy * dy;
  return mc({
    diagram: figPoints([{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }]),
    title: 'Długość odcinka',
    q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dane są punkty $A = (${x1}, ${y1})$ oraz $B = (${x2}, ${y2})$. Długość odcinka $AB$ jest równa`,
    ok: m(sq(d2)),
    val: Math.sqrt(d2),
    bad: [m(`${dx + dy}`), m(`${d2}`), m(sq(Math.abs(dx * dx - dy * dy) || 2)), m(sq((x1 + x2) ** 2 + (y1 + y2) ** 2 || 3)), m(sq(2 * d2))],
    steps: [T`Różnice współrzędnych: $x_B - x_A = ${x2 - x1}$, $y_B - y_A = ${y2 - y1}$.`, T`$|AB| = \sqrt{${par(x2 - x1)}^2 + ${par(y2 - y1)}^2} = \sqrt{${dx * dx} + ${dy * dy}} = \sqrt{${d2}}${isSquare(d2) || sq(d2) !== `\\sqrt{${d2}}` ? ` = ${sq(d2)}` : ''}$.`],
    trap: T`Przy odejmowaniu współrzędnych ujemnych pojawia się plus: $x - (-3) = x + 3$. Kwadrat różnicy jest zawsze nieujemny.`,
    tip: TIP_DIST
  });
};
const segOtherEnd = (r) => {
  const [x1, y1, sx, sy] = [r.int(-8, 8), r.int(-8, 8), r.int(-6, 6), r.int(-6, 6)];
  need(x1 !== sx || y1 !== sy);
  const [x2, y2] = [2 * sx - x1, 2 * sy - y1];
  return mc({
    diagram: figPoints([{ x: x1, y: y1, label: 'A' }, { x: sx, y: sy, label: 'S' }]),
    title: 'Drugi koniec odcinka',
    q: T`Punkt $S = (${sx}, ${sy})$ jest środkiem odcinka $AB$, w którym $A = (${x1}, ${y1})$. Punkt $B$ ma współrzędne`,
    ok: P(x2, y2),
    bad: [Pf(x1 + sx, 2, y1 + sy, 2), P(sx - x1, sy - y1), P(2 * x1 - sx, 2 * y1 - sy), P(x1 + sx, y1 + sy), P(y2, x2)],
    steps: [T`Ze wzoru na środek: $\frac{${x1} + x_B}{2} = ${sx}$, więc $x_B = 2 \cdot ${par(sx)} - ${par(x1)} = ${x2}$.`, T`$\frac{${y1} + y_B}{2} = ${sy}$, więc $y_B = 2 \cdot ${par(sy)} - ${par(y1)} = ${y2}$.`],
    trap: T`Punkt $B$ leży „po drugiej stronie” środka – w takiej samej odległości jak $A$. To nie jest środek odcinka $AS$.`,
    tip: 'Jeśli $S$ jest środkiem odcinka $AB$, to $B = (2x_S - x_A, \\ 2y_S - y_A)$.'
  });
};
const segOriginDistance = (r) => {
  const [a, b] = r.rnd() < 0.5 ? r.pick([[3, 4], [6, 8], [5, 12], [8, 15], [12, 5], [4, 3], [9, 12]]) : [r.int(1, 8), r.int(1, 8)];
  const [x, y] = [a * r.pick([1, -1]), b * r.pick([1, -1])];
  const d2 = a * a + b * b;
  return mc({
    diagram: figPoints([{ x: 0, y: 0, label: 'O' }, { x, y, label: 'P' }]),
    title: 'Odległość punktu od początku układu',
    q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dany jest punkt $P = (${x}, ${y})$. Odległość punktu $P$ od początku układu współrzędnych jest równa`,
    ok: m(sq(d2)),
    val: Math.sqrt(d2),
    bad: [m(`${a + b}`), m(`${d2}`), m(`${Math.abs(x + y) || 1}`), m(sq(Math.abs(a * a - b * b) || 2)), m(`${Math.max(a, b)}`)],
    steps: [T`Początek układu to punkt $(0, 0)$, więc $|OP| = \sqrt{${par(x)}^2 + ${par(y)}^2}$.`, T`$|OP| = \sqrt{${a * a} + ${b * b}} = \sqrt{${d2}}${sq(d2) !== `\\sqrt{${d2}}` ? ` = ${sq(d2)}` : ''}$.`],
    trap: T`Współrzędne ujemne po podniesieniu do kwadratu stają się dodatnie: $${par(-a)}^2 = ${a * a}$.`,
    tip: TIP_DIST
  });
};
const segSquareFromDiagonal = (r) => {
  const [x1, y1] = [r.int(-6, 6), r.int(-6, 6)];
  const [dx, dy] = [r.intNot(-7, 7, 0), r.intNot(-7, 7, 0)];
  const d2 = dx * dx + dy * dy;
  const side = r.bool();
  return mc({
    title: side ? 'Pole kwadratu z boku w układzie współrzędnych' : 'Pole kwadratu z przekątnej w układzie współrzędnych',
    q: T`Punkty $A = (${x1}, ${y1})$ oraz $${side ? 'B' : 'C'} = (${x1 + dx}, ${y1 + dy})$ są ${side ? 'sąsiednimi' : 'przeciwległymi'} wierzchołkami kwadratu $ABCD$. Pole tego kwadratu jest równe`,
    ok: m(fr(d2, side ? 1 : 2)),
    val: side ? d2 : d2 / 2,
    bad: [m(fr(d2, side ? 2 : 1)), m(sq(d2)), m(fr(2 * d2, 1)), m(fr(d2, 4)), m(`${Math.abs(dx * dy)}`)],
    steps: side ? [T`Bok kwadratu: $|AB|^2 = ${par(dx)}^2 + ${par(dy)}^2 = ${d2}$.`, T`Pole kwadratu to kwadrat boku: $P = |AB|^2 = ${d2}$.`] : [T`Przekątna: $|AC|^2 = ${par(dx)}^2 + ${par(dy)}^2 = ${d2}$.`, T`Pole kwadratu o przekątnej $d$ to $\frac{d^2}{2} = ${fr(d2, 2)}$.`],
    trap: side ? T`Nie trzeba pierwiastkować – pole kwadratu to $|AB|^2$, a tę liczbę daje wprost wzór na długość odcinka (przed pierwiastkiem).` : T`Wierzchołki są przeciwległe, więc odcinek $AC$ to przekątna, a nie bok. Pole to połowa kwadratu przekątnej.`,
    tip: 'Pole kwadratu: $a^2$ (z boku) albo $\\frac{d^2}{2}$ (z przekątnej).'
  });
};

// ---------- 10.2 Równanie prostej ----------
const lineTwoPoints = (r) => {
  const a = r.intNot(-4, 4, 0);
  const b = r.int(-7, 7);
  const x1 = r.int(-4, 4);
  const x2 = r.intNot(-4, 4, x1);
  return mc({
    title: 'Równanie prostej przez dwa punkty',
    q: T`W kartezjańskim układzie współrzędnych $(x, y)$ prosta przechodzi przez punkty $A = (${x1}, ${a * x1 + b})$ oraz $B = (${x2}, ${a * x2 + b})$. Prosta ta ma równanie`,
    ok: eqy(a, b),
    bad: [eqy(-a, b), eqy(a, -b || 1), eqy(a, b + a), eqy(-a, -b || 2), eqy(b || 3, a)],
    steps: [T`$a = \frac{${a * x2 + b} - ${par(a * x1 + b)}}{${x2} - ${par(x1)}} = ${a}$.`, T`Podstawiamy punkt $A$: $${a * x1 + b} = ${a} \cdot ${par(x1)} + b$, więc $b = ${b}$.`, T`Równanie: $y = ${lin(a, b)}$.`],
    trap: T`Sprawdź równanie drugim punktem: po podstawieniu $x = ${x2}$ musi wyjść $y = ${a * x2 + b}$.`,
    tip: 'Karta wzorów, str. 21: współczynnik kierunkowy $a = \\frac{y_2 - y_1}{x_2 - x_1}$.'
  });
};
const linePointParam = (r) => {
  const a = r.intNot(-5, 5, 0);
  const b = r.int(-8, 8);
  const x0 = r.intNot(-6, 6, 0);
  const askX = r.bool();
  const y0 = a * x0 + b;
  return mc({
    title: 'Punkt na prostej',
    q: askX ? T`Punkt $P = (m, ${y0})$ należy do prostej o równaniu $y = ${lin(a, b)}$. Liczba $m$ jest równa` : T`Punkt $P = (${x0}, m)$ należy do prostej o równaniu $y = ${lin(a, b)}$. Liczba $m$ jest równa`,
    ok: m(askX ? x0 : y0),
    val: askX ? x0 : y0,
    bad: askX ? [m(a * y0 + b), m(-x0), m(fr(y0 + b, a)), m(x0 + 1), m(fr(y0, a))] : [m(fr(x0 - b, a)), m(-y0 === y0 ? 1 : -y0), m(a * x0 - b), m(y0 + 1), m(a * x0)],
    steps: askX ? [T`Podstawiamy $y = ${y0}$: $${y0} = ${a === 1 ? '' : a === -1 ? '-' : a}m ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$.`, T`$${a === 1 ? '' : a === -1 ? '-' : a}m = ${y0 - b}$, więc $m = ${x0}$.`] : [T`Podstawiamy $x = ${x0}$ do równania prostej.`, T`$m = ${a} \cdot ${par(x0)} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${y0}$.`],
    trap: T`Pierwsza współrzędna punktu to $x$, druga to $y$. Wstaw każdą w odpowiednie miejsce równania.`,
    tip: 'Punkt należy do prostej, gdy jego współrzędne spełniają jej równanie.'
  });
};
const lineSlopeThroughPoint = (r) => {
  const a = r.intNot(-5, 5, 0);
  const [px, py] = [r.intNot(-6, 6, 0), r.int(-7, 7)];
  const b = py - a * px;
  return mc({
    title: 'Prosta o danym współczynniku kierunkowym',
    q: T`Prosta o współczynniku kierunkowym $a = ${a}$ przechodzi przez punkt $P = (${px}, ${py})$. Prosta ta ma równanie`,
    ok: eqy(a, b),
    bad: [eqy(a, py), eqy(a, py + a * px), eqy(a, -b || 1), eqy(px, py), eqy(-a, py + a * px)],
    steps: [T`Szukamy $b$ w równaniu $y = ${a === 1 ? '' : a === -1 ? '-' : a}x + b$.`, T`Podstawiamy punkt $P$: $${py} = ${a} \cdot ${par(px)} + b$, więc $b = ${py} - ${par(a * px)} = ${b}$.`],
    trap: T`Wyraz wolny $b$ to nie druga współrzędna punktu $P$ – trzeba go obliczyć z równania.`,
    tip: 'Znając współczynnik kierunkowy i jeden punkt, wyraz wolny wyznaczysz z jednego podstawienia.'
  });
};
const lineGeneralForm = (r) => {
  const A = r.intNot(-6, 6, 0);
  const B = r.intNot(-5, 5, 0);
  const C = r.intNot(-9, 9, 0);
  const askB = r.bool();
  return mc({
    title: 'Postać ogólna prostej',
    q: T`Prosta jest dana równaniem ogólnym $${lin(A, 0)} ${B > 0 ? '+' : '-'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}y ${C > 0 ? '+' : '-'} ${Math.abs(C)} = 0$. ${askB ? 'Prosta ta przecina oś $Oy$ w punkcie o drugiej współrzędnej równej' : 'Współczynnik kierunkowy tej prostej jest równy'}`,
    ok: m(askB ? fr(-C, B) : fr(-A, B)),
    val: askB ? -C / B : -A / B,
    bad: askB ? [m(fr(C, B)), m(fr(-C, A)), m(`${C}`), m(fr(-B, C))] : [m(fr(A, B)), m(fr(-B, A)), m(`${A}`), m(fr(B, A))],
    steps: [T`Wyznaczamy $y$: $${B === 1 ? '' : B === -1 ? '-' : B}y = ${lin(-A, -C)}$.`, T`$y = ${slope(-A, B)}x ${-C / B >= 0 ? '+' : '-'} ${fr(Math.abs(C), Math.abs(B))}$, więc ${askB ? T`$b = ${fr(-C, B)}$` : T`$a = ${fr(-A, B)}$`}.`],
    trap: T`Współczynnika kierunkowego nie odczytuje się wprost z postaci ogólnej. Najpierw trzeba wyznaczyć $y$ – wtedy $a = -\frac{A}{B}$.`,
    tip: 'Karta wzorów, str. 22: równanie ogólne prostej $Ax + By + C = 0$; dla $B \\neq 0$ można je zapisać jako $y = ax + b$.'
  });
};
const lineAxisPoints = (r) => {
  const a = r.intNot(-4, 4, 0);
  const z = r.intNot(-6, 6, 0);
  const b = -a * z;
  // pole trójkąta odciętego przez prostą i osie
  const area = (Math.abs(z) * Math.abs(b)) / 2;
  return mc({
    title: 'Trójkąt ograniczony prostą i osiami układu',
    q: T`Prosta o równaniu $y = ${lin(a, b)}$ wraz z osiami układu współrzędnych ogranicza trójkąt. Pole tego trójkąta jest równe`,
    ok: m(fr(Math.abs(z * b), 2)),
    val: area,
    bad: [m(`${Math.abs(z * b)}`), m(fr(Math.abs(b), 2)), m(fr(Math.abs(z * b), 4)), m(`${Math.abs(z) + Math.abs(b)}`), m(fr(b * b, 2))],
    steps: [T`Punkt przecięcia z osią $Oy$: $(0, ${b})$. Punkt przecięcia z osią $Ox$: $${lin(a, b)} = 0$, czyli $(${z}, 0)$.`, T`Trójkąt jest prostokątny, a jego przyprostokątne mają długości $${Math.abs(z)}$ i $${Math.abs(b)}$.`, T`$P = \frac{1}{2} \cdot ${Math.abs(z)} \cdot ${Math.abs(b)} = ${fr(Math.abs(z * b), 2)}$.`],
    trap: T`Długości boków są dodatnie, nawet jeśli współrzędne punktów są ujemne – bierzemy wartości bezwzględne.`,
    tip: 'Prosta $y = ax + b$ przecina oś $Oy$ w punkcie $(0, b)$, a oś $Ox$ w punkcie $\\left(-\\frac{b}{a}, 0\\right)$.'
  });
};

// ---------- 10.3 Wzajemne położenie prostych i proste równoległe ----------
// Podstawa 2024 (IX.1, IX.2): położenie prostych, punkt wspólny i prosta równoległa.
// Prosta prostopadła jest od 2024 r. wymaganiem rozszerzonym (IX.R4), więc nie ma jej w tej lekcji.
const yEq = (nn, dd, bb) => m(`y = ${slope(nn, dd)}x${bb === 0 ? '' : ` ${bb > 0 ? '+' : '-'} ${Math.abs(bb)}`}`);
// Pary (licznik, mianownik) współczynnika – losowane z listy, bez odrzuceń (generator nie traci kolejki w build.js)
const SLOPES = [[2, 1], [-2, 1], [3, 1], [-3, 1], [4, 1], [-5, 1], [1, 2], [-1, 2], [3, 2], [-3, 2], [2, 3], [-2, 3], [4, 3], [-5, 3], [1, 4], [-3, 4], [5, 4]];
const parSlope = (r) => {
  const [n, d] = r.pick(SLOPES);
  const b = r.int(-7, 7);
  const b2 = r.intNot(-7, 7, b);
  return mc({
    title: 'Prosta równoległa',
    q: T`Prosta $k$ ma równanie $y = ${slope(n, d)}x${b === 0 ? '' : ` ${b > 0 ? '+' : '-'} ${Math.abs(b)}`}$. Prostą równoległą do prostej $k$ jest prosta o równaniu`,
    ok: yEq(n, d, b2),
    bad: [yEq(-n, d, b2), yEq(d, n, b2), yEq(-d, n, b2)],
    steps: [T`Proste równoległe mają równe współczynniki kierunkowe: $a = ${fr(n, d)}$.`, `Taki współczynnik (i inny wyraz wolny) ma tylko prosta ${yEq(n, d, b2)}.`],
    trap: T`O równoległości decyduje tylko współczynnik przy $x$. Zmiana znaku albo odwrócenie ułamka daje prostą, która przecina prostą $k$.`,
    tip: TIP_LINE
  });
};
const parParam = (r) => {
  const k = r.pick([1, 2, 3]);
  const c = r.intNot(-6, 6, 0);
  const a2 = r.intNot(-4, 4, 0);
  const nn = a2 - c;
  const coef = `${k === 1 ? '' : k}m ${c > 0 ? '+' : '-'} ${Math.abs(c)}`;
  const [b1, b2] = [r.int(1, 9), r.int(-9, -1)];
  return mc({
    title: 'Parametr: proste równoległe',
    q: T`Proste o równaniach $y = (${coef})x + ${b1}$ oraz $y = ${lin(a2, b2)}$ są równoległe. Liczba $m$ jest równa`,
    ok: m(fr(nn, k)),
    val: nn / k,
    bad: [m(fr(a2 + c, k)), m(fr(-nn, k) === fr(nn, k) ? '1' : fr(-nn, k)), m(fr(a2, k) === fr(nn, k) ? fr(a2 + 1, k) : fr(a2, k)), m(fr(nn * k, 1) === fr(nn, k) ? fr(nn + 1, k) : fr(nn * k, 1))],
    steps: [T`Proste równoległe: $${coef} = ${a2}$.`, T`$${k === 1 ? '' : k}m = ${a2 - c}$, więc $m = ${fr(nn, k)}$.`],
    trap: T`Przyrównujemy całe wyrażenie stojące przy $x$, czyli $${coef}$, a nie samo $m$.`,
    tip: TIP_LINE
  });
};
const parThroughPoint = (r) => {
  const a = r.pick([2, 3, 4, -2, -3, -4]);
  const b = r.int(-6, 6);
  const px = r.intNot(-4, 4, 0);
  const py = r.int(-6, 6);
  const c = py - a * px;
  need(c !== b);
  return mc({
    title: 'Prosta równoległa przez punkt',
    q: T`Prosta $l$ jest równoległa do prostej o równaniu $y = ${lin(a, b)}$ i przechodzi przez punkt $P = (${px}, ${py})$. Prosta $l$ ma równanie`,
    ok: yEq(a, 1, c),
    bad: [yEq(a, 1, b), yEq(-a, 1, py + a * px), yEq(a, 1, py + a * px), yEq(1, 1, py - px)].filter((o, i, all) => all.indexOf(o) === i),
    steps: [T`Prosta równoległa ma ten sam współczynnik kierunkowy: $a = ${a}$.`, T`Podstawiamy punkt $P$: $${py} = ${a} \cdot ${par(px)} + b$, więc $b = ${c}$.`, T`Równanie: $y = ${lin(a, c)}$.`],
    trap: T`Wyraz wolny prostej wyjściowej ($${b}$) nie przechodzi na prostą $l$ – trzeba go wyliczyć z punktu $P$.`,
    tip: TIP_LINE
  });
};
const crossPoint = (r) => {
  const a1 = r.intNot(-4, 4, 0);
  const a2 = r.intNot(-4, 4, 0, a1);
  const x0 = r.intNot(-5, 5, 0);
  const y0 = r.int(-6, 6);
  const b1 = y0 - a1 * x0;
  const b2 = y0 - a2 * x0;
  return mc({
    title: 'Punkt wspólny dwóch prostych',
    q: T`Proste o równaniach $y = ${lin(a1, b1)}$ oraz $y = ${lin(a2, b2)}$ przecinają się w punkcie`,
    ok: P(x0, y0),
    bad: [P(y0, x0), P(-x0, y0), P(x0, -y0), P(0, b1)].filter((o) => o !== P(x0, y0)),
    steps: [T`Porównujemy prawe strony: $${lin(a1, b1)} = ${lin(a2, b2)}$, stąd $${a1 - a2 === 1 ? '' : a1 - a2 === -1 ? '-' : a1 - a2}x = ${b2 - b1}$, czyli $x = ${x0}$.`, T`Podstawiamy do pierwszego równania: $y = ${a1} \cdot ${par(x0)} ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)} = ${y0}$.`],
    trap: T`Punkt przecięcia musi spełniać OBA równania – sprawdź go w drugim: $${a2} \cdot ${par(x0)} ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)} = ${y0}$.`,
    tip: 'Punkt wspólny dwóch prostych to rozwiązanie układu ich równań.'
  });
};
const linesPosition = (r) => {
  const a = r.intNot(-4, 4, 0);
  const b = r.int(-6, 6);
  const kind = r.int(0, 2);
  const mult = r.pick([2, 3, -2]);
  const a2 = kind === 2 ? r.intNot(-4, 4, 0, a) : a;
  let second;
  if (kind === 0) second = `y = ${lin(a, r.intNot(-6, 6, b))}`;
  else if (kind === 1) second = `${mult}y = ${lin(mult * a, mult * b)}`;
  else second = `y = ${lin(a2, b)}`;
  const ans = ['są równoległe i różne', 'pokrywają się', 'przecinają się w punkcie leżącym na osi Oy'][kind];
  return mc({
    title: 'Wzajemne położenie dwóch prostych',
    q: T`Proste o równaniach $y = ${lin(a, b)}$ oraz $${second}$`,
    ok: ans,
    bad: ['są równoległe i różne', 'pokrywają się', 'przecinają się w punkcie leżącym na osi Oy', 'przecinają się w punkcie, który nie leży na osi Oy'].filter((x) => x !== ans),
    steps: [
      kind === 1 ? T`Dzielimy drugie równanie przez $${mult}$: $y = ${lin(a, b)}$ – to ta sama prosta.` : T`Współczynniki kierunkowe: $a_1 = ${a}$ oraz $a_2 = ${a2}$.`,
      kind === 0 ? T`$a_1 = a_2$, a wyrazy wolne są różne, więc proste są równoległe i nie mają punktu wspólnego.` : kind === 1 ? T`Równania opisują ten sam zbiór punktów, więc proste się pokrywają (mają nieskończenie wiele punktów wspólnych).` : T`$a_1 \neq a_2$, więc proste się przecinają. Mają ten sam wyraz wolny $${b}$, więc punkt przecięcia to $(0, ${b})$ – leży na osi $Oy$.`
    ],
    trap: T`Przed porównaniem współczynników sprowadź oba równania do postaci $y = ax + b$ – np. $2y = 4x + 2$ to ta sama prosta co $y = 2x + 1$.`,
    tip: TIP_LINE
  });
};

// ---------- 10.4 Równanie okręgu ----------
const circCenterRadius = (r) => {
  const [a, b] = [r.intNot(-7, 7, 0), r.intNot(-7, 7, 0)];
  const rr = r.int(2, 9);
  const o = (x, y, rad) => `$S = (${x}, ${y})$, $r = ${rad}$`;
  return mc({
    title: 'Środek i promień okręgu',
    q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dany jest okrąg o równaniu $${circ(a, b, rr * rr)}$. Środek $S$ i promień $r$ tego okręgu to`,
    ok: o(a, b, rr),
    bad: [o(-a, -b, rr), o(a, b, rr * rr), o(-a, -b, rr * rr), o(b, a, rr)],
    steps: [T`Porównujemy z równaniem $(x - a)^2 + (y - b)^2 = r^2$.`, T`W nawiasach stoją $${xm(a)}$ oraz $${xm(b, 'y')}$, czyli $x - ${par(a)}$ oraz $y - ${par(b)}$, więc $S = (${a}, ${b})$.`, T`$r^2 = ${rr * rr}$, więc $r = ${rr}$.`],
    trap: T`Znaki współrzędnych środka są przeciwne do tych w nawiasach, a po prawej stronie stoi $r^2$, a nie $r$.`,
    tip: TIP_CIRC
  });
};
const circFromCenterPoint = (r) => {
  const [a, b] = [r.int(-6, 6), r.int(-6, 6)];
  const [dx, dy] = [r.intNot(-5, 5, 0), r.int(-5, 5)];
  const r2 = dx * dx + dy * dy;
  need(a !== 0 && b !== 0);
  return mc({
    title: 'Równanie okręgu ze środka i punktu',
    q: T`Punkt $S = (${a}, ${b})$ jest środkiem okręgu, a punkt $A = (${a + dx}, ${b + dy})$ leży na tym okręgu. Okrąg ten ma równanie`,
    ok: m(circ(a, b, r2)),
    bad: [m(circ(-a, -b, r2)), m(circ(a, b, sq(r2).includes('sqrt') ? r2 * 2 : Math.sqrt(r2))), m(circ(a + dx, b + dy, r2)), m(circ(-a, -b, r2 * 2)), m(circ(a, b, Math.abs(dx) + Math.abs(dy)))],
    steps: [T`Promień to odległość środka od punktu na okręgu: $r^2 = |SA|^2 = ${par(dx)}^2 + ${par(dy)}^2 = ${r2}$.`, T`Równanie: $${circ(a, b, r2)}$.`],
    trap: T`Po prawej stronie równania wpisujemy $r^2 = ${r2}$ – nie trzeba pierwiastkować. W nawiasach stoją współrzędne środka ze zmienionym znakiem.`,
    tip: TIP_CIRC
  });
};
const circPointPosition = (r) => {
  const [a, b] = [r.int(-5, 5), r.int(-5, 5)];
  const rr = r.pick([5, 10, 13]);
  const on = { 5: [[3, 4], [4, 3], [5, 0], [0, 5]], 10: [[6, 8], [8, 6], [10, 0]], 13: [[5, 12], [12, 5]] }[rr];
  const [dx, dy] = r.pick(on);
  const [sx, sy] = [r.pick([1, -1]), r.pick([1, -1])];
  const good = [a + sx * dx, b + sy * dy];
  const wrongs = [[a + rr, b + rr], [a + dx + 1, b + sy * dy], [a - sx * dx, b + sy * dy + 1], [rr, rr], [a, b]].filter((p) => (p[0] - a) ** 2 + (p[1] - b) ** 2 !== rr * rr);
  return mc({
    title: 'Punkt na okręgu',
    q: T`Do okręgu o równaniu $${circ(a, b, rr * rr)}$ należy punkt`,
    ok: P(...good),
    bad: wrongs.map((p) => P(...p)),
    steps: [T`Punkt należy do okręgu, gdy jego współrzędne spełniają równanie.`, T`Dla punktu $(${good[0]}, ${good[1]})$: $${par(good[0] - a)}^2 + ${par(good[1] - b)}^2 = ${dx * dx} + ${dy * dy} = ${rr * rr}$ – zgadza się.`],
    trap: T`Środek okręgu $(${a}, ${b})$ NIE leży na okręgu – jest od niego odległy o promień.`,
    tip: TIP_CIRC
  });
};
const circTangentAxis = (r) => {
  const [a, b] = [r.intNot(-8, 8, 0), r.intNot(-8, 8, 0)];
  need(Math.abs(a) !== Math.abs(b));
  const ox = r.bool();
  const rr = ox ? Math.abs(b) : Math.abs(a);
  return mc({
    title: 'Okrąg styczny do osi układu',
    q: T`Okrąg o środku $S = (${a}, ${b})$ jest styczny do osi $${ox ? 'Ox' : 'Oy'}$. Okrąg ten ma równanie`,
    ok: m(circ(a, b, rr * rr)),
    bad: [m(circ(a, b, (ox ? a : b) ** 2)), m(circ(a, b, rr)), m(circ(-a, -b, rr * rr)), m(circ(a, b, a * a + b * b))],
    steps: [T`Odległość środka od osi $${ox ? 'Ox' : 'Oy'}$ to wartość bezwzględna ${ox ? 'drugiej' : 'pierwszej'} współrzędnej: $|${ox ? b : a}| = ${rr}$.`, T`Okrąg styczny do osi ma promień równy tej odległości: $r = ${rr}$, $r^2 = ${rr * rr}$.`, T`Równanie: $${circ(a, b, rr * rr)}$.`],
    trap: T`Odległość od osi $Ox$ mierzy się w pionie (współrzędna $y$), a od osi $Oy$ – w poziomie (współrzędna $x$). Łatwo je zamienić.`,
    tip: 'Odległość punktu $(a, b)$ od osi $Ox$ to $|b|$, a od osi $Oy$ to $|a|$.'
  });
};
const circFromDiameter = (r) => {
  const [x1, y1] = [r.int(-6, 6), r.int(-6, 6)];
  const [dx, dy] = [r.intNot(-4, 4, 0) * 2, r.int(-4, 4) * 2];
  const [x2, y2] = [x1 + dx, y1 + dy];
  const [sx, sy] = [x1 + dx / 2, y1 + dy / 2];
  const r2 = (dx * dx + dy * dy) / 4;
  need(sx !== 0 && sy !== 0);
  return mc({
    title: 'Okrąg o danej średnicy',
    q: T`Odcinek o końcach $A = (${x1}, ${y1})$ i $B = (${x2}, ${y2})$ jest średnicą okręgu. Okrąg ten ma równanie`,
    ok: m(circ(sx, sy, r2)),
    bad: [m(circ(sx, sy, 4 * r2)), m(circ(-sx, -sy, r2)), m(circ(x1, y1, 4 * r2)), m(circ(sx, sy, 2 * r2)), m(circ(-sx, -sy, 4 * r2))],
    steps: [T`Środek okręgu to środek średnicy: $S = (${sx}, ${sy})$.`, T`$r^2 = |SA|^2 = ${par(x1 - sx)}^2 + ${par(y1 - sy)}^2 = ${r2}$.`, T`Równanie: $${circ(sx, sy, r2)}$.`],
    trap: T`Promień to połowa średnicy. $|AB|^2 = ${4 * r2}$ to kwadrat średnicy, a nie promienia.`,
    tip: TIP_CIRC
  });
};

// ---------- 10.5 Symetrie w układzie współrzędnych ----------
const SYM = {
  ox: ['osi $Ox$', (x, y) => [x, -y], 'W symetrii względem osi $Ox$ pierwsza współrzędna zostaje, a druga zmienia znak.'],
  oy: ['osi $Oy$', (x, y) => [-x, y], 'W symetrii względem osi $Oy$ druga współrzędna zostaje, a pierwsza zmienia znak.'],
  o: ['początku układu współrzędnych', (x, y) => [-x, -y], 'W symetrii względem punktu $(0, 0)$ obie współrzędne zmieniają znak.']
};
const symPoint = (r) => {
  const key = r.pick(['ox', 'oy', 'o']);
  const [x, y] = [r.intNot(-9, 9, 0), r.intNot(-9, 9, 0)];
  need(Math.abs(x) !== Math.abs(y));
  const [name, f, why] = SYM[key];
  const img = f(x, y);
  return mc({
    title: 'Obraz punktu w symetrii',
    q: T`Obrazem punktu $A = (${x}, ${y})$ w symetrii względem ${name} jest punkt`,
    ok: P(...img),
    bad: [P(x, -y), P(-x, y), P(-x, -y), P(y, x)].filter((o) => o !== P(...img)),
    steps: [why, T`$A' = (${img[0]}, ${img[1]})$.`],
    trap: T`W symetrii względem osi $Ox$ zmienia się $y$, a względem osi $Oy$ – $x$. Zmienia się ta współrzędna, której nazwy NIE ma w nazwie osi.`,
    tip: 'Symetria względem $Ox$: $(x, -y)$. Względem $Oy$: $(-x, y)$. Względem $(0, 0)$: $(-x, -y)$.'
  });
};
const symCircle = (r) => {
  const key = r.pick(['ox', 'oy', 'o']);
  const [a, b] = [r.intNot(-7, 7, 0), r.intNot(-7, 7, 0)];
  const rr = r.int(2, 6);
  const [name, f] = SYM[key];
  const [a2, b2] = f(a, b);
  return mc({
    title: 'Obraz okręgu w symetrii',
    q: T`Obrazem okręgu o równaniu $${circ(a, b, rr * rr)}$ w symetrii względem ${name} jest okrąg o równaniu`,
    ok: m(circ(a2, b2, rr * rr)),
    bad: [m(circ(a, -b, rr * rr)), m(circ(-a, b, rr * rr)), m(circ(-a, -b, rr * rr)), m(circ(b, a, rr * rr))].filter((o) => o !== m(circ(a2, b2, rr * rr))),
    steps: [T`Środek okręgu: $S = (${a}, ${b})$, promień $r = ${rr}$.`, T`Obraz środka w symetrii względem ${name}: $S' = (${a2}, ${b2})$. Promień się nie zmienia.`, T`Równanie obrazu: $${circ(a2, b2, rr * rr)}$.`],
    trap: T`Symetria nie zmienia wielkości figury – promień zostaje ten sam. Przekształcamy tylko środek.`,
    tip: 'Obraz okręgu w symetrii to okrąg o tym samym promieniu i środku będącym obrazem środka.'
  });
};
const symParams = (r) => {
  const key = r.pick(['ox', 'oy', 'o']);
  const [x, y] = [r.intNot(-8, 8, 0), r.intNot(-8, 8, 0)];
  const [name, f] = SYM[key];
  const [x2, y2] = f(x, y);
  const [c, d] = [r.intNot(-5, 5, 0), r.intNot(-5, 5, 0)];
  // A = (x, y), B = (a + c, b + d)
  const [a, b] = [x2 - c, y2 - d];
  return mc({
    title: 'Punkty symetryczne z parametrami',
    q: T`Punkty $A = (${x}, ${y})$ oraz $B = (a ${c > 0 ? '+' : '-'} ${Math.abs(c)}, b ${d > 0 ? '+' : '-'} ${Math.abs(d)})$ są symetryczne względem ${name}. Wynika stąd, że`,
    ok: `$a = ${a}$ i $b = ${b}$`,
    bad: [`$a = ${x - c}$ i $b = ${y - d}$`, `$a = ${-x - c}$ i $b = ${y - d}$`, `$a = ${x - c}$ i $b = ${-y - d}$`, `$a = ${-x - c}$ i $b = ${-y - d}$`, `$a = ${x2 + c}$ i $b = ${y2 + d}$`].filter((o) => o !== `$a = ${a}$ i $b = ${b}$`),
    steps: [T`Obraz punktu $A$ w symetrii względem ${name} to $(${x2}, ${y2})$ – i to musi być punkt $B$.`, T`$a ${c > 0 ? '+' : '-'} ${Math.abs(c)} = ${x2}$, więc $a = ${a}$; $b ${d > 0 ? '+' : '-'} ${Math.abs(d)} = ${y2}$, więc $b = ${b}$.`],
    trap: T`Najpierw wyznacz obraz punktu $A$, dopiero potem przyrównaj współrzędne. Każda współrzędna daje osobne równanie.`,
    tip: 'Symetria względem $Ox$: $(x, -y)$. Względem $Oy$: $(-x, y)$. Względem $(0, 0)$: $(-x, -y)$.'
  });
};
const symDistance = (r) => {
  const key = r.pick(['ox', 'oy', 'o']);
  const [x, y] = key === 'o' ? r.pick([[3, 4], [4, 3], [6, 8], [5, 12], [8, 15], [1, 2], [2, 3]]).map((v) => v * r.pick([1, -1])) : [r.intNot(-9, 9, 0), r.intNot(-9, 9, 0)];
  need(Math.abs(x) !== Math.abs(y));
  const [name, f] = SYM[key];
  const [x2, y2] = f(x, y);
  const d2 = (x - x2) ** 2 + (y - y2) ** 2;
  return mc({
    title: 'Odległość punktu od jego obrazu',
    q: T`Punkt $A'$ jest obrazem punktu $A = (${x}, ${y})$ w symetrii względem ${name}. Długość odcinka $AA'$ jest równa`,
    ok: m(sq(d2)),
    val: Math.sqrt(d2),
    bad: [m(`${Math.abs(key === 'ox' ? y : x)}`), m(`${2 * Math.abs(key === 'ox' ? x : y)}`), m(sq(x * x + y * y)), m(`${2 * (Math.abs(x) + Math.abs(y))}`), m(`${Math.abs(x) + Math.abs(y)}`)],
    steps: [T`$A' = (${x2}, ${y2})$.`, key === 'o' ? T`$|AA'| = \sqrt{${par(x - x2)}^2 + ${par(y - y2)}^2} = \sqrt{${d2}} = ${sq(d2)}$ – dwa razy więcej niż odległość $A$ od początku układu.` : T`Punkty różnią się tylko ${key === 'ox' ? 'drugą' : 'pierwszą'} współrzędną, więc $|AA'| = |${key === 'ox' ? y : x} - ${par(key === 'ox' ? y2 : x2)}| = ${sq(d2)}$.`],
    trap: T`Punkt i jego obraz leżą po obu stronach osi (lub środka) symetrii, więc odległość między nimi to DWA razy odległość punktu od tej osi.`,
    tip: 'Odległość punktu od jego obrazu w symetrii to podwojona odległość punktu od osi (środka) symetrii.'
  });
};
const symPolygon = (r) => {
  const key = r.pick(['ox', 'oy', 'o']);
  const [x1, y1] = [r.int(1, 6), r.int(1, 6)];
  const [w, h] = [r.int(2, 6), r.int(2, 6)];
  const [name, f] = SYM[key];
  const C = [x1 + w, y1 + h];
  const img = f(...C);
  const kind = r.bool();
  if (kind)
    return mc({
      title: 'Obraz wielokąta w symetrii',
      q: T`Prostokąt $ABCD$ ma wierzchołki $A = (${x1}, ${y1})$, $B = (${x1 + w}, ${y1})$, $C = (${C[0]}, ${C[1]})$, $D = (${x1}, ${y1 + h})$. Obrazem wierzchołka $C$ w symetrii względem ${name} jest punkt`,
      ok: P(...img),
      bad: [P(C[0], -C[1]), P(-C[0], C[1]), P(-C[0], -C[1]), P(C[1], C[0]), P(-x1, -y1)].filter((o) => o !== P(...img)),
      steps: [T`$C = (${C[0]}, ${C[1]})$.`, SYM[key][2] + T` Zatem $C' = (${img[0]}, ${img[1]})$.`],
      trap: T`Każdy wierzchołek przekształcamy osobno, według tej samej reguły zmiany znaków.`,
      tip: 'Obraz wielokąta w symetrii wyznaczasz, przekształcając kolejno jego wierzchołki.'
    });
  return mc({
    title: 'Pole obrazu figury w symetrii',
    q: T`Prostokąt $ABCD$ ma wierzchołki $A = (${x1}, ${y1})$, $B = (${x1 + w}, ${y1})$, $C = (${C[0]}, ${C[1]})$, $D = (${x1}, ${y1 + h})$. Pole prostokąta będącego obrazem prostokąta $ABCD$ w symetrii względem ${name} jest równe`,
    ok: m(w * h),
    val: w * h,
    bad: [m(2 * w * h), m(2 * (w + h)), m(C[0] * C[1] === w * h ? w * h + 4 : C[0] * C[1]), m(4 * w * h), m(w + h)],
    steps: [T`Boki prostokąta $ABCD$: $|AB| = ${w}$, $|AD| = ${h}$, więc pole to $${w * h}$.`, T`Symetria nie zmienia długości odcinków ani pól, więc obraz ma takie samo pole: $${w * h}$.`],
    trap: T`Symetria zmienia położenie figury, ale nie jej wymiary. Pole i obwód obrazu są takie same jak figury wyjściowej.`,
    tip: 'Symetria osiowa i środkowa to przekształcenia zachowujące długości, kąty i pola.'
  });
};

export default {
  numericId: 10,
  title: 'Geometria analityczna',
  short_title: 'Geometria analityczna',
  description: 'Odległość punktów i środek odcinka, równanie prostej, proste równoległe i prostopadłe, równanie okręgu oraz symetrie.',
  icon: 'Crosshair',
  color: '#60A5FA',
  matura_points_range: '4–6 pkt',
  importance: 'CRITICAL_PEWNIAK',
  cke_formula_page: 'str. 21–23',
  lessons: [
    {
      title: 'Odległość dwóch punktów i środek odcinka',
      short_title: 'Odległość i środek',
      pill: pill({
        essence: T`W układzie współrzędnych długość odcinka o końcach $A = (x_A, y_A)$ i $B = (x_B, y_B)$ liczysz wzorem $|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$ – to twierdzenie Pitagorasa dla „poziomej” i „pionowej” różnicy współrzędnych. Środek odcinka ma współrzędne równe średnim arytmetycznym współrzędnych końców. Te dwa wzory wystarczą do obliczenia obwodów, pól i promieni w zadaniach z figurami na płaszczyźnie.`,
        context: 'Zadania 24–27 w arkuszu • 1 pkt oraz element zadań otwartych za 2–4 pkt.',
        pl: T`Długość odcinka to przeciwprostokątna trójkąta, którego przyprostokątne to „ile w poziomie” i „ile w pionie”. Do długości ODEJMUJESZ współrzędne. Do środka je DODAJESZ i dzielisz przez dwa – jak przy średniej ocen.`,
        steps: [
          ['Wypisz współrzędne', T`$A = (-1, 2)$, $B = (5, 10)$.`, 'Uważaj na znaki.'],
          ['Długość: odejmij, podnieś do kwadratu, dodaj, spierwiastkuj', T`$|AB| = \sqrt{6^2 + 8^2} = \sqrt{100} = 10$.`, T`$5 - (-1) = 6$`],
          ['Środek: dodaj i podziel przez 2', T`$S = \left(\frac{-1 + 5}{2}, \frac{2 + 10}{2}\right) = (2, 6)$.`, 'Średnia arytmetyczna.']
        ],
        formulas: [
          ['Długość odcinka', T`|AB| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`, 21],
          ['Środek odcinka', T`S = \left(\frac{x_A + x_B}{2}, \frac{y_A + y_B}{2}\right)`, 21]
        ],
        examples: [
          ['Drugi koniec odcinka', '1 pkt', T`Punkt $S = (1, -2)$ jest środkiem odcinka $AB$, gdzie $A = (-3, 4)$. Wyznacz $B$.`, T`1. $\frac{-3 + x_B}{2} = 1$, więc $x_B = 5$.` + '\n' + T`2. $\frac{4 + y_B}{2} = -2$, więc $y_B = -8$.` + '\n' + T`3. $B = (5, -8)$.`, 'B = 2S − A dla każdej współrzędnej.'],
          ['Pole kwadratu', '1 pkt', T`Punkty $A = (1, 2)$ i $C = (5, 6)$ są przeciwległymi wierzchołkami kwadratu. Oblicz jego pole.`, T`1. $|AC|^2 = 4^2 + 4^2 = 32$.` + '\n' + T`2. $P = \frac{d^2}{2} = 16$.`, 'Pole kwadratu z przekątnej nie wymaga pierwiastkowania.']
        ],
        trap: T`Odejmowanie liczby ujemnej to dodawanie: $5 - (-3) = 8$, a nie $2$. To najczęstszy błąd rachunkowy w geometrii analitycznej.`,
        fail: T`$A = (-3, 1)$, $B = (5, 7)$: „$x_B - x_A = 5 - 3 = 2$”.`,
        win: T`$x_B - x_A = 5 - (-3) = 8$.`,
        why: 'Na osi liczbowej od −3 do 5 jest 8 jednostek – 3 do zera i jeszcze 5.',
        ckeTip: 'Oba wzory są w karcie wzorów na str. 21. Zawsze zapisuj ujemne współrzędne w nawiasach.',
        points: [T`Długość: różnice współrzędnych i twierdzenie Pitagorasa.`, T`Środek: średnie arytmetyczne współrzędnych.`, T`$B = (2x_S - x_A, 2y_S - y_A)$, gdy znasz środek i jeden koniec.`]
      }),
      gens: [midPoint, segLength, segOtherEnd, segOriginDistance, segSquareFromDiagonal]
    },
    {
      title: 'Równanie prostej: postać kierunkowa i ogólna',
      short_title: 'Równanie prostej',
      pill: pill({
        essence: T`Prostą na płaszczyźnie opisuje równanie kierunkowe $y = ax + b$, w którym $a$ to współczynnik kierunkowy (nachylenie), a $b$ – punkt przecięcia z osią $Oy$. Równanie prostej przez dwa punkty wyznaczasz w dwóch krokach: $a = \frac{y_2 - y_1}{x_2 - x_1}$, a potem $b$ z podstawienia jednego punktu. Postać ogólna $Ax + By + C = 0$ to to samo równanie zapisane inaczej – wystarczy wyznaczyć $y$.`,
        context: 'Zadania 24–27 w arkuszu • 1–2 pkt. Równanie prostej jest w każdym arkuszu.',
        pl: T`Punkt leży na prostej wtedy i tylko wtedy, gdy jego współrzędne „pasują” do równania – wstawiasz $x$ i $y$ i wychodzi prawda. To jedno zdanie rozwiązuje większość zadań: szukasz $b$? Wstaw punkt. Szukasz brakującej współrzędnej? Wstaw tę, którą znasz.`,
        steps: [
          ['Policz współczynnik kierunkowy', T`$A = (1, 3)$, $B = (3, 7)$: $a = \frac{7 - 3}{3 - 1} = 2$.`, 'Różnica y przez różnicę x.'],
          ['Wyznacz b', T`$3 = 2 \cdot 1 + b$, więc $b = 1$.`, 'Podstaw dowolny z punktów.'],
          ['Zapisz równanie i sprawdź', T`$y = 2x + 1$. Kontrola: $2 \cdot 3 + 1 = 7$.`, 'Drugi punkt służy do sprawdzenia.']
        ],
        formulas: [
          ['Postać kierunkowa', T`y = ax + b`, 21],
          ['Współczynnik kierunkowy', T`a = \frac{y_2 - y_1}{x_2 - x_1}`, 21],
          ['Postać ogólna', T`Ax + By + C = 0`, 22]
        ],
        examples: [
          ['Postać ogólna', '1 pkt', T`Wyznacz współczynnik kierunkowy prostej $3x - 2y + 4 = 0$.`, T`1. $-2y = -3x - 4$.` + '\n' + T`2. $y = \frac{3}{2}x + 2$.` + '\n' + T`3. $a = \frac{3}{2}$.`, 'Z postaci ogólnej trzeba wyznaczyć y.'],
          ['Trójkąt z osiami', '2 pkt', T`Oblicz pole trójkąta ograniczonego prostą $y = -2x + 6$ i osiami układu.`, T`1. Oś $Oy$: $(0, 6)$. Oś $Ox$: $-2x + 6 = 0$, czyli $(3, 0)$.` + '\n' + T`2. $P = \frac{1}{2} \cdot 3 \cdot 6 = 9$.`, 'Trójkąt prostokątny o przyprostokątnych na osiach.']
        ],
        trap: T`W postaci ogólnej $Ax + By + C = 0$ współczynnik kierunkowy to NIE jest liczba stojąca przy $x$. Trzeba najpierw wyznaczyć $y$.`,
        fail: T`„Prosta $3x - 2y + 4 = 0$ ma współczynnik kierunkowy $3$.”`,
        win: T`$y = \frac{3}{2}x + 2$, więc $a = \frac{3}{2}$.`,
        why: 'Współczynnik kierunkowy to liczba przy x dopiero wtedy, gdy po lewej stronie stoi samo y.',
        ckeTip: 'Po wyznaczeniu równania prostej podstaw drugi punkt – to 10 sekund, a daje pewność wyniku.',
        points: [T`$a = \frac{y_2 - y_1}{x_2 - x_1}$, potem $b$ z punktu.`, T`Punkt leży na prostej, gdy spełnia jej równanie.`, T`Z postaci ogólnej wyznacz $y$, żeby odczytać $a$ i $b$.`]
      }),
      gens: [lineTwoPoints, linePointParam, lineSlopeThroughPoint, lineGeneralForm, lineAxisPoints]
    },
    {
      title: 'Wzajemne położenie prostych i proste równoległe',
      short_title: 'Położenie prostych',
      pill: pill({
        essence: T`Wzajemne położenie dwóch prostych rozpoznajesz po współczynnikach kierunkowych. Ten sam współczynnik i różne wyrazy wolne – proste równoległe, bez punktu wspólnego. Te same równania po uproszczeniu – proste się pokrywają. Różne współczynniki – proste przecinają się w jednym punkcie, który wyznaczasz z układu ich równań.`,
        context: 'Zadania zamknięte za 1 pkt oraz otwarte za 2 pkt (punkt wspólny prostych, prosta równoległa przez punkt).',
        pl: T`Równoległe – to samo nachylenie, jak dwa tory kolejowe. Różne nachylenie – drogi kiedyś się skrzyżują. Skrzyżowanie to punkt, który leży na obu prostych naraz, więc spełnia oba równania.`,
        steps: [
          ['Sprowadź do postaci kierunkowej', T`$2y = 6x - 4$ to $y = 3x - 2$.`, 'Dopiero wtedy porównuj.'],
          ['Porównaj współczynniki', T`$y = 3x - 2$ i $y = 3x + 5$: $a_1 = a_2$, $b_1 \neq b_2$ – równoległe.`, 'Liczba przy x decyduje.'],
          ['Punkt wspólny z układu', T`$y = 2x + 1$ i $y = -x + 7$: $2x + 1 = -x + 7$, $x = 2$, $y = 5$.`, 'Sprawdź w obu równaniach.']
        ],
        formulas: [
          ['Proste równoległe', T`a_1 = a_2`, 22],
          ['Punkt wspólny prostych', T`a_1x + b_1 = a_2x + b_2`]
        ],
        examples: [
          ['Parametr', '1 pkt', T`Proste $y = (2m - 1)x + 3$ i $y = 5x - 2$ są równoległe. Oblicz $m$.`, T`1. $2m - 1 = 5$.` + '\n' + T`2. $m = 3$.`, 'Przyrównaj całe współczynniki przy x.'],
          ['Punkt wspólny', '2 pkt', T`Wyznacz punkt wspólny prostych $y = 2x - 3$ i $y = -x + 6$.`, T`1. $2x - 3 = -x + 6$, więc $3x = 9$, $x = 3$.` + '\n' + T`2. $y = 2 \cdot 3 - 3 = 3$. Punkt: $(3, 3)$.` + '\n' + T`3. Sprawdzenie: $-3 + 6 = 3$.`, 'Układ równań, a potem sprawdzenie.']
        ],
        trap: T`Prosta równoległa do $y = 2x + 1$ ma współczynnik $2$, a NIE $-2$ ani $\frac{1}{2}$ – zmiana znaku czy odwrócenie daje prostą, która przecina wyjściową.`,
        fail: T`„Równoległa do $y = 2x + 1$ to $y = -2x + 1$.”`,
        win: T`Równoległa: $y = 2x + b$, gdzie $b \neq 1$, np. $y = 2x - 4$.`,
        why: 'Proste y = 2x i y = −2x mają różne nachylenie, więc przecinają się w punkcie (0, 0).',
        ckeTip: 'Warunek równoległości jest w karcie wzorów na str. 22. Punkt wspólny zawsze sprawdź w drugim równaniu.',
        points: [T`Równoległe: $a_1 = a_2$, $b_1 \neq b_2$.`, T`Pokrywają się: te same równania po uproszczeniu.`, T`Punkt wspólny: rozwiąż układ równań.`]
      }),
      gens: [parSlope, parParam, parThroughPoint, crossPoint, linesPosition]
    },
    {
      title: 'Równanie okręgu',
      short_title: 'Równanie okręgu',
      pill: pill({
        essence: T`Okrąg o środku $S = (a, b)$ i promieniu $r$ to zbiór punktów odległych od $S$ dokładnie o $r$. Jego równanie to $(x - a)^2 + (y - b)^2 = r^2$. Z równania odczytujesz środek (znaki przeciwne do tych w nawiasach) i promień (pierwiastek z prawej strony). W drugą stronę: znając środek i jeden punkt okręgu, liczysz $r^2$ jako kwadrat odległości tych punktów.`,
        context: 'Zadania 25–28 w arkuszu • 1 pkt. Równanie okręgu jest w większości arkuszy.',
        pl: T`Równanie okręgu to po prostu wzór na odległość, tylko podniesiony do kwadratu: „odległość punktu $(x, y)$ od środka do kwadratu równa się promień do kwadratu”. Dlatego po prawej stronie stoi $r^2$, a nie $r$.`,
        steps: [
          ['Odczytaj środek', T`$(x - 2)^2 + (y + 3)^2 = 16$: $S = (2, -3)$.`, 'Znaki przeciwne do tych w nawiasach.'],
          ['Odczytaj promień', T`$r^2 = 16$, więc $r = 4$.`, 'Pierwiastek z prawej strony.'],
          ['Albo zbuduj równanie', T`$S = (1, 2)$, punkt $(4, 6)$ na okręgu: $r^2 = 3^2 + 4^2 = 25$, czyli $(x - 1)^2 + (y - 2)^2 = 25$.`, 'r² bez pierwiastkowania.']
        ],
        formulas: [
          ['Równanie okręgu', T`(x - a)^2 + (y - b)^2 = r^2`, 23],
          ['Środek i promień', T`S = (a, b), \quad r > 0`, 23],
          ['Styczność do osi', T`\text{do } Ox: \ r = |b| \qquad \text{do } Oy: \ r = |a|`]
        ],
        examples: [
          ['Okrąg o danej średnicy', '2 pkt', T`Odcinek o końcach $A = (-1, 2)$, $B = (5, 10)$ jest średnicą okręgu. Zapisz równanie okręgu.`, T`1. Środek: $S = (2, 6)$.` + '\n' + T`2. $r^2 = |SA|^2 = 3^2 + 4^2 = 25$.` + '\n' + T`3. $(x - 2)^2 + (y - 6)^2 = 25$.`, 'Promień to połowa średnicy.'],
          ['Styczność', '1 pkt', T`Okrąg o środku $S = (3, -4)$ jest styczny do osi $Ox$. Podaj jego promień.`, T`1. Odległość środka od osi $Ox$ to $|-4| = 4$.` + '\n' + T`2. $r = 4$.`, 'Od osi Ox mierzymy w pionie.']
        ],
        trap: T`Po prawej stronie równania stoi $r^2$. Jeśli widzisz $25$, promień to $5$, a nie $25$.`,
        fail: T`„$(x - 1)^2 + (y - 2)^2 = 9$: środek $(-1, -2)$, promień $9$.”`,
        win: T`Środek $(1, 2)$, promień $3$.`,
        why: 'Równanie powstaje z podniesienia odległości do kwadratu – stąd r², a minus w nawiasie oznacza dodatnią współrzędną środka.',
        ckeTip: 'Równanie okręgu jest w karcie wzorów na str. 23. Punkt leży na okręgu, gdy po podstawieniu wychodzi równość.',
        points: [T`Środek: znaki przeciwne do tych w nawiasach.`, T`Prawa strona to $r^2$.`, T`Punkt należy do okręgu, gdy spełnia równanie.`]
      }),
      gens: [circCenterRadius, circFromCenterPoint, circPointPosition, circTangentAxis, circFromDiameter]
    },
    {
      title: 'Symetrie w układzie współrzędnych',
      short_title: 'Symetrie',
      pill: pill({
        essence: T`W układzie współrzędnych trzy symetrie mają bardzo proste wzory. Symetria względem osi $Ox$ zmienia znak drugiej współrzędnej: $(x, y) \to (x, -y)$. Symetria względem osi $Oy$ zmienia znak pierwszej: $(x, y) \to (-x, y)$. Symetria środkowa względem początku układu zmienia znaki obu: $(x, y) \to (-x, -y)$. Obraz wielokąta wyznaczasz wierzchołek po wierzchołku, a obraz okręgu – przekształcając środek (promień się nie zmienia).`,
        context: 'Zadanie 25–28 w arkuszu • 1 pkt.',
        pl: T`Oś $Ox$ działa jak tafla wody: to, co było $3$ nad nią, odbija się $3$ pod nią – zmienia się wysokość, czyli $y$. Oś $Oy$ to lustro w przedpokoju: lewa strona zamienia się z prawą – zmienia się $x$. Symetria względem punktu $(0, 0)$ to obrót o pół obrotu: zmienia się wszystko.`,
        steps: [
          ['Ustal rodzaj symetrii', T`Względem $Ox$, $Oy$ czy punktu $(0, 0)$?`, 'To decyduje, która współrzędna zmienia znak.'],
          ['Zmień odpowiednie znaki', T`$A = (3, -5)$ względem $Oy$: $A' = (-3, -5)$.`, 'Względem Oy zmienia się x.'],
          ['Dla figury – przekształć punkty charakterystyczne', T`Okrąg: środek. Wielokąt: wierzchołki.`, 'Rozmiary figury się nie zmieniają.']
        ],
        formulas: [
          ['Symetria względem osi Ox', T`(x, y) \to (x, -y)`],
          ['Symetria względem osi Oy', T`(x, y) \to (-x, y)`],
          ['Symetria względem punktu (0, 0)', T`(x, y) \to (-x, -y)`]
        ],
        examples: [
          ['Obraz okręgu', '1 pkt', T`Wyznacz obraz okręgu $(x - 2)^2 + (y + 5)^2 = 9$ w symetrii względem osi $Ox$.`, T`1. Środek: $(2, -5)$, promień $3$.` + '\n' + T`2. Obraz środka: $(2, 5)$.` + '\n' + T`3. $(x - 2)^2 + (y - 5)^2 = 9$.`, 'Promień bez zmian.'],
          ['Parametry', '1 pkt', T`Punkty $A = (4, -1)$ i $B = (a, b)$ są symetryczne względem początku układu. Podaj $a$ i $b$.`, T`1. Zmieniamy oba znaki.` + '\n' + T`2. $a = -4$, $b = 1$.`, 'Symetria środkowa – oba znaki.']
        ],
        trap: T`Symetria względem osi $Ox$ zmienia $y$, a NIE $x$. Nazwa osi mówi, która współrzędna ZOSTAJE.`,
        fail: T`„Obraz punktu $(3, 5)$ w symetrii względem osi $Ox$ to $(-3, 5)$.”`,
        win: T`$(3, -5)$ – punkt przeskakuje na drugą stronę osi poziomej.`,
        why: 'Punkty na osi Ox się nie ruszają, a pozostałe odbijają się w pionie – zmienia się więc wysokość, czyli y.',
        ckeTip: 'Narysuj szybki szkic układu z zaznaczonym punktem i jego odbiciem – błąd znaku widać od razu.',
        points: [T`$Ox$: zmienia się $y$. $Oy$: zmienia się $x$.`, T`Punkt $(0, 0)$: zmieniają się oba znaki.`, T`Symetria zachowuje długości, kąty i pola.`]
      }),
      gens: [symPoint, symCircle, symParams, symDistance, symPolygon]
    }
  ]
};

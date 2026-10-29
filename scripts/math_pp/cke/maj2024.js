// Egzamin maturalny z matematyki, poziom podstawowy, Formuła 2023 – 8 maja 2024 r. (arkusz MMAP-P0-100-2405).
// Transkrypcja z arkusza CKE; klucz odpowiedzi: wersja A. Rozwiązania krok po kroku – opracowanie JASNE.
import { bars, geo, lines, panels, parabola, polyline } from './fig.js';

const T = String.raw;
const SC = 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.\n\n';
const nl = (intervals) => ({ min: -5, max: 7, ticks: [-2, 4], intervals });

const STEM14 = T`W kartezjańskim układzie współrzędnych $(x, y)$ przedstawiono fragment paraboli, która jest wykresem funkcji kwadratowej $f$ (zobacz rysunek). Wierzchołek tej paraboli oraz punkty przecięcia paraboli z osiami układu współrzędnych mają obie współrzędne całkowite.`;
const FIG14 = { plot: parabola(-1, 1, 9, [-7, 7], [-6, 10]) };
const STEM25 = T`Wysokość graniastosłupa prawidłowego sześciokątnego jest równa $6$. Pole podstawy tego graniastosłupa jest równe $15\sqrt{3}$.`;

// Zadanie 25.2: graniastosłup prawidłowy sześciokątny z zaznaczonym kątem (rysunki odpowiedzi A–D)
const PRISM = { A: [1, 0, ''], B: [3, 0, ''], C: [4, 0.9, ''], D: [3, 1.8, ''], E: [1, 1.8, ''], F: [0, 0.9, ''] };
const TOP = Object.fromEntries(Object.entries(PRISM).map(([k, v]) => [k.toLowerCase(), [v[0], v[1] + 3.2, '']]));
const prism = (vertex, far, base) =>
  geo({
    pts: { ...PRISM, ...TOP },
    segs: ['AB', 'BC', 'FA', 'Aa', 'Bb', 'Cc', 'Ff', 'ab', 'bc', 'cd', 'de', 'ef', 'fa'],
    dashed: ['CD', 'DE', 'EF', 'Dd', 'Ee'],
    accent: [[vertex, far.toLowerCase()], [vertex, base]],
    height: 620
  });

export default {
  examId: 'matura-maj-2024',
  examName: 'Matura Maj 2024 (Formuła 2023)',
  sourceLabel: 'Matura Maj 2024',
  refLabel: 'Matura maj 2024',
  year: 2024,
  session: 'Maj',
  totalPoints: 46,
  tasks: [
    {
      n: '1', pts: 1, t: 1, k: 'SC',
      q: T`Dana jest nierówność` + '\n$$|x - 1| \\ge 3$$\n' + T`Na którym rysunku poprawnie zaznaczono na osi liczbowej zbiór wszystkich liczb rzeczywistych spełniających powyższą nierówność? Wybierz właściwą odpowiedź spośród podanych.`,
      o: [T`$\langle -2, 4 \rangle$`, T`$(-\infty, -2 \rangle \cup \langle 4, +\infty)$`, T`$(-2, 4)$`, T`$(-\infty, -2) \cup (4, +\infty)$`],
      optNL: [
        nl([{ from: -2, to: 4, fromIncluded: true, toIncluded: true }]),
        nl([{ from: null, to: -2, toIncluded: true }, { from: 4, to: null, fromIncluded: true }]),
        nl([{ from: -2, to: 4, fromIncluded: false, toIncluded: false }]),
        nl([{ from: null, to: -2, toIncluded: false }, { from: 4, to: null, fromIncluded: false }])
      ],
      a: 'B',
      s: [
        T`$|x - 1|$ to odległość liczby $x$ od liczby $1$ na osi liczbowej. Szukamy liczb odległych od $1$ o co najmniej $3$.`,
        T`Odkładamy $3$ w lewo i w prawo od $1$: $1 - 3 = -2$ oraz $1 + 3 = 4$. Warunek spełniają liczby $x \le -2$ lub $x \ge 4$.`,
        T`Nierówność jest nieostra ($\ge$), więc końce $-2$ i $4$ należą do zbioru – kółka są zamalowane.`
      ],
      trap: T`Znak $\ge$ przy wartości bezwzględnej oznacza „na zewnątrz” (dwa promienie), a nie odcinek między $-2$ i $4$. Odcinek byłby rozwiązaniem nierówności $|x - 1| \le 3$.`
    },
    {
      n: '2', pts: 1, t: 1, k: 'SC',
      q: SC + T`Liczba $\left(\frac{1}{16}\right)^{8} \cdot 8^{16}$ jest równa`,
      o: [T`$2^{24}$`, T`$2^{16}$`, T`$2^{12}$`, T`$2^{8}$`],
      a: 'B',
      s: [
        T`Sprowadzamy obie potęgi do podstawy $2$: $\frac{1}{16} = 2^{-4}$ oraz $8 = 2^{3}$.`,
        T`$\left(2^{-4}\right)^{8} = 2^{-32}$ oraz $\left(2^{3}\right)^{16} = 2^{48}$.`,
        T`$2^{-32} \cdot 2^{48} = 2^{-32 + 48} = 2^{16}$.`
      ],
      trap: T`Przy potęgowaniu potęgi wykładniki się mnoży ($-4 \cdot 8$ i $3 \cdot 16$), a dopiero przy mnożeniu potęg o tej samej podstawie – dodaje.`
    },
    {
      n: '3', pts: 2, t: 2, k: 'PROOF',
      q: T`Wykaż, że dla każdej liczby naturalnej $n \ge 1$ liczba $n^2 + (n + 1)^2 + (n + 2)^2$ przy dzieleniu przez $3$ daje resztę $2$.`,
      a: T`$n^2 + (n + 1)^2 + (n + 2)^2 = 3(n^2 + 2n + 1) + 2$, a liczba $n^2 + 2n + 1$ jest całkowita, więc reszta z dzielenia przez $3$ jest równa $2$.`,
      s: [
        T`Rozwijamy kwadraty: $n^2 + (n^2 + 2n + 1) + (n^2 + 4n + 4) = 3n^2 + 6n + 5$.`,
        T`Wyłączamy trójkę tak, by została reszta mniejsza od $3$: $3n^2 + 6n + 5 = 3n^2 + 6n + 3 + 2 = 3(n^2 + 2n + 1) + 2$.`,
        T`Liczba $k = n^2 + 2n + 1$ jest całkowita, więc dana liczba ma postać $3k + 2$, czyli przy dzieleniu przez $3$ daje resztę $2$.`
      ],
      trap: T`Sprawdzenie kilku wartości $n$ to nie dowód. Trzeba zapisać liczbę w postaci $3k + 2$ i dopisać, że $k$ jest liczbą całkowitą.`
    },
    {
      n: '4', pts: 1, t: 1, k: 'SC',
      q: SC + T`Liczba $\log_{\sqrt{3}} 9$ jest równa`,
      o: ['$2$', '$3$', '$4$', '$9$'],
      a: 'C',
      s: [
        T`Szukamy wykładnika $x$, dla którego $\left(\sqrt{3}\right)^{x} = 9$.`,
        T`$\sqrt{3} = 3^{\frac{1}{2}}$ oraz $9 = 3^{2}$, więc $3^{\frac{x}{2}} = 3^{2}$.`,
        T`$\frac{x}{2} = 2$, czyli $x = 4$.`
      ],
      trap: T`Podstawą logarytmu jest $\sqrt{3}$, a nie $3$. Odpowiedź $2$ to wartość $\log_{3} 9$.`
    },
    {
      n: '5', pts: 1, t: 2, k: 'SC',
      q: SC + T`Dla każdej liczby rzeczywistej $a$ i dla każdej liczby rzeczywistej $b$ wartość wyrażenia $(2a + b)^2 - (2a - b)^2$ jest równa wartości wyrażenia`,
      o: [T`$8a^2$`, T`$8ab$`, T`$-8ab$`, T`$2b^2$`],
      a: 'B',
      s: [
        T`$(2a + b)^2 = 4a^2 + 4ab + b^2$ oraz $(2a - b)^2 = 4a^2 - 4ab + b^2$.`,
        T`Odejmujemy, zmieniając znaki w drugim nawiasie: $4a^2 + 4ab + b^2 - 4a^2 + 4ab - b^2 = 8ab$.`
      ],
      trap: T`Minus przed nawiasem zmienia znak KAŻDEGO składnika: $-(-4ab) = +4ab$. Stąd wynik $8ab$, a nie $0$.`
    },
    {
      n: '6', pts: 1, t: 3, k: 'SC',
      q: SC + T`Zbiorem wszystkich rozwiązań nierówności` + '\n$$1 - \\frac{3}{2}x < \\frac{2}{3} - x$$\n' + T`jest przedział`,
      o: [T`$\left(-\infty, -\frac{2}{3}\right)$`, T`$\left(-\infty, \frac{2}{3}\right)$`, T`$\left(-\frac{2}{3}, +\infty\right)$`, T`$\left(\frac{2}{3}, +\infty\right)$`],
      a: 'D',
      s: [
        T`Mnożymy obie strony przez $6$ (liczba dodatnia – znak nierówności zostaje): $6 - 9x < 4 - 6x$.`,
        T`Przenosimy wyrazy: $-9x + 6x < 4 - 6$, czyli $-3x < -2$.`,
        T`Dzielimy przez $-3$ i odwracamy znak nierówności: $x > \frac{2}{3}$.`
      ],
      trap: T`Dzielenie przez liczbę ujemną odwraca znak nierówności. Kto o tym zapomni, wybierze przedział $\left(-\infty, \frac{2}{3}\right)$.`
    },
    {
      n: '7', pts: 1, t: 3, k: 'SC',
      q: SC + T`Równanie $\frac{x + 1}{(x + 2)(x - 3)} = 0$ w zbiorze liczb rzeczywistych`,
      o: [T`nie ma rozwiązania.`, T`ma dokładnie jedno rozwiązanie: $(-1)$.`, T`ma dokładnie dwa rozwiązania: $(-2)$ oraz $3$.`, T`ma dokładnie trzy rozwiązania: $(-1)$, $(-2)$ oraz $3$.`],
      a: 'B',
      s: [
        T`Dziedzina: mianownik musi być różny od zera, więc $x \ne -2$ i $x \ne 3$.`,
        T`Ułamek jest równy zero, gdy licznik jest równy zero: $x + 1 = 0$, czyli $x = -1$.`,
        T`Liczba $-1$ należy do dziedziny, więc jest jedynym rozwiązaniem.`
      ],
      trap: T`Liczby $-2$ i $3$ zerują MIANOWNIK – to nie rozwiązania, tylko liczby wykluczone z dziedziny.`
    },
    {
      n: '8', pts: 1, t: 2, k: 'PF',
      q: T`Dany jest wielomian $W(x) = 3x^3 + 6x^2 + 9x$.`,
      st: [T`Wielomian $W$ jest iloczynem wielomianów $F(x) = 3x$ i $G(x) = x^2 + 2x + 3$.`, T`Liczba $(-1)$ jest rozwiązaniem równania $W(x) = 0$.`],
      a: 'PF',
      s: [
        T`Stwierdzenie 1: $3x \cdot (x^2 + 2x + 3) = 3x^3 + 6x^2 + 9x = W(x)$ – prawda.`,
        T`Stwierdzenie 2: $W(-1) = 3 \cdot (-1) + 6 \cdot 1 + 9 \cdot (-1) = -3 + 6 - 9 = -6 \ne 0$ – fałsz.`
      ],
      trap: T`$(-1)^3 = -1$, ale $(-1)^2 = 1$. Pomyłka w znaku potęgi liczby ujemnej to najczęstsza przyczyna błędu w drugim stwierdzeniu.`
    },
    {
      n: '9', pts: 3, t: 3, k: 'OPEN',
      q: T`Rozwiąż równanie` + '\n$$x^3 - 2x^2 - 3x + 6 = 0$$\n' + T`Zapisz obliczenia.`,
      a: T`$x = 2$ lub $x = -\sqrt{3}$ lub $x = \sqrt{3}$.`,
      s: [
        T`Grupujemy wyrazy parami: $x^2(x - 2) - 3(x - 2) = 0$.`,
        T`Wyłączamy wspólny czynnik: $(x - 2)(x^2 - 3) = 0$.`,
        T`Iloczyn jest równy zero, gdy $x - 2 = 0$ lub $x^2 - 3 = 0$. Stąd $x = 2$ lub $x = \sqrt{3}$ lub $x = -\sqrt{3}$.`
      ],
      trap: T`Równanie $x^2 = 3$ ma DWA rozwiązania: $\sqrt{3}$ i $-\sqrt{3}$. Pominięcie ujemnego kosztuje punkt.`
    },
    {
      n: '10', pts: 1, t: 5, k: 'SC',
      q: T`W październiku 2022 roku założono dwa sady, w których posadzono łącznie $1960$ drzew. Po roku stwierdzono, że uschło $5\%$ drzew w pierwszym sadzie i $10\%$ drzew w drugim sadzie. Uschnięte drzewa usunięto, a nowych nie dosadzano. Liczba drzew, które pozostały w drugim sadzie, stanowiła $60\%$ liczby drzew, które pozostały w pierwszym sadzie. Niech $x$ oraz $y$ oznaczają liczby drzew posadzonych – odpowiednio – w pierwszym i drugim sadzie.` + '\n\n' + SC + T`Układem równań, którego poprawne rozwiązanie prowadzi do obliczenia liczby $x$ drzew posadzonych w pierwszym sadzie oraz liczby $y$ drzew posadzonych w drugim sadzie, jest`,
      o: [
        T`$\begin{cases} x + y = 1960 \\ 0{,}6 \cdot 0{,}95x = 0{,}9y \end{cases}$`,
        T`$\begin{cases} x + y = 1960 \\ 0{,}95x = 0{,}6 \cdot 0{,}9y \end{cases}$`,
        T`$\begin{cases} x + y = 1960 \\ 0{,}05x = 0{,}6 \cdot 0{,}1y \end{cases}$`,
        T`$\begin{cases} x + y = 1960 \\ 0{,}4 \cdot 0{,}95x = 0{,}9y \end{cases}$`
      ],
      a: 'A',
      s: [
        T`Łącznie posadzono $1960$ drzew: $x + y = 1960$.`,
        T`Po roku w pierwszym sadzie zostało $95\%$ drzew, czyli $0{,}95x$, a w drugim $90\%$, czyli $0{,}9y$.`,
        T`Drzewa z drugiego sadu to $60\%$ drzew z pierwszego: $0{,}9y = 0{,}6 \cdot 0{,}95x$.`
      ],
      trap: T`W zadaniu mowa o drzewach, które POZOSTAŁY ($95\%$ i $90\%$), a nie o tych, które uschły ($5\%$ i $10\%$). Trzeba też uważnie przeczytać, która liczba stanowi $60\%$ której.`
    },
    {
      n: '11', pts: 1, t: 5, k: 'SC',
      q: T`Na rysunku, w kartezjańskim układzie współrzędnych $(x, y)$, przedstawiono dwie proste równoległe, które są interpretacją geometryczną jednego z poniższych układów równań A–D.` + '\n\n' + SC + T`Układem równań, którego interpretację geometryczną przedstawiono na rysunku, jest`,
      fig: { plot: lines([[-1.5, 3], [-1.5, -1]], [-5, 6], [-5, 7]) },
      o: [
        T`$\begin{cases} y = -\frac{3}{2}x + 3 \\ y = -\frac{3}{2}x - 1 \end{cases}$`,
        T`$\begin{cases} y = \frac{3}{2}x + 3 \\ y = -\frac{2}{3}x - 1 \end{cases}$`,
        T`$\begin{cases} y = \frac{3}{2}x + 3 \\ y = \frac{3}{2}x - 1 \end{cases}$`,
        T`$\begin{cases} y = -\frac{3}{2}x - 3 \\ y = \frac{3}{2}x + 1 \end{cases}$`
      ],
      a: 'A',
      s: [
        T`Proste równoległe mają ten sam współczynnik kierunkowy – odpadają układy B i D.`,
        T`Obie proste „opadają” (funkcje malejące), więc współczynnik kierunkowy jest ujemny – odpada układ C.`,
        T`Sprawdzenie: proste przecinają oś $Oy$ w punktach $(0, 3)$ i $(0, -1)$, co zgadza się z wyrazami wolnymi w układzie A.`
      ],
      trap: T`Równoległość to RÓWNE współczynniki kierunkowe. Para $\frac{3}{2}$ i $-\frac{2}{3}$ z układu B oznacza proste prostopadłe.`
    },
    {
      n: '12', pts: 1, t: 5, k: 'SC',
      q: T`Funkcja liniowa $f$ jest określona wzorem $f(x) = (-2k + 3)x + k - 1$, gdzie $k \in \mathbb{R}$.` + '\n\n' + SC + T`Funkcja $f$ jest malejąca dla każdej liczby $k$ należącej do przedziału`,
      o: [T`$(-\infty, 1)$`, T`$\left(-\infty, -\frac{3}{2}\right)$`, T`$(1, +\infty)$`, T`$\left(\frac{3}{2}, +\infty\right)$`],
      a: 'D',
      s: [
        T`Funkcja liniowa jest malejąca, gdy jej współczynnik kierunkowy jest ujemny: $-2k + 3 < 0$.`,
        T`$-2k < -3$. Dzielimy przez $-2$ i odwracamy znak: $k > \frac{3}{2}$.`
      ],
      trap: T`O monotoniczności decyduje współczynnik przy $x$, czyli $-2k + 3$, a nie wyraz wolny $k - 1$.`
    },
    {
      n: '13', pts: 1, t: 5, k: 'SC',
      q: T`Funkcje liniowe $f$ oraz $g$, określone wzorami $f(x) = 3x + 6$ oraz $g(x) = ax + 7$, mają to samo miejsce zerowe.` + '\n\n' + SC + T`Współczynnik $a$ we wzorze funkcji $g$ jest równy`,
      o: [T`$\left(-\frac{7}{2}\right)$`, T`$\left(-\frac{2}{7}\right)$`, T`$\frac{2}{7}$`, T`$\frac{7}{2}$`],
      a: 'D',
      s: [
        T`Miejsce zerowe funkcji $f$: $3x + 6 = 0$, czyli $x = -2$.`,
        T`Liczba $-2$ jest też miejscem zerowym funkcji $g$: $a \cdot (-2) + 7 = 0$.`,
        T`$-2a = -7$, czyli $a = \frac{7}{2}$.`
      ],
      trap: T`Miejsce zerowe to argument $x = -2$, a nie wartość $6$. Do wzoru funkcji $g$ podstawiamy $x = -2$.`
    },
    {
      n: '14.1', pts: 1, t: 6, k: 'FILL',
      q: STEM14 + '\n\n' + T`Uzupełnij zdanie. Wpisz odpowiedni przedział tak, aby zdanie było prawdziwe.` + '\n\n' + T`Zbiorem wszystkich rozwiązań nierówności $f(x) \ge 0$ jest przedział …`,
      fig: FIG14,
      a: T`$\langle -2, 4 \rangle$`,
      s: [
        T`Z wykresu odczytujemy miejsca zerowe funkcji: $x = -2$ oraz $x = 4$.`,
        T`$f(x) \ge 0$ tam, gdzie wykres leży na osi $Ox$ lub nad nią – czyli między miejscami zerowymi.`,
        T`Nierówność jest nieostra, więc końce należą do zbioru: $x \in \langle -2, 4 \rangle$.`
      ],
      trap: T`Przy nierówności nieostrej ($\ge$) miejsca zerowe należą do rozwiązania – przedział jest domknięty.`
    },
    {
      n: '14.2', pts: 1, t: 6, k: 'SC',
      q: STEM14 + '\n\n' + SC + T`Funkcja kwadratowa $f$ jest określona wzorem`,
      fig: FIG14,
      o: [T`$f(x) = -(x + 1)^2 - 9$`, T`$f(x) = -(x - 1)^2 + 9$`, T`$f(x) = -(x - 1)^2 - 9$`, T`$f(x) = -(x + 1)^2 + 9$`],
      a: 'B',
      s: [
        T`Z wykresu: wierzchołek paraboli to $W = (1, 9)$, a ramiona są skierowane w dół.`,
        T`Postać kanoniczna: $f(x) = a(x - p)^2 + q$ dla $p = 1$, $q = 9$, czyli $f(x) = a(x - 1)^2 + 9$ z $a < 0$.`,
        T`Sprawdzenie dla $a = -1$: $f(4) = -(3)^2 + 9 = 0$ – zgadza się z miejscem zerowym $x = 4$.`
      ],
      trap: T`We wzorze $a(x - p)^2 + q$ przy $p$ stoi MINUS: wierzchołek o pierwszej współrzędnej $1$ daje nawias $(x - 1)$, a nie $(x + 1)$.`
    },
    {
      n: '14.3', pts: 1, t: 6, k: 'SC',
      q: STEM14 + '\n\n' + SC + T`Dla funkcji $f$ prawdziwa jest równość`,
      fig: FIG14,
      o: [T`$f(-4) = f(6)$`, T`$f(-4) = f(5)$`, T`$f(-4) = f(4)$`, T`$f(-4) = f(7)$`],
      a: 'A',
      s: [
        T`Osią symetrii paraboli jest prosta $x = 1$ (przechodzi przez wierzchołek).`,
        T`Argument $-4$ leży o $5$ jednostek na lewo od osi symetrii. Tę samą wartość funkcja przyjmuje $5$ jednostek na prawo od osi: $1 + 5 = 6$.`,
        T`Zatem $f(-4) = f(6)$.`
      ],
      trap: T`Oś symetrii to $x = 1$, a nie $x = 0$. Dlatego „lustrzanym odbiciem” argumentu $-4$ jest $6$, a nie $4$.`
    },
    {
      n: '14.4', pts: 2, t: 4, k: 'PARTS',
      q: STEM14 + '\n\n' + T`Funkcje kwadratowe $g$ oraz $h$ są określone za pomocą funkcji $f$ następująco: $g(x) = f(x + 3)$, $h(x) = f(-x)$. Na rysunkach A–F przedstawiono, w kartezjańskim układzie współrzędnych $(x, y)$, fragmenty wykresów różnych funkcji – w tym fragment wykresu funkcji $g$ oraz fragment wykresu funkcji $h$.` + '\n\n' + T`Każdej z funkcji $g$ oraz $h$ przyporządkuj fragment jej wykresu. Wybierz odpowiedzi spośród oznaczonych literami A–F.`,
      parts: [T`Fragment wykresu funkcji $y = g(x)$ przedstawiono na rysunku`, T`Fragment wykresu funkcji $y = h(x)$ przedstawiono na rysunku`],
      choices: ['rysunek A', 'rysunek B', 'rysunek C', 'rysunek D', 'rysunek E', 'rysunek F'],
      a: 'AE',
      fig: {
        plot: panels([
          ['Wykres funkcji f', parabola(-1, 1, 9, [-7, 7], [-6, 10])],
          ['A', parabola(-1, -2, 9, [-7, 3], [-6, 10])],
          ['B', parabola(-1, 3, 9, [-3, 7], [-6, 10])],
          ['C', parabola(-1, 1, 6, [-4, 6], [-8, 8])],
          ['D', parabola(1, 1, -9, [-4, 6], [-10, 6])],
          ['E', parabola(-1, -1, 9, [-6, 4], [-6, 10])],
          ['F', parabola(1, -1, -9, [-6, 4], [-10, 6])]
        ])
      },
      s: [
        T`$g(x) = f(x + 3)$ to wykres funkcji $f$ przesunięty o $3$ jednostki W LEWO. Wierzchołek $(1, 9)$ przechodzi na $(-2, 9)$, miejsca zerowe $-2$ i $4$ na $-5$ i $1$ – to rysunek A.`,
        T`$h(x) = f(-x)$ to wykres funkcji $f$ odbity symetrycznie względem osi $Oy$. Wierzchołek $(1, 9)$ przechodzi na $(-1, 9)$, miejsca zerowe na $2$ i $-4$ – to rysunek E.`
      ],
      trap: T`$f(x + 3)$ przesuwa wykres w LEWO, a nie w prawo. Rysunek B (wierzchołek w $(4, 9)$ byłby dla $f(x - 3)$) to typowa pułapka.`,
      tip: T`Uwaga: od 2025 r. wymagania egzaminacyjne obejmują tylko przesunięcia $y = f(x - a)$ i $y = f(x) + b$; symetria $y = f(-x)$ już nie obowiązuje.`
    },
    {
      n: '15', pts: 1, t: 7, k: 'PF',
      q: T`Ciąg $(a_n)$ jest określony wzorem $a_n = (-1)^n \cdot (n - 5)$ dla każdej liczby naturalnej $n \ge 1$.`,
      st: [T`Pierwszy wyraz ciągu $(a_n)$ jest dwa razy większy od trzeciego wyrazu tego ciągu.`, T`Wszystkie wyrazy ciągu $(a_n)$ są dodatnie.`],
      a: 'PF',
      s: [
        T`$a_1 = (-1)^1 \cdot (1 - 5) = (-1) \cdot (-4) = 4$ oraz $a_3 = (-1)^3 \cdot (3 - 5) = (-1) \cdot (-2) = 2$. Ponieważ $4 = 2 \cdot 2$, stwierdzenie 1 jest prawdziwe.`,
        T`$a_2 = (-1)^2 \cdot (2 - 5) = -3 < 0$ (także $a_5 = 0$), więc nie wszystkie wyrazy są dodatnie – stwierdzenie 2 jest fałszywe.`
      ],
      trap: T`Czynnik $(-1)^n$ zmienia znak co drugi wyraz. Żeby obalić zdanie „wszystkie wyrazy są dodatnie”, wystarczy jeden kontrprzykład, np. $a_2 = -3$.`
    },
    {
      n: '16', pts: 1, t: 7, k: 'AB',
      q: T`Trzywyrazowy ciąg $(12, 6, 2m - 1)$ jest geometryczny.` + '\n\n' + T`Dokończ zdanie. Wybierz właściwe zakończenie.` + '\n\n' + T`Ten ciąg jest`,
      ab: ['rosnący', 'malejący'],
      r: [T`$m = \frac{1}{2}$`, T`$m = 2$`, T`$m = 3$`],
      join: 'oraz',
      a: 'B2',
      s: [
        T`Iloraz ciągu: $q = \frac{6}{12} = \frac{1}{2}$.`,
        T`Trzeci wyraz: $6 \cdot \frac{1}{2} = 3$, więc $2m - 1 = 3$, czyli $m = 2$.`,
        T`Wyrazy $12, 6, 3$ są coraz mniejsze – ciąg jest malejący.`
      ],
      trap: T`Liczba $\frac{1}{2}$ to iloraz ciągu, a nie wartość $m$. Trzeba jeszcze rozwiązać równanie $2m - 1 = 3$.`
    },
    {
      n: '17', pts: 2, t: 7, k: 'OPEN',
      q: T`Ciąg arytmetyczny $(a_n)$ jest określony dla każdej liczby naturalnej $n \ge 1$. Trzeci wyraz tego ciągu jest równy $(-1)$, a suma piętnastu początkowych kolejnych wyrazów tego ciągu jest równa $(-165)$.` + '\n\n' + T`Oblicz różnicę tego ciągu. Zapisz obliczenia.`,
      a: T`$r = -2$`,
      s: [
        T`$a_3 = a_1 + 2r = -1$.`,
        T`$S_{15} = \frac{2a_1 + 14r}{2} \cdot 15 = 15(a_1 + 7r) = -165$, więc $a_1 + 7r = -11$.`,
        T`Odejmujemy równania stronami: $(a_1 + 7r) - (a_1 + 2r) = -11 - (-1)$, czyli $5r = -10$ i $r = -2$.`
      ],
      trap: T`We wzorze na sumę jest $(n - 1)r$, czyli dla $n = 15$ mamy $14r$, a nie $15r$.`,
      tip: T`Karta wzorów, str. 9: $S_n = \frac{2a_1 + (n - 1)r}{2} \cdot n$.`
    },
    {
      n: '18', pts: 2, t: 8, k: 'MULTI',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ zaznaczono kąt o mierze $\alpha$ taki, że $\operatorname{tg} \alpha = -3$ oraz $90^\circ < \alpha < 180^\circ$ (zobacz rysunek: ramię końcowe kąta przechodzi przez punkt $(-1, 3)$).` + '\n\n' + T`Wybierz dwie właściwe odpowiedzi spośród oznaczonych literami A–F. Prawdziwe są zależności:`,
      fig: { plot: polyline([[0, 0], [-1, 3]], [-3, 3], [-1, 4], { start: 'none', end: 'filled', labels: [{ x: 0.5, y: 0.6, text: 'α' }] }) },
      o: [T`$\sin \alpha < 0$`, T`$\sin \alpha \cdot \cos \alpha < 0$`, T`$\sin \alpha \cdot \cos \alpha > 0$`, T`$\cos \alpha > 0$`, T`$\sin \alpha = -\frac{1}{3} \cos \alpha$`, T`$\sin \alpha = -3 \cos \alpha$`],
      a: 'BF',
      s: [
        T`Dla kąta rozwartego ($90^\circ < \alpha < 180^\circ$) mamy $\sin \alpha > 0$ oraz $\cos \alpha < 0$. Odpadają A i D.`,
        T`Iloczyn liczby dodatniej i ujemnej jest ujemny: $\sin \alpha \cdot \cos \alpha < 0$ – zależność B jest prawdziwa, C fałszywa.`,
        T`$\operatorname{tg} \alpha = \frac{\sin \alpha}{\cos \alpha} = -3$, więc $\sin \alpha = -3 \cos \alpha$ – zależność F jest prawdziwa, E fałszywa.`
      ],
      trap: T`W drugiej ćwiartce sinus jest dodatni, a cosinus ujemny. Z $\operatorname{tg} \alpha = -3$ wynika $\sin \alpha = -3\cos \alpha$, a nie $\cos \alpha = -3 \sin \alpha$.`
    },
    {
      n: '19', pts: 1, t: 8, k: 'SC',
      q: SC + T`Liczba $\sin^3 20^\circ + \cos^2 20^\circ \cdot \sin 20^\circ$ jest równa`,
      o: [T`$\cos 20^\circ$`, T`$\sin 20^\circ$`, T`$\operatorname{tg} 20^\circ$`, T`$\sin 20^\circ \cdot \cos 20^\circ$`],
      a: 'B',
      s: [
        T`Wyłączamy $\sin 20^\circ$ przed nawias: $\sin 20^\circ \cdot \left(\sin^2 20^\circ + \cos^2 20^\circ\right)$.`,
        T`Z jedynki trygonometrycznej nawias jest równy $1$, więc wynik to $\sin 20^\circ$.`
      ],
      trap: T`Nie trzeba (i nie da się dokładnie) liczyć $\sin 20^\circ$. Kluczem jest zauważenie wspólnego czynnika i jedynki trygonometrycznej.`,
      tip: T`Karta wzorów, str. 12: $\sin^2 \alpha + \cos^2 \alpha = 1$.`
    },
    {
      n: '20', pts: 1, t: 9, k: 'SC',
      q: T`Dany jest trójkąt $KLM$, w którym $|KM| = a$, $|LM| = b$ oraz $a \ne b$. Dwusieczna kąta $KML$ przecina bok $KL$ w punkcie $N$ takim, że $|KN| = c$, $|NL| = d$ oraz $|MN| = e$ (zobacz rysunek).` + '\n\n' + SC + T`W trójkącie $KLM$ prawdziwa jest równość`,
      fig: { diagram: geo({ pts: { K: [0, 0, 'bl'], L: [7, 0, 'br'], M: [2.6, 3.4, 't'], N: [3.04, 0, 'b'] }, segs: ['KL', 'LM', 'MK', 'MN'], texts: [[1.0, 1.95, 'a'], [5.15, 1.95, 'b'], [1.5, -0.35, 'c'], [5.0, -0.35, 'd'], [3.1, 1.6, 'e']] }) },
      o: [T`$a \cdot b = c \cdot d$`, T`$a \cdot d = b \cdot c$`, T`$a \cdot c = b \cdot d$`, T`$a \cdot b = e \cdot e$`],
      a: 'B',
      s: [
        T`Twierdzenie o dwusiecznej: dwusieczna kąta trójkąta dzieli przeciwległy bok w stosunku długości boków przyległych do tego kąta: $\frac{|KN|}{|NL|} = \frac{|KM|}{|LM|}$.`,
        T`Podstawiamy oznaczenia: $\frac{c}{d} = \frac{a}{b}$.`,
        T`Mnożymy „na krzyż”: $a \cdot d = b \cdot c$.`
      ],
      trap: T`Odcinek $c$ leży przy boku $a$, a odcinek $d$ przy boku $b$ – proporcja to $\frac{c}{d} = \frac{a}{b}$, a nie $\frac{c}{d} = \frac{b}{a}$.`
    },
    {
      n: '21', pts: 1, t: 9, k: 'SC',
      q: T`Dany jest równoległobok o bokach długości $3$ i $4$ oraz o kącie między nimi o mierze $120^\circ$.` + '\n\n' + SC + T`Pole tego równoległoboku jest równe`,
      o: ['$12$', T`$12\sqrt{3}$`, '$6$', T`$6\sqrt{3}$`],
      a: 'D',
      s: [
        T`Pole równoległoboku o bokach $a$, $b$ i kącie $\alpha$ między nimi: $P = a \cdot b \cdot \sin \alpha$.`,
        T`$\sin 120^\circ = \sin(180^\circ - 60^\circ) = \sin 60^\circ = \frac{\sqrt{3}}{2}$.`,
        T`$P = 3 \cdot 4 \cdot \frac{\sqrt{3}}{2} = 6\sqrt{3}$.`
      ],
      trap: T`Wzór $\frac{1}{2}ab\sin\alpha$ dotyczy trójkąta. Dla równoległoboku nie ma połowy – ale tutaj $\sin 120^\circ = \frac{\sqrt{3}}{2}$ „dokłada” własną dwójkę w mianowniku.`,
      tip: T`Karta wzorów, str. 19: pole równoległoboku $P = a \cdot b \cdot \sin \alpha$.`
    },
    {
      n: '22', pts: 1, t: 9, k: 'SC',
      q: T`W trójkącie $ABC$, wpisanym w okrąg o środku w punkcie $S$, kąt $ACB$ ma miarę $42^\circ$ (zobacz rysunek).` + '\n\n' + SC + T`Miara kąta ostrego $BAS$ jest równa`,
      fig: { diagram: geo({ pts: { S: [0, 0, 'tr'], A: [-0.966, -0.259, 'l'], B: [0.156, -0.988, 'br'], C: [-0.643, 0.766, 'tl'] }, segs: ['AB', 'BC', 'CA', 'AS', 'SB'], circles: [[0, 0, 1]], texts: [[-0.52, 0.42, '42°']] }) },
      o: [T`$42^\circ$`, T`$45^\circ$`, T`$48^\circ$`, T`$69^\circ$`],
      a: 'C',
      s: [
        T`Kąt wpisany $ACB$ i kąt środkowy $ASB$ są oparte na tym samym łuku $AB$, więc $|\sphericalangle ASB| = 2 \cdot 42^\circ = 84^\circ$.`,
        T`Trójkąt $ABS$ jest równoramienny ($|SA| = |SB|$ – promienie), więc kąty przy podstawie $AB$ są równe.`,
        T`$|\sphericalangle BAS| = \frac{180^\circ - 84^\circ}{2} = 48^\circ$.`
      ],
      trap: T`Kąt środkowy jest DWA razy większy od wpisanego opartego na tym samym łuku. Odpowiedź $42^\circ$ to przepisanie danych bez żadnego rozumowania.`,
      tip: T`Karta wzorów, str. 18: kąt środkowy jest dwa razy większy od kąta wpisanego opartego na tym samym łuku.`
    },
    {
      n: '23', pts: 1, t: 10, k: 'SC',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ proste $k$ oraz $l$ są określone równaniami` + '\n$$k\\colon\\ y = (m + 1)x + 7$$\n$$l\\colon\\ y = -2x + 7$$\n' + SC + T`Proste $k$ oraz $l$ są prostopadłe, gdy liczba $m$ jest równa`,
      o: [T`$\left(-\frac{1}{2}\right)$`, T`$\frac{1}{2}$`, '$(-3)$', '$1$'],
      a: 'A',
      s: [
        T`Proste są prostopadłe, gdy iloczyn ich współczynników kierunkowych jest równy $-1$: $(m + 1) \cdot (-2) = -1$.`,
        T`$m + 1 = \frac{1}{2}$, czyli $m = -\frac{1}{2}$.`
      ],
      trap: T`Odpowiedź $m = -3$ daje $m + 1 = -2$, czyli proste RÓWNOLEGŁE (tu nawet pokrywające się), a nie prostopadłe.`,
      tip: T`Karta wzorów, str. 22: proste $y = a_1x + b_1$ i $y = a_2x + b_2$ są prostopadłe, gdy $a_1 \cdot a_2 = -1$.`,
      scope: 'Od matury 2025 r. warunek prostopadłości prostych należy do zakresu rozszerzonego (podstawa 2024, IX.R4) – na arkuszu podstawowym takie zadanie już się nie pojawi.'
    },
    {
      n: '24', pts: 2, t: 10, k: 'OPEN',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dany jest równoległobok $ABCD$, w którym $A = (-2, 6)$ oraz $B = (10, 2)$. Przekątne $AC$ oraz $BD$ tego równoległoboku przecinają się w punkcie $P = (6, 7)$.` + '\n\n' + T`Oblicz długość boku $BC$ tego równoległoboku. Zapisz obliczenia.`,
      a: T`$|BC| = 2\sqrt{13}$`,
      s: [
        T`Przekątne równoległoboku dzielą się na połowy, więc $P$ jest środkiem odcinka $AC$: $\frac{-2 + x_C}{2} = 6$ oraz $\frac{6 + y_C}{2} = 7$.`,
        T`Stąd $x_C = 14$, $y_C = 8$, czyli $C = (14, 8)$.`,
        T`$|BC| = \sqrt{(14 - 10)^2 + (8 - 2)^2} = \sqrt{16 + 36} = \sqrt{52} = 2\sqrt{13}$.`
      ],
      trap: T`Punkt $P$ jest środkiem przekątnej $AC$ (a nie boku). Z niego wyznaczamy wierzchołek $C$, a dopiero potem długość $|BC|$.`,
      tip: T`Karta wzorów, str. 21: środek odcinka i długość odcinka w układzie współrzędnych.`
    },
    {
      n: '25.1', pts: 1, t: 11, k: 'SC',
      q: STEM25 + '\n\n' + SC + T`Pole jednej ściany bocznej tego graniastosłupa jest równe`,
      o: [T`$36\sqrt{10}$`, '$60$', T`$6\sqrt{10}$`, '$360$'],
      a: 'C',
      s: [
        T`Podstawą jest sześciokąt foremny o boku $a$, złożony z $6$ trójkątów równobocznych: $P_p = 6 \cdot \frac{a^2\sqrt{3}}{4} = \frac{3a^2\sqrt{3}}{2}$.`,
        T`$\frac{3a^2\sqrt{3}}{2} = 15\sqrt{3}$, więc $a^2 = 10$ i $a = \sqrt{10}$.`,
        T`Ściana boczna jest prostokątem o bokach $a$ i $6$: $P = 6\sqrt{10}$.`
      ],
      trap: T`Pytają o JEDNĄ ścianę boczną. Liczba $36\sqrt{10}$ to pole wszystkich sześciu ścian bocznych.`,
      tip: T`Karta wzorów, str. 15: pole trójkąta równobocznego o boku $a$ to $\frac{a^2\sqrt{3}}{4}$.`
    },
    {
      n: '25.2', pts: 1, t: 11, k: 'SC',
      q: STEM25 + '\n\n' + SC + T`Kąt nachylenia najdłuższej przekątnej graniastosłupa prawidłowego sześciokątnego do płaszczyzny podstawy jest zaznaczony na rysunku`,
      o: ['Rysunek A', 'Rysunek B', 'Rysunek C', 'Rysunek D'],
      optFig: [prism('B', 'E', 'F'), prism('A', 'C', 'C'), prism('B', 'E', 'A'), prism('A', 'D', 'D')],
      a: 'D',
      s: [
        T`Najdłuższa przekątna graniastosłupa łączy wierzchołek dolnej podstawy z wierzchołkiem górnej podstawy leżącym nad wierzchołkiem „naprzeciwko” – czyli nad końcem najdłuższej przekątnej podstawy.`,
        T`Kąt nachylenia odcinka do płaszczyzny to kąt między tym odcinkiem a jego rzutem prostokątnym na tę płaszczyznę. Rzutem najdłuższej przekątnej graniastosłupa na podstawę jest najdłuższa przekątna podstawy (ta, która przechodzi przez środek sześciokąta).`,
        T`Tylko na rysunku D zaznaczono kąt między najdłuższą przekątną graniastosłupa a najdłuższą przekątną podstawy wychodzącą z tego samego wierzchołka. Na rysunkach A i C drugie ramię kąta nie jest rzutem przekątnej, a na rysunku B zaznaczona przekątna graniastosłupa nie jest najdłuższa.`
      ],
      trap: T`Kąt mierzymy do RZUTU przekątnej na podstawę (najdłuższej przekątnej podstawy), a nie do krawędzi podstawy ani do krótszej przekątnej podstawy.`
    },
    {
      n: '26', pts: 1, t: 11, k: 'NUM',
      q: T`Ostrosłup $F_1$ jest podobny do ostrosłupa $F_2$. Objętość ostrosłupa $F_1$ jest równa $64$. Objętość ostrosłupa $F_2$ jest równa $512$.` + '\n\n' + T`Uzupełnij zdanie. Wpisz odpowiednią liczbę tak, aby zdanie było prawdziwe.` + '\n\n' + T`Stosunek pola powierzchni całkowitej ostrosłupa $F_2$ do pola powierzchni całkowitej ostrosłupa $F_1$ jest równy …`,
      a: '4',
      s: [
        T`Stosunek objętości brył podobnych to sześcian skali podobieństwa: $k^3 = \frac{512}{64} = 8$, więc $k = 2$.`,
        T`Stosunek pól powierzchni to kwadrat skali: $k^2 = 4$.`
      ],
      trap: T`Objętości skalują się jak $k^3$, pola jak $k^2$. Odpowiedź $8$ to stosunek objętości, a $2$ – sama skala.`
    },
    {
      n: '27', pts: 1, t: 12, k: 'SC',
      q: T`Rozważamy wszystkie kody czterocyfrowe utworzone tylko z cyfr $1$, $3$, $6$, $8$, przy czym w każdym kodzie każda z tych cyfr występuje dokładnie jeden raz.` + '\n\n' + SC + T`Liczba wszystkich takich kodów jest równa`,
      o: ['$4$', '$10$', '$24$', '$16$'],
      a: 'C',
      s: [
        T`Na pierwszym miejscu kodu może stać każda z $4$ cyfr, na drugim – każda z $3$ pozostałych, na trzecim – jedna z $2$, na czwartym – ostatnia.`,
        T`Z reguły mnożenia: $4 \cdot 3 \cdot 2 \cdot 1 = 24$.`
      ],
      trap: T`Cyfry nie mogą się powtarzać, więc liczba możliwości maleje na kolejnych miejscach. $4 \cdot 4 = 16$ ani $4 + 3 + 2 + 1 = 10$ to nie jest reguła mnożenia.`
    },
    {
      n: '28', pts: 1, t: 14, k: 'SC',
      q: T`Średnia arytmetyczna trzech liczb: $a$, $b$, $c$, jest równa $9$.` + '\n\n' + SC + T`Średnia arytmetyczna sześciu liczb: $a$, $a$, $b$, $b$, $c$, $c$, jest równa`,
      o: ['$9$', '$6$', '$4{,}5$', '$18$'],
      a: 'A',
      s: [
        T`Z pierwszej średniej: $\frac{a + b + c}{3} = 9$, więc $a + b + c = 27$.`,
        T`Suma sześciu liczb: $2a + 2b + 2c = 2 \cdot 27 = 54$.`,
        T`Średnia: $\frac{54}{6} = 9$.`
      ],
      trap: T`Podwojenie każdej liczby w zestawie podwaja jednocześnie sumę i liczbę składników – średnia się nie zmienia.`
    },
    {
      n: '29', pts: 1, t: 14, k: 'SC',
      q: T`Na diagramie przedstawiono wyniki sprawdzianu z matematyki w pewnej klasie maturalnej. Na osi poziomej podano oceny, które uzyskali uczniowie tej klasy, a na osi pionowej podano liczbę uczniów, którzy otrzymali daną ocenę.` + '\n\n' + SC + T`Mediana ocen uzyskanych z tego sprawdzianu przez uczniów tej klasy jest równa`,
      fig: { diagram: bars([[1, 2], [2, 7], [3, 4], [4, 3], [5, 6], [6, 4]], { xTitle: 'ocena', yTitle: 'liczba uczniów' }) },
      o: ['$4{,}5$', '$4$', '$3{,}5$', '$3$'],
      a: 'C',
      s: [
        T`Liczba uczniów: $2 + 7 + 4 + 3 + 6 + 4 = 26$ – liczba parzysta, więc mediana to średnia arytmetyczna ocen stojących na miejscach $13$ i $14$ w uporządkowanym zestawie.`,
        T`Liczymy narastająco: oceny $1$ i $2$ to pozycje $1$–$9$, oceny $3$ to pozycje $10$–$13$, oceny $4$ to pozycje $14$–$16$.`,
        T`Trzynasta ocena to $3$, czternasta to $4$. Mediana: $\frac{3 + 4}{2} = 3{,}5$.`
      ],
      trap: T`Mediana to nie „środkowa ocena na osi” (między $3$ a $4$ z listy $1$–$6$) – trzeba uwzględnić, ilu uczniów dostało każdą ocenę.`
    },
    {
      n: '30', pts: 2, t: 13, k: 'OPEN',
      q: T`Dany jest pięcioelementowy zbiór $K = \{5, 6, 7, 8, 9\}$. Wylosowanie każdej liczby z tego zbioru jest jednakowo prawdopodobne. Ze zbioru $K$ losujemy ze zwracaniem kolejno dwa razy po jednej liczbie i zapisujemy je w kolejności losowania.` + '\n\n' + T`Oblicz prawdopodobieństwo zdarzenia $A$ polegającego na tym, że suma wylosowanych liczb jest liczbą parzystą. Zapisz obliczenia.`,
      a: T`$P(A) = \frac{13}{25}$`,
      s: [
        T`Losujemy dwa razy ze zwracaniem z $5$ liczb: $|\Omega| = 5 \cdot 5 = 25$.`,
        T`Suma jest parzysta, gdy obie liczby są nieparzyste albo obie parzyste. Nieparzyste: $5, 7, 9$ (trzy), parzyste: $6, 8$ (dwie).`,
        T`$|A| = 3 \cdot 3 + 2 \cdot 2 = 13$, więc $P(A) = \frac{13}{25}$.`
      ],
      trap: T`Losowanie jest ZE zwracaniem i z uwzględnieniem kolejności, więc par jest $25$ (a nie $20$ ani $10$), a pary typu $(5, 5)$ też się liczą.`
    },
    {
      n: '31', pts: 4, t: 15, k: 'OPEN',
      q: T`W schronisku dla zwierząt, na płaskiej powierzchni, należy zbudować ogrodzenie z siatki wydzielające trzy identyczne wybiegi o wspólnych ścianach wewnętrznych. Podstawą każdego z tych trzech wybiegów jest prostokąt (jak pokazano na rysunku – widok z góry, linią przerywaną zaznaczono siatkę). Do wykonania tego ogrodzenia należy zużyć $36$ metrów bieżących siatki.` + '\n\n' + T`Oblicz wymiary $x$ oraz $y$ jednego wybiegu, przy których suma pól podstaw tych trzech wybiegów będzie największa. W obliczeniach pomiń szerokość wejścia na każdy z wybiegów. Zapisz obliczenia.`,
      fig: { diagram: geo({ dashed: [[[0, 0], [9, 0]], [[9, 0], [9, 4.5]], [[9, 4.5], [0, 4.5]], [[0, 4.5], [0, 0]], [[3, 0], [3, 4.5]], [[6, 0], [6, 4.5]]], texts: [[1.5, 5.0, 'y'], [4.5, 5.0, 'y'], [7.5, 5.0, 'y'], [-0.5, 2.25, 'x'], [1.5, 2.25, 'wybieg 1.'], [4.5, 2.25, 'wybieg 2.'], [7.5, 2.25, 'wybieg 3.']], height: 300 }) },
      a: T`$x = 4{,}5$ m oraz $y = 3$ m.`,
      s: [
        T`Liczymy siatkę: cztery ściany długości $x$ (dwie zewnętrzne i dwie wspólne) oraz dwa boki długości $3y$. Zatem $4x + 6y = 36$, skąd $y = 6 - \frac{2}{3}x$.`,
        T`Suma pól: $P(x) = 3 \cdot x \cdot y = 3x\left(6 - \frac{2}{3}x\right) = -2x^2 + 18x$. Dziedzina: $x > 0$ i $y > 0$, czyli $x \in (0, 9)$.`,
        T`Ramiona paraboli są skierowane w dół, więc wartość największa jest w wierzchołku: $x = -\frac{18}{2 \cdot (-2)} = 4{,}5$. Liczba ta należy do dziedziny.`,
        T`$y = 6 - \frac{2}{3} \cdot 4{,}5 = 3$. Wymiary jednego wybiegu: $x = 4{,}5$ m, $y = 3$ m (suma pól: $40{,}5$ m²).`
      ],
      trap: T`Ściany wewnętrzne są wspólne: odcinków długości $x$ jest $4$, a nie $6$. Błędne równanie $6x + 6y = 36$ odbiera wszystkie punkty za dalszą część.`,
      tip: T`Schemat za 4 pkt: zależność między $x$ i $y$, funkcja pola jednej zmiennej, dziedzina, wierzchołek paraboli i odpowiedź.`
    }
  ]
};

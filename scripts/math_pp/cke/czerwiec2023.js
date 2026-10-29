// Egzamin maturalny z matematyki, poziom podstawowy, Formuła 2023 – termin dodatkowy, czerwiec 2023 r.
// Transkrypcja z arkusza CKE; klucz odpowiedzi: wersja A. Rozwiązania krok po kroku – opracowanie JASNE.
import { geo, parabola, panels, plot } from './fig.js';

const T = String.raw;
const SC = 'Dokończ zdanie. Wybierz właściwą odpowiedź spośród podanych.\n\n';

const STEM13 = T`W kartezjańskim układzie współrzędnych $(x, y)$ narysowano wykres funkcji $y = f(x)$ (zobacz rysunek).`;
const FIG13 = {
  plot: plot([-6, 5], [-4, 5], {
    type: 'PIECEWISE_LINEAR',
    segments: [
      { from: [-5, -3], to: [-4, -3], startDot: 'hollow', endDot: 'none' },
      { from: [-4, -3], to: [-3, -1], startDot: 'none', endDot: 'none' },
      { from: [-3, -1], to: [-1, -1], startDot: 'none', endDot: 'hollow' },
      { from: [1, 1], to: [3, 1], startDot: 'hollow', endDot: 'none' },
      { from: [3, 1], to: [4, 3], startDot: 'none', endDot: 'none' },
      { from: [4, 3], to: [5, 3], startDot: 'none', endDot: 'hollow' }
    ]
  })
};
const STEM15 = T`Masa $m$ leku $L$ zażytego przez chorego zmienia się w organizmie zgodnie z zależnością wykładniczą` + '\n$$m(t) = m_0 \\cdot (0{,}6)^{0{,}25t}$$\n' + T`gdzie: $m_0$ – masa (wyrażona w mg) przyjętej w chwili $t = 0$ dawki leku, $t$ – czas (wyrażony w godzinach) liczony od momentu $t = 0$ zażycia leku.`;
const STEM29 = T`Dany jest ostrosłup, którego podstawą jest kwadrat o boku $6$. Jedna z krawędzi bocznych tego ostrosłupa ma długość $12$ i jest prostopadła do płaszczyzny podstawy.`;

// Zadanie 21: |BC| = 4, |CD| = 3, trójkąt ABD prostokątny w A, AC – wysokość na przeciwprostokątną
const R21 = Math.sqrt(7);
const D21 = [-R21, Math.sqrt(21)];
const C21 = [R21 + (4 / 7) * (D21[0] - R21), (4 / 7) * D21[1]];
// Zadanie 23: łuk AB = 40°, łuk CD = 80°
const onCircle = (deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
const [A23, B23, C23, D23] = [250, 290, 50, 130].map(onCircle);
const cross = (p1, p2, p3, p4) => {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
};
const K23 = cross(A23, C23, B23, D23);

export default {
  examId: 'matura-czerwiec-2023',
  examName: 'Matura Czerwiec 2023 (Formuła 2023)',
  sourceLabel: 'Matura Czerwiec 2023',
  refLabel: 'Matura czerwiec 2023',
  year: 2023,
  session: 'Czerwiec',
  totalPoints: 46,
  tasks: [
    {
      n: '1', pts: 1, t: 1, k: 'SC',
      q: SC + T`Wszystkich liczb całkowitych dodatnich spełniających nierówność $|x + 5| < 15$ jest`,
      o: ['$9$', '$10$', '$20$', '$21$'],
      a: 'A',
      s: [
        T`$|x + 5| < 15$ oznacza $-15 < x + 5 < 15$, czyli $-20 < x < 10$.`,
        T`Liczby całkowite DODATNIE z tego przedziału to $1, 2, \ldots, 9$.`,
        T`Jest ich $9$.`
      ],
      trap: T`Pytają tylko o liczby DODATNIE. Nierówność jest ostra, więc $10$ nie należy do rozwiązań, a zero nie jest liczbą dodatnią.`
    },
    {
      n: '2', pts: 1, t: 1, k: 'SC',
      q: SC + T`Dla każdej dodatniej liczby rzeczywistej $x$ iloczyn $\sqrt{x} \cdot \sqrt[3]{x} \cdot \sqrt[6]{x}$ jest równy`,
      o: ['$x$', T`$\sqrt[10]{x}$`, T`$\sqrt[18]{x}$`, T`$x^2$`],
      a: 'A',
      s: [
        T`Zapisujemy pierwiastki jako potęgi: $x^{\frac{1}{2}} \cdot x^{\frac{1}{3}} \cdot x^{\frac{1}{6}}$.`,
        T`Dodajemy wykładniki: $\frac{1}{2} + \frac{1}{3} + \frac{1}{6} = \frac{3}{6} + \frac{2}{6} + \frac{1}{6} = 1$.`,
        T`$x^{1} = x$.`
      ],
      trap: T`Stopni pierwiastków nie dodaje się ($2 + 3 + 6$) ani nie mnoży. Trzeba przejść na wykładniki ułamkowe i dodać ułamki.`
    },
    {
      n: '3', pts: 2, t: 2, k: 'PROOF',
      q: T`Wykaż, że dla każdej liczby całkowitej $k$ reszta z dzielenia liczby $49k^2 + 7k - 2$ przez $7$ jest równa $5$.`,
      a: T`$49k^2 + 7k - 2 = 7(7k^2 + k - 1) + 5$, a liczba $7k^2 + k - 1$ jest całkowita, więc reszta z dzielenia przez $7$ jest równa $5$.`,
      s: [
        T`Reszta musi być liczbą od $0$ do $6$, więc zapisujemy $-2$ jako $-7 + 5$: $49k^2 + 7k - 2 = 49k^2 + 7k - 7 + 5$.`,
        T`Wyłączamy siódemkę: $7(7k^2 + k - 1) + 5$.`,
        T`Liczba $7k^2 + k - 1$ jest całkowita, więc dana liczba ma postać $7m + 5$ – przy dzieleniu przez $7$ daje resztę $5$.`
      ],
      trap: T`Reszta nie może być ujemna. Zapis $7(7k^2 + k) - 2$ NIE oznacza reszty $-2$ – trzeba „pożyczyć” jedną siódemkę: $-2 = -7 + 5$.`
    },
    {
      n: '4', pts: 1, t: 1, k: 'SC',
      q: T`Klient wpłacił do banku $30\,000$ zł na lokatę dwuletnią. Po każdym rocznym okresie oszczędzania bank dolicza odsetki w wysokości $7\%$ od kwoty bieżącego kapitału znajdującego się na lokacie.` + '\n\n' + SC + T`Po dwóch latach oszczędzania łączna wartość doliczonych odsetek na tej lokacie (bez uwzględniania podatków) jest równa`,
      o: ['$2100$ zł', '$2247$ zł', '$4200$ zł', '$4347$ zł'],
      a: 'D',
      s: [
        T`Po dwóch latach na lokacie jest $30\,000 \cdot (1{,}07)^2 = 30\,000 \cdot 1{,}1449 = 34\,347$ zł.`,
        T`Odsetki to różnica między kwotą końcową a wpłatą: $34\,347 - 30\,000 = 4347$ zł.`
      ],
      trap: T`$4200$ zł to procent prosty ($2 \cdot 7\%$ z $30\,000$). W drugim roku odsetki liczy się już od $32\,100$ zł, stąd dodatkowe $147$ zł.`,
      tip: T`Karta wzorów, str. 10: $K_n = K \cdot \left(1 + \frac{p}{100}\right)^n$.`
    },
    {
      n: '5', pts: 1, t: 1, k: 'SC',
      q: SC + T`Liczba $\log_2 \frac{1}{8} + \log_2 4$ jest równa`,
      o: ['$(-1)$', T`$\frac{1}{2}$`, '$2$', '$5$'],
      a: 'A',
      s: [
        T`$\log_2 \frac{1}{8} = -3$, bo $2^{-3} = \frac{1}{8}$.`,
        T`$\log_2 4 = 2$, bo $2^2 = 4$.`,
        T`$-3 + 2 = -1$.`
      ],
      trap: T`Logarytm z ułamka mniejszego od $1$ (przy podstawie większej od $1$) jest UJEMNY: $\log_2 \frac{1}{8} = -3$, a nie $3$.`
    },
    {
      n: '6', pts: 1, t: 1, k: 'SC',
      q: SC + T`Liczba $\left(1 + \sqrt{5}\right)^2 - \left(1 - \sqrt{5}\right)^2$ jest równa`,
      o: ['$0$', '$(-10)$', T`$4\sqrt{5}$`, T`$2 + 2\sqrt{5}$`],
      a: 'C',
      s: [
        T`$\left(1 + \sqrt{5}\right)^2 = 1 + 2\sqrt{5} + 5 = 6 + 2\sqrt{5}$.`,
        T`$\left(1 - \sqrt{5}\right)^2 = 1 - 2\sqrt{5} + 5 = 6 - 2\sqrt{5}$.`,
        T`Różnica: $6 + 2\sqrt{5} - 6 + 2\sqrt{5} = 4\sqrt{5}$.`
      ],
      trap: T`Szóstki się skracają, ale wyrazy z pierwiastkiem się DODAJĄ, bo $-(-2\sqrt{5}) = +2\sqrt{5}$. Wynik $0$ to błąd znaku.`
    },
    {
      n: '7', pts: 1, t: 2, k: 'SC',
      q: SC + T`Dla każdej liczby rzeczywistej $x$ różnej od $0$ i $2$ wyrażenie $\frac{x^2 + x}{(x - 2)^2} \cdot \frac{x - 2}{x}$ jest równe`,
      o: [T`$\frac{x^2 + 1}{x - 2}$`, T`$\frac{x + 1}{2}$`, T`$\frac{x^2}{(x - 2)^2}$`, T`$\frac{x + 1}{x - 2}$`],
      a: 'D',
      s: [
        T`Wyłączamy $x$ w liczniku: $x^2 + x = x(x + 1)$.`,
        T`$\frac{x(x + 1)}{(x - 2)^2} \cdot \frac{x - 2}{x}$ – skracamy $x$ oraz jeden czynnik $(x - 2)$.`,
        T`Zostaje $\frac{x + 1}{x - 2}$.`
      ],
      trap: T`Nie wolno skracać $x$ „wewnątrz sumy” $x^2 + x$. Najpierw zamień sumę na iloczyn $x(x + 1)$.`
    },
    {
      n: '8', pts: 2, t: 3, k: 'OPEN',
      q: T`Rozwiąż nierówność` + '\n$$x(2x - 1) < 2x$$\n' + T`Zapisz obliczenia.`,
      a: T`$x \in \left(0, \frac{3}{2}\right)$`,
      s: [
        T`Przenosimy wszystko na lewą stronę: $2x^2 - x - 2x < 0$, czyli $2x^2 - 3x < 0$.`,
        T`Rozkładamy na czynniki: $x(2x - 3) < 0$. Miejsca zerowe: $x = 0$ oraz $x = \frac{3}{2}$.`,
        T`Ramiona paraboli są skierowane w górę, więc wartości ujemne są MIĘDZY miejscami zerowymi: $x \in \left(0, \frac{3}{2}\right)$.`
      ],
      trap: T`Nie wolno dzielić obu stron przez $x$ – nie wiadomo, czy $x$ jest dodatnie. Dzielenie „gubi” część rozwiązań i może odwrócić znak nierówności.`
    },
    {
      n: '9', pts: 3, t: 3, k: 'OPEN',
      q: T`Rozwiąż równanie` + '\n$$x^3 + 4x^2 - 9x - 36 = 0$$\n' + T`Zapisz obliczenia.`,
      a: T`$x = -4$ lub $x = -3$ lub $x = 3$.`,
      s: [
        T`Grupujemy wyrazy: $x^2(x + 4) - 9(x + 4) = 0$.`,
        T`$(x + 4)(x^2 - 9) = 0$, czyli $(x + 4)(x - 3)(x + 3) = 0$.`,
        T`$x = -4$ lub $x = 3$ lub $x = -3$.`
      ],
      trap: T`$x^2 - 9 = 0$ ma dwa rozwiązania: $3$ i $-3$. Razem z $-4$ równanie ma trzy rozwiązania.`
    },
    {
      n: '10', pts: 1, t: 3, k: 'SC',
      q: SC + T`Równanie $\frac{(x^2 - 3x)(x + 2)}{x^2 - 4} = 0$ w zbiorze liczb rzeczywistych ma dokładnie`,
      o: ['jedno rozwiązanie.', 'dwa rozwiązania.', 'trzy rozwiązania.', 'cztery rozwiązania.'],
      a: 'B',
      s: [
        T`Dziedzina: $x^2 - 4 \ne 0$, czyli $x \ne 2$ i $x \ne -2$.`,
        T`Licznik: $x(x - 3)(x + 2) = 0$ dla $x = 0$, $x = 3$, $x = -2$.`,
        T`Liczba $-2$ nie należy do dziedziny, więc zostają dwa rozwiązania: $0$ i $3$.`
      ],
      trap: T`$x = -2$ zeruje licznik, ale też mianownik – trzeba je odrzucić.`
    },
    {
      n: '11', pts: 1, t: 5, k: 'SC',
      q: SC + T`W kartezjańskim układzie współrzędnych $(x, y)$ wykresy funkcji liniowych $f(x) = (2m + 3)x + 5$ oraz $g(x) = -x$ nie mają punktów wspólnych dla`,
      o: [T`$m = -2$`, T`$m = -1$`, T`$m = 1$`, T`$m = 2$`],
      a: 'A',
      s: [
        T`Dwie proste nie mają punktów wspólnych, gdy są równoległe i różne – mają równe współczynniki kierunkowe i różne wyrazy wolne.`,
        T`$2m + 3 = -1$, czyli $2m = -4$ i $m = -2$.`,
        T`Wyrazy wolne ($5$ i $0$) są różne, więc proste rzeczywiście się nie pokrywają.`
      ],
      trap: T`Współczynnik kierunkowy funkcji $g(x) = -x$ to $-1$, a nie $0$.`
    },
    {
      n: '12', pts: 1, t: 5, k: 'SC',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ prosta o równaniu $y = ax + b$ przechodzi przez punkty $A = (-3, -1)$ oraz $B = (4, 3)$.` + '\n\n' + SC + T`Współczynnik $a$ w równaniu tej prostej jest równy`,
      o: ['$(-4)$', T`$\left(-\frac{1}{2}\right)$`, '$2$', T`$\frac{4}{7}$`],
      a: 'D',
      s: [
        T`Współczynnik kierunkowy prostej przechodzącej przez dwa punkty: $a = \frac{y_B - y_A}{x_B - x_A}$.`,
        T`$a = \frac{3 - (-1)}{4 - (-3)} = \frac{4}{7}$.`
      ],
      trap: T`Odejmowanie liczb ujemnych: $3 - (-1) = 4$ oraz $4 - (-3) = 7$. Pomyłka w znakach to najczęstszy błąd w tym zadaniu.`,
      tip: T`Karta wzorów, str. 21: współczynnik kierunkowy $a = \frac{y_2 - y_1}{x_2 - x_1}$.`
    },
    {
      n: '13.1', pts: 2, t: 4, k: 'PARTS',
      q: STEM13 + '\n\n' + T`Uzupełnij każde zdanie. Wybierz właściwą odpowiedź spośród oznaczonych literami A–F.`,
      parts: [T`Dziedziną funkcji $f$ jest zbiór`, T`Zbiorem wartości funkcji $f$ jest zbiór`],
      choices: [T`$\langle -3, -1 \rangle \cup \langle 1, 3 \rangle$`, T`$(-3, 3)$`, T`$(-3, -1) \cup (1, 3)$`, T`$\langle -5, -1 \rangle \cup \langle 1, 5 \rangle$`, T`$(-5, 5)$`, T`$(-5, -1) \cup (1, 5)$`],
      a: 'FA',
      fig: FIG13,
      s: [
        T`Dziedzina (oś $Ox$): lewy fragment wykresu leży nad argumentami od $-5$ do $-1$, prawy – od $1$ do $5$. Wszystkie cztery końce mają puste kółka, więc $D_f = (-5, -1) \cup (1, 5)$ – zbiór F.`,
        T`Zbiór wartości (oś $Oy$): lewy fragment przyjmuje wartości od $-3$ do $-1$, prawy – od $1$ do $3$. Wartości skrajne są przyjmowane (poziome odcinki zawierają punkty „pełne”), więc $ZW_f = \langle -3, -1 \rangle \cup \langle 1, 3 \rangle$ – zbiór A.`
      ],
      trap: T`Puste kółko na końcu poziomego odcinka wyklucza tylko jeden ARGUMENT. Wartość $-3$ (albo $3$) funkcja i tak przyjmuje w innych punktach tego odcinka, więc w zbiorze wartości nawiasy są domknięte.`
    },
    {
      n: '13.2', pts: 1, t: 4, k: 'FILL',
      q: STEM13 + '\n\n' + T`Zapisz zbiór wszystkich rozwiązań nierówności $f(x) < -1$.`,
      fig: FIG13,
      a: T`$(-5, -3)$`,
      s: [
        T`Szukamy argumentów, dla których wykres leży PONIŻEJ prostej $y = -1$.`,
        T`Dotyczy to tylko lewego fragmentu: na poziomym odcinku $f(x) = -3$ dla $x \in (-5, -4 \rangle$, a na ukośnym odcinku wartości rosną od $-3$ do $-1$ dla $x$ od $-4$ do $-3$.`,
        T`Dla $x = -3$ jest już $f(x) = -1$, więc ten argument odpada. Rozwiązanie: $x \in (-5, -3)$.`
      ],
      trap: T`Nierówność jest ostra: argumenty, dla których $f(x) = -1$ (czyli $x \in \langle -3, -1)$), NIE należą do rozwiązania.`
    },
    {
      n: '14', pts: 1, t: 6, k: 'SC',
      q: T`Funkcja kwadratowa $f$ jest określona wzorem $f(x) = ax^2 + bx + 1$, gdzie $a$ oraz $b$ są pewnymi liczbami rzeczywistymi, takimi, że $a < 0$ i $b > 0$. Na jednym z rysunków A–D przedstawiono fragment wykresu tej funkcji w kartezjańskim układzie współrzędnych $(x, y)$.` + '\n\n' + SC + T`Fragment wykresu funkcji $f$ przedstawiono na rysunku`,
      fig: {
        plot: panels([
          ['A', parabola(0.93, -2.2, -3.5, [-5, 5], [-5, 5])],
          ['B', parabola(-2.5, -1.2, 4.6, [-5, 5], [-5, 5])],
          ['C', parabola(1.25, 2, -4, [-5, 5], [-5, 5])],
          ['D', parabola(-0.99, 1.8, 4.2, [-5, 5], [-5, 5])]
        ])
      },
      o: ['A', 'B', 'C', 'D'],
      a: 'D',
      s: [
        T`$a < 0$, więc ramiona paraboli są skierowane w dół – odpadają rysunki A i C.`,
        T`Pierwsza współrzędna wierzchołka: $p = -\frac{b}{2a}$. Licznik $-b$ jest ujemny i mianownik $2a$ jest ujemny, więc $p > 0$ – wierzchołek leży na prawo od osi $Oy$.`,
        T`Parabolę o ramionach w dół i wierzchołku po prawej stronie osi $Oy$ przedstawia rysunek D.`
      ],
      trap: T`Wszystkie cztery wykresy przechodzą przez punkt $(0, 1)$, więc wyraz wolny nic nie rozstrzyga. Decydują: znak $a$ (kierunek ramion) oraz znak $-\frac{b}{2a}$ (położenie wierzchołka).`
    },
    {
      n: '15.1', pts: 1, t: 4, k: 'OPEN',
      q: STEM15 + '\n\n' + T`Chory przyjął jednorazowo lek $L$ w dawce $200$ mg. Oblicz, ile mg leku $L$ pozostanie w organizmie chorego po $12$ godzinach od momentu przyjęcia dawki. Zapisz obliczenia.`,
      a: T`$43{,}2$ mg`,
      s: [
        T`Podstawiamy $m_0 = 200$ oraz $t = 12$: $m(12) = 200 \cdot (0{,}6)^{0{,}25 \cdot 12} = 200 \cdot (0{,}6)^3$.`,
        T`$(0{,}6)^3 = 0{,}216$.`,
        T`$m(12) = 200 \cdot 0{,}216 = 43{,}2$ mg.`
      ],
      trap: T`Najpierw policz wykładnik: $0{,}25 \cdot 12 = 3$. Dopiero potem potęguj – $(0{,}6)^3$ to nie $0{,}6 \cdot 3$.`
    },
    {
      n: '15.2', pts: 1, t: 7, k: 'OPEN',
      q: STEM15 + '\n\n' + T`Liczby $m(2{,}5)$, $m(4{,}5)$, $m(6{,}5)$ w podanej kolejności tworzą ciąg geometryczny. Oblicz iloraz tego ciągu. Zapisz obliczenia.`,
      a: T`$q = (0{,}6)^{0{,}5} = \sqrt{0{,}6} = \frac{\sqrt{15}}{5}$`,
      s: [
        T`Iloraz ciągu geometrycznego to stosunek kolejnych wyrazów: $q = \frac{m(4{,}5)}{m(2{,}5)} = \frac{m_0 \cdot (0{,}6)^{0{,}25 \cdot 4{,}5}}{m_0 \cdot (0{,}6)^{0{,}25 \cdot 2{,}5}}$.`,
        T`Skracamy $m_0$ i odejmujemy wykładniki: $q = (0{,}6)^{0{,}25 \cdot (4{,}5 - 2{,}5)} = (0{,}6)^{0{,}5}$.`,
        T`$q = \sqrt{0{,}6} = \sqrt{\frac{3}{5}} = \frac{\sqrt{15}}{5}$.`
      ],
      trap: T`Przy dzieleniu potęg o tej samej podstawie wykładniki się ODEJMUJE. Iloraz nie zależy od dawki $m_0$ – ta się skraca.`
    },
    {
      n: '16', pts: 1, t: 7, k: 'SC',
      q: T`Ciąg $(a_n)$ jest określony wzorem $a_n = \frac{n - 2}{3}$ dla każdej liczby naturalnej $n \ge 1$.` + '\n\n' + SC + T`Liczba wyrazów tego ciągu mniejszych od $10$ jest równa`,
      o: ['$28$', '$31$', '$32$', '$27$'],
      a: 'B',
      s: [
        T`Rozwiązujemy nierówność $\frac{n - 2}{3} < 10$: $n - 2 < 30$, czyli $n < 32$.`,
        T`Numery wyrazów to liczby naturalne $n \ge 1$, więc $n \in \{1, 2, \ldots, 31\}$.`,
        T`Takich wyrazów jest $31$.`
      ],
      trap: T`Nierówność jest ostra, więc $n = 32$ odpada ($a_{32} = 10$ nie jest MNIEJSZE od $10$).`
    },
    {
      n: '17', pts: 1, t: 7, k: 'SC',
      q: T`Trzywyrazowy ciąg $(1, 4, a + 5)$ jest arytmetyczny.` + '\n\n' + SC + T`Liczba $a$ jest równa`,
      o: ['$0$', '$7$', '$2$', '$11$'],
      a: 'C',
      s: [
        T`Różnica ciągu: $r = 4 - 1 = 3$.`,
        T`Trzeci wyraz: $4 + 3 = 7$, więc $a + 5 = 7$.`,
        T`$a = 2$.`
      ],
      trap: T`$7$ to trzeci WYRAZ, a nie liczba $a$. Odpowiedź $11$ pasowałaby do ciągu geometrycznego ($1, 4, 16$).`
    },
    {
      n: '18', pts: 1, t: 7, k: 'SC',
      q: T`Ciąg geometryczny $(a_n)$ jest określony dla każdej liczby naturalnej $n \ge 1$. W tym ciągu $a_1 = 3{,}75$ oraz $a_2 = -7{,}5$.` + '\n\n' + SC + T`Suma trzech początkowych wyrazów ciągu $(a_n)$ jest równa`,
      o: ['$11{,}25$', '$(-18{,}75)$', '$15$', '$(-15)$'],
      a: 'A',
      s: [
        T`Iloraz: $q = \frac{-7{,}5}{3{,}75} = -2$.`,
        T`Trzeci wyraz: $a_3 = -7{,}5 \cdot (-2) = 15$.`,
        T`Suma: $3{,}75 + (-7{,}5) + 15 = 11{,}25$.`
      ],
      trap: T`Iloraz jest ujemny, więc znaki wyrazów się przeplatają: trzeci wyraz jest DODATNI ($15$), a nie $-15$.`
    },
    {
      n: '19', pts: 1, t: 8, k: 'SC',
      q: SC + T`Dla każdego kąta ostrego $\alpha$ wyrażenie $\cos \alpha - \cos \alpha \cdot \sin^2 \alpha$ jest równe`,
      o: [T`$\cos^3 \alpha$`, T`$\sin^2 \alpha$`, T`$1 - \sin^2 \alpha$`, T`$\cos \alpha$`],
      a: 'A',
      s: [
        T`Wyłączamy $\cos \alpha$ przed nawias: $\cos \alpha \cdot \left(1 - \sin^2 \alpha\right)$.`,
        T`Z jedynki trygonometrycznej: $1 - \sin^2 \alpha = \cos^2 \alpha$.`,
        T`$\cos \alpha \cdot \cos^2 \alpha = \cos^3 \alpha$.`
      ],
      trap: T`$1 - \sin^2 \alpha$ to tylko zawartość nawiasu. Nie wolno zgubić czynnika $\cos \alpha$ stojącego przed nim.`
    },
    {
      n: '20', pts: 2, t: 8, k: 'MULTI',
      q: T`Dany jest trójkąt, którego kąty mają miary $30^\circ$, $45^\circ$ oraz $105^\circ$. Długości boków trójkąta, leżących naprzeciwko tych kątów, są równe – odpowiednio – $a$, $b$ oraz $c$ (zobacz rysunek).` + '\n\n' + T`Wybierz dwie właściwe odpowiedzi spośród oznaczonych literami A–F. Pole tego trójkąta poprawnie określają wyrażenia:`,
      fig: { diagram: geo({ pts: { P: [0, 0, ''], Q: [2.732, 0, ''], R: [1, 1, ''] }, segs: ['PQ', 'QR', 'RP'], texts: [[0.35, 0.62, 'a'], [1.95, 0.62, 'b'], [1.37, -0.17, 'c'], [0.33, 0.1, '45°'], [2.15, 0.08, '30°'], [1.0, 0.78, '105°']], height: 240 }) },
      o: [T`$\frac{\sqrt{2}}{2} \cdot a \cdot c$`, T`$\frac{1}{4} \cdot a \cdot c$`, T`$\frac{\sqrt{2}}{4} \cdot a \cdot c$`, T`$\frac{\sqrt{3}}{4} \cdot b \cdot c$`, T`$\frac{1}{2} \cdot b \cdot c$`, T`$\frac{1}{4} \cdot b \cdot c$`],
      a: 'CF',
      s: [
        T`Pole trójkąta to połowa iloczynu dwóch boków i sinusa kąta MIĘDZY nimi.`,
        T`Boki $a$ i $c$ tworzą kąt $45^\circ$ (leży on naprzeciw boku $b$): $P = \frac{1}{2} \cdot a \cdot c \cdot \sin 45^\circ = \frac{\sqrt{2}}{4} \cdot a \cdot c$ – wyrażenie C.`,
        T`Boki $b$ i $c$ tworzą kąt $30^\circ$ (leży on naprzeciw boku $a$): $P = \frac{1}{2} \cdot b \cdot c \cdot \sin 30^\circ = \frac{1}{4} \cdot b \cdot c$ – wyrażenie F.`
      ],
      trap: T`Do wzoru wstawiamy kąt zawarty MIĘDZY użytymi bokami. Między bokami $a$ i $c$ jest kąt $45^\circ$ (ten naprzeciw $b$), a nie $30^\circ$.`,
      tip: T`Karta wzorów, str. 15: $P = \frac{1}{2} \cdot a \cdot b \cdot \sin \gamma$.`
    },
    {
      n: '21', pts: 1, t: 9, k: 'SC',
      q: T`Odcinek $AB$ jest średnicą okręgu o środku $S$. Prosta $k$ jest styczna do tego okręgu w punkcie $A$. Prosta $l$ przecina ten okrąg w punktach $B$ i $C$. Proste $k$ i $l$ przecinają się w punkcie $D$, przy czym $|BC| = 4$ i $|CD| = 3$ (zobacz rysunek).` + '\n\n' + SC + T`Odległość punktu $A$ od prostej $l$ jest równa`,
      fig: { diagram: geo({ pts: { S: [0, 0, 'b'], A: [-R21, 0, 'l'], B: [R21, 0, 'r'], C: [C21[0], C21[1], 't'], D: [D21[0], D21[1], 'l'] }, segs: ['AD', 'DB', [[-R21, 0], [-R21, -1.6]]], circles: [[0, 0, R21]], texts: [[-1.2, 4.0, '3'], [1.5, 1.8, '4']] }) },
      o: [T`$\frac{7}{2}$`, '$5$', T`$\sqrt{12}$`, T`$\sqrt{3} + 2$`],
      a: 'C',
      s: [
        T`Kąt $ACB$ jest wpisany i oparty na średnicy $AB$, więc jest prosty: $AC \perp BC$. Odległość punktu $A$ od prostej $l$ to zatem długość odcinka $AC$.`,
        T`Styczna jest prostopadła do średnicy w punkcie styczności, więc trójkąt $ABD$ jest prostokątny (kąt prosty przy $A$), a $AC$ jest jego wysokością opuszczoną na przeciwprostokątną $BD$.`,
        T`Trójkąty $ACD$ i $BCA$ są podobne, skąd $|AC|^2 = |CD| \cdot |CB| = 3 \cdot 4 = 12$, czyli $|AC| = \sqrt{12}$.`
      ],
      trap: T`Odległość punktu od prostej to długość odcinka PROSTOPADŁEGO do tej prostej. Tu jest nim $AC$ – bo kąt wpisany oparty na średnicy jest prosty.`,
      tip: T`Karta wzorów, str. 18: kąt wpisany jest połową kąta środkowego opartego na tym samym łuku – dla średnicy to połowa z $180^\circ$, czyli kąt prosty.`
    },
    {
      n: '22', pts: 1, t: 9, k: 'PF',
      q: T`W trapezie $ABCD$ o podstawach $AB$ i $CD$ przekątne przecinają się w punkcie $E$ (zobacz rysunek).`,
      fig: { diagram: geo({ pts: { A: [0, 0, 'bl'], B: [8, 0, 'br'], C: [5.2, 3.2, 'tr'], D: [0.8, 3.2, 'tl'], E: [3.355, 2.065, 't'] }, segs: ['AB', 'BC', 'CD', 'DA', 'AC', 'BD'], height: 260 }) },
      st: [T`Trójkąt $ABE$ jest podobny do trójkąta $CDE$.`, T`Pole trójkąta $ACD$ jest równe polu trójkąta $BCD$.`],
      a: 'PP',
      s: [
        T`Podstawy $AB$ i $CD$ są równoległe, więc kąty naprzemianległe są równe: $\sphericalangle EAB = \sphericalangle ECD$ oraz $\sphericalangle EBA = \sphericalangle EDC$. Z cechy kąt–kąt trójkąty $ABE$ i $CDE$ są podobne – stwierdzenie 1 jest prawdziwe.`,
        T`Trójkąty $ACD$ i $BCD$ mają wspólną podstawę $CD$, a ich wysokości opuszczone z wierzchołków $A$ i $B$ są równe wysokości trapezu. Mają więc równe pola – stwierdzenie 2 jest prawdziwe.`
      ],
      trap: T`Trójkąty $ACD$ i $BCD$ na ogół NIE są przystające, a mimo to mają równe pola – wystarczy wspólna podstawa i równe wysokości.`
    },
    {
      n: '23', pts: 1, t: 9, k: 'SC',
      q: T`Na łukach $AB$ i $CD$ okręgu są oparte kąty wpisane $ADB$ i $DBC$, takie, że $|\sphericalangle ADB| = 20^\circ$ i $|\sphericalangle DBC| = 40^\circ$ (zobacz rysunek). Cięciwy $AC$ i $BD$ przecinają się w punkcie $K$.` + '\n\n' + SC + T`Miara kąta $DKC$ jest równa`,
      fig: { diagram: geo({ pts: { A: [A23[0], A23[1], 'bl'], B: [B23[0], B23[1], 'br'], C: [C23[0], C23[1], 'tr'], D: [D23[0], D23[1], 'tl'], K: [K23[0], K23[1], 'l'] }, segs: ['DA', 'DB', 'AC', 'CB'], circles: [[0, 0, 1]], texts: [[-0.52, 0.42, '20°'], [0.2, -0.62, '40°']] }) },
      o: [T`$80^\circ$`, T`$60^\circ$`, T`$50^\circ$`, T`$40^\circ$`],
      a: 'B',
      s: [
        T`Kąty wpisane oparte na tym samym łuku są równe. Kąt $ACB$ jest oparty na łuku $AB$ tak jak kąt $ADB$, więc $|\sphericalangle ACB| = 20^\circ$.`,
        T`W trójkącie $BKC$: $|\sphericalangle KBC| = 40^\circ$ oraz $|\sphericalangle KCB| = 20^\circ$, więc $|\sphericalangle BKC| = 180^\circ - 40^\circ - 20^\circ = 120^\circ$.`,
        T`Kąty $DKC$ i $BKC$ są przyległe: $|\sphericalangle DKC| = 180^\circ - 120^\circ = 60^\circ$.`
      ],
      trap: T`Kąt $DKC$ nie jest kątem wpisanym (jego wierzchołek leży wewnątrz okręgu). Jest kątem zewnętrznym trójkąta $BKC$, więc jest równy sumie $40^\circ + 20^\circ$.`
    },
    {
      n: '24', pts: 1, t: 9, k: 'AB',
      q: T`Pole trójkąta równobocznego $T_1$ jest równe $\frac{(1{,}5)^2 \cdot \sqrt{3}}{4}$. Pole trójkąta równobocznego $T_2$ jest równe $\frac{(4{,}5)^2 \cdot \sqrt{3}}{4}$.` + '\n\n' + T`Dokończ zdanie tak, aby było prawdziwe. Wybierz właściwe zakończenie wraz z uzasadnieniem.` + '\n\n' + T`Trójkąt $T_2$ jest podobny do trójkąta $T_1$ w skali`,
      ab: ['$3$', '$9$'],
      r: [T`każdy z tych trójkątów ma dokładnie trzy osie symetrii`, T`pole trójkąta $T_2$ jest $9$ razy większe od pola trójkąta $T_1$`, T`bok trójkąta $T_2$ jest o $3$ dłuższy od boku trójkąta $T_1$`],
      a: 'A2',
      s: [
        T`Ze wzoru $P = \frac{a^2\sqrt{3}}{4}$ odczytujemy boki: trójkąt $T_1$ ma bok $1{,}5$, a trójkąt $T_2$ – bok $4{,}5$.`,
        T`Skala podobieństwa to stosunek boków: $\frac{4{,}5}{1{,}5} = 3$.`,
        T`Uzasadnienie: stosunek pól to $\frac{(4{,}5)^2}{(1{,}5)^2} = 9 = 3^2$, a pola figur podobnych pozostają w stosunku równym kwadratowi skali.`
      ],
      trap: T`Skala podobieństwa to stosunek DŁUGOŚCI ($3$), a nie pól ($9$). Bok $T_2$ jest o $3$ dłuższy – to prawda, ale skala to iloraz, nie różnica.`
    },
    {
      n: '25', pts: 1, t: 9, k: 'SC',
      q: T`Pole równoległoboku $ABCD$ jest równe $40\sqrt{6}$. Bok $AD$ tego równoległoboku ma długość $10$, a kąt $ABC$ równoległoboku ma miarę $135^\circ$ (zobacz rysunek).` + '\n\n' + SC + T`Długość boku $AB$ jest równa`,
      fig: { diagram: geo({ pts: { A: [0, 0, 'bl'], B: [13.86, 0, 'br'], C: [20.93, 7.07, 'tr'], D: [7.07, 7.07, 'tl'] }, segs: ['AB', 'BC', 'CD', 'DA'], texts: [[2.4, 4.3, '10'], [12.2, 1.1, '135°']], height: 240 }) },
      o: [T`$8\sqrt{3}$`, T`$8\sqrt{2}$`, T`$16\sqrt{2}$`, T`$16\sqrt{3}$`],
      a: 'A',
      s: [
        T`Pole równoległoboku: $P = |AB| \cdot |BC| \cdot \sin |\sphericalangle ABC|$, przy czym $|BC| = |AD| = 10$.`,
        T`$\sin 135^\circ = \sin 45^\circ = \frac{\sqrt{2}}{2}$, więc $40\sqrt{6} = |AB| \cdot 10 \cdot \frac{\sqrt{2}}{2} = 5\sqrt{2} \cdot |AB|$.`,
        T`$|AB| = \frac{40\sqrt{6}}{5\sqrt{2}} = 8\sqrt{3}$.`
      ],
      trap: T`$\sin 135^\circ$ jest DODATNI i równy $\sin 45^\circ$. Przy dzieleniu pierwiastków: $\frac{\sqrt{6}}{\sqrt{2}} = \sqrt{3}$.`,
      tip: T`Karta wzorów, str. 19: pole równoległoboku $P = a \cdot b \cdot \sin \alpha$.`
    },
    {
      n: '26', pts: 1, t: 5, k: 'SC',
      q: T`Funkcja liniowa $f$ jest określona wzorem $f(x) = -x + 1$. Funkcja $g$ jest liniowa. W kartezjańskim układzie współrzędnych $(x, y)$ wykres funkcji $g$ przechodzi przez punkt $P = (0, -1)$ i jest prostopadły do wykresu funkcji $f$.` + '\n\n' + SC + T`Wzorem funkcji $g$ jest`,
      o: [T`$g(x) = x + 1$`, T`$g(x) = -x - 1$`, T`$g(x) = -x + 1$`, T`$g(x) = x - 1$`],
      a: 'D',
      s: [
        T`Współczynnik kierunkowy funkcji $f$ to $-1$. Prosta prostopadła ma współczynnik $a$ spełniający $a \cdot (-1) = -1$, czyli $a = 1$.`,
        T`Wykres przechodzi przez punkt $(0, -1)$, więc wyraz wolny $b = -1$.`,
        T`$g(x) = x - 1$.`
      ],
      trap: T`Współczynnik $-1$ (odpowiedzi B i C) oznacza prostą RÓWNOLEGŁĄ do wykresu $f$, nie prostopadłą.`,
      scope: 'Od matury 2025 r. warunek prostopadłości prostych należy do zakresu rozszerzonego (podstawa 2024, IX.R4) – na arkuszu podstawowym takie zadanie już się nie pojawi.'
    },
    {
      n: '27', pts: 1, t: 10, k: 'SC',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ punkty $A = (-1, 5)$ oraz $C = (3, -3)$ są przeciwległymi wierzchołkami kwadratu $ABCD$.` + '\n\n' + SC + T`Pole kwadratu $ABCD$ jest równe`,
      o: [T`$8\sqrt{10}$`, T`$16\sqrt{5}$`, '$40$', '$80$'],
      a: 'C',
      s: [
        T`Odcinek $AC$ jest przekątną kwadratu: $|AC|^2 = (3 + 1)^2 + (-3 - 5)^2 = 16 + 64 = 80$.`,
        T`Pole kwadratu o przekątnej $d$: $P = \frac{d^2}{2}$.`,
        T`$P = \frac{80}{2} = 40$.`
      ],
      trap: T`Punkty $A$ i $C$ to wierzchołki PRZECIWLEGŁE, więc $|AC|$ jest przekątną, a nie bokiem. $80$ to kwadrat przekątnej, czyli dwa pola.`
    },
    {
      n: '28', pts: 1, t: 10, k: 'SC',
      q: T`W kartezjańskim układzie współrzędnych $(x, y)$ dane są punkty $A = (1, 7)$ oraz $P = (3, 1)$. Punkt $P$ dzieli odcinek $AB$ tak, że $|AP| : |PB| = 1 : 3$.` + '\n\n' + SC + T`Punkt $B$ ma współrzędne`,
      o: [T`$(9, -5)$`, T`$(9, -17)$`, T`$(7, -11)$`, T`$(5, -5)$`],
      a: 'B',
      s: [
        T`Przesunięcie z $A$ do $P$: o $3 - 1 = 2$ w poziomie i o $1 - 7 = -6$ w pionie.`,
        T`Odcinek $PB$ jest trzy razy dłuższy od $AP$ i ma ten sam kierunek, więc z $P$ do $B$ przesuwamy się o $3 \cdot 2 = 6$ w poziomie i o $3 \cdot (-6) = -18$ w pionie.`,
        T`$B = (3 + 6, 1 - 18) = (9, -17)$.`
      ],
      trap: T`Stosunek $1 : 3$ dotyczy części $AP$ i $PB$, a nie $AP$ i całego $AB$. Odcinek $AB$ jest CZTERY razy dłuższy od $AP$.`
    },
    {
      n: '29.1', pts: 1, t: 11, k: 'NUM',
      q: STEM29 + '\n\n' + T`Uzupełnij zdanie. Wpisz odpowiednią wartość liczbową.` + '\n\n' + T`Objętość tego ostrosłupa jest równa …`,
      a: '144',
      s: [
        T`Krawędź boczna prostopadła do płaszczyzny podstawy jest wysokością ostrosłupa: $H = 12$.`,
        T`Pole podstawy: $6^2 = 36$.`,
        T`$V = \frac{1}{3} \cdot 36 \cdot 12 = 144$.`
      ],
      trap: T`We wzorze na objętość ostrosłupa jest $\frac{1}{3}$. Bez niej wyszłoby $432$ – objętość graniastosłupa o tej samej podstawie i wysokości.`,
      tip: T`Karta wzorów, str. 25: $V = \frac{1}{3} P_p \cdot H$.`
    },
    {
      n: '29.2', pts: 1, t: 11, k: 'SC',
      q: STEM29 + '\n\n' + SC + T`Tangens kąta nachylenia najdłuższej krawędzi bocznej tego ostrosłupa do płaszczyzny podstawy jest równy`,
      o: [T`$\sqrt{2}$`, T`$\frac{\sqrt{6}}{3}$`, T`$\frac{\sqrt{2}}{2}$`, T`$\frac{\sqrt{3}}{3}$`],
      a: 'A',
      s: [
        T`Niech krawędź prostopadła do podstawy wychodzi z wierzchołka $A$ podstawy $ABCD$. Najdłuższa krawędź boczna łączy wierzchołek ostrosłupa z wierzchołkiem $C$ – najdalszym od $A$.`,
        T`Rzutem tej krawędzi na podstawę jest przekątna kwadratu: $|AC| = 6\sqrt{2}$.`,
        T`$\operatorname{tg} \alpha = \frac{H}{|AC|} = \frac{12}{6\sqrt{2}} = \frac{2}{\sqrt{2}} = \sqrt{2}$.`
      ],
      trap: T`Najdłuższa krawędź boczna biegnie do wierzchołka podstawy leżącego po PRZEKĄTNEJ, więc w mianowniku jest $6\sqrt{2}$, a nie $6$.`
    },
    {
      n: '30', pts: 1, t: 11, k: 'SC',
      q: T`Dany jest graniastosłup prawidłowy sześciokątny $ABCDEFA'B'C'D'E'F'$, w którym krawędź podstawy ma długość $5$. Przekątna $AD'$ tego graniastosłupa jest nachylona do płaszczyzny podstawy pod kątem $45^\circ$.` + '\n\n' + SC + T`Pole ściany bocznej tego graniastosłupa jest równe`,
      o: ['$12{,}5$', '$25$', '$50$', '$100$'],
      a: 'C',
      s: [
        T`Rzutem przekątnej $AD'$ na podstawę jest najdłuższa przekątna sześciokąta foremnego: $|AD| = 2 \cdot 5 = 10$.`,
        T`W trójkącie prostokątnym $ADD'$ kąt przy $A$ ma $45^\circ$, więc trójkąt jest równoramienny: $H = |DD'| = |AD| = 10$.`,
        T`Ściana boczna to prostokąt $5 \times 10$: jej pole jest równe $50$.`
      ],
      trap: T`Najdłuższa przekątna sześciokąta foremnego o boku $a$ ma długość $2a$ (dwa promienie okręgu opisanego), a nie $a$ ani $a\sqrt{3}$.`
    },
    {
      n: '31', pts: 1, t: 12, k: 'SC',
      q: SC + T`Wszystkich liczb naturalnych trzycyfrowych o sumie cyfr równej $3$ jest`,
      o: ['$8$', '$4$', '$5$', '$6$'],
      a: 'D',
      s: [
        T`Pierwsza cyfra nie może być zerem. Rozpatrujemy przypadki według cyfry setek.`,
        T`Cyfra setek $3$: $300$. Cyfra setek $2$: $210$, $201$. Cyfra setek $1$: $120$, $102$, $111$.`,
        T`Razem: $1 + 2 + 3 = 6$ liczb.`
      ],
      trap: T`Zapisy typu $030$ czy $012$ nie są liczbami trzycyfrowymi. Łatwo też przeoczyć liczbę $111$.`
    },
    {
      n: '32', pts: 2, t: 13, k: 'OPEN',
      q: T`Ze zbioru ośmiu kolejnych liczb naturalnych – od $1$ do $8$ – losujemy kolejno bez zwracania dwa razy po jednej liczbie. Niech $A$ oznacza zdarzenie polegające na tym, że suma wylosowanych liczb jest dzielnikiem liczby $8$.` + '\n\n' + T`Oblicz prawdopodobieństwo zdarzenia $A$. Zapisz obliczenia.`,
      a: T`$P(A) = \frac{8}{56} = \frac{1}{7}$`,
      s: [
        T`Losujemy kolejno dwie różne liczby z ośmiu: $|\Omega| = 8 \cdot 7 = 56$.`,
        T`Dzielniki liczby $8$ to $1, 2, 4, 8$. Najmniejsza możliwa suma dwóch różnych liczb to $1 + 2 = 3$, więc w grę wchodzą tylko sumy $4$ i $8$.`,
        T`Suma $4$: $(1, 3)$, $(3, 1)$. Suma $8$: $(1, 7)$, $(7, 1)$, $(2, 6)$, $(6, 2)$, $(3, 5)$, $(5, 3)$. Razem $|A| = 8$, więc $P(A) = \frac{8}{56} = \frac{1}{7}$.`
      ],
      trap: T`Losowanie BEZ zwracania wyklucza pary typu $(2, 2)$ i $(4, 4)$. Kolejność ma znaczenie, więc każdą parę różnych liczb liczymy dwa razy.`
    },
    {
      n: '33', pts: 4, t: 15, k: 'OPEN',
      q: T`Działka ma kształt trapezu. Podstawy $AB$ i $CD$ tego trapezu mają długości $|AB| = 400$ m oraz $|CD| = 100$ m. Wysokość trapezu jest równa $75$ m, a jego kąty $DAB$ i $ABC$ są ostre. Z działki postanowiono wydzielić plac w kształcie prostokąta z przeznaczeniem na parking. Dwa z wierzchołków tego prostokąta mają leżeć na podstawie $AB$ tego trapezu, a dwa pozostałe – $E$ oraz $F$ – na ramionach $AD$ i $BC$ trapezu (zobacz rysunek).` + '\n\n' + T`Wyznacz długości boków prostokąta, dla których powierzchnia wydzielonego placu będzie największa. Wyznacz tę największą powierzchnię. Zapisz obliczenia.` + '\n\n' + T`Wskazówka: aby powiązać ze sobą wymiary prostokąta, skorzystaj z tego, że pole trapezu $ABCD$ jest sumą pól trapezów $ABFE$ oraz $EFCD$.`,
      fig: { diagram: geo({ pts: { A: [0, 0, 'bl'], B: [400, 0, 'br'], C: [150, 75, 'tr'], D: [50, 75, 'tl'], E: [30, 45, 'l'], F: [250, 45, 'r'] }, segs: ['AB', 'BC', 'CD', 'DA', 'EF', [[30, 45], [30, 0]], [[250, 45], [250, 0]]], texts: [[100, 84, '100 m'], [200, -12, '400 m'], [140, 22, 'parking']], height: 220 }) },
      a: T`Boki prostokąta: $200$ m (wzdłuż podstawy $AB$) i $50$ m; największa powierzchnia: $10\,000$ m².`,
      s: [
        T`Oznaczmy: $x = |EF|$ – bok prostokąta równoległy do podstaw, $y$ – drugi bok (wysokość prostokąta), $0 < y < 75$. Pole trapezu $ABCD$: $\frac{400 + 100}{2} \cdot 75 = 18\,750$.`,
        T`Z równości pól: $\frac{400 + x}{2} \cdot y + \frac{x + 100}{2} \cdot (75 - y) = 18\,750$. Po uporządkowaniu: $300y + 75x = 30\,000$, czyli $x = 400 - 4y$.`,
        T`Pole prostokąta: $P(y) = x \cdot y = (400 - 4y) \cdot y = -4y^2 + 400y$ dla $y \in (0, 75)$.`,
        T`Ramiona paraboli są skierowane w dół, więc wartość największa jest w wierzchołku: $y = \frac{400}{8} = 50$ (należy do dziedziny). Wtedy $x = 400 - 200 = 200$, a pole jest równe $200 \cdot 50 = 10\,000$ m².`
      ],
      trap: T`Bok $x$ prostokąta zależy od jego wysokości $y$ – im wyżej leży odcinek $EF$, tym jest krótszy. Bez zależności $x = 400 - 4y$ nie da się zapisać pola jako funkcji jednej zmiennej.`,
      tip: T`Schemat za 4 pkt: zależność między wymiarami, funkcja pola jednej zmiennej z dziedziną, wierzchołek paraboli, odpowiedź z oboma bokami i polem.`
    }
  ]
};

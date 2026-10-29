# Analiza arkuszy CKE – matematyka, poziom podstawowy (Formuła 2023)

> Stan: 2026-10-27 · Dane: [`arkusze_pp_2022_2026.json`](arkusze_pp_2022_2026.json) (560 zadań z 16 arkuszy i zasad oceniania CKE)
> Skrypty: `scripts/math_pp/analysis/analyze.py` (parser arkuszy i kluczy), `remap.py` (numeracja wymagań → podstawa 2024), `compare_keys.py` (klucze w aplikacji vs PDF CKE)

## 1. Materiał

| Okres | Arkusze | Punkty na arkusz | Zadania otwarte (pkt) |
| :--- | :--- | :---: | :---: |
| 2022–2024 (podstawa 2018) | próbne XII 2022 i XII 2023, przykładowy 2023, matury V/VI/VIII 2023 i 2024 | 46 | 17–19 pkt (≈ 39%) |
| od XII 2024 (podstawa 2024) | próbna XII 2024, matury V/VI/VIII 2025, próbna III 2026, matury V/VI 2026 | **50** | **25 pkt (50%)** |

Od matury 2025 połowa punktów to zadania otwarte. Na arkuszu jest 9–10 zadań rozszerzonej odpowiedzi:
- 2 pkt – 61%;
- 3 pkt – 22%;
- 4 pkt – 16%.

Na każdym arkuszu jest 1–2 dowody (algebraiczny `I.2` lub geometryczny `VIII.11`). Zadania zamknięte to:
- 21–23 zadania ABCD;
- 2–4 zadania P/F;
- czasem dobieranie.

## 2. Wagi działów (arkusze od XII 2024, udział w punktach)

| Grupa wymagań | Udział | Najczęstsze wymagania |
| :--- | :---: | :--- |
| V. Funkcje | 17% | V.4 (odczyt z wykresu), V.11 (zastosowania), V.9 |
| I. Liczby rzeczywiste | 15% | I.4 (potęgi i pierwiastki), I.2 (dowody), I.6, I.9 |
| VI. Ciągi | 10% | VI.7, VI.6, VI.5, VI.4 |
| VIII. Planimetria | 9% | VIII.5, VIII.1 |
| XII. Statystyka i prawdopodobieństwo | 9% | XII.2, XII.1 |
| X. Stereometria | 8% | **X.5 – najczęstsze wymaganie na arkuszach (15 zadań)**, X.4 |
| III. Równania i nierówności | 8% | III.4 (kwadratowe) |
| IX. Geometria analityczna | 7% | IX.4, IX.3, IX.2 |
| VII. Trygonometria | 6% | VII.1, VII.2 |
| IV, II, XI | 2–3% każda | IV.1, II.1, XI.2 |

## 3. Zmiany zakresu (podstawa 2024) i ich skutki w aplikacji

| Zmiana | Skutek |
| :--- | :--- |
| Warunek prostopadłości prostych przeszedł do PR (`IX.R4`) | Lekcja 10.3 dostała nowy zakres „Wzajemne położenie prostych i proste równoległe” (`IX.1`, `IX.2`). Dwa archiwalne zadania CKE (czerwiec 2023 zad. 26, maj 2024 zad. 23) zostają w arkuszach, ale mają uwagę `scopeNote` / `outsideScope2025`. |
| Odchylenie standardowe usunięte z PP (`XII.2`: średnia, średnia ważona, mediana, dominanta) | Lekcja 14.4 to teraz „Dominanta i dane pogrupowane”; z opisu działu 14 usunięto odchylenie. |
| Wyrażenia wymierne w PP: tylko mnożenie i dzielenie (`II.4`) | Zadania otwarte 2.4 dotyczą tylko dzielenia i mnożenia, z dziedziną. |
| Nowe w PP: `V.13` (f(x) = a/x), `VIII.10` (punkty szczególne trójkąta), `VIII.11` (dowody geometryczne), `VIII.3` (wielokąty foremne), `X.1` (proste skośne) | Wymagania mają zadania otwarte w lekcjach 4.5, 9.5, 9.3 i 11.3. |

## 4. Co zmieniono w kursie PP

- **4 zadania otwarte w każdej lekcji** (pozycje 17–20, razem 300). Ocena etapami jak w zasadach oceniania CKE (`rubric_stages`, `scoring_key`, `zero_rules`):
  - 290 `OPEN_CALCULATION`, 10 `OPEN_PROOF`;
  - punktacja: 252 × 2 pkt, 24 × 3 pkt, 24 × 4 pkt (stereometria 3 pkt, optymalizacja i ostrosłupy 4 pkt).
- Zadania zamknięte (pozycje 01–16) się nie zmieniły. Wyjątek to lekcje 10.3 i 14.4, które dostały nowy zakres.
- Każda lekcja deklaruje wymagania podstawy 2024 (`scripts/math_pp/requirements.js`). Build odrzuca kody spoza PP.
  - **Pokrycie: 73 z 73 wymagań PP.**
- Kontrola wyników w generatorach (`scripts/math_pp/open_a.js`, `open_b.js`, `open_c.js`):
  - arytmetyka każdego zadania jest sprawdzana niezależnie;
  - kombinatoryka, prawdopodobieństwo, statystyka i optymalizacja są dodatkowo sprawdzane przez pełne przeliczenie: wszystkie liczby n-cyfrowe, permutacje, pary rzutów, przegląd funkcji celu na siatce.

### Świadome różnice względem arkuszy
- Pula ma więcej zadań 2-punktowych (84%) niż arkusz (61%). Lekcja trwa 4–6 minut, więc trening etapów zaczyna się od krótszych zadań. Zadania 3–4 pkt są w działach, w których CKE je daje: stereometria, optymalizacja, ostrosłupy, twierdzenie cosinusów, wartości skrajne funkcji kwadratowej.
- Dowody (`OPEN_PROOF`) są w lekcjach dowodowych 2.1, 2.5 i 9.3, a nie rozproszone po całym kursie.

## 5. Weryfikacja kluczy arkuszy w aplikacji

`compare_keys.py` porównuje 211 zadań z 6 arkuszy w aplikacji (V/VI/VIII 2023 i 2024) z kluczami z PDF CKE:
- **punkty i klucze zamknięte są zgodne**;
- zgłoszone różnice wynikają z ograniczeń parsera (wieloliniowe klucze wersji A/B, zadania wielokrotnego wyboru) i zostały sprawdzone ręcznie.

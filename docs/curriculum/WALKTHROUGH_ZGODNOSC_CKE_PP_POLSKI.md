# Walkthrough: zgodność matematyki PP i języka polskiego z arkuszami CKE

> Stan: 2026-10-27 · Analiza arkuszy matematyki: [`matematyka_pp/ANALIZA_ARKUSZY_PP.md`](matematyka_pp/ANALIZA_ARKUSZY_PP.md)

## Matematyka – poziom podstawowy

### Audyt
`scripts/math_pp/audit.js` sprawdził 1500 zadań i 75 pigułek:
- 0 błędów klucza, KaTeX-u, formalizmu logicznego i zapisu dziesiętnego;
- komplet sekcji Bento we wszystkich pigułkach.

Arkusze CKE w aplikacji (211 zadań z 6 arkuszy) mają punkty i klucze zgodne z PDF-ami CKE (`analysis/compare_keys.py`).

Rozbieżności z maturą od 2025 r.:

| Problem | Poprawka |
| :--- | :--- |
| Kurs nie miał żadnego zadania otwartego, a od matury 2025 to 50% punktów arkusza | 300 zadań otwartych (4 na lekcję) z etapami CKE (`scripts/math_pp/open_a.js`, `open_b.js`, `open_c.js`) |
| Lekcja 10.3 uczyła prostych prostopadłych (od 2024 r. PR, `IX.R4`) | Nowy zakres: wzajemne położenie prostych, proste równoległe, punkt przecięcia (`IX.1`, `IX.2`) |
| Lekcja 14.4 uczyła odchylenia standardowego (usuniętego z PP) | „Dominanta i dane pogrupowane”; poprawiony też opis działu 14 w `MATH_SECTIONS` |
| Wymagania `V.13`, `VIII.3`, `VIII.10`, `VIII.11`, `X.1` nie miały zadań | Zadania otwarte w lekcjach 4.5, 9.3, 9.5 i 11.3. Mapa lekcja → wymagania jest w `requirements.js` i pokrywa 73 z 73 wymagań PP. |
| 2 archiwalne zadania CKE o prostopadłości (VI 2023 zad. 26, V 2024 zad. 23) | Zostają w arkuszach, ale dostały pola `outsideScope2025` i `scopeNote` oraz akapit „Zakres od 2025 r.” w wyjaśnieniu |

### Jak zbudowane są zadania otwarte
- Format jak w zasadach oceniania CKE: `rubric_stages` (etapy rosnąco, ostatni = komplet punktów), `scoring_key` i `zero_rules`.
- Typy: 290 `OPEN_CALCULATION`, 10 `OPEN_PROOF`. Punktacja: 2 pkt (252 zadania), 3 pkt (24), 4 pkt (24).
- Każdy generator sam sprawdza arytmetykę zadania. Kombinatoryka, prawdopodobieństwo, statystyka i optymalizacja mają dodatkowo pełne przeliczenie:
  - przegląd wszystkich liczb n-cyfrowych;
  - wszystkie permutacje i pary rzutów;
  - przegląd funkcji celu na siatce.
- Pozycje 01–16 każdej lekcji się nie zmieniły (sprawdzone porównaniem z `HEAD`). Wyjątek to lekcje 10.3 i 14.4, którym zmieniono zakres.
- Audyt dostał dokładniejsze reguły. Teraz nie zgłasza:
  - prostopadłości w planimetrii i stereometrii (w PP jest, np. `X.1`);
  - wartości funkcji logarytmicznej (`V.14`);
  - tego samego polecenia z innym wykresem.

## Język polski

| Problem | Poprawka |
| :--- | :--- |
| 16 tekstów napisanych na potrzeby aplikacji miało prawdziwych autorów, m.in. Tokarczuk, Kołakowskiego, Głowińskiego, Dukaja, Harariego. Niektóre nosiły tytuły ich prawdziwych książek, np. „Czuły narrator”, „Płytki umysł”, „Nowomowa po polsku”, „Po piśmie”. | Autorzy fikcyjni z etykietą „(tekst ćwiczeniowy JASNE)” i neutralne tytuły; poprawione też wszystkie odwołania w pytaniach i notatkach wzorcowych |
| 28 zadań podawało fałszywe źródło („CKE Maj 2023” itd.), choć ich treści nie ma w arkuszach | „Ćwiczenie JASNE w formacie CKE (Formuła 2023)”. Zostały 3 zadania, których tekst rzeczywiście pochodzi z arkuszy. |
| Brakowało lektur obowiązkowych PP z podstawy 2024: „Skąpiec”, „Miejsce”, „Profesor Andrews w Warszawie”, „Podróże z Herodotem” | Karty lektur (`maturaLektury.ts`) i 52 zadania testu historycznoliterackiego. Nowe zadania mają kolejne numery ID, więc ID dotychczasowych zadań się nie zmieniły. |
| „Kordian” i „Treny” były oznaczone jako lektury PP z gwiazdką | Opis zgodny z informatorem 2025: to lektury PR. W teście PP nie są sprawdzane, ale w wypracowaniu PP można się do nich odwołać, a w latach 2025–2028 także do lektur z listy 2018. |

`scripts/polish_audit.py` porównuje tekst aplikacji z arkuszami i informatorami CKE (wspólne fragmenty po 6 wyrazów):
- 0 deklaracji źródła bez pokrycia w arkuszach;
- 0 błędnych kluczy P/F. Wcześniej zgłoszone błędy wynikały z błędu skryptu: czytał pole `correct` zamiast `isTrue`.

## Weryfikacja
- `node scripts/math_pp/build.js`: 0 błędów (1500 zadań, 1500 unikalnych treści).
- `node scripts/math_pp/build_cke.js`: 0 błędów (211 zadań).
- `node scripts/math_pp/audit.js pp` i `node scripts/math_pp/audit.js pr`: 0 uwag.
- `npx tsc --noEmit`: 0 błędów. `npx vitest run`: wynik w opisie PR.

## Zgodność z Bazą Wiedzy JASNE
- **Core-4 – Format Matrix:** pula lekcji PP łączy ABCD, P/F, `NUMERIC_INPUT`, `OPEN_CALCULATION` i `OPEN_PROOF`. Sesja dalej losuje 3 zadania zamknięte i 2 otwarte (`drawSessionTasks`). Lekcja 2.3 nie potrzebuje już wyjątku.
- **Core-4 – Trap-Driven Explanations:** każde zadanie otwarte ma pole `trap` z przyczyną typowego błędu oraz wskazówkę z numerem strony karty wzorów CKE.
- **Core-4 – Readable Formulas:** zadania PP nie używają symboli logiki formalnej. Lint buildu wychwycił „1x”, „1\sqrt” i niedomknięte `$`.
- **Model danych / Firestore cache-first:** zmienione są tylko dane generowane do `src/data/math/generated` i `seed/curriculum`. Seed nie został wysłany do Firestore, a `src/` nie importuje `seed/`.
- **BFF:** bez zmian w kluczach i w proxy AI. Ocena etapami (`rubric_stages`) korzysta z istniejącej ścieżki w `SessionRunner`.
- **Model biznesowy i retencja:** bez zmian w ekonomii (serca, monety, limity AI). Nowe zadania wpisują się w istniejące zdarzenia sukcesu sesji.

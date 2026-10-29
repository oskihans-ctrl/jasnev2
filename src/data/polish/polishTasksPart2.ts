import { PolishTask } from '../../types/maturaTypes';

export const POLISH_TASKS_PART_2: PolishTask[] = [
  // ==========================================
  // 1. STAROŻYTNOŚĆ I BIBLIA (Występowalność 100%)
  // ==========================================
  {
    id: 'pol-p2-001',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Starożytność i Biblia',
    taskType: 'single_choice',
    title: 'Archetypy antyczne: Postawa prometejska',
    points: 1,
    question: 'Na czym polega postawa prometejska w kulturze europejskiej, biorąc za punkt wyjścia mit o Prometeuszu?',
    options: [
      'A. Na bezwzględnym posłuszeństwie wobec woli bogów w zamian za pomyślność doczesną.',
      'B. Na heroicznym buncie przeciwko siłom wyższym i bezinteresownym cierpieniu w imię dobra ludzkości.',
      'C. Na dążeniu do poznania tajemnic kosmosu kosztem utraty życia doczesnego.',
      'D. Na pogodzeniu się z nieuchronnością losu i fatum (amor fati).'
    ],
    correctOptionIndex: 1,
    explanation: 'Prometeizm to postawa altruistycznego buntu przeciw bogom (lub Bogu) w celu ulżenia cierpieniom ludzi, co wiąże się ze świadomą ofiarą z samego siebie.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-002',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Starożytność i Biblia',
    taskType: 'short_open',
    title: 'Księga Koheleta i motyw vanitas',
    points: 1,
    passage: {
      author: 'Biblia Tysiąclecia',
      sourceTitle: 'Księga Koheleta (Koh 1, 2)',
      text: 'Marność nad marnościami, powiada Kohelet, marność nad marnościami – wszystko marność. Cóż przyjdzie człowiekowi z całego trudu, jaki zadaje sobie pod słońcem?'
    },
    question: 'Podaj łacińską nazwę motywu obecnego w przytoczonym fragmencie oraz wyjaśnij, jakie przesłanie niesie on dla człowieka według autora biblijnego.',
    correctAnswerText: 'Motyw: Vanitas (marność). Przesłanie: Dobra doczesne, bogactwo, władza, uroda i ziemska mądrość są nietrwałe, przemijające i nie zapewniają wiecznego szczęścia, dlatego człowiek powinien zachować umiar i skierować serce ku Bogu.',
    ckeKeyCriteria: [
      '1 pkt – poprawne podanie nazwy motywu (vanitas) oraz trafne wyjaśnienie przesłania o nietrwałości i znikomości dóbr ziemskich.',
      '0 pkt – brak nazwy motywu lub błędna interpretacja.'
    ],
    explanation: 'Topos vanitas z Księgi Koheleta pojawia się w arkuszach CKE w odniesieniu do poezji barokowej (Naborowski, Sęp Szarzyński) oraz ikonografii.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-003',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Starożytność i Biblia',
    taskType: 'matching',
    title: 'Frazeologizmy biblijne i ich znaczenie',
    points: 2,
    question: 'Połącz związek frazeologiczny pochodzenia biblijnego (lewa) z jego właściwym sensem metaforycznym (prawa).',
    matchingPairs: [
      { left: 'Hiobowa wieść', right: 'Przerażająca, tragiczna wiadomość o nieszczęściu' },
      { left: 'Sądny dzień', right: 'Czas ostatecznego rozrachunku, zamieszanie, chaos' },
      { left: 'Kolos na glinianych nogach', right: 'Coś potężnego na pozór, lecz opartego na kruchych podstawach' },
      { left: 'Wdowi grosz', right: 'Niewielka materialnie ofiara dana z ogromnym wyrzeczeniem' }
    ],
    explanation: 'Znajomość frazeologii biblijnej i mitologicznej jest standardowym elementem sprawdzianu językowego i kulturowego CKE.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 2. ŚREDNIOWIECZE (Występowalność 62.5%)
  // ==========================================
  {
    id: 'pol-p2-004',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Średniowiecze',
    taskType: 'short_open',
    title: 'Motyw Deesis w Bogurodzicy',
    points: 2,
    passage: {
      sourceTitle: 'Bogurodzica (strofa 1–2)',
      text: 'Bogurodzica dziewica, Bogiem sławiena Maryja, / U twego syna Gospodzina Matko zwolena, Maryja! / Zyszczy nam, spuści nam. / Kyrieleison. / Twego dziela Krzciciela, bożyce, / Usłysz głosy, napełń myśli człowiecze...'
    },
    question: 'Zdefiniuj motyw Deesis i wykaż, w jaki sposób realizuje się on w kompozycji pierwszych dwóch strof Bogurodzicy.',
    correctAnswerText: 'Motyw Deesis to kompozycja ikonograficzna i literacka przedstawiająca Chrystusa jako Sędziego w otoczeniu orędowników ludzkości: Matki Boskiej oraz Jana Chrzciciela. W Bogurodzicy uobecnia się poprzez skierowanie modlitw w 1. strofie do Maryi, a w 2. strofie za pośrednictwem Jana Chrzciciela do Chrystusa.',
    ckeKeyCriteria: [
      '2 pkt – poprawna definicja Deesis (orędownictwo Maryi i Jana Chrzciciela u Chrystusa) oraz wskazanie obu orędowników w strofach Bogurodzicy.',
      '1 pkt – podanie tylko definicji LUB wskazanie postaci bez wyjaśnienia idei orędownictwa.',
      '0 pkt – błędna definicja.'
    ],
    explanation: 'Deesis (z gr. modlitwa, prośba) to fundamentalna koncepcja teologiczna średniowiecza obecna w architekturze, malarstwie i tekście najstarszej polskiej pieśni religijnej.',
    sourceYear: 'CKE Czerwiec 2023'
  },
  {
    id: 'pol-p2-005',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Średniowiecze',
    taskType: 'single_choice',
    title: 'Danse macabre w Rozmowie Mistrza Polikarpa ze Śmiercią',
    points: 1,
    question: 'Jaka prawda o kondycji człowieka wypływa z motywu tańca śmierci (danse macabre) ukazanego w „Rozmowie Mistrza Polikarpa ze Śmiercią”?',
    options: [
      'A. Śmierć można przekupić modlitwą i hojną jałmużną.',
      'B. Wobec nieuchronności śmierci wszyscy ludzie – bez względu na stan, bogactwo czy urząd – są równi.',
      'C. Ludzie wykształceni (jak Mistrz Polikarp) unikają sądu pośmiertnego.',
      'D. Śmierć karze wyłącznie grzeszników, oszczędzając ludzi sprawiedliwych.'
    ],
    correctOptionIndex: 1,
    explanation: 'Danse macabre unaoczniał egalitaryzm śmierci – w korowodzie uczestniczą papież, cesarz, żebrak, rycerz i dziecko.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 3. RENESANS (Występowalność 87.5%)
  // ==========================================
  {
    id: 'pol-p2-006',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Renesans',
    taskType: 'short_open',
    title: 'Kryzys światopoglądowy w Trenach Jana Kochanowskiego',
    points: 2,
    passage: {
      author: 'Jan Kochanowski',
      sourceTitle: 'Tren IX / Tren X',
      text: 'Kupić by cię, Mądrości, za drogie pieniądze! [...] / Nieszczęśliwy ja człowiek, którym lata swoje / Na tym strawił, żebych był ujrzał progi twoje! / Terazem ze stopniów zrzucon i jednaki / Z innemi... / Gdzieśkolwiek jest, jeśliś jest, lituj mej żałości...'
    },
    question: 'Na czym polegał kryzys humanizmu i filozofii stoickiej ukazany w Trenach IX i X? Odwołaj się do sytuacji lirycznej ojca po stracie córki.',
    correctAnswerText: 'Kryzys polegał na załamaniu wiary w stoicką cnotę i mądrość, która miała chronić człowieka przed cierpieniem i rozpaczą. Śmierć Urszulki obnażyła bezradność filozofii wobec osobistej tragedii. Kochanowski podważa dotychczasowy dorobek życia, a w Trenie X dochodzi nawet do kryzysu wiary religijnej (wątpliwość w życie pozagrobowe: „Gdzieśkolwiek jest, jeśliś jest”).',
    ckeKeyCriteria: [
      '2 pkt – pełne wyjaśnienie kryzysu filozofii stoickiej (bezradność mądrości) oraz kryzysu metafizycznego/religijnego w obliczu żałoby ojca.',
      '1 pkt – wskazanie jedynie smutku po stracie córki bez odniesienia do załamania stoickiego ideału mędrca.',
      '0 pkt – odpowiedź niepoprawna.'
    ],
    explanation: 'Treny to cykl dokumentujący drogę od rozpaczy i buntu przeciw filozofii stoickiej aż po ukojenie w Trenie XIX.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 4. BAROK (Występowalność 75.0%)
  // ==========================================
  {
    id: 'pol-p2-007',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Barok',
    taskType: 'matching',
    title: 'Środki poetyckie baroku konceptualnego',
    points: 2,
    question: 'Dopasuj barokowy zabieg stylistyczny do jego definicji.',
    matchingPairs: [
      { left: 'Koncept', right: 'Zaskakujący pomysł poetycki organizujący kompozycję całego utworu' },
      { left: 'Paradoks', right: 'Sformułowanie pozornie sprzeczne z logiką, niosące głębszą prawdę' },
      { left: 'Antyteza', right: 'Zestawienie dwóch przeciwstawnych znaczeniowo elementów lub obrazów' },
      { left: 'Hiperbola', right: 'Wyolbrzymienie cech zjawiska lub emocji w celu wzmocnienia ekspresji' }
    ],
    explanation: 'Poezja dworska Morsztyna i metafizyczna Naborowskiego opierała się na operowaniu zaskakującym konceptem i figurami paradoksu.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 5. ROMANTYZM (Występowalność 100% - Ranga Krytyczna)
  // ==========================================
  {
    id: 'pol-p2-008',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Romantyzm',
    lektura: 'Dziady cz. III (Adam Mickiewicz)',
    isStarRequired: true,
    taskType: 'short_open',
    title: 'Wielka Improwizacja – Bunt Konrada',
    points: 2,
    passage: {
      author: 'Adam Mickiewicz',
      sourceTitle: 'Dziady cz. III (Akt I, scena 2)',
      text: 'Ja kocham cały naród! – objąłem w ramiona / Wszystkie jego przeszłe i przyszłe pokolenia [...] / Daj mi rząd dusz! [...] / Ja najwyższy z czujących na niebiosów dziele! / Jeżeli Ty w niebiosach jesteś tylko mądrością, a nie miłością...'
    },
    question: 'Wskaż dwa przejawy pychy Konrada (hybris) w Wielkiej Improwizacji i wyjaśnij, w czyim imieniu występuje bohater przeciwko Bogu.',
    correctAnswerText: '1. Przejawy pychy: Konrad stawia siebie na równi z Bogiem lub wyżej od Niego (twierdzi, że Bóg jest tylko mądrością, a on sam miłością), żąda od Boga władzy absolutnej („rząd dusz”) nad ludzkimi myślami i uczuciami. 2. Występuje w imieniu ciemiężonego narodu polskiego oraz całej cierpiącej ludzkości („Ja i ojczyzna to jedno. Nazywam się Milijon – bo za milijony kocham i cierpię katusze”).',
    ckeKeyCriteria: [
      '2 pkt – poprawne wskazanie dwóch przejawów pychy Konrada oraz wyjaśnienie, że buntuje się z miłości do narodu i cierpiących ludzi (indywidualizm mesjanistyczny).',
      '1 pkt – podanie tylko jednego przejawu pychy LUB brak wskazania, w czyim imieniu występuje.',
      '0 pkt – odpowiedź błędna.'
    ],
    explanation: 'Konrad to typowy bohater prometejski – jego grzechem jest bezgraniczna pycha i próba bluźnierstwa, lecz ratuje go czysta, bezinteresowna miłość do ojczyzny.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-009',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Romantyzm',
    lektura: 'Dziady cz. III (Adam Mickiewicz)',
    isStarRequired: true,
    taskType: 'true_false',
    title: 'Prawda / Fałsz: Znajomość fabuły Dziadów cz. III',
    points: 1,
    question: 'Oceń prawdziwość stwierdzeń dotyczących III części „Dziadów” Adama Mickiewicza.',
    trueFalseStatements: [
      {
        statement: 'W Widzeniu Księdza Piotra naród polski zostaje przedstawiony w analogii do cierpienia i zmartwychwstania Chrystusa (mesjanizm narodowy).',
        isTrue: true,
        explanation: 'Prawda: Polska jest ukazana jako „Chrystus narodów”, a zaborcy odpowiadają oprawcom ukrzyżowania.'
      },
      {
        statement: 'Podczas Salonu Warszawskiego polska arystokracja i urzędnicy carscy gorąco dyskutują o prześladowaniach młodzieży w Wilnie.',
        isTrue: false,
        explanation: 'Fałsz: Towarzystwo przy stoliku (arystokracja, generałowie) rozmawia po francusku o balach i nudzie, unikając tematu patriotyzmu, o którym rozmawia młodzież stojąca przy drzwiach.'
      }
    ],
    explanation: 'Scena Salonu Warszawskiego ukazuje fundamentalny podział narodu polskiego na kosmopolityczne elity i wierną młodzież patriotyczną.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-010',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Romantyzm',
    lektura: 'Kordian (Juliusz Słowacki)',
    isStarRequired: true,
    taskType: 'short_open',
    title: 'Winkelriedyzm Kordiana na szczycie Mont Blanc',
    points: 2,
    question: 'Jakie hasło ideowe ogłasza Kordian na szczycie Mont Blanc i czym różni się jego koncepcja (winkelriedyzm) od mickiewiczowskiego mesjanizmu z Dziadów cz. III?',
    correctAnswerText: 'Kordian ogłasza hasło: „Polska Winkelriedem narodów!”. W odróżnieniu od mesjanizmu Mickiewicza (gdzie Polska biernie cierpi jak Chrystus i czeka na zmartwychwstanie), winkelriedyzm Słowackiego wzywa do aktywnej, zbrojnej walki narodowowyzwoleńczej i ściągnięcia na siebie bagnetów wroga, aby dać wolność innym narodom Europy.',
    ckeKeyCriteria: [
      '2 pkt – podanie hasła („Polska Winkelriedem narodów”) oraz precyzyjne wykazanie opozycji: czynna walka/aktywizm (Słowacki) vs bierne cierpienie/odkupienie (Mickiewicz).',
      '1 pkt – podanie tylko hasła bez zestawienia z mesjanizmem.',
      '0 pkt – brak odpowiedzi.'
    ],
    explanation: 'Kluczowe zagadnienie sporów romantycznych o drogi do niepodległości.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 6. POZYTYWIZM (Występowalność 100% - Ranga Krytyczna)
  // ==========================================
  {
    id: 'pol-p2-011',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Pozytywizm',
    lektura: 'Lalka (Bolesław Prus)',
    isStarRequired: true,
    taskType: 'short_open',
    title: 'Stanisław Wokulski na pograniczu dwóch epok',
    points: 2,
    passage: {
      author: 'Bolesław Prus',
      sourceTitle: 'Lalka (rozmyślania Wokulskiego)',
      text: 'Wokulski z dumą myślał o swoich sklepach, o kapitale, o spółce do handlu ze wschodem. A jednocześnie czuł, że to wszystko niczym jest wobec jednego spojrzenia panny Izabeli... „Wariat! – szeptał – romantyk z epoki przedpotopowej!”'
    },
    question: 'Podaj jedną cechę pozytywisty i jedną cechę romantyka w osobowości Stanisława Wokulskiego, uzasadniając każdą z nich przykładem z powieści.',
    correctAnswerText: '1. Cecha pozytywisty: kult nauki, przedsiębiorczość i praca organiczna (finansowanie badań Geista i Ochockiego, założenie spółki handlowej, pomoc ubogim w ruinach Powiśla – Mariannie, Wysockiemu). 2. Cecha romantyka: idealistyczna, niszcząca miłość do kobiety (wyniesienie Izabeli Łęckiej na piedestał), udział w powstaniu styczniowym oraz wewnętrzne rozdarcie i próba samobójcza w Skierniewicach.',
    ckeKeyCriteria: [
      '2 pkt – podanie po jednej cesze z obu epok z trafnym odniesieniem do faktów z biografii Wokulskiego.',
      '1 pkt – wymienienie cech bez konkretnych przykładów z lektury Lalka.',
      '0 pkt – błędne przyporządkowanie cech.'
    ],
    explanation: 'Wokulski jako bohater synkretyczny (łączący ideały romantyczne z pozytywistycznymi) to absolutny pewniak maturalny CKE.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-012',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Pozytywizm',
    lektura: 'Lalka (Bolesław Prus)',
    isStarRequired: true,
    taskType: 'true_false',
    title: 'Prawda / Fałsz: Wydarzenia i postacie w Lalce',
    points: 1,
    question: 'Oceń prawdziwość poniższych zdań na temat lektury „Lalka” Bolesława Prusa.',
    trueFalseStatements: [
      {
        statement: 'Ignacy Rzecki w swoim pamiętniku wyznaje kult dynastii Bonapartych i wierzy w nadejście wolności dzięki potomkom Napoleona.',
        isTrue: true,
        explanation: 'Prawda: Rzecki jest starym subiektem i bonapartystą, co wielokrotnie ujawnia w „Pamiętniku starego subiekta”.'
      },
      {
        statement: 'Julian Ochocki zrezygnował z kariery naukowej, aby przejąć sklep galanteryjny Wokulskiego po jego wyjeździe.',
        isTrue: false,
        explanation: 'Fałsz: Ochocki był bezkompromisowym naukowcem marzącym o machinie latającej lżejszej od powietrza; sklep przejął Henryk Szlangbaum.'
      }
    ],
    explanation: 'Szczegółowa weryfikacja losów drugoplanowych bohaterów Lalki.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 7. MŁODA POLSKA (Występowalność 87.5%)
  // ==========================================
  {
    id: 'pol-p2-013',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Młoda Polska',
    lektura: 'Wesele (Stanisław Wyspiański)',
    isStarRequired: true,
    taskType: 'matching',
    title: 'Osoby dramatu i zjawy w Weselu',
    points: 2,
    question: 'Dopasuj zjawę z Wesela (kolumna lewa) do postaci ze świata realnego, której się ukazuje (kolumna prawa).',
    matchingPairs: [
      { left: 'Chochoł', right: 'Isia (oraz zgromadzeni goście weselni w finale)' },
      { left: 'Widmo (zmarły malarz Ludwik de Laveaux)', right: 'Marysia' },
      { left: 'Stańczyk', right: 'Dziennikarz (Rudolf Starzewski)' },
      { left: 'Rycerz Czarny (Zawisza Czarny)', right: 'Poeta (Kazimierz Przerwa-Tetmajer)' },
      { left: 'Wernyhora', right: 'Gospodarz (Włodzimierz Tetmajer)' }
    ],
    explanation: 'Zjawy w Weselu są personifikacją skrywanych lęków, wyrzutów sumienia i marzeń bohaterów bronowickiej chaty.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },
  {
    id: 'pol-p2-014',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Młoda Polska',
    lektura: 'Wesele (Stanisław Wyspiański)',
    isStarRequired: true,
    taskType: 'short_open',
    title: 'Symbolika Złotego Rogu i Chocholego Tańca',
    points: 2,
    question: 'Wyjaśnij znaczenie symboliczne zgubienia Złotego Rogu przez Jaśka oraz sens sceny finałowego Chocholego Tańca.',
    correctAnswerText: 'Złoty Róg symbolizował sygnał do ogólnonarodowego powstania i zjednoczenia Polaków w walce o wolność. Zgubienie go przez Jaśka (z chciwości po czapkę z pawich piór) oznacza zaprzepaszczenie dziejowej szansy przez niedojrzałość i egoizm. Chocholi taniec symbolizuje marazm, uśpienie, zniewolenie duchowe i niemoc polskiego społeczeństwa, które nie dorosło do czynu niepodległościowego.',
    ckeKeyCriteria: [
      '2 pkt – trafna interpretacja Złotego Rogu (szansa na wolność utracona przez próżność/egoizm) oraz Chocholego Tańca (letarg, zniewolenie, marazm).',
      '1 pkt – wyjaśnienie tylko jednego z dwóch symboli.',
      '0 pkt – brak odpowiedzi.'
    ],
    explanation: 'Scena tańca chocholego to kulminacja dramatu narodowego Wyspiańskiego.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 8. WOJNA I OKUPACJA / XX WIEK (Występowalność 87.5%)
  // ==========================================
  {
    id: 'pol-p2-015',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Wojna i okupacja',
    lektura: 'Inny świat (Gustaw Herling-Grudziński)',
    isStarRequired: true,
    taskType: 'short_open',
    title: 'Koncepcja człowieka złagrowanego',
    points: 2,
    passage: {
      author: 'Gustaw Herling-Grudziński',
      sourceTitle: 'Inny świat',
      text: 'Człowiek jest ludzki w ludzkich warunkach, i uważałem za szaleństwo sądzić go według norm, jakie stworzyliśmy w warunkach innych. [...] Obóz był światem na opak, gdzie głód łamał wszelkie hamulce moralne.'
    },
    question: 'Wyjaśnij, czym według Herlinga-Grudzińskiego różni się świat obozowy od świata wolnego oraz podaj przykład bohatera, który poddał się regułom łagru.',
    correctAnswerText: 'Świat łagru („inny świat”) to system totalitarny stworzony w celu całkowitej deprawacji i dehumanizacji człowieka poprzez głód, niewolniczą pracę i strach, w którym tradycyjna moralność ulega unieważnieniu. Przykładem jest Kostylew (który opalał rękę w ogniu, by nie pracować dla oprawców, lecz ostatecznie popełnił samobójstwo) lub Marusia, Michaił Kostylew, czy więźniowie donoszący na współtowarzyszy za miskę zupy.',
    ckeKeyCriteria: [
      '2 pkt – wyjaśnienie mechanizmu dehumanizacji i zniszczenia moralności w obozie oraz przywołanie konkretnej postaci z Innego świata.',
      '1 pkt – ogólnikowe stwierdzenie o głodzie bez analizy kondycji moralnej lub brak postaci.',
      '0 pkt – brak odpowiedzi.'
    ],
    explanation: 'Inny świat ukazuje zderzenie etyki chrześcijańskiej i humanistycznej z mechanizmem sowieckiego Gułagu.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  },

  // ==========================================
  // 9. IKONOGRAFIA MATURALNA (Dzieło sztuki w relacji do epoki)
  // ==========================================
  {
    id: 'pol-p2-016',
    part: 2,
    partName: 'Test historycznoliteracki',
    epoch: 'Barok',
    taskType: 'short_open',
    title: 'Ikonografia: Motyw Vanitas w malarstwie barokowym',
    points: 2,
    imageCaption: 'Juan de Valdés Leal, „In ictu oculi” (W mgnieniu oka), 1672',
    question: 'Wskaż dwa elementy symboliczne na obrazie Juana de Valdésa Leala przedstawiającym szkielet gaszący świecę i powiąż ich wymowę z barokowym topossem przemijania (vanitas).',
    correctAnswerText: '1. Elementy kompozycji: kościotrup gaszący palcami płomień świecy (symbol nagłego, nieodwracalnego ugaszenia ludzkiego życia w mgnieniu oka) oraz leżące na ziemi korony, tiary, księgi i bogactwa (symbol doczesnych zaszczytów i wiedzy). 2. Powiązanie z motywem vanitas: Obraz unaocznia, że wobec śmierci wszelka doczesna władza, uroda i zaszczyty okazują się bezwartościową marnością, a koniec nadchodzi niespodziewanie.',
    ckeKeyCriteria: [
      '2 pkt – wskazanie co najmniej dwóch konkretnych elementów obrazu i ich trafna interpretacja w kontekście barokowego toposu vanitas.',
      '1 pkt – wskazanie tylko jednego elementu lub powierzchowne omówienie.',
      '0 pkt – brak odniesienia do dzieła sztuki.'
    ],
    explanation: 'W arkuszach CKE (np. Maj 2024) regularnie pojawia się zadanie z dziełem sztuki i lekturą/toposem epoki.',
    sourceYear: 'Ćwiczenie JASNE w formacie CKE (Formuła 2023)'
  }
];

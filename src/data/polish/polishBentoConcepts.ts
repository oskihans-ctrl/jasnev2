import { PolishBentoConcept } from '../../types/lessonTypes';

/**
 * Kompletny bank pojęć Bento dla wszystkich 24 lekcji języka polskiego CKE Formuła 2023.
 * Każde pojęcie składa się z 4 filarów Core-4:
 * 1. Name & Tag (precyzyjna nazwa i ranga egzaminacyjna)
 * 2. Simple Definition ("Z polskiego na nasze")
 * 3. Context Example (realne odniesienie do lektury lub arkusza)
 * 4. CKE Trap (konkretne ostrzeżenie przed pułapką klucza CKE)
 */
export const POLISH_LESSON_CONCEPTS: Record<string, PolishBentoConcept[]> = {
  // =========================================================================
  // MODUŁ I: CZĘŚĆ 1 CKE – JĘZYK POLSKI W UŻYCIU & NOTATKA SYNTETYZUJĄCA
  // =========================================================================
  'lekcja-1': [
    {
      id: 'c-1-1',
      name: 'Fakt a Opinia w tekście',
      tag: 'Pewniak CKE',
      simpleDefinition: 'Fakt to informacja obiektywna, sprawdzalna i bezsporna (np. liczby, daty, wydarzenia). Opinia to subiektywny osąd, ocena lub komentarz autora niosący ładunek emocjonalny.',
      contextExample: 'Fakt: „W 2023 roku Polskę odwiedziło 18 milionów turystów”. Opinia: „Masowa turystyka degraduje duchowe piękno i tożsamość europejskich miast”.',
      ckeTrap: 'Egzaminatorzy w zadaniach Prawda/Fałsz podają subiektywny osąd autora jako bezsporny fakt naukowy LUB odwrotnie: twierdzenie kategoryczne autora przedstawiają jako jego prywatne przypuszczenie.'
    },
    {
      id: 'c-1-2',
      name: 'Manipulacja semantyczna',
      tag: 'Klucz CKE',
      simpleDefinition: 'Celowy dobór słownictwa o silnym zabarwieniu emocjonalnym (eufemizmy lub dysfemizmy), aby narzucić czytelnikowi określoną ocenę zjawiska bez podawania logicznych argumentów.',
      contextExample: 'Zamiana określenia neutralnego „zwolnienia pracowników” na eufemizm „optymalizacja zasobów ludzkich” albo nazwanie demonstracji „chaosem wywołanym przez watahę”.',
      ckeTrap: 'Mylenie manipulacji z perswazją. Perswazja jest jawna i uczciwa (autor otwarcie przekonuje do swoich racji), a manipulacja działa z ukrycia i fałszuje proporcje faktów.'
    },
    {
      id: 'c-1-3',
      name: 'Kwantyfikator skrajny',
      tag: 'Pułapka P/F',
      simpleDefinition: 'Wyraz oznaczający zakres bezwzględny, nieznoszący wyjątków: „zawsze”, „nigdy”, „wszyscy”, „wyłącznie”, „każdy”.',
      contextExample: 'Jeśli w tekście autor napisał: „Wielu turystów ulega reklamom”, a w tabeli maturalnej napisano: „Wszyscy turyści bez wyjątku bezrefleksyjnie ulegają reklamom”.',
      ckeTrap: 'Kwantyfikator skrajny w tezie zadania P/F niemal w 90% przypadków oznacza odpowiedź FAŁSZ, chyba że w tekście źródłowym autor użył dokładnie takiego samego słowa kategorycznego.'
    }
  ],

  'lekcja-2': [
    {
      id: 'c-2-1',
      name: 'Funkcja impresywna (apelatywna)',
      tag: 'Pewniak CKE',
      simpleDefinition: 'Nastawienie wypowiedzi na odbiorcę w celu wywołania u niego określonej reakcji, zmiany poglądów lub nakłonienia go do działania.',
      contextExample: '„Zatrzymaj się na chwilę. Wyłącz telefon, odłóż aparat i po prostu przeżywaj zachwyt nad światem!” (tryb rozkazujący, wołacz, postulaty).',
      ckeTrap: 'Napisanie w uzasadnieniu jedynie: „wypowiedź służy nakłonieniu czytelnika”. CKE wymaga wskazania KONKRETNEGO środka językowego (np. czasowniki w trybie rozkazującym) oraz DOKŁADNEGO celu apelu.'
    },
    {
      id: 'c-2-2',
      name: 'Pytanie retoryczne',
      tag: 'Środek retoryczny',
      simpleDefinition: 'Pytanie zadane nie po to, by uzyskać odpowiedź, lecz by skłonić odbiorcę do głębokiej refleksji lub zasugerować oczywistą dla autora tezę.',
      contextExample: '„Czy podróż ma jeszcze sens, gdy zamiast pytać o drogę tubylców, sprawdzamy jedynie algorytm mapy w telefonie?”',
      ckeTrap: 'Podanie samej nazwy zabiegu bez określenia funkcji. Klucz CKE zawsze punktuje wzór: NAZWA (pytanie retoryczne) + EFEKT (zmuszenie czytelnika do zastanowienia się nad zanikiem autentyczności podróżowania).'
    },
    {
      id: 'c-2-3',
      name: 'Zabieg inkluzywny (1. os. l. mn.)',
      tag: 'Zabieg perswazji',
      simpleDefinition: 'Użycie czasowników w 1. osobie liczby mnogiej („zastanówmy się”, „wszyscy wiemy”, „zauważmy”), aby zatrzeć dystans między autorem a odbiorcą i zbudować poczucie wspólnoty.',
      contextExample: '„Wszyscy codziennie wpadamy w pułapkę powierzchownego scrollowania wiadomości”.',
      ckeTrap: 'Mylenie zabiegu ze zwykłą funkcją informacyjną. Użycie „my” to celowa strategia retoryczna solidaryzowania odbiorcy z autorem.'
    },
    {
      id: 'c-2-4',
      name: 'Antyteza (Zestawienie kontrastowe)',
      tag: 'Figura stylistyczna',
      simpleDefinition: 'Zestawienie dwóch skrajnie przeciwstawnych znaczeniowo pojęć lub obrazów w jednym zdaniu w celu uwypuklenia paradoksu.',
      contextExample: '„Mamy dziś tysiące wirtualnych znajomych, lecz nigdy nie byliśmy tak samotni”.',
      ckeTrap: 'Mylenie antytezy z oksymoronem. Oksymoron to związek dwóch wyrazów stojących obok siebie („żywy trup”), a antyteza to cała konstrukcja zdaniowa zestawiająca dwa sądy.'
    }
  ],

  'lekcja-3': [
    {
      id: 'c-3-1',
      name: 'Teza a Hipoteza',
      tag: 'Logika wywodu',
      simpleDefinition: 'Teza to twierdzenie pewne, którego autor jest przekonany i które udowadnia. Hipoteza to przypuszczenie wymagające dopiero weryfikacji i zbadania argumentami.',
      contextExample: 'Teza: „Sztuczna inteligencja zrewolucjonizuje edukację”. Hipoteza: „Być może za dekadę algorytmy zastąpią tradycyjnych nauczycieli”.',
      ckeTrap: 'Uznanie zdania z pytajnikiem na początku tekstu za tezę. Często jest to dopiero pytanie badawcze lub hipoteza wprowadzająca do właściwej tezy postawionej w rozwinięciu.'
    },
    {
      id: 'c-3-2',
      name: 'Argument logiczny a emocjonalny',
      tag: 'Retoryka CKE',
      simpleDefinition: 'Argument logiczny opiera się na związkach przyczynowo-skutkowych i dedukcji („jeśli A, to B”). Argument emocjonalny odwołuje się do lęku, litości, dumy lub poczucia winy odbiorcy.',
      contextExample: 'Logiczny: „Brak snu obniża koncentrację o 40%, co prowadzi do błędów na egzaminie”. Emocjonalny: „Pomyśl o rozpaczy rodziców, gdy zobaczysz swój zerowy wynik”.',
      ckeTrap: 'Uznanie argumentu emocjonalnego za argument merytoryczny/rzeczowy. CKE najwyżej punktuje argumenty rzeczowe (fakty, statystyki, badania) i logiczne.'
    },
    {
      id: 'c-3-3',
      name: 'Dylemat etyczny w tekście',
      tag: 'Analiza problemowa',
      simpleDefinition: 'Sytuacja wyboru między dwiema równorzędnymi racjami moralnymi, w której każda decyzja niesie za sobą negatywne lub bolesne konsekwencje.',
      contextExample: 'Spór o granice autonomii sztucznej inteligencji vs ochrona prywatności obywateli.',
      ckeTrap: 'Sprowadzanie dylematu do prostego konfliktu „dobro kontra zło”. W prawdziwym dylemacie obie racje mają mocne uzasadnienia etyczne.'
    }
  ],

  'lekcja-4': [
    {
      id: 'c-4-1',
      name: 'Synteza dwugłosowa',
      tag: 'Standard CKE 4 pkt',
      simpleDefinition: 'Połączenie w jedną spójną wypowiedź dwóch różnych stanowisk autorów, wskazujące na czym polega ich spór oraz co stanowi ich wspólną płaszczyznę refleksji.',
      contextExample: '„Anna Zielińska krytykuje masową turystykę za komercjalizację kultury, podczas gdy Ewa Nowicka dostrzega w podróży szansę na empatię. Obie autorki zgadzają się jednak, że wartość wyprawy zależy od intencji samego wędrowca”.',
      ckeTrap: 'Napisanie dwóch osobnych streszczeń tekstu 1 i tekstu 2 połączonych słowem „a”. CKE wymaga uogólnienia scalającego obie perspektywy!'
    },
    {
      id: 'c-4-2',
      name: 'Rygor objętościowy (60–90 słów)',
      tag: 'Żelazne kryterium',
      simpleDefinition: 'Ścisła dyscyplina długości notatki. Tekst liczący 59 słów lub 91 słów skutkuje natychmiastową utratą 1 punktu za kompozycję na maturze.',
      contextExample: 'Idealnie skomponowana notatka ma 70–80 wyrazów i mieści się dokładnie w 3–4 zdaniach złożonych.',
      ckeTrap: 'Dopisywanie na końcu własnych opinii („Moim zdaniem podróże kształcą”), by dobić do limitu słów. Za wprowadzenie treści spoza tekstów traci się punkty za zgodność z tematem!'
    },
    {
      id: 'c-4-3',
      name: 'Kohezja tekstu ciągłego',
      tag: 'Warsztat pisarski',
      simpleDefinition: 'Płynne zespolenie zdań za pomocą spójników i zaimków, uniemożliwiające traktowanie notatki jako przypadkowej listy haseł.',
      contextExample: 'Użycie łączników: „Z kolei...”, „Podczas gdy...”, „W konsekwencji obaj autorzy dochodzą do wniosku, że...”.',
      ckeTrap: 'Punktowanie w punktach (myślnikach) lub dzielenie notatki na krótkie, urywane zdania pojedyncze. Notatka musi być jednym zwartym akapitem tekstu ciągłego.'
    }
  ],

  'lekcja-5': [
    {
      id: 'c-5-1',
      name: 'Parafraza uogólniająca',
      tag: 'Technika CKE',
      simpleDefinition: 'Oddanie głównej myśli autora własnymi słowami na wyższym poziomie ogólności, bez cytowania i bez przepisywania całych zdań z arkusza.',
      contextExample: 'Zamiast: „Zielińska pisze, że turyści biegają z aparatami po placu św. Marka i kupują pamiątki z Chin” -> Parafraza: „Zielińska zwraca uwagę na redukcję doświadczenia kulturowego do powierzchownej konsumpcji”.',
      ckeTrap: 'Cytowanie fragmentów tekstu w cudzysłowie w notatce syntetyzującej. Każdy dosłowny cytat zabiera cenne słowa z limitu i świadczy o braku umiejętności syntetyzowania.'
    },
    {
      id: 'c-5-2',
      name: 'Wskaźnik zespolenia (konektor)',
      tag: 'Poprawność językowa',
      simpleDefinition: 'Wyrażenie logiczne pokazujące stosunek między myślami dwóch autorów: kontrast, wynikanie, uzupełnienie.',
      contextExample: '„W przeciwieństwie do...”, „Natomiast...”, „Wspólnym mianownikiem obu ujęć pozostaje...”.',
      ckeTrap: 'Nadużywanie potocznego spójnika „natomiast” na początku zdania lub wielokrotne powtarzanie tego samego łącznika („i”, „oraz”).'
    },
    {
      id: 'c-5-3',
      name: 'Streszczenie a Synteza',
      tag: 'Pułapka metodologiczna',
      simpleDefinition: 'Streszczenie opowiada treść tekstu krok po kroku. Synteza wydobywa wyłącznie nadrzędny problem i zestawia wnioski obu autorów.',
      contextExample: 'Streszczenie opisuje przykłady podane w akapicie 2 i 3. Synteza mówi: „Oba artykuły podejmują problem relacji człowieka z upływem czasu”.',
      ckeTrap: 'Przepisywanie szczegółowych przykładów ilustracyjnych (np. o zegarkach czy biletach lotniczych) zamiast nazwania problemu ogólnego.'
    }
  ],

  // =========================================================================
  // MODUŁ II: TEST HISTORYCZNOLITERACKI & EPOKI CKE
  // =========================================================================
  'lekcja-6': [
    {
      id: 'c-6-1',
      name: 'Katharsis (Oczyszczenie)',
      tag: 'Tragedia grecka ★',
      simpleDefinition: 'Stan duchowego wyzwolenia i oczyszczenia emocjonalnego, jaki przeżywa widz tragedii pod wpływem litości (eleos) i trwogi (phobos).',
      contextExample: 'Widz Antygony Sofoklesa współczuje bohaterce skazanej na śmierć i odczuwa grozę wobec nieuchronności wyroków losu.',
      ckeTrap: 'Twierdzenie, że katharsis przeżywa bohater tragedii. Katharsis to kategoria dotycząca wyłącznie PSYCHIKI ODBIORCY (widza/czytelnika).'
    },
    {
      id: 'c-6-2',
      name: 'Konflikt tragiczny i Hybris',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Konflikt tragiczny to zderzenie dwóch równorzędnych racji (prawo boskie vs prawo państwowe), w którym każdy wybór prowadzi do katastrofy. Hybris to pycha i zuchwalstwo bohatera wobec praw wyższych.',
      contextExample: 'Antygona broni prawa boskiego nakazującego pochować brata Polinika, a Kreon broni prawa stanowionego i autorytetu państwa. Pycha Kreona ściąga klątwę na Teby.',
      ckeTrap: 'Błędem kardynalnym jest napisanie, że Kreon kierował się złośliwością lub że Antygona żałowała swojego czynu i błagała o ułaskawienie.'
    },
    {
      id: 'c-6-3',
      name: 'Topos Vanitas (Marność)',
      tag: 'Topos biblijny',
      simpleDefinition: 'Motyw zaczerpnięty z biblijnej Księgi Koheleta („Vanitas vanitatum et omnia vanitas”), głoszący znikomość, nietrwałość i kruchość wszelkich dóbr doczesnych.',
      contextExample: 'Kohelet przypomina, że bogactwo, uroda, zaszczyty i ziemska mądrość przeminą bez śladu, dlatego jedyną stałą wartością jest bojaźń Boża.',
      ckeTrap: 'Mylenie toposu vanitas z pesymizmem nihilistycznym. Kohelet nie nawołuje do rozpaczy ani samobójstwa, lecz do zachowania umiaru i cieszenia się prostym życiem z Bogiem.'
    },
    {
      id: 'c-6-4',
      name: 'Postawa prometejska',
      tag: 'Archetyp antyczny',
      simpleDefinition: 'Heroiczny bunt jednostki przeciwko bogom lub siłom wyższym, podjęty z bezinteresownej miłości do ludzkości i okupiony cierpieniem.',
      contextExample: 'Prometeusz kradnie ogień bogów, by podarować go bezbronnym ludziom, za co zostaje przykuty do skały Kaukazu.',
      ckeTrap: 'Mylenie prometeizmu z tyranią lub zwykłą walką o władzę. Istotą prometeizmu jest CAŁKOWITY ALTRUIZM i gotowość na samotne męczeństwo.'
    }
  ],

  'lekcja-7': [
    {
      id: 'c-7-1',
      name: 'Motyw Deesis (Orędownictwo)',
      tag: 'Pewniak CKE',
      simpleDefinition: 'Średniowieczna kompozycja literacko-ikonograficzna przedstawiająca Chrystusa jako Sędziego w otoczeniu orędowników ludzkości: Matki Boskiej i Jana Chrzciciela.',
      contextExample: 'W Bogurodzicy 1. strofa to modlitwa do Maryi, a 2. strofa to prośba do Chrystusa przez wzgląd na zasługi Jana Chrzciciela („Twego dziela Krzciciela”).',
      ckeTrap: 'Wskazanie w Bogurodzicy jako orędownika św. Piotra, św. Wojciecha lub Józefa. Deesis w kanonie CKE tworzą wyłącznie: CHRYSTUS, MARYJA i JAN CHRZCICIEL.'
    },
    {
      id: 'c-7-2',
      name: 'Danse macabre (Taniec Śmierci)',
      tag: 'Topos średniowieczny',
      simpleDefinition: 'Alegoryczny korowód ludzi wszystkich stanów prowadzony przez rozkładającego się trupa lub szkielet z kosą, unaoczniający absolutny egalitaryzm śmierci.',
      contextExample: 'W „Rozmowie Mistrza Polikarpa ze Śmiercią” Śmierć tańczy zarówno z papieżem i cesarzem, jak i z żebrakiem, kupcem czy dzieckiem.',
      ckeTrap: 'Twierdzenie, że Śmierć w danse macabre karze wyłącznie grzeszników. Jej przesłaniem jest EGALITARYZM – nikt, bez względu na urząd, bogactwo czy świętość, nie uniknie grobu.'
    },
    {
      id: 'c-7-3',
      name: 'Teocentryzm i Hagiografia',
      tag: 'Światopogląd epoki',
      simpleDefinition: 'Teocentryzm stawia Boga w centrum wszechświata jako cel i sens wszelkiego istnienia. Hagiografia to żywoty świętych ukazujące parenetyczny wzorzec ascezy i wyrzeczenia.',
      contextExample: 'Legenda o św. Aleksym – książę porzuca bogactwo, poślubioną żonę i żyje jako nierozpoznany żebrak pod schodami własnego ojca.',
      ckeTrap: 'Nazywanie średniowiecza „wiekami ciemnymi” w analizie maturalnej. CKE wymaga szacunku dla głębokiej filozofii chrześcijańskiej i uniwersalizmu tamtej kultury.'
    }
  ],

  'lekcja-8': [
    {
      id: 'c-8-1',
      name: 'Kryzys humanizmu i stoicyzmu',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Załamanie wiary w potęgę ludzkiego rozumu i stoicką cnotę (apatheia), która miała chronić przed cierpieniem. Śmierć dziecka dowodzi bezradności filozofii.',
      contextExample: 'Jan Kochanowski w Trenie IX i X gorzko wyznaje, że mądrość stoicka nie ocaliła go przed rozpaczą ojca, a w Trenie X dochodzi do zwątpienia w życie pozagrobowe („Gdzieśkolwiek jest, jeśliś jest”).',
      ckeTrap: 'Twierdzenie, że Treny kończą się ateizmem i rozpaczą. Cykl kończy Tren XIX (Sen), w którym zmarła matka z Urszulką na ręku przynosi poecie chrześcijańskie ukojenie i powrót do równowagi.'
    },
    {
      id: 'c-8-2',
      name: 'Hamartia Makbeta (Wina tragiczna)',
      tag: 'Tragedia szekspirowska ★',
      simpleDefinition: 'Błędna ocena własnego położenia wynikająca z pychy i niepohamowanej ambicji, która uruchamia łańcuch nieodwracalnych zbrodni.',
      contextExample: 'Makbet wierzy w dwuznaczną przepowiednię czarownic i uważa, że morderstwo króla Dunkana da mu władzę, tymczasem wpada w pułapkę tyranii i krwawego obłędu.',
      ckeTrap: 'Usprawiedliwianie Makbeta wpływem czarownic lub żony. W dramacie Szekspira wiedźmy jedynie kuszą, lecz decyzję o morderstwie podejmuje Makbet W RAMACH WŁASNEJ WOLNEJ WOLI.'
    },
    {
      id: 'c-8-3',
      name: 'Somnambulizm Lady Makbet',
      tag: 'Motyw maturalny',
      simpleDefinition: 'Obłęd i nocne wędrówki we śnie jako somatyczny objaw nieuleczalnych wyrzutów sumienia z powodu popełnionego morderstwa.',
      contextExample: 'Lady Makbet w scenie obłędu bezskutecznie próbuje zmyć z dłoni niewidzialną krew Dunkana, powtarzając: „Jeszcze czuć krew; wszystkie wonności Arabii nie osłodzą tej małej ręki”.',
      ckeTrap: 'Przedstawianie Lady Makbet jako bezdusznego potwora do samego końca. Jej obłęd i samobójcza śmierć dowodzą, że ludzkie sumienie nie wytrzymuje ciężaru zbrodni.'
    }
  ],

  'lekcja-9': [
    {
      id: 'c-9-1',
      name: 'Koncept (Konceptyzm barokowy)',
      tag: 'Poezja barokowa',
      simpleDefinition: 'Zaskakujący, błyskotliwy pomysł poetycki organizujący kompozycję całego wiersza, którego celem jest zaszokowanie i zachwycenie czytelnika.',
      contextExample: 'Jan Andrzej Morsztyn w sonecie „Do trupa” zestawia nieszczęśliwie zakochanego z leżącym trupem, dowodząc paradoksalnie, że trup znajduje się w lepszym położeniu.',
      ckeTrap: 'Mylenie konceptu ze zwykłą metaforą. Koncept to nadrzędna OŚ KOMPOZYCYJNA całego utworu, a nie pojedyncze porównanie.'
    },
    {
      id: 'c-9-2',
      name: 'Sarmatyzm i jego dwa oblicza',
      tag: 'Kultura epoki',
      simpleDefinition: 'Ideologia i styl życia polskiej szlachty wywodzącej swój ród od starożytnych Sarmatów. Łączyła rycerski patriotyzm z ksenofobią, pijaństwem i megalomanią.',
      contextExample: 'Jasna strona: męstwo w obronie ojczyzny i wiary (Chocim u Wacława Potockiego). Ciemna strona: warcholstwo i pieniactwo (Pamiętniki Jana Chryzostoma Paska).',
      ckeTrap: 'Jednostronne ocenianie sarmatyzmu. Na maturze należy wskazywać zarówno cechy pozytywne (tradycjonalizm, gościnność), jak i wady ustrojowe (liberum veto, pycha).'
    },
    {
      id: 'c-9-3',
      name: 'Dydaktyzm oświeceniowy (Uczyć bawiąc)',
      tag: 'Oświecenie ★',
      simpleDefinition: 'Zasada podporządkowania literatury celom wychowawczym i moralnym – wyśmiewanie ludzkich wad i przesądów za pomocą humoru, ironii i satyry.',
      contextExample: 'Ignacy Krasicki w bajkach („Kruk i lis”, „Jagnię i wilcy”) oraz satyrach („Pijaństwo”, „Do króla”) krytykuje naiwność, hipokryzję i pijaństwo rodaków.',
      ckeTrap: 'Dosłowne odczytywanie bajek Krasickiego jako opowiastek o zwierzętach. Postacie zwierzęce to alegorie uniwersalnych ludzkich postaw i mechanizmów władzy.'
    }
  ],

  'lekcja-10': [
    {
      id: 'c-10-1',
      name: 'Prometeizm Konrada',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Bunt przeciw Bogu podjęty w imię bezgranicznej miłości do ciemiężonego narodu, połączony z gotowością na potępienie własnej duszy dla zbawienia milionów.',
      contextExample: 'Wielka Improwizacja w Dziadach cz. III: „Nazywam się Milijon – bo za milijony kocham i cierpię katusze”. Konrad żąda od Boga „rządu dusz”.',
      ckeTrap: 'BŁĄD KARDYNALNY: Twierdzenie, że Konrad w Wielkiej Improwizacji nazwał Boga carem! Konrad mdleje z wyczerpania, a bluźniercze słowo „carem!” dopowiada kuszący go szatan.'
    },
    {
      id: 'c-10-2',
      name: 'Hybris Konrada (Grzech pychy)',
      tag: 'Dramat romantyczny ★',
      simpleDefinition: 'Romantyczna pycha i poczucie absolutnej wyższości nad światem i Stwórcą. Konrad stawia swoją miłość ponad mądrość Boga.',
      contextExample: '„Ja najwyższy z czujących na niebiosów dziele! / Jeżeli Ty w niebiosach jesteś tylko mądrością, a nie miłością...”.',
      ckeTrap: 'Uznanie Konrada za postać jednoznacznie potępioną. Choć zgrzeszył bezgraniczną pychą, jego intencja była czysta (miłość do ojczyzny), dlatego w scenie Egzorcyzmów zostaje ocalony przez pokornego ks. Piotra.'
    },
    {
      id: 'c-10-3',
      name: 'Metamorfoza romantyczna (Gustaw -> Konrad)',
      tag: 'Bohater romantyczny',
      simpleDefinition: 'Symboliczna przemiana nieszczęśliwego kochanka kobiety w bojownika o wolność całego narodu.',
      contextExample: 'W Prologu Dziadów cz. III więzień pisze węglem na ścianie celi: „Gustavus obiit... natus est Conradus” (Zmarł Gustaw, narodził się Konrad).',
      ckeTrap: 'Mylenie wątków Gustawa z Dziadów cz. IV (kochanek zrozpaczony po ślubie Maryli) z Konradem z Dziadów cz. III (mistyczny wódz narodu).'
    }
  ],

  'lekcja-11': [
    {
      id: 'c-11-1',
      name: 'Mesjanizm narodowy (Polska Chrystusem Narodów)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Historiozoficzna koncepcja Adama Mickiewicza przypisująca cierpieniom Polski sens odkupicielski dla całej Europy – tak jak Chrystus umarł i zmartwychwstał, tak Polska przez zabory zbawi wolność świata.',
      contextExample: 'Widzenie Księdza Piotra: zabory to ukrzyżowanie Polski (Gal zmywa ręce jak Piłat, car to Herod), a zmartwychwstanie przyniesie tajemniczy mąż o imieniu „czterdzieści i cztery”.',
      ckeTrap: 'Utożsamianie mesjanizmu z zachętą do zbrojnego powstania. Mesjanizm Mickiewicza zakładał BIERNE, mistyczne cierpienie i zaufanie wyrokom Opatrzności Bożej.'
    },
    {
      id: 'c-11-2',
      name: 'Martyrologia młodzieży wileńskiej',
      tag: 'Motyw męczeństwa',
      simpleDefinition: 'Przedstawienie carskich prześladowań polskich patriotów w kategoriach religijnego męczeństwa niewiniątek.',
      contextExample: 'Scena więzienna: opowieść Sobolewskiego o wywózce kibitkami na Sybir, katowaniu młodzieży (Janczewski, Wasilewski z rozkrzyżowanymi ramionami jak Chrystus).',
      ckeTrap: 'Mylenie Nowosilcowa z carem. Nowosilcow był carskim senatorem i bezwzględnym wykonawcą represji w Wilnie, a nie samym władcą Rosji.'
    },
    {
      id: 'c-11-3',
      name: 'Pokora Księdza Piotra vs Pycha Konrada',
      tag: 'Opozycja postaw CKE',
      simpleDefinition: 'Zestawienie dwóch dróg poznania Boga w Dziadach cz. III: dumny bunt intelektualny Konrada prowadzi do upadku, natomiast franciszkańska pokora księdza Piotra („panie, czymże ja jestem przed Twoim obliczem? Proch i nic”) otwiera tajemnice przyszłości.',
      contextExample: 'Ksiądz Piotr otrzymuje łaskę proroczego widzenia losów ojczyzny, której Bóg odmówił pysznemu Konradowi.',
      ckeTrap: 'Twierdzenie, że to Konrad miał widzenie o Polsce jako Chrystusie Narodów. Widzenie miał WYŁĄCZNIE KSIĄDZ PIOTR (Scena 5).'
    }
  ],

  'lekcja-12': [
    {
      id: 'c-12-1',
      name: 'Metafora Lawy (Podział narodu polskiego)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Słynna diagnoza społeczeństwa polskiego wygłoszona przez Piotra Wysockiego w Salonie Warszawskim: z wierzchu zimna, plugawa skorupa (elity), wewnątrz płonąca, czysta lawa (naród i młodzież).',
      contextExample: '„Nasz naród jak lawa, / Z wierzchu zimna i twarda, sucha i plugawa, / Lecz wewnętrznego ognia sto lat nie wyziębi; / Plwajmy na tę skorupę i zstąpmy do głębi!”.',
      ckeTrap: 'Przypisanie słów o lawie Konradowi lub samemu Mickiewiczowi jako narratorowi. Słowa te wypowiada PIOTR WYSOCKI przy drzwiach Salonu Warszawskiego.'
    },
    {
      id: 'c-12-2',
      name: 'Kosmopolityzm i serwilizm elit',
      tag: 'Krytyka arystokracji',
      simpleDefinition: 'Pogarda arystokracji dla własnej kultury ojczystej, bezrefleksyjne naśladowanie obcych wzorców (francuszczyzna) oraz służalczość wobec carskiego zaborcy dla zachowania majątków.',
      contextExample: 'Towarzystwo przy stoliku w Salonie Warszawskim rozmawia po francusku o balach, narzeka na nudę polskich wierszy i boi się słuchać o cierpieniu Cichowskiego.',
      ckeTrap: 'Uogólnienie, że cały naród polski zdradził sprawę niepodległości. Mickiewicz wyraźnie kontrastuje zdrajców przy stoliku z patriotyczną młodzieżą stojącą przy drzwiach.'
    },
    {
      id: 'c-12-3',
      name: 'Sen Senatora (Mechanizm strachu przed carem)',
      tag: 'Psychologia tyranii',
      simpleDefinition: 'Ukazanie groteskowej natury władzy totalitarnej opartej wyłącznie na carskiej łasce – nagły uśmiech cara wynosi na szczyty pychy, a jeden carski grymas strąca w nicość i pogardę otoczenia.',
      contextExample: 'Nowosilcow we śnie śni o zaszczytach, orderach i uniżoności dworzan, dopóki car na niego nie spojrzy chłodno – wtedy wszyscy uciekają od niego z obrzydzeniem.',
      ckeTrap: 'Interpretowanie Snu Senatora jako realistycznego wydarzenia fabularnego. Jest to scena oniryczna (sen zesłany przez diabły) obnażająca małość tyrana.'
    }
  ],

  'lekcja-13': [
    {
      id: 'c-13-1',
      name: 'Winkelriedyzm Kordiana',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Idea aktywnej, zbrojnej walki o niepodległość ogłoszona przez Kordiana na szczycie Mont Blanc: Polska ma przyjąć na siebie ciosy zaborcy jak szwajcarski bohater Arnold Winkelried, by dać wolność innym ludom Europy.',
      contextExample: 'Hasło: „Polska Winkelriedem narodów!”. Kordian rzuca wyzwanie bierności i podejmuje samotną próbę zamachu na cara Mikołaja I.',
      ckeTrap: 'Mylenie winkelriedyzmu Słowackiego z mesjanizmem Mickiewicza. Mesjanizm to BIERNE odkupienie przez cierpienie (Chrystus), a winkelriedyzm to CZYNNA, heroiczna walka zbrojna (rycerz).'
    },
    {
      id: 'c-13-2',
      name: 'Strach i Imaginacja (Kryzys psychiczny Kordiana)',
      tag: 'Dramat romantyczny ★',
      simpleDefinition: 'Personifikacje lęków i wewnętrznych skrupułów moralnych Kordiana pod drzwiami carskiej sypialni, które paraliżują jego wolę i uniemożliwiają dokonanie zamachu.',
      contextExample: 'Kordian mdleje przed sypialnią cara, obnażając słabość jednostki niezdolnej do skrytobójczego morderstwa z zimną krwią.',
      ckeTrap: 'Błędem kardynalnym jest napisanie, że Kordian zabił cara Mikołaja I i został koronowany na króla Polski. Kordian zemdlał i został aresztowany przez carską straż.'
    },
    {
      id: 'c-13-3',
      name: 'Arkadia szlachecka w Panu Tadeuszu',
      tag: 'Epopeja narodowa ★',
      simpleDefinition: 'Mityczna kraina ładu, harmonii z naturą, tradycji i gościnności, stanowiąca ostoję polskości w czasach utraty niepodległości.',
      contextExample: 'Dwór w Soplicowie – „centrum polszczyzny”, gdzie zegar bije Mazurka Dąbrowskiego, a dzień upływa pod dyktando etykiety Sędziego.',
      ckeTrap: 'Uznanie Soplicowa za miejsce idealne bez wad. Mickiewicz ukazuje także warcholstwo, kłótliwość i pieniactwo szlachty, które doprowadza do zbrojnego zajazdu na dwór Horeszków.'
    },
    {
      id: 'c-13-4',
      name: 'Ewolucja Jacka Soplicy (Ksiądz Robak)',
      tag: 'Bohater dynamiczny',
      simpleDefinition: 'Droga od warchoła, dumnego zabójcy Stolnika i zdrajcy narodu do pokornego bernardyna, emisariusza politycznego i cichego obrońcy rodaków.',
      contextExample: 'Jacek Soplica odpokutowuje grzech młodości: przyjmuje habit, przydomek Robak (najniższy z prochu) i organizuje powstanie na Litwie przed wejściem wojsk Napoleona.',
      ckeTrap: 'Błędem kardynalnym jest twierdzenie, że Jacek Soplica został skazany na śmierć przez sąd i stracony. Soplica umiera z ran odniesionych w bitwie z Moskalami, po uprzedniej publicznej rehabilitacji przez Gerwazego.'
    }
  ],

  'lekcja-14': [
    {
      id: 'c-14-1',
      name: 'Bohater synkretyczny (Stanisław Wokulski)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Postać zawieszona między dwoma sprzecznymi światopoglądami: romantycznym idealizmem serca (miłość do Izabeli, udział w powstaniu) a pozytywistycznym kultem nauki i pracy (kapitał, spółka handlowa, filantropia).',
      contextExample: 'Wokulski z dumą buduje nowoczesny handel z Rosją, a jednocześnie rozpacza: „Wariat! Romantyk z epoki przedpotopowej!”.',
      ckeTrap: 'Jednostronne zaklasyfikowanie Wokulskiego wyłącznie jako „typowego pozytywisty” lub „typowego romantyka”. CKE wymaga wykazania DUALIZMU obu postaw w jego psychice.'
    },
    {
      id: 'c-14-2',
      name: 'Praca organiczna i praca u podstaw',
      tag: 'Pozytywizm polski',
      simpleDefinition: 'Praca organiczna to rozwój gospodarki i przemysłu całego społeczeństwa jako jednego żywego organizmu. Praca u podstaw to edukacja i pomoc najuboższym warstwom (chłopom, robotnikom, nędzarzom).',
      contextExample: 'Wokulski zakłada spółkę handlową (praca organiczna) oraz ratuje Mariannę z prostytucji, daje pracę Wysockiemu i bratu dróżnika (praca u podstaw).',
      ckeTrap: 'Mylenie obu pojęć. Praca organiczna dotyczy całego organizmu gospodarczego (zwłaszcza przemysłu i handlu), a praca u podstaw dotyczy edukacji i higieny najniższych warstw społecznych.'
    },
    {
      id: 'c-14-3',
      name: 'Miłość niszcząca (Amor fati Wokulskiego)',
      tag: 'Wątek miłosny Lalki',
      simpleDefinition: 'Romantyczna, wyidealizowana obsesja uczuciowa na punkcie arystokratki, która paraliżuje talent naukowy i energię życiową bohatera, doprowadzając go do ruiny psychicznej.',
      contextExample: 'Wokulski traktuje Izabelę jak bóstwo, kupuje dla niej powóz, kamienicę i srebrną zastawę, a po odkryciu jej flirtu ze Starskim rzuca się pod pociąg w Skierniewicach.',
      ckeTrap: 'BŁĄD KARDYNALNY: Napisanie, że Izabela Łęcka poślubiła Wokulskiego i żyli szczęśliwie, lub że Wokulski na pewno zginął pod kołami pociągu (został uratowany przez dróżnika Wysockiego!).'
    }
  ],

  'lekcja-15': [
    {
      id: 'c-15-1',
      name: 'Topos Theatrum Mundi (Świat jako teatr)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Motyw ukazujący ludzkie życie jako spektakl teatralny, w którym ludzie są jedynie bezwolnymi marionetkami poruszanymi niewidzialną ręką losu lub wyższej siły.',
      contextExample: 'Ignacy Rzecki w niedzielne popołudnia nakręca mechaniczne zabawki na wystawie sklepu, rozmyślając z melancholią: „Marionetki!... Wszystko marionetki!... Zdaje im się, że robią, co chcą, a robią tylko, co im każe sprężyna...”.',
      ckeTrap: 'Przypisanie toposu theatrum mundi Wokulskiemu. W Lalce topos ten jest bezpośrednio związany z refleksjami i postacią IGNACEGO RZECKIEGO.'
    },
    {
      id: 'c-15-2',
      name: 'Bonapartyzm Ignacego Rzeckiego',
      tag: 'Pamiętnik subiekta',
      simpleDefinition: 'Ślepa, romantyczna wiara w ród Napoleonów i przekonanie, że kolejny potomek Bonapartego przyniesie Polsce upragnioną wolność drogą zbrojną.',
      contextExample: 'Rzecki walczył na Węgrzech w Wiośnie Ludów z przyjacielem Katzem i do końca życia czeka na polityczny ruch Napoleona w Europie.',
      ckeTrap: 'Traktowanie Rzeckiego jako postaci komicznej bez głębi. Rzecki to „ostatni romantyk” powieści – wzór absolutnej uczciwości, wierności i poświęcenia dla przyjaciela.'
    },
    {
      id: 'c-15-3',
      name: 'Narracja dwugłosowa w Lalce',
      tag: 'Struktura powieści',
      simpleDefinition: 'Konstrukcja powieści łącząca narrację trzecioosobową, obiektywnego narratora realistycznego z subiektywną, pierwszoosobową narracją w „Pamiętniku starego subiekta”.',
      contextExample: 'Rozdziały pamiętnika Rzeckiego uzupełniają biografię Wokulskiego o czasy jego młodości, biedy w winiarni u Hopfera i pobytu na Syberii.',
      ckeTrap: 'Powoływanie się na fakty z Pamiętnika Rzeckiego jako na opinie narratora wszechwiedzącego. Pamiętnik odzwierciedla subiektywny, czasem naiwny punkt widzenia starego subiekta.'
    }
  ],

  'lekcja-16': [
    {
      id: 'c-16-1',
      name: 'Pasożytnictwo i dekadencja arystokracji',
      tag: 'Obraz społeczeństwa ★',
      simpleDefinition: 'Ostra krytyka polskiej warstwy wyższej za próżniactwo, pogardę dla pracy, kosmopolityzm, życie ponad stan i trwonienie majątków.',
      contextExample: 'Tomasz Łęcki żyje w iluzji wielkopaństwa mimo bankructwa, a Kazimierz Starski poluje na spadki po bogatych ciotkach i uwodzi mężatki.',
      ckeTrap: 'Twierdzenie, że Prus potępia całą klasę szlachecką bez wyjątku. Pozytywnym wyjątkiem jest prezesowa Zasławska (dba o chłopów w swoim majątku) oraz Julian Ochocki.'
    },
    {
      id: 'c-16-2',
      name: 'Realizm krytyczny Powiśla',
      tag: 'Pozytywizm w Lalce',
      simpleDefinition: 'Drastyczny, naturalistyczny opis skrajnej nędzy, brudu i chorób mieszkańców warszawskiej dzielnicy nadrzecznej jako oskarżenie porządku społecznego.',
      contextExample: 'Wokulski spaceruje po Powiślu, widzi bezdomnych, padlinę, ludzi grzebiących w śmieciach i myśli o konieczności cywilizacyjnego uzdrowienia tej części miasta.',
      ckeTrap: 'Mylenie Powiśla z Krakowskim Przedmieściem. Na Krakowskim Przedmieściu mieści się luksusowy sklep Wokulskiego i pałace arystokracji; Powiśle to dzielnica skrajnego ubóstwa.'
    },
    {
      id: 'c-16-3',
      name: 'Teoria nadludzi Raskolnikowa',
      tag: 'Zbrodnia i kara ★',
      simpleDefinition: 'Nietzscheański w duchu podział ludzkości na ludzi „zwykłych” (materiał powołany do posłuszeństwa) oraz „niezwykłych” (jednostki napoleońskie stojące ponad prawem i mogące przekraczać normy moralne dla wyższych celów).',
      contextExample: 'Rodion Raskolnikow morduje starą lichwiarkę Alonę Iwanowną, by sprawdzić, czy sam jest „drżącą wesz”, czy ma prawo do zbrodni jak Napoleon.',
      ckeTrap: 'Błędem kardynalnym jest twierdzenie, że Raskolnikow zabił wyłącznie dla pieniędzy. Motyw finansowy był drugorzędny; głównym celem był zbrodniczy eksperyment psychologiczno-filozoficzny.'
    },
    {
      id: 'c-16-4',
      name: 'Zmartwychwstanie moralne (Sonia Marmieładowa)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Ocalenie moralne zbrodniarza przez miłość, chrześcijańską pokorę, cierpienie i przyjęcie kary jako drogi ku odkupieniu.',
      contextExample: 'Sonia, choć zmuszona do prostytucji by ratować głodujące rodzeństwo, czyta Rodionowi przypowieść o wskrzeszeniu Łazarza i towarzyszy mu na katorgę na Syberię.',
      ckeTrap: 'Przedstawianie Soni jako osoby zdeprawowanej. W powieści Dostojewskiego Sonia zachowuje absolutną czystość duszy i niezłomną wiarę w Boga.'
    }
  ],

  'lekcja-17': [
    {
      id: 'c-17-1',
      name: 'Zjawy bronowickie jako projekcje psychiczne',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Postacie ze świata fantastycznego ukazujące się gościom weselnym jako ucieleśnienie ich skrywanych lęków, wyrzutów sumienia, kompleksów i niespełnionych marzeń.',
      contextExample: 'Widmo malarza ukazuje się narzeczonej Marysi, Stańczyk – Dziennikarzowi, Rycerz Czarny – Poecie, Hetman Branicki – Panu Młodemu, Upiór (Szela) – Dziadowi, Wernyhora – Gospodarzowi.',
      ckeTrap: 'Pojawienie się na maturze pytania o to, kto komu się ukazuje. Błędem jest przypisanie Stańczyka Poecie (Stańczyk ukazuje się DZIENNIKARZOWI Rudolfowi Starzewskiemu!).'
    },
    {
      id: 'c-17-2',
      name: 'Stańczyk i Kaduceusz Polski',
      tag: 'Symbolika Wesela',
      simpleDefinition: 'Mądry błazen ostatnich Jagiellonów wręcza Dziennikarzowi laseczkę Hermesa (kaduceusz), by ten „mącił narodową wodę” i wytyka mu polityczne ugodowstwo konserwatystów krakowskich (lojalizm wobec zaborcy).',
      contextExample: 'Stańczyk drwi z bierności Dziennika: „Mąć tę wodę, mąć, / i truj, truj, a bądź!” – kaduceusz staje się symbolem usypiania czujności narodu.',
      ckeTrap: 'Interpretowanie kaduceusza jako symbolu walki zbrojnej. W Weselu kaduceusz to symbol kompromisu, politycznego usypiania społeczeństwa i uległości wobec Austrii.'
    },
    {
      id: 'c-17-3',
      name: 'Upiór Jakuba Szeli (Pamięć rabacji galicyjskiej)',
      tag: 'Kontekst historyczny ★',
      simpleDefinition: 'Zjawa krwawego przywódcy buntu chłopskiego z 1846 roku przypominająca o rzezi polskiej szlachty rękami chłopów, co dowodzi pozorności bratania się obu stanów w bronowickiej chacie.',
      contextExample: 'Upiór prosi Dziada o kubeł wody, by zmyć krew z rąk: „Przecie ja wam krewniak, bracia, / jeno że w krwawym habicie”.',
      ckeTrap: 'Uznanie wesela inteligenta z chłopką za dowód rzeczywistego pojednania narodowego. Zjawa Upiora dowodzi, że pod powierzchowną sielanką wciąż tli się pamięć krwawego odwetu.'
    }
  ],

  'lekcja-18': [
    {
      id: 'c-18-1',
      name: 'Złoty Róg',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Mistyczny dar od Wernyhory symbolizujący sygnał do narodowego powstania, zjednoczenia stanów i odzyskania niepodległości.',
      contextExample: 'Gospodarz w pijaństwie powierza róg młodemu Jaśkowi, by ten obwołał powstanie i zebrał kosynierów.',
      ckeTrap: 'Błędem kardynalnym jest twierdzenie, że Gospodarz sam zadął w Złoty Róg lub że róg został skradziony przez Moskali. Róg zgubił JASIEK, bo schylił się po czapkę z pawich piór.'
    },
    {
      id: 'c-18-2',
      name: 'Czapka z pawich piór',
      tag: 'Symbol narodowy',
      simpleDefinition: 'Symbol próżności, prywaty, powierzchownego blichtru i egoizmu chłopskiego, który przesłania wyższe cele patriotyczne.',
      contextExample: 'Jasiek schyla się po czapkę, którą wiatr strącił na gościńcu, i w tym momencie gubi bezcenny Złoty Róg. Zostaje mu w ręku jedynie „sznur”.',
      ckeTrap: 'Słynny cytat: „Miałeś, chamie, złoty róg, / miałeś, chamie, czapkę z piór: / czapkę wicher z głowy zdarł, / róg hula po lesie, / ostał ci się ino sznur”.'
    },
    {
      id: 'c-18-3',
      name: 'Chocholi Taniec (Marazm i letarg)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Finałowy, hipnotyczny taniec zgromadzonych weselników poruszających się bezwolnie w takt monotonnej muzyki słomianego Chochoła – symbol niemocy, uśpienia i niedojrzałości narodu do wolności.',
      contextExample: 'Weselnicy zastygają z kosami w rękach, niezdolni do jakiegokolwiek zrywu zbrojnego.',
      ckeTrap: 'Interpretowanie Chochoła wyłącznie negatywnie. Chochoł to słomiana ochrona krzaku róży na zimę – uśpienie narodu jest tragiczne, ale pod chochołem tli się życie, które zakwitnie wiosną (nadzieja na przyszłe zmartwychwstanie).'
    },
    {
      id: 'c-18-4',
      name: 'Chłopomania (Młodopolski mit sielanki)',
      tag: 'Zjawisko kulturowe',
      simpleDefinition: 'Powierzchowna fascynacja krakowskiej inteligencji folklorem, siłą biologiczną i barwnymi strojami chłopów, połączona z zawieraniem małżeństw inteligencko-chłopskich.',
      contextExample: 'Pan Młody (Lucjan Rydel) zachwyca się boso chodzącą panną młodą Jadwigą Mikołajczykówną, lecz nie rozumie prawdziwych problemów wsi.',
      ckeTrap: 'Mylenie chłopomanii z rzeczywistym sojuszem politycznym. Wyspiański bezlitośnie obnaża, że „panowie” traktują wieś jak kolorowy teatr i boją się chłopa z kosą.'
    }
  ],

  'lekcja-19': [
    {
      id: 'c-19-1',
      name: 'Mit szklanych domów',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Utopijna wizja Seweryna Baryki o nowoczesnej, czystej, sprawiedliwej społecznie i technologicznie rozwiniętej Polsce po odzyskaniu niepodległości.',
      contextExample: 'Ojciec w drodze do ojczyzny opowiada Cezaremu o tanich, higienicznych domach ze szkła budowanych dla robotników nad Wisłą.',
      ckeTrap: 'Konfrontacja z rzeczywistością: Cezary po przekroczeniu granicy w Przygraniczu widzi błoto, nędzne drewniane chałupy i rozczarowuje się odrodzoną Polską.'
    },
    {
      id: 'c-19-2',
      name: 'Forma i Gęba u Gombrowicza',
      tag: 'Ferdydurke ★',
      simpleDefinition: 'Forma to narzucony przez społeczeństwo sposób bycia, sztuczny schemat i rola. Gęba to maska i wizerunek, jaki inni ludzie nam przyprawiają w relacji międzyludzkiej.',
      contextExample: 'Józio Kowalski ma 30 lat, ale profesor Pimko traktuje go jak sztubaka i zamyka w szkole dyrektora Piórkowskiego, przyprawiając mu gębę niedojrzałego chłopca.',
      ckeTrap: 'Przekonanie, że przed Formą i Gębą można uciec w absolutną wolność. W finale powieści Gombrowicz dowodzi: „Nie ma ucieczki przed gębą, jak tylko w inną gębę”.'
    },
    {
      id: 'c-19-3',
      name: 'Upupienie (Infantylizacja)',
      tag: 'Pojęcie gombrowiczowskie',
      simpleDefinition: 'Sztuczne wtłaczanie dorosłego człowieka w ramy dziecka, odbieranie mu powagi i autonomii przez instytucje (szkołę, rodzinę, państwo).',
      contextExample: 'Profesor Pimko chwali uczniów za niewinność i zmusza ich do deklamowania Słowackiego („Dlaczego zachwyca? Bo zachwyca!”), paraliżując krytyczne myślenie.',
      ckeTrap: 'Traktowanie Ferdydurke jako książki wyłącznie humorystycznej. Jest to głęboki traktat filozoficzno-psychologiczny o zniewoleniu człowieka przez relacje społeczne.'
    }
  ],

  'lekcja-20': [
    {
      id: 'c-20-1',
      name: 'Człowiek złagrowany (Gułag)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Koncepcja Gustawa Herlinga-Grudzińskiego: więzień sowieckiego łagru, którego człowieczeństwo i normy moralne zostały zniszczone przez nieludzki system, katorżniczą pracę i permanentny głód.',
      contextExample: 'Michaił Kostylew opala rękę w ogniu, by nie pracować dla oprawców, a więźniowie donoszą na towarzyszy za miskę zupy z rybich głów.',
      ckeTrap: 'Słynne zdanie Herlinga: „Człowiek jest ludzki w ludzkich warunkach”. Oznacza to zakaz sądzenia moralnego ludzi łagru według kryteriów obowiązujących w świecie wolnym.'
    },
    {
      id: 'c-20-2',
      name: 'Człowiek zlagrowany (Auschwitz)',
      tag: 'Opowiadania Borowskiego ★',
      simpleDefinition: 'Koncepcja Tadeusza Borowskiego: więzień obozu koncentracyjnego, który zaakceptował obozowe reguły gry, wyzbył się empatii i walczy o biologiczne przetrwanie za wszelką cenę kosztem innych.',
      contextExample: 'Tadek w opowiadaniu „Proszę państwa do gazu” rozładowuje transporty z rampy kolejowej, grabi dobytek zagazowanych Żydów i marzy tylko o jedzeniu.',
      ckeTrap: 'Mylenie „złagrowania” (łagier sowiecki u Grudzińskiego – przez „ł”) ze „zlagrowaniem” (obóz niemiecki u Borowskiego – przez „l”).'
    },
    {
      id: 'c-20-3',
      name: 'Wyścig z Panem Bogiem',
      tag: 'Zdążyć przed Panem Bogiem ★',
      simpleDefinition: 'Metafora pracy kardiochirurga i dowódcy powstania w getcie Marka Edelmana: walka o ludzkie życie polega na uprzedzeniu Boga i osłonięciu płomienia świecy, zanim Bóg zdąży go zdmuchnąć.',
      contextExample: 'Edelman po wojnie ratuje pacjentów na stole operacyjnym z taką samą determinacją, z jaką ratował pojedynczych ludzi przed wywózką do Treblinki.',
      ckeTrap: 'Uznanie postawy Edelmana za walkę zbrojną o militarne zwycięstwo. W getcie warszawskim chodziło o wybór godnego sposobu umierania, a po wojnie o ratowanie każdego pojedynczego życia.'
    }
  ],

  'lekcja-21': [
    {
      id: 'c-21-1',
      name: 'Parabola dżumy (Albert Camus)',
      tag: 'Lektura z gwiazdką ★',
      simpleDefinition: 'Powieść z podwójnym dnem: dosłowna historia epidemii w Oranie to parabola metafizycznego zła w świecie, cierpienia niewinnych oraz totalitaryzmu wojennego (brunatna zaraza).',
      contextExample: 'Dżuma spada niespodziewanie na mieszkańców Oranu, zmuszając każdego do zajęcia stanowiska wobec absurdu i śmierci.',
      ckeTrap: 'Traktowanie Dżumy wyłącznie jako opisu medycznej kwarantanny. W finale narrator przestrzega, że bakcyl dżumy nigdy nie umiera i może ponownie obudzić swoje szczury w szczęśliwym mieście.'
    },
    {
      id: 'c-21-2',
      name: 'Heroizm bez Boga (Doktor Bernard Rieux)',
      tag: 'Laicki humanizm',
      simpleDefinition: 'Postawa uczciwego wypełniania obowiązku wobec cierpiących ludzi bez nadziei na zbawienie czy wieczną nagrodę – bunt przeciw złu przez codzienną, żmudną solidarność.',
      contextExample: 'Rieux leczy chorych w izolacji, ryzykując życie, mówiąc że jego jedynym powołaniem jest bycie lekarzem i niesienie ulgi w cierpieniu.',
      ckeTrap: 'Mylenie postawy Rieux z postawą ojca Paneloux. Jezuita Paneloux początkowo widzi w dżumie karę Bożą za grzechy, lecz widok śmierci małego dziecka łamie jego teologię.'
    },
    {
      id: 'c-21-3',
      name: 'Groteska i upadek kultury w Tangu',
      tag: 'Dramat współczesny ★',
      simpleDefinition: 'Zestawienie elementów komicznych i tragicznych, absurdu i brutalności w celu ukazania, jak odrzucenie wszelkich norm obyczajowych przez pokolenie Stomila doprowadza do dyktatury prymitywnego chama (Edka).',
      contextExample: 'Artur próbuje narzucić rodzinie powrót do tradycji przez ślub z Alą, lecz zostaje zabity przez Edka, który w finale tańczy tango La Cumparsita nad jego zwłokami.',
      ckeTrap: 'Błędem kardynalnym jest twierdzenie, że Artur zwyciężył i zaprowadził ład. W Tangu zwycięża EDEK – symbol brutalnej, bezmyślnej siły fizycznej i tyranii.'
    }
  ],

  // =========================================================================
  // MODUŁ III: WARSZTAT WYPRACOWANIA MATURALNEGO
  // =========================================================================
  'lekcja-22': [
    {
      id: 'c-22-1',
      name: 'Błąd kardynalny (0/35 pkt)',
      tag: 'Kryterium bezwzględne ★',
      simpleDefinition: 'Rażące zniekształcenie fabuły lektury obowiązkowej (z gwiazdką), świadczące o całkowitym braku znajomości tekstu lub wypaczające główny sens ideowy utworu.',
      contextExample: 'Napisanie, że Wokulski ożenił się z Izabelą Łęcką, że Konrad nazwał Boga carem, że Antygona błagała Kreona o litość, albo że Jasiek zatrąbił w Złoty Róg.',
      ckeTrap: 'Błąd kardynalny dotyczy WYŁĄCZNIE lektur obowiązkowych w całości (z gwiazdką)! Pomyłka w lekturze uzupełniającej (np. w Dżumie czy Innym świecie) to zwykły błąd rzeczowy (-1 pkt), a nie błąd kardynalny.'
    },
    {
      id: 'c-22-2',
      name: 'Błąd rzeczowy a kardynalny',
      tag: 'Klucz oceniania CKE',
      simpleDefinition: 'Błąd rzeczowy to drobna pomyłka w imieniu drugoplanowego bohatera, dacie, nazwie miejscowości czy szczególe ubioru, która nie wypacza sensu lektury.',
      contextExample: 'Nazwanie subiekta Mraczewskiego „Mroczkowskim” lub pomylenie roku powstania styczniowego. Za błąd rzeczowy egzaminator odejmuje 1 punkt w kryterium poprawności rzeczowej.',
      ckeTrap: 'Panika maturzysty: zapomnienie imienia ciotki Izabeli Łęckiej (pani Joanna Karolowa) NIE JEST błędem kardynalnym. To drobna usterka rzeczowa.'
    },
    {
      id: 'c-22-3',
      name: 'Zakończenie otwarte w Lekturze',
      tag: 'Pułapka interpretacyjna',
      simpleDefinition: 'Finał utworu, w którym autor celowo nie rozstrzyga ostatecznego losu bohatera, pozostawiając czytelnikowi przestrzeń do domysłów.',
      contextExample: 'Zniknięcie Wokulskiego po wysadzeniu zamku w Zasławku (kamień z napisem „Non omnis moriar”) lub los Kordiana przed plutonem egzekucyjnym (oficer unosi rękę, kurtyna opada).',
      ckeTrap: 'Kategoryczne twierdzenie w wypracowaniu: „Wokulski na pewno popełnił samobójstwo i nie żyje”. Należy napisać: „Los Wokulskiego pozostaje zagadką – autor zastosował zakończenie otwarte”.'
    }
  ],

  'lekcja-23': [
    {
      id: 'c-23-1',
      name: 'Teza w wypracowaniu',
      tag: 'Struktura pracy ★',
      simpleDefinition: 'Jednoznaczne stanowisko autora wypracowania będące bezpośrednią odpowiedzią na pytanie zawarte w temacie maturalnym, które będzie udowadniane w rozwinięciu.',
      contextExample: 'Temat: „Bunt i jego konsekwencje”. Teza: „Bunt definiuje godność człowieka, jednak jego skutki mogą prowadzić do moralnej wielkości lub tragicznego osamotnienia”.',
      ckeTrap: 'Postawienie tezy w formie pytania („Czy bunt ma sens?”) lub powtórzenie tematu słowo w słowo bez wyrażenia własnego rozstrzygnięcia problemu.'
    },
    {
      id: 'c-23-2',
      name: 'Kontekst funkcjonalny',
      tag: 'Wymóg CKE (min. 1)',
      simpleDefinition: 'Przywołanie wiedzy historycznej, filozoficznej, biograficznej lub teoretycznoliterackiej, która pogłębia interpretację lektury i służy udowodnieniu tezy.',
      contextExample: 'Kontekst filozoficzny: odwołanie do egzystencjalizmu Alberta Camusa („człowiek zbuntowany”) przy analizie postawy Raskolnikowa lub doktora Rieux.',
      ckeTrap: 'Kontekst niefunkcjonalny (wspomnieniowy): rzucenie jednego zdania na marginesie („Mickiewicz urodził się w Zaosiu”), które w żaden sposób nie łączy się z analizowanym argumentem. Za taki kontekst CKE przyznaje 0 punktów!'
    },
    {
      id: 'c-23-3',
      name: 'Segmentacja argumentacyjna',
      tag: 'Kompozycja eseju',
      simpleDefinition: 'Podział wypracowania na logiczne akapity: Wstęp z tezą -> Argument 1 (lektura obowiązkowa) -> Argument 2 (inny utwór) -> Kontekst -> Zakończenie z wnioskami uogólniającymi.',
      contextExample: 'Każdy akapit rozwinięcia musi zawierać: cząstkową tezę -> analizę przykładu z lektury -> wniosek cząstkowy łączący się z tezą główną.',
      ckeTrap: 'Brak wniosków cząstkowych. Samo streszczenie losów bohatera bez odpowiedzi na pytanie „Co z tego wynika dla tematu buntu?” obniża notę za kompetencje literackie.'
    }
  ],

  'lekcja-24': [
    {
      id: 'c-24-1',
      name: 'Strategia 240 minut (Złoty podział)',
      tag: 'Zarządzanie czasem CKE',
      simpleDefinition: 'Optymalny harmonogram 4 godzin matury podstawowej: 45 min na Zeszyt 1 (Język w użyciu + notatka), 55 min na Zeszyt 2 (Test historycznoliteracki), 120 min na wypracowanie, 20 min na sprawdzenie.',
      contextExample: 'Rozpoczęcie wypracowania dopiero po 2 godzinach i 45 minutach grozi paniką, niedokończeniem pracy i niezrealizowaniem drugiego utworu.',
      ckeTrap: 'Pisanie całego wypracowania w brudnopisie, a potem przepisywanie do czystopisu. W 99% przypadków brakuje czasu! W brudnopisie tworzy się wyłącznie SZCZEGÓŁOWY KONSPEKT z tezami i przykładami.'
    },
    {
      id: 'c-24-2',
      name: 'Dyscyplina 300 słów w wypracowaniu',
      tag: 'Kryterium formalne',
      simpleDefinition: 'Oficjalny minimalny limit wypracowania maturalnego w Formule 2023. Praca poniżej 300 słów podlega drastycznym cięciom punktowym (ocena maksymalnie na poziomie podstawowym).',
      contextExample: 'Bezpieczny esej maturalny liczy między 350 a 500 słów – pozwala to w pełni rozwinąć dwa argumenty i kontekst bez lania wody.',
      ckeTrap: 'Liczenie słów co 5 minut w trakcie pisania. Wystarczy policzyć średnią liczbę słów w jednej linijce swojego pisma (zazwyczaj 7–9 słów) i pomnożyć przez liczbę zapisanych wierszy.'
    },
    {
      id: 'c-24-3',
      name: 'Autokorekta ortograficzno-interpunkcyjna',
      tag: 'Zasada 10 minut',
      simpleDefinition: 'Ostatnie 10–15 minut egzaminu poświęcone wyłącznie na czytanie własnego wypracowania od tyłu lub akapit po akapicie pod kątem literówek, przecinków przy imiesłowach i powtórzeń.',
      contextExample: 'Wychwycenie przecinków przed „który”, „że”, „ponieważ” oraz przy imiesłowach przysłówkowych zakończonych na „-ąc”, „-łszy”, „-wszy”.',
      ckeTrap: 'Oddanie arkusza 30 minut przed czasem. Egzaminatorzy CKE ostrzegają: 80% błędów kardynalnych i ortograficznych wynika z pośpiechu i braku ponownego przeczytania pracy!'
    }
  ]
};

/**
 * Pobiera pojęcia Bento dla danej lekcji z automatycznym fallbackiem.
 */
export function getPolishBentoConceptsForLesson(lessonId: string): PolishBentoConcept[] {
  return POLISH_LESSON_CONCEPTS[lessonId] || [];
}

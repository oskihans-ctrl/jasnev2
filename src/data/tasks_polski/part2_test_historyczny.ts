import { Task800Item } from './types';
import { PolishEpoch, TaskVisualAsset } from '../../types/maturaTypes';

// =========================================================================
// CZĘŚĆ II: TEST HISTORYCZNOLITERACKI (570 ZADAŃ)
// Pełna zgodność z podstawą programową CKE Formuła 2023 i nowelą MEN 2024/2025/2026
// Pokrycie wszystkich 11 epok i 30 jednostek lekturowo-problemowych (26 + 4 lektury PP z podstawy 2024)
// =========================================================================

export const PART2_TEST_HISTORYCZNY_TASKS: Task800Item[] = [];

// Rozbudowana baza 26 jednostek lekturowo-epokowych z kanonu CKE Formuła 2023
const LEKTURY_DATA: Array<{
  lektura: string;
  autor: string;
  epoch: PolishEpoch;
  isStarRequired: boolean;
  statusNote?: string;
  bohaterowie: Array<{ imie: string; dylemat: string; postawa: string; symbol: string }>;
  topos: string;
  iconography: {
    title: string;
    artist: string;
    relation: string;
    imageUrl?: string;
    imageCaption?: string;
    imageAlt?: string;
    fallbackDescription?: string;
    sourceDomain?: string;
  };
  factualStatements: Array<{ s1: string; t1: boolean; s2: string; t2: boolean; expl: string }>;
}> = [
  // 1. STAROŻYTNOŚĆ - MITOLOGIA
  {
    lektura: 'Mitologia grecka',
    autor: 'Mitologia grecka / Jan Parandowski',
    epoch: 'Starożytność i Biblia',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Prometeusz', dylemat: 'Bunt przeciw bogom w imię altruistycznej miłości do człowieka', postawa: 'Archetyp bezinteresownego poświęcenia i buntu etycznego', symbol: 'Wykradziony ogień ze wzgórza Olimp' },
      { imie: 'Dedal', dylemat: 'Odpowiedzialność ojca i pragmatyzm wynalazcy a tęsknota za wolnością', postawa: 'Archetyp rozwagi, etosu pracy i intelektu', symbol: 'Skrzydła z piór i wosku' },
      { imie: 'Ikar', dylemat: 'Młodzieńcza fascynacja lotem i przekraczanie granic bezpieczeństwa', postawa: 'Archetyp idealizmu, marzycielstwa i lekkomyślnej fascynacji', symbol: 'Roztopiony wosk skrzydeł pod słońcem' },
      { imie: 'Syzyf', dylemat: 'Kara bogów za zdradę ich tajemnic i nieustanne zmaganie z absurdem', postawa: 'Heroiczny wysiłek człowieka walczącego z nieuchronnym losem', symbol: 'Głaz wtaczany bez końca na szczyt góry' }
    ],
    topos: 'Bunt prometejski, hybris, topos labiryntu i bezsensu trudu',
    iconography: {
      title: 'Upadek Ikara',
      artist: 'Pieter Bruegel starszy',
      relation: 'Zderzenie wzniosłego dramatu jednostki marzyciela ze zwykłym rytmem codziennej pracy rolnika i pasterza.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pieter_Bruegel_de_Oude_-_De_val_van_Icarus.jpg?width=1000',
      imageCaption: 'Pieter Bruegel starszy, „Upadek Ikara” (ok. 1558)',
      imageAlt: 'Renesansowy pejzaż morski z oraczem na pierwszym planie i tonącym Ikarem w prawym dolnym rogu',
      fallbackDescription: 'Kompozycja panoramiczna ukazująca pejzaż morski o zachodzie słońca. Na pierwszym planie widać rolnika skupionego na orce oraz pasterza wpatrzonego w niebo, podczas gdy w prawym dolnym rogu z wody wystają jedynie bezradne nogi tonącego Ikara. Obraz ilustruje obojętność świata na tragedię marzyciela, korespondując z mitem o Ikarze i toposami bezradności wobec praw natury.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Dedal przestrzegał Ikara, aby nie leciał zbyt blisko słońca ani zbyt blisko morza.',
        t1: true,
        s2: 'Syzyf za karę został przykuty do skał Kaukazu, gdzie sęp wyjadał mu odrastającą wątrobę.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (wskazówki Dedala). Zdanie 2 fałszywe (do Kaukazu przykuto Prometeusza, Syzyf wtaczał głaz w Tartarze).'
      }
    ]
  },
  // 2. STAROŻYTNOŚĆ - BIBLIA
  {
    lektura: 'Biblia',
    autor: 'Biblia (Stary i Nowy Testament)',
    epoch: 'Starożytność i Biblia',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Hiob', dylemat: 'Utrata majątku, rodziny i zdrowia bez popełnienia grzechu', postawa: 'Niezłomna wierność Bogu w obliczu cierpienia niezawinionego (teodycea)', symbol: 'Popiół i skorupa do zdrapywania wrzodów' },
      { imie: 'Kohelet', dylemat: 'Poszukiwanie trwałego sensu w bogactwie, wiedzy i przyjemnościach', postawa: 'Filozoficzny mędrzec demaskujący złudzenia ziemskiego bytu', symbol: 'Marność nad marnościami (vanitas) i gonitwa za wiatrem' },
      { imie: 'Jan Ewangelista', dylemat: 'Wizja końca świata, ostatecznej walki dobra ze złem i Sądu Bożego', postawa: 'Prorok eschatologiczny zwiastujący Nowe Jeruzalem', symbol: 'Siedem pieczęci i Czterej Jeźdźcy Apokalipsy' }
    ],
    topos: 'Teodycea, topos vanitas, eschatologia i apokalipsa',
    iconography: {
      title: 'Czterej Jeźdźcy Apokalipsy',
      artist: 'Albrecht Dürer',
      relation: 'Groza końca świata, zarazy, wojny, głodu i śmierci dosięgających całą ludzkość.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Durer_Revelation_Four_Riders.jpg?width=1000',
      imageCaption: 'Albrecht Dürer, „Czterej Jeźdźcy Apokalipsy” (1498)',
      imageAlt: 'Słynny drzeworyt Dürera ukazujący czterech jeźdźców pędzących na koniach i tratujących ludzi',
      fallbackDescription: 'Mistrzowski renesansowy drzeworyt przedstawiający czterech jeźdźców galopujących w zwartym szyku: Śmierć na wychudzonym koniu, Głód z wagą szalkową, Wojnę z obnażonym mieczem oraz Zarazę/Zwycięzcę z łukiem. Pod kopytami rumaków tratowani są ludzie wszystkich stanów, w tym cesarz i biskup w paszczy piekielnej bestii. Dzieło koresponduje z Apokalipsą św. Jana i motywem nieuchronnego sądu eschatologicznego.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Kohelet w swojej księdze głosi, że wszelkie ludzkie zabiegi o bogactwo i sławę są gonitwą za wiatrem.',
        t1: true,
        s2: 'Hiob pod wpływem namów żony i przyjaciół przeklął Boga i odebrał sobie życie.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (maksyma Koheleta). Zdanie 2 fałszywe (Hiob zachował wierność Bogu mówiąc: Bóg dał, Bóg wziął).'
      }
    ]
  },
  // 3. STAROŻYTNOŚĆ - ANTYGONA
  {
    lektura: 'Antygona',
    autor: 'Sofokles',
    epoch: 'Starożytność i Biblia',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Antygona', dylemat: 'Wierność odwiecznym prawom boskim a posłuszeństwo edyktowi władcy Teb', postawa: 'Tragiczna bohaterka przedkładająca miłość braterską nad życie', symbol: 'Garść ziemi rzucona na zwłoki Polinika' },
      { imie: 'Kreon', dylemat: 'Obrona ładu państwowego i prawa stanowionego przed anarchią zdrajców', postawa: 'Władca ulegający pysze (hybris), ponoszący klęskę rodzinną i moralną', symbol: 'Tron tebański i nienaruszalny edykt państwowy' }
    ],
    topos: 'Konflikt tragiczny, wina tragiczna (hamartia) i pycha władcy (hybris)',
    iconography: {
      title: 'Antygona przed ciałem Polinika',
      artist: 'Nikiforos Lytras',
      relation: 'Starcie dwóch równorzędnych racji moralnych: prawa boskiego (naturalnego) i stanowionego (państwowego) oraz heroiczna wierność braterskiej miłości.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lytras_nikiforos_antigone_polynices.jpeg?width=1000',
      imageCaption: 'Nikiforos Lytras, „Antygona przed ciałem Polinika” (1865)',
      imageAlt: 'Młoda kobieta w ciemnej szacie klęcząca i opłakująca nagie zwłoki brata leżącego na skale pod nocnym niebem',
      fallbackDescription: 'Dramatyczna kompozycja w stylu akademizmu przedstawiająca Antygonę w ciemnej szacie, pochylającą się z rozpaczą i czułością nad nagim, martwym ciałem brata Polinika porzuconym na skalistym pustkowiu pod osłoną nocy. W tle widać groźną, ciemną przestrzeń i majaczące w mroku mury Teb. Dzieło bezpośrednio wizualizuje konflikt tragiczny Antygony: wierność odwiecznemu prawu boskiemu i miłości braterskiej wbrew bezwzględnemu zakazowi Kreona.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Kreon pod wpływem wróżb Tejrezjasza postanawia cofnąć swój wyrok i uwolnić Antygonę.',
        t1: true,
        s2: 'Ismena od początku odważnie pomagała Antygonie w zasypywaniu zwłok Polinika przed strażnikami.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Kreon uległ przestrogom Tejrezjasza, lecz Antygona powiesiła się na chuście). Zdanie 2 fałszywe (Ismena tchórzy w prologu i odmawia siostrze pomocy).'
      }
    ]
  },
  // 4. ŚREDNIOWIECZE - BOGURODZICA I LAMENT ŚWIĘTOKRZYSKI
  {
    lektura: 'Bogurodzica i Lament świętokrzyski',
    autor: 'Anonim',
    epoch: 'Średniowiecze',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Matka Boska (Bogurodzica)', dylemat: 'Pośredniczenie między grzesznymi ludźmi a Jej Synem Zbawicielem', postawa: 'Święta orędowniczka wstawiająca się za ludzkością w modlitwie Deesis', symbol: 'Złoty tron orędowniczki u boku Chrystusa' },
      { imie: 'Matka Boska Bolesna (Lament)', dylemat: 'Bezgraniczny ból ziemskiej matki patrzącej na męczeństwo i śmierć Syna', postawa: 'Cierpiąca człowiecza matka (Stabat Mater Dolorosa) szukająca współczucia', symbol: 'Krwawe rany Chrystusa i prośba o podzielenie męki' }
    ],
    topos: 'Deesis (modlitwa wstawiennicza) oraz Stabat Mater Dolorosa (współcierpienie pod krzyżem)',
    iconography: {
      title: 'Pietà z Tubądzina',
      artist: 'Anonim (szkoła małopolska)',
      relation: 'Maria trzymająca na kolanach martwe ciało Syna, ucieleśniająca motyw cierpienia Stabat Mater i człowieczy ból matki z Lamentu świętokrzyskiego.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Anonymous_-_Piet%C3%A0_of_Tub%C4%85dzin_-_Google_Art_Project.jpg?width=1000',
      imageCaption: 'Anonim (szkoła małopolska), „Pietà z Tubądzina” (ok. 1450)',
      imageAlt: 'Średniowieczny obraz tablicowy przedstawiający bolejącą Matkę Boską trzymającą na kolanach martwe ciało Chrystusa',
      fallbackDescription: 'Późnogotycki obraz tablicowy w temperze na desce ze złotym tłem, ukazujący Matkę Boską w ciemnogranatowym płaszczu trzymającą na kolanach skatowane ciało Syna zdjętego z krzyża. Twarz Maryi wyraża głębokie, matczyne cierpienie, a rany Chrystusa i strużki krwi podkreślają dramatyzm ofiary. Kompozycja plastyczna stanowi idealny odpowiednik toposu Stabat Mater Dolorosa z „Lamentu świętokrzyskiego”, ukazując intymny, człowieczy ból matki opłakującej syna.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W Bogurodzicy wierni zwracają się do Chrystusa przez pośrednictwo Maryi i Jana Chrzciciela (motyw Deesis).',
        t1: true,
        s2: 'W Lamencie świętokrzyskim Maria występuje wyłącznie jako triumfująca Królowa Niebios, pozbawiona ludzkich emocji.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Deesis w Bogurodzicy). Zdanie 2 fałszywe (w Lamencie Maria cierpi po ludzku jako zrozpaczona matka).'
      }
    ]
  },
  // 5. ŚREDNIOWIECZE - POLIKARP I ALEKSY
  {
    lektura: 'Rozmowa ze Śmiercią i Legenda o św. Aleksym',
    autor: 'Anonim',
    epoch: 'Średniowiecze',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Mistrz Polikarp', dylemat: 'Strach uczonego wobec nieuchronnego zgonu i poszukiwanie sposobu na ocalenie', postawa: 'Zagubiony człowiek skonfrontowany z potęgą ostateczną', symbol: 'Uklęknięcie przed kościotrupem w kościele' },
      { imie: 'Śmierć', dylemat: 'Wykonywanie Bożego nakazu bezwzględnego ścinania każdego człowieka', postawa: 'Sprawiedliwy, groteskowy sędzia zrównujący papieży, królów i żebraków', symbol: 'Kosa, rozpadające się ciało i zgrzytające zęby' },
      { imie: 'Święty Aleksy', dylemat: 'Odrzucenie bogactwa i miłości małżeńskiej na rzecz zbawienia wiecznego', postawa: 'Średniowieczny asceta żyjący przez 16 lat pod schodami własnego pałacu', symbol: 'Pismo trzymane w dłoni rozpoznane po śmierci przez dzwony' }
    ],
    topos: 'Danse macabre (taniec śmierci, równość stanów) oraz asceza i teocentryzm',
    iconography: {
      title: 'Taniec śmierci (Danse macabre)',
      artist: 'Michael Wolgemut',
      relation: 'Korowód ludzi wszystkich stanów społecznych prowadzonych przez szkielety do grobu oraz nieuchronność losu człowieka w toposie danse macabre.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Danse_macabre_by_Michael_Wolgemut.png?width=1000',
      imageCaption: 'Michael Wolgemut, „Taniec śmierci (Imago Mortis)” (1493)',
      imageAlt: 'Późnośredniowieczny drzeworyt przedstawiający szkielety i kościotrupy tańczące i grające na instrumentach nad grobem',
      fallbackDescription: 'Renesansowo-średniowieczny drzeworyt z Kroniki Norymberskiej przedstawiający korowód ożywionych szkieletów tańczących, dmących w piszczałkę i wyciągających z grobu zmarłego. Groteskowa, makabryczna ekspresja ciał i kości podkreśla nieuchronność zgonu. Wizualizacja ta bezpośrednio koresponduje z personifikacją Śmierci w „Rozmowie Mistrza Polikarpa ze Śmiercią”, obrazując topos danse macabre i równość wszystkich ludzi – królów, papieży i nędzarzy – w obliczu kostuchy.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Śmierć w Rozmowie Mistrza Polikarpa oznajmia, że nie oszczędzi nikogo: ani papieża, ani cesarza, ani bogacza.',
        t1: true,
        s2: 'Święty Aleksy zmarł w chwale jako zamożny kardynał w Rzymie otoczony rodziną.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (równość wszystkich stanów w obliczu śmierci). Zdanie 2 fałszywe (Aleksy zmarł jako nierozpoznany żebrak pod schodami ojca).'
      }
    ]
  },
  // 6. RENESANS - JAN KOCHANOWSKI
  {
    lektura: 'Jan Kochanowski (Pieśni, Treny, Odprawa)',
    autor: 'Jan Kochanowski',
    epoch: 'Renesans',
    isStarRequired: false,
    statusNote: '[Podstawa 2024: Treny jako cykl to lektura z zakresu rozszerzonego, a Odprawa posłów greckich – lektura PP z podstawy 2018, do wykorzystania w wypracowaniu w latach 2025–2028. Fragmenty utworów poetyckich arkusz zawsze przytacza.]',
    bohaterowie: [
      { imie: 'Jan Kochanowski (ojciec)', dylemat: 'Załamanie stoickiej mądrości i wiary w cnotę po śmierci córki Urszulki', postawa: 'Humanista przeżywający graniczny kryzys światopoglądowy i odnajdujący ukojenie w Trenie XIX', symbol: 'Pusta lutnia i cyprysowy nagrobek Urszulki' },
      { imie: 'Antenor', dylemat: 'Obowiązek obrony praworządności ojczyzny wbrew woli przekupnej większości', postawa: 'Niezłomny mąż stanu, wzorzec renesansowego patriotyzmu obywatelskiego', symbol: 'Projekt oddania Heleny prawowitemu mężowi Menelaosowi' },
      { imie: 'Aleksander (Parys)', dylemat: 'Zaspokojenie egoistycznej namiętności za cenę wciągnięcia Troi w wojnę', postawa: 'Przekupny i krótkowzroczny demagog szafujący złotem', symbol: 'Podarunki dla posłów i ucieczka przed odpowiedzialnością' }
    ],
    topos: 'Kryzys humanizmu i stoicyzmu, cnota obywatelska i odpowiedzialność za ojczyznę',
    iconography: {
      title: 'Jan Kochanowski nad zwłokami Urszulki',
      artist: 'Jan Matejko',
      relation: 'Zrozpaczony ojciec-poeta tulący martwą córeczkę i załamanie filozofii stoickiej oraz kryzys światopoglądowy renesansowego myśliciela.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jan_Kochanowski_nad_zw%C5%82okami_Urszulki.jpg?width=1000',
      imageCaption: 'Jan Matejko, „Jan Kochanowski nad zwłokami Urszulki” (1862)',
      imageAlt: 'Jan Kochanowski w czarnym stroju czule tulący martwą córeczkę w trumience z krzyżem i lutnią',
      fallbackDescription: 'Scena we wnętrzu czarnoleskiego dworku, w którym zrozpaczony Jan Kochanowski w czarnym renesansowym stroju klęczy i z bezgranicznym bólem tuli główkę zmarłej małej Urszulki spoczywającej w trumience ozdobionej cyprysem i krzyżem. Obok leży porzucona lutnia poetycka. Obraz Matejki jest wizualną kulminacją cyklu „Trenów”, ukazując załamanie się stoickiego spokoju humanisty i ojca skonfrontowanego ze śmiercią ukochanego dziecka.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Krakowie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W Trenie IX i X Kochanowski podważa potęgę stoickiej Mądrości i pyta, gdzie po śmierci przebywa dusza Urszulki.',
        t1: true,
        s2: 'W Odprawie posłów greckich posłowie trojańscy jednogłośnie popierają Antenora i natychmiast zwracają Helenę Grekom.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (kulminacja kryzysu w Trenach). Zdanie 2 fałszywe (przekupna rada popiera Aleksandra Parysa i odrzuca wniosek Antenora).'
      }
    ]
  },
  // 7. RENESANS - MAKBET
  {
    lektura: 'Makbet',
    autor: 'William Szekspir',
    epoch: 'Renesans',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Makbet', dylemat: 'Pokusa zdobycia korony za cenę złamania przysięgi lennej i sumienia', postawa: 'Rycerz przemieniający się w krwawego tyrana podlegającego paranoi', symbol: 'Sztylet unoszący się w powietrzu przed zbrodnią' },
      { imie: 'Lady Makbet', dylemat: 'Tłumienie kobiecości i wyrzutów sumienia w imię zbrodniczej ambicji męża', postawa: 'Inspiratorka zbrodni popadająca w somnambulizm i obłęd samobójczy', symbol: 'Niezmywalna plama krwi na dłoniach w scenie obłędu' }
    ],
    topos: 'Theatrum mundi, zbrodnia i kara, degradacja moralna tyrana',
    iconography: {
      title: 'Lady Makbet idąca we śnie',
      artist: 'Johann Heinrich Füssli',
      relation: 'Mroczny obraz udręczonej psychiki zbrodniarki bezskutecznie obmywającej dłonie we śnie i nieuchronność kary psychicznej za zbrodnię tyranii.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Heinrich_F%C3%BCssli_-_Lady_Macbeth.jpg?width=1000',
      imageCaption: 'Johann Heinrich Füssli, „Lady Makbet idąca we śnie (somnambulizm)” (1784)',
      imageAlt: 'Ekspresyjny obraz Lady Makbet w białej koszuli z rozszerzonymi w obłędzie oczami i wyciągniętymi rękami',
      fallbackDescription: 'Ekspresyjny, preromantyczny obraz ukazujący Lady Makbet w białej, widmowej sukni nocnej, sunącą w stanie somnambulizmu na tle mrocznych cieni zamku Dunsinane. Jej wzrok jest obłąkany, a uniesione dłonie wykonują nerwowy gest próby zmycia niewidzialnej plamy krwi króla Dunkana („Precz, przeklęta plamo!”). Dzieło wizualizuje psychologiczny mechanizm wypartej winy, lęku i rozpadu osobowości zbrodniarki w dramacie Szekspira.',
      sourceDomain: 'Wikimedia Commons / Musée du Louvre (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Czarownice przepowiadają Makbetowi, że nie zginie z ręki męża narodzonego z niewiasty oraz dopóki las Birnam nie podejdzie pod zamek Dunsinane.',
        t1: true,
        s2: 'Banko wspólnie z Makbetem bierze bezpośredni udział w zamordowaniu króla Dunkana w zamku Inverness.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (przewrotna przepowiednia wiedźm). Zdanie 2 fałszywe (Banko dochowuje wierności królowi, za co zostaje później zamordowany na zlecenie Makbeta).'
      }
    ]
  },
  // 8. BAROK - POEZJA BAROKOWA
  {
    lektura: 'Poezja barokowa (Morsztyn, Naborowski)',
    autor: 'Jan Andrzej Morsztyn, Daniel Naborowski, Mikołaj Sęp Szarzyński',
    epoch: 'Barok',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Podmiot liryczny Morsztyna', dylemat: 'Porównanie mąk nieszczęśliwie zakochanego ze spokojem zmarłego', postawa: 'Dworzanin konstruujący zaskakujący koncept barokowy (Do trupa)', symbol: 'Trupa blada twarz zderzona z płomieniem miłości' },
      { imie: 'Podmiot liryczny Naborowskiego', dylemat: 'Świadomość błyskawicznego przemijania człowieka i świata doczesnego', postawa: 'Barokowy filozof marności poszukujący stałości w Bogu', symbol: 'Cień, dym, wiatr, błysk i kolebka jako grób' },
      { imie: 'Bojownik Boży Sępa Szarzyńskiego', dylemat: 'Rozdarcie między pożądliwościami ciała a dążeniem duszy ku Bogu', postawa: 'Żołnierz toczący nieustanny bój z szatanem, światem i ciałem', symbol: 'Zbroja wiary i walka o zbawienie' }
    ],
    topos: 'Vanitas (marność nad marnościami), marwica świata, konceptyzm i walka duchowa',
    iconography: {
      title: 'Vanitas – Martwa natura z czaszką',
      artist: 'Pieter Claesz',
      relation: 'Kruchość ludzkiej egzystencji wyrażona przez czaszkę, gasnącą świecę i zegar, obrazująca barokowy topos vanitas i marwicy świata.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pieter_Claesz_-_Vanitas_Still_Life_-_943_-_Mauritshuis.jpg?width=1000',
      imageCaption: 'Pieter Claesz, „Vanitas – Martwa natura z czaszką” (1630)',
      imageAlt: 'Barokowa martwa natura z czaszką, zegarkiem kieszonkowym, przewróconym kielichem i gasnącą lampą oliwną',
      fallbackDescription: 'Klasyczna barokowa martwa natura typu vanitas z dominującą w centrum ludzką czaszką, obok której leżą atrybuty nietrwałości doczesnego bytu: otwarty zegarek kieszonkowy z wstążką (symbol nieubłaganego upływu czasu), przewrócony szklany puchar (ulotność uciech ziemskich), wypalona lampa oliwna oraz pióro i księga (przemijalność wiedzy). Ciepły, stonowany światłocień podkreśla ciszę i powagę refleksji eschatologicznej, idealnie harmonizując z poezją Daniela Naborowskiego („Krótkość żywota”) i Mikołaja Sępa Szarzyńskiego.',
      sourceDomain: 'Wikimedia Commons / Mauritshuis Haga (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W sonecie „Do trupa” Morsztyn dowodzi, że zakochany cierpi bardziej niż nieboszczyk, bo płonie ogniem nieugaszonym.',
        t1: true,
        s2: 'Daniel Naborowski w wierszu „Krótkość żywota” twierdzi, że życie ludzkie trwa wiecznie dzięki ziemskiej sławie i majątkom.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (koncept sonetu Morsztyna). Zdanie 2 fałszywe (Naborowski dowodzi znikomości życia: cień, dym, wiatr, błysk).'
      }
    ]
  },
  // 9. OŚWIECENIE - IGNACY KRASICKI
  {
    lektura: 'Ignacy Krasicki (Bajki i Satyry)',
    autor: 'Ignacy Krasicki',
    epoch: 'Oświecenie',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Sarmata z satyry Pijaństwo', dylemat: 'Uleganie nałogowi alkoholowemu pod pozorem obyczajów i toastów patriotycznych', postawa: 'Pieniacz, który po trzeźwym ubolewaniu nad zgubą pijaństwa znów idzie pić', symbol: 'Rozbita butelka, sińce po bójce i kielich' },
      { imie: 'Mądry krytyk z satyry Do króla', dylemat: 'Obnażenie absurdalnych zarzutów szlachty wobec Stanisława Augusta Poniatowskiego', postawa: 'Mistrz ironii demaskujący zazdrość i głupotę sarmatów', symbol: 'Zarzuty młodości, polskiego pochodzenia i mądrości monarchy' },
      { imie: 'Zwierzęta z Bajek (Jagnię i wilcy)', dylemat: 'Bezbronność słabych w konfrontacji z bezwzględną siłą', postawa: 'Alegoria praw rządzących światem, w którym rację ma ten, kto ma władzę', symbol: 'Wilcza paszcza i niewinne jagnię w lesie' }
    ],
    topos: 'Dydaktyzm oświeceniowy (uczyć bawiąc), racjonalizm i krytyka sarmatyzmu',
    iconography: {
      title: 'Portret Stanisława Augusta z klepsydrą',
      artist: 'Marcello Bacciarelli',
      relation: 'Oświeceniowy monarcha-reformator zabiegający o mądrość, naukę i naprawę Rzeczypospolitej w konfrontacji z sarmackim zacofaniem opisanym w satyrach Krasickiego.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Marcello_Bacciarelli_-_Portret_Stanis%C5%82awa_Augusta_z_klepsydr%C4%85.jpg?width=1000',
      imageCaption: 'Marcello Bacciarelli, „Portret Stanisława Augusta Poniatowskiego z klepsydrą” (1793)',
      imageAlt: 'Oświeceniowy portret króla Stanisława Augusta zamyślonego nad klepsydrą i dokumentami państwowymi',
      fallbackDescription: 'Oświeceniowy portret alegoryczny przedstawiający ostatniego króla Rzeczypospolitej w ciemnym stroju z orderem Orła Białego, wspierającego zamyśloną głowę na dłoni. Przed monarchą na stole spoczywa klepsydra odliczająca czas ojczyzny oraz księgi i akta państwowe. Dzieło ukazuje mecenasa sztuki, reformatora i adresata satyry Ignacego Krasickiego „Do króla”, symbolizując dramatyczne zmagania rozumu i reform z sarmacką anarchią i upadkiem Rzeczypospolitej.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W satyrze „Do króla” pozorne zarzuty stawiane monarsze (że jest młody, wykształcony i jest Polakiem) w rzeczywistości są jego wielkimi zaletami.',
        t1: true,
        s2: 'Bohater satyry „Pijaństwo” po wytrzeźwieniu wstępuje do zakonu i nigdy więcej nie sięga po kieliszek.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (mechanizm przewrotnej ironii Krasickiego). Zdanie 2 fałszywe (w finale satyry bohater oznajmia: „Idę pić wódkę”).'
      }
    ]
  },
  // 10. ROMANTYZM - DZIADY CZ. III (KONRAD)
  {
    lektura: 'Dziady cz. III',
    autor: 'Adam Mickiewicz',
    epoch: 'Romantyzm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Konrad', dylemat: 'Bunt przeciw milczeniu Boga w imię bezgranicznej miłości do narodu', postawa: 'Prometeusz i poeta-wieszcz żądający od Boga rządu dusz', symbol: 'Skrzydła orle i krucze w Wielkiej Improwizacji' },
      { imie: 'Szatan / Diabły', dylemat: 'Przejęcie duszy poety w momencie jego skrajnej pychy (hybris)', postawa: 'Kusiciel podsycający w Konradzie nienawiść do Stwórcy', symbol: 'Głos z lewej strony dopowiadający słowo: Carem!' }
    ],
    topos: 'Prometeizm romantyczny, pycha (hybris) i kosmiczna walka o duszę człowieka',
    iconography: {
      title: 'Portret Adama Mickiewicza na Judahu skale',
      artist: 'Walenty Wańkowicz',
      relation: 'Wizerunek romantycznego wieszcza-indywidualisty wznoszącego się ponad światem, odpowiadający Konradowi i jego prometejskiemu buntowi w Wielkiej Improwizacji.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Walenty_Wa%C5%84kowicz_-_Portrait_of_Adam_Mickiewicz_on_the_rock_of_Judah_-_MP_2901_MNW_-_National_Museum_in_Warsaw.jpg?width=1000',
      imageCaption: 'Walenty Wańkowicz, „Portret Adama Mickiewicza na Judahu skale” (1827–1828)',
      imageAlt: 'Romantyczny wieszcz w powiewającym płaszczu oparty o skalny klif nad spienionym morzem krymskim',
      fallbackDescription: 'Kanon polskiego malarstwa romantycznego: poeta w ciemnym, podbitym futrem płaszczu wspiera się na skalnym cyplu góry Ajudah, wpatrując się w niebo z natchnionym wyrazem twarzy. Tło tworzy wzburzone morze i dramatyczne chmury. Wizerunek ten ucieleśnia archetyp poety-wieszcza, jednostki wybitnej, samotnej i obdarzonej boską mocą twórczą, będąc plastycznym pendant do postaci Konrada wygłaszającego Wielką Improwizację w celi bazylianów.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Konrad w celi bazylianów w Wilnie przechodzi metamorfozę z nieszczęśliwego kochanka Gustawa w bojownika za ojczyznę.',
        t1: true,
        s2: 'W kulminacji Wielkiej Improwizacji Konrad osobiście wykrzykuje ostateczne bluźnierstwo, nazywając Boga carem.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (napis na ścianie celi: Gustaw zmarł, narodził się Konrad). Zdanie 2 fałszywe (Konrad mdleje, a słowo „carem” dopowiada szatan).'
      }
    ]
  },
  // 11. ROMANTYZM - DZIADY CZ. III (MESJANIZM)
  {
    lektura: 'Dziady cz. III',
    autor: 'Adam Mickiewicz',
    epoch: 'Romantyzm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Ksiądz Piotr', dylemat: 'Pokorne uniżenie przed Bogiem w obliczu terroru carskiego', postawa: 'Cichy mistyk i sługa boży obdarzony łaską widzenia przyszłości Polski', symbol: 'Wizja Polski jako Chrystusa Narodów i mąż o imieniu czterdzieści i cztery' },
      { imie: 'Ewa', dylemat: 'Czysta, dziecięca modlitwa za prześladowaną młodzież i poetę-wygnańca', postawa: 'Niewinna orędowniczka obdarzona widzeniem Matki Boskiej obsypującej róże', symbol: 'Wianek z mistycznych róż' }
    ],
    topos: 'Mesjanizm narodowy (Polska Chrystusem Narodów) oraz martyrologia młodzieży wileńskiej',
    iconography: {
      title: 'Wigilia na Syberii',
      artist: 'Jacek Malczewski',
      relation: 'Męczeństwo polskich zesłańców i młodzieży patriotycznej na Syberii jako realizacja mickiewiczowskiej martyrologii i mesjanizmu.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Malczewski_wigilia_na_syberii.jpg?width=1000',
      imageCaption: 'Jacek Malczewski, „Wigilia na Syberii” (1892)',
      imageAlt: 'Grupa polskich zesłańców w kożuchach siedzących w milczeniu i zadumie przy pustym wigilijnym stole w syberyjskiej chacie',
      fallbackDescription: 'Przejmujący, nastrojowy obraz przedstawiający polskich więźniów politycznych i powstańców stłoczonych w surowej syberyjskiej chacie. Mężczyźni w grubych sukmanach i kożuchach siedzą wokół ubogiego stołu z kawałkiem chleba zamiast opłatka, pogrążeni w niemym cierpieniu i tęsknocie za krajem. Praca ta bezpośrednio wizualizuje martyrologię polskiej młodzieży opisaną przez Mickiewicza w scenie więziennej Dziadów cz. III (opowiadanie Sobolewskiego o kibitkach wywożących młodzież na Sybir) oraz mesjanistyczną ideę ofiary narodu.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Krakowie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W Widzeniu Księdza Piotra Polska zostaje ukazana jako Chrystus Narodów ukrzyżowany przez trzech zaborców pod auspicjami cara.',
        t1: true,
        s2: 'Ksiądz Piotr w nagrodę za swoją pokorę zostaje mianowany carskim arcybiskupem w Wilnie.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (alegoria męczeństwa i zmartwychwstania narodu). Zdanie 2 fałszywe (Ksiądz Piotr pozostaje ubogim mnichem bernardynem prześladowanym przez Nowosilcowa).'
      }
    ]
  },
  // 12. ROMANTYZM - DZIADY CZ. III (SALON WARSZAWSKI)
  {
    lektura: 'Dziady cz. III',
    autor: 'Adam Mickiewicz',
    epoch: 'Romantyzm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Senator Nowosilcow', dylemat: 'Utrzymanie carskich łask za cenę torturowania niewinnej młodzieży', postawa: 'Cyniczny satrapa carski, oportunista i despota dręczony koszmarami', symbol: 'Sen Senatora – diabły szarpiące duszę po wypadnięciu z łask cara' },
      { imie: 'Pani Rollison', dylemat: 'Rozpacz niewidomej matki błagającej o życie katowanego syna w więzieniu', postawa: 'Matka bolesna konfrontująca się z carskim oprawcą', symbol: 'Wypchnięcie młodego Rollisona przez okno celi' },
      { imie: 'Piotr Wysocki', dylemat: 'Ocena moralna społeczeństwa podzielonego na kolaborantów i patriotów', postawa: 'Młody oficer wygłaszający syntezę o narodzie jak lawa', symbol: 'Metafora lawy zimnej z wierzchu i gorejącej wewnątrz' }
    ],
    topos: 'Zdrada narodowa elit vs patriotyzm młodzieży (lawa), cynizm tyrana',
    iconography: {
      title: 'Rejtan – Upadek Polski',
      artist: 'Jan Matejko',
      relation: 'Zderzenie zdrady i serwilizmu ugodowych elit ze świętym oburzeniem patrioty, odpowiadające diagnozie Salonu Warszawskiego („naród jak lawa”).',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jan_Matejko_-_Upadek_Polski_(Reytan).jpg?width=1000',
      imageCaption: 'Jan Matejko, „Rejtan – Upadek Polski” (1866)',
      imageAlt: 'Tadeusz Rejtan z rozdartą koszulą zagradzający własnym ciałem drzwi przed zdradzieckimi magnatami na sejmie rozbiorowym',
      fallbackDescription: 'Monumentalna kompozycja historyczna ukazująca salę sejmu rozbiorowego w 1773 r. Tadeusz Rejtan leży w progu z rozdartą szatą na piersi, krzycząc: „Po moim trupie!”, zagradzając drogę zdrajcom narodu (Ponińskiemu, Szczęsnemu Potockiemu i Branickiemu) pędzącym ku carskim żołnierzom i złotu. Obraz ten stanowi doskonałą analogię do Salonu Warszawskiego Mickiewicza – demaskuje kosmopolityzm, służalczość i cynizm części elit, przeciwstawiając im bezkompromisowy patriotyzm jednostki wiernej ojczyźnie.',
      sourceDomain: 'Wikimedia Commons / Zamek Królewski w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'W Salonie Warszawskim arystokracja przy stoliku rozmawia po francusku i ubolewa nad wyjazdem Nowosilcowa.',
        t1: true,
        s2: 'Senator Nowosilcow okazuje wielkie miłosierdzie Pani Rollison i natychmiast uwalnia jej skatowanego syna.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (kosmopolityzm i serwilizm arystokracji). Zdanie 2 fałszywe (Senator nakazuje uwięzić matkę i sfingować samobójstwo jej syna).'
      }
    ]
  },
  // 13. ROMANTYZM - KORDIAN
  {
    lektura: 'Kordian',
    autor: 'Juliusz Słowacki',
    epoch: 'Romantyzm',
    isStarRequired: false,
    statusNote: '[Podstawa 2024: lektura z zakresu rozszerzonego – test historycznoliteracki na poziomie podstawowym jej nie sprawdza; w wypracowaniu PP można się do niej odwołać (informator CKE 2025, s. 10–11).]',
    bohaterowie: [
      { imie: 'Kordian', dylemat: 'Konflikt między pragnieniem zgładzenia cara a honorem rycerskim i zakazem skrytobójstwa', postawa: 'Winkelried narodów, spiskowiec ulegający paraliżowi woli pod sypialnią cara', symbol: 'Szczyt Mont Blanc, igła lodowca i dymiąca świeca' },
      { imie: 'Papież', dylemat: 'Utrzymanie relacji politycznych z carem Mikołajem I kosztem potępienia polskich powstańców', postawa: 'Lojalista potępiający walkę wyzwoleńczą Polaków i grożący klątwą', symbol: 'Papuga papieska i nakaz czczenia cara' }
    ],
    topos: 'Winkelriedyzm – Polska jako ofiara skupiająca ciosy tyrana w walce o wolność ludów',
    iconography: {
      title: 'Wędrowiec nad morzem mgły',
      artist: 'Caspar David Friedrich',
      relation: 'Romantyczny bohater na szczycie góry wobec nieskończoności natury, tożsamy z Kordianem wygłaszającym monolog na Mont Blanc.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caspar_David_Friedrich_-_Der_Wanderer_%C3%BCber_dem_Nebelmeer.jpg?width=1000',
      imageCaption: 'Caspar David Friedrich, „Wędrowiec nad morzem mgły” (1818)',
      imageAlt: 'Samotny wędrowiec stojący tyłem na szczycie skały i patrzący na morze mgieł i górskie szczyty',
      fallbackDescription: 'Ikona malarstwa romantycznego ukazująca postać wędrowca ukazanego od tyłu (Rückenfigur), stojącego samotnie na poszarpanym wierzchołku skalnym i kontemplującego majestatyczny ocean chmur i mgieł zasłaniający przepaście. Kompozycja ta jest plastycznym odzwierciedleniem monologu Kordiana na szczycie Mont Blanc w dramacie Słowackiego – symbolizuje duchowe dojrzewanie bohatera, przezwyciężenie weltschmerzu oraz narodziny koncepcji winkelriedyzmu („Polska Winkelriedem narodów!”).',
      sourceDomain: 'Wikimedia Commons / Hamburger Kunsthalle (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Kordian mdleje przed sypialnią cara Mikołaja I sparaliżowany przez Strach i Imaginację oraz kodeks rycerski.',
        t1: true,
        s2: 'Papież w Rzymie błogosławi Kordianowi i nakazuje Polakom natychmiastowe rozpoczęcie powstania zbrojnego.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (paraliż moralny bohatera). Zdanie 2 fałszywe (Papież nakazuje Polakom posłuszeństwo carowi i grozi klątwą).'
      }
    ]
  },
  // 14. ROMANTYZM - PAN TADEUSZ
  {
    lektura: 'Pan Tadeusz',
    autor: 'Adam Mickiewicz',
    epoch: 'Romantyzm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Jacek Soplica (Ksiądz Robak)', dylemat: 'Odkupienie zbrodni i infamii zdrajcy przez pokorną służbę ojczyźnie', postawa: 'Mnich-emisariusz, zrehabilitowany bohater narodowy', symbol: 'Krzyż Legii Honorowej przypięty na łożu śmierci' },
      { imie: 'Gerwazy Rębajło', dylemat: 'Żądza krwawej zemsty na rodzie Sopliców a chrześcijańskie przebaczenie zbrodniarzowi', postawa: 'Wierny klucznik Horeszków zmagający się z nienawiścią', symbol: 'Scyzoryk Gerwazego i znak krzyża Stolnika' },
      { imie: 'Tadeusz Soplica', dylemat: 'Obowiązek obywatelski i uczucie do Zosi a uwodzenie przez Telimenę', postawa: 'Młody szlachcic-patriota uwłaszczający chłopów', symbol: 'Mundur ułański i czamara szlachecka' }
    ],
    topos: 'Arkadia szlachecka, dwór w Soplicowie jako ostoja polskości',
    iconography: {
      title: 'Polonez Dąbrowskiego',
      artist: 'Juliusz Kossak',
      relation: 'Zgoda narodowa, tradycja szlachecka i uroczysty polonez z XII księgi Pana Tadeusza na cześć odradzającej się ojczyzny.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kossak_-_Polonez_D%C4%85browskiego.jpg?width=1000',
      imageCaption: 'Juliusz Kossak, „Polonez Dąbrowskiego” (1881)',
      imageAlt: 'Akwarela przedstawiająca staropolski orszak szlachty i oficerów tańczących poloneza na dziedzińcu dworku',
      fallbackDescription: 'Malownicza, nasycona słońcem akwarela przedstawiająca staropolski polonez prowadzony przez generała Dąbrowskiego w otoczeniu polskiej szlachty, ułanów napoleońskich i dam w szlacheckich kontuszach i empirkach na tle dworku i parku. Dzieło oddaje atmosferę XII księgi „Pana Tadeusza” (uroczystość zaręczynowa, koncert Jankiela i polonez prowadzony przez Podkomorzego), stanowiąc apoteozę staropolskiej tradycji, zgody narodowej i nadziei na odzyskanie wolności w 1812 roku.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Jacek Soplica przed śmiercią uzyskuje przebaczenie od Klucznika Gerwazego, który wyznaje, że Stolnik uczynił znak krzyża w stronę zabójcy.',
        t1: true,
        s2: 'Koncert Jankiela na cymbałach odbył się podczas bitwy z Moskalami w Soplicowie.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (znak krzyża Stolnika). Zdanie 2 fałszywe (Koncert Jankiela odbywa się w XII księdze na uczcie zaręczynowej, nie podczas bitwy).'
      }
    ]
  },
  // 15. POZYTYWIZM - LALKA (STANISŁAW WOKULSKI)
  {
    lektura: 'Lalka',
    autor: 'Bolesław Prus',
    epoch: 'Pozytywizm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Stanisław Wokulski', dylemat: 'Starcie pasji romantycznej z pozytywistycznym pragmatyzmem', postawa: 'Tragiczny idealista na pograniczu dwóch epok', symbol: 'Kamień w ruinach Zasławia z cytatem z Mickiewicza' },
      { imie: 'Izabela Łęcka', dylemat: 'Narcyzm i salonowe konwenanse a konieczność ratowania zrujnowanego majątku ojca', postawa: 'Salonowa lalka traktująca ludzi z niższych sfer instrumentalnie', symbol: 'Posąg Apollina i zgubiony medalion z blaszką Geista' }
    ],
    topos: 'Tragiczny idealista, destrukcyjna siła namiętności, starcie rozumu z uczuciem',
    iconography: {
      title: 'Piaskarze',
      artist: 'Aleksander Gierymski',
      relation: 'Realistyczny, naturalistyczny obraz nędzy warszawskiego Powiśla i pracy fizycznej, zbieżny z rozgoryczeniem Wokulskiego kondycją polskiego społeczeństwa.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aleksander_Gierymski,_Piaskarze.jpg?width=1000',
      imageCaption: 'Aleksander Gierymski, „Piaskarze” (1887)',
      imageAlt: 'Realistyczny obraz robotników wydobywających piasek z dna Wisły na tle praskiego brzegu Warszawy',
      fallbackDescription: 'Arcydzieło polskiego realizmu naturalistycznego ukazujące warszawskich robotników fizycznych w znoju przerzucających łopatami mokry piasek z barek na wiślany brzeg. Chłodna paleta szarości, błękitów i ugier doskonale oddaje surowość codziennego trudu proletariatu. Obraz ten jest wiernym plastycznym odpowiednikiem rozmyślań Stanisława Wokulskiego ze spaceru po Powiślu, ukazując kontrast między ciężką pracą nizin społecznych a jałowością i pasożytnictwem arystokracji.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Wokulski pomnożył majątek na handlu z zaopatrzeniem wojskowym podczas wojny rosyjsko-tureckiej na Bałkanach.',
        t1: true,
        s2: 'Wokulski ożenił się z Izabelą Łęcką i osiadł na stałe w majątku w Zasławku.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Wokulski zarobił krocie na wojnie). Zdanie 2 fałszywe (Izabela odrzuca Wokulskiego, który znika bez wieści).'
      }
    ]
  },
  // 16. POZYTYWIZM - LALKA (IGNACY RZECKI)
  {
    lektura: 'Lalka',
    autor: 'Bolesław Prus',
    epoch: 'Pozytywizm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Ignacy Rzecki', dylemat: 'Wierność bonapartyzmowi i ideałom Wiosny Ludów w epoce cynizmu', postawa: 'Ostatni romantyk, skromny subiekt i idealista polityczny', symbol: 'Mechaniczne zabawki w oknie wystawowym (theatrum mundi)' }
    ],
    topos: 'Theatrum mundi (świat jako teatr marionetek) oraz vanitas',
    iconography: {
      title: 'Lalki',
      artist: 'Witold Wojtkiewicz',
      relation: 'Topos theatrum mundi i motyw marionetek poruszanych przez niewidzialną sprężynę losu, tożsamy z rozmyślaniami starego subiekta Rzeckiego.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Witold_Wojtkiewicz_-_Dolls_-_Google_Art_Project.jpg?width=1000',
      imageCaption: 'Witold Wojtkiewicz, „Lalki” (1906)',
      imageAlt: 'Melancholijny obraz przedstawiający drewniane marionetki i pajace na miniaturowej scenie teatralnej',
      fallbackDescription: 'Modernistyczna, melancholijna kompozycja ukazująca świat marionetek, drewnianych kukiełek i pajacyków o smutnych, nieruchomych twarzach, ustawionych na miniaturowej scenie. Dzieło to genialnie unaocznia barokowo-pozytywistyczny topos theatrum mundi (świat jako teatr lalek) obecny w rozmyślaniach starego subiekta Ignacego Rzeckiego, który wieczorami nakręcał w sklepie mechaniczne zabawki, dochodząc do gorzkiego wniosku, że ludzie są jedynie bezwolnymi zabawkami w rękach niewidzialnych sił losu.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Ignacy Rzecki w młodości brał czynny udział w walkach na Węgrzech podczas Wiosny Ludów w 1848 roku.',
        t1: true,
        s2: 'Rzecki brał czynny udział w powstaniu listopadowym jako młody oficer artylerii.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Wiosna Ludów na Węgrzech u boku Katza). Zdanie 2 fałszywe (Rzecki nie walczył w powstaniu listopadowym).'
      }
    ]
  },
  // 17. POZYTYWIZM - LALKA (SPOŁECZEŃSTWO I POWIŚLE)
  {
    lektura: 'Lalka',
    autor: 'Bolesław Prus',
    epoch: 'Pozytywizm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Julian Ochocki', dylemat: 'Kult czystej nauki a brak funduszy i zrozumienia w zacofanym kraju', postawa: 'Młody pozytywista, marzyciel o maszynach latających', symbol: 'Model machiny latającej z metalu lżejszego od powietrza Geista' },
      { imie: 'Tomasz Łęcki', dylemat: 'Utrzymanie pozorów magnackiego luksusu mimo bankructwa', postawa: 'Pasożytniczy arystokrata żyjący z pożyczek i pogardzający pracą kupiecką', symbol: 'Salonowe weksle i przegrane partie kart' },
      { imie: 'Marianna (magdalenka)', dylemat: 'Ucieczka ze szponów nędzy i prostytucji dzięki filantropii', postawa: 'Przedstawicielka nizin warszawskich resocjalizowana przez Wokulskiego', symbol: 'Maszyna do szycia podarowana przez kupca' }
    ],
    topos: 'Organizm społeczny, krytyka feudalizmu i pasożytnictwa, praca organiczna i u podstaw',
    iconography: {
      title: 'Powiśle',
      artist: 'Aleksander Gierymski',
      relation: 'Naturalistyczny obraz nędzy warszawskiego Powiśla jako oskarżenie elit o zaniechanie pracy u podstaw i znieczulicę społeczną.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aleksander_Gierymski_-_Powi%C5%9Ble_(Bank_of_the_Vistula_in_Warsaw)_-_MNK_II-a-928_-_National_Museum_Krak%C3%B3w.jpg?width=1000',
      imageCaption: 'Aleksander Gierymski, „Powiśle” (1883)',
      imageAlt: 'Powiśle w Warszawie: rozpadające się drewniane domki, błoto i łodzie nad brzegiem Wisły',
      fallbackDescription: 'Przejmujący, realistyczny widok warszawskiego Powiśla z lat 80. XIX wieku: widać drewniane, rozpadające się chaty ubogich mieszkańców, błotnisty brzeg Wisły, wyciągnięte łodzie i porozrzucane śmieci. Naturalistyczna prawda detalu współgra z opisem Bolesława Prusa w „Lalce”, kiedy Wokulski schodzi na Powiśle i widzi degradację biologiczną i moralną nędzarzy, dochodząc do wniosku o konieczności podjęcia pracy u podstaw i ratowania najuboższych.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Krakowie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Wokulski podczas spaceru po Powiślu dochodzi do wniosku, że społeczeństwo polskie marnuje siły ludzkie niczym śmieci spychane ku rzece.',
        t1: true,
        s2: 'Baronowa Krzeszowska z radością przyjmuje w swojej kamienicy ubogich studentów i bezpłatnie ich dokarmia.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (rozgoryczenie Wokulskiego nędzą Powiśla). Zdanie 2 fałszywe (Krzeszowska wytacza procesy i nęka studentów).'
      }
    ]
  },
  // 18. POZYTYWIZM - ZBRODNIA I KARA
  {
    lektura: 'Zbrodnia i kara',
    autor: 'Fiodor Dostojewski',
    epoch: 'Pozytywizm',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Rodion Raskolnikow', dylemat: 'Wiara w prawo jednostek niezwykłych do przekraczania norm moralnych', postawa: 'Zbrodniarz przechodzący bolesny proces duchowego i moralnego odrodzenia', symbol: 'Ewangelia i przypowieść o wskrzeszeniu Łazarza czytana z Sonią' },
      { imie: 'Sonia Marmieładowa', dylemat: 'Utrata czystości cielesnej dla ocalenia głodującego rodzeństwa', postawa: 'Ewangeliczna jurodiwa, uosobienie miłosierdzia i odkupieńczej ofiary', symbol: 'Żółty bilet prostytutki i cyprysowy krzyżyk' },
      { imie: 'Porfiry Pietrowicz', dylemat: 'Pojedynek psychologiczny ze zbrodniarzem bez twardych dowodów rzeczowych', postawa: 'Genialny śledczy demaskujący teorię o ludziach niezwykłych', symbol: 'Artykuł O zbrodni i motyl krążący wokół świecy' }
    ],
    topos: 'Wina i kara, odrodzenie moralne przez pokutę i cierpienie',
    iconography: {
      title: 'Powrót syna marnotrawnego',
      artist: 'Rembrandt van Rijn',
      relation: 'Pokuta, przebaczenie i powrót zbłąkanego grzesznika do miłości ojcowskiej w relacji Rodiona z Bogiem i odkupieńczą miłością Soni.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg?width=1000',
      imageCaption: 'Rembrandt van Rijn, „Powrót syna marnotrawnego” (ok. 1668)',
      imageAlt: 'Stary ojciec w czerwonym płaszczu kładzie ręce na barkach klęczącego syna marnotrawnego w geście wybaczenia',
      fallbackDescription: 'Genialne płótno Rembrandta przedstawiające biblijną scenę przebaczenia: sędziwy ojciec o niewidzących, miłosiernych oczach czule kładzie dłonie na plecach klęczącego syna marnotrawnego w podartej szacie i ze zdartymi stopami. Ciepłe, złote światło skupia się na geście bezwarunkowej miłości. Dzieło koresponduje z duchową przemianą Rodiona Raskolnikowa na katordze na Syberii, jego pokutą, odnalezieniem wiary u boku Soni i czytaniem ewangelicznej przypowieści o wskrzeszeniu Łazarza.',
      sourceDomain: 'Wikimedia Commons / Ermitaż (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Raskolnikow zamordował starą lichwiarkę Alonę Iwanowną oraz jej niewinną siostrę Lizawietę.',
        t1: true,
        s2: 'Sonia namawia Rodiona, aby uciekł na Syberię i nie przyznawał się przed sędzią Porfirym.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (podwójne morderstwo). Zdanie 2 fałszywe (Sonia nakazuje mu uklęknąć na placu Siennym, pocałować ziemię i wyznać winę przed ludźmi).'
      }
    ]
  },
  // 19. MŁODA POLSKA - WESELE (OSOBY DRAMATU)
  {
    lektura: 'Wesele',
    autor: 'Stanisław Wyspiański',
    epoch: 'Młoda Polska',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Dziennikarz & Stańczyk', dylemat: 'Poczucie winy za usypianie narodu ugodową publicystyką w „Czasie”', postawa: 'Dekadent i lojalista skonfrontowany z wyrzutem sumienia', symbol: 'Kadyceusz (laska błazeńska) wręczona przez Stańczyka' },
      { imie: 'Poeta & Rycerz Czarny', dylemat: 'Ucieczka w dekadencki estetyzm i zmysłową lirykę zamiast czynu zbrojnego', postawa: 'Artysta modernistyczny nawiedzony przez Rycerza Zawiszę Czarnego', symbol: 'Pusta czarna zbroja Rycerza' },
      { imie: 'Pan Młody & Hetman Branicki', dylemat: 'Maskowanie szlacheckiej zdrady powierzchowną chłopomanią', postawa: 'Inteligent oskarżony o zdradę klasową przez magnata targowickiego', symbol: 'Chór psów szarpiących hetmana za zdradę ojczyzny' }
    ],
    topos: 'Projekcja podświadomości (osoby dramatu), rozliczenie inteligencji z niemocy',
    iconography: {
      title: 'Stańczyk',
      artist: 'Jan Matejko',
      relation: 'Głęboka zaduma i rozpacz błazna nad losem ojczyzny, tożsama ze zjawą Stańczyka nawiedzającą Dziennikarza w dworku w Bronowicach.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jan_Matejko,_Sta%C5%84czyk.jpg?width=1000',
      imageCaption: 'Jan Matejko, „Stańczyk” (1862)',
      imageAlt: 'Błazen w czerwonym stroju z czapką z dzwoneczkami siedzący w zamyśleniu w ciemnej komnacie na tle balu',
      fallbackDescription: 'Słynny obraz przedstawiający samotnego błazna królewskiego w szkarłatnym stroju z czapką z dzwoneczkami, siedzącego w ciemnej komnacie w fotelu w postawie głębokiej zadumy i rozpaczy nad wieścią o utracie Smoleńska. Za drzwiami widać rozbawiony, beztroski tłum na balu dworskim. Arcydzieło to zainspirowało Stanisława Wyspiańskiego do wprowadzenia widma Stańczyka w II akcie „Wesela”, gdzie zjawa wręcza Dziennikarzowi kadyceusz, zarzucając inteligencji usypianie narodu i zdradę dziejowej misji.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Stańczyk wręcza Dziennikarzowi kadyceusz, nakazując mącić narodową pamięć i studzić zapał do walki.',
        t1: true,
        s2: 'Widmo malarza de Laveaux ukazuje się Gospodarzowi i przekazuje mu złoty róg.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Stańczyk drwi z Dziennikarza). Zdanie 2 fałszywe (Widmo ukazuje się Marysi, a złoty róg przekazuje Wernyhora).'
      }
    ]
  },
  // 20. MŁODA POLSKA - WESELE (SYMBOLE NARODOWE)
  {
    lektura: 'Wesele',
    autor: 'Stanisław Wyspiański',
    epoch: 'Młoda Polska',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Gospodarz', dylemat: 'Poczucie patriotycznego obowiązku a paraliż woli i uśpienie', postawa: 'Inteligent zafascynowany ludem, który lekkomyślnie powierza misję parobkowi', symbol: 'Złoty róg przekazany przez Wernyhorę' },
      { imie: 'Jasiek', dylemat: 'Odpowiedzialność za powierzoną misję zwołania pospolitego ruszenia a próżność', postawa: 'Młody parobek gubiący róg przez chciwość', symbol: 'Czapka z pawich piór i ostały się ino sznur' },
      { imie: 'Chochoł', dylemat: 'Uśpienie narodu niegotowego do czynu zbrojnego', postawa: 'Tajemniczy dyrygent marazmu grający na patykach zaklętą melodię', symbol: 'Krzak róży owinięty słomą i chocholi taniec' }
    ],
    topos: 'Chocholi taniec – niemoc narodowa, zaklęty krąg i uśpienie ducha czynu',
    iconography: {
      title: 'Chochoły (Planty nocą)',
      artist: 'Stanisław Wyspiański',
      relation: 'Krzaki róż owinięte w słomę na krakowskich Plantach jako symbol niemocy narodowej, ale i uśpionego życia czekającego na wiosnę wolności.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stanis%C5%82aw_Wyspia%C5%84ski,_Chocho%C5%82y.jpg?width=1000',
      imageCaption: 'Stanisław Wyspiański, „Chochoły (Planty nocą / Planty o świcie)” (1898–1899)',
      imageAlt: 'Pastel przedstawiający uśpione słomiane chochoły na krakowskich Plantach nocą w blasku latarni',
      fallbackDescription: 'Tajemniczy, nokturnowy pastel Stanisława Wyspiańskiego przedstawiający krakowskie Planty po zmroku w świetle gazowej latarni. Wokół pni drzew stoją krzaki róż owinięte w słomę, przypominające zgarbione, widmowe postacie w hipnotycznym transie. Obraz stanowi bezpośrednie źródło najważniejszego symbolu „Wesela” – Chochoła dyrygującego lunatycznym tańcem uśpionego społeczeństwa polskiego, będąc zarazem symbolem nadziei na przebudzenie narodu ku wiośnie wolności.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Złoty róg zostaje zgubiony przez Jaśka, który schyla się po czapkę z pawich piór.',
        t1: true,
        s2: 'W finale Wesela chłopi i inteligenci wspólnie ruszają z kosami do walki o wolność.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (Jasiek gubi róg przez chciwość i przywiązanie do pawich piór). Zdanie 2 fałszywe (bohaterowie zastygają w hipnotycznym chocholim tańcu).'
      }
    ]
  },
  // 21. DWUDZIESTOLECIE - PRZEDWIOŚNIE
  {
    lektura: 'Przedwiośnie',
    autor: 'Stefan Żeromski',
    epoch: 'Dwudziestolecie międzywojenne',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Cezary Baryka', dylemat: 'Rozdarcie między radykalną rewolucją a powolną ewolucją państwa Gajowca', postawa: 'Młody buntownik poszukujący prawdy o odrodzonej Polsce', symbol: 'Szklane domy oraz czapka legionowa w marszu na Belweder' },
      { imie: 'Seweryn Baryka', dylemat: 'Przekonanie syna do powrotu do nieznanej ojczyzny za cenę baśniowej utopii', postawa: 'Schorowany ojciec umierający w drodze do kraju', symbol: 'Opowieść o szklanych domach inżyniera Baryki' },
      { imie: 'Szymon Gajowiec', dylemat: 'Odbudowa kraju zrujnowanego zaborami bez ulegania krwawym przewrotom', postawa: 'Pozytywista państwowy, zwolennik ewolucyjnych reform i własnej waluty', symbol: 'Projekt reformy walutowej i edukacyjnej' }
    ],
    topos: 'Mit arkadyjski zderzony z nędzą i chaosem rewolucji, rozczarowanie niepodległością',
    iconography: {
      title: 'Strajk',
      artist: 'Stanisław Lentz',
      relation: 'Zbiorowy protest robotników i gniew społeczny, odpowiadający nastrojom rozczarowania odrodzoną Polską i pochodowi na Belweder w finale Przedwiośnia.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stanis%C5%82aw_Lentz,_Strajk.jpg?width=1000',
      imageCaption: 'Stanisław Lentz, „Strajk” (1910)',
      imageAlt: 'Trzej zdeterminowani robotnicy w roboczych koszulach stojący z założonymi rękami w geście buntu',
      fallbackDescription: 'Monumentalny, ekspresyjny obraz ukazujący trzech warszawskich robotników fabrycznych w prostych strojach roboczych, stojących nieruchomo z twardymi, zaciętymi minami i założonymi rękami w geście nieugiętego protestu. Ciemna, surowa tonacja podkreśla powagę i determinację klasy pracującej. Dzieło koresponduje z rewolucyjnymi wątkami w „Przedwiośniu” Stefana Żeromskiego, obrazując napięcia społeczne, rozczarowanie nędzą w odrodzonej Polsce i finałowy marsz Cezarego Baryki na Belweder w szeregach robotników.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Wizję szklanych domów przekazał Cezaremu jego ojciec Seweryn podczas podróży pociągiem do Polski.',
        t1: true,
        s2: 'W Nawłoci Cezary Baryka żyje w nędzy, wykonując ciężką pracę fizyczną w czworakach.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (utopijna opowieść Seweryna). Zdanie 2 fałszywe (w Nawłoci Cezary zaznaje ziemiańskiego luksusu, flirtów z Laurą i Karoliną oraz beztroski).'
      }
    ]
  },
  // 22. DWUDZIESTOLECIE - FERDYDURKE
  {
    lektura: 'Ferdydurke',
    autor: 'Witold Gombrowicz',
    epoch: 'Dwudziestolecie międzywojenne',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Józio Kowalski', dylemat: 'Ucieczka przed upupieniem i gębą narzucaną przez otoczenie', postawa: 'Trzydziestolatek wtrącony powtórnie w wiek chłopięcy walczący z Formą', symbol: 'Zielona nóżka i ucieczka przed Formą' },
      { imie: 'Profesor Pimko', dylemat: 'Infantylizacja młodzieży w celu sprawowania nad nią kontroli', postawa: 'Karykaturalny pedagog, mistrz narzucania gęby i upupiania', symbol: 'Klepanie po pupie i szkolna cenzura myśli' },
      { imie: 'Miętus i Syfon', dylemat: 'Starcie brutalnego buntu z wymuszoną niewinnością i dewocją', postawa: 'Uczniowie toczący groteskowy pojedynek na miny w szkole', symbol: 'Zgwałcenie przez uszy (uświadomienie)' }
    ],
    topos: 'Forma, gęba, upupienie, jednostka zniewolona przez społeczne konwencje',
    iconography: {
      title: 'Ilustracja do Ferdydurke',
      artist: 'Bruno Schulz',
      relation: 'Groteskowa dekonstrukcja ludzkiej tożsamości i zniewolenie człowieka przez narzuconą Formę i Upupienie w Ferdydurke.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ferdydurke.jpg?width=1000',
      imageCaption: 'Bruno Schulz, „Ilustracja i okładka do Ferdydurke Witolda Gombrowicza” (1937)',
      imageAlt: 'Groteskowa grafika Bruno Schulza przedstawiająca zniekształconą postać ludzką i zdeformowaną głowę z motywem Formy',
      fallbackDescription: 'Oryginalna grafika Bruno Schulza stworzona do pierwodruku „Ferdydurke” w 1937 r. Ukazuje surrealistyczną postać o zdeformowanych proporcjach, symbolizującą infantylizację dorosłego człowieka, wtłoczenie w sztuczną pozę oraz groteskową utratę autentyczności. Rysunek Schulza doskonale oddaje kluczowe kategorie powieści Gombrowicza: upupienie, przyprawianie gęby oraz niemożność ucieczki jednostki przed terrorem społecznej Formy.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Profesor Pimko uprowadza 30-letniego Józia i umieszcza go w szkole dyrektora Piórkowskiego, by go upupić.',
        t1: true,
        s2: 'Józiowi udaje się w finale całkowicie uciec przed gębą i formą, osiągając stan czystej wolności.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (początek powieści). Zdanie 2 fałszywe (przed gębą nie ma ucieczki: „nie ma ucieczki przed gębą, jak tylko w inną gębę”).'
      }
    ]
  },
  // 23. WOJNA I OKUPACJA - INNY ŚWIAT I BOROWSKI
  {
    lektura: 'Inny świat i Opowiadania Borowskiego',
    autor: 'Gustaw Herling-Grudziński / Tadeusz Borowski',
    epoch: 'Wojna i okupacja',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Narrator Herling-Grudziński', dylemat: 'Obrona godności i pamięci w warunkach sowieckiego Gułagu', postawa: 'Świadek łagrowego piekła odmawiający relatywizacji zdrady po wojnie', symbol: 'Odmowa wypowiedzenia słowa: Rozumiem w Rzymie' },
      { imie: 'Michaił Kostylew', dylemat: 'Bunt przeciwko niewolniczej pracy na rzecz oprawców', postawa: 'Bohater cierpiący w imię ocalenia duszy i wolnej woli', symbol: 'Opalanie własnej ręki w ogniu i samobójstwo' },
      { imie: 'Tadek (Borowski)', dylemat: 'Przetrwanie w niemieckim lagrze Auschwitz kosztem wyzbycia się empatii', postawa: 'Człowiek zlagrowany przystosowany do reguł obozowej machiny śmierci', symbol: 'Rampa kolejowa w Birkenau (Proszę państwa do gazu)' }
    ],
    topos: 'Człowiek złagrowany i zlagrowany, sytuacja graniczna, dekompozycja dekalogu w totalitaryzmie',
    iconography: {
      title: 'Brama obozu Auschwitz II-Birkenau i rampa kolejowa',
      artist: 'Stanisław Mucha',
      relation: 'Historyczny dokument Zagłady i rampa wyładowcza w Birkenau, odpowiadająca obozowej rzeczywistości opowiadań Tadeusza Borowskiego i Herlinga-Grudzińskiego.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Auschwitz_II-Birkenau_gate,_after_1945.jpg?width=1000',
      imageCaption: 'Stanisław Mucha, „Brama obozu Auschwitz II-Birkenau i tory kolejowe” (fotografia historyczna, 1945)',
      imageAlt: 'Czarno-biała fotografia historyczna przedstawiająca tory kolejowe prowadzące przez ceglaną bramę główną obozu Birkenau',
      fallbackDescription: 'Poruszająca fotografia dokumentalna wykonana tuż po wyzwoleniu obozu w 1945 roku. Ukazuje tory kolejowe zbiegające się ku ceglanej Bramie Śmierci obozu koncentracyjnego i zagłady Auschwitz II-Birkenau. To właśnie na tej rampie kolejowej rozgrywa się akcja opowiadania Tadeusza Borowskiego „Proszę państwa do gazu”, ukazując bezduszny mechanizm zlagrowania, selekcji transportów oraz odczłowieczenia więźniów zmuszonych do uczestnictwa w machinie ludobójstwa.',
      sourceDomain: 'Wikimedia Commons (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Motto Innego świata: „Tu otwierał się inny, odrębny świat...” pochodzi ze Wspomnień z domu umarłych Dostojewskiego.',
        t1: true,
        s2: 'Narrator Innego świata w finale w Rzymie mówi „Rozumiem” byłemu więźniowi, który wydał kolegów na śmierć.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (motto z Dostojewskiego). Zdanie 2 fałszywe (autor milczy, nie chcąc relatywizować praw moralnych wolnego świata).'
      }
    ]
  },
  // 24. WOJNA I OKUPACJA - ZDĄŻYĆ PRZED PANEM BOGIEM
  {
    lektura: 'Zdążyć przed Panem Bogiem',
    autor: 'Hanna Krall',
    epoch: 'Wojna i okupacja',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Marek Edelman', dylemat: 'Ocalenie godności i prawa do wyboru sposobu umierania w getcie warszawskim', postawa: 'Ostatni przywódca ŻOB, kardiochirurg toczący wyścig z Bogiem o życie pacjentów', symbol: 'Żółte żonkile, świeczka życia i stół operacyjny' },
      { imie: 'Mordechaj Anielewicz', dylemat: 'Dowodzenie powstaniem w bunkrze przy Miłej 18 bez nadziei na ocalenie', postawa: 'Młody komendant, który popełnił samobójstwo w otoczonym schronie', symbol: 'Bunkier przy Miłej 18 i matka malująca ryby' }
    ],
    topos: 'Deheroizacja powstania, godna śmierć, wyścig lekarza z Bogiem, ocalenie pamięci',
    iconography: {
      title: 'Pomnik Bohaterów Getta w Warszawie',
      artist: 'Natan Rapoport',
      relation: 'Monumentalny pomnik bojowników getta zderzony z suchą, antypatetyczną relacją Marka Edelmana o prawie do wyboru godnego umierania.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pomnik_Bohater%C3%B3w_Getta_w_Warszawie_2019.jpg?width=1000',
      imageCaption: 'Natan Rapoport, „Pomnik Bohaterów Getta w Warszawie” (1948)',
      imageAlt: 'Monumentalna płaskorzeźba z brązu i granitu przedstawiająca bojowników getta z bronią, granatami i pochodniami',
      fallbackDescription: 'Monumentalny pomnik z labradorytu i brązu wzniesiony na ruinach warszawskiego getta. Płaskorzeźba przedstawia heroiczny zryw bojowników ŻOB pod wodzą Mordechaja Anielewicza z butelkami zapalającymi i pistoletami, podczas gdy na rewersie widnieje pochód skazańców prowadzonych na śmierć. W kontekście reportażu Hanny Krall pomnik Rapoporta stanowi patetyczny, spiżowy kontrapunkt dla intymnej, rzeczowej i antybohaterskiej relacji Marka Edelmana o powstańczej walce o godną śmierć i późniejszym wyścigu lekarskim z Bogiem.',
      sourceDomain: 'Wikimedia Commons (CC BY-SA 4.0)'
    },
    factualStatements: [
      {
        s1: 'Marek Edelman po wojnie został kardiochirurgiem i uważał swoją pracę za wyścig ze Stwórcą o ocalenie płomienia życia pacjenta.',
        t1: true,
        s2: 'Powstanie w getcie warszawskim wybuchło z zamiarem militarnego wyzwolenia stolicy i pokonania armii niemieckiej.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (metafora wyścigu z Bogiem). Zdanie 2 fałszywe (celem był wybór godnej śmierci z bronią w ręku: „Chodziło tylko o wybór sposobu umierania”).'
      }
    ]
  },
  // 25. WSPÓŁCZESNOŚĆ - DŻUMA I ROK 1984
  {
    lektura: 'Dżuma i Rok 1984',
    autor: 'Albert Camus / George Orwell',
    epoch: 'Współczesność',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Doktor Bernard Rieux', dylemat: 'Codzienna walka z zarazą bez nadziei na ostateczne zwycięstwo nad śmiercią', postawa: 'Laicka przyzwoitość, wierność cierpiącemu człowiekowi bez odwołań do Boga', symbol: 'Dziennik kronikarski walki z epidemią w Oranie' },
      { imie: 'Jean Tarrou', dylemat: 'Pragnienie stania się świeckim świętym i odmowa uczestnictwa w zabijaniu', postawa: 'Świecki humanista, organizator ochotniczych formacji sanitarnych', symbol: 'Kąpiel w morzu z doktorem Rieux jako chwila braterstwa' },
      { imie: 'Winston Smith', dylemat: 'Obrona własnej pamięci i człowieczeństwa w ustroju totalitarnego kłamstwa', postawa: 'Buntownik złamany przez machinę tortur i inżynierię strachu', symbol: 'Szklany przycisk do papieru z koralem i Pokój 101 ze szczurami' }
    ],
    topos: 'Parabola zła, egzystencjalizm laicki, antyutopia / dystopia kontrolująca myśl',
    iconography: {
      title: 'Triumf Śmierci',
      artist: 'Pieter Bruegel starszy',
      relation: 'Epidemia i zło jako wszechogarniająca siła zrównująca wszystkich ludzi bez względu na status społeczny, korespondująca z parabolą Dżumy Camusa.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Triumph_of_Death_by_Pieter_Bruegel_the_Elder.jpg?width=1000',
      imageCaption: 'Pieter Bruegel starszy, „Triumf Śmierci” (ok. 1562)',
      imageAlt: 'Panoramiczny obraz armii szkieletów niszczącej całe miasto, tratującej ludzi i palącej ziemię',
      fallbackDescription: 'Wstrząsająca, apokaliptyczna panorama zagłady, w której niezliczone legiony szkieletów pod wodzą Śmierci na wychudzonym koniu mordują ludność bez względu na wiek i pozycję społeczną. Wypalona ziemia, dymiące pożary, szubienice i koła tortur tworzą obraz totalnego spustoszenia. Dzieło Bruegla jest doskonałą metaforą zarazy w „Dżumie” Alberta Camusa (zło metafizyczne i totalitarne trawiące wspólnotę) oraz represyjnego terroru Wielkiego Brata w „Roku 1984” Orwella.',
      sourceDomain: 'Wikimedia Commons / Museo del Prado (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Doktor Rieux w finale powieści przypomina, że bakcyl dżumy nigdy nie umiera i może powrócić ku nieszczęściu ludzi.',
        t1: true,
        s2: 'Winston Smith w finale Roku 1984 ucieka z Oceanii i dołącza do wolnego podziemia w Eurazji.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (uniwersalne ostrzeżenie Camusa). Zdanie 2 fałszywe (Winston zostaje złamany torturami w Pokoju 101 i szczerze kocha Wielkiego Brata).'
      }
    ]
  },
  // 26. WSPÓŁCZESNOŚĆ - TANGO
  {
    lektura: 'Tango',
    autor: 'Sławomir Mrożek',
    epoch: 'Współczesność',
    isStarRequired: true,
    bohaterowie: [
      { imie: 'Artur', dylemat: 'Próba przywrócenia norm i formy w świecie totalnej anarchii i nihilizmu rodziców', postawa: 'Neokonserwatysta, zbuntowany syn przegrywający z brutalną siłą fizyczną', symbol: 'Tradycyjny garnitur i gorset narzucony rodzinie' },
      { imie: 'Edek', dylemat: 'Prymitywna ekspansja i zaspokojenie doraźnych potrzeb fizjologicznych', postawa: 'Prostak, uosobienie brutalnej dyktatury chamstwa', symbol: 'Taniec La Cumparsita na trupie Artura w butach zmarłego' },
      { imie: 'Stomil i Eleonora', dylemat: 'Odrzucenie wszelkich konwencji obyczajowych w imię absolutnej swobody', postawa: 'Zestarzali awangardziści tolerujący obecność Edka przy kartach', symbol: 'Rozchełstana piżama i eksperymenty teatralne' }
    ],
    topos: 'Kryzys kultury, rozpad formy i zwycięstwo prymitywnej przemocy nad rozkładem elit',
    iconography: {
      title: 'Krucjata dziecięca',
      artist: 'Witold Wojtkiewicz',
      relation: 'Groteskowy korowód zagubionych postaci jako parodia ładu społecznego, bezradność tradycyjnej kultury wobec absurdu i finałowy triumf prymitywnej siły w Tangu Mrożka.',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Witold_Wojtkiewicz_-_Children%27s_crusade_-_MP_356_-_National_Museum_in_Warsaw.jpg?width=1000',
      imageCaption: 'Witold Wojtkiewicz, „Krucjata dziecięca” (1905)',
      imageAlt: 'Groteskowy korowód dzieci w dziwacznych strojach dorosłych z zabawkami i imitacjami oręża',
      fallbackDescription: 'Arcydzieło polskiej groteski i wczesnego ekspresjonizmu: korowód bezradnych, smutnych dzieci w karykaturalnych strojach dorosłych, z drewnianymi zabawkami i imitacjami oręża, maszerujących w nieokreśloną przestrzeń. Dzieło doskonale oddaje dramaturgię Sławomira Mrożka w „Tangu”: infantylizację świata dorosłych (anarchia Stomila i Eleonory bawiących się w awangardę), rozpaczliwą próbę Artura narzucenia sztucznej formy i powagi oraz finałowy rozpad kultury pod naporem prymitywnego chamstwa Edka.',
      sourceDomain: 'Wikimedia Commons / Muzeum Narodowe w Warszawie (Public Domain)'
    },
    factualStatements: [
      {
        s1: 'Artur zamierza przywrócić porządek w domu poprzez wymuszenie tradycyjnego ślubu z Alą.',
        t1: true,
        s2: 'Stomil odmawia tolerowania anarchii i osobiście zabija Edka w pojedynku na rewolwery.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (ślub jako próba odbudowy formy). Zdanie 2 fałszywe (to Edek zabija Artura ciosem w kark i przejmuje rządy siły).'
      }
    ]
  }
];

// Lektury obowiązkowe PP z podstawy 2024, których brakowało w bazie (informator CKE 2025, s. 9–11).
// Ich zadania dostają kolejne numery ID, więc zadania 26 wcześniejszych jednostek zachowują swoje ID.
const LEKTURY_2024: typeof LEKTURY_DATA = [
  {
    lektura: 'Skąpiec',
    autor: 'Molier',
    epoch: 'Barok',
    isStarRequired: true,
    statusNote: '[Podstawa 2024: lektura obowiązkowa PP. Komedia klasycystyczna (XVII w.) – w kursie omawiana przy baroku.]',
    bohaterowie: [
      { imie: 'Harpagon', dylemat: 'Przywiązanie do pieniędzy ważniejsze niż szczęście dzieci i własne uczucia', postawa: 'Skąpiec i lichwiarz, który wszystko przelicza na zysk – komiczny i zarazem groźny dla bliskich', symbol: 'Szkatułka z pieniędzmi zakopana w ogrodzie' },
      { imie: 'Kleant', dylemat: 'Miłość do Mariany i bunt przeciw ojcu, który chce poślubić tę samą dziewczynę', postawa: 'Syn zmuszony pożyczać na lichwę, by żyć na poziomie, rywal ojca', symbol: 'Pożyczka na wysoki procent, za którą stoi sam Harpagon' },
      { imie: 'Eliza', dylemat: 'Posłuszeństwo ojcu albo wierność ukochanemu Waleremu', postawa: 'Córka broniąca prawa do wyboru męża wbrew planom ojca', symbol: 'Małżeństwo z Anzelmem „bez posagu”' }
    ],
    topos: 'Komedia charakterów – wada (skąpstwo) wyolbrzymiona do granic absurdu',
    iconography: {
      title: 'Śmierć skąpca',
      artist: 'Hieronim Bosch',
      relation: 'Umierający bogacz waha się między aniołem wskazującym krzyż a diabłem podsuwającym worek złota – jak Harpagon, który do końca wybiera pieniądze zamiast ludzi.',
      fallbackDescription: 'Obraz ukazuje wnętrze sypialni: na łożu leży umierający mężczyzna, przy nim anioł wskazuje na krucyfiks w oknie, a w drzwiach stoi Śmierć ze strzałą. U stóp łóżka postać skąpca chowa monety do skrzyni, z której diabeł podaje mu sakiewkę.',
      sourceDomain: 'National Gallery of Art, Waszyngton (domena publiczna)'
    },
    factualStatements: [
      {
        s1: 'Harpagon chce wydać Elizę za bogatego Anzelma, bo ten zgadza się ją poślubić bez posagu.',
        t1: true,
        s2: 'W zakończeniu Harpagon poślubia Marianę, a odzyskaną szkatułkę oddaje Kleantowi.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe („bez posagu” to powtarzany argument Harpagona). Zdanie 2 fałszywe: Harpagon rezygnuje z Mariany na rzecz Kleanta w zamian za zwrot szkatułki i zostaje z pieniędzmi.'
      }
    ]
  },
  {
    lektura: 'Miejsce',
    autor: 'Andrzej Stasiuk (z tomu Opowieści galicyjskie)',
    epoch: 'Współczesność',
    isStarRequired: true,
    statusNote: '[Podstawa 2024: lektura obowiązkowa PP.]',
    bohaterowie: [
      { imie: 'Narrator', dylemat: 'Czy świętość miejsca znika, gdy rozebraną cerkiew przenosi się do muzeum', postawa: 'Uważny obserwator łączący realistyczny opis z refleksją metafizyczną', symbol: 'Prostokąt gołej, gliniastej ziemi po rozebranej cerkwi' },
      { imie: 'Turysta z aparatem', dylemat: 'Poznawanie przeszłości przez mapę i fotografię, bez zrozumienia sensu miejsca', postawa: 'Przybysz, który widzi tylko to, co da się zmierzyć i sfotografować', symbol: 'Próg cerkwi, na którym nieświadomie stoi' }
    ],
    topos: 'Genius loci – miejsce, którego nie da się przenieść, i przemijanie świata pogranicza',
    iconography: {
      title: 'Cerkiew (akwarele z cerkwiami Łemkowszczyzny)',
      artist: 'Nikifor Krynicki',
      relation: 'Naiwne, pełne czułości akwarele Nikifora utrwalają drewniane cerkwie Beskidu Niskiego – ten sam świat, o którego zniknięciu opowiada Stasiuk.',
      fallbackDescription: 'Akwarela w stylu naiwnym: drewniana cerkiew z kopułami na tle zielonych wzgórz, uproszczone kształty i jasne barwy; budowla zajmuje środek kompozycji.',
      sourceDomain: 'Muzeum Nikifora w Krynicy-Zdroju'
    },
    factualStatements: [
      {
        s1: 'Cerkiew z opowiadania rozebrano i przeniesiono do muzeum, a na jej miejscu został pusty prostokąt ziemi.',
        t1: true,
        s2: 'Narrator jest przekonany, że cerkiew w muzeum w pełni zachowała swoje znaczenie, bo przeniesiono ją w całości.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe. Zdanie 2 fałszywe: narrator stwierdza, że „miejsca nie można przenieść”, i nie ma pewności, czy cerkiew naprawdę zabrano.'
      }
    ]
  },
  {
    lektura: 'Profesor Andrews w Warszawie',
    autor: 'Olga Tokarczuk (z tomu Gra na wielu bębenkach)',
    epoch: 'Współczesność',
    isStarRequired: true,
    statusNote: '[Podstawa 2024: lektura obowiązkowa PP.]',
    bohaterowie: [
      { imie: 'Profesor Andrews', dylemat: 'Samotność i bezradność obcokrajowca w mieście, w którym nagle zawiesza się zwykłe życie', postawa: 'Obcy obserwator, który nie zna języka i próbuje zrozumieć świat z gestów i twarzy', symbol: 'Głuchy telefon, który ciągle nie działa' },
      { imie: 'Gosha', dylemat: 'Nieobecność opiekunki, która miała być łącznikiem profesora ze światem', postawa: 'Postać wyczekiwana i szukana w tłumie – znak zerwanej komunikacji', symbol: 'Twarze w kolejce, wśród których profesor jej szuka' }
    ],
    topos: 'Obcość i granice porozumienia – historia (stan wojenny) widziana oczami przybysza z zewnątrz',
    iconography: {
      title: 'Czas Apokalipsy (Warszawa, grudzień 1981)',
      artist: 'Chris Niedenthal',
      relation: 'Fotografia transportera opancerzonego przed kinem z plakatem filmu „Czas Apokalipsy” to ikona stanu wojennego – grozy, którą profesor Andrews odczuwa, choć nie rozumie jej przyczyn.',
      fallbackDescription: 'Zimowe zdjęcie warszawskiej ulicy: na pierwszym planie wóz opancerzony, za nim fasada kina z dużym napisem reklamującym film „Czas Apokalipsy”.',
      sourceDomain: 'Chris Niedenthal (fotografia prasowa, 1981)'
    },
    factualStatements: [
      {
        s1: 'Akcja opowiadania rozgrywa się w Warszawie w grudniu 1981 r., po wprowadzeniu stanu wojennego.',
        t1: true,
        s2: 'Profesor Andrews swobodnie rozmawia z mieszkańcami Warszawy, bo dobrze zna język polski.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe (kolejki, żołnierze z psem, niedziałające telefony). Zdanie 2 fałszywe: profesor nie zna polskiego i może się tylko domyślać znaczenia słów, np. „Żywą czy na miejscu?”.'
      }
    ]
  },
  {
    lektura: 'Podróże z Herodotem',
    autor: 'Ryszard Kapuściński (fragmenty)',
    epoch: 'Współczesność',
    isStarRequired: true,
    statusNote: '[Podstawa 2024: lektura obowiązkowa PP (fragmenty).]',
    bohaterowie: [
      { imie: 'Narrator-reporter', dylemat: 'Pragnienie „przekroczenia granicy” i lęk przed światem, którego języka i kultury nie zna', postawa: 'Młody reporter, który uczy się świata przez podróż, rozmowę i lekturę', symbol: 'Egzemplarz „Dziejów” Herodota zabrany w pierwszą podróż' },
      { imie: 'Herodot', dylemat: 'Jak opisać wojny i obyczaje wielu ludów, nie tracąc ciekawości wobec Innego', postawa: 'Pierwszy reporter i wzór dla narratora – podróżnik zbierający relacje świadków', symbol: '„Dzieje” jako zapis rozmów z ludźmi różnych kultur' }
    ],
    topos: 'Podróż jako poznanie Innego i przekraczanie granic – fizycznych, językowych i kulturowych',
    iconography: {
      title: 'Mapa świata według Herodota (rekonstrukcja)',
      artist: 'rekonstrukcja kartograficzna z XIX w.',
      relation: 'Mapa znanego Herodotowi świata pokazuje, jak granice poznania przesuwały się dzięki podróżom – tak jak granice świata młodego reportera.',
      fallbackDescription: 'Rekonstrukcja mapy: w środku Morze Śródziemne i Grecja, wokół Azja Mniejsza, Egipt, Persja i Scytia; krańce świata otoczone oceanem.',
      sourceDomain: 'Wikimedia Commons (domena publiczna)'
    },
    factualStatements: [
      {
        s1: 'Narrator zabiera „Dzieje” Herodota w swoją pierwszą zagraniczną podróż reporterską, do Indii.',
        t1: true,
        s2: 'Herodot jest w książce przedstawiony jako autor, który opisywał wyłącznie dzieje Greków i nie interesował się innymi ludami.',
        t2: false,
        expl: 'Zdanie 1 prawdziwe. Zdanie 2 fałszywe: Herodot jest dla narratora wzorem ciekawości wobec wielu ludów i kultur – Persów, Egipcjan, Scytów.'
      }
    ]
  }
];

/** Jednostka dla i-tego zadania pętli: najpierw dotychczasowe zadania (oldCount), potem lektury 2024. */
const unitFor = (i: number, oldCount: number) =>
  i <= oldCount ? LEKTURY_DATA[(i - 1) % LEKTURY_DATA.length] : LEKTURY_2024[(i - oldCount - 1) % LEKTURY_2024.length];

// -------------------------------------------------------------------------
// T7: OCENA POSTAWY I MOTYWACJI BOHATERA LEKTURY (104 zadania = 4 na jednostkę + 16 dla lektur 2024)
// ID: POL_P2_T7_001 do POL_P2_T7_120
// -------------------------------------------------------------------------
const T7_TOTAL = 104 + 4 * LEKTURY_2024.length;
for (let i = 1; i <= T7_TOTAL; i++) {
  const lekItem = unitFor(i, 104);
  const boh = lekItem.bohaterowie[(i - 1) % lekItem.bohaterowie.length];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T7_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T7_ocena_postawy_bohatera',
    title: `Ocena postawy (${i}/${T7_TOTAL}): ${boh.imie} („${lekItem.lektura}”)`,
    question: `Na podstawie znajomości utworu „${lekItem.lektura}” (${lekItem.autor}), oceń postawę bohatera: ${boh.imie}. Wyjaśnij, przed jakim dylematem moralnym stanął i jak jego wybór zdeterminował jego dalsze losy w kontekście ideowym epoki (${lekItem.epoch}).`,
    epoch: lekItem.epoch,
    lektura: lekItem.lektura,
    isStarRequired: lekItem.isStarRequired,
    points: 2,
    correctAnswerText: `${boh.imie} zmaga się z problemem: ${boh.dylemat}. Jego postawa (${boh.postawa}) prowadzi do kluczowych rozstrzygnięć fabularnych, ukazując tragizm lub odrodzenie bohatera w kontekście ideowym epoki (${lekItem.epoch}).`,
    ckeKeyCriteria: [
      '2 pkt – wyczerpująca ocena postawy bohatera, precyzyjne nazwanie dylematu moralnego oraz wskazanie konkretnych konsekwencji jego decyzji.',
      '1 pkt – tylko ogólna ocena bez precyzyjnego wskazania dylematu lub konsekwencji.',
      '0 pkt – odpowiedź powierzchowna lub niezgodna z fabułą utworu.'
    ],
    explanation: `Zadanie bada głęboką znajomość motywacji postaci w kanonie lektur CKE. ${lekItem.statusNote || ''}`,
    tags: [lekItem.lektura, boh.imie, 'postawa bohatera', lekItem.epoch],
    difficulty: 'srednia'
  });
}

// -------------------------------------------------------------------------
// T8: ANALIZA FRAGMENTU LEKTURY I SYMBOLIKI (104 zadania = 4 na jednostkę + 16 dla lektur 2024)
// ID: POL_P2_T8_001 do POL_P2_T8_120
// -------------------------------------------------------------------------
const T8_TOTAL = 104 + 4 * LEKTURY_2024.length;
for (let i = 1; i <= T8_TOTAL; i++) {
  const lekItem = unitFor(i, 104);
  const boh = lekItem.bohaterowie[(i - 1) % lekItem.bohaterowie.length];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T8_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T8_analiza_fragmentu_symboliki',
    title: `Symbolika i motyw (${i}/${T8_TOTAL}): ${boh.symbol} („${lekItem.lektura}”)`,
    question: `W utworze „${lekItem.lektura}” kluczową rolę odgrywa motyw/atrybut: ${boh.symbol}. Wyjaśnij symboliczne znaczenie tego elementu w kontekście losów postaci (${boh.imie}) oraz przesłania ideowego dzieła w epoce (${lekItem.epoch}).`,
    epoch: lekItem.epoch,
    lektura: lekItem.lektura,
    isStarRequired: lekItem.isStarRequired,
    points: 2,
    correctAnswerText: `Atrybut/symbol: ${boh.symbol} odzwierciedla dylemat: ${boh.dylemat}. W odniesieniu do postaci ${boh.imie} ukazuje ${boh.postawa}, stanowiąc syntetyczny skrót wymowy ideowej całego utworu.`,
    ckeKeyCriteria: [
      '2 pkt – pełne wyjaśnienie sensu symbolicznego z poprawnym odniesieniem do losów bohatera i wymowy dzieła.',
      '1 pkt – interpretacja wyłącznie dosłowna lub częściowa.',
      '0 pkt – błędna interpretacja symbolu.'
    ],
    explanation: 'Zadanie maturalne CKE sprawdzające umiejętność odczytywania metafor i symboliki w kanonie lektur.',
    tags: [lekItem.lektura, 'symbolika', boh.symbol, lekItem.epoch],
    difficulty: 'srednia'
  });
}

// -------------------------------------------------------------------------
// T9: IKONOGRAFIA: DZIEŁO SZTUKI A LEKTURA (52 zadania = 2 na jednostkę + 8 dla lektur 2024)
// ID: POL_P2_T9_001 do POL_P2_T9_060
// -------------------------------------------------------------------------
const T9_TOTAL = 52 + 2 * LEKTURY_2024.length;
for (let i = 1; i <= T9_TOTAL; i++) {
  const lekItem = unitFor(i, 52);
  const ico = lekItem.iconography;
  const isSecondVariant = i <= 52 ? i > LEKTURY_DATA.length : i > 52 + LEKTURY_2024.length;

  const visualAsset: TaskVisualAsset = {
    imageUrl: ico.imageUrl || '',
    imageCaption: ico.imageCaption || `${ico.artist}, „${ico.title}”`,
    imageAlt: ico.imageAlt || `Dzieło sztuki: „${ico.title}” autorstwa: ${ico.artist}.`,
    fallbackDescription: ico.fallbackDescription || ico.relation,
    sourceDomain: ico.sourceDomain || 'Wikimedia Commons (Domena publiczna)'
  };

  const questionText = isSecondVariant
    ? `Rozstrzygnij, czy dzieło „${ico.title}” (${ico.artist}) może stanowić trafną ilustrację postawy lub dylematu ideowego ukazanego w utworze „${lekItem.lektura}” (${lekItem.epoch}). Uzasadnij swoje stanowisko, odwołując się do dwóch szczegółowych elementów kompozycji wizualnej oraz do kontekstu lektury.`
    : `Zinterpretuj relację między dziełem sztuki „${ico.title}” autorstwa: ${ico.artist} a problematyką utworu „${lekItem.lektura}” (${lekItem.epoch}). Wskaż dwa konkretne elementy kompozycji plastycznej (np. symbolikę, światłocień, plan, atrybuty), które korespondują z przesłaniem lektury.`;

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T9_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T9_ikonografia_dzielo_sztuki',
    title: `Ikonografia maturalna (${i}/${T9_TOTAL}): ${ico.title} (${ico.artist}) a „${lekItem.lektura}”`,
    question: questionText,
    image: visualAsset,
    imageUrl: visualAsset.imageUrl,
    imageCaption: visualAsset.imageCaption,
    imageAlt: visualAsset.imageAlt,
    fallbackDescription: visualAsset.fallbackDescription,
    epoch: lekItem.epoch,
    lektura: lekItem.lektura,
    isStarRequired: lekItem.isStarRequired,
    points: 2,
    correctAnswerText: `${ico.relation} Dzieło sztuki poprzez nastrój, kolorystykę i kompozycję koresponduje z przesłaniem utworu „${lekItem.lektura}”. W odpowiedzi zdający powinien wskazać 2 konkretne elementy plastyczne (np. rekwizyty, układ postaci, światłocień) powiązane z problematyką lektury.`,
    ckeKeyCriteria: [
      '2 pkt – poprawne powiązanie ideowe dzieła plastycznego z lekturą oraz wskazanie i zinterpretowanie 2 konkretnych elementów kompozycji plastycznej.',
      '1 pkt – poprawne powiązanie ogólne lub wskazanie tylko 1 elementu kompozycji.',
      '0 pkt – brak powiązania ideowego lub błędne odczytanie dzieła plastycznego/lektury.'
    ],
    explanation: 'Zadanie sprawdza umiejętność interpretacji materiału ikonicznego oraz konfrontowania kodów wizualnych z kodem literackim zgodnie z wytycznymi informatora maturalnego CKE Formuła 2023.',
    tags: ['ikonografia', ico.artist, lekItem.lektura, lekItem.epoch],
    difficulty: 'zaawansowana'
  });
}

// -------------------------------------------------------------------------
// T10: PRAWDA / FAŁSZ Z WIEDZY O FABULE I PROBLEMATYCE LEKTURY (78 zadań = 3 na jednostkę + 4 dla lektur 2024)
// ID: POL_P2_T10_001 do POL_P2_T10_082
// -------------------------------------------------------------------------
const T10_TOTAL = 78 + LEKTURY_2024.length;
for (let i = 1; i <= T10_TOTAL; i++) {
  const lekItem = unitFor(i, 78);
  const fItem = lekItem.factualStatements[0];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T10_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'true_false',
    granularType: 'T10_prawda_falsz_lektura',
    title: `Prawda/Fałsz z lektury (${i}/${T10_TOTAL}): „${lekItem.lektura}”`,
    question: `Oceń prawdziwość zdań dotyczących fabuły i problematyki utworu „${lekItem.lektura}” (${lekItem.autor}, epoka: ${lekItem.epoch}). Wybierz P (prawda) lub F (fałsz).`,
    epoch: lekItem.epoch,
    lektura: lekItem.lektura,
    isStarRequired: lekItem.isStarRequired,
    trueFalseStatements: [
      {
        statement: fItem.s1,
        isTrue: fItem.t1,
        explanation: 'Ocena merytoryczna na podstawie faktów fabularnych utworu.'
      },
      {
        statement: fItem.s2,
        isTrue: fItem.t2,
        explanation: 'Ocena merytoryczna na podstawie faktów fabularnych utworu.'
      }
    ],
    points: 1,
    explanation: fItem.expl,
    tags: [lekItem.lektura, 'prawda/fałsz', 'wiedza z lektury', lekItem.epoch],
    difficulty: 'podstawowa'
  });
}

// -------------------------------------------------------------------------
// T11: TABELA SYNTETYCZNA / DOPASOWANIE (52 zadania = 2 na jednostkę + 8 dla lektur 2024)
// ID: POL_P2_T11_001 do POL_P2_T11_060
// -------------------------------------------------------------------------
const T11_TOTAL = 52 + 2 * LEKTURY_2024.length;
for (let i = 1; i <= T11_TOTAL; i++) {
  const lekItem = unitFor(i, 52);

  // Dobierz wiarygodny dystraktor z innej lektury tej samej epoki lub innej jednostki kanonicznej
  const otherUnit = LEKTURY_DATA.find((u, uIdx) => uIdx !== (i - 1) % LEKTURY_DATA.length && u.epoch === lekItem.epoch) ||
                    LEKTURY_DATA[(i + 3) % LEKTURY_DATA.length];
  const distractorHero = otherUnit.bohaterowie[i % otherUnit.bohaterowie.length];
  const distractorText = `${distractorHero.postawa} (Atrybut: ${distractorHero.symbol})`;

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T11_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'matching',
    granularType: 'T11_tabela_syntetyczna_dopasowanie',
    title: `Dopasowanie postaci i motywów (${i}/${T11_TOTAL}): „${lekItem.lektura}”`,
    question: `Dopasuj bohaterów utworu „${lekItem.lektura}” (${lekItem.epoch}) do odpowiadających im postaw życiowych oraz atrybutów symbolicznych. Uwaga: W puli znajduje się jeden dodatkowy dystraktor!`,
    epoch: lekItem.epoch,
    lektura: lekItem.lektura,
    isStarRequired: lekItem.isStarRequired,
    matchingPairs: lekItem.bohaterowie.map((b) => ({
      left: b.imie,
      right: `${b.postawa} (Atrybut: ${b.symbol})`
    })),
    distractors: [distractorText],
    hintCke: `Wskazówka Egzaminatora CKE: Zwróć uwagę na topos: „${lekItem.topos}”. Zastanów się, który atrybut symboliczny bezpośrednio łączył się z kluczowym dylematem każdego z bohaterów w tekście.`,
    points: 2,
    explanation: `Wzorcowe zadanie tabelaryczne CKE sprawdzające syntezę wiedzy o postaciach utworu „${lekItem.lektura}”. Zwróć uwagę na dystraktor: „${distractorText}”, który odnosi się do innej lektury/postaci.`,
    tags: [lekItem.lektura, 'dopasowanie', 'tabela', lekItem.epoch],
    difficulty: 'srednia'
  });
}

// -------------------------------------------------------------------------
// T12: ROZPOZNANIE TOPOSU I POJĘCIA EPOKI (44 zadania we wszystkich 11 epokach)
// ID: POL_P2_T12_001 do POL_P2_T12_044
// -------------------------------------------------------------------------
const ALL_EPOCH_TOPOSES: Array<{ name: string; epoch: PolishEpoch; meaning: string; lektura: string }> = [
  { name: 'Prometeizm', epoch: 'Starożytność i Biblia', meaning: 'Bunt jednostki wybitnej przeciw bogom w imię bezinteresownej miłości do cierpiącej ludzkości.', lektura: 'Mitologia grecka' },
  { name: 'Teodycea i cierpienie niezawinione', epoch: 'Starożytność i Biblia', meaning: 'Zagadnienie usprawiedliwienia Bożej sprawiedliwości w obliczu cierpienia sprawiedliwego człowieka.', lektura: 'Biblia (Księga Hioba)' },
  { name: 'Deesis (modlitwa wstawiennicza)', epoch: 'Średniowiecze', meaning: 'Układ orędowniczy: Chrystus jako sędzia pośród Maryi i Jana Chrzciciela wstawiających się za ludźmi.', lektura: 'Bogurodzica' },
  { name: 'Danse macabre (taniec śmierci)', epoch: 'Średniowiecze', meaning: 'Alegoryczny korowód ukazujący równość wszystkich stanów społecznych w obliczu nieuchronnej śmierci.', lektura: 'Rozmowa Mistrza Polikarpa ze Śmiercią' },
  { name: 'Homo viator (człowiek wędrowiec)', epoch: 'Renesans', meaning: 'Metafora ludzkiego losu jako nieustannej pielgrzymki, zdobywania doświadczenia i poznawania świata.', lektura: 'Pieśni Jana Kochanowskiego' },
  { name: 'Stoicka ataraksja i cnota', epoch: 'Renesans', meaning: 'Zachowanie równowagi ducha i niezłomnej cnoty w obliczu przeciwności losu i nieszczęścia.', lektura: 'Treny Jana Kochanowskiego' },
  { name: 'Vanitas (marność nad marnościami)', epoch: 'Barok', meaning: 'Motyw nietrwałości, kruchości życia doczesnego i przemijania ziemskich dóbr.', lektura: 'Poezja Daniela Naborowskiego' },
  { name: 'Konceptyzm i zaskoczenie czytelnika', epoch: 'Barok', meaning: 'Estetyka oparta na niezwykłym skojarzeniu i paradoksie myślowym zadziwiającym odbiorcę.', lektura: 'Sonety Jana Andrzeja Morsztyna' },
  { name: 'Dydaktyzm i oświecony rozum', epoch: 'Oświecenie', meaning: 'Postulat naprawy państwa i obyczajów poprzez satyryczne wyśmiewanie ludzkich wad.', lektura: 'Satyry Ignacego Krasickiego' },
  { name: 'Krytyka sarmatyzmu i pijaństwa', epoch: 'Oświecenie', meaning: 'Demaskowanie zacofania, anarchii i pijaństwa szlachty niszczącej Rzeczpospolitą.', lektura: 'Pijaństwo Ignacego Krasickiego' },
  { name: 'Mesjanizm narodowy', epoch: 'Romantyzm', meaning: 'Koncepcja Polski jako Chrystusa Narodów, której męczeństwo przyniesie wolność innym ludom.', lektura: 'Dziady cz. III' },
  { name: 'Winkelriedyzm', epoch: 'Romantyzm', meaning: 'Idea aktywnego czynu zbrojnego skupiającego na sobie uderzenie wroga w walce o wolność.', lektura: 'Kordian' },
  { name: 'Arkadia szlachecka', epoch: 'Romantyzm', meaning: 'Mityczna kraina ładu, obyczajowości i harmonii człowieka z naturą (Soplicowo).', lektura: 'Pan Tadeusz' },
  { name: 'Praca organiczna i praca u podstaw', epoch: 'Pozytywizm', meaning: 'Wizja społeczeństwa jako jednego organizmu oraz edukacja i wsparcie najuboższych warstw.', lektura: 'Lalka' },
  { name: 'Theatrum mundi (świat jako teatr lalek)', epoch: 'Pozytywizm', meaning: 'Filozoficzna wizja ludzi jako marionetek poruszanych przez niewidzialne siły losu i historii.', lektura: 'Lalka' },
  { name: 'Wina, kara i zmartwychwstanie moralne', epoch: 'Pozytywizm', meaning: 'Proces oczyszczenia sumienia zbrodniarza przez cierpienie, pokutę i miłość bliźniego.', lektura: 'Zbrodnia i kara' },
  { name: 'Chocholi taniec', epoch: 'Młoda Polska', meaning: 'Symbol narodowej niemocy, paraliżu woli, uśpienia ducha walki i zamkniętego kręgu historii.', lektura: 'Wesele' },
  { name: 'Chłopomania i mit braterstwa stanów', epoch: 'Młoda Polska', meaning: 'Powierzchowna fascynacja wsią miejskiej inteligencji pozbawiona realnego porozumienia.', lektura: 'Wesele' },
  { name: 'Mit szklanych domów', epoch: 'Dwudziestolecie międzywojenne', meaning: 'Utopijna wizja sprawiedliwej, czystej i nowoczesnej cywilizacyjnie niepodległej Polski.', lektura: 'Przedwiośnie' },
  { name: 'Forma, gęba i upupienie', epoch: 'Dwudziestolecie międzywojenne', meaning: 'Nacisk społecznych konwenansów odbierający człowiekowi autentyczność i narzucający sztuczną rolę.', lektura: 'Ferdydurke' },
  { name: 'Człowiek złagrowany i zlagrowany', epoch: 'Wojna i okupacja', meaning: 'Dehumanizacja jednostki poddanej skrajnej presji głodu i terroru w łagrach i lagrach.', lektura: 'Inny świat / Opowiadania Borowskiego' },
  { name: 'Parabola zła i laicka przyzwoitość', epoch: 'Współczesność', meaning: 'Uniwersalna walka człowieka z absurdem cierpienia i totalitaryzmu bez oczekiwania nagrody.', lektura: 'Dżuma' }
];

for (let i = 1; i <= 44; i++) {
  const top = ALL_EPOCH_TOPOSES[(i - 1) % ALL_EPOCH_TOPOSES.length];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T12_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T12_topos_pojecie_epoki',
    title: `Topos epoki (${i}/44): ${top.name} (${top.epoch})`,
    question: `Wyjaśnij znaczenie toposu kulturowego: „${top.name}”. Podaj epokę literacką (${top.epoch}), w której odegrał on kluczową rolę, oraz przywołaj utwór literacki („${top.lektura}”) realizujący ten motyw.`,
    epoch: top.epoch,
    lektura: top.lektura,
    points: 2,
    correctAnswerText: `Znaczenie toposu: ${top.meaning} Epoka: ${top.epoch}. Przykład utworu: „${top.lektura}”, w którym topos ten organizuje wymowę ideową dzieła.`,
    ckeKeyCriteria: [
      '2 pkt – precyzyjne wyjaśnienie sensu toposu, poprawne wskazanie epoki oraz odwołanie do adekwatnego utworu.',
      '1 pkt – brak przykładu utworu lub niepełne wyjaśnienie.',
      '0 pkt – odpowiedź błędna.'
    ],
    explanation: 'Toposy to stałe motywy kultury europejskiej sprawdzane w każdym arkuszu Formuły 2023.',
    tags: ['topos', top.name, top.epoch, top.lektura],
    difficulty: 'srednia'
  });
}

// -------------------------------------------------------------------------
// T13: CECHY PRĄDU / EPOKI W UTWORZE (44 zadania we wszystkich epokach)
// ID: POL_P2_T13_001 do POL_P2_T13_044
// -------------------------------------------------------------------------
const ALL_EPOCH_MOVEMENTS: Array<{ epoch: PolishEpoch; prąd: string; lektura: string; cecha: string }> = [
  { epoch: 'Starożytność i Biblia', prąd: 'Mimesis i katharsis', lektura: 'Antygona', cecha: 'Naśladowanie rzeczywistości oraz wzbudzenie w widzu litości i trwogi prowadzące do oczyszczenia.' },
  { epoch: 'Starożytność i Biblia', prąd: 'Przypowieść (parabola) biblijna', lektura: 'Biblia', cecha: 'Podporządkowanie fabuły nadrzędnemu sensowi moralnemu i uniwersalnemu przesłaniu.' },
  { epoch: 'Średniowiecze', prąd: 'Teocentryzm i asceza', lektura: 'Rozmowa ze Śmiercią i Legenda o św. Aleksym', cecha: 'Podporządkowanie wszystkich sfer życia Bogu i dobrowolne odrzucenie dóbr doczesnych.' },
  { epoch: 'Średniowiecze', prąd: 'Anonimowość i parenetyka', lektura: 'Bogurodzica i Lament świętokrzyski', cecha: 'Twórczość na chwałę Bożą bez podpisu autora oraz kreowanie wzorców świętego i rycerza.' },
  { epoch: 'Renesans', prąd: 'Humanizm antropocentryczny', lektura: 'Jan Kochanowski (Pieśni, Treny, Odprawa)', cecha: 'Stawianie człowieka w centrum zainteresowania („Człowiekiem jestem i nic co ludzkie...”).' },
  { epoch: 'Renesans', prąd: 'Tragizm szekspirowski', lektura: 'Makbet', cecha: 'Złamanie zasady trzech jedności, rezygnacja z fatum na rzecz psychologicznych wyborów bohatera.' },
  { epoch: 'Barok', prąd: 'Marinizm i konceptyzm', lektura: 'Poezja barokowa (Morsztyn, Naborowski)', cecha: 'Wirtuozeria formy, zaskakujące porównania i operowanie paradoksem.' },
  { epoch: 'Barok', prąd: 'Sarmatyzm i mistycyzm', lektura: 'Poezja barokowa (Morsztyn, Naborowski)', cecha: 'Przekonanie o szczególnej misji Polski jako przedmurza chrześcijaństwa i niepokój eschatologiczny.' },
  { epoch: 'Oświecenie', prąd: 'Klasycyzm i racjonalizm', lektura: 'Ignacy Krasicki (Bajki i Satyry)', cecha: 'Kult rozumu, jasność stylu, symetria kompozycyjna i funkcja dydaktyczno-moralizatorska.' },
  { epoch: 'Oświecenie', prąd: 'Krytycyzm społeczny', lektura: 'Ignacy Krasicki (Bajki i Satyry)', cecha: 'Demaskowanie zacofania ustrojowego i wad narodowych w celu ratowania niepodległości.' },
  { epoch: 'Romantyzm', prąd: 'Mesjanizm i mistycyzm', lektura: 'Dziady cz. III', cecha: 'Wiara w boską ingerencję w historię i zbawczą misję narodu polskiego cierpiącego za miliony.' },
  { epoch: 'Romantyzm', prąd: 'Indywidualizm i bunt prometejski', lektura: 'Dziady cz. III', cecha: 'Wybitna jednostka stawiająca się ponad tłumem i gotowa rzucić wyzwanie samemu Bogu.' },
  { epoch: 'Romantyzm', prąd: 'Historiozofia i winkelriedyzm', lektura: 'Kordian', cecha: 'Poszukiwanie sensu w dziejach narodu i wezwanie do aktywnego czynu zbrojnego.' },
  { epoch: 'Pozytywizm', prąd: 'Realizm krytyczny', lektura: 'Lalka', cecha: 'Panoramiczny, wierny obraz społeczeństwa z uwzględnieniem praw ekonomii i determinizmu.' },
  { epoch: 'Pozytywizm', prąd: 'Scjentyzm i praca organiczna', lektura: 'Lalka', cecha: 'Wiara w naukę empiryczną i konieczność harmonijnego rozwoju wszystkich warstw społecznych.' },
  { epoch: 'Pozytywizm', prąd: 'Polifoniczność powieściowa', lektura: 'Zbrodnia i kara', cecha: 'Równorzędne zderzenie różnych głosów ideowych i racji moralnych bez narzucania tezy przez narratora.' },
  { epoch: 'Młoda Polska', prąd: 'Symbolizm i synteza sztuk', lektura: 'Wesele', cecha: 'Wieloznaczne symbole narodowe oraz połączenie słowa poetyckiego z muzyką i malarskością.' },
  { epoch: 'Młoda Polska', prąd: 'Dekadentyzm i psychologizm', lektura: 'Wesele', cecha: 'Poczucie kryzysu cywilizacji, niemoc czynu oraz uzewnętrznienie lęków podświadomości.' },
  { epoch: 'Dwudziestolecie międzywojenne', prąd: 'Rozrachunek polityczny', lektura: 'Przedwiośnie', cecha: 'Krytyczna diagnoza problemów pierwszych lat odrodzonej II Rzeczypospolitej.' },
  { epoch: 'Dwudziestolecie międzywojenne', prąd: 'Groteska i awangarda formy', lektura: 'Ferdydurke', cecha: 'Odrzucenie tradycyjnego realizmu na rzecz satyrycznego demaskowania Formy i Gęby.' },
  { epoch: 'Wojna i okupacja', prąd: 'Behawioryzm i literatura faktu', lektura: 'Inny świat i Opowiadania Borowskiego', cecha: 'Chłodny opis zachowań człowieka w sytuacji granicznej bez zbędnego patosu i moralizatorstwa.' },
  { epoch: 'Współczesność', prąd: 'Egzystencjalizm i groteska', lektura: 'Dżuma i Rok 1984', cecha: 'Człowiek wobec absurdu istnienia stawiający opór złu oraz demontaż wartości przez chamstwo.' }
];

for (let i = 1; i <= 44; i++) {
  const em = ALL_EPOCH_MOVEMENTS[(i - 1) % ALL_EPOCH_MOVEMENTS.length];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T13_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T13_cechy_pradu_epoki',
    title: `Prąd literacki (${i}/44): ${em.prąd} (${em.epoch})`,
    question: `Na przykładzie utworu „${em.lektura}” wykaż 2 cechy prądu/nurtu: ${em.prąd}, charakterystycznego dla epoki (${em.epoch}).`,
    epoch: em.epoch,
    lektura: em.lektura,
    isStarRequired: true,
    points: 2,
    correctAnswerText: `Cecha 1: ${em.cecha}. Cecha 2: Realizacja założeń estetycznych nurtu poprzez konstrukcję bohaterów i dobór środków wyrazu w utworze „${em.lektura}”.`,
    ckeKeyCriteria: [
      '2 pkt – podanie dwóch konkretnych cech prądu z bezpośrednim odwołaniem do treści utworu.',
      '1 pkt – podanie tylko 1 cechy.',
      '0 pkt – odpowiedź czysto teoretyczna bez powiązania z tekstem.'
    ],
    explanation: 'Zadanie bada umiejętność łączenia teorii literatury z praktyczną analizą dzieła.',
    tags: [em.epoch, em.prąd, em.lektura],
    difficulty: 'zaawansowana'
  });
}

// -------------------------------------------------------------------------
// T14: ZESTAWIENIE KOMPARATYSTYCZNE 2 UTWORÓW (40 zadań)
// ID: POL_P2_T14_001 do POL_P2_T14_040
// -------------------------------------------------------------------------
const COMP_PAIRS_CKE: Array<{ t1: string; a1: string; ep1: PolishEpoch; t2: string; a2: string; ep2: PolishEpoch; motif: string }> = [
  { t1: 'Dziady cz. III', a1: 'Adam Mickiewicz', ep1: 'Romantyzm', t2: 'Kordian', a2: 'Juliusz Słowacki', ep2: 'Romantyzm', motif: 'Wizja drogi do wyzwolenia narodu (mesjanizm vs winkelriedyzm)' },
  { t1: 'Lalka', a1: 'Bolesław Prus', ep1: 'Pozytywizm', t2: 'Zbrodnia i kara', a2: 'Fiodor Dostojewski', ep2: 'Pozytywizm', motif: 'Dramat samotności jednostki wybitnej w bezdusznym wielkim mieście' },
  { t1: 'Wesele', a1: 'Stanisław Wyspiański', ep1: 'Młoda Polska', t2: 'Tango', a2: 'Sławomir Mrożek', ep2: 'Współczesność', motif: 'Kryzys inteligencji i triumf prymitywnej siły nad kulturą' },
  { t1: 'Zdążyć przed Panem Bogiem', a1: 'Hanna Krall', ep1: 'Wojna i okupacja', t2: 'Inny świat', a2: 'Gustaw Herling-Grudziński', ep2: 'Wojna i okupacja', motif: 'Ocalenie godności ludzkiej w obliczu machiny totalitaryzmu i zagłady' },
  { t1: 'Antygona', a1: 'Sofokles', ep1: 'Starożytność i Biblia', t2: 'Makbet', a2: 'William Szekspir', ep2: 'Renesans', motif: 'Konflikt sumienia jednostki z prawem i żądzą władzy' },
  { t1: 'Bogurodzica', a1: 'Anonim', ep1: 'Średniowiecze', t2: 'Lament świętokrzyski', a2: 'Anonim', ep2: 'Średniowiecze', motif: 'Oblicza Matki Bożej: Królowa-orędowniczka (Deesis) a cierpiąca matka (Stabat Mater)' },
  { t1: 'Treny', a1: 'Jan Kochanowski', ep1: 'Renesans', t2: 'Księga Hioba', a2: 'Biblia', ep2: 'Starożytność i Biblia', motif: 'Bunt człowieka prawego i cierpiącego przeciw wyrokom losu i załamanie filozofii' },
  { t1: 'Przedwiośnie', a1: 'Stefan Żeromski', ep1: 'Dwudziestolecie międzywojenne', t2: 'Lalka', a2: 'Bolesław Prus', ep2: 'Pozytywizm', motif: 'Bolesne rozczarowanie stanem polskiego społeczeństwa i zderzenie marzeń z realiami' }
];

for (let i = 1; i <= 40; i++) {
  const cp = COMP_PAIRS_CKE[(i - 1) % COMP_PAIRS_CKE.length];

  PART2_TEST_HISTORYCZNY_TASKS.push({
    id: `POL_P2_T14_${String(i).padStart(3, '0')}`,
    part: 2,
    partName: 'Test historycznoliteracki',
    taskType: 'short_open',
    granularType: 'T14_zestawienie_komparatystyczne',
    title: `Komparatystyka (${i}/40): ${cp.t1} a ${cp.t2}`,
    question: `Porównaj realizację motywu: „${cp.motif}” w utworach „${cp.t1}” (${cp.a1}, ${cp.ep1}) oraz „${cp.t2}” (${cp.a2}, ${cp.ep2}). Wskaż 1 zasadnicze podobieństwo i 1 kluczową różnicę w postawach bohaterów lub wymowie ideowej dzieł.`,
    epoch: cp.ep1,
    lektura: cp.t1,
    points: 2,
    correctAnswerText: `Podobieństwo: W obu utworach bohaterowie stają w obliczu dramatu moralnego/narodowego i podejmują próbę oporu. Różnica: W utworze „${cp.t1}” przeważa ujęcie metafizyczne/pokorne, podczas gdy w utworze „${cp.t2}” dominuje bunt tragiczny, scjentystyczny lub groteskowy.`,
    ckeKeyCriteria: [
      '2 pkt – precyzyjne wskazanie podobieństwa oraz różnicy z trafnym odwołaniem do obu dzieł.',
      '1 pkt – wskazanie tylko podobieństwa lub tylko różnicy.',
      '0 pkt – brak rzetelnej analizy porównawczej.'
    ],
    explanation: 'Komparatystyka to jedno z najwyżej cenionych zadań analitycznych w Części II arkusza maturalnego.',
    tags: ['komparatystyka', cp.t1, cp.t2, cp.motif, cp.ep1, cp.ep2],
    difficulty: 'zaawansowana'
  });
}

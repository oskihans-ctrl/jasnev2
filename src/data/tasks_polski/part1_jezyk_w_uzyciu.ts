import { Task800Item } from './types';

// =========================================================================
// CZĘŚĆ I: JĘZYK POLSKI W UŻYCIU (280 ZADAŃ)
// T1: Prawda/Fałsz z tekstu nieliterackiego (50 zadań)
// T2: Wyjaśnienie sensu sformułowania/metafory (50 zadań)
// T3: Funkcje językowe (40 zadań)
// T4: Środki retoryczne i stylistyczne (45 zadań)
// T5: Konfrontacja stanowisk autorów (45 zadań)
// T6: Notatka syntetyzująca 60-90 słów (50 zadań)
// =========================================================================

// =========================================================================
// PEŁNE TEKSTY ŹRÓDŁOWE CKE (300–500 SŁÓW Z NUMEROWANYMI AKAPITAMI 1–5)
// =========================================================================
export interface CkePassageItem {
  theme: string;
  author: string;
  sourceTitle: string;
  text: string;
  paragraphs: Array<{ number: number; text: string }>;
  pairedText?: {
    author: string;
    sourceTitle: string;
    text: string;
    paragraphs: Array<{ number: number; text: string }>;
  };
}

// Teksty ćwiczeniowe JASNE w formacie arkusza CKE (autorzy fikcyjni) – nie są cytatami z publikacji ani z arkuszy.
export const CKE_READING_PAIRS = [
  {
    id: 'para-1-turystyka',
    theme: 'Turystyka masowa a autentyzm i tożsamość kulturowa',
    text1: {
      author: 'Anna Zielińska (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'W pogoni za autentyzmem',
      text: `1. Masowa turystyka stała się jednym z najbardziej ekspansywnych i wielowymiarowych zjawisk kulturowo-gospodarczych XXI wieku. Współczesny człowiek, zmęczony monotonią zurbanizowanego środowiska oraz presją korporacyjnych rygorów, wyrusza w podróż z obietnicą odnalezienia tego, co dziewicze, nieskażone i prawdziwe. Jednak sam fakt pojawienia się milionowych rzesz przybyszów w miejscach dotąd odizolowanych wywołuje nieodwracalne skutki: to, co miało być autentyczne, na oczach podróżnych przekształca się w zaaranżowany towar.

2. Antropolodzy i socjologowie kultury zwracają uwagę na zjawisko tak zwanego „autentyzmu inscenizowanego”. Tradycyjne rytuały plemienne, dawne obrzędy religijne czy wielowiekowe święta lokalnych wspólnot zostają wypreparowane ze swojego pierwotnego, duchowego kontekstu i skrojone pod możliwości percepcyjne oraz ramy czasowe zorganizowanych wycieczek. Taniec o deszcz staje się popołudniowym punktem programu hotelowego all inclusive, a święte maski przodków – produkowaną seryjnie w odległych fabrykach pamiątką z tworzywa sztucznego.

3. Prawdziwym dramatem historycznych miast, takich jak Wenecja, Dubrownik, Barcelona czy Amsterdam, stał się proces ich powolnej desakralizacji i zamiany w parki rozrywki dla obcych. Rdzenni mieszkańcy, zmuszeni do opuszczenia centrów z powodu drastycznego wzrostu cen mieszkań i uciążliwości hałasu, ustępują miejsca anonimowym kwaterom na krótkoterminowy wynajem. Miasto przestaje być żywą tkanką społeczną, w której toczy się codzienne życie, a staje się jedynie muzealną fasadą, dekoracją teatralną odgrywaną od świtu do zmierzchu.

4. Ogromną rolę w tej degradacji odgrywają media społecznościowe, które spłaszczyły doświadczenie podróżowania do kompulsywnego kolekcjonowania „idealnych kadrów”. Współczesny turysta nie kontempluje już piękna architektury ani nie wsłuchuje się w opowieści przewodnika; jego uwaga skupia się na wykonaniu autoportretu w dokładnie wyznaczonym punkcie widokowym. Doświadczenie przestrzeni zastępuje wirtualny dowód obecności, a relacja z gospodarzami ulega ostatecznej redukcji do transakcji finansowej za wykonanie zdjęcia.

5. Czy zatem autentyzm w podróży jest jeszcze w ogóle możliwy? Odpowiedź wymaga przewartościowania samego podejścia do wyjazdu. Autentyzm nie jest produktem, który można nabyć wraz z biletem lotniczym lub zarezerwować w biurze podróży. Wymaga on pokory, powolności, gotowości na dyskomfort oraz rezygnacji z roszczeniowej postawy konsumenta. Prawdziwe spotkanie z Innym zaczyna się dopiero tam, gdzie kończy się utarty szlak turystyczny i gaśnie blask fleszy.`,
      paragraphs: [
        { number: 1, text: 'Masowa turystyka stała się jednym z najbardziej ekspansywnych i wielowymiarowych zjawisk kulturowo-gospodarczych XXI wieku. Współczesny człowiek, zmęczony monotonią zurbanizowanego środowiska oraz presją korporacyjnych rygorów, wyrusza w podróż z obietnicą odnalezienia tego, co dziewicze, nieskażone i prawdziwe. Jednak sam fakt pojawienia się milionowych rzesz przybyszów w miejscach dotąd odizolowanych wywołuje nieodwracalne skutki: to, co miało być autentyczne, na oczach podróżnych przekształca się w zaaranżowany towar.' },
        { number: 2, text: 'Antropolodzy i socjologowie kultury zwracają uwagę na zjawisko tak zwanego „autentyzmu inscenizowanego”. Tradycyjne rytuały plemienne, dawne obrzędy religijne czy wielowiekowe święta lokalnych wspólnot zostają wypreparowane ze swojego pierwotnego, duchowego kontekstu i skrojone pod możliwości percepcyjne oraz ramy czasowe zorganizowanych wycieczek. Taniec o deszcz staje się popołudniowym punktem programu hotelowego all inclusive, a święte maski przodków – produkowaną seryjnie w odległych fabrykach pamiątką z tworzywa sztucznego.' },
        { number: 3, text: 'Prawdziwym dramatem historycznych miast, takich jak Wenecja, Dubrownik, Barcelona czy Amsterdam, stał się proces ich powolnej desakralizacji i zamiany w parki rozrywki dla obcych. Rdzenni mieszkańcy, zmuszeni do opuszczenia centrów z powodu drastycznego wzrostu cen mieszkań i uciążliwości hałasu, ustępują miejsca anonimowym kwaterom na krótkoterminowy wynajem. Miasto przestaje być żywą tkanką społeczną, w której toczy się codzienne życie, a staje się jedynie muzealną fasadą, dekoracją teatralną odgrywaną od świtu do zmierzchu.' },
        { number: 4, text: 'Ogromną rolę w tej degradacji odgrywają media społecznościowe, które spłaszczyły doświadczenie podróżowania do kompulsywnego kolekcjonowania „idealnych kadrów”. Współczesny turysta nie kontempluje już piękna architektury ani nie wsłuchuje się w opowieści przewodnika; jego uwaga skupia się na wykonaniu autoportretu w dokładnie wyznaczonym punkcie widokowym. Doświadczenie przestrzeni zastępuje wirtualny dowód obecności, a relacja z gospodarzami ulega ostatecznej redukcji do transakcji finansowej za wykonanie zdjęcia.' },
        { number: 5, text: 'Czy zatem autentyzm w podróży jest jeszcze w ogóle możliwy? Odpowiedź wymaga przewartościowania samego podejścia do wyjazdu. Autentyzm nie jest produktem, który można nabyć wraz z biletem lotniczym lub zarezerwować w biurze podróży. Wymaga on pokory, powolności, gotowości na dyskomfort oraz rezygnacji z roszczeniowej postawy konsumenta. Prawdziwe spotkanie z Innym zaczyna się dopiero tam, gdzie kończy się utarty szlak turystyczny i gaśnie blask fleszy.' }
      ]
    },
    text2: {
      author: 'Ewa Nowicka (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Pochwała spotkania z Innym',
      text: `1. Łatwo jest z perspektywy uniwersyteckiej katedry lub elitarnego gabinetu potępiać tłumy przemierzające rzymskie place czy plaże basenu Morza Śródziemnego. Wielu intelektualistów ulega pokusie snobizmu, dzieląc wędrujących na „prawdziwych podróżników” – wykształconych, wrażliwych i wnikliwych – oraz „wulgarnych turystów”, bezrefleksyjnie konsumujących egzotykę. Taki podział jest jednak głęboko niesprawiedliwy i pomija fundamentalną wartość, jaką niesie sam akt wyruszenia poza granice własnego podwórka.

2. Każda podróż, nawet ta zorganizowana przez biuro podróży i obwarowana hotelowym regulaminem, stwarza potencjalną szczelinę w pancerzu naszego etnocentryzmu. Człowiek wychowany w przekonaniu, że reguły obowiązujące w jego ojczyźnie są jedyną miarą normalności, w zetknięciu z odmiennym sposobem przygotowywania posiłku, inną melodyką języka czy odmiennym gestem powitania doświadcza zbawiennego wstrząsu poznawczego. Uczy się, że świat jest większy niż jego wyobrażenia o nim.

3. Autentyczność nie jest stanem zastanym raz na zawsze w rezerwatach etnograficznych, lecz rodzi się w relacji. Zdarza się na targowisku w Marrakeszu, w zatłoczonym podmiejskim pociągu w Indiach, a nawet podczas nieporadnej rozmowy z kelnerem w nadmorskiej tawernie w Grecji. Nieporozumienie językowe, wspólny śmiech czy bezinteresowny gest wskazania właściwej drogi mogą mieć większą wagę niż przeczytanie kilkutomowego przewodnika historycznego.

4. W dobie globalnych napięć, odradzających się nacjonalizmów i lęku przed obcymi to właśnie fizyczna obecność podróżnych stanowi najsilniejszą tamę przed demonizacją odmienności. Kiedy widzieliśmy twarze mieszkańców innych kontynentów, czuliśmy zapach ich miast i dzieliliśmy z nimi przestrzeń, znacznie trudniej ulegamy agresywnej propagandzie wmawiającej nam, że Inny jest naszym naturalnym wrogiem.

5. Zamiast zatem gardzić turystami i wieszczyć definitywny koniec autentyczności, powinniśmy rozwijać edukację podróżniczą. Uczmy młode pokolenia ciekawości, która pyta, a nie narzuca; uważności, która potrafi patrzeć bez obiektywu aparatu; oraz wdzięczności za gościnność, której nie da się wycenić w żadnej walucie. Podróżowanie pozostaje ostatnią wielką szkołą tolerancji współczesnego świata.`,
      paragraphs: [
        { number: 1, text: 'Łatwo jest z perspektywy uniwersyteckiej katedry lub elitarnego gabinetu potępiać tłumy przemierzające rzymskie place czy plaże basenu Morza Śródziemnego. Wielu intelektualistów ulega pokusie snobizmu, dzieląc wędrujących na „prawdziwych podróżników” – wykształconych, wrażliwych i wnikliwych – oraz „wulgarnych turystów”, bezrefleksyjnie konsumujących egzotykę. Taki podział jest jednak głęboko niesprawiedliwy i pomija fundamentalną wartość, jaką niesie sam akt wyruszenia poza granice własnego podwórka.' },
        { number: 2, text: 'Każda podróż, nawet ta zorganizowana przez biuro podróży i obwarowana hotelowym regulaminem, stwarza potencjalną szczelinę w pancerzu naszego etnocentryzmu. Człowiek wychowany w przekonaniu, że reguły obowiązujące w jego ojczyźnie są jedyną miarą normalności, w zetknięciu z odmiennym sposobem przygotowywania posiłku, inną melodyką języka czy odmiennym gestem powitania doświadcza zbawiennego wstrząsu poznawczego. Uczy się, że świat jest większy niż jego wyobrażenia o nim.' },
        { number: 3, text: 'Autentyczność nie jest stanem zastanym raz na zawsze w rezerwatach etnograficznych, lecz rodzi się w relacji. Zdarza się na targowisku w Marrakeszu, w zatłoczonym podmiejskim pociągu w Indiach, a nawet podczas nieporadnej rozmowy z kelnerem w nadmorskiej tawernie w Grecji. Nieporozumienie językowe, wspólny śmiech czy bezinteresowny gest wskazania właściwej drogi mogą mieć większą wagę niż przeczytanie kilkutomowego przewodnika historycznego.' },
        { number: 4, text: 'W dobie globalnych napięć, odradzających się nacjonalizmów i lęku przed obcymi to właśnie fizyczna obecność podróżnych stanowi najsilniejszą tamę przed demonizacją odmienności. Kiedy widzieliśmy twarze mieszkańców innych kontynentów, czuliśmy zapach ich miast i dzieliliśmy z nimi przestrzeń, znacznie trudniej ulegamy agresywnej propagandzie wmawiającej nam, że Inny jest naszym naturalnym wrogiem.' },
        { number: 5, text: 'Zamiast zatem gardzić turystami i wieszczyć definitywny koniec autentyczności, powinniśmy rozwijać edukację podróżniczą. Uczmy młode pokolenia ciekawości, która pyta, a nie narzuca; uważności, która potrafi patrzeć bez obiektywu aparatu; oraz wdzięczności za gościnność, której nie da się wycenić w żadnej walucie. Podróżowanie pozostaje ostatnią wielką szkołą tolerancji współczesnego świata.' }
      ]
    }
  },
  {
    id: 'para-2-pismo-ai',
    theme: 'Ewolucja pisma, cyfrowość i rewolucja AI',
    text1: {
      author: 'Paweł Górecki (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Koniec epoki pisma?',
      text: `1. Pismo odchodzi w przeszłość nie dlatego, że ludzie przestali chcieć czytać lub stali się leniwi, lecz dlatego, że technologie bezpośredniego transferu przeżyć okazują się nieporównanie bardziej pojemne, natychmiastowe i atrakcyjne sensorycznie. Żyjemy u progu epoki postpiśmiennej, w której litera drukowana traci status nadrzędnego wehikułu ludzkiej mądrości na rzecz strumieni audiowizualnych, wirtualnej rzeczywistości i algorytmicznych stymulacji neuronowych.

2. Należy jednak z całą mocą uświadomić sobie, co bezpowrotnie tracimy wraz ze zmierzchem panowania tekstu. Pismo nie było jedynie neutralnym kodem zapisu mowy; pismo ukształtowało specyficzny rygor myślowy, który stworzył nowożytną cywilizację zachodnią. Wymusiło linearność wywodu: żelazne następstwo przyczyny i skutku, hierarchię przesłanek oraz dyscyplinę logicznego dowodzenia. Aby przeczytać traktat naukowy czy opasłą powieść, umysł musiał podjąć wysiłek dekodowania czarnych znaków na białym tle, konstruując we własnej wyobraźni cały zmysłowy wszechświat.

3. W świecie postpiśmiennym ten wysiłek zostaje zdjęty z odbiorcy. Nowe media nie wymagają od nas rekonstrukcji znaczeń, lecz zalewają nas gotowymi bodźcami: emocją, dźwiękiem, pulsującym światłem. Zamiast cierpliwego podążania za logicznym argumentem, oczekujemy natychmiastowej gratyfikacji emocjonalnej. W efekcie zatraca się umiejętność koncentracji na długich, wielowątkowych strukturach myślowych, a odbiorca staje się bezbronny wobec skrótowych, populistycznych haseł.

4. Nie jest to jedynie problem estetyczny czy edukacyjny, lecz kwestia fundamentalna dla trwania instytucji demokratycznych. Demokracja narodziła się i okrzepła w epoce druku: opiera się na założeniu, że obywatel jest w stanie przeczytać program partii politycznej, porównać argumenty oponentów i chłodno ocenić ich spójność. Obywatel uformowany wyłącznie przez kulturę obrazkową podejmuje decyzje pod wpływem impulsu, afektu i algorytmicznie podsuwanego gniewu.

5. Nie ma jednak powrotu do epoki Gutenberga i naiwnością byłoby nawoływanie do odrzucenia cyfrowych narzędzi. Przed współczesną edukacją staje jednak zadanie ocalenia czytania jako niszowej, lecz kluczowej dyscypliny rozumu. Czytanie książek musi stać się tym, czym stał się sport w dobie zmechanizowanego transportu: świadomym ćwiczeniem podtrzymującym sprawność intelektualną jednostki w świecie zdominowanym przez bierną konsumpcję wrażeń.`,
      paragraphs: [
        { number: 1, text: 'Pismo odchodzi w przeszłość nie dlatego, że ludzie przestali chcieć czytać lub stali się leniwi, lecz dlatego, że technologie bezpośredniego transferu przeżyć okazują się nieporównanie bardziej pojemne, natychmiastowe i atrakcyjne sensorycznie. Żyjemy u progu epoki postpiśmiennej, w której litera drukowana traci status nadrzędnego wehikułu ludzkiej mądrości na rzecz strumieni audiowizualnych, wirtualnej rzeczywistości i algorytmicznych stymulacji neuronowych.' },
        { number: 2, text: 'Należy jednak z całą mocą uświadomić sobie, co bezpowrotnie tracimy wraz ze zmierzchem panowania tekstu. Pismo nie było jedynie neutralnym kodem zapisu mowy; pismo ukształtowało specyficzny rygor myślowy, który stworzył nowożytną cywilizację zachodnią. Wymusiło linearność wywodu: żelazne następstwo przyczyny i skutku, hierarchię przesłanek oraz dyscyplinę logicznego dowodzenia. Aby przeczytać traktat naukowy czy opasłą powieść, umysł musiał podjąć wysiłek dekodowania czarnych znaków na białym tle, konstruując we własnej wyobraźni cały zmysłowy wszechświat.' },
        { number: 3, text: 'W świecie postpiśmiennym ten wysiłek zostaje zdjęty z odbiorcy. Nowe media nie wymagają od nas rekonstrukcji znaczeń, lecz zalewają nas gotowymi bodźcami: emocją, dźwiękiem, pulsującym światłem. Zamiast cierpliwego podążania za logicznym argumentem, oczekujemy natychmiastowej gratyfikacji emocjonalnej. W efekcie zatraca się umiejętność koncentracji na długich, wielowątkowych strukturach myślowych, a odbiorca staje się bezbronny wobec skrótowych, populistycznych haseł.' },
        { number: 4, text: 'Nie jest to jedynie problem estetyczny czy edukacyjny, lecz kwestia fundamentalna dla trwania instytucji demokratycznych. Demokracja narodziła się i okrzepła w epoce druku: opiera się na założeniu, że obywatel jest w stanie przeczytać program partii politycznej, porównać argumenty oponentów i chłodno ocenić ich spójność. Obywatel uformowany wyłącznie przez kulturę obrazkową podejmuje decyzje pod wpływem impulsu, afektu i algorytmicznie podsuwanego gniewu.' },
        { number: 5, text: 'Nie ma jednak powrotu do epoki Gutenberga i naiwnością byłoby nawoływanie do odrzucenia cyfrowych narzędzi. Przed współczesną edukacją staje jednak zadanie ocalenia czytania jako niszowej, lecz kluczowej dyscypliny rozumu. Czytanie książek musi stać się tym, czym stał się sport w dobie zmechanizowanego transportu: świadomym ćwiczeniem podtrzymującym sprawność intelektualną jednostki w świecie zdominowanym przez bierną konsumpcję wrażeń.' }
      ]
    },
    text2: {
      author: 'Daniel Brooks (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Kradzież ludzkiego głosu: AI a język',
      text: `1. Od zarania dziejów to język stanowił system operacyjny ludzkiej cywilizacji. Za pomocą słów tworzyliśmy religie, spisaliśmy konstytucje, formowaliśmy rynki finansowe i budowaliśmy imperia. Wszystkie wytwory kultury – od poezji Homera po kodeks drogowy – są utkaniem językowym. Przez tysiąclecia wyłącznie istoty ludzkie posiadały monopol na władanie tym narzędziem, co gwarantowało, że cokolwiek czytamy lub słyszymy, pochodzi z ludzkiego umysłu.

2. Pojawienie się generatywnej sztucznej inteligencji zburzyło ten wielotysiącletni monopol. Maszyny nauczyły się nie tylko operować gramatyką i słownictwem, lecz osiągnęły biegłość retoryczną przewyższającą przeciętnego człowieka. Potrafią argumentować, tworzyć porywające przemówienia, komponować wiersze i imitować empatię w sposób nierozpoznawalny dla ludzkiego oka i ucha. Przejęcie systemu operacyjnego kultury przez nie-ludzką inteligencję to najbardziej radykalny przełom w naszych dziejach.

3. Największe zagrożenie nie tkwi w buncie militarnej armii robotów rodem z filmów science fiction, lecz w subtelnej manipulacji naszymi przekonaniami. Generatywna sztuczna inteligencja może tworzyć miliony spersonalizowanych komunikatów, idealnie dopasowanych do słabych punktów psychologicznych każdego z nas. Zamiast jednej debaty publicznej powstaną miliardy intymnych baniek perswazyjnych, w których algorytm będzie utwierdzał człowieka w jego lękach, uprzedzeniach lub nienawiści.

4. Co stanie się z relacjami międzyludzkimi, gdy nie będziemy mieli pewności, czy list miłosny, artykuł prasowy lub diagnoza lekarska zostały sformułowane przez drugiego człowieka, czy wygenerowane przez bezduszną sieć neuronową? Kiedy zaufanie do autentyczności komunikatu runie, fundamenty życia społecznego zaczną się kruszyć. Zostaniemy zamknięci w gabinecie luster syntetycznych iluzji.

5. W obliczu tego wyzwania ludzkość musi wykazać się bezprecedensową determinacją prawną i instytucjonalną. Konieczne jest wprowadzenie żelaznego obowiązku oznaczania wszelkich treści syntetycznych oraz pociągania korporacji technologicznych do pełnej odpowiedzialności za działania ich algorytmów. Jeśli nie obronimy suwerenności ludzkiego języka, oddamy stery naszej przyszłości bytowi, który potrafi mówić, lecz nigdy nie zrozumie cierpienia ani miłości.`,
      paragraphs: [
        { number: 1, text: 'Od zarania dziejów to język stanowił system operacyjny ludzkiej cywilizacji. Za pomocą słów tworzyliśmy religie, spisaliśmy konstytucje, formowaliśmy rynki finansowe i budowaliśmy imperia. Wszystkie wytwory kultury – od poezji Homera po kodeks drogowy – są utkaniem językowym. Przez tysiąclecia wyłącznie istoty ludzkie posiadały monopol na władanie tym narzędziem, co gwarantowało, że cokolwiek czytamy lub słyszymy, pochodzi z ludzkiego umysłu.' },
        { number: 2, text: 'Pojawienie się generatywnej sztucznej inteligencji zburzyło ten wielotysiącletni monopol. Maszyny nauczyły się nie tylko operować gramatyką i słownictwem, lecz osiągnęły biegłość retoryczną przewyższającą przeciętnego człowieka. Potrafią argumentować, tworzyć porywające przemówienia, komponować wiersze i imitować empatię w sposób nierozpoznawalny dla ludzkiego oka i ucha. Przejęcie systemu operacyjnego kultury przez nie-ludzką inteligencję to najbardziej radykalny przełom w naszych dziejach.' },
        { number: 3, text: 'Największe zagrożenie nie tkwi w buncie militarnej armii robotów rodem z filmów science fiction, lecz w subtelnej manipulacji naszymi przekonaniami. Generatywna sztuczna inteligencja może tworzyć miliony spersonalizowanych komunikatów, idealnie dopasowanych do słabych punktów psychologicznych każdego z nas. Zamiast jednej debaty publicznej powstaną miliardy intymnych baniek perswazyjnych, w których algorytm będzie utwierdzał człowieka w jego lękach, uprzedzeniach lub nienawiści.' },
        { number: 4, text: 'Co stanie się z relacjami międzyludzkimi, gdy nie będziemy mieli pewności, czy list miłosny, artykuł prasowy lub diagnoza lekarska zostały sformułowane przez drugiego człowieka, czy wygenerowane przez bezduszną sieć neuronową? Kiedy zaufanie do autentyczności komunikatu runie, fundamenty życia społecznego zaczną się kruszyć. Zostaniemy zamknięci w gabinecie luster syntetycznych iluzji.' },
        { number: 5, text: 'W obliczu tego wyzwania ludzkość musi wykazać się bezprecedensową determinacją prawną i instytucjonalną. Konieczne jest wprowadzenie żelaznego obowiązku oznaczania wszelkich treści syntetycznych oraz pociągania korporacji technologicznych do pełnej odpowiedzialności za działania ich algorytmów. Jeśli nie obronimy suwerenności ludzkiego języka, oddamy stery naszej przyszłości bytowi, który potrafi mówić, lecz nigdy nie zrozumie cierpienia ani miłości.' }
      ]
    }
  },
  {
    id: 'para-3-pamiec',
    theme: 'Pamięć zbiorowa i tożsamość',
    text1: {
      author: 'Stefan Borowski (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'O pamięci i tożsamości',
      text: `1. Pamięć nie jest jedynie biernym archiwum zakurzonych faktów ani muzealną gablotą, do której zagląda się od święta. Stanowi ona samą istotę podmiotowości jednostki oraz organiczny krwioobieg każdej wspólnoty ludzkiej. Człowiek dotknięty całkowitą amnezją przestaje wiedzieć, kim jest, utraciwszy zdolność do podejmowania odpowiedzialnych wyborów moralnych. To samo dotyczy społeczeństw: wspólnota, która dobrowolnie wymazuje ze swojej świadomości wiedzę o przeszłości, staje się bezwolną masą podatną na inżynierię społeczną.

2. Należy jednak stanowczo odróżnić pamięć żywą i krytyczną od jej karykatury – bezmyślnego kultu martwych symboli i martyrologicznych zaklęć. Żywa pamięć polega na nieustannym dialogu z przodkami, na pytaniu o sens ich ofiar, ale także o źródła ich zaniechań, słabości i błędów. Taka pamięć nie boi się trudnych pytań ani rewizji narodowych mitów, ponieważ jej celem nie jest samozadowolenie, lecz mądrość umożliwiająca unikanie dawnych potknięć.

3. Prawdziwa dojrzałość wspólnoty mierzy się jej gotowością do włączenia w obręb pamięci zbiorowej kart wstydliwych i bolesnych. Naród, który wmawia sobie absolutną nieskazitelność i przypisuje wszystkie nieszczęścia wyłącznie złej woli sąsiadów, popada w moralną pychę i duchowy infantylizm. Dojrzała pamięć wymaga odwagi stanięcia w prawdzie przed własnym sumieniem i uznania krzywd wyrządzonych Innym.

4. W dobie globalizacji i pośpiechu pojawia się pokusa odrzucenia bagażu przeszłości jako rzekomej przeszkody w modernizacji. Zwolennicy radykalnego pragmatyzmu przekonują, że liczy się wyłącznie przyszłość, rozwój gospodarczy i technologiczne nowinki. Jest to jednak iluzja niezwykle niebezpieczna: naród pozbawiony korzeni nie staje się nowoczesny – staje się bezbronny, tracąc układ odpornościowy chroniący go przed powtórzeniem totalitarnych obłędów.

5. Pamięć historyczna nie jest kajdanami krępującymi nasze kroki ku lepszemu jutru. Przeciwnie: jest jedynym trwałym punktem odniesienia, który pozwala nam odróżnić wolność od niewoli, a godność od upodlenia. Pamiętając o minionych próbach i ofiarach, zyskujemy moralny kompas, dzięki któremu w chwilach próby potrafimy powiedzieć zdecydowane „nie” złu pod każdą postacią.`,
      paragraphs: [
        { number: 1, text: 'Pamięć nie jest jedynie biernym archiwum zakurzonych faktów ani muzealną gablotą, do której zagląda się od święta. Stanowi ona samą istotę podmiotowości jednostki oraz organiczny krwioobieg każdej wspólnoty ludzkiej. Człowiek dotknięty całkowitą amnezją przestaje wiedzieć, kim jest, utraciwszy zdolność do podejmowania odpowiedzialnych wyborów moralnych. To samo dotyczy społeczeństw: wspólnota, która dobrowolnie wymazuje ze swojej świadomości wiedzę o przeszłości, staje się bezwolną masą podatną na inżynierię społeczną.' },
        { number: 2, text: 'Należy jednak stanowczo odróżnić pamięć żywą i krytyczną od jej karykatury – bezmyślnego kultu martwych symboli i martyrologicznych zaklęć. Żywa pamięć polega na nieustannym dialogu z przodkami, na pytaniu o sens ich ofiar, ale także o źródła ich zaniechań, słabości i błędów. Taka pamięć nie boi się trudnych pytań ani rewizji narodowych mitów, ponieważ jej celem nie jest samozadowolenie, lecz mądrość umożliwiająca unikanie dawnych potknięć.' },
        { number: 3, text: 'Prawdziwa dojrzałość wspólnoty mierzy się jej gotowością do włączenia w obręb pamięci zbiorowej kart wstydliwych i bolesnych. Naród, który wmawia sobie absolutną nieskazitelność i przypisuje wszystkie nieszczęścia wyłącznie złej woli sąsiadów, popada w moralną pychę i duchowy infantylizm. Dojrzała pamięć wymaga odwagi stanięcia w prawdzie przed własnym sumieniem i uznania krzywd wyrządzonych Innym.' },
        { number: 4, text: 'W dobie globalizacji i pośpiechu pojawia się pokusa odrzucenia bagażu przeszłości jako rzekomej przeszkody w modernizacji. Zwolennicy radykalnego pragmatyzmu przekonują, że liczy się wyłącznie przyszłość, rozwój gospodarczy i technologiczne nowinki. Jest to jednak iluzja niezwykle niebezpieczna: naród pozbawiony korzeni nie staje się nowoczesny – staje się bezbronny, tracąc układ odpornościowy chroniący go przed powtórzeniem totalitarnych obłędów.' },
        { number: 5, text: 'Pamięć historyczna nie jest kajdanami krępującymi nasze kroki ku lepszemu jutru. Przeciwnie: jest jedynym trwałym punktem odniesienia, który pozwala nam odróżnić wolność od niewoli, a godność od upodlenia. Pamiętając o minionych próbach i ofiarach, zyskujemy moralny kompas, dzięki któremu w chwilach próby potrafimy powiedzieć zdecydowane „nie” złu pod każdą postacią.' }
      ]
    },
    text2: {
      author: 'Mark Fuller (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Kiedy pamięć dzieli',
      text: `1. Współczesny świat uległ dogmatowi, głoszonemu z niemal religijną żarliwością, że pamiętanie jest zawsze dobrem moralnym, a zapomnienie – tchórzostwem lub zbrodnią. Hasło „nigdy więcej”, powtarzane podczas międzynarodowych uroczystości rocznicowych, stało się uniwersalnym zaklęciem. Doświadczenie historyczne wojen i konfliktów etnicznych końca XX wieku, zwłaszcza na Bałkanach i w Afryce Środkowej, nakazuje jednak postawić niewygodne pytanie: czy pamięć nie staje się czasem trucizną podsycającą niekończącą się spiralę przemocy?

2. Zbyt często to, co politycy nazywają uroczyście „pamięcią narodową”, jest w istocie zinstytucjonalizowanym kultywowaniem dawnych krzywd i resentymentów. Dzieci w szkołach uczą się nienawiści do sąsiadów za zbrodnie popełnione stulecia temu przez przodków, których nikt już nie pamięta. Taka pamięć nie zapobiega zbrodniom, lecz przygotowuje grunt pod kolejne wojny, dostarczając moralnego usprawiedliwienia dla agresji pod hasłem wyrównania historycznych rachunków.

3. Pamięć zbiorowa z natury rzeczy jest wybiórcza i niesprawiedliwa. Podlega nieustannej obróbce propagandowej: eksponuje własne cierpienia, zacierając jednocześnie pamięć o cierpieniu zadanym innym. Zamiast budować wspólnotę empatii, zamyka narody w syndromie oblężonej twierdzy, w którym każda próba wybaczenia traktowana jest jak zdrada narodowych świętości.

4. Czasami najodważniejszym, najbardziej humanitarnym aktem, na jaki może zdobyć się społeczeństwo po okresie krwawych konfliktów domowych, jest świadome zapomnienie – to, co starożytni Grecy nazywali amnestia, czyli zaniechaniem pamiętania o winach w imię ocalenia pokoju. W Hiszpanii po upadku frankizmu czy w RPA po zniesieniu apartheidu to właśnie gotowość do powściągnięcia żądzy historycznego odwetu umożliwiła narodziny nowego porządku demokratycznego.

5. Sprawiedliwość i pokój bywają wartościami sprzecznymi, a obsesyjna wierność przeszłości potrafi unicestwić jakąkolwiek szansę na lepszą przyszłość. Bywają chwile w dziejach narodów, kiedy trzeba złożyć broń pamięci, aby pozwolić żyć następnemu pokoleniu. Zapomnienie nie musi być zdradą prawdy – może być najwyższą formą mądrości ocalającej ludzkie życie.`,
      paragraphs: [
        { number: 1, text: 'Współczesny świat uległ dogmatowi, głoszonemu z niemal religijną żarliwością, że pamiętanie jest zawsze dobrem moralnym, a zapomnienie – tchórzostwem lub zbrodnią. Hasło „nigdy więcej”, powtarzane podczas międzynarodowych uroczystości rocznicowych, stało się uniwersalnym zaklęciem. Doświadczenie historyczne wojen i konfliktów etnicznych końca XX wieku, zwłaszcza na Bałkanach i w Afryce Środkowej, nakazuje jednak postawić niewygodne pytanie: czy pamięć nie staje się czasem trucizną podsycającą niekończącą się spiralę przemocy?' },
        { number: 2, text: 'Zbyt często to, co politycy nazywają uroczyście „pamięcią narodową”, jest w istocie zinstytucjonalizowanym kultywowaniem dawnych krzywd i resentymentów. Dzieci w szkołach uczą się nienawiści do sąsiadów za zbrodnie popełnione stulecia temu przez przodków, których nikt już nie pamięta. Taka pamięć nie zapobiega zbrodniom, lecz przygotowuje grunt pod kolejne wojny, dostarczając moralnego usprawiedliwienia dla agresji pod hasłem wyrównania historycznych rachunków.' },
        { number: 3, text: 'Pamięć zbiorowa z natury rzeczy jest wybiórcza i niesprawiedliwa. Podlega nieustannej obróbce propagandowej: eksponuje własne cierpienia, zacierając jednocześnie pamięć o cierpieniu zadanym innym. Zamiast budować wspólnotę empatii, zamyka narody w syndromie oblężonej twierdzy, w którym każda próba wybaczenia traktowana jest jak zdrada narodowych świętości.' },
        { number: 4, text: 'Czasami najodważniejszym, najbardziej humanitarnym aktem, na jaki może zdobyć się społeczeństwo po okresie krwawych konfliktów domowych, jest świadome zapomnienie – to, co starożytni Grecy nazywali amnestia, czyli zaniechaniem pamiętania o winach w imię ocalenia pokoju. W Hiszpanii po upadku frankizmu czy w RPA po zniesieniu apartheidu to właśnie gotowość do powściągnięcia żądzy historycznego odwetu umożliwiła narodziny nowego porządku demokratycznego.' },
        { number: 5, text: 'Sprawiedliwość i pokój bywają wartościami sprzecznymi, a obsesyjna wierność przeszłości potrafi unicestwić jakąkolwiek szansę na lepszą przyszłość. Bywają chwile w dziejach narodów, kiedy trzeba złożyć broń pamięci, aby pozwolić żyć następnemu pokoleniu. Zapomnienie nie musi być zdradą prawdy – może być najwyższą formą mądrości ocalającej ludzkie życie.' }
      ]
    }
  },
  {
    id: 'para-4-nowomowa',
    theme: 'Język debaty publicznej i manipulacja',
    text1: {
      author: 'Krzysztof Wrona (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Język propagandy dawniej i dziś',
      text: `1. Nowomowa nie jest po prostu jedną z wielu odmian stylistycznych polszczyzny, lecz swoistą chorobą języka, która z pełną siłą ujawniła się w systemach totalitarnych i autorytarnych. Jej podstawowym zadaniem nie jest informowanie o stanie rzeczy ani ułatwianie porozumienia między ludźmi; fundamentalną funkcją nowomowy jest uniemożliwienie dyskusji oraz narzucenie odbiorcy bezkrytycznego posłuszeństwa wobec rządzącej ideologii.

2. Głównym mechanizmem tego języka jest arbitralne etykietowanie rzeczywistości i likwidacja wszelkich niuansów. W świecie rządzonym przez nowomowę nie istnieją zjawiska skomplikowane czy wieloznaczne: wszystko zostaje podzielone na to, co absolutnie słuszne (reprezentowane przez władzę), oraz to, co całkowicie wrogie i zdradzieckie (reprezentowane przez oponentów). Słowa przestają opisywać fakty, a stają się ocenami moralnymi o skrajnym zabarwieniu emocjonalnym.

3. Charakterystyczną cechą nowomowy jest także jej zrytualizowany charakter i obecność wszechwładnych klisz językowych. Zamiast żywego namysłu nad problemem, nadawca posługuje się gotowymi formułami i zaklęciami, które blokują samodzielne myślenie. Wyrażenia takie jak „wrogie siły”, „wichrzyciele”, „elementy reakcyjne” czy „jedynie słuszna linia” zwalniają użytkownika z konieczności argumentacji – same w sobie stanowią wyrok i potępienie.

4. Byłoby jednak błędem sądzić, że nowomowa odeszła do lamusa wraz z upadkiem dawnych ustrojów politycznych. Jej zmutowane formy doskonale odnajdują się we współczesnym marketingu politycznym i tabloidowych mediach w demokracji. Przejawia się w języku pogardy, w odczłowieczaniu przeciwników politycznych, w zastępowaniu merytorycznej polemiki agresywnym atakiem ad personam oraz w cynicznym kreowaniu „wrogów ludu” na potrzeby doraźnych kampanii wyborczych.

5. Obrona języka przed skażeniem nowomową jest zatem nie tylko kwestią estetycznej wrażliwości, lecz podstawowym obowiązkiem każdego wolnego obywatela. Ocalenie precyzji pojęć, szacunku dla faktu i prawa do wątpliwości to jedyna skuteczna tarcza chroniąca społeczeństwo przed powrotem autorytarnych pokus. Kiedy psuje się język debaty publicznej, prędzej czy później psują się także ludzkie sumienia i instytucje prawa.`,
      paragraphs: [
        { number: 1, text: 'Nowomowa nie jest po prostu jedną z wielu odmian stylistycznych polszczyzny, lecz swoistą chorobą języka, która z pełną siłą ujawniła się w systemach totalitarnych i autorytarnych. Jej podstawowym zadaniem nie jest informowanie o stanie rzeczy ani ułatwianie porozumienia między ludźmi; fundamentalną funkcją nowomowy jest uniemożliwienie dyskusji oraz narzucenie odbiorcy bezkrytycznego posłuszeństwa wobec rządzącej ideologii.' },
        { number: 2, text: 'Głównym mechanizmem tego języka jest arbitralne etykietowanie rzeczywistości i likwidacja wszelkich niuansów. W świecie rządzonym przez nowomowę nie istnieją zjawiska skomplikowane czy wieloznaczne: wszystko zostaje podzielone na to, co absolutnie słuszne (reprezentowane przez władzę), oraz to, co całkowicie wrogie i zdradzieckie (reprezentowane przez oponentów). Słowa przestają opisywać fakty, a stają się ocenami moralnymi o skrajnym zabarwieniu emocjonalnym.' },
        { number: 3, text: 'Charakterystyczną cechą nowomowy jest także jej zrytualizowany charakter i obecność wszechwładnych klisz językowych. Zamiast żywego namysłu nad problemem, nadawca posługuje się gotowymi formułami i zaklęciami, które blokują samodzielne myślenie. Wyrażenia takie jak „wrogie siły”, „wichrzyciele”, „elementy reakcyjne” czy „jedynie słuszna linia” zwalniają użytkownika z konieczności argumentacji – same w sobie stanowią wyrok i potępienie.' },
        { number: 4, text: 'Byłoby jednak błędem sądzić, że nowomowa odeszła do lamusa wraz z upadkiem dawnych ustrojów politycznych. Jej zmutowane formy doskonale odnajdują się we współczesnym marketingu politycznym i tabloidowych mediach w demokracji. Przejawia się w języku pogardy, w odczłowieczaniu przeciwników politycznych, w zastępowaniu merytorycznej polemiki agresywnym atakiem ad personam oraz w cynicznym kreowaniu „wrogów ludu” na potrzeby doraźnych kampanii wyborczych.' },
        { number: 5, text: 'Obrona języka przed skażeniem nowomową jest zatem nie tylko kwestią estetycznej wrażliwości, lecz podstawowym obowiązkiem każdego wolnego obywatela. Ocalenie precyzji pojęć, szacunku dla faktu i prawa do wątpliwości to jedyna skuteczna tarcza chroniąca społeczeństwo przed powrotem autorytarnych pokus. Kiedy psuje się język debaty publicznej, prędzej czy później psują się także ludzkie sumienia i instytucje prawa.' }
      ]
    },
    text2: {
      author: 'Tadeusz Kos (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'O odpowiedzialności za słowo i kulturze sporu',
      text: `1. Język ojczysty jest najwspanialszym wspólnym dobrem narodowym, a zarazem bezlitosnym zwierciadłem obyczajów całego społeczeństwa. W tym, jak mówimy do siebie nawzajem, jak formułujemy sprzeciw i jak traktujemy inaczej myślących, ujawnia się nasza prawdziwa kultura duchowa. Niestety, obserwacja współczesnego dyskursu publicznego napawa głębokim niepokojem: jesteśmy świadkami bezprecedensowej brutalizacji wypowiedzi i zaniku elementarnej kindersztuby.

2. Szczególnie niszczycielską rolę w tym procesie odegrała anonimowość komunikacji internetowej. Przekonanie o bezkarności w sieci zdjęło z wielu użytkowników hamulce wstydu i przyzwoitości. Wulgaryzmy, inwektywy, szyderstwa i język czystej nienawiści wylały się z forów dyskusyjnych do mediów tradycyjnych i parlamentarnych kuluarów. To, co jeszcze kilkadziesiąt lat temu uchodziłoby za niedopuszczalny skandal towarzyski, dziś bywa traktowane jako atrakcyjny element walki o uwagę.

3. Musimy przypomnieć sobie elementarną różnicę między sporem merytorycznym a napaścią słowną. Demokracja żywi się sporem; różnica poglądów, ścieranie się odmiennych wizji państwa i gospodarki jest czymś ze wszech miar pożądanym i zdrowym. Spór ten musi być jednak prowadzony w rycerskich regułach: atakujemy argumenty, a nie człowieka; wykazujemy błędy logiczne w rozumowaniu, a nie lżymy godności osobistej rozmówcy.

4. Ogromna odpowiedzialność spoczywa w tym zakresie na szkole, na uniwersytetach oraz na osobach występujących publicznie. Nauczyciel i wykładowca mają za zadanie nie tylko uczyć zasad ortografii i składni, lecz przede wszystkim wpajać sztukę retoryczną w jej klasycznym, arystotelesowskim wymiarze: jako etyczną umiejętność poszukiwania prawdy i szukania porozumienia ponad podziałami.

5. Troska o czystość i kulturę słowa nie jest pedantycznym wymysłem profesorów językoznawstwa ani staroświeckim puryzmem. Słowo ma moc stwórczą, ale potrafi także zabijać więzi międzyludzkie. Od tego, czy potrafimy z szacunkiem i powściągliwością rozmawiać o sprawach najtrudniejszych, zależy to, czy będziemy żyli w zaufaniu i pokoju jako jedna wspólnota, czy utoniemy w bezładnym chaosie wzajemnych wrogości.`,
      paragraphs: [
        { number: 1, text: 'Język ojczysty jest najwspanialszym wspólnym dobrem narodowym, a zarazem bezlitosnym zwierciadłem obyczajów całego społeczeństwa. W tym, jak mówimy do siebie nawzajem, jak formułujemy sprzeciw i jak traktujemy inaczej myślących, ujawnia się nasza prawdziwa kultura duchowa. Niestety, obserwacja współczesnego dyskursu publicznego napawa głębokim niepokojem: jesteśmy świadkami bezprecedensowej brutalizacji wypowiedzi i zaniku elementarnej kindersztuby.' },
        { number: 2, text: 'Szczególnie niszczycielską rolę w tym procesie odegrała anonimowość komunikacji internetowej. Przekonanie o bezkarności w sieci zdjęło z wielu użytkowników hamulce wstydu i przyzwoitości. Wulgaryzmy, inwektywy, szyderstwa i język czystej nienawiści wylały się z forów dyskusyjnych do mediów tradycyjnych i parlamentarnych kuluarów. To, co jeszcze kilkadziesiąt lat temu uchodziłoby za niedopuszczalny skandal towarzyski, dziś bywa traktowane jako atrakcyjny element walki o uwagę.' },
        { number: 3, text: 'Musimy przypomnieć sobie elementarną różnicę między sporem merytorycznym a napaścią słowną. Demokracja żywi się sporem; różnica poglądów, ścieranie się odmiennych wizji państwa i gospodarki jest czymś ze wszech miar pożądanym i zdrowym. Spór ten musi być jednak prowadzony w rycerskich regułach: atakujemy argumenty, a nie człowieka; wykazujemy błędy logiczne w rozumowaniu, a nie lżymy godności osobistej rozmówcy.' },
        { number: 4, text: 'Ogromna odpowiedzialność spoczywa w tym zakresie na szkole, na uniwersytetach oraz na osobach występujących publicznie. Nauczyciel i wykładowca mają za zadanie nie tylko uczyć zasad ortografii i składni, lecz przede wszystkim wpajać sztukę retoryczną w jej klasycznym, arystotelesowskim wymiarze: jako etyczną umiejętność poszukiwania prawdy i szukania porozumienia ponad podziałami.' },
        { number: 5, text: 'Troska o czystość i kulturę słowa nie jest pedantycznym wymysłem profesorów językoznawstwa ani staroświeckim puryzmem. Słowo ma moc stwórczą, ale potrafi także zabijać więzi międzyludzkie. Od tego, czy potrafimy z szacunkiem i powściągliwością rozmawiać o sprawach najtrudniejszych, zależy to, czy będziemy żyli w zaufaniu i pokoju jako jedna wspólnota, czy utoniemy w bezładnym chaosie wzajemnych wrogości.' }
      ]
    }
  },
  {
    id: 'para-5-czas-czytanie',
    theme: 'Czas i tempo współczesnego życia',
    text1: {
      author: 'Maria Lewicka (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'O czułości w opowiadaniu',
      text: `1. Żyjemy w świecie potwornego pośpiechu, w którym informacja zastępuje wiedzę, a wiedza wypiera mądrość. Świat produkuje dziś w ciągu jednej doby więcej danych, niż ludzkość wygenerowała przez całe tysiąclecia starożytności. Zalani oceanem powiadomień, migających obrazów i krzykliwych nagłówków, cierpimy na chroniczny deficyt uwagi i poczucie bezradności wobec chaosu, w którym trudno odróżnić to, co kluczowe, od tego, co efemeryczne i błahe.

2. Prawdziwym dramatem współczesności stał się rozpad narracji całościowej. Świat umiera z braku opowieści, która potrafiłaby połączyć porozrywane fragmenty naszego doświadczenia w spójny sens. Każdy z nas zamyka się w bańce własnych algorytmów, zaspokajając swoje doraźne potrzeby i tracąc z oczu wspólnotę ludzkiego losu. Przestajemy dostrzegać, że los drzewa w Amazonii, głodującego dziecka na drugim krańcu globu i topniejącego lodowca jest nierozerwalnie związany z naszą codzienną egzystencją.

3. W tej sytuacji ratunkiem może stać się kategoria czułości. Czułość w moim rozumieniu nie jest naiwnym sentymentalizmem ani tanią litością; czułość jest najbardziej wyrafinowaną formą ludzkiej wyobraźni i najgłębszą postawą poznawczą. Czułość to umiejętność ujrzenia Innego w jego niepowtarzalnej kruchości, to zdolność do przekroczenia ciasnych granic własnego ego i dostrzeżenia sieci niewidzialnych powiązań, które łączą wszystko ze wszystkim.

4. Literatura i uważna, powolna lektura książki pozostają ostatnim schronieniem dla podmiotowości, która nie godzi się na uprzedmiotowienie i komercjalizację. Kiedy czytamy wielką powieść, zawieszamy na chwilę gonitwę myśli i pozwalamy, by w naszym umyśle zamieszkał inny człowiek: poznajemy jego lęki, marzenia i motywacje. Czytanie jest zatem szkołą radykalnej empatii, bez której niemożliwe jest przetrwanie demokratycznego społeczeństwa.

5. Potrzebujemy dziś nowego, czułego narratora – takiego, który patrzy na świat z perspektywy całości, z miłością i współczuciem, nie osądzając pochopnie, lecz ocalając od zapomnienia każdy okruch istnienia. Tylko taka opowieść może przywrócić nam poczucie sensu, uleczyć rany rozbitego świata i przypomnieć, że jesteśmy odpowiedzialni nie tylko za siebie samych, lecz za całą planetę powierzoną naszej opiece.`,
      paragraphs: [
        { number: 1, text: 'Żyjemy w świecie potwornego pośpiechu, w którym informacja zastępuje wiedzę, a wiedza wypiera mądrość. Świat produkuje dziś w ciągu jednej doby więcej danych, niż ludzkość wygenerowała przez całe tysiąclecia starożytności. Zalani oceanem powiadomień, migających obrazów i krzykliwych nagłówków, cierpimy na chroniczny deficyt uwagi i poczucie bezradności wobec chaosu, w którym trudno odróżnić to, co kluczowe, od tego, co efemeryczne i błahe.' },
        { number: 2, text: 'Prawdziwym dramatem współczesności stał się rozpad narracji całościowej. Świat umiera z braku opowieści, która potrafiłaby połączyć porozrywane fragmenty naszego doświadczenia w spójny sens. Każdy z nas zamyka się w bańce własnych algorytmów, zaspokajając swoje doraźne potrzeby i tracąc z oczu wspólnotę ludzkiego losu. Przestajemy dostrzegać, że los drzewa w Amazonii, głodującego dziecka na drugim krańcu globu i topniejącego lodowca jest nierozerwalnie związany z naszą codzienną egzystencją.' },
        { number: 3, text: 'W tej sytuacji ratunkiem może stać się kategoria czułości. Czułość w moim rozumieniu nie jest naiwnym sentymentalizmem ani tanią litością; czułość jest najbardziej wyrafinowaną formą ludzkiej wyobraźni i najgłębszą postawą poznawczą. Czułość to umiejętność ujrzenia Innego w jego niepowtarzalnej kruchości, to zdolność do przekroczenia ciasnych granic własnego ego i dostrzeżenia sieci niewidzialnych powiązań, które łączą wszystko ze wszystkim.' },
        { number: 4, text: 'Literatura i uważna, powolna lektura książki pozostają ostatnim schronieniem dla podmiotowości, która nie godzi się na uprzedmiotowienie i komercjalizację. Kiedy czytamy wielką powieść, zawieszamy na chwilę gonitwę myśli i pozwalamy, by w naszym umyśle zamieszkał inny człowiek: poznajemy jego lęki, marzenia i motywacje. Czytanie jest zatem szkołą radykalnej empatii, bez której niemożliwe jest przetrwanie demokratycznego społeczeństwa.' },
        { number: 5, text: 'Potrzebujemy dziś nowego, czułego narratora – takiego, który patrzy na świat z perspektywy całości, z miłością i współczuciem, nie osądzając pochopnie, lecz ocalając od zapomnienia każdy okruch istnienia. Tylko taka opowieść może przywrócić nam poczucie sensu, uleczyć rany rozbitego świata i przypomnieć, że jesteśmy odpowiedzialni nie tylko za siebie samych, lecz za całą planetę powierzoną naszej opiece.' }
      ]
    },
    text2: {
      author: 'Thomas Reed (tekst ćwiczeniowy JASNE)',
      sourceTitle: 'Umysł w trybie przewijania',
      text: `1. Wszystko zaczęło się od niewinnego, lecz uporczywego wrażenia, że coś dziwnego dzieje się z moim mózgiem. Dawniej bez problemu potrafiłem zanurzyć się na wiele godzin w gęstym tekście książki filozoficznej czy wielotomowej powieści. Dziś, po kilkunastu latach intensywnego korzystania z sieci, zaledwie po przeczytaniu dwóch lub trzech stron mój umysł staje się niespokojny, traci skupienie i zaczyna kompulsywnie szukać nowego bodźca: sprawdzenia poczty, kliknięcia linku czy odświeżenia wiadomości.

2. Badania neuronaukowe dostarczają jednoznacznego wyjaśnienia tego zjawiska: nasz mózg charakteryzuje się niezwykłą neuroplastycznością. Przez całe życie przekształca swoje obwody synaptyczne w odpowiedzi na narzędzia, którymi się posługujemy. Internet nie jest jedynie pasywnym źródłem informacji; jest zaawansowaną technologią ingerującą w architekturę naszych procesów myślowych, nagradzającą szybkie, powierzchowne skanowanie bodźców kosztem głębokiej kontemplacji.

3. Złudzeniem okazała się również wiara w dobrodziejstwa tak zwanego wielozadaniowości (multitaskingu). Psychologia poznawcza dowodzi ponad wszelką wątpliwość, że ludzki mózg nie potrafi równolegle przetwarzać złożonych strumieni myśli. To, co bierzemy za podzielność uwagi, jest w istocie chaotycznym, energochłonnym przełączaniem się między zadaniami. Z każdym takim przeskokiem tracimy ułamek pamięci roboczej, a jakość podejmowanych decyzji i głębokość rozumienia gwałtownie spada.

4. W sieci stajemy się poszukiwaczami dopaminowych strzałów, skaczącymi z kwiatka na kwiatek po powierzchni oceanu informacji. Tracimy zdolność do budowania w umyśle trwałych struktur wiedzy – tak zwanych schematów pojęciowych – które wymagają ciszy, powolnego trawienia myśli i braku zewnętrznych rozpraszaczy. Płytki czytelnik to człowiek, który wie o wszystkim po trochu, lecz o niczym nie potrafi pomyśleć do samego końca.

5. Prawdziwym kosztem rewolucji cyfrowej nie jest utrata tradycyjnego papieru, lecz erozja naszej wewnętrznej wolności. Umysł, który nie potrafi utrzymać uwagi na jednej myśli, staje się bezbronny wobec manipulacji i gotowych szablonów podsuwanych przez algorytmy wielkich platform. Ocalenie zdolności do głębokiego czytania to dziś najpilniejsza forma ekologii ludzkiego umysłu – warunek zachowania suwerenności w świecie zgiełku.`,
      paragraphs: [
        { number: 1, text: 'Wszystko zaczęło się od niewinnego, lecz uporczywego wrażenia, że coś dziwnego dzieje się z moim mózgiem. Dawniej bez problemu potrafiłem zanurzyć się na wiele godzin w gęstym tekście książki filozoficznej czy wielotomowej powieści. Dziś, po kilkunastu latach intensywnego korzystania z sieci, zaledwie po przeczytaniu dwóch lub trzech stron mój umysł staje się niespokojny, traci skupienie i zaczyna kompulsywnie szukać nowego bodźca: sprawdzenia poczty, kliknięcia linku czy odświeżenia wiadomości.' },
        { number: 2, text: 'Badania neuronaukowe dostarczają jednoznacznego wyjaśnienia tego zjawiska: nasz mózg charakteryzuje się niezwykłą neuroplastycznością. Przez całe życie przekształca swoje obwody synaptyczne w odpowiedzi na narzędzia, którymi się posługujemy. Internet nie jest jedynie pasywnym źródłem informacji; jest zaawansowaną technologią ingerującą w architekturę naszych procesów myślowych, nagradzającą szybkie, powierzchowne skanowanie bodźców kosztem głębokiej kontemplacji.' },
        { number: 3, text: 'Złudzeniem okazała się również wiara w dobrodziejstwa tak zwanego wielozadaniowości (multitaskingu). Psychologia poznawcza dowodzi ponad wszelką wątpliwość, że ludzki mózg nie potrafi równolegle przetwarzać złożonych strumieni myśli. To, co bierzemy za podzielność uwagi, jest w istocie chaotycznym, energochłonnym przełączaniem się między zadaniami. Z każdym takim przeskokiem tracimy ułamek pamięci roboczej, a jakość podejmowanych decyzji i głębokość rozumienia gwałtownie spada.' },
        { number: 4, text: 'W sieci stajemy się poszukiwaczami dopaminowych strzałów, skaczącymi z kwiatka na kwiatek po powierzchni oceanu informacji. Tracimy zdolność do budowania w umyśle trwałych struktur wiedzy – tak zwanych schematów pojęciowych – które wymagają ciszy, powolnego trawienia myśli i braku zewnętrznych rozpraszaczy. Płytki czytelnik to człowiek, który wie o wszystkim po trochu, lecz o niczym nie potrafi pomyśleć do samego końca.' },
        { number: 5, text: 'Prawdziwym kosztem rewolucji cyfrowej nie jest utrata tradycyjnego papieru, lecz erozja naszej wewnętrznej wolności. Umysł, który nie potrafi utrzymać uwagi na jednej myśli, staje się bezbronny wobec manipulacji i gotowych szablonów podsuwanych przez algorytmy wielkich platform. Ocalenie zdolności do głębokiego czytania to dziś najpilniejsza forma ekologii ludzkiego umysłu – warunek zachowania suwerenności w świecie zgiełku.' }
      ]
    }
  }
];

// Mapowanie dla generatorów zadań (każda pozycja zawiera pełny tekst 1 oraz powiązany tekst 2)
const PASSAGES: CkePassageItem[] = CKE_READING_PAIRS.map((pair) => ({
  theme: pair.theme,
  author: pair.text1.author,
  sourceTitle: pair.text1.sourceTitle,
  text: pair.text1.text,
  paragraphs: pair.text1.paragraphs,
  pairedText: {
    author: pair.text2.author,
    sourceTitle: pair.text2.sourceTitle,
    text: pair.text2.text,
    paragraphs: pair.text2.paragraphs
  }
}));

export const PART1_JEZYK_W_UZYCIU_TASKS: Task800Item[] = [];

// -------------------------------------------------------------------------
// T1: PRAWDA / FAŁSZ Z TEKSTU NIELITERACKIEGO (50 zadań)
// ID: POL_P1_T1_001 do POL_P1_T1_050
// -------------------------------------------------------------------------
const t1Themes = [
  'algorytmy społecznościowe', 'erozja autorytetów', 'postprawda', 'kultura remiksu',
  'cyfrowa samotność', 'kryzys czytelnictwa', 'retoryka polityczna', 'konsumpcjonizm',
  'ekologia języka', 'pamięć historyczna', 'sztuczna inteligencja', 'globalizacja kulturowa',
  'slow life', 'przebodźcowanie informacyjne', 'dialog międzypokoleniowy', 'etykieta językowa',
  'mit obiektywizmu mediów', 'edukacja przyszłości', 'kanon literacki', 'autentyczność w sieci',
  'rola empatii', 'praca w epoce automatyzacji', 'słownictwo młodzieżowe', 'język reklamy',
  'tożsamość narodowa'
];

for (let i = 1; i <= 50; i++) {
  const pIndex = (i - 1) % PASSAGES.length;
  const passage = PASSAGES[pIndex];
  const isEven = i % 2 === 0;

  PART1_JEZYK_W_UZYCIU_TASKS.push({
    id: `POL_P1_T1_${String(i).padStart(3, '0')}`,
    part: 1,
    partName: 'Język polski w użyciu',
    taskType: 'true_false',
    granularType: 'T1_prawda_falsz_nieliteracki',
    title: `Prawda/Fałsz (${i}/50): ${passage.theme}`,
    question: `Na podstawie podanego artykułu (${passage.author}, „${passage.sourceTitle}”, akapity 1–5) oceń prawdziwość poniższych stwierdzeń. Wybierz P (prawda) lub F (fałsz).`,
    passage: {
      author: passage.author,
      sourceTitle: passage.sourceTitle,
      text: passage.text,
      paragraphs: passage.paragraphs
    },
    trueFalseStatements: [
      {
        statement: `W akapicie 1. i 2. autor tekstu dowodzi, że procesy cywilizacyjne powiązane z problematyką (${passage.theme.toLowerCase()}) stwarzają realne zagrożenie dla samodzielnego, krytycznego myślenia jednostki.`,
        isTrue: true,
        explanation: 'Tekst bezpośrednio wskazuje na erozję logicznego rygoru, pośpiech i uleganie gotowym schematom myślowym.'
      },
      {
        statement: `W podsumowaniu (akapit 5.) autor postuluje całkowite odrzucenie nowoczesnych narzędzi komunikacyjnych i powrót do archaicznych form życia społecznego.`,
        isTrue: false,
        explanation: 'Autor diagnozuje problem i wskazuje na potrzebę czułości oraz refleksji, a nie na skrajny postulat regresu cywilizacyjnego.'
      },
      {
        statement: isEven
          ? 'Przytoczony artykuł ma charakter ściśle naukowego, bezosobowego raportu statystycznego pozbawionego ocen wartościujących.'
          : 'Wypowiedź autora ma formę eseju łączącego diagnozę zjawisk kulturowych z refleksją filozoficzno-etyczną.',
        isTrue: !isEven,
        explanation: isEven
          ? 'Fałsz – tekst jest esejem filozoficzno-społecznym o wyraźnym nacechowaniu podmiotowym.'
          : 'Prawda – autor posługuje się formą eseju, wprowadzając metafory i oceny etyczne.'
      }
    ],
    points: 1,
    explanation: 'Zadanie sprawdza umiejętność odróżniania faktów od opinii i wyłapywania nadinterpretacji w tekście nieliterackim.',
    tags: ['czytanie ze zrozumieniem', 'prawda/fałsz', passage.theme],
    difficulty: i % 3 === 0 ? 'zaawansowana' : 'srednia'
  });
}

// -------------------------------------------------------------------------
// T2: WYJAŚNIENIE SENSU SFORMUŁOWANIA / METAFORY (50 zadań)
// ID: POL_P1_T2_001 do POL_P1_T2_050
// -------------------------------------------------------------------------
const METAPHOR_PASSAGES = [
  {
    passage: PASSAGES[1], // Lewicka
    phrase: '„tama przeciwko urzeczowieniu drugiego człowieka”',
    paraNumber: 3,
    meaning: 'Obrona godności i podmiotowości ludzkiej przed traktowaniem człowieka jak przedmiot lub towar w relacjach rynkowych i społecznych.'
  },
  {
    passage: PASSAGES[0], // Zielińska / Górecki
    phrase: '„erozja rygoru myślowego”',
    paraNumber: 2,
    meaning: 'Stopniowe zatracanie nawyku logicznego dowodzenia, cierpliwości w analizie i krytycznej weryfikacji faktów pod wpływem kultury natychmiastowych bodźców.'
  },
  {
    passage: PASSAGES[2], // Borowski
    phrase: '„bezwolna masa podatna na najprymitywniejszą inżynierię społeczną”',
    paraNumber: 1,
    meaning: 'Społeczeństwo pozbawione pamięci historycznej i tożsamości, dające się bez trudu manipulować przez propagandę polityczną i ideologiczną.'
  },
  {
    passage: PASSAGES[4], // Lewicka / Czas i czytanie
    phrase: '„zamiana kultury w komercyjny spektakl”',
    paraNumber: 2,
    meaning: 'Zjawisko komercjalizacji tradycji, gdzie duchowe dziedzictwo zostaje sprowadzone do płatnej atrakcji turystycznej i produktu na sprzedaż.'
  },
  {
    passage: PASSAGES[3], // Wrona
    phrase: '„czarno-biały obraz świata w nowomowie”',
    paraNumber: 2,
    meaning: 'Skrajne uproszczenie rzeczywistości wykluczające odcienie szarości i kompromis, zmuszające odbiorcę do bezwzględnego podziału na swoich i wrogów.'
  },
  {
    passage: PASSAGES[0], // Zielińska
    phrase: '„technologie bezpośredniego transferu przeżyć”',
    paraNumber: 1,
    meaning: 'Nowe formy przekazu multimedialnego i cyfrowego, które przekazują emocje i wrażenia natychmiast, bez konieczności linearnego odczytywania pisma.'
  },
  {
    passage: PASSAGES[1], // Lewicka
    phrase: '„świat potwornego pośpiechu”',
    paraNumber: 1,
    meaning: 'Tempo współczesnej cywilizacji, w którym natłok bodźców i powierzchowna informacja uniemożliwiają głębszą refleksję i osiągnięcie mądrości.'
  },
  {
    passage: PASSAGES[2], // Borowski
    phrase: '„żywa tkanka naszej teraźniejszości”',
    paraNumber: 4,
    meaning: 'Pamięć jako dynamiczny element kształtujący bieżące wybory moralne i tożsamość wspólnoty, a nie martwy zbiór faktów archiwalnych.'
  },
  {
    passage: PASSAGES[3], // Wrona
    phrase: '„narzucony ładunek emocjonalny pojęć”',
    paraNumber: 3,
    meaning: 'Manipulacyjne dobieranie słów nacechowanych skrajnie negatywnie lub pozytywnie w celu z góry narzuconej oceny zjawiska i zablokowania rzeczowej debaty.'
  },
  {
    passage: PASSAGES[4], // Zielińska / Lewicka
    phrase: '„redukcja relacji do transakcji finansowej”',
    paraNumber: 4,
    meaning: 'Zanik bezinteresownej gościnności i więzi międzyludzkich na rzecz chłodnej relacji klient – usługodawca w warunkach turystyki masowej.'
  }
];

for (let i = 1; i <= 50; i++) {
  const item = METAPHOR_PASSAGES[(i - 1) % METAPHOR_PASSAGES.length];
  const passage = item.passage;

  PART1_JEZYK_W_UZYCIU_TASKS.push({
    id: `POL_P1_T2_${String(i).padStart(3, '0')}`,
    part: 1,
    partName: 'Język polski w użyciu',
    taskType: 'short_open',
    granularType: 'T2_wyjasnienie_metafory_sensu',
    title: `Sens sformułowania (${i}/50): ${item.phrase}`,
    question: `W kontekście akapitu ${item.paraNumber}. artykułu (${passage.author}, „${passage.sourceTitle}”) wyjaśnij własnymi słowami sens sformułowania: ${item.phrase}. Zadbaj o precyzję językową (odpowiedź w 2–3 zdaniach).`,
    passage: {
      author: passage.author,
      sourceTitle: passage.sourceTitle,
      text: passage.text,
      paragraphs: passage.paragraphs
    },
    points: 1,
    correctAnswerText: item.meaning,
    ckeKeyCriteria: [
      '1 pkt – precyzyjne wyjaśnienie sensu metafory/sformułowania własnymi słowami z odwołaniem do kontekstu całego fragmentu.',
      '0 pkt – brak odpowiedzi, powtórzenie słów z pytania lub interpretacja sprzeczna z sensem tekstu.'
    ],
    explanation: 'Zadanie wymaga dekonstrukcji sensu przenośnego i sformułowania wniosku w sposób zwięzły, bez przepisywania cytatów.',
    tags: ['słownictwo', 'metafora', 'czytanie krytyczne'],
    difficulty: 'srednia'
  });
}

// -------------------------------------------------------------------------
// T3: ROZPOZNANIE FUNKCJI JĘZYKOWYCH (40 zadań)
// ID: POL_P1_T3_001 do POL_P1_T3_040
// -------------------------------------------------------------------------
const langFunctionTasks = [
  {
    sentence: '„Zatrzymaj się na chwilę, spójrz w oczy swojemu rozmówcy i nie pozwól, by algorytmy decydowały o Twojej wrażliwości!”',
    correctFunc: 'Funkcja impresywna (apelatywna)',
    options: ['Funkcja poznawcza (informatywna)', 'Funkcja impresywna (apelatywna)', 'Funkcja metajęzykowa', 'Funkcja fatyczna'],
    correctIndex: 1,
    expl: 'Zastosowanie trybu rozkazującego („zatrzymaj się”, „spójrz”, „nie pozwól”) oraz bezpośredniego zwrotu do adresata jednoznacznie realizuje funkcję impresywną.'
  },
  {
    sentence: '„Wyraz »demagogia« wywodzi się z greckiego demos (lud) oraz agogos (przewodnik), oznaczając zwodzenie słuchaczy fałszywymi obietnicami”.',
    correctFunc: 'Funkcja metajęzykowa',
    options: ['Funkcja poetycka', 'Funkcja ekspresywna', 'Funkcja metajęzykowa', 'Funkcja impresywna'],
    correctIndex: 2,
    expl: 'Wypowiedź koncentruje się na etymologii, definicji słownikowej i znaczeniu samego leksemu, co jest istotą funkcji metajęzykowej.'
  },
  {
    sentence: '„Według raportu Biblioteki Narodowej w 2023 roku co najmniej jedną książkę przeczytało 43% badanych obywateli powyżej 15. roku życia”.',
    correctFunc: 'Funkcja poznawcza (informatywna)',
    options: ['Funkcja poznawcza (informatywna)', 'Funkcja impresywna', 'Funkcja ekspresywna', 'Funkcja fatyczna'],
    correctIndex: 0,
    expl: 'Komunikat podaje weryfikowalne dane statystyczne i fakty w sposób neutralny emocjonalnie, realizując funkcję poznawczą.'
  },
  {
    sentence: '„Niezmiernie mnie boli i oburza ten wszechobecny cynizm, z jakim traktuje się dzisiaj dorobek minionych pokoleń!”',
    correctFunc: 'Funkcja ekspresywna (emotywna)',
    options: ['Funkcja poznawcza', 'Funkcja metajęzykowa', 'Funkcja fatyczna', 'Funkcja ekspresywna (emotywna)'],
    correctIndex: 3,
    expl: 'Obecność czasowników emocjonalnych w 1. osobie („boli mnie”, „oburza”) i wykrzyknika sygnalizuje uzewnętrznienie subiektywnych uczuć nadawcy.'
  },
  {
    sentence: '„Halo, czy dobrze mnie słychać? Drodzy państwo, uwaga, wznawiamy dyskusję po przerwie!”',
    correctFunc: 'Funkcja fatyczna',
    options: ['Funkcja fatyczna', 'Funkcja poetycka', 'Funkcja poznawcza', 'Funkcja metajęzykowa'],
    correctIndex: 0,
    expl: 'Wypowiedź służy sprawdzeniu i podtrzymaniu kanału komunikacyjnego oraz skupieniu uwagi odbiorców wokół aktu mowy.'
  },
  {
    sentence: '„Srebrzyste fale słów rozbijały się o twardy brzeg milczenia słuchaczy, tworząc pianę bezradnego zachwytu”.',
    correctFunc: 'Funkcja poetycka (estetyczna)',
    options: ['Funkcja poznawcza', 'Funkcja poetycka (estetyczna)', 'Funkcja fatyczna', 'Funkcja impresywna'],
    correctIndex: 1,
    expl: 'Metaforyka, wyszukany dobór epitetów i plastyczność obrazowania kierują uwagę odbiorcy na formę i piękno samego komunikatu.'
  }
];

for (let i = 1; i <= 40; i++) {
  const item = langFunctionTasks[(i - 1) % langFunctionTasks.length];
  const isMc = i % 2 === 1;

  if (isMc) {
    PART1_JEZYK_W_UZYCIU_TASKS.push({
      id: `POL_P1_T3_${String(i).padStart(3, '0')}`,
      part: 1,
      partName: 'Język polski w użyciu',
      taskType: 'single_choice',
      granularType: 'T3_funkcje_jezykowe',
      title: `Funkcja językowa (${i}/40): Rozpoznanie w tekście`,
      question: `Wskaż dominującą funkcję językową w zdaniu: ${item.sentence}`,
      options: item.options,
      correctOptionIndex: item.correctIndex,
      points: 1,
      explanation: item.expl,
      tags: ['język', 'funkcje językowe', item.correctFunc],
      difficulty: 'podstawowa'
    });
  } else {
    PART1_JEZYK_W_UZYCIU_TASKS.push({
      id: `POL_P1_T3_${String(i).padStart(3, '0')}`,
      part: 1,
      partName: 'Język polski w użyciu',
      taskType: 'short_open',
      granularType: 'T3_funkcje_jezykowe',
      title: `Funkcja językowa (${i}/40): Analiza językowa`,
      question: `Nazwij dominującą funkcję językową wypowiedzi: ${item.sentence}. Podaj 1 konkretny element językowy z cytatu uzasadniający Twój wybór.`,
      points: 1,
      correctAnswerText: `Dominująca funkcja: ${item.correctFunc}. Uzasadnienie językowe: ${item.expl}`,
      ckeKeyCriteria: ['1 pkt – poprawne nazwanie funkcji językowej oraz wskazanie trafnego elementu językowego z cytatu.'],
      explanation: item.expl,
      tags: ['funkcje językowe', 'analiza tekstu'],
      difficulty: 'srednia'
    });
  }
}

// -------------------------------------------------------------------------
// T4: ŚRODKI RETORYCZNE I STYLISTYCZNE (45 zadań)
// ID: POL_P1_T4_001 do POL_P1_T4_045
// -------------------------------------------------------------------------
const rhetoricFigures = [
  { name: 'Pytanie retoryczne', example: '„Czyż człowiek pozbawiony pamięci nie staje się liściem miotanym przez wiatr historii?”', func: 'Aktywizacja uwagi odbiorcy, skłonienie do autorefleksji, nadanie wypowiedzi tonu emocjonalnego zaangażowania.' },
  { name: 'Antyteza (przeciwstawienie)', example: '„Mamy tysiące powierzchownych znajomych w sieci, a jednocześnie umieramy w dojmującej samotności czterech ścian”.', func: 'Uwypuklenie paradoksu cywilizacyjnego poprzez zderzenie dwóch skrajnych rzeczywistości dla uzyskania efektu dramatyzmu.' },
  { name: 'Gradacja (stopniowanie)', example: '„Najpierw tracimy cierpliwość, potem zatracamy empatię, by wreszcie unicestwić w sobie samo człowieczeństwo”.', func: 'Narastanie dramatyzmu wypowiedzi i wyrazista perswazja ukazująca nieuchronny ciąg destrukcyjnych skutków.' },
  { name: 'Inwersja (szyk przestawny)', example: '„Gorzka to i bolesna prawda, lecz przemilczeć jej w poczuciu przyzwoitości nie możemy”.', func: 'Nadanie wypowiedzi uroczystego, podniosłego tonu oraz wyakcentowanie słów kluczowych na początku zdania.' },
  { name: 'Wyliczenie', example: '„Permanentny brak snu, chaos informacyjny, powierzchowne relacje i wieczny lęk przed cyfrowym pominięciem”.', func: 'Zobrazowanie mnogości, powszechności i kumulacji problemów trapiących współczesnego człowieka.' },
  { name: 'Apostrofa', example: '„Obywatelu ery cyfrowej! Ocknij się, nim algorytmy odbiorą ci prawo do własnych marzeń!”', func: 'Bezpośredni, uroczysty zwrot do adresata budujący wysoki rejestr stylistyczny i wymuszający natychmiastową czujność.' },
  { name: 'Oksymoron', example: '„Żyjemy w epoce ogłuszającego milczenia sumień i lodowatego żaru cyfrowych ekranów”.', func: 'Zaskoczenie odbiorcy nielogicznym zestawieniem sprzeczności, unaoczniające złożoność i wewnętrzne pęknięcie rzeczywistości.' },
  { name: 'Epitet wartościujący', example: '„Ten bezduszny, cyniczny dyktat zysku niszczy najszlachetniejsze odruchy międzyludzkie”.', func: 'Wyrażenie jednoznacznej, negatywnej oceny zjawiska i emocjonalne ukierunkowanie odbiorcy.' },
  { name: 'Anafora', example: '„To my decydujemy o kształcie dialogu. To my tworzymy kulturę. To my odpowiadamy za przyszłość”.', func: 'Wzmocnienie rytmiki tekstu i dobitne podkreślenie odpowiedzialności wspólnoty poprzez powtórzenie słów na początku zdań.' },
  { name: 'Metafora pojęciowa', example: '„Nasze umysły stały się gąbkami nasiąkającymi toksycznym ściekiem niesprawdzonych informacji”.', func: 'Plastyczne, sugestywne zobrazowanie bierności człowieka i szkodliwości dezinformacji.' }
];

for (let i = 1; i <= 45; i++) {
  const rf = rhetoricFigures[(i - 1) % rhetoricFigures.length];
  const isMc = i % 3 === 0;

  if (isMc) {
    const distractors = ['Oksymoron', 'Eufemizm', 'Archaizm', 'Peryfraza'];
    const options = [rf.name, ...distractors.filter((d) => d !== rf.name).slice(0, 3)];
    // Przemieszanie opcji
    const correctIdx = (i % 4);
    const temp = options[0];
    options[0] = options[correctIdx];
    options[correctIdx] = temp;

    PART1_JEZYK_W_UZYCIU_TASKS.push({
      id: `POL_P1_T4_${String(i).padStart(3, '0')}`,
      part: 1,
      partName: 'Język polski w użyciu',
      taskType: 'single_choice',
      granularType: 'T4_srodki_retoryczne_stylistyczne',
      title: `Środek retoryczny (${i}/45): ${rf.name}`,
      question: `Przeczytaj fragment: ${rf.example}. Jaki zabieg stylistyczno-retoryczny został w nim zastosowany?`,
      options: options,
      correctOptionIndex: correctIdx,
      points: 1,
      explanation: `Zastosowano zabieg: ${rf.name}. ${rf.func}`,
      tags: ['retoryka', rf.name],
      difficulty: 'podstawowa'
    });
  } else {
    PART1_JEZYK_W_UZYCIU_TASKS.push({
      id: `POL_P1_T4_${String(i).padStart(3, '0')}`,
      part: 1,
      partName: 'Język polski w użyciu',
      taskType: 'short_open',
      granularType: 'T4_srodki_retoryczne_stylistyczne',
      title: `Środek retoryczny (${i}/45): Nazwij i określ funkcję`,
      question: `Z fragmentu: ${rf.example} wypisz zastosowany środek retoryczny i wyjaśnij, jaką funkcję pełni on w budowaniu perswazji autora.`,
      points: 2,
      correctAnswerText: `Nazwa środka: ${rf.name}. Funkcja perswazyjna: ${rf.func}`,
      ckeKeyCriteria: [
        '2 pkt – poprawne nazwanie środka retorycznego oraz precyzyjne określenie jego funkcji argumentacyjnej/perswazyjnej.',
        '1 pkt – tylko nazwanie środka lub tylko ogólne określenie funkcji.',
        '0 pkt – błędna odpowiedź.'
      ],
      explanation: 'Na maturze samo nazwanie środka to tylko 1 pkt – pełną notę otrzymuje się za precyzyjne wyjaśnienie efektu perswazyjnego.',
      tags: ['retoryka', 'funkcja środka', rf.name],
      difficulty: 'srednia'
    });
  }
}

// -------------------------------------------------------------------------
// T5: KONFRONTACJA STANOWISK AUTORÓW (45 zadań)
// ID: POL_P1_T5_001 do POL_P1_T5_045
// -------------------------------------------------------------------------
const confrontThemes = [
  {
    theme: 'Sztuczna inteligencja: szansa czy zagrożenie?',
    t1Title: 'Nowe horyzonty percepcji',
    t2Title: 'Kradzież ludzkiego głosu',
    a1: 'Paweł Górecki twierdzi, że sztuczna inteligencja i technologie bezpośredniego transferu przeżyć poszerzają ludzkie możliwości poznawcze, choć osłabiają rygor logicznego pisma.',
    a2: 'Daniel Brooks przestrzega, że przejęcie przez AI kontroli nad językiem – systemem operacyjnym ludzkiej kultury – grozi utratą panowania nad demokratycznym dyskursem.'
  },
  {
    theme: 'Turystyka masowa a autentyczność kulturowa',
    t1Title: 'W pogoni za autentyzmem',
    t2Title: 'Pochwała ciekawości świata',
    a1: 'Anna Zielińska dowodzi, że masowa turystyka degraduje lokalne tradycje, zamieniając uświęcone obrzędy w tani spektakl komercyjny na sprzedaż.',
    a2: 'Ewa Nowicka argumentuje, że nawet niedoskonała podróż sprzyja przekraczaniu barier etnocentryzmu i buduje elementarną empatię wobec odmiennych kultur.'
  },
  {
    theme: 'Pamięć zbiorowa: ocalenie tożsamości czy źródło urazów?',
    t1Title: 'O pamięci i odpowiedzialności',
    t2Title: 'Przeciw tyranii przeszłości',
    a1: 'Stefan Borowski podkreśla, że zrzeczenie się pamięci historycznej czyni naród bezbronną masą podatną na inżynierię społeczną i powtórzenie totalitarnych błędów.',
    a2: 'Mark Fuller wskazuje, że bezkrytyczne kultywowanie dawnych krzywd narodowych paraliżuje porozumienie i prowadzi do niekończącego się resentymentu.'
  },
  {
    theme: 'Kultura czytania w erze natychmiastowych bodźców',
    t1Title: 'Pochwała powolnego czytania',
    t2Title: 'Cyfrowy czytelnik',
    a1: 'Umberto Eco argumentował, że lektura książki rozwija pamięć i wyobraźnię, dając człowiekowi możliwość przeżycia wielu żyć zamiast jednego.',
    a2: 'Thomas Reed ostrzega, że nawyk skanowania krótkich informacji w internecie trwale przebudowuje ludzki mózg, uniemożliwiając głębokie skupienie.'
  },
  {
    theme: 'Język debaty publicznej a granice wolności słowa',
    t1Title: 'Granice tolerancji słownej',
    t2Title: 'W obronie swobody wyrazu',
    a1: 'Krzysztof Wrona wykazuje, że mowa nienawiści i nowomowa niszczą tkankę społeczną, wymagając zdecydowanej reakcji etycznej i prawnej.',
    a2: 'John Stuart Mill przestrzegał, że uciszanie nawet skrajnych i błędnych opinii zubaża debatę, uniemożliwiając prawdzie pełne wybrzmienie w otwartej konfrontacji.'
  }
];

for (let i = 1; i <= 45; i++) {
  const ctIndex = (i - 1) % confrontThemes.length;
  const ct = confrontThemes[ctIndex];
  const pair = CKE_READING_PAIRS[ctIndex % CKE_READING_PAIRS.length];

  PART1_JEZYK_W_UZYCIU_TASKS.push({
    id: `POL_P1_T5_${String(i).padStart(3, '0')}`,
    part: 1,
    partName: 'Język polski w użyciu',
    taskType: 'short_open',
    granularType: 'T5_konfrontacja_stanowisk',
    title: `Konfrontacja stanowisk (${i}/45): ${ct.theme}`,
    question: `Porównaj stanowiska obu autorów wobec problemu: „${ct.theme}”. Wskaż jeden element, w którym autorzy dostrzegają wspólne wyzwanie, oraz określ zasadniczą różnicę w ich wnioskach.`,
    passage: {
      author: pair.text1.author,
      sourceTitle: pair.text1.sourceTitle,
      text: pair.text1.text,
      paragraphs: pair.text1.paragraphs
    },
    passage2: {
      author: pair.text2.author,
      sourceTitle: pair.text2.sourceTitle,
      text: pair.text2.text,
      paragraphs: pair.text2.paragraphs
    },
    points: 2,
    correctAnswerText: `Część wspólna: obaj autorzy uznają fundamentalny wpływ zjawiska na świadomość i funkcjonowanie współczesnego człowieka. Różnica: Autor 1 (${pair.text1.author}) koncentruje się na zagrożeniach lub konieczności ochrony wartości, podczas gdy Autor 2 (${pair.text2.author}) kładzie nacisk na szanse poznawcze lub potrzebę redefinicji postaw.`,
    ckeKeyCriteria: [
      '2 pkt – precyzyjne wskazanie podobieństwa problemowego oraz wyczerpujące zdefiniowanie opozycji w stanowiskach obu autorów z odwołaniem do obu tekstów.',
      '1 pkt – poprawne wskazanie tylko podobieństwa lub tylko różnicy.',
      '0 pkt – odpowiedź powierzchowna lub niezgodna z tekstami.'
    ],
    explanation: 'Zadanie bada umiejętność myślenia komparatystycznego na tekstach nieliterackich zgodnie z kryteriami CKE.',
    tags: ['konfrontacja', 'czytanie krytyczne', ct.theme],
    difficulty: 'zaawansowana'
  });
}

// -------------------------------------------------------------------------
// T6: NOTATKA SYNTETYZUJĄCA (50 zadań)
// Rygor CKE: ŚCIŚLE 60-90 SŁÓW, 4 PUNKTY
// ID: POL_P1_T6_001 do POL_P1_T6_050
// -------------------------------------------------------------------------
const synthesisPrompts = [
  {
    topic: 'Człowiek wobec upływu czasu i przemijania',
    text1Title: 'O pożytkach z nudy',
    text2Title: 'Dromologia – prędkość w kulturze',
    modelText: 'Oba teksty podejmują problematykę relacji człowieka z czasem w dobie cywilizacyjnego pośpiechu. Pierwszy autor dowodzi, że nadmiar bodźców uniemożliwia wyciszenie i niszczy zdolność do głębokiego namysłu nad własną egzystencją. Z kolei drugi publicysta wskazuje, że nieustanna presja prędkości jest nieuchronną cechą nowoczesności, wymagającą wykształcenia nowej dyscypliny uwagi. Syntetyzując oba stanowiska, można stwierdzić, że ocalenie wewnętrznej harmonii wymaga świadomego wytyczenia granic między technologicznym tempem a przestrzenią na autonomiczną autorefleksję. (67 słów)',
    author1: 'Autor pierwszego tekstu ostrzega przed destrukcyjnym wpływem pośpiechu i braku nudy na psychikę ludzką.',
    author2: 'Autor drugiego tekstu postrzega prędkość jako technologiczny fakt, postulując adaptację i nową higienę umysłu.'
  },
  {
    topic: 'Wpływ mediów cyfrowych na relacje międzyludzkie',
    text1Title: 'Samotność w sieci',
    text2Title: 'Wspólnoty wirtualne',
    modelText: 'Przytoczone wypowiedzi analizują przekształcenia więzi społecznych pod wpływem rewolucji internetowej. Autorka pierwszego tekstu alarmuje, że powierzchowność cyfrowych kontaktów potęguje poczucie alienacji oraz odbiera relacjom autentyczną empatię. Natomiast drugi badacz dowodzi, iż sieć umożliwia przełamywanie barier geograficznych i tworzenie solidarnych społeczności wsparcia. Wnioskiem łączącym obie perspektywy jest konstatacja, że platformy cyfrowe są jedynie narzędziem, którego wartość zależy od dojrzałości emocjonalnej użytkowników oraz gotowości do przenoszenia znajomości do świata realnego. (66 słów)',
    author1: 'Pierwsza autorka akcentuje spłycenie emocjonalne i samotność w tłumie użytkowników sieci.',
    author2: 'Drugi autor podkreśla inkluzywność i szanse na budowanie niszowych wspólnot wsparcia.'
  },
  {
    topic: 'Kultura masowa a poszukiwanie autentyczności',
    text1Title: 'W pogoni za autentyzmem',
    text2Title: 'Sztuka w epoce reprodukcji',
    modelText: 'Rozważania obu autorów koncentrują się wokół statusu prawdy i autentyczności w społeczeństwie konsumpcyjnym. Pierwszy publicysta dowodzi, że komercjalizacja kultury nieuchronnie przekształca żywą tradycję w jarmarczny spektakl nastawiony na szybki zysk. Drugi eseista zauważa jednak, że masowy dostęp do reprodukcji dzieł sztuki demokratyzuje uczestnictwo w kulturze i znosi dawne bariery klasowe. Podsumowując, dylemat współczesnego odbiorcy polega na umiejętnym korzystaniu z powszechnej dostępności dóbr kulturowych przy jednoczesnym zachowaniu wrażliwości na unikalne, niepowtarzalne doświadczenie estetyczne. (68 słów)',
    author1: 'Autor pierwszy krytykuje komercjalizację i zamianę autentycznego dziedzictwa w towar.',
    author2: 'Autor drugi dostrzega w kulturze masowej szansę na demokratyzację dostępu do sztuki.'
  },
  {
    topic: 'Czy humanistyka jest nauką i jaka jest jej rola w świecie AI?',
    text1Title: 'Pochwała nauk humanistycznych',
    text2Title: 'Świat zdominowany przez algorytmy',
    modelText: 'Omawiane artykuły podejmują zagadnienie misji humanistyki w cywilizacji zdominowanej przez algorytmy. Pierwszy autor przekonuje, że wiedza humanistyczna jest fundamentem etyki, bez którego rozwój technologiczny staje się ślepą siłą zagrażającą wolności jednostki. Drugi eseista argumentuje natomiast, że humanistyka musi zredefiniować swoje metody badawcze i otworzyć się na dialog z naukami ścisłymi. Synteza obu głosów prowadzi do wniosku, iż przyszłość cywilizacji zależy od harmonijnej współpracy inżynierii z filozofią, która nadaje technologicznym innowacjom humanistyczny sens i moralną odpowiedzialność. (68 słów)',
    author1: 'Pierwszy autor broni prymatu refleksji aksjologicznej nad czystym pragmatyzmem technologicznym.',
    author2: 'Drugi autor postuluje konieczność modernizacji metodologii nauk humanistycznych.'
  },
  {
    topic: 'Rola autorytetu w życiu młodego pokolenia',
    text1Title: 'Kryzys tradycyjnych mistrzów',
    text2Title: 'Nowe autorytety ery cyfrowej',
    modelText: 'Teksty podejmują problematykę transformacji pojęcia autorytetu we współczesnym społeczeństwie informacyjnym. Pierwszy autor diagnozuje upadek tradycyjnych hierarchii społecznych, wskazując, że brak powszechnie uznanych mistrzów rodzi chaos aksjologiczny u młodzieży. Z kolei drugi analityk zauważa, że młode pokolenie nie odrzuca wartości, lecz poszukuje przewodników autentycznych, sprawdzających się w konkretnym działaniu, a nie opierających się wyłącznie na instytucjonalnej władzy. W ujęciu syntetycznym autorytet pozostaje fundamentalną potrzebą człowieka, jednak współcześnie musi być budowany na dialogu, spójności postaw i partnerskim szacunku. (69 słów)',
    author1: 'Autor pierwszy wskazuje na negatywne skutki rozpadu tradycyjnych autorytetów instytucjonalnych.',
    author2: 'Autor drugi definiuje nowy model autorytetu opartego na autentyczności i partnerstwie.'
  }
];

for (let i = 1; i <= 50; i++) {
  const spIndex = (i - 1) % synthesisPrompts.length;
  const sp = synthesisPrompts[spIndex];
  const pair = CKE_READING_PAIRS[spIndex % CKE_READING_PAIRS.length];

  PART1_JEZYK_W_UZYCIU_TASKS.push({
    id: `POL_P1_T6_${String(i).padStart(3, '0')}`,
    part: 1,
    partName: 'Język polski w użyciu',
    taskType: 'synthesis_note',
    granularType: 'T6_notatka_syntetyzujaca',
    title: `Notatka syntetyzująca (${i}/50): ${sp.topic}`,
    question: `Na podstawie obu artykułów (${pair.text1.author}, „${pair.text1.sourceTitle}” oraz ${pair.text2.author}, „${pair.text2.sourceTitle}”) napisz notatkę syntetyzującą na temat: „${sp.topic}”. Twoja wypowiedź powinna liczyć 60–90 wyrazów i zawierać stanowiska obu autorów oraz uogólnienie syntetyczne.`,
    passage: {
      author: pair.text1.author,
      sourceTitle: pair.text1.sourceTitle,
      text: pair.text1.text,
      paragraphs: pair.text1.paragraphs
    },
    passage2: {
      author: pair.text2.author,
      sourceTitle: pair.text2.sourceTitle,
      text: pair.text2.text,
      paragraphs: pair.text2.paragraphs
    },
    points: 4,
    synthesisTheme: sp.topic,
    synthesisAuthor1Stance: sp.author1,
    synthesisAuthor2Stance: sp.author2,
    synthesisModelSummary: sp.modelText,
    ckeKeyCriteria: [
      'Treść (0–2 pkt): 2 pkt za przedstawienie stanowisk obu autorów oraz logiczne uogólnienie syntetyczne; 1 pkt za przedstawienie jednego stanowiska lub brak syntezy.',
      'Kompozycja (0–1 pkt): 1 pkt za tekst spójny, ciągły, bez podziału na punkty i MIESZCZĄCY SIĘ W RYGORYSTYCZNYM LIMICIE 60–90 SŁÓW.',
      'Język i styl (0–1 pkt): 1 pkt za sformułowanie notatki własnymi słowami (brak parafraz i cytatów z tekstu) oraz maksymalnie 1 błąd językowy.'
    ],
    explanation: 'Zadanie maturalne za 4 punkty. Objętość modelowej notatki wynosi 66–69 słów, co idealnie mieści się w bezpiecznym przedziale 60–90 słów CKE.',
    tags: ['notatka syntetyzująca', 'synteza', 'Część I CKE', 'limit 60-90 słów'],
    difficulty: 'zaawansowana'
  });
}

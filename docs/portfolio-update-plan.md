# Plan pełnej modernizacji portfolio

Data przeglądu: 2026-11-02. Status: plan do realizacji.

Cel: portfolio, które szybko pokazuje zakres pracy Michała, dokumentuje realne realizacje i ułatwia kontakt rekruterowi lub klientowi. Modernizacja obejmuje treść, interfejs, dostępność, kod, SEO, wydajność i proces publikacji.

Przegląd obejmuje lokalny kod, zasoby, konfigurację CI, build, lint oraz zapisany podgląd Home z README. Zapisany obraz nie jest weryfikacją aktualnego wyglądu. Nie wykonano aktualnych testów w przeglądarce, Lighthouse, pomiarów Core Web Vitals ani audytu bezpieczeństwa zależności. Ryzyka wizualne wymagają potwierdzenia podczas wdrażania.

**Stan wyjściowy**

- Build przechodzi: TypeScript i Vite.
- Lint nie przechodzi: 5 błędów `no-explicit-any` w HomeProjects, ProjectsList, ImageModal, Home i Projects.
- Główny plik JS ma około 394 kB, 130 kB gzip. To punkt odniesienia, nie dowód problemów z szybkością.
- `Background.png`, używany w sekcji About, ma około 2,16 MB. Zdjęcie About i grafika hero mają po około 280–292 kB.
- Home ma już cztery wybrane projekty: Moje Atelier, Wióry Lecą!, Formularz Zjazd SLO, ImageInary.
- Projekt ma polskie i angielskie treści, ale nie wszystkie elementy są tłumaczone.
- Istniejące niezacommitowane zmiany dotyczą dodania Moje Atelier i wyboru projektów Home.

**1. Fundament techniczny — P0, mały zakres**

- [x] Wprowadzić wspólny typ `Project` oraz `Project | null` dla aktywnego projektu; usunąć wszystkie pięć `any`.
- [x] Uporządkować dane: stabilny identyfikator, slug, technologie, status, widoczność repozytorium, linki, grafiki i kolejność wyróżnienia. Status realizacji i dostępność kodu są osobnymi informacjami.
- [x] Ustalić jedno źródło informacji o technologiach i ikonach; zapewnić tekstowy fallback. `CSS Animations` nie ma obecnie mapowania ikony i stanie się problemem przy wyróżnieniu Flipping Card.
- [x] Dodać kontrolę danych: unikalność identyfikatorów i slugów, kompletność PL/EN, istnienie plików obrazów, poprawna kolejność czterech projektów Home.
- [x] Poprawić `imageLarge` Filmovie: istnieje duży obraz, ale konfiguracja wskazuje miniaturę.
- [x] Dodać stronę 404 oraz przyjazny widok błędu renderowania.
- [x] Ujednolicić konfigurację profilu, linków kontaktowych i ścieżek zasobów.

Odbiór: build i lint bez błędów, brak `any` w modelu projektów, kontrola danych wykrywa brak tłumaczenia lub pliku, nieznana trasa wyświetla 404.

**2. Dostępność i zachowanie interfejsu — P0, średni zakres**

- [x] Zastąpić klikalne miniatury `<img onClick>` semantycznymi przyciskami z nazwą wskazującą projekt.
- [x] Przebudować ImageModal: semantyka dialogu, dostępna nazwa, widoczny przycisk zamknięcia, ustawienie fokusu, zatrzymanie Tab w dialogu, Escape i przywrócenie fokusu na przycisk otwierający. Rozważyć natywny `<dialog>`.
- [x] Dopasować duży obraz do szerokości i wysokości ekranu; zapewnić dostęp do zamknięcia również w orientacji poziomej telefonu.
- [x] Uporządkować blokowanie przewijania: przywracać poprzednią wartość, unikać konfliktów między intro a modalem.
- [x] Dodać nazwy do przycisków zmiany języka i ikonowych linków live; oznaczyć dekoracyjne SVG i tła jako dekoracyjne.
- [x] Uzupełnić teksty alternatywne, w tym obraz nagłówka; zastąpić ogólne „Hero image” i „Photo of me” opisem albo pustym alt dla dekoracji.
- [x] Dodać link „Przejdź do treści”, logiczną strukturę nagłówków i H1 dla Projects, About oraz Contact.
- [x] Zapewnić widoczny fokus linków i przycisków, czytelny kontrast, wygodne cele dotykowe oraz obsługę bez hover.
- [x] Zastąpić tooltipy technologii dostępne wyłącznie po najechaniu czytelnymi etykietami lub obsługą fokusu i dotyku.
- [x] Dodać obsługę `prefers-reduced-motion` dla intro, przewijania, kursora i animacji tła.
- [x] Zachować oryginalne intro „Hello, World!” z GSAP zgodnie z decyzją użytkownika. Zapewnić pominięcie przy ograniczonym ruchu oraz przywrócenie przewijania i fokusu po zakończeniu. Intro można pominąć przyciskiem lub Escape; nie odtwarza się ponownie przy zmianie podstrony.
- [ ] Zweryfikować nagłówek przy przewijaniu, zmianie trasy i nawigacji klawiaturą; fokus nie może znikać poza ekranem.

Odbiór: wszystkie istotne działania dostępne klawiaturą; modal poprawnie zarządza fokusem; wersja z ograniczonym ruchem nie blokuje treści; test przy powiększeniu 200%.

Stan wdrożenia: funkcje punktu 2 zostały zaimplementowane. Build, lint i 32 testy przechodzą; testy obejmują intro GSAP, obsługę modala, przywracanie fokusu i przewijania, nawigację, preferencje ruchu oraz axe dla podstron PL/EN. Kontrast tekstu przycisków dla użytych kolorów wynosi 8,09:1, a po najechaniu 5,87:1. To obliczenia palety, nie pełny audyt renderowanej strony.

Otwarta kontrola ręczna: powiększenie 200%, telefon w orientacji poziomej, widoczność fokusu przy przewijaniu oraz natywna blokada tła dialogu. Host dostępu do przeglądarki jest niedostępny. jsdom używa zastępczych metod dialogu i nie weryfikuje układu ani kontrastu obrazu strony; dlatego końcowego sprawdzenia nagłówka nie oznaczono jako ukończonego.

Zachowanie nagłówka jest celowe i ma zostać zachowane: po przewinięciu 80 px chowa się krzywa, a na mobile również wiersz logo; przy ostatnich 120 px strony nagłówek odsłania się. Fokus wewnątrz nagłówka natychmiast go odsłania. Test regresji obejmuje przewijanie, dół strony, krótką stronę oraz wejście i wyjście fokusu.


**3. Nowy układ i spójny wygląd — P1, średni/duży zakres**

- [x] Zachować ciemny motyw i niebieski akcent, uporządkować skalę typografii, odstępy, szerokości treści, obramowania i stany interakcji.
- [x] Zmienić kolejność Home: hero → cztery projekty → kompetencje poparte realizacjami → krótko o mnie → kontakt.
- [x] Przebudować hero wokół konkretnej specjalizacji i dwóch akcji: „Zobacz projekty” oraz „Porozmawiajmy”. Pokazać imię i nazwisko obok roli.
- [x] Przykładowy kierunek tekstu: „Tworzę strony dla firm i aplikacje, które upraszczają codzienną pracę”. Doprecyzować w podtytule React, TypeScript, integracje API i bazy danych.
- [x] Przygotować spójną siatkę projektów: 2 × 2 na szerokim ekranie, jedna kolumna na małym; wysokość kart wynika z treści.
- [x] Usunąć sztywną wysokość 474 px kart Home. Dłuższe tłumaczenia, statusy i etykiety technologii nie mogą ściskać treści ani wypychać linków.
- [x] Ujednolicić proporcje miniatur i sposób kadrowania przez `aspect-ratio` oraz świadomie dobrane `object-fit`.
- [ ] Zastąpić obecną grafikę społecznościową Moje Atelier rzeczywistym zrzutem interfejsu, kiedy dostępny będzie podgląd przeglądarki. Przygotować osobny duży podgląd.
- [x] Zastąpić wyjustowane opisy wyrównaniem do lewej i ograniczyć długość wiersza.
- [x] Usunąć efekt niemal całkowitego znikania grafiki hero po hover (`opacity: 0.1`).
- [ ] Ograniczyć dekoracyjne fale, rozmycia i ruch tam, gdzie odciągają uwagę od projektów; ocenić efekt na realnych ekranach.
- [x] Logo/nazwisko w nagłówku powinno prowadzić na Home. GitHub pozostaje osobnym, jednoznacznym linkiem.
- [x] Pokazać przełącznik języka jako PL/EN z nazwą dostępną dla czytnika ekranu.

Odbiór: PL i EN przy szerokościach 320, 375, 768, 1024 i 1440 px, bez obciętego tekstu i poziomego przewijania; czytelne miniatury i spójne odstępy.

Stan wdrożenia (2026-11-03): nowy Home, teksty PL/EN, karty 2 × 2 od 768 px, wspólne tokeny wizualne i nawigacja zostały zaimplementowane. Style Home wraz z breakpointem są w jednym pliku, bez dawnych nakładających się reguł desktop/tablet/mobile. Miniatury Home i Projects mają proporcje 16:9 oraz kadrowanie od góry; pełny obraz pozostaje dostępny w dialogu. Karty Home mają tekstowe akcje, a prywatny kod jest oznaczony jako stan zamiast linku. Kompetencje pokazują trzy zastosowania i prowadzą do istniejących realizacji. Intro GSAP oraz mechanizm chowania nagłówka pozostają zachowane.

Na Home usunięto pływające kolorowe dekoracje, zostawiając delikatne statyczne tło hero. Ocena efektu na realnych ekranach nadal jest otwarta. Build, lint i 34 testy przechodzą; dodatkowe testy obejmują akcje Home, powrót przez logo oraz stan przełącznika języka. Dostęp do hosta przeglądarki nadal jest niedostępny. Nie oznaczono odbioru wizualnego jako zakończonego: do sprawdzenia pozostają wymienione szerokości w PL/EN, zoom 200% i kadrowanie miniatur. Rzeczywisty zrzut Moje Atelier oraz osobny duży podgląd pozostają do przygotowania po uzyskaniu dostępu do przeglądarki.

**4. Treść i prezentacja doświadczenia — P1, duży zakres**

- [ ] Każda karta Home: odbiorca/problemy, główna funkcja, 3–5 najważniejszych technologii, stan projektu i czytelne akcje.
- [ ] Przygotować osobne opisy realizacji dla czterech wyróżnionych projektów: kontekst → zakres mojej pracy → kluczowe decyzje → funkcje → rezultat → ograniczenia.
- [ ] Dla Moje Atelier jasno rozdzielić ukończone funkcjonalności od oczekiwania na materiały klienta i statusu wersji demonstracyjnej.
- [ ] Dla Wióry Lecą! pokazać pracę dla firmy i sposób przedstawienia oferty; dla Zjazdu SLO przepływ zgłoszeń i danych; dla ImageInary wyszukiwanie, API i obsługę stanów interfejsu.
- [ ] Udokumentować udział autora i technologie na podstawie kodu, repozytoriów i informacji użytkownika. Nie dopisywać metryk biznesowych, opinii ani wyników bez potwierdzenia.
- [ ] W opisie projektu dołączyć faktyczne widoki desktop/mobile i wyjaśnić wybraną trudność techniczną.
- [ ] Rozróżnić realizacje komercyjne, narzędzia użytkowe i projekty edukacyjne; przy tej liczbie pozycji wystarczą etykiety lub sekcje.
- [ ] Prywatne repozytorium pokazać jako czytelny stan. Publiczny odwiedzający powinien otrzymać opis realizacji zamiast przycisku obiecującego dostęp do kodu.
- [ ] Przepisać About: specjalizacja, sposób pracy, odpowiedzialność za wdrożenie i konkretne przykłady z projektów.
- [ ] Kompetencje pogrupować na frontend, backend/dane i narzędzia; powiązać je z projektami, bez procentowych pasków umiejętności.
- [ ] Uprościć kontakt: widoczny email, kopiowanie z potwierdzeniem dostępnym dla czytnika, LinkedIn i GitHub; CV dopiero po wskazaniu aktualnego pliku.
- [ ] Dodać końcową sekcję zachęcającą do kontaktu na Home i stronach realizacji.

Odbiór: odwiedzający widzi, co autor wykonał i dla kogo; każda istotna deklaracja ma pokrycie w projekcie; pełna spójność treści PL/EN.

**5. SEO, adresy i języki — P1, średni/duży zakres**

- [ ] Dodać unikalne tytuły i opisy, canonical, Open Graph, metadane kart społecznościowych oraz grafikę udostępniania.
- [ ] Poprawić typ MIME favicon: obecnie plik PNG jest oznaczony jako SVG.
- [ ] Synchronizować `html.lang` z aktywnym językiem; obecnie dokument pozostaje `en` również dla polskich treści.
- [ ] Używać rozpoznanego języka PL/EN przy sterowaniu przełącznikiem, sprawdzić zachowanie dla `pl-PL` i `en-US`; przetłumaczyć stopkę, teksty pomocnicze, komunikaty oraz nazwy dostępnościowe.
- [ ] Zaplanować stabilne adresy wersji językowych, np. `/pl/` i `/en/`, oraz odnośniki `hreflang` dla odpowiadających sobie stron.
- [ ] Zastąpić adresy `#/projects` adresami ścieżkowymi razem z generowaniem HTML dla tras. Zachować React/TypeScript; dobrać sposób prerenderowania do hostingu.
- [ ] Na GitHub Pages wygenerować pliki HTML dla tras i stronę 404. Samo przełączenie na BrowserRouter nie wystarczy do poprawnego odświeżania podstron.
- [ ] Przygotować obsługę dotychczasowych linków hash, aby zapisane linki do portfolio nadal prowadziły do właściwej treści.
- [ ] Generować sitemap i robots.txt z konfiguracji publicznej domeny; oznaczyć środowiska podglądu tak, aby nie konkurowały z wersją główną.
- [ ] Dodać zgodne z treścią dane strukturalne osoby, strony i projektów; nie obiecywać rozszerzonych wyników wyszukiwania.
- [ ] Sprawdzić wygenerowany HTML i odpowiedzi HTTP, nie tylko stan DOM po uruchomieniu Reacta.

Google zaleca adresy obsługiwane przez History API zamiast fragmentów do reprezentowania odrębnej treści oraz opisuje korzyści prerenderowania: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

Odbiór: bezpośrednie wejścia i odświeżenia działają, treść oraz metadane są obecne w HTML, link udostępniony poza przeglądarką ma właściwy podgląd, nieistniejący adres daje poprawny status 404.

**6. Wydajność i porządek w kodzie — P1/P2, średni zakres**

- [ ] Zmierzyć punkt wyjściowy na buildzie produkcyjnym: Home, Projects i About, desktop oraz mobile. Oddzielać wyniki laboratoryjne od danych rzeczywistych użytkowników.
- [ ] Zoptymalizować używane tło About oraz obrazy hero/profilu; przygotować właściwe rozmiary WebP/AVIF i porównać jakość.
- [ ] Dodać wymiary obrazów, `srcset`/`sizes` tam, gdzie potrzebne, oraz lazy loading dla grafik poza pierwszym ekranem.
- [ ] Zmierzyć koszt animacji intro; zachować GSAP i samo intro zgodnie z decyzją użytkownika.
- [ ] Ograniczyć aktualizacje położenia światła kursora do klatek animacji; uruchamiać efekt tylko dla właściwego wskaźnika i preferencji ruchu. Zmierzyć wpływ przed dalszymi optymalizacjami.
- [ ] Przejrzeć koszt filtrów blur, animowanych teł i stałego `will-change` na urządzeniach mobilnych.
- [ ] Wydzielić wspólne elementy ProjectCard, ProjectLinks, TechList i ProjectStatus, zachowując różne układy Home i pełnej listy.
- [ ] Uporządkować SCSS według komponentów, ze wspólnymi tokenami i breakpointami; usunąć martwe komentarze i nieprawidłowe reguły, np. `background-color: none`.
- [ ] Unikać globalnych reguł odstępów sekcji powodujących kumulowanie paddingów w zagnieżdżonych sekcjach.
- [ ] Podział JS na części wprowadzić tylko tam, gdzie pomiary pokażą korzyść; przy tej skali nie dodawać globalnego managera stanu bez potrzeby.

Odbiór: udokumentowane porównanie rozmiarów i pomiarów przed/po, brak pogorszenia jakości grafik i stabilności układu.

**7. Kontrola jakości i publikacja — P0/P1, średni zakres**

- [ ] Ujednolicić wspieraną wersję Node lokalnie i w CI; rekomendowany punkt startowy to Node 24 LTS. Workflow używa obecnie Node 20, który jest EOL według [harmonogramu Node.js](https://nodejs.org/en/about/previous-releases).
- [ ] Instalować zależności z lockfile przez `npm ci`; sprawdzić aktualizacje i podatności, oceniając oddzielnie kod produkcyjny i narzędzia deweloperskie.
- [ ] Uruchamiać walidację PR: lint, kontrola danych, build i istotne testy zachowania. Publikować dopiero po powodzeniu kontroli.
- [ ] Doprecyzować uprawnienia workflow i obsługę równoległych wdrożeń; ujednolicić sposób publikacji zamiast utrzymywać rozbieżne ścieżki.
- [ ] Testować kluczowe scenariusze: zmiana języka i jej zapamiętanie, cztery projekty w kolejności, modal i fokus, nawigacja/404, dostępność kontaktu, ograniczony ruch.
- [ ] Uruchomić automatyczną kontrolę dostępności i uzupełnić ją ręcznym przejściem klawiaturą oraz kontrolą mobilną.
- [ ] Sprawdzić publiczne linki demo i kontaktowe; prywatnego GitHuba nie traktować jako zepsutego publicznego repozytorium.
- [ ] Zaktualizować README, zrzuty, opis dodawania projektów, konfigurację środowiska i procedurę wycofania wdrożenia.

Wzorzec zachowania modala: [WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**Kolejność realizacji**

1. Typowanie, dane, lint i podstawowe CI.
2. Modal, klawiatura, języki i ograniczenie ruchu przy zachowaniu intro.
3. Model treści, opisy realizacji oraz decyzja o adresach/prerenderowaniu.
4. Nowy Home i karty projektów; następnie Projects, About i Contact.
5. Podstrony realizacji, SEO i migracja adresów razem z konfiguracją publikacji.
6. Optymalizacja zasobów i efektów na podstawie pomiarów.
7. Testy całości PL/EN, aktualizacja dokumentacji i kontrolowane wdrożenie.

Każdy etap powinien stanowić małą, możliwą do sprawdzenia zmianę. Pełny update jest ukończony po sprawdzeniu treści, działania, mobilnego układu i opublikowanej wersji; sam poprawny build nie wystarcza.

# SEO, języki i publikacja

Wdrożenie lokalne: 2026-11-04. Publikacja na hostingu nie była częścią tej zmiany.

## Adresy i języki

- `/pl/` i `/en/` — Home.
- `/<język>/projects/`, `/<język>/about/`, `/<język>/contact/` — podstrony.
- `/<język>/projects/<slug>/` — cztery opisy realizacji.
- Adresy kończą się `/`; każdy odpowiada plikowi `index.html` w osobnym katalogu.
- Język w adresie ma pierwszeństwo przed zapisaną preferencją. PL/EN to zwykłe linki, działające także bez JavaScriptu. Przy zmianie języka zachowują podstronę, parametry i fragment.
- Tylko wejście na adres bez języka korzysta z `i18nextLng` w localStorage, następnie języka przeglądarki, a domyślnie z polskiego. `pl-PL` i `en-US` są normalizowane. Brak dostępu do localStorage nie blokuje strony.
- `/` zawiera pełne polskie HTML i canonical do `/pl/`. Po uruchomieniu JS kieruje do odpowiedniego języka. Bez JS strona pozostaje czytelna i udostępnia linki PL/EN.

Stare adresy `/#/projects`, `/#/about`, `/#/contact` i `/#/projects/<slug>` są przekształcane przed uruchomieniem Reacta przez `location.replace`. Fragment nie dociera do serwera, więc migracja działa po stronie klienta, a nie jako HTTP 301. Nieznany slug trafia na brakującą ścieżkę z HTTP 404. Zewnętrzne cele typu `#//inna-domena` są odrzucane.

## Budowanie i konfiguracja

Wymagany Node 24. Instalacja z lockfile: `npm ci`.

```sh
npm run lint
npm test
npm run build
npm run test:seo
npm run preview
```

`scripts/build.mjs` buduje aplikację przeglądarkową, następnie osobny moduł SSR w ignorowanym `dist-ssr/`. React generuje HTML tych samych komponentów, które są hydratowane w przeglądarce. Do publikacji służy wyłącznie `dist/`.

Domyślna domena w `src/config/site.ts` to `https://mikeldev.online`. Zmienna `VITE_SITE_URL` może wskazać inny origin HTTPS, bez ścieżki, query i fragmentu. Ta sama wartość zasila canonical, hreflang, JSON-LD, obraz społecznościowy, sitemapę i generowany CNAME. Konfiguracja zakłada własną domenę z `base: "/"`; hosting w podkatalogu repozytorium wymaga osobnego dostosowania.

Tryb podglądu:

```sh
npm run build:preview
npm run test:seo
npm run preview
```

`build:preview` generuje wszędzie `noindex, follow`, bez canonical, hreflang, JSON-LD, sitemapy i CNAME. `robots.txt` pozwala pobrać dokumenty, aby robot mógł zobaczyć `noindex`. Tak samo można wyłączyć indeksowanie przez `VITE_INDEXABLE=false`. Nie należy publikować zwykłego buildu produkcyjnego na zewnętrznej domenie testowej. Po testach podglądu ponownie wykonaj `npm run build` przed publikacją produkcji.

## Metadane i treść początkowa

Każda znana strona ma osobny tytuł i opis w obu językach. Produkcja zawiera canonical, wzajemne hreflang PL/EN oraz x-default wskazujący polski odpowiednik, Open Graph, Twitter Cards i JSON-LD osoby, witryny oraz realizacji. Nie ma zmyślonych ocen, dat realizacji czy wyników biznesowych. Przy nawigacji React aktualizuje ten sam zestaw metadanych bez duplikowania tagów.

Grafika udostępniania: `public/images/social-preview.png` (1200 × 630), z wektorowym projektem `social-preview.svg`. Po zmianie grafiki należy zaktualizować PNG i sprawdzić podgląd. Favicon ma poprawny typ PNG i ścieżkę absolutną.

W HTML wygenerowanym na serwerze nie ma blokującego intro ani `inert`. Po hydratacji odtwarzane jest dotychczasowe intro GSAP; przy ograniczonym ruchu jest pomijane. Treść i linki pozostają dostępne bez JavaScriptu. Test hydratacji sprawdza zachowanie węzła H1 i brak błędów niedopasowania dla wszystkich stron PL/EN.

## GitHub Pages i HTTP

Workflow zachowuje publikację na gałąź `gh-pages`. Ustawienie Pages w GitHub powinno nadal wskazywać tę gałąź i jej katalog główny. CNAME pochodzi z buildu; nie trzeba nadpisywać go parametrem akcji. `dist/.nojekyll` wyłącza przetwarzanie Jekyll. Workflow używa Node 24, instaluje przez `npm ci` i publikuje dopiero po lint, testach interfejsu, buildzie i testach SEO/HTTP.

Ręczne `npm run deploy` uruchamia te same kontrole przez `predeploy`, a następnie publikuje z opcją `--nojekyll`. Samo `npm run build` ani `npm run preview` niczego nie publikuje.

Nie dodawaj reguły przekierowującej wszystkie żądania do `/index.html`: zmieniłaby brakujące adresy w odpowiedzi 200. Znane ścieżki mają własne pliki. GitHub Pages używa jednego głównego `404.html`, z polską treścią początkową; React dopasowuje język do brakującego adresu `/en/...`. Dodatkowe lokalne pliki `pl/404.html` i `en/404.html` są nieindeksowane, ale nie zastępują globalnego mechanizmu hostingu.

Serwer `npm run preview` służy wyłącznie do lokalnego sprawdzania statycznego buildu. Zwraca 200 dla istniejących dokumentów, 404 dla brakujących i 308 przy dodaniu końcowego ukośnika lub usunięciu `index.html` z adresu. Właściwy hosting może używać innego kodu przekierowania; ustawień GitHub Pages nie można zastąpić kodem tego serwera.

## Odbiór po publikacji

Lokalnie sprawdzono 16 adresów, kompletność treści i assetów, metadane, hreflang, sitemapę, odpowiedzi HTTP, migrację linków hash, historię języka i hydratację. Tryby produkcyjny i preview mają osobne przebiegi testów. To nie jest pomiar indeksacji ani sprawdzenie publicznego wdrożenia.

Po opublikowaniu sprawdź bezpośrednie wejście i odświeżenie np. `/en/projects/moje-atelier/`, nieistniejący URL (HTTP 404), stare `/#/projects`, obraz udostępniania, publiczny `sitemap.xml` oraz źródło HTML bez uruchamiania JS. Kontrola wizualna na telefonie i w docelowej przeglądarce nadal pozostaje do wykonania.

## Wycofanie

W razie problemów wycofaj commit migracji w gałęzi źródłowej i pozwól workflow odbudować oraz opublikować poprzednią wersję. Nie usuwaj CNAME ani ustawienia własnej domeny. Po wycofaniu do HashRouter nowe adresy językowe nie będą miały własnych plików — trzeba to uwzględnić, jeżeli zdążyły zostać udostępnione. Przy wycofaniu wyłącznie treści lub stylów zachowaj nowe pliki tras i mechanizm migracji.

## Dokumentacja wykorzystana przy wdrożeniu

- [Vite: SSR i prerenderowanie](https://vite.dev/guide/ssr.html)
- [React: hydrateRoot i zgodność HTML](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: wersje językowe i hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [GitHub Pages: własna strona 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)

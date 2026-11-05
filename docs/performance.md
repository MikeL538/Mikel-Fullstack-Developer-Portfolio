# Punkt 6: zasoby i kod — 2026-11-05

## Zakres pomiaru

Porównanie dotyczy lokalnego buildu produkcyjnego przed i po punkcie 6.
Inwentaryzacje HTML, JS, CSS i obrazów są w
[`measurements/stage-6-before.json`](measurements/stage-6-before.json) oraz
[`measurements/stage-6-after.json`](measurements/stage-6-after.json).
To rozmiary plików, a nie transfer zmierzony w przeglądarce. `gzipBytes` to lokalna
kompresja gzip; rzeczywisty hosting może używać innych ustawień lub Brotli.
Przeglądarka dobiera wariant z `srcset` według ekranu, DPR i własnej polityki.
Lazy loading zmienia moment pobierania, nie rozmiar pliku.

Nie uzyskano pomiarów LCP, CLS, TBT, FPS ani danych rzeczywistych użytkowników.
Host przeglądarki jest niedostępny. Próba kontroli w otwartym Firefoksie zakończyła
się blokadą narzędzia: brak obsługi kontroli dozwolonych adresów dla tej
przeglądarki Windows. Nie obchodzono tej blokady innym kanałem automatyzacji.

## Obrazy

KB oznacza 1000 bajtów. Porównanie największego zoptymalizowanego wariantu
z dotychczasowym zasobem:

| Obraz | Przed | Po | Zmniejszenie |
| --- | ---: | ---: | ---: |
| Tło About, 1536 × 1024 | 2163,0 KB | 146,5 KB | 93,2% |
| Hero, 626 × 407 | 281,6 KB | 44,9 KB | 84,1% |
| Portret, 512 × 512 | 291,8 KB | 34,7 KB | 88,1% |
| Avatar nagłówka, 107 × 107 | 14,9 KB | 4,0 KB | 73,2% |

Mniejsze warianty: tło 768 px / 32,3 KB, hero 320 px / 17,4 KB, portret
256 px / 11,7 KB. Miniatury projektów mają warianty 480 i do 960 px.
Jeżeli ponowna kompresja istniejącego WebP dałaby większy plik, zachowywany jest
oryginał jako większy kandydat. Nie powiększamy obrazów ponad źródłową rozdzielczość.
Wybrano WebP; dodatkowy zestaw AVIF nie jest obecnie potrzebny.

`ResponsiveImage` zapewnia wymiary i warianty ze wspólnego manifestu. Naprawiono
też niezgodne ze źródłem wymiary hero (wcześniej 622 × 403). Hero i portret About
mają wysoki priorytet pobierania; pierwszy projekt na Projects ładuje się bez
`lazy`. Pozostałe karty i portret na Home są ładowane leniwie. Modal wczytuje
oryginał dopiero po otwarciu. Wymiary obrazów wraz z CSS `height: auto` pozwalają
rezerwować proporcje; nie jest to potwierdzenie wyniku CLS.

Obejrzano oryginały i pełnowymiarowe WebP tła, hero i portretu oraz kartę Moje
Atelier. Kompresja jest stratna, z jakością 88; przezroczystość została zachowana.
Kontrola kart w docelowym układzie desktop/mobile pozostaje otwarta.

Źródła nadal znajdują się w `public/images`, więc katalog publikacji zawiera też
oryginały. Korzyść dotyczy zasobów wskazywanych przez stronę, nie rozmiaru całego
repozytorium ani archiwum wdrożenia.

## Efekty i kod

- Intro GSAP, jego kolejność, pomijanie i obsługa ograniczonego ruchu pozostają.
  Analiza bundlera wykazała 235 704 bajty modułów GSAP po tree shaking, przed
  końcową minifikacją; to nie rozmiar transferu ani koszt procesora.
  Deklarowana oś czasu dla 18 znaków trwa 2,25 s. Wynik zapisano w
  [`stage-6-animation.json`](measurements/stage-6-animation.json).
- Światło kursora miało już `requestAnimationFrame`, obsługę preferencji ruchu
  i warunek precyzyjnego wskaźnika. Test potwierdza jedną zaplanowaną klatkę dla
  serii 50 zdarzeń, użycie ostatniej pozycji i zatrzymanie po zmianie preferencji.
  Nie zmieniano gradientu bez pomiaru kosztu malowania.
- Sześć animowanych świateł na Projects nadal ma blur i `will-change`.
  Intro ma `will-change` tylko w czasie obecności nakładki. Nie wprowadzano zmian
  animacji ani podziału JS bez pomiarów wskazujących korzyść.
- `ProjectCard` i `TechList` współdzielą zachowanie kart, zachowując różne układy
  Home/Projects. Wykorzystują istniejące `ProjectLinks` i `ProjectMeta` ze statusem.
- Style przeniesiono do `src/styles/components/`; reguły desktop/tablet/mobile
  są razem przy komponencie, a breakpointy w `_variables.scss`. Usunięto stare
  zakomentowane warianty. Globalny padding sekcji ograniczono do stron będących
  bezpośrednimi dziećmi main, bez zwiększania specyficzności selektora.
- Manifest i komponent obrazów nieco zwiększają JS. Nie deklarujemy redukcji
  bundla; konkretna oszczędność pochodzi z obrazów. Nie dodano zależności runtime.

Końcowy JS: 422 471 → 427 752 bajty (gzip 139 342 → 141 473, wzrost o 2,1 KB).
CSS: 23 251 → 23 383 bajty (gzip 5607 → 5645). Suma plików z atrybutów `img.src`
na Home spadła z 807 391 do 260 712 bajtów (67,7%). To porównanie wskazanych
plików, bez CSS/JS, cache, wyboru `srcset` i momentu pobrania obrazów — nie wynik
pomiaru transferu na konkretnym urządzeniu.

## Odtwarzanie i utrzymanie

```sh
npm run images:generate
npm run lint
npm test
npm run build
npm run test:seo
node scripts/measure-assets.mjs docs/measurements/stage-6-after.json
```

Generowanie wymaga Python + Pillow z obsługą WebP (użyto Pillow 11.3.0).
Zwykły build nie uruchamia Pythona. Po dodaniu/zmianie obrazu trzeba wygenerować
i zapisać warianty oraz manifest. Walidacja kontroluje hash źródła, istnienie
plików, rzeczywiste wymiary, kolejność wariantów i brak powiększania.
Oryginały nie są nadpisywane. Po usunięciu źródła stare, nieużywane warianty
można usunąć z `public/images/optimized/` po sprawdzeniu referencji.

Kontrole obejmują 55 testów danych/interfejsu i 4 testy SEO/HTTP. Te ostatnie
sprawdzają obrazy oraz kandydatów `srcset` we wszystkich 16 dokumentach HTML.
Testy jsdom nie mierzą układu ani wydajności renderowania.

## Pozostały odbiór w przeglądarce

Na tej samej maszynie i w tej samej wersji przeglądarki wykonać po trzy pomiary
Home, Projects i About w profilach desktop/mobile, na buildzie produkcyjnym,
z zimnym cache. Zapisać medianę i ustawienia CPU/sieci. Porównać LCP, CLS, TBT,
pobrane zasoby i klatki przy przewijaniu. Oddzielnie obejrzeć pełne intro,
pominięcie i ograniczony ruch, pracę kursora i animowane tło Projects.
Przed porównaniem trzeba odtworzyć build sprzed punktu 6 — sam raport rozmiarów
nie zawiera bazowych pomiarów czasu. Nie zmieniać intro ani nagłówka w imię wyniku.

Wskazówki: [obrazy i wymiary w HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img),
[koszt stałego will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change),
[zmienność wyników Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

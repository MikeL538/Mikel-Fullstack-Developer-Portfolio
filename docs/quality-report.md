# Punkt 7 — kontrola jakości, 2026-11-05

Zmiany są przygotowane lokalnie. Nie wykonano pushu, uruchomienia workflow na
GitHub ani publikacji. Nie oznaczamy całego update'u jako odebranego: kontrola
wizualna, nowe zrzuty i sprawdzenie opublikowanej wersji pozostają otwarte.

## CI i publikacja

- Node 24 z `.nvmrc`, zakres `>=24 <25` w `engines`, `engine-strict` w `.npmrc`.
- `npm ci` z lockfile; czysta instalacja 224 pakietów zweryfikowana lokalnie w
  izolowanym katalogu `.verification-ci/`. Lokalny Node: 24.13.0, npm: 11.6.2.
- PR do `main`, push na `main` i `workflow_dispatch` uruchamiają walidację.
- Osobne audyty runtime i całego drzewa, następnie `check:preview` i `check`.
- Lint obejmuje także skrypty `.mjs`, testy i konfigurację; ostrzeżenia blokują check.
- Build jest zapisywany jako artefakt i publikowany bez ponownego budowania.
  Prawo zapisu ma tylko job publikacji, wyłącznie na `main` i poza PR-em.
- Automatyczne oraz ręczne publikacje korzystają z tego samego workflow.
  Usunięto drugą ścieżkę przez lokalny pakiet `gh-pages`.
- Akcje są przypięte do sprawdzonych SHA wydań. Dependabot sprawdza npm i akcje
  co tydzień. PR-y z aktualizacjami nadal wymagają normalnego przeglądu.

Sprawdzono lokalnie składnię YAML i strukturę workflow. To nie zastępuje pierwszego
przebiegu na GitHub. Reguły ochrony gałęzi, wymagany check `Validate portfolio`
i ustawienia Pages nie były zmieniane przez API. Instrukcje publikacji i wycofania:
[seo-deployment.md](seo-deployment.md).

## Zależności

| Zakres npm audit | Przed | Po |
| --- | ---: | ---: |
| Zależności produkcyjne | 2 high | 0 zgłoszeń |
| Całe drzewo | 23: 13 high, 9 moderate, 1 low | 10 moderate, 0 high/critical |

To liczba wpisów npm, w tym zależności dotkniętych pośrednio, a nie liczba
niezależnych błędów. Raporty:
[przed](measurements/stage-7-audit-before.json),
[po](measurements/stage-7-audit-after.json),
[produkcja](measurements/stage-7-audit-production.json).

Aktualizacje obejmują React/React DOM 19.3.1, React Router 7.18.5, GSAP 3.15.1,
i18next 25.10.10, react-i18next 16.6.6, Vite 7.3.7, Sass 1.107.1 i narzędzia
TypeScript. Zachowano TypeScript 5.9.3 i Vite 7; nie wymuszano migracji całego
stosu do najnowszych głównych wersji. ESLint świadomie podniesiono do 10.14.0,
ponieważ seria 9 zakończyła wsparcie. Sprawdzono zgodność peer dependencies
pluginów, lint i testy. [Polityka wsparcia ESLint](https://eslint.org/version-support/).

Pozostałe 10 umiarkowanych wpisów pochodzi z **jednego** zgłoszenia
[`minimatch`, GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
ESLint i typescript-eslint nadal używają wersji 10.2.6; poprawka jest w 11.0.1.
Problem dotyczy nadmiernego zużycia zasobów przy przetwarzaniu wzorców glob.
W portfolio pakiet działa w narzędziach developerskich, nie w publikowanym
JavaScript. Wzorce pochodzą z konfiguracji repozytorium. CI ma ograniczenie czasu
15 minut i walidację bez uprawnień zapisu. To ograniczenie ekspozycji, nie poprawka
samej biblioteki.

Nie zastosowano proponowanego przez `npm audit fix --force` downgrade'u
typescript-eslint ani nie wymuszono niezgodnej głównej wersji przechodniej przez
`overrides`. Zgłoszenie pozostaje do ponownego sprawdzenia przy aktualizacji ESLint
lub typescript-eslint. Audyt w CI pokazuje moderate, ale blokuje dopiero high/critical.
Brak zgłoszeń runtime oznacza wynik rejestru w dniu audytu, nie gwarancję bezpieczeństwa.

Po aktualizacjach JS produkcyjny waży 461,43 KB / 151,60 KB gzip; po punkcie 6
było 427,75 / 141,47 KB. Obrazy i CSS zachowały optymalizacje; zwiększenie JS wynika
z aktualizacji bibliotek. Wpływu na czas renderowania nie zmierzono w przeglądarce.

## Kontrole lokalne

- `npm run check`: lint, 55 testów danych/interfejsu, walidacja treści i obrazów,
  TypeScript, build 16 stron, 4 testy SEO/HTTP — powodzenie.
- `npm run check:preview`: build noindex bez sitemap/CNAME i 4 testy SEO/HTTP —
  powodzenie. Po nim odbudowano produkcję.
- Testy obejmują oba języki, zapamiętywanie preferencji, migrację hash, cztery
  projekty w ustalonej kolejności, modal/fokus, 404, kontakt/schowek, intro GSAP,
  ograniczony ruch, header, hydratację i zasoby wszystkich stron.
- Axe sprawdza strukturę i dostępne nazwy. jsdom nie mierzy układu, kontrastu ani
  zachowania natywnej warstwy dialogu; komunikaty o braku canvas są znanym
  ograniczeniem tego środowiska, nie wynikiem kontroli wizualnej.

## Publiczne adresy

Wynik `npm run check:links`: **9/9 demo HTTP 200**, **8/8 publicznych repozytoriów
HTTP 200**, profil GitHub HTTP 200. Publiczny status repozytoriów potwierdzono także
przez konektor GitHub. Prywatne Psycho pominięto zgodnie z danymi projektu.
LinkedIn zwrócił HTTP 999 — blokadę automatycznego odczytu; wymaga sprawdzenia
ręcznego, bez automatycznej zmiany adresu. [Raport HTTP](measurements/stage-7-links.json).

Email i telefon są walidowane jako dane oraz linki `mailto:`/`tel:`. Nie wysyłano
wiadomości, formularzy ani połączeń. HTTP 200 potwierdza dostępność adresu, nie
działanie formularzy lub API zewnętrznego projektu. Skrypt działa poza obowiązkowym
CI; błędy 404/5xx kończą go niepowodzeniem, blokady i błędy sieci wymagają oceny.

## Pozostały odbiór

- [ ] Sprawdzić oba języki przy 320, 375, 768, 1024 i 1440 px oraz zoom 200%.
- [ ] Przejść klawiaturą: intro/pominięcie, skip link, nawigacja, modal, język,
  kopiowanie emaila; sprawdzić fokus, natywne inert i ukrywanie headera.
- [ ] Zmierzyć wydajność desktop/mobile według [performance.md](performance.md).
- [ ] Sprawdzić LinkedIn w zwykłej przeglądarce.
- [ ] Zastąpić archiwalne zrzuty README oraz podglądy projektów aktualnymi widokami.
- [ ] Po pushu sprawdzić rzeczywisty przebieg CI i publiczne 200/404, sitemap,
  CNAME, bezpośrednie wejścia PL/EN i podgląd udostępniania.

Dostęp do przeglądarki był zablokowany w poprzednim etapie: niedostępny host,
a natywny Firefox bez obsługi kontroli dozwolonych URL-i w narzędziu. Nie zastąpiono
brakującego odbioru deklaracją, że testy jsdom potwierdzają wygląd lub płynność.

Źródła konfiguracji: [uprawnienia i przypinanie akcji](https://docs.github.com/en/actions/reference/security/secure-use),
[publikacja gh-pages](https://github.com/peaceiris/actions-gh-pages),
[migracja ESLint 10](https://eslint.org/docs/latest/use/migrate-to-10.0.0).

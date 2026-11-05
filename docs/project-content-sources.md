# Źródła opisów realizacji

Przegląd: 2026-11-04. Opisy opisują funkcje potwierdzone w kodzie i dokumentacji, nie wyniki biznesowe. Nie dodano liczby klientów, konwersji, opinii ani deklaracji wyłącznego autorstwa. Kontekst własnych realizacji pochodzi z portfolio i rozmowy z użytkownikiem; zakres przedstawia elementy implementacji, bez przypisywania autorowi treści, zdjęć czy identyfikacji klientów.

## Moje Atelier

- Informacja użytkownika: funkcjonalna wersja online; finalizacja oczekuje na brakujące dane klienta; repozytorium prywatne.
- Lokalny checkout `D:/Programming/PsychoWeb`, czysty stan, commit `db6f0c95a0c6197c67d032cf9f5a7a0460d10f1f`.
- `README.md`, `package.json`, `src/pages/Appointment/Appointment.tsx`: React/TypeScript, formularz z preferencjami terminów, API, zachowanie danych po błędzie, identyfikator żądania, wspólne dane usług i prerenderowanie.
- Nie potwierdzano wysłania rzeczywistego emaila ani gotowości docelowej domeny. Demo nie jest przedstawiane jako finalne uruchomienie gabinetu. Nie opublikowano prywatnego kodu ani konfiguracji usług.

## Wióry Lecą!

- Lokalny checkout `D:/Programming/wioryleca-meblenawymiar`, czysty stan, commit `3bb3fea7cd83704c9da8952331582fece7ee1e81`.
- `README.md`, `package.json`, `build/catalog.mjs`, `src/ts/galleryNavigation.ts`: strona firmowa, HTML/SCSS/TypeScript/Vite, PL/DE/EN, generowanie kategorii i paginacji galerii, kompatybilność starych adresów.
- Opis dotyczy implementacji. Nie zakłada, że publiczny hosting zawiera już dokładnie ten commit, ani nie podaje wyników sprzedażowych.

## Formularz Zjazd SLO

- [README](https://github.com/MikeL538/Zaproszenie-Zjazd-SLO/blob/main/readme.md), blob `c4011e74663a8929de0c20507abe559736aba531`: rzeczywisty zjazd, publiczna strona i osobny panel administracyjny.
- [Kod formularza](https://github.com/MikeL538/Zaproszenie-Zjazd-SLO/blob/main/js/script.js): walidacja, zgody, honeypot, token CAPTCHA, POST do `functions/v1/submit-guest`, odczyt `people_public`.
- Kod jest nowszy od części README opisującej bezpośredni insert. W portfolio opisano funkcję Supabase zgodnie z kodem. Nie wykonywano zapisów próbnych ani przeglądu prywatnych zgłoszeń.
- Usunięto `Authentication` i `CRUD` z technologii tej karty: wskazane repozytorium zawiera publiczny formularz, a panel jest osobny. Nie deklarujemy audytu uprawnień bazy ani autorstwa całego zaplecza na podstawie samego publicznego repo.

## ImageInary

- [README](https://github.com/MikeL538/ImageInary/blob/main/README.md), blob `18dce0abeb1bdebeed19d6167582877d02225781`.
- [ImageGallery.jsx](https://github.com/MikeL538/ImageInary/blob/main/src/components/ImageGallery/ImageGallery.jsx), blob `de3dff9b73afd2d71f11925b8c56e928cbbb5f7b`.
- Potwierdzone: projekt edukacyjny, React, Axios/Pixabay, automatyczne doładowywanie, przycisk przy braku przewijania, usuwanie duplikatów po ID, stany ładowania/błędów i podstawowe testy komponentów opisane w README. Nie deklarowano pełnych testów E2E ani bezbłędności aplikacji.

## Obrazy i klasyfikacja

- Istniejące duże obrazy Wióry Lecą!, ImageInary i SLO obejrzano lokalnie. Podpisy mówią o zapisanych widokach; SLO jest archiwalnym zestawieniem formularza i panelu.
- Moje Atelier nadal używa grafiki prezentacyjnej. Jest tak podpisana; nie udaje zrzutu interfejsu.
- Brak aktualnych zrzutów mobilnych i kontroli nowych podstron w przeglądarce: host przeglądarki jest niedostępny. Ten element punktu 4 pozostaje otwarty.
- Kategorie „Strona firmowa”, „Narzędzie użytkowe” i „Projekt edukacyjny” opisują przeznaczenie. Nie dodano informacji o wynagrodzeniu lub modelu umowy.

## Utrzymanie

Treść case studies znajduje się w `projects.<nazwa>.caseStudy` w obu plikach językowych. Pola `category`, `featuredTech` i `caseStudyKey` w `src/assets/projects.json` sterują kartami i dostępnością opisu. Powiązania kompetencji są w `src/assets/skills.json`. Walidator sprawdza kompletność obu języków, 3–5 technologii wyróżnionych oraz poprawność referencji kompetencji.

Przy zmianie realizacji aktualizuj jej źródła, opis, ograniczenia i obrazy równocześnie. Aktualizacja kodu projektu nie dowodzi wdrożenia tej wersji na publicznym hostingu.

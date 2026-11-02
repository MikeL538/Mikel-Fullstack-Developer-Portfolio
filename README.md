# Mikel Portfolio - Fullstack Developer Portfolio

A modern, responsive portfolio built with React and TypeScript, showcasing selected frontend/fullstack projects and core information about the author.

## Live

- Live: https://mikeldev.online

## Preview

### Desktop

![Portfolio Desktop Preview](./public/images/ReadmeHome.webp)

### Mobile

![Portfolio Mobile Preview](./public/images/ReadmeHomeMobile.webp)

## About the Project

This application is a personal portfolio built as an SPA (Single Page Application) with client-side routing and internationalization.
The project is prepared for GitHub Pages deployment, which is why it uses `HashRouter` and a configured `base` path in Vite.

### What It Includes

- Home page with hero, skills, and featured projects sections
- Dedicated page with the full projects list
- `About` and `Contact` pages
- Modal for previewing larger project images
- Internationalization (`PL` / `EN`) with language selection saved in `localStorage`
- Responsive layout (mobile / tablet / desktop)
- Automatic GitHub Pages deployment via GitHub Actions

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM (`HashRouter`)
- i18next + `react-i18next` + `i18next-browser-languagedetector`
- SCSS (compiled styles + breakpoint-based files)
- ESLint
- GitHub Actions + GitHub Pages

## Project Structure (Short)

```text
src/
  assets/           # SVG icons + projects.json
  components/       # UI components (hero, header, modal, lists)
  constants/        # technology icon mappings
  hooks/            # custom hooks (e.g. cursor light effect)
  i18n/             # i18n config and translations (pl/en)
  layouts/          # main app layout
  pages/            # routed views (Home, Projects, About, Contact)
  styles/           # SCSS + built CSS
public/images/      # images and project screenshots
```

## Run Locally

```bash
git clone https://github.com/MikeL538/Mikel-Fullstack-Developer-Portfolio.git
cd Mikel-Fullstack-Developer-Portfolio
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - starts the Vite development server
- `npm run build` - validates content, checks TypeScript, and builds for production
- `npm run validate:content` - checks projects, PL/EN translations, images, technology icons, and profile data
- `npm test` - runs content validation and React interface regression tests (Node test runner + jsdom)
- `npm run preview` - previews the production build locally
- `npm run lint` - runs ESLint
- `npm run deploy` - publishes `dist/` via `gh-pages` (manual deploy)

## Deployment (GitHub Pages)

The project includes automatic deployment in `.github/workflows/deploy.yml`:

- Trigger: `push` to the `main` branch
- Build step (`npm run build`)
- Artifact publishing to GitHub Pages

GitHub Pages-specific configuration is also present in:

- `vite.config.ts` (`base: "/"`)
- `src/main.tsx` (`HashRouter`)

## Content Editing

Main places to update content:

- `src/assets/projects.json` - projects list (titles, links, stack, images)
- `src/types/project.ts` - shared project contract
- `src/data/projects.ts` - typed projects and the ordered Home selection
- `src/assets/technologies.json` - technology labels and SVG symbol IDs; set `icon` to `null` for a text-only entry
- `src/config/profile.json` - author, contact links, and profile image paths
- `src/i18n/locales/pl.json` - Polish translations
- `src/i18n/locales/en.json` - English translations

Each project needs a unique integer `id`, a unique kebab-case `slug`, a `status`
(`completed` or `inProgress`), and an explicit `githubPrivate` boolean. Preserve
existing IDs and slugs when editing a project. Keep exactly four projects featured,
with unique `featuredOrder` values from 1 to 4; omit the order for other projects.
Image paths are relative to `public/`, for example `images/projects/Filmovie.webp`.
Components resolve them through `assetUrl()` using Vite's configured base.

Run `npm run validate:content` after content edits. The same check runs before every
production build, including the existing deployment workflow. `npm test` also
checks invalid data, the agreed Home order, localized 404 navigation, render-error
recovery UI, and technology text fallback. Accessibility tests cover modal focus,
closing and scroll restoration, skip navigation, route focus, language switching,
reduced-motion behavior, and axe checks across both languages. jsdom tests check
behavior and DOM structure, not layout; native dialog methods are shimmed and axe's
color-contrast rule is disabled in this environment.

Image previews use native modal dialogs with named close controls and focus return.
The header preserves its scroll behavior: the decorative curve collapses after
80 px, the logo row also hides on mobile, and the full header returns within 120 px
of the page bottom. Focusing a header control reveals it immediately. A skip link
moves focus to the main content. Motion preferences
disable animation and cursor effects. The original GSAP “Hello, World!” intro
is retained on page load; it can be skipped with its button or Escape and is
automatically skipped for reduced motion. It restores scrolling and focus when
finished and does not replay on route changes. Technology names remain visible
on touch screens.

Before accepting the visual accessibility review, check a real browser at 200%
zoom and in mobile landscape: confirm focus visibility, header wrapping, image
fit, native background inertness, and access to the dialog's close button.

Unknown hash routes (for example `/#/missing`) show a localized 404 view. This is
an application-level fallback; HTTP 404 responses and path-based routing belong
to the later hosting/SEO migration. A root error boundary handles React rendering
failures with reload and email actions; it does not catch event-handler errors,
asynchronous errors, or failures that happen before React mounts.

## Author

**Michał Lipiak**

- GitHub: https://github.com/MikeL538
- LinkedIn: https://www.linkedin.com/in/michal-lipiak/
- E-mail: mikel538.work@gmail.com
- Portfolio: https://mikeldev.online

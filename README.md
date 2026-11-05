# Mikel Portfolio - Fullstack Developer Portfolio

A modern, responsive portfolio built with React and TypeScript, showcasing selected projects and core information about the author.

## Live

- Live: https://mikeldev.online

## Preview

### Desktop (archived preview)

![Portfolio Desktop Preview](./public/images/ReadmeHome.webp)

### Mobile (archived preview)

![Portfolio Mobile Preview](./public/images/ReadmeHomeMobile.webp)

## About the Project

This React/TypeScript portfolio prerenders complete HTML for Polish and English
pages at build time, then hydrates it for client-side navigation and interactions.
It uses `BrowserRouter` and directory index files compatible with GitHub Pages
on the custom domain `mikeldev.online`.

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
- React Router DOM (`BrowserRouter` and `StaticRouter` for prerendering)
- i18next + `react-i18next`, with URL-based language selection
- SCSS (component styles with shared tokens and breakpoints)
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
  routing/          # locale paths and legacy bookmark migration
  seo/              # shared static/client metadata
  styles/           # shared tokens + components/ with each component's responsive rules
public/images/      # images and project screenshots
```

## Run Locally

```bash
git clone https://github.com/MikeL538/Mikel-Fullstack-Developer-Portfolio.git
cd Mikel-Fullstack-Developer-Portfolio
npm ci
npm run dev
```

Use Node 24 (`.nvmrc` and `package.json#engines`); `.npmrc` rejects unsupported Node
versions during installation. In PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Available Scripts

- `npm run dev` - starts the Vite development server
- `npm run build` - validates content, checks TypeScript, and prerenders production HTML
- `npm run build:preview` - builds a noindex preview without sitemap or CNAME
- `npm run validate:content` - checks projects, PL/EN translations, images, technology icons, and profile data
- `npm run images:generate` - regenerates committed WebP variants and dimensions (Python + Pillow required only for this command)
- `npm run measure:assets` - inventories the current production build's file sizes (not browser performance metrics)
- `npm test` - runs content validation and React interface regression tests (Node test runner + jsdom)
- `npm run test:seo` - verifies the current build's static HTML, metadata, assets and HTTP responses
- `npm run preview` - serves `dist/` locally with real 404 responses (port 4173)
- `npm run lint` - runs ESLint
- `npm run check` - runs lint, interface tests, production build and SEO/HTTP checks
- `npm run check:preview` - builds and checks the noindex preview
- `npm run audit:prod` / `npm run audit:all` - audits runtime / all dependencies; high and critical findings fail
- `npm run check:links` - checks public demo, code and profile URLs; private repositories are skipped

## Deployment (GitHub Pages)

The project includes automatic deployment in `.github/workflows/deploy.yml`:

- Pull requests to `main`, pushes to `main`, and manual workflow runs receive validation
- Node from `.nvmrc`, `npm ci`, separate production/development audits, lint and interface tests
- Both preview and production builds receive generated HTML / HTTP checks
- A separate job publishes the verified artifact to `gh-pages` only for a push or manual run on `main`
- Validation has read-only repository access; only the publication job can write
- Actions are pinned to commit SHAs; weekly Dependabot updates cover npm and GitHub Actions

There is one publication path: **Actions → Portfolio CI → Run workflow → main**
for a manual redeploy, or the existing automatic push-to-main flow. The former
`npm run deploy` command and `gh-pages` CLI dependency were removed. Local
`npm run check` never publishes. Main runs are serialized; superseded PR runs
are cancelled. Consider requiring the `Validate portfolio` check in the repository's
branch rules; local workflow files cannot enforce those settings on their own.

GitHub Pages-specific configuration is also present in:

- `vite.config.ts` (`base: "/"`)
- `src/main.tsx` (`BrowserRouter` and hydration)
- `scripts/build.mjs` (localized directory indexes, root `404.html`, `.nojekyll` and CNAME)

Read [the routing and deployment guide](docs/seo-deployment.md) before publishing
or changing the domain. `npm run dev` is for authoring; use the production build
and `npm run preview` to check server-level 404 behavior. No public deployment
was performed as part of the local SEO implementation.

The [stage 7 quality report](docs/quality-report.md) records dependency findings,
public-link checks, validation evidence and the remaining manual review.
External link availability is checked separately from CI to avoid making a third-party
outage block a valid portfolio build. A successful HTTP response does not prove that
an external demo's forms or APIs work. LinkedIn may block automated requests.

## Content Editing

Main places to update content:

- `src/assets/projects.json` - projects list (titles, links, stack, images)
- `src/assets/skills.json` - frontend, data and tooling groups with project references
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
Each project also has a `category` (`business`, `utility`, or `learning`). Featured
projects need 3–5 `featuredTech` entries selected from their full `tech` list and
a `caseStudyKey` pointing to the complete PL/EN case study. Detail pages are
available at `/pl/projects/<slug>/` and `/en/projects/<slug>/` for projects with
case studies. Old `/#/projects/<slug>` bookmarks migrate on startup. Unknown or
undocumented slugs show the 404 view and return HTTP 404 on static hosting.
Image paths are relative to `public/`, for example `images/projects/Filmovie.webp`.
Components resolve them through `assetUrl()` using Vite's configured base.

After adding or replacing an image, run `npm run images:generate` and commit both
`public/images/optimized/` and `src/assets/image-manifest.json`. Keep original
screenshots: the modal uses the full-size source. The generator requires Python
and Pillow with WebP support (verified with Pillow 11.3.0); normal builds and CI
only validate and consume the committed output. Source hashes catch stale variants.
See [performance measurements and image workflow](docs/performance.md).

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

Home presents the hero, four featured projects, capabilities backed by project
examples, a short introduction, and contact actions. Cards use a two-column grid
from 768 px and a single column below it, without fixed card heights. Previews use
a 16:9 crop aligned to the top; the modal still shows the full image. Home styles
and their breakpoint live in `src/styles/components/_home.scss`, with shared visual
tokens in `src/styles/_variables.scss`. Home capability references are in
`src/assets/skills.json`; update their project slugs when changing the
featured selection. The name/logo returns Home, GitHub has its own link, and the
PL/EN links expose the selected language and retain the current page. The Moje Atelier social card still
needs replacement with actual interface screenshots when browser access is available.

Before accepting the visual accessibility review, check a real browser at 200%
zoom and in mobile landscape: confirm focus visibility, header wrapping, image
fit, native background inertness, and access to the dialog's close button.
Check both languages at widths 320, 375, 768, 1024 and 1440 px for text wrapping,
thumbnail crops and horizontal overflow. These visual checks remain pending;
the automated suite does not verify responsive rendering.

Case studies explain context, scope, decisions, features, a technical challenge,
results and limitations. Their source notes are in `docs/project-content-sources.md`.
Existing screenshots are labeled as saved views; current desktop/mobile captures
remain pending. Private repositories are shown as text on Home, Projects and detail
pages, with public case studies providing context instead of inaccessible code links.
Contact prioritizes the email address, with a copy button and a polite live status.
When clipboard access is unavailable or denied, the address stays visible for manual
copying. Tests cover both outcomes, case-study navigation, unknown slugs and previews.

Unknown hash routes (for example `/#/missing`) migrate to a localized missing path.
GitHub Pages uses the root `404.html`; it initially contains Polish content and
switches to English on the client for an `/en/` URL. A root error boundary handles React rendering
failures with reload and email actions; it does not catch event-handler errors,
asynchronous errors, or failures that happen before React mounts.

## Author

**Michał Lipiak**

- GitHub: https://github.com/MikeL538
- LinkedIn: https://www.linkedin.com/in/michal-lipiak/
- E-mail: mikel538.work@gmail.com
- Portfolio: https://mikeldev.online

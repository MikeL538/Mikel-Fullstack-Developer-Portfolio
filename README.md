# Mikel Portfolio - Fullstack Developer Portfolio

A modern, responsive portfolio built with React and TypeScript, showcasing selected frontend/fullstack projects and core information about the author.

## Live

- Live: portfolio.mikeldev.online

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
- `npm run build` - TypeScript build + Vite production build
- `npm run preview` - previews the production build locally
- `npm run lint` - runs ESLint
- `npm run deploy` - publishes `dist/` via `gh-pages` (manual deploy)

## Deployment (GitHub Pages)

The project includes automatic deployment in `.github/workflows/deploy.yml`:

- Trigger: `push` to the `main` branch
- Build step (`npm run build`)
- Artifact publishing to GitHub Pages

GitHub Pages-specific configuration is also present in:

- `vite.config.ts` (`base: "/Mikel-Fullstack-Developer-Portfolio/"`)
- `src/main.tsx` (`HashRouter`)

## Content Editing

Main places to update content:

- `src/assets/projects.json` - projects list (titles, links, stack, images)
- `src/i18n/locales/pl.json` - Polish translations
- `src/i18n/locales/en.json` - English translations

## Author

**Michał Lipiak**

- GitHub: https://github.com/MikeL538
- LinkedIn: https://www.linkedin.com/in/michal-lipiak/
- E-mail: mikel538.work@gmail.com
- Portfolio: portfolio.mikeldev.online

import { projects } from "../data/projects";

export const languages = ["pl", "en"] as const;
export type Language = typeof languages[number];
export const contentPaths = ["/", "/projects", "/about", "/contact", ...projects.filter((p) => p.caseStudyKey).map((p) => `/projects/${p.slug}`)];

export function normalizeLanguage(value?: string | null): Language | undefined {
  const base = value?.toLowerCase().split(/[-_]/)[0];
  return base === "pl" || base === "en" ? base : undefined;
}

export function languageFromPath(pathname: string): Language | undefined {
  const segment = pathname.split("/")[1];
  return segment === "pl" || segment === "en" ? segment : undefined;
}

export function contentPath(pathname: string): string {
  const path = languageFromPath(pathname) ? pathname.replace(/^\/(pl|en)(?=\/|$)/, "") : pathname;
  return path.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";
}

export function localizedPath(language: Language, path: string): string {
  const clean = contentPath(path);
  return `/${language}${clean === "/" ? "/" : `${clean}/`}`;
}

export function isKnownPath(pathname: string): boolean {
  return contentPaths.includes(contentPath(pathname));
}

// Run before mounting React so old bookmarks load the corresponding generated HTML.
export function initialTarget(url: URL, preferred: Language): string | null {
  if (url.hash.startsWith("#/")) {
    const fragment = url.hash.slice(1);
    if (fragment.startsWith("//") || fragment.includes("\\")) return null;
    const legacy = new URL(fragment, url.origin);
    if (legacy.origin !== url.origin) return null;
    return localizedPath(languageFromPath(legacy.pathname) ?? preferred, legacy.pathname) + (legacy.search || url.search) + legacy.hash;
  }
  if (!isKnownPath(url.pathname)) return null;
  const target = localizedPath(languageFromPath(url.pathname) ?? preferred, url.pathname) + url.search + url.hash;
  return target === url.pathname + url.search + url.hash ? null : target;
}

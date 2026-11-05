import { site } from "../config/site";
import { profile } from "../config/profile";
import { projects } from "../data/projects";
import { getLanguageInstance } from "../i18n/i18n";
import { contentPath, isKnownPath, localizedPath, type Language } from "../routing/paths";

export type HeadTag = { tag: "title" | "meta" | "link" | "script"; attrs?: Record<string, string>; text?: string };

export function metadata(pathname: string, language: Language, config = site): HeadTag[] {
  const t = getLanguageInstance(language).t.bind(getLanguageInstance(language));
  const path = contentPath(pathname);
  const known = isKnownPath(path);
  const project = projects.find((item) => path === `/projects/${item.slug}` && item.caseStudyKey);
  const page = path === "/" ? "home" : path.slice(1);
  const title = project ? `${project.title} — ${t("projects.viewDetails")} | ${profile.name}`
    : `${known ? t(`seo.${page}.title`) : t("errors.notFound.title")} | ${profile.name}`;
  const description = project ? t(project.descriptionKey) : known ? t(`seo.${page}.description`) : t("errors.notFound.description");
  const url = config.origin + localizedPath(language, path);
  const indexable = config.indexable && known;
  const tags: HeadTag[] = [
    { tag: "title", text: title },
    { tag: "meta", attrs: { name: "description", content: description } },
    { tag: "meta", attrs: { name: "robots", content: indexable ? "index, follow" : "noindex, follow" } },
    ...Object.entries({ "og:type": "website", "og:title": title, "og:description": description,
      "og:site_name": `${profile.name} — Portfolio`, "og:locale": language === "pl" ? "pl_PL" : "en_US",
      "og:locale:alternate": language === "pl" ? "en_US" : "pl_PL" }).map(([property, content]): HeadTag => ({ tag: "meta", attrs: { property, content } })),
    ...Object.entries({ "twitter:card": "summary_large_image", "twitter:title": title, "twitter:description": description })
      .map(([name, content]): HeadTag => ({ tag: "meta", attrs: { name, content } })),
  ];
  if (!indexable) return tags;
  tags.push(
    { tag: "link", attrs: { rel: "canonical", href: url } },
    ...(["pl", "en"] as const).map((lang): HeadTag => ({ tag: "link", attrs: { rel: "alternate", hreflang: lang, href: config.origin + localizedPath(lang, path) } })),
    { tag: "link", attrs: { rel: "alternate", hreflang: "x-default", href: config.origin + localizedPath("pl", path) } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: config.origin + config.socialImage } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { property: "og:image:alt", content: t("seo.imageAlt") } },
    { tag: "meta", attrs: { name: "twitter:image", content: config.origin + config.socialImage } },
    { tag: "meta", attrs: { name: "twitter:image:alt", content: t("seo.imageAlt") } },
  );
  const personId = `${config.origin}/#person`;
  const websiteId = `${config.origin}/#website`;
  const graph = [
    { "@type": "Person", "@id": personId, name: profile.name, url: config.origin + "/pl/", jobTitle: t("about.occ"), sameAs: [profile.github, profile.linkedin] },
    { "@type": "WebSite", "@id": websiteId, name: `${profile.name} — Portfolio`, url: config.origin + "/", inLanguage: ["pl", "en"], author: { "@id": personId } },
    { "@type": page === "home" ? "ProfilePage" : "WebPage", "@id": url + "#page", url, name: title, description, inLanguage: language,
      isPartOf: { "@id": websiteId }, mainEntity: { "@id": project ? url + "#project" : personId } },
    ...(project ? [{ "@type": "CreativeWork", "@id": url + "#project", name: project.title, description,
      url: project.live, creator: { "@id": personId }, mainEntityOfPage: { "@id": url + "#page" },
      keywords: project.tech.join(", "), inLanguage: language }] : []),
  ];
  tags.push({ tag: "script", attrs: { type: "application/ld+json" }, text: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) });
  return tags;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function renderHead(tags: HeadTag[]): string {
  return tags.map(({ tag, attrs = {}, text = "" }) => {
    const attributes = Object.entries(attrs).map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join("");
    const content = tag === "script" ? text.replace(/</g, "\\u003c") : escapeHtml(text);
    return `<${tag} data-seo=""${attributes}>${tag === "meta" || tag === "link" ? "" : `${content}</${tag}>`}`;
  }).join("\n");
}

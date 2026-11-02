import { readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
const lookup = (object, key) => key.split(".").reduce((value, part) => value?.[part], object);

function translationKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" ? translationKeys(child, path) : [path];
  });
}

export function validateContent({ projects, locales, technologies, profile, assetExists, spriteIds }) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const translation = (key) => {
    for (const [locale, content] of Object.entries(locales)) {
      check(nonempty(lookup(content, key)), `${locale}: missing translation ${key}`);
    }
  };
  const asset = (path, label) => {
    const valid = nonempty(path) && /^images\/[\w./-]+$/.test(path) && !path.split("/").includes("..");
    check(valid && assetExists(path), `${label}: missing or invalid image ${path}`);
  };
  const link = (value, label) => {
    try {
      const url = new URL(value);
      check(url.protocol === "https:" && !url.username && !url.password, `${label}: expected a public HTTPS URL`);
    } catch {
      errors.push(`${label}: invalid URL`);
    }
  };

  const keys = new Set(Object.values(locales).flatMap((content) => translationKeys(content)));
  for (const key of keys) translation(key);

  const ids = new Set();
  const slugs = new Set();
  const orders = [];
  if (!Array.isArray(projects)) return [...errors, "Projects must be an array"];

  for (const project of projects) {
    if (!project || typeof project !== "object") {
      errors.push("Invalid project entry");
      continue;
    }
    const label = `Project ${project.id}`;
    check(Number.isInteger(project.id) && project.id >= 0 && !ids.has(project.id), `${label}: invalid or duplicate id`);
    check(nonempty(project.slug) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) && !slugs.has(project.slug), `${label}: invalid or duplicate slug`);
    ids.add(project.id);
    slugs.add(project.slug);
    check(nonempty(project.title), `${label}: missing title`);
    for (const field of ["descriptionKey", "descriptionLongKey"]) {
      if (nonempty(project[field])) translation(project[field]);
      else errors.push(`${label}: missing ${field}`);
    }
    check(["completed", "inProgress"].includes(project.status), `${label}: invalid status`);
    if (project.status === "inProgress") translation("projects.status.inProgress");
    check(typeof project.githubPrivate === "boolean", `${label}: githubPrivate must be boolean`);
    if (project.githubPrivate) translation("projects.privateRepository");
    link(project.github, `${label} GitHub`);
    link(project.live, `${label} live`);
    asset(project.image, label);
    asset(project.imageLarge, label);
    check(Array.isArray(project.tech) && project.tech.length > 0, `${label}: missing technologies`);
    if (Array.isArray(project.tech)) {
      check(new Set(project.tech).size === project.tech.length, `${label}: duplicate technology`);
      for (const name of project.tech) {
        check(Object.hasOwn(technologies, name), `${label}: unknown technology ${name}`);
      }
    }
    check(typeof project.featured === "boolean", `${label}: featured must be boolean`);
    if (project.featured) orders.push(project.featuredOrder);
    else check(project.featuredOrder === undefined, `${label}: unfeatured project has featuredOrder`);
  }

  check(orders.length === 4 && [1, 2, 3, 4].every((order) => orders.includes(order)), "Home: exactly four featured projects must have unique orders 1–4");
  for (const [name, technology] of Object.entries(technologies)) {
    check(nonempty(technology.label), `Technology ${name}: missing label`);
    if (technology.icon != null) check(spriteIds.has(technology.icon), `Technology ${name}: missing SVG symbol ${technology.icon}`);
  }
  for (const field of ["name", "copyrightName", "email", "phone", "phoneDisplay"]) {
    check(nonempty(profile[field]), `Profile: missing ${field}`);
  }
  check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email), "Profile: invalid email");
  check(/^\+\d{7,15}$/.test(profile.phone), "Profile: invalid phone");
  link(profile.github, "Profile GitHub");
  link(profile.linkedin, "Profile LinkedIn");
  for (const [name, path] of Object.entries(profile.images)) asset(path, `Profile ${name}`);
  return errors;
}

export function loadContent() {
  const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
  const sprite = readFileSync(resolve(root, "src/assets/icons.svg"), "utf8");
  return {
    projects: json("src/assets/projects.json"),
    technologies: json("src/assets/technologies.json"),
    locales: { pl: json("src/i18n/locales/pl.json"), en: json("src/i18n/locales/en.json") },
    profile: json("src/config/profile.json"),
    spriteIds: new Set([...sprite.matchAll(/<symbol\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1])),
    assetExists: (path) => {
      try { return statSync(resolve(root, "public", path)).isFile(); }
      catch { return false; }
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const content = loadContent();
  const errors = validateContent(content);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Content valid: ${content.projects.length} projects, four featured, PL/EN, images, icons and profile.`);
  }
}

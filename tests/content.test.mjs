import test from "node:test";
import assert from "node:assert/strict";
import { loadContent, validateContent } from "../scripts/validate-content.mjs";

test("portfolio content is complete and featured projects keep the agreed order", () => {
  const content = loadContent();
  assert.deepEqual(validateContent(content), []);
  assert.deepEqual(content.projects.filter((p) => p.featured).sort((a, b) => a.featuredOrder - b.featuredOrder).map((p) => p.slug), [
    "moje-atelier", "wiory-leca", "zjazd-slo", "imageinary",
  ]);
});

test("missing translation and image are reported together", () => {
  const content = loadContent();
  delete content.locales.en.projects.MojeAtelier.description;
  content.projects[0].imageLarge = "images/missing.webp";
  const errors = validateContent(content);
  assert.ok(errors.some((message) => message.includes("en: missing translation projects.MojeAtelier.description")));
  assert.ok(errors.some((message) => message.includes("images/missing.webp")));
});

test("duplicate ids, slugs and featured positions are rejected", () => {
  const content = loadContent();
  Object.assign(content.projects[1], {
    id: content.projects[0].id,
    slug: content.projects[0].slug,
    featuredOrder: 1,
  });
  const errors = validateContent(content);
  for (const text of ["duplicate id", "duplicate slug", "unique orders"]) {
    assert.ok(errors.some((message) => message.includes(text)), text);
  }
});

test("invalid links, status, privacy flag and unknown technologies are rejected", () => {
  const content = loadContent();
  Object.assign(content.projects[0], { live: "javascript:alert(1)", status: "unknown", githubPrivate: "yes", tech: ["Unknown"] });
  const errors = validateContent(content);
  for (const text of ["HTTPS URL", "invalid status", "githubPrivate", "unknown technology"]) {
    assert.ok(errors.some((message) => message.includes(text)), text);
  }
});

test("technology without an icon is allowed; broken icon and image paths are rejected", () => {
  const content = loadContent();
  content.technologies.React.icon = null;
  assert.deepEqual(validateContent(content), []);
  content.technologies.React.icon = "nonexistent-symbol";
  content.projects[0].image = "images/../../package.json";
  const errors = validateContent(content);
  assert.ok(errors.some((message) => message.includes("missing SVG symbol")));
  assert.ok(errors.some((message) => message.includes("invalid image")));
});

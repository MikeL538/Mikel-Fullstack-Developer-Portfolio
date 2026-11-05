import { build } from "vite";
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const mode = process.argv.includes("--preview") ? "preview" : "production";
await build({ mode });
await build({ mode, build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr" } });
const { render, routes, site } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--seo-head-->")) throw new Error("Missing metadata placeholder");

async function page(output, route) {
  const { html, head, language } = render(route);
  const document = template.replace('<html lang="pl">', `<html lang="${language}">`)
    .replace("<!--seo-head-->", head)
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, document);
}

for (const route of routes) await page(`dist${route}index.html`, route);
// Root is a usable Polish fallback; the client migrates legacy hash bookmarks first.
await page("dist/index.html", "/pl/");
await page("dist/404.html", "/pl/not-found/");
// Localized fallbacks for the preview server and direct /pl/404.html links.
await page("dist/pl/404.html", "/pl/not-found/");
await page("dist/en/404.html", "/en/not-found/");
await writeFile("dist/.nojekyll", "");
if (site.indexable) {
  await writeFile("dist/CNAME", new URL(site.origin).hostname + "\n");
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${site.origin}${route}</loc></url>`).join("")}</urlset>\n`);
} else {
  await unlink("dist/CNAME").catch((error) => { if (error.code !== "ENOENT") throw error; });
}
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n${site.indexable ? `Sitemap: ${site.origin}/sitemap.xml\n` : ""}`);
console.log(`Prerendered ${routes.length} localized pages and 404 fallbacks (${mode}, ${site.indexable ? "indexable" : "noindex"}).`);

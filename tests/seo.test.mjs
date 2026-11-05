import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { createPreviewServer } from "../scripts/preview.mjs";
import { routes, site, metadata, renderHead } from "../dist-ssr/entry-server.js";

let server;
let origin;
before(async () => {
  server = createPreviewServer();
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise((done) => server.close(done)); });

test("every localized URL serves complete static HTML, valid assets and consistent SEO", async () => {
  assert.equal(routes.length, 16);
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const dom = new JSDOM(await response.text(), { url: site.origin + route });
    const d = dom.window.document;
    try {
      const language = route.split("/")[1];
      assert.equal(d.documentElement.lang, language);
      assert.equal(d.querySelectorAll("h1").length, 1);
      assert.ok(d.querySelector("h1").textContent.length > 3);
      assert.equal(d.querySelector("#root").dataset.route, route);
      assert.equal(d.querySelector("[inert], .intro"), null, "HTML must be usable without JavaScript");
      assert.equal(d.querySelectorAll("title").length, 1);
      assert.ok(!titles.has(d.title), `Duplicate title: ${d.title}`);
      titles.add(d.title);
      const description = d.querySelector('meta[name="description"]').content;
      assert.ok(description.length > 40);
      assert.ok(!descriptions.has(description), `Duplicate description: ${route}`);
      descriptions.add(description);
      assert.equal(d.querySelector('meta[name="robots"]').content, site.indexable ? "index, follow" : "noindex, follow");
      assert.equal(d.querySelector('meta[property="og:title"]').content, d.title);
      assert.equal(d.querySelector('meta[name="twitter:card"]').content, "summary_large_image");
      assert.equal(d.querySelector('link[rel="icon"]').type, "image/png");
      if (site.indexable) {
        assert.equal(d.querySelector('link[rel="canonical"]').href, site.origin + route);
        for (const locale of ["pl", "en"]) {
          const alternate = d.querySelector(`link[hreflang="${locale}"]`).href;
          assert.equal(alternate, site.origin + route.replace(/^\/(pl|en)\//, `/${locale}/`));
        }
        assert.equal(d.querySelector('link[hreflang="x-default"]').href, site.origin + route.replace(/^\/(pl|en)\//, "/pl/"));
        assert.equal(d.querySelector('meta[property="og:url"]').content, site.origin + route);
        const graph = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)["@graph"];
        assert.ok(graph.some((item) => item["@type"] === "Person"));
        assert.ok(graph.some((item) => item["@type"] === "WebSite"));
        assert.equal(graph.some((item) => item["@type"] === "CreativeWork"), route.split("/").filter(Boolean).length === 3);
      } else {
        assert.equal(d.querySelector('link[rel="canonical"], link[hreflang], meta[property="og:url"], script[type="application/ld+json"]'), null);
      }
      for (const element of d.querySelectorAll("img[src], script[src], link[rel=stylesheet], use[href]")) {
        const asset = (element.getAttribute("src") ?? element.getAttribute("href")).split("#")[0];
        assert.ok(asset.startsWith("/") && !asset.startsWith("//"), asset);
        assert.ok((await stat(resolve("dist", "." + asset))).isFile(), asset);
      }
      for (const img of d.querySelectorAll("img")) {
        assert.ok(Number(img.getAttribute("width")) > 0 && Number(img.getAttribute("height")) > 0, "reserve image space in server HTML");
        if (img.srcset) {
          assert.ok(img.sizes, "responsive images need an explicit display size");
          for (const candidate of img.srcset.split(",")) {
            const [asset, width] = candidate.trim().split(/\s+/);
            assert.match(width, /^\d+w$/);
            assert.equal((await fetch(origin + asset)).status, 200, asset);
          }
        }
      }
      const hero = d.querySelector(".home__hero__image");
      if (hero) assert.equal(hero.getAttribute("fetchpriority"), "high");
      const previews = [...d.querySelectorAll(".project-preview img")];
      if (route === "/pl/projects/" || route === "/en/projects/") {
        assert.equal(previews[0].getAttribute("loading"), "eager");
        assert.ok(previews.slice(1).every((img) => img.loading === "lazy" || img.getAttribute("loading") === "lazy"));
      }
      for (const link of d.querySelectorAll('a[href^="/"]')) {
        assert.ok(routes.includes(new URL(link.href).pathname), link.href);
      }
    } finally { dom.window.close(); }
  }
});

test("static server returns real 404s and preserves query strings on slash redirects", async () => {
  for (const path of ["/missing", "/pl/projects/missing/", "/en/projects/filmovie/"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
    const dom = new JSDOM(await response.text());
    assert.equal(dom.window.document.querySelector('meta[name="robots"]').content, "noindex, follow");
    assert.equal(dom.window.document.querySelector('link[rel="canonical"]'), null);
    assert.ok(dom.window.document.querySelector("h1"));
    dom.window.close();
  }
  for (const path of ["/en/projects", "/en/projects/index.html"]) {
    const response = await fetch(origin + path + "?from=test", { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), "/en/projects/?from=test");
  }
  assert.equal((await fetch(origin + "/en/about/", { method: "HEAD" })).status, 200);
  assert.equal((await fetch(origin + "/en/about/", { method: "POST" })).status, 405);
});

test("sitemap, robots, CNAME and social image match the publication mode", async () => {
  const robots = await (await fetch(origin + "/robots.txt")).text();
  assert.ok(robots.includes("Allow: /"));
  assert.ok(!robots.includes("Disallow: /"), "crawlers must be able to read noindex");
  const sitemap = await fetch(origin + "/sitemap.xml");
  assert.equal(sitemap.status, site.indexable ? 200 : 404);
  if (site.indexable) {
    const dom = new JSDOM(await sitemap.text(), { contentType: "text/xml" });
    assert.deepEqual([...dom.window.document.querySelectorAll("loc")].map((node) => node.textContent), routes.map((route) => site.origin + route));
    dom.window.close();
    assert.ok(robots.includes(site.origin + "/sitemap.xml"));
    assert.equal((await readFile("dist/CNAME", "utf8")).trim(), new URL(site.origin).hostname);
  } else {
    assert.ok(!robots.includes("Sitemap:"));
    await assert.rejects(stat("dist/CNAME"), { code: "ENOENT" });
  }
  const png = await readFile("dist/images/social-preview.png");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.equal((await fetch(origin + "/images/social-preview.png")).headers.get("content-type"), "image/png");
  assert.ok((await stat("dist/.nojekyll")).isFile());
});

test("metadata handles alternate domains, previews and unknown routes without stale canonical URLs", () => {
  const config = { ...site, origin: "https://portfolio.example", indexable: true };
  const dom = new JSDOM(`<head>${renderHead(metadata("/en/about/", "en", config))}</head>`);
  assert.equal(dom.window.document.querySelector('link[rel="canonical"]').href, "https://portfolio.example/en/about/");
  dom.window.close();
  for (const [path, indexable] of [["/en/about/", false], ["/en/missing/", true]]) {
    const tags = metadata(path, "en", { ...config, indexable });
    assert.ok(tags.some((tag) => tag.attrs?.name === "robots" && tag.attrs.content === "noindex, follow"));
    assert.ok(!tags.some((tag) => tag.attrs?.rel === "canonical"));
  }
});

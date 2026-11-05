import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { JSDOM } from "jsdom";
import { createElement, act, StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { MemoryRouter, useNavigate } from "react-router-dom";

let server;
let dom;
let AppRoutes;
let ErrorBoundary;
let TechnologyIcon;
let i18n;
let App;
let axe;
let gsap;
let renderPage;
let paths;
const mediaQueries = new Map();

before(async () => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
  globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
  globalThis.cancelAnimationFrame = (frame) => clearTimeout(frame);
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.matchMedia = (query) => {
    if (!mediaQueries.has(query)) {
      const media = new window.EventTarget();
      // Most UI tests skip the intro. Dedicated tests below exercise its animation.
      media.matches = query === "(prefers-reduced-motion: reduce)";
      media.media = query;
      mediaQueries.set(query, media);
    }
    return mediaQueries.get(query);
  };
  // jsdom has no native dialog/top layer. These shims only exercise our lifecycle;
  // browser-managed inertness still needs a real-browser check.
  window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  server = await createServer({
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: "custom",
  });
  ({ default: i18n } = await server.ssrLoadModule("/src/i18n/i18n.ts"));
  ({ default: AppRoutes } = await server.ssrLoadModule("/src/AppRoutes.tsx"));
  ({ default: ErrorBoundary } = await server.ssrLoadModule("/src/components/ErrorBoundary.tsx"));
  ({ default: TechnologyIcon } = await server.ssrLoadModule("/src/components/TechnologyIcon.tsx"));
  ({ default: App } = await server.ssrLoadModule("/src/App.tsx"));
  ({ render: renderPage } = await server.ssrLoadModule("/src/entry-server.tsx"));
  paths = await server.ssrLoadModule("/src/routing/paths.ts");
  ({ gsap } = await import("gsap"));
  ({ default: axe } = await import("axe-core"));
});

after(async () => {
  await server?.close();
  gsap?.ticker.sleep();
  dom?.window.close();
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.HTMLElement;
  delete globalThis.getComputedStyle;
  delete globalThis.requestAnimationFrame;
  delete globalThis.cancelAnimationFrame;
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

test("preview traps Tab, supports cancel/close/backdrop, and restores focus and scroll state", async () => {
  await render(createElement(StrictMode, null, createElement(MemoryRouter, null, createElement(App))), async (container) => {
    const opener = container.querySelector('button[aria-haspopup="dialog"]');
    document.body.style.overflow = "scroll";
    document.documentElement.style.overflow = "auto";
    for (const closeWith of ["cancel", "button", "backdrop"]) {
      await act(async () => opener.click());
      const dialog = document.querySelector("dialog[open]");
      assert.ok(dialog);
      assert.ok(document.getElementById(dialog.getAttribute("aria-labelledby")));
      const close = dialog.querySelector("button");
      const accessibility = await axe.run(dialog, { rules: { "color-contrast": { enabled: false } } });
      assert.deepEqual(accessibility.violations.map(({ id }) => id), []);
      assert.equal(document.activeElement, close);
      assert.equal(document.body.style.overflow, "hidden");
      for (const shiftKey of [false, true]) {
        const tab = new window.KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true, cancelable: true });
        await act(async () => close.dispatchEvent(tab));
        assert.equal(tab.defaultPrevented, true);
        assert.equal(document.activeElement, close);
      }
      await act(async () => dialog.querySelector("img").click());
      assert.ok(dialog.open, "clicking the image should not close the preview");
      await act(async () => {
        if (closeWith === "cancel") dialog.dispatchEvent(new window.Event("cancel", { cancelable: true }));
        else if (closeWith === "button") close.click();
        else dialog.click();
      });
      assert.equal(document.querySelector("dialog"), null);
      assert.equal(document.activeElement, opener);
      assert.equal(document.body.style.overflow, "scroll");
      assert.equal(document.documentElement.style.overflow, "auto");
    }
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });
});

test("reduced motion skips the intro and navigation moves focus to main content", async () => {
  await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
    assert.equal(container.querySelector(".intro"), null);
    assert.notEqual(document.body.style.overflow, "hidden");
    const skip = container.querySelector(".skip-link");
    assert.ok(skip.textContent.trim());
    await act(async () => skip.click());
    assert.equal(document.activeElement, container.querySelector("main"));
    const link = container.querySelector('nav a[href$="/about/"]');
    await act(async () => link.focus());
    await act(async () => link.click());
    assert.equal(document.activeElement, container.querySelector("main"));
    assert.equal(container.querySelectorAll("h1").length, 1);
    assert.equal(container.querySelector("h1").textContent, i18n.t("about.title"));
  });
});

test("unmounting an open preview restores the previous overflow values", async () => {
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "scroll";
  await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
    await act(async () => container.querySelector('button[aria-haspopup="dialog"]').click());
    assert.equal(document.body.style.overflow, "hidden");
  });
  assert.equal(document.querySelector("dialog"), null);
  assert.equal(document.body.style.overflow, "auto");
  assert.equal(document.documentElement.style.overflow, "scroll");
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});

test("language button has a name and updates the document language", async () => {
  await i18n.changeLanguage("en");
  await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
    const button = container.querySelector('a[lang="pl"]');
    assert.equal(button.getAttribute("aria-label"), "Zmień język na polski");
    await act(async () => button.click());
    assert.equal(document.documentElement.lang, "pl");
    assert.equal(container.querySelectorAll(".header__button").length, 2);
    assert.equal(button.textContent.trim(), "PL");
    assert.equal(button.getAttribute("aria-current"), "true");
    assert.equal(container.querySelector('a[lang="en"]').getAttribute("aria-current"), null);
    assert.ok(container.querySelector('a[lang="en"]').getAttribute("aria-label"));
    await act(async () => container.querySelector('a[lang="en"]').click());
    assert.equal(document.documentElement.lang, "en");
    assert.equal(button.getAttribute("aria-current"), null);
  });
});

test("hero respects reduced motion and moves focus to the projects heading", async (context) => {
  const scroll = context.mock.method(window.HTMLElement.prototype, "scrollIntoView", () => {});
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
    for (const reduced of [true, false]) {
      preference.matches = reduced;
      await act(async () => container.querySelector(".home__hero__button").click());
      assert.equal(scroll.mock.calls.at(-1).arguments[0].behavior, reduced ? "instant" : "smooth");
      assert.equal(document.activeElement, container.querySelector("#projects"));
    }
  });
  preference.matches = true;
});

test("header collapses during scroll, reveals near the bottom and keeps focused controls visible", async () => {
  const properties = [[window, "scrollY"], [window, "innerHeight"], [document.documentElement, "scrollHeight"]];
  const descriptors = properties.map(([target, key]) => Object.getOwnPropertyDescriptor(target, key));
  const set = (target, key, value) => Object.defineProperty(target, key, { configurable: true, value });
  set(window, "scrollY", 0);
  set(window, "innerHeight", 800);
  set(document.documentElement, "scrollHeight", 2400);
  try {
    await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
      const header = container.querySelector("header");
      const curve = header.querySelector(".header__curve");
      const scroll = async (y) => {
        set(window, "scrollY", y);
        await act(async () => window.dispatchEvent(new window.Event("scroll")));
      };
      assert.equal(header.classList.contains("scroll__header"), false);
      await scroll(81);
      assert.ok(header.classList.contains("scroll__header"));
      assert.ok(curve.classList.contains("scroll__curve"));
      await act(async () => header.querySelector("a").focus());
      assert.equal(header.classList.contains("scroll__header"), false);
      assert.equal(curve.classList.contains("scroll__curve"), false);
      await act(async () => container.querySelector("main").focus());
      assert.ok(header.classList.contains("scroll__header"));
      await scroll(1480);
      assert.equal(header.classList.contains("scroll__header"), false);
      await scroll(500);
      assert.ok(header.classList.contains("scroll__header"));
      await scroll(0);
      assert.equal(header.classList.contains("scroll__header"), false);
      set(document.documentElement, "scrollHeight", 800);
      await scroll(100);
      assert.equal(header.classList.contains("scroll__header"), false);
    });
  } finally {
    properties.forEach(([target, key], index) => {
      if (descriptors[index]) Object.defineProperty(target, key, descriptors[index]);
      else delete target[key];
    });
  }
});

test("cursor effect stops and clears coordinates when motion preference changes", async (context) => {
  const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
  preference.matches = true;
  const frames = [];
  context.mock.method(globalThis, "requestAnimationFrame", (callback) => { frames.push(callback); return frames.length; });
  context.mock.method(globalThis, "cancelAnimationFrame", () => {});
  await render(createElement(MemoryRouter, null, createElement(App)), async () => {
    const beforeMoves = frames.length;
    for (let index = 0; index < 50; index++) {
      window.dispatchEvent(new window.MouseEvent("mousemove", { clientX: index + 1, clientY: index + 21 }));
    }
    assert.equal(frames.length - beforeMoves, 1, "a burst of mouse events schedules only one animation frame");
    // Header also schedules one frame to measure initial scroll state.
    const countBeforePreferenceChange = frames.length;
    await act(async () => frames.forEach((callback) => callback()));
    assert.equal(document.documentElement.style.getPropertyValue("--x"), "50px");
    preference.matches = false;
    preference.dispatchEvent(new window.Event("change"));
    assert.equal(document.documentElement.style.getPropertyValue("--x"), "");
    window.dispatchEvent(new window.MouseEvent("mousemove", { clientX: 90 }));
    assert.equal(frames.length, countBeforePreferenceChange);
  });
  preference.matches = false;
});

test("GSAP intro runs once, blocks the page, then restores scrolling and focus", async () => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.matches = false;
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "scroll";
  try {
    await render(createElement(StrictMode, null, createElement(MemoryRouter, null, createElement(App))), async (container) => {
      const intro = container.querySelector(".intro");
      assert.ok(intro);
      assert.ok(intro.textContent.includes("Hello,"));
      assert.ok(container.querySelector("[inert]"));
      assert.equal(document.body.style.overflow, "hidden");
      assert.equal(document.activeElement, intro.querySelector("button"));
      const animation = gsap.globalTimeline.getChildren().find((child) => typeof child.vars.onComplete === "function");
      assert.ok(animation, "intro must use a running GSAP timeline");
      await act(async () => animation.progress(1));
      assert.equal(container.querySelector(".intro"), null);
      assert.equal(container.querySelector("[inert]"), null);
      assert.equal(document.body.style.overflow, "auto");
      assert.equal(document.documentElement.style.overflow, "scroll");
      assert.equal(document.activeElement, container.querySelector("main"));
      await act(async () => container.querySelector('nav a[href$="/about/"]').click());
      assert.equal(container.querySelector(".intro"), null, "route changes must not replay the intro");
    });
  } finally {
    preference.matches = true;
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
});

for (const finishWith of ["button", "escape", "reduced-motion", "unmount"]) {
  test(`intro releases scroll lock when finished by ${finishWith}`, async () => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.matches = false;
    document.body.style.overflow = "scroll";
    try {
      await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
        const intro = container.querySelector(".intro");
        assert.ok(intro);
        if (finishWith === "unmount") return;
        await act(async () => {
          if (finishWith === "button") intro.querySelector("button").click();
          else if (finishWith === "escape") intro.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          else {
            preference.matches = true;
            preference.dispatchEvent(new window.Event("change"));
          }
        });
        assert.equal(container.querySelector(".intro"), null);
        assert.equal(container.querySelector("[inert]"), null);
      });
      assert.equal(document.body.style.overflow, "scroll");
    } finally {
      preference.matches = true;
      document.body.style.overflow = "";
    }
  });
}

for (const language of ["pl", "en"]) {
  test(`Home actions navigate to contact and the logo returns Home (${language})`, async () => {
    await i18n.changeLanguage(language);
    await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
      for (const selector of ['.home__hero a[href$="/contact/"]', '.home__contact a[href$="/contact/"]', '.home__about a[href$="/about/"]']) {
        const link = container.querySelector(selector);
        const expectedTitle = link.getAttribute("href").endsWith("/about/") ? "about.title" : "contact.title";
        await act(async () => link.click());
        assert.equal(container.querySelector("h1").textContent, i18n.t(expectedTitle));
        await act(async () => container.querySelector(".header__link").click());
        assert.equal(container.querySelector("h1").textContent, i18n.t("home.heroTitle"));
      }
      assert.ok(container.querySelector('.home__contact a[href^="mailto:"]'));
      const atelier = container.querySelector(".home__projects__item");
      assert.ok(atelier.querySelector(".project-links__private"));
      assert.equal(atelier.querySelector('a[href*="github.com"]'), null);
      assert.ok(container.querySelector('.header__github[href="https://github.com/MikeL538"]'));
    });
  });

  for (const path of ["/", "/projects", "/about", "/contact", "/missing", "/projects/moje-atelier", "/projects/wiory-leca", "/projects/zjazd-slo", "/projects/imageinary"]) {
    test(`accessible names and structure pass axe (${language} ${path})`, async () => {
      await i18n.changeLanguage(language);
      await render(createElement(MemoryRouter, { initialEntries: [path] }, createElement(App)), async (container) => {
        assert.equal(container.querySelectorAll("h1").length, 1);
        const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
        assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })), []);
      });
    });
  }
}

for (const language of ["pl", "en"]) {
  test(`featured case studies open from Home, show complete content and return to Projects (${language})`, async () => {
    await i18n.changeLanguage(language);
    for (const slug of ["moje-atelier", "wiory-leca", "zjazd-slo", "imageinary"]) {
      await render(createElement(MemoryRouter, null, createElement(App)), async (container) => {
        const card = container.querySelector(`.home__projects__item:has(a[href$="/projects/${slug}/"])`);
        const title = card.querySelector("h3").textContent;
        const techCount = card.querySelectorAll(".home__projects__list-tech > li").length;
        assert.ok(techCount >= 3 && techCount <= 5);
        await act(async () => card.querySelector(".project-links__details").click());
        assert.equal(container.querySelector("h1").textContent, title);
        assert.equal(document.activeElement, container.querySelector("main"));
        assert.equal(container.querySelectorAll(".case-study__sections section").length, 7);
        for (const paragraph of container.querySelectorAll(".case-study__sections p")) {
          assert.ok(paragraph.textContent.length > 40);
          assert.ok(!paragraph.textContent.startsWith("projects."));
        }
        assert.ok(container.querySelector("figcaption").textContent.length > 20);
        if (slug === "moje-atelier") {
          assert.equal(container.querySelector('article a[href="https://github.com/MikeL538/Psycho"]'), null);
          assert.ok(container.querySelector(".project-links__private"));
        }
        const opener = container.querySelector("article button[aria-haspopup]");
        await act(async () => opener.click());
        assert.ok(document.querySelector("dialog[open]"));
        await act(async () => document.querySelector("dialog button").click());
        assert.equal(document.activeElement, opener);
        await act(async () => container.querySelector('article a[href$="/projects/"]').click());
        assert.equal(container.querySelector("h1").textContent, i18n.t("projects.title"));
        assert.equal(container.querySelector('main a[href="https://github.com/MikeL538/Psycho"]'), null);
        assert.equal(container.querySelectorAll(".project-links__details").length, 4);
      });
    }
  });

  test(`unknown and undocumented project routes show 404 (${language})`, async () => {
    await i18n.changeLanguage(language);
    for (const slug of ["missing", "filmovie"]) {
      await render(createElement(MemoryRouter, { initialEntries: [`/projects/${slug}`] }, createElement(App)), async (container) => {
        assert.equal(container.querySelector("h1").textContent, i18n.t("errors.notFound.title"));
        assert.equal(container.querySelector(".case-study"), null);
      });
    }
  });
}

for (const mode of ["success", "rejected", "unavailable"]) {
  test(`copy email handles ${mode} without hiding the contact address`, async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis.navigator, "clipboard");
    let copied;
    Object.defineProperty(globalThis.navigator, "clipboard", { configurable: true, value: mode === "unavailable" ? undefined : {
      writeText: async (value) => { if (mode === "rejected") throw new Error("Clipboard denied"); copied = value; },
    } });
    try {
      await render(createElement(MemoryRouter, { initialEntries: ["/contact"] }, createElement(App)), async (container) => {
        const address = container.querySelector(".contact__email");
        await act(async () => container.querySelector(".copy-email button").click());
        assert.equal(container.querySelector('.copy-email [role="status"]').textContent,
          i18n.t(mode === "success" ? "contact.copied" : "contact.copyFailed"));
        assert.equal(address.getAttribute("href"), `mailto:${address.textContent}`);
        assert.equal(container.querySelector(".copy-email button").disabled, false);
        if (mode === "success") assert.equal(copied, address.textContent);
      });
    } finally {
      if (descriptor) Object.defineProperty(globalThis.navigator, "clipboard", descriptor);
      else delete globalThis.navigator.clipboard;
    }
  });
}

async function render(element, inspect) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(element));
    await inspect(container);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}

for (const language of ["pl", "en"]) {
  test(`unknown route shows localized 404 and Home link works (${language})`, async () => {
    await i18n.changeLanguage(language);
    await render(createElement(MemoryRouter, { initialEntries: ["/missing-page"] }, createElement(AppRoutes)), async (container) => {
      assert.equal(container.querySelector("h1").textContent, i18n.t("errors.notFound.title"));
      const link = container.querySelector(`a[href="/${i18n.resolvedLanguage}/"]`);
      assert.ok(link);
      await act(async () => link.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
      assert.equal(container.querySelector("h1").textContent, i18n.t("home.heroTitle"));
      assert.deepEqual([...container.querySelectorAll(".home__projects__name")].map((node) => node.textContent), [
        "Moje Atelier", "Wióry Lecą!", "Formularz Zjazd SLO", "ImageInary",
      ]);
    });
  });

  test(`render error shows recovery UI and releases scroll locks (${language})`, async (context) => {
    await i18n.changeLanguage(language);
    context.mock.method(console, "error", () => {});
    function BrokenComponent() { throw new Error("Deliberate test render failure"); }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    await render(createElement(ErrorBoundary, null, createElement(BrokenComponent)), (container) => {
      assert.equal(container.querySelector('[role="alert"] h1').textContent, i18n.t("errors.render.title"));
      assert.equal(container.querySelector("button").textContent, i18n.t("errors.reload"));
      assert.ok(container.querySelector('a[href^="mailto:"]'));
      assert.equal(document.body.style.overflow, "");
      assert.equal(document.documentElement.style.overflow, "");
      assert.ok(!container.textContent.includes("Deliberate test render failure"));
    });
  });
}

test("unknown technology renders readable text instead of an empty SVG", async () => {
  await render(createElement(TechnologyIcon, { name: "New technology", className: "icon" }), (container) => {
    assert.equal(container.textContent, "New technology");
    assert.equal(container.querySelector("svg"), null);
  });
});

test("legacy hash URLs and regional language preferences resolve to local canonical paths", () => {
  const { initialTarget, normalizeLanguage } = paths;
  assert.equal(normalizeLanguage("pl-PL"), "pl");
  assert.equal(normalizeLanguage("en-US"), "en");
  assert.equal(normalizeLanguage("de-DE"), undefined);
  for (const [url, language, expected] of [
    ["https://example.com/", "en", "/en/"],
    ["https://example.com/pl/about/", "en", null],
    ["https://example.com/#/projects", "en", "/en/projects/"],
    ["https://example.com/?from=old#/about", "pl", "/pl/about/?from=old"],
    ["https://example.com/#/projects/moje-atelier?ref=old#case-scope", "en", "/en/projects/moje-atelier/?ref=old#case-scope"],
    ["https://example.com/#/en/contact", "pl", "/en/contact/"],
    ["https://example.com/#/missing", "pl", "/pl/missing/"],
    ["https://example.com/en/projects", "pl", "/en/projects/"],
    ["https://example.com/en/about/index.html", "pl", "/en/about/"],
    ["https://example.com/en/missing/", "pl", null],
    ["https://example.com/#//evil.example/", "en", null],
  ]) assert.equal(initialTarget(new URL(url), language), expected, url);
});

test("URL language wins over stored preference; language links preserve the page and browser history", async () => {
  await i18n.changeLanguage("pl");
  window.localStorage.setItem("i18nextLng", "pl-PL");
  function Back() {
    const navigate = useNavigate();
    return createElement("button", { id: "history-back", onClick: () => navigate(-1) }, "Back");
  }
  await render(createElement(MemoryRouter, { initialEntries: ["/en/projects/moje-atelier/?ref=language#case-scope"] },
    createElement(App), createElement(Back)), async (container) => {
    assert.equal(document.documentElement.lang, "en");
    assert.equal(container.querySelector("h1").textContent, "Moje Atelier");
    const polish = container.querySelector('a[lang="pl"]');
    assert.equal(polish.getAttribute("href"), "/pl/projects/moje-atelier/?ref=language#case-scope");
    assert.equal(container.querySelector('nav a[href="/en/"]').getAttribute("aria-current"), null);
    assert.equal(container.querySelector('nav a[href="/en/projects/"]').getAttribute("aria-current"), "page");
    const englishTitle = document.title;
    await act(async () => polish.click());
    assert.equal(document.documentElement.lang, "pl");
    assert.equal(window.localStorage.getItem("i18nextLng"), "pl");
    assert.notEqual(document.title, englishTitle);
    assert.equal(document.head.querySelectorAll('meta[name="description"]').length, 1);
    assert.equal(document.head.querySelectorAll("title").length, 1);
    await act(async () => container.querySelector("#history-back").click());
    assert.equal(document.documentElement.lang, "en");
    assert.equal(document.title, englishTitle);
    assert.equal(window.localStorage.getItem("i18nextLng"), "en");
  });
});

for (const reduced of [true, false]) {
  test(`prerendered content hydrates without mismatches and preserves intro (reduced motion: ${reduced})`, async (context) => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.matches = reduced;
    const warnings = [];
    context.mock.method(console, "error", (...args) => warnings.push(args.join(" ")));
    try {
      const routes = reduced ? paths.languages.flatMap((lang) => paths.contentPaths.map((path) => paths.localizedPath(lang, path))) : ["/pl/", "/en/"];
      for (const route of routes) {
        const html = renderPage(route).html;
        const container = document.createElement("div");
        container.innerHTML = html;
        document.body.append(container);
        assert.equal(container.querySelector("[inert], .intro"), null);
        const heading = container.querySelector("h1");
        const errors = [];
        let root;
        try {
          await act(async () => {
            root = hydrateRoot(container, createElement(MemoryRouter, { initialEntries: [route] }, createElement(App)), { onRecoverableError: (error) => errors.push(error.message) });
          });
          assert.deepEqual(errors, [], route);
          assert.equal(container.querySelector("h1"), heading, "hydration must preserve the server-rendered DOM");
          assert.equal(Boolean(container.querySelector(".intro")), !reduced);
          if (!reduced) {
            assert.ok(container.querySelector("[inert]"));
            await act(async () => container.querySelector(".intro__skip").click());
            assert.equal(container.querySelector("[inert]"), null);
            assert.equal(document.activeElement, container.querySelector("main"));
          }
        } finally {
          if (root) await act(async () => root.unmount());
          container.remove();
        }
      }
      assert.deepEqual(warnings, []);
    } finally { preference.matches = true; }
  });
}

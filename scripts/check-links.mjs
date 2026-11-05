import { readFile, writeFile } from "node:fs/promises";

const projects = JSON.parse(await readFile(new URL("../src/assets/projects.json", import.meta.url), "utf8"));
const profile = JSON.parse(await readFile(new URL("../src/config/profile.json", import.meta.url), "utf8"));
const links = projects.flatMap((project) => [
  { label: `${project.title}: demo`, url: project.live },
  { label: `${project.title}: code`, url: project.github, private: project.githubPrivate },
]);
links.push({ label: "GitHub profile", url: profile.github }, { label: "LinkedIn", url: profile.linkedin });
const results = new Array(links.length);
let next = 0;

async function check(link) {
  if (link.private) return { ...link, result: "private-skip" };
  try {
    const response = await fetch(link.url, {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "PortfolioLinkCheck/1.0", Accept: "text/html" },
    });
    await response.body?.cancel();
    const result = response.ok && response.url.startsWith("https://") ? "ok"
      : [401, 403, 429, 999].includes(response.status) ? "needs-review" : "failed";
    return { ...link, result, status: response.status, finalUrl: response.url };
  } catch (error) {
    return { ...link, result: "needs-review", error: error.cause?.code ?? error.name };
  }
}

await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < links.length) {
    const index = next++;
    results[index] = await check(links[index]);
  }
}));
console.table(results.map(({ label, result, status, error }) => ({ label, result, status, error })));
console.log("HTTP availability only; no forms, email or phone calls were submitted. Authentication, rate limits and network failures need manual review.");
const reportIndex = process.argv.indexOf("--report");
if (reportIndex >= 0) {
  const path = process.argv[reportIndex + 1];
  if (!path) throw new Error("--report requires a path");
  await writeFile(path, JSON.stringify({ results }, null, 2) + "\n");
}
if (results.some(({ result }) => result === "failed")) process.exitCode = 1;

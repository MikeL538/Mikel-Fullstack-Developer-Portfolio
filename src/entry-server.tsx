import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { languageFromPath, languages, contentPaths, localizedPath } from "./routing/paths";
import { metadata, renderHead } from "./seo/metadata";
import { site } from "./config/site";

export { site, metadata, renderHead };
export const routes = languages.flatMap((language) => contentPaths.map((path) => localizedPath(language, path)));
export function render(path: string) {
  const language = languageFromPath(path) ?? "pl";
  return { language, html: renderToString(<StaticRouter location={path}><App /></StaticRouter>), head: renderHead(metadata(path, language)) };
}

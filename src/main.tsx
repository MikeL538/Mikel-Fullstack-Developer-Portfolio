import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initialTarget, normalizeLanguage } from "./routing/paths";

let savedLanguage: string | null = null;
try { savedLanguage = window.localStorage.getItem("i18nextLng"); } catch { /* Storage is optional. */ }
const language = normalizeLanguage(savedLanguage) ?? normalizeLanguage(navigator.language) ?? "pl";
const target = initialTarget(new URL(window.location.href), language);
if (target) {
  window.location.replace(target);
} else {
  const root = document.getElementById("root")!;
  const app = <React.StrictMode><BrowserRouter><ErrorBoundary><App /></ErrorBoundary></BrowserRouter></React.StrictMode>;
  if (root.dataset.route === window.location.pathname) hydrateRoot(root, app);
  else createRoot(root).render(app);
}

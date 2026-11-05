import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../routing/paths";
import { metadata } from "../seo/metadata";

export default function Seo() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage) ?? "pl";
  useEffect(() => {
    document.documentElement.lang = language;
    try { window.localStorage.setItem("i18nextLng", language); } catch { /* Navigation also works without storage. */ }
    document.head.querySelectorAll("[data-seo]").forEach((element) => element.remove());
    for (const { tag, attrs = {}, text } of metadata(pathname, language)) {
      const element = document.createElement(tag);
      element.setAttribute("data-seo", "");
      for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
      if (text) element.textContent = text;
      document.head.append(element);
    }
  }, [pathname, language]);
  return null;
}

import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import type { Language } from "../routing/paths";
import pl from "./locales/pl.json";
import en from "./locales/en.json";

const options = {
  resources: { pl: { translation: pl }, en: { translation: en } },
  fallbackLng: "pl",
  supportedLngs: ["pl", "en"],
  load: "languageOnly" as const,
  initAsync: false,
  interpolation: { escapeValue: false },
};

// A separate instance per language prevents state leaking between prerendered pages.
export function createPortfolioI18n(language: Language) {
  const instance = createInstance();
  void instance.init({ ...options, lng: language });
  return instance;
}

const instances = { pl: createPortfolioI18n("pl"), en: createPortfolioI18n("en") };
export function getLanguageInstance(language: Language) { return instances[language]; }

const i18n = createInstance();
void i18n.use(initReactI18next).init({ ...options, lng: "pl" });
export default i18n;

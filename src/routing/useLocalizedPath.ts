import { useTranslation } from "react-i18next";
import { localizedPath, normalizeLanguage } from "./paths";

export function useLocalizedPath() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage) ?? "pl";
  return (path: string) => localizedPath(language, path);
}

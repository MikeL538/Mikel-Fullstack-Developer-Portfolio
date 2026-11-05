import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n, { getLanguageInstance } from "./i18n/i18n";
import { languageFromPath, normalizeLanguage } from "./routing/paths";
import Seo from "./components/Seo";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import IntroOverlay from "./components/IntroOverlay";

export default function App() {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname) ?? normalizeLanguage(i18n.resolvedLanguage) ?? "pl";
  return <I18nextProvider i18n={getLanguageInstance(language)}><AppContent /></I18nextProvider>;
}

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function AppContent() {
  // SSR and the first hydration render show usable content. Intro starts on the client.
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [introDone, setIntroDone] = useState(() => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const showIntro = hydrated && !introDone;
  const playedIntro = useRef(!introDone);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    if (introDone && playedIntro.current) {
      playedIntro.current = false;
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }
  }, [introDone]);

  return (
    <>
      <Seo />
      {showIntro && <IntroOverlay onDone={handleIntroDone} word={"Hello,\u00A0\u00A0World!\u00A0\u00A0:)"} />}
      <div inert={showIntro}>
        <MainLayout>
          <AppRoutes />
          <ScrollToTop />
        </MainLayout>
      </div>
    </>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import IntroOverlay from "./components/IntroOverlay";

export default function App() {
  const [introDone, setIntroDone] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
      {!introDone && <IntroOverlay onDone={handleIntroDone} word={"Hello,\u00A0\u00A0World!\u00A0\u00A0:)"} />}
      <div inert={!introDone}>
        <MainLayout>
          <AppRoutes />
          <ScrollToTop />
        </MainLayout>
      </div>
    </>
  );
}

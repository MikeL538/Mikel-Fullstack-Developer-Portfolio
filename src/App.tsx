import { Routes, Route } from "react-router-dom";
import { useCallback, useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import IntroOverlay from "./components/IntroOverlay";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setIntroDone(true);
    requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
  }, []);

  return (
    <MainLayout introDone={introDone}>
      {!introDone && (
        <IntroOverlay onDone={handleIntroDone} word="WELCOME" />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <ScrollToTop />
    </MainLayout>
  );
}

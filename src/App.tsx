import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Lang from "./pages/Lang";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/lang" element={<Lang />} /> */}
      </Routes>
    </MainLayout>
  );
}

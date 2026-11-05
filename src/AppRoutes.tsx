import { Route, Routes, useLocation } from "react-router-dom";
import { contentPath } from "./routing/paths";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

export default function AppRoutes() {
  const location = useLocation();
  return (
    <Routes location={{ ...location, pathname: contentPath(location.pathname) }}>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

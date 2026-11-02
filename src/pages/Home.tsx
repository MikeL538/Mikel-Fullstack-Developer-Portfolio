import { useState } from "react";
import type { Project } from "../types/project";
import HomeHero from "../components/HomeHero";
import HomeSkills from "../components/HomeSkills";
import HomeProjects from "../components/HomeProjects";
import ImageModal from "../components/ImageModal";
import LightBubbles from "../components/LightBubbles";

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <section className="home">
        <HomeHero />
        <HomeSkills />
        <HomeProjects onImageClick={setActiveProject} />
        <ImageModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      </section>
      <LightBubbles />
    </>
  );
}

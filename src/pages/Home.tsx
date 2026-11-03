import { useState } from "react";
import type { Project } from "../types/project";
import HomeHero from "../components/HomeHero";
import HomeSkills from "../components/HomeSkills";
import HomeProjects from "../components/HomeProjects";
import ImageModal from "../components/ImageModal";
import HomeAbout from "../components/HomeAbout";
import HomeContact from "../components/HomeContact";

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <div className="home">
        <HomeHero />
        <HomeProjects onImageClick={setActiveProject} />
        <HomeSkills />
        <HomeAbout />
        <HomeContact />
        <ImageModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      </div>
    </>
  );
}

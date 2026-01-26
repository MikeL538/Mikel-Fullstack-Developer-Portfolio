import { useState } from "react";
// import projects from "../assets/projects.json";
import HomeHero from "../components/HomeHero";
import HomeSkills from "../components/HomeSkills";
import HomeProjects from "../components/HomeProjects";
import ImageModal from "../components/ImageModal";

export default function Home() {
  const [activeProject, setActiveProject] = useState<any>(null);

  return (
    <>
      <div className="home">
        <HomeHero />
        <HomeSkills />
        <HomeProjects onImageClick={setActiveProject} />
        <ImageModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      </div>
    </>
  );
}

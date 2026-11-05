import { projects } from "../data/projects";
import type { Project } from "../types/project";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";

export default function ProjectsList({ onImageClick }: { onImageClick: (project: Project) => void }) {
  const { t } = useTranslation();
  return (
    <div className="projects__container">
      <h1 className="projects__title">{t("projects.title")}</h1>
      <ul className="projects__list">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} variant="list" onImageClick={onImageClick} eager={index === 0} />
        ))}
      </ul>
    </div>
  );
}

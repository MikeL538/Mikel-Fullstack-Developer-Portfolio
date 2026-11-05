import { useLocalizedPath } from "../routing/useLocalizedPath";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { featuredProjects } from "../data/projects";
import type { Project } from "../types/project";
import ProjectCard from "./ProjectCard";

export default function HomeProjects({ onImageClick }: { onImageClick: (project: Project) => void }) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  return (
    <section className="home__projects" aria-labelledby="projects">
      <div className="home__projects__container">
        <p className="home__eyebrow">{t("home.projectsEyebrow")}</p>
        <h2 id="projects" tabIndex={-1} className="home__projects__title home__section-title">{t("home.projectsTitle")}</h2>
        <p className="home__section-description">{t("home.projectsDescription")}</p>
        <ul className="home__projects__list">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="home" onImageClick={onImageClick} />
          ))}
        </ul>
        <div className="home__projects__button-wrapper">
          <Link className="home__projects__button home__button home__button--secondary" to={localize("/projects")}>{t("home.projectsMore")}</Link>
        </div>
      </div>
    </section>
  );
}

import { projects } from "../data/projects";
import type { Project } from "../types/project";
import { assetUrl } from "../utils/assetUrl";
import { getTechnology } from "../constants/techIcons";
import icons from "../assets/icons.svg";
import { useTranslation } from "react-i18next";

export default function ProjectsList({
  onImageClick,
}: {
  onImageClick: (project: Project) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="projects__container">
      <h1 className="projects__title">{t("projects.title")}</h1>
      <ul className="projects__list">
        {projects.map((project) => (
          <li key={project.id} className="projects__item">
            <div className="projects__list-container">
              <button type="button" className="project-preview project-preview--list"
                aria-label={t("accessibility.openPreview", { title: project.title })}
                aria-haspopup="dialog" onClick={(event) => {
                  event.currentTarget.focus();
                  onImageClick(project);
                }}>
              <img
                className="projects__image"
                loading="lazy"
                src={assetUrl(project.image)}
                alt=""
              />
              </button>
              <div className="projects__list-text">
                <h2 className="projects__name">{project.title}</h2>
                {project.status === "inProgress" && (
                  <p className="project-status">{t("projects.status.inProgress")}</p>
                )}
                <p className="projects__description">
                  {t(project.descriptionLongKey)}
                </p>

                <ul className="projects__list-tech">
                  {project.tech.map((tech) => (
                    <li key={tech}>{getTechnology(tech).label}</li>
                  ))}
                </ul>
                <div className="projects__links-container">
                  <a
                    className="projects__links"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.live}
                  >
                    <span>{`${project.live}`}</span>
                    <svg className="projects__links-svg git-links" aria-hidden="true">
                      <use href={`${icons}#www`} />
                    </svg>
                  </a>
                  <a
                    className="projects__links"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.github}
                    title={project.githubPrivate ? t("projects.privateRepository") : undefined}
                  >
                    <span>
                      {project.githubPrivate
                        ? `GitHub — ${t("projects.privateRepository")}`
                        : project.github}
                    </span>
                    <svg className="projects__links-svg git-links" aria-hidden="true">
                      <use href={`${icons}#github`} />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

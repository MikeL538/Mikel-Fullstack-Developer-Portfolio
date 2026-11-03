import { NavLink } from "react-router-dom";
import { featuredProjects } from "../data/projects";
import type { Project } from "../types/project";
import icons from "../assets/icons.svg";
import { getTechnology } from "../constants/techIcons";
import TechnologyIcon from "./TechnologyIcon";
import { assetUrl } from "../utils/assetUrl";
import { useTranslation } from "react-i18next";

export default function HomeProjects({
  onImageClick,
}: {
  onImageClick: (project: Project) => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="home__projects" aria-labelledby="projects">
      <div className="home__projects__container">
        <p className="home__eyebrow">{t("home.projectsEyebrow")}</p>
        <h2 id="projects" tabIndex={-1} className="home__projects__title home__section-title">
          {t("home.projectsTitle")}
        </h2>
        <p className="home__section-description">{t("home.projectsDescription")}</p>
        <ul className="home__projects__list">
          {featuredProjects.map((project) => (
            <li key={project.id} className="home__projects__item">
              <button
                type="button"
                className="project-preview project-preview--home"
                aria-label={t("accessibility.openPreview", { title: project.title })}
                aria-haspopup="dialog"
                onClick={(event) => {
                  event.currentTarget.focus();
                  onImageClick(project);
                }}
              >
                <img
                  className="home__projects__image"
                  loading="lazy"
                  src={assetUrl(project.image)}
                  alt=""
                />
              </button>
              <div className="home__projects__list-container">
                <h3 className="home__projects__name">{project.title}</h3>
                {project.status === "inProgress" && (
                  <p className="project-status">{t("projects.status.inProgress")}</p>
                )}
                <p className="home__projects__description">
                  {t(project.descriptionKey)}
                </p>

                <ul className="home__projects__list-tech">
                  {project.tech.map((tech) => (
                    <li key={tech}>
                      <div className="home__projects__icon-wrapper">
                        <TechnologyIcon name={tech} className="home__projects__icon-tech" />
                        <span className="home__projects__tech-name">{getTechnology(tech).label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="home__projects__links-container">
                  <a
                    className="home__projects__links"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.live}
                    aria-label={t("accessibility.liveProject", { title: project.title })}
                  >
                    <svg className="home__projects__links-svg git-links" aria-hidden="true">
                      <use href={`${icons}#www`} className="git-links" />
                    </svg>
                    <span>{t("projects.viewLive")}</span>
                  </a>
                  {project.githubPrivate ? (
                    <span className="home__projects__private">{t("projects.privateRepository")}</span>
                  ) : (
                    <a
                      className="home__projects__links"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={project.github}
                      aria-label={t("accessibility.projectCode", { title: project.title })}
                    >
                      <svg className="home__projects__links-svg git-links" aria-hidden="true">
                        <use href={`${icons}#github`} />
                      </svg>
                      <span>{t("projects.viewCode")}</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="home__projects__button-wrapper">
          <NavLink
            className="home__projects__button home__button home__button--secondary"
            to="/projects"
          >
            {t("home.projectsMore")}
          </NavLink>
        </div>
      </div>
    </section>
  );
}

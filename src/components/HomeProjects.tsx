import { NavLink } from "react-router-dom";
import projects from "../assets/projects.json";
import icons from "../assets/icons.svg";
import { techIcons } from "../constants/techIcons";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.BASE_URL;

export default function HomeProjects({
  onImageClick,
}: {
  onImageClick: (project: any) => void;
}) {
  const projectsJson = projects.filter((p) => p.featured);

  const { t } = useTranslation();

  return (
    <section className="home__projects">
      <div className="home__projects__container">
        <h2 id="projects" className="home__projects__title">
          {t("home.projectsTitle")}
        </h2>
        <ul className="home__projects__list">
          {projectsJson.map((project) => (
            <li key={project.id} className="home__projects__item">
              <img
                className="home__projects__image"
                loading="lazy"
                src={BASE_URL + project.image}
                alt={project.title}
                data-set={project.id}
                onClick={() => onImageClick(project)}
              />
              <div className="home__projects__list-container">
                <h3 className="home__projects__name">{project.title}</h3>
                <p className="home__projects__description">
                  {t(project.descriptionKey)}
                </p>

                <ul className="home__projects__list-tech">
                  {project.tech.map((tech) => (
                    <li key={tech}>
                      <div className="home__projects__icon-wrapper">
                        <svg className="home__projects__icon-tech">
                          <use href={techIcons[tech]} />
                        </svg>
                        <div className="home__projects__icon-tech--name">
                          <p>{tech}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="home__projects__links-container">
                  <a
                    className="home__projects__links"
                    target="_blank"
                    href={project.live}
                  >
                    <svg className="home__projects__links-svg git-links">
                      <use href={`${icons}#www`} className="git-links" />
                    </svg>
                  </a>
                  <a
                    className="home__projects__links"
                    target="_blank"
                    href={project.github}
                  >
                    <svg className="home__projects__links-svg git-links">
                      <use href={`${icons}#github`} />
                    </svg>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="home__projects__button-wrapper">
          <NavLink
            className="home__projects__button"
            onClick={() => {
              document.getElementById("header")?.scrollIntoView({
                behavior: "instant",
              });
            }}
            to="/projects"
          >
            {t("home.projectsMore")}
          </NavLink>
        </div>
      </div>
    </section>
  );
}

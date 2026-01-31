import { NavLink } from "react-router-dom";
import projects from "../assets/projects.json";
import icons from "../assets/icons.svg";

const BASE_URL = import.meta.env.BASE_URL;

export default function HomeProjects({
  onImageClick,
}: {
  onImageClick: (project: any) => void;
}) {
  const projectsJson = projects.filter((p) => p.featured);

  return (
    <section className="home__projects">
      <div className="home__projects__container">
        <h2 id="projects" className="home__projects__title">
          Projects
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
                  {project.description}
                </p>

                <ul className="home__projects__list-tech">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div className="home__projects__links-container">
                  <a
                    className="home__projects__links"
                    target="_blank"
                    href={project.live}
                  >
                    <svg className="home__projects__links-svg git-links">
                      <use href={`${icons}#icon-www`} className="git-links" />
                    </svg>
                  </a>
                  <a
                    className="home__projects__links"
                    target="_blank"
                    href={project.github}
                  >
                    <svg className="home__projects__links-svg git-links">
                      <use href={`${icons}#icon-github`} />
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
            More Projects
          </NavLink>
        </div>
      </div>
    </section>
  );
}

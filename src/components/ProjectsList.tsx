import projects from "../assets/projects.json";
import icons from "../assets/icons.svg";

const BASE_URL = import.meta.env.BASE_URL;

export default function ProjectsList({
  onImageClick,
}: {
  onImageClick: (project: any) => void;
}) {
  //   const projectsJson = projects.filter((p) => p.featured);

  return (
    <div className="projects__container">
      <h2 className="projects__title">Projects</h2>
      <ul className="projects__list">
        {projects.map((project) => (
          <li key={project.id} className="projects__item">
            <div className="projects__list-container">
              <img
                className="projects__image"
                loading="lazy"
                src={BASE_URL + project.image}
                alt={project.title}
                onClick={() => onImageClick(project)}
              />
              <div className="projects__list-text">
                <h3 className="projects__name">{project.title}</h3>
                <p className="projects__description">
                  {project.descriptionLong}
                </p>

                <ul className="projects__list-tech">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div className="projects__links-container">
                  <a
                    className="projects__links"
                    target="_blank"
                    href={project.live}
                  >
                    <svg className="projects__links-svg git-links">
                      <use href={`${icons}#icon-www`} />
                    </svg>
                  </a>
                  <a
                    className="projects__links"
                    target="_blank"
                    href={project.github}
                  >
                    <svg className="projects__links-svg git-links">
                      <use href={`${icons}#icon-github`} />
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

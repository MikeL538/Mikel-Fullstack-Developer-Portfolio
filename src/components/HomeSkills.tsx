import { useLocalizedPath } from "../routing/useLocalizedPath";
import { useTranslation } from "react-i18next";
import { featuredProjects } from "../data/projects";
import capabilities from "../assets/skills.json";
import { getTechnology } from "../constants/techIcons";
import { Link } from "react-router-dom";

export default function HomeSkills() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  return (
    <section className="home__skills" aria-labelledby="home-skills-title">
      <p className="home__eyebrow">{t("home.skillsEyebrow")}</p>
      <h2 id="home-skills-title" className="home__section-title">{t("home.skills")}</h2>
      <ul className="home__skills__list">
        {capabilities.map(({ key, projectSlug, tech }, index) => {
          const project = featuredProjects.find((item) => item.slug === projectSlug);
          return (
            <li key={key} className="home__skills__item">
              <span className="home__skills__number" aria-hidden="true">0{index + 1}</span>
              <h3>{t(`home.capabilities.${key}.title`)}</h3>
              <p>{t(`home.capabilities.${key}.description`)}</p>
              <ul className="skill-technologies" aria-label={t("projects.technologies")}>
                {tech.map((name) => <li key={name}>{getTechnology(name).label}</li>)}
              </ul>
              {project && <Link className="home__text-link" to={localize(`/projects/${project.slug}`)}
                aria-label={t("accessibility.projectDetails", { title: project.title })}>
                {project.title} <span aria-hidden="true">↗</span>
              </Link>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

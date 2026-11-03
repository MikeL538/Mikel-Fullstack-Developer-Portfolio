import { useTranslation } from "react-i18next";
import { featuredProjects } from "../data/projects";

// Each capability points to a real featured project; titles stay in project data.
const capabilities = [
  { key: "interfaces", slug: "moje-atelier" },
  { key: "data", slug: "zjazd-slo" },
  { key: "integrations", slug: "imageinary" },
] as const;

export default function HomeSkills() {
  const { t } = useTranslation();

  return (
    <section className="home__skills" aria-labelledby="home-skills-title">
      <p className="home__eyebrow">{t("home.skillsEyebrow")}</p>
      <h2 id="home-skills-title" className="home__section-title">{t("home.skills")}</h2>
      <ul className="home__skills__list">
        {capabilities.map(({ key, slug }, index) => {
          const project = featuredProjects.find((item) => item.slug === slug);
          return (
            <li key={key} className="home__skills__item">
              <span className="home__skills__number" aria-hidden="true">0{index + 1}</span>
              <h3>{t(`home.capabilities.${key}.title`)}</h3>
              <p>{t(`home.capabilities.${key}.description`)}</p>
              {project && <a className="home__text-link" href={project.live} target="_blank" rel="noopener noreferrer"
                aria-label={t("accessibility.liveProject", { title: project.title })}>
                {project.title} <span aria-hidden="true">↗</span>
              </a>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

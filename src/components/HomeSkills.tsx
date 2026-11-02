import { useTranslation } from "react-i18next";
import { getTechnology } from "../constants/techIcons";
import TechnologyIcon from "./TechnologyIcon";

const skills = [
  "HTML", "SCSS", "JavaScript", "TypeScript", "React", "Vite",
  "SQL", "PostgreSQL", "Supabase", "Node.js", "Git", "Figma",
];

export default function HomeSkills() {
  const { t } = useTranslation();

  return (
    <section className="home__skills__container">
      <h2 className="home__skills__title">{t("home.skills")}</h2>
      <ul className="home__skills__list">
        {skills.map((name) => (
          <li key={name}>
            <TechnologyIcon name={name} className="home__skills-image" />
            {getTechnology(name).label}
          </li>
        ))}
      </ul>
    </section>
  );
}

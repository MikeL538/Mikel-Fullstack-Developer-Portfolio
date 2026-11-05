import { useTranslation } from "react-i18next";
import { getTechnology } from "../constants/techIcons";
import TechnologyIcon from "./TechnologyIcon";

export default function TechList({ technologies, variant }: {
  technologies: readonly string[];
  variant: "home" | "list" | "detail";
}) {
  const { t } = useTranslation();
  const className = variant === "home" ? "home__projects__list-tech" : variant === "list" ? "projects__list-tech" : "case-study__tech";
  return <ul className={className} aria-label={t("projects.technologies")}>
    {technologies.map((name) => <li key={name}>
      {variant === "home" ? <div className="home__projects__icon-wrapper">
        <TechnologyIcon name={name} className="home__projects__icon-tech" />
        <span className="home__projects__tech-name">{getTechnology(name).label}</span>
      </div> : getTechnology(name).label}
    </li>)}
  </ul>;
}

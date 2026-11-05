import { useTranslation } from "react-i18next";
import type { Project } from "../types/project";
import ProjectLinks from "./ProjectLinks";
import ProjectMeta from "./ProjectMeta";
import ResponsiveImage from "./ResponsiveImage";
import TechList from "./TechList";

export default function ProjectCard({ project, variant, onImageClick, eager = false }: {
  project: Project;
  variant: "home" | "list";
  onImageClick: (project: Project) => void;
  eager?: boolean;
}) {
  const { t } = useTranslation();
  const home = variant === "home";
  const prefix = home ? "home__projects" : "projects";
  const Heading = home ? "h3" : "h2";
  const content = <>
    <button type="button" className={`project-preview project-preview--${variant}`}
      aria-label={t("accessibility.openPreview", { title: project.title })}
      aria-haspopup="dialog"
      onClick={(event) => { event.currentTarget.focus(); onImageClick(project); }}>
      <ResponsiveImage className={`${prefix}__image`} source={project.image} alt=""
        loading={eager ? "eager" : "lazy"} decoding="async"
        sizes={home ? "(max-width: 767px) calc(100vw - 32px), (max-width: 1224px) calc((100vw - 72px) / 2), 564px" : "(max-width: 767px) calc(100vw - 16px), (max-width: 1079px) 644px, 450px"} />
    </button>
    <div className={home ? "home__projects__list-container" : "projects__list-text"}>
      <ProjectMeta project={project} />
      <Heading className={`${prefix}__name`}>{project.title}</Heading>
      <p className={`${prefix}__description`}>{t(home ? project.descriptionKey : project.descriptionLongKey)}</p>
      <TechList technologies={home ? project.featuredTech ?? project.tech : project.tech} variant={variant} />
      <ProjectLinks project={project} />
    </div>
  </>;
  return <li className={`${prefix}__item`}>
    {home ? content : <div className="projects__list-container">{content}</div>}
  </li>;
}

import { useLocalizedPath } from "../routing/useLocalizedPath";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { projects } from "../data/projects";
import TechList from "../components/TechList";
import ResponsiveImage from "../components/ResponsiveImage";
import type { Project } from "../types/project";
import ProjectLinks from "../components/ProjectLinks";
import ProjectMeta from "../components/ProjectMeta";
import HomeContact from "../components/HomeContact";
import ImageModal from "../components/ImageModal";
import NotFound from "./NotFound";

const sections = ["context", "scope", "decisions", "features", "challenge", "result", "limitations"] as const;

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const project = projects.find((item) => item.slug === slug && item.caseStudyKey);
  if (!project) return <NotFound />;

  return (
    <div className="case-study home">
      <article>
        <Link className="home__text-link" to={localize("/projects")}>← {t("projects.backToProjects")}</Link>
        <ProjectMeta project={project} />
        <h1>{project.title}</h1>
        <p className="case-study__intro">{t(project.descriptionKey)}</p>
        <ProjectLinks project={project} showDetails={false} />
        <TechList technologies={project.tech} variant="detail" />
        <figure className="case-study__figure">
          <button type="button" className="project-preview" aria-haspopup="dialog"
            aria-label={t("accessibility.openPreview", { title: project.title })}
            onClick={(event) => { event.currentTarget.focus(); setActiveProject(project); }}>
            <ResponsiveImage source={project.imageLarge} alt="" decoding="async" sizes="(max-width: 1224px) calc(100vw - 32px), 1160px" />
          </button>
          <figcaption>{t(`${project.caseStudyKey}.imageCaption`)}</figcaption>
        </figure>
        <div className="case-study__sections">
          {sections.map((section) => (
            <section key={section} aria-labelledby={`case-${section}`}>
              <h2 id={`case-${section}`}>{t(`projects.caseStudyLabels.${section}`)}</h2>
              <p>{t(`${project.caseStudyKey}.${section}`)}</p>
            </section>
          ))}
        </div>
      </article>
      <HomeContact />
      <ImageModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}

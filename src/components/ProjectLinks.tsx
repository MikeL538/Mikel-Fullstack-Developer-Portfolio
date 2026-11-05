import { useLocalizedPath } from "../routing/useLocalizedPath";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Project } from "../types/project";

export default function ProjectLinks({ project, showDetails = true }: { project: Project; showDetails?: boolean }) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  return (
    <div className="project-links">
      {showDetails && project.caseStudyKey && (
        <Link className="project-links__details" to={localize(`/projects/${project.slug}`)}
          aria-label={t("accessibility.projectDetails", { title: project.title })}>
          {t("projects.viewDetails")} <span aria-hidden="true">↗</span>
        </Link>
      )}
      <a href={project.live} target="_blank" rel="noopener noreferrer"
        aria-label={t("accessibility.liveProject", { title: project.title })}>
        {t("projects.viewLive")}
      </a>
      {project.githubPrivate ? (
        <span className="project-links__private">{t("projects.privateRepository")}</span>
      ) : (
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          aria-label={t("accessibility.projectCode", { title: project.title })}>
          {t("projects.viewCode")}
        </a>
      )}
    </div>
  );
}

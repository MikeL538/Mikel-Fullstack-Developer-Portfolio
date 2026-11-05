import { useTranslation } from "react-i18next";
import type { Project } from "../types/project";

export default function ProjectMeta({ project }: { project: Project }) {
  const { t } = useTranslation();
  return (
    <div className="project-meta">
      <span>{t(`projects.categories.${project.category}`)}</span>
      <span className={project.status === "inProgress" ? "project-meta__pending" : ""}>
        {t(`projects.status.${project.status}`)}
      </span>
    </div>
  );
}

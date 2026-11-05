import projectData from "../assets/projects.json";
import type { Project, ProjectStatus, ProjectCategory } from "../types/project";

function parseStatus(status: string): ProjectStatus {
  if (status === "completed" || status === "inProgress") return status;
  throw new Error(`Unknown project status: ${status}`);
}

function parseCategory(category: string): ProjectCategory {
  if (category === "business" || category === "utility" || category === "learning") return category;
  throw new Error(`Unknown project category: ${category}`);
}

export const projects: readonly Project[] = projectData.map((project) => ({
  ...project,
  status: parseStatus(project.status),
  category: parseCategory(project.category),
}));

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))
  .slice(0, 4);

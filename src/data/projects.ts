import projectData from "../assets/projects.json";
import type { Project, ProjectStatus } from "../types/project";

function parseStatus(status: string): ProjectStatus {
  if (status === "completed" || status === "inProgress") return status;
  throw new Error(`Unknown project status: ${status}`);
}

export const projects: readonly Project[] = projectData.map((project) => ({
  ...project,
  status: parseStatus(project.status),
}));

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))
  .slice(0, 4);

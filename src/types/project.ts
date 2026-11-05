export type ProjectStatus = "completed" | "inProgress";
export type ProjectCategory = "business" | "utility" | "learning";

export interface Project {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly descriptionKey: string;
  readonly descriptionLongKey: string;
  readonly status: ProjectStatus;
  readonly category: ProjectCategory;
  readonly featuredTech?: readonly string[];
  readonly caseStudyKey?: string;
  readonly tech: readonly string[];
  readonly image: string;
  readonly imageLarge: string;
  readonly github: string;
  readonly githubPrivate: boolean;
  readonly live: string;
  readonly featured: boolean;
  readonly featuredOrder?: number;
}

export type ProjectStatus = "completed" | "inProgress";

export interface Project {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly descriptionKey: string;
  readonly descriptionLongKey: string;
  readonly status: ProjectStatus;
  readonly tech: readonly string[];
  readonly image: string;
  readonly imageLarge: string;
  readonly github: string;
  readonly githubPrivate: boolean;
  readonly live: string;
  readonly featured: boolean;
  readonly featuredOrder?: number;
}

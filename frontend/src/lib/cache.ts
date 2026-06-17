export const REVALIDATE = {
  static: 86_400,
  profile: 3_600,
  skills: 3_600,
  experiences: 3_600,
  education: 3_600,
  certifications: 3_600,
  projects: 1_800,
  project: 3_600,
  articles: 1_800,
  article: 3_600,
} as const;

export const CACHE_TAGS = {
  profile: (locale: string) => `profile-${locale}`,
  skills: (locale: string) => `skills-${locale}`,
  experiences: (locale: string) => `experiences-${locale}`,
  education: (locale: string) => `education-${locale}`,
  certifications: (locale: string) => `certifications-${locale}`,
  projects: (locale: string) => `projects-${locale}`,
  project: (locale: string, slug: string) => `project-${locale}-${slug}`,
  articles: (locale: string) => `articles-${locale}`,
  article: (locale: string, slug: string) => `article-${locale}-${slug}`,
} as const;

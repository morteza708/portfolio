import { CACHE_TAGS, REVALIDATE } from "./cache";
import { getApiUrl, getPublicApiUrl } from "./api-url";

type FetchAPIOptions = RequestInit & {
  revalidate?: number | false;
  tags?: string[];
};

export async function fetchAPI<T>(
  path: string,
  options?: FetchAPIOptions,
): Promise<T | null> {
  const { revalidate = REVALIDATE.profile, tags, ...init } = options ?? {};

  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      next: {
        revalidate: revalidate === false ? 0 : revalidate,
        ...(tags ? { tags } : {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

export interface Profile {
  full_name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  timezone: string;
  availability_status: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  activity_summary_title: string;
  activity_summary_text: string;
  activity_summary_image: string | null;
  github_url: string;
  linkedin_url: string;
  avatar: string | null;
  about_highlights: AboutHighlight[];
}

export interface AboutHighlight {
  title: string;
  description: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  company_url: string;
  order: number;
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number | null;
  end_year: number | null;
  location: string;
  description: string;
  order: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issued_at: string | null;
  credential_url: string;
  skills: string[];
  description: string;
  is_featured: boolean;
  order: number;
}

export type ContactFormErrors = Partial<Record<"name" | "email" | "subject" | "message", string[]>>;

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  tech_stack: string[];
  live_url: string;
  repo_url: string;
  cover_image: string | null;
  cover_image_thumb: string | null;
  is_featured: boolean;
  order: number;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  cover_image: string | null;
  cover_image_thumb: string | null;
  tags: string[];
  published_at: string | null;
  meta_title?: string;
  meta_description?: string;
  translation_group_id?: string | null;
}

export async function getProfile(locale: string) {
  return fetchAPI<Profile>(`/${locale}/profile/`, {
    revalidate: REVALIDATE.profile,
    tags: [CACHE_TAGS.profile(locale)],
  });
}

export async function getProjects(locale: string) {
  return fetchAPI<{ results?: Project[] } | Project[]>(`/${locale}/projects/`, {
    revalidate: REVALIDATE.projects,
    tags: [CACHE_TAGS.projects(locale)],
  });
}

export async function getProject(locale: string, slug: string) {
  return fetchAPI<Project>(`/${locale}/projects/${slug}/`, {
    revalidate: REVALIDATE.project,
    tags: [CACHE_TAGS.project(locale, slug)],
  });
}

export async function getSkills(locale: string) {
  return fetchAPI<{ results?: Skill[] } | Skill[]>(`/${locale}/skills/`, {
    revalidate: REVALIDATE.skills,
    tags: [CACHE_TAGS.skills(locale)],
  });
}

export async function getExperiences(locale: string) {
  return fetchAPI<{ results?: Experience[] } | Experience[]>(`/${locale}/experiences/`, {
    revalidate: REVALIDATE.experiences,
    tags: [CACHE_TAGS.experiences(locale)],
  });
}

export async function getEducation(locale: string) {
  return fetchAPI<{ results?: Education[] } | Education[]>(`/${locale}/education/`, {
    revalidate: REVALIDATE.education,
    tags: [CACHE_TAGS.education(locale)],
  });
}

export async function getCertifications(locale: string) {
  return fetchAPI<{ results?: Certification[] } | Certification[]>(`/${locale}/certifications/`, {
    revalidate: REVALIDATE.certifications,
    tags: [CACHE_TAGS.certifications(locale)],
  });
}

export async function getArticles(locale: string) {
  return fetchAPI<{ results?: Article[] } | Article[]>(`/${locale}/articles/`, {
    revalidate: REVALIDATE.articles,
    tags: [CACHE_TAGS.articles(locale)],
  });
}

export async function getArticle(locale: string, slug: string) {
  return fetchAPI<Article>(`/${locale}/articles/${slug}/`, {
    revalidate: REVALIDATE.article,
    tags: [CACHE_TAGS.article(locale, slug)],
  });
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await fetch(`${getPublicApiUrl()}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    let fieldErrors: ContactFormErrors = {};

    try {
      const body = (await response.json()) as Record<string, string[] | string>;
      for (const key of ["name", "email", "subject", "message"] as const) {
        const value = body[key];
        if (Array.isArray(value)) {
          fieldErrors[key] = value;
        } else if (typeof value === "string") {
          fieldErrors[key] = [value];
        }
      }
    } catch {
      // ignore parse errors
    }

    const error = new Error("Failed to send message") as Error & {
      fieldErrors: ContactFormErrors;
    };
    error.fieldErrors = fieldErrors;
    throw error;
  }

  try {
    return await response.json();
  } catch {
    return { detail: "Message received successfully." };
  }
}

export function normalizeList<T>(data: { results?: T[] } | T[] | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getArticles, getProjects, normalizeList } from "@/lib/api";
import { getSiteUrl } from "@/lib/seo";

const STATIC_PATHS = ["", "/about", "/projects", "/blog", "/contact"] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  for (const locale of routing.locales) {
    const projects = normalizeList(await getProjects(locale));
    for (const project of projects) {
      entries.push({
        url: `${siteUrl}/${locale}/projects/${project.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    const articles = normalizeList(await getArticles(locale));
    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/${locale}/blog/${article.slug}`,
        lastModified: article.published_at ? new Date(article.published_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

import type { Metadata } from "next";
import { getPublicApiUrl } from "@/lib/api-url";
import type { Profile } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function getSiteUrl() {
  return SITE_URL;
}

export function getDefaultOgImage() {
  return `${SITE_URL}/logo/k-mark-512.png`;
}

function toMediaPath(path: string): string | undefined {
  let mediaPath = path;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      mediaPath = new URL(path).pathname;
    } catch {
      return undefined;
    }
  }

  if (!mediaPath.startsWith("/")) {
    mediaPath = `/${mediaPath}`;
  }

  if (mediaPath.startsWith("/django-media/")) {
    mediaPath = mediaPath.replace("/django-media/", "/media/");
  }

  if (!mediaPath.startsWith("/media/")) {
    return undefined;
  }

  return mediaPath;
}

/** URL for <Image> — proxied via Next.js (/media → Django). */
export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  const mediaPath = path ? toMediaPath(path) : undefined;
  if (!mediaPath) return undefined;
  return `${getSiteUrl()}${mediaPath}`;
}

/** Absolute URL for Open Graph / JSON-LD. */
export function resolveMediaAbsoluteUrl(
  path: string | null | undefined,
): string | undefined {
  const mediaPath = path ? toMediaPath(path) : undefined;
  if (!mediaPath) return undefined;

  const apiOrigin = getPublicApiUrl().replace(/\/api\/v1\/?$/, "");
  return `${apiOrigin}${mediaPath}`;
}

type PageMetadataInput = {
  locale: string;
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedAt?: string | null;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  image,
  type = "website",
  publishedAt,
}: PageMetadataInput): Metadata {
  const canonicalPath = `/${locale}${path}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const imageUrl = resolveMediaAbsoluteUrl(image) ?? getDefaultOgImage();
  const alternateLocale = locale === "en" ? "fa" : "en";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        [locale]: canonicalPath,
        [alternateLocale]: `/${alternateLocale}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "kamalian.dev",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type,
      images: [{ url: imageUrl, alt: title }],
      ...(type === "article" && publishedAt ? { publishedTime: publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

type ArticleJsonLdInput = {
  locale: string;
  slug: string;
  title: string;
  description: string;
  publishedAt?: string | null;
  image?: string | null;
  tags?: string[];
};

export function buildArticleJsonLd({
  locale,
  slug,
  title,
  description,
  publishedAt,
  image,
  tags = [],
}: ArticleJsonLdInput) {
  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  const imageUrl = resolveMediaAbsoluteUrl(image);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    datePublished: publishedAt ?? undefined,
    dateModified: publishedAt ?? undefined,
    image: imageUrl ? [imageUrl] : [getDefaultOgImage()],
    keywords: tags.length > 0 ? tags.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: locale === "fa" ? "مرتضی کمالیان" : "Morteza Kamalian",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: locale === "fa" ? "مرتضی کمالیان" : "Morteza Kamalian",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function buildPersonJsonLd(locale: string, profile: Profile | null) {
  const name =
    profile?.full_name ?? (locale === "fa" ? "مرتضی کمالیان" : "Morteza Kamalian");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${SITE_URL}/${locale}`,
    jobTitle: profile?.title,
    description: profile?.tagline,
    email: profile?.email || undefined,
    sameAs: [profile?.github_url, profile?.linkedin_url].filter(Boolean),
    image: resolveMediaAbsoluteUrl(profile?.avatar ?? null) ?? getDefaultOgImage(),
  };
}

type ProjectJsonLdInput = {
  locale: string;
  slug: string;
  title: string;
  description: string;
  techStack?: string[];
  image?: string | null;
  liveUrl?: string;
  repoUrl?: string;
};

export function buildProjectJsonLd({
  locale,
  slug,
  title,
  description,
  techStack = [],
  image,
  liveUrl,
  repoUrl,
}: ProjectJsonLdInput) {
  const url = `${SITE_URL}/${locale}/projects/${slug}`;
  const imageUrl = resolveMediaAbsoluteUrl(image);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    image: imageUrl ? [imageUrl] : [getDefaultOgImage()],
    keywords: techStack.length > 0 ? techStack.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: locale === "fa" ? "مرتضی کمالیان" : "Morteza Kamalian",
      url: SITE_URL,
    },
    ...(liveUrl ? { sameAs: [liveUrl, repoUrl].filter(Boolean) } : {}),
  };
}

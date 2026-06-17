import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { MediaImage } from "@/components/media/MediaImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getArticle, getArticles, normalizeList } from "@/lib/api";
import { buildArticleJsonLd, buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const articles = await getArticles(locale);
    for (const article of normalizeList(articles)) {
      params.push({ locale, slug: article.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(locale, slug);

  if (!article) {
    return {};
  }

  return buildPageMetadata({
    locale,
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    path: `/blog/${slug}`,
    image: article.cover_image,
    type: "article",
    publishedAt: article.published_at,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticle(locale, slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} locale={locale} />;
}

function formatDate(date: string | null, locale: string) {
  if (!date) return null;

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function ArticleDetail({
  article,
  locale,
}: {
  article: NonNullable<Awaited<ReturnType<typeof getArticle>>>;
  locale: string;
}) {
  const t = useTranslations("blog");
  const currentLocale = useLocale();
  const formattedDate = formatDate(article.published_at, currentLocale);
  const jsonLd = buildArticleJsonLd({
    locale,
    slug: article.slug,
    title: article.title,
    description: article.meta_description || article.excerpt,
    publishedAt: article.published_at,
    image: article.cover_image,
    tags: article.tags,
  });

  return (
    <section className="page-shell">
      <JsonLd data={jsonLd} />

      <PageHeader title={article.title} subtitle={article.excerpt} />

      <div className="max-w-3xl">
        {(article.cover_image_thumb || article.cover_image) ? (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
            <MediaImage
              src={article.cover_image}
              thumbSrc={article.cover_image_thumb}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        {formattedDate ? (
          <p className="mb-6 text-sm text-muted">
            <time dateTime={article.published_at ?? undefined}>{formattedDate}</time>
          </p>
        ) : null}

        {article.tags.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="chip-accent font-latin">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <ArticleContent content={article.content ?? ""} />

        <Link
          href="/blog"
          className="mt-8 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
        >
          {t("backToList")}
        </Link>
      </div>
    </section>
  );
}

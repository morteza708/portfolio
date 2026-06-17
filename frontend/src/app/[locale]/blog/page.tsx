import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { getArticles, normalizeList, type Article } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return buildPageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articlesData = await getArticles(locale);
  const articles = normalizeList(articlesData);

  return <BlogContent articles={articles} />;
}

function BlogContent({ articles }: { articles: Article[] }) {
  const t = useTranslations("blog");

  return (
    <section className="page-shell">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {articles.length === 0 ? (
        <div className="glass-panel px-6 py-10 text-center text-muted">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article } from "@/lib/api";

type Props = {
  articles: Article[];
};

export function LatestArticles({ articles }: Props) {
  const t = useTranslations("home");
  const latest = articles.slice(0, 3);

  if (latest.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/70 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t("latestTitle")}</h2>
            <p className="section-subtitle">{t("latestSubtitle")}</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-accent transition hover:text-accent-hover"
          >
            {t("viewAllBlog")} →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

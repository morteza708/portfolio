import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaImage } from "@/components/media/MediaImage";
import type { Article } from "@/lib/api";

type Props = {
  article: Article;
};

function formatDate(date: string | null, locale: string) {
  if (!date) return null;

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function ArticleCard({ article }: Props) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const formattedDate = formatDate(article.published_at, locale);

  return (
    <article className="card-surface group flex h-full flex-col">
      {(article.cover_image_thumb || article.cover_image) ? (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
          <MediaImage
            src={article.cover_image}
            thumbSrc={article.cover_image_thumb}
            preferThumb
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between gap-3 text-xs text-muted">
        {formattedDate ? <time dateTime={article.published_at ?? undefined}>{formattedDate}</time> : <span />}
        <span className="font-latin uppercase tracking-wide text-accent/80">{t("article")}</span>
      </div>

      <h2 className="text-2xl font-semibold transition group-hover:text-accent">
        <Link href={`/blog/${article.slug}`} className="outline-offset-4">
          {article.title}
        </Link>
      </h2>

      <p className="mt-3 flex-1 text-sm leading-7 text-muted">{article.excerpt}</p>

      {article.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="chip-accent font-latin">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <Link
          href={`/blog/${article.slug}`}
          className="text-sm font-semibold text-accent transition hover:text-accent-hover"
        >
          {t("readMore")}
        </Link>
      </div>
    </article>
  );
}

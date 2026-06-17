import { useTranslations } from "next-intl";
import { MediaImage } from "@/components/media/MediaImage";
import type { Profile } from "@/lib/api";

type Props = {
  profile: Profile | null;
};

export function ActivitySummary({ profile }: Props) {
  const t = useTranslations("home");

  const title = profile?.activity_summary_title?.trim() || t("activityTitle");
  const body = profile?.activity_summary_text?.trim() || t("activityBody");

  return (
    <section className="border-t border-border/70 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
          <article className="glass-panel p-6 sm:p-8">
            <h2 className="section-title">{title}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted sm:text-base">{body}</p>
          </article>

          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-lg shadow-accent/10">
            {profile?.activity_summary_image ? (
              <div className="relative aspect-4/3 w-full">
                <MediaImage
                  src={profile.activity_summary_image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </div>
            ) : (
              <div className="summary-placeholder">
                <span className="summary-placeholder__label font-latin">FOCUS</span>
                <p className="summary-placeholder__text">{t("activityPlaceholder")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

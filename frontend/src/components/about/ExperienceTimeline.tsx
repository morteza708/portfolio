import { useLocale, useTranslations } from "next-intl";
import type { Experience } from "@/lib/api";
import { formatMonthYear } from "@/lib/date";

type Props = {
  items: Experience[];
};

export function ExperienceTimeline({ items }: Props) {
  const t = useTranslations("about");
  const locale = useLocale();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="about-section">
      <h2 className="about-section__title">{t("experienceTitle")}</h2>
      <div className="about-timeline">
        {items.map((item) => {
          const period = `${formatMonthYear(item.start_date, locale)} — ${
            item.is_current || !item.end_date
              ? t("present")
              : formatMonthYear(item.end_date, locale)
          }`;

          return (
            <article key={`${item.company}-${item.role}-${item.start_date}`} className="about-timeline__item">
              <div className="about-timeline__marker" aria-hidden="true">
                <span className="about-timeline__dot" />
              </div>
              <div className="about-timeline__card">
                <div className="about-timeline__header">
                  <div>
                    <h3 className="about-timeline__role">{item.role}</h3>
                    {item.company_url ? (
                      <a
                        href={item.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-timeline__company about-timeline__company--link"
                      >
                        {item.company}
                      </a>
                    ) : (
                      <p className="about-timeline__company">{item.company}</p>
                    )}
                  </div>
                  <div className="about-timeline__meta">
                    <time className="font-latin text-xs text-muted">{period}</time>
                    {item.location ? <span className="text-xs text-muted">{item.location}</span> : null}
                    {item.is_current ? <span className="about-timeline__badge">{t("present")}</span> : null}
                  </div>
                </div>
                {item.description ? (
                  <p className="about-timeline__description">{item.description}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import { useLocale, useTranslations } from "next-intl";
import type { Education } from "@/lib/api";
import { formatYearRange } from "@/lib/date";

type Props = {
  items: Education[];
};

export function EducationSection({ items }: Props) {
  const t = useTranslations("about");
  const locale = useLocale();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="about-section">
      <h2 className="about-section__title">{t("educationTitle")}</h2>
      <div className="about-education-grid">
        {items.map((item) => (
          <article key={`${item.institution}-${item.degree}`} className="about-education-card">
            <div className="about-education-card__icon font-latin" aria-hidden="true">
              EDU
            </div>
            <div>
              <h3 className="about-education-card__degree">{item.degree}</h3>
              <p className="about-education-card__institution">{item.institution}</p>
              {item.field_of_study ? (
                <p className="about-education-card__field">{item.field_of_study}</p>
              ) : null}
              <p className="about-education-card__meta font-latin">
                {formatYearRange(item.start_year, item.end_year, locale, t("present"))}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.description ? (
                <p className="about-education-card__description">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

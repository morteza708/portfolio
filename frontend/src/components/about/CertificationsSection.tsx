import { useLocale, useTranslations } from "next-intl";
import type { Certification } from "@/lib/api";
import { formatMonthYear } from "@/lib/date";

type Props = {
  items: Certification[];
};

export function CertificationsSection({ items }: Props) {
  const t = useTranslations("about");
  const locale = useLocale();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="about-section">
      <h2 className="about-section__title">{t("certificationsTitle")}</h2>
      <div className="about-cert-grid">
        {items.map((item) => (
          <article
            key={`${item.name}-${item.issuer}`}
            className={`about-cert-card${item.is_featured ? " about-cert-card--featured" : ""}`}
          >
            <div className="about-cert-card__header">
              <div>
                {item.is_featured ? (
                  <span className="about-cert-card__featured">{t("featuredCert")}</span>
                ) : null}
                <h3 className="about-cert-card__name">{item.name}</h3>
                <p className="about-cert-card__issuer">{item.issuer}</p>
              </div>
              {item.issued_at ? (
                <time className="about-cert-card__date font-latin">
                  {formatMonthYear(item.issued_at, locale)}
                </time>
              ) : null}
            </div>

            {item.description ? <p className="about-cert-card__description">{item.description}</p> : null}

            {item.skills.length > 0 ? (
              <div className="about-cert-card__skills">
                {item.skills.map((skill) => (
                  <span key={skill} className="chip-accent font-latin">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            {item.credential_url ? (
              <a
                href={item.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="about-cert-card__link"
              >
                {t("viewCredential")} →
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

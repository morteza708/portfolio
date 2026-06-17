import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AboutCta() {
  const t = useTranslations("about");

  return (
    <section className="about-cta">
      <div className="about-cta__inner">
        <h2 className="about-cta__title">{t("ctaTitle")}</h2>
        <p className="about-cta__body">{t("ctaBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            {t("ctaButton")}
          </Link>
          <Link href="/projects" className="btn-secondary">
            {t("ctaProjects")}
          </Link>
        </div>
      </div>
    </section>
  );
}

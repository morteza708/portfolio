import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <section className="page-shell flex min-h-[60vh] items-center justify-center">
      <div className="glass-panel max-w-lg px-8 py-12 text-center">
        <p className="font-latin text-6xl font-bold text-accent/30">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t("notFoundTitle")}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{t("notFoundDescription")}</p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          {t("notFoundCta")}
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");

  const labels: Record<Locale, string> = {
    en: t("enShort"),
    fa: t("faShort"),
  };

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className="font-latin flex items-center rounded-full border border-border bg-card/60 p-1 text-xs font-semibold tracking-wide backdrop-blur-sm"
      aria-label={t("switcher")}
    >
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchLocale(item)}
          aria-current={locale === item ? "true" : undefined}
          className={`min-w-[2.5rem] rounded-full px-2.5 py-1.5 transition ${
            locale === item
              ? "bg-accent text-slate-950 shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell flex min-h-[60vh] items-center justify-center">
      <div className="glass-panel max-w-lg px-8 py-12 text-center">
        <p className="font-latin text-6xl font-bold text-red-400/40">500</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t("errorTitle")}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{t("errorDescription")}</p>
        <button type="button" onClick={reset} className="btn-primary mt-8">
          {t("errorRetry")}
        </button>
      </div>
    </section>
  );
}

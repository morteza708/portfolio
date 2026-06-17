"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

export function LocaleHtmlAttributes({ locale }: Props) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}

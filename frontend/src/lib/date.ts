export function formatMonthYear(value: string | null, locale: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function formatYearRange(
  start: number | string | null,
  end: number | string | null,
  locale: string,
  presentLabel: string,
) {
  if (typeof start === "string") {
    const startLabel = formatMonthYear(start, locale);
    const endLabel = end ? formatMonthYear(String(end), locale) : presentLabel;
    return `${startLabel} — ${endLabel}`;
  }

  if (!start && !end) {
    return "";
  }

  const startLabel = start ? String(start) : "";
  const endLabel = end ? String(end) : presentLabel;
  return startLabel && endLabel ? `${startLabel} — ${endLabel}` : startLabel || endLabel;
}

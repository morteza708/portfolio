"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  return children;
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getPreferredTheme());
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  if (!mounted) {
    return (
      <span
        className="inline-flex h-10 w-10 rounded-full border border-border bg-card/70"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground backdrop-blur-sm transition hover:border-accent/40 hover:text-accent"
    >
      {isDark ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

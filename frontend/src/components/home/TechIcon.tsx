"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  icon: string;
  darkIcon?: string;
  darkEnhance?: "django" | "drf" | "nextjs";
};

function readTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function TechIcon({ name, icon, darkIcon, darkEnhance }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setTheme(readTheme());

    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const src = theme === "dark" && darkIcon ? darkIcon : icon;
  const trayClass = darkEnhance ? `tech-card-icon--${darkEnhance}` : "";
  const imageClass = darkEnhance ? `tech-icon--${darkEnhance}` : "";

  return (
    <span className={`tech-card-icon${trayClass ? ` ${trayClass}` : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(src)}
        alt={name}
        width={32}
        height={32}
        loading="lazy"
        className={imageClass || undefined}
      />
    </span>
  );
}

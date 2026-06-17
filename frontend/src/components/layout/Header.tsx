"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo, LogoWordmark } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { SkipLink } from "./SkipLink";
import { ThemeToggle } from "./ThemeProvider";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/projects", key: "projects" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <>
      <SkipLink />
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
        <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="min-w-0 shrink transition hover:opacity-90" aria-label={t("homeLink")}>
            <span className="sm:hidden">
              <Logo className="h-9 w-9" />
            </span>
            <span className="hidden sm:inline-flex">
              <LogoWordmark />
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label={t("mainNav")}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link ${isActive ? "nav-link-active" : "nav-link-idle"}`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              <LanguageSwitcher />
              <Link href="/contact" className="btn-primary px-5 py-2.5 text-sm">
                {t("hireMe")}
              </Link>
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}

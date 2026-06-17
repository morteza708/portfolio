"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeProvider";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/projects", key: "projects" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <span
        className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? "top-[7px] rotate-45" : "top-0"
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? "top-[7px] -rotate-45" : "top-[14px]"
        }`}
      />
    </span>
  );
}

function MobileMenuPanel({
  open,
  animatedIn,
  onClose,
  titleId,
  panelRef,
}: {
  open: boolean;
  animatedIn: boolean;
  onClose: () => void;
  titleId: string;
  panelRef: RefObject<HTMLDivElement | null>;
}) {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tLang = useTranslations("language");
  const tA11y = useTranslations("a11y");
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-[9999] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label={tA11y("closeOverlay")}
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ease-out ${
          animatedIn ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        className={`absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-hidden bg-background pt-[calc(4rem+env(safe-area-inset-top))] shadow-2xl transition-transform duration-300 ease-out ${
          animatedIn ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="container-page flex min-h-0 flex-1 flex-col overflow-y-auto py-6">
          <p id={titleId} className="sr-only">
            {tA11y("menuDialog")}
          </p>

          <nav className="flex flex-col gap-2" aria-label={t("mainNav")}>
            {navItems.map((item, index) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  style={{ transitionDelay: animatedIn ? `${index * 50}ms` : "0ms" }}
                  className={`mobile-nav-item transition-all duration-300 ${
                    animatedIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  } ${isActive ? "mobile-nav-item-active" : "mobile-nav-item-idle"}`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div
            className={`mt-8 space-y-4 border-t border-border pt-6 transition-all duration-300 ${
              animatedIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: animatedIn ? "200ms" : "0ms" }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-muted">{tTheme("label")}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-muted">{tLang("switcher")}</span>
              <LanguageSwitcher />
            </div>
            <Link href="/contact" onClick={onClose} className="btn-primary w-full">
              {t("hireMe")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileMenu() {
  const tA11y = useTranslations("a11y");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animatedIn, setAnimatedIn] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = "mobile-menu-title";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimatedIn(true));
      });
      return;
    }

    setAnimatedIn(false);
    const timer = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable || focusable.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? tA11y("closeMenu") : tA11y("openMenu")}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition hover:border-accent/40 md:hidden ${
          open ? "relative z-[10001]" : ""
        }`}
      >
        <MenuIcon open={open} />
      </button>

      {mounted && visible
        ? createPortal(
            <MobileMenuPanel
              open={open}
              animatedIn={animatedIn}
              onClose={closeMenu}
              titleId={titleId}
              panelRef={panelRef}
            />,
            document.body,
          )
        : null}
    </>
  );
}

import { useTranslations } from "next-intl";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-border/60 ${className}`} aria-hidden="true" />;
}

export default function Loading() {
  const t = useTranslations("errors");

  return (
    <div className="page-shell" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("loading")}</span>
      <div className="max-w-3xl space-y-6">
        <SkeletonBlock className="h-10 w-2/3" />
        <SkeletonBlock className="h-5 w-full max-w-xl" />
        <SkeletonBlock className="mt-8 h-48 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-32" />
        </div>
      </div>
    </div>
  );
}

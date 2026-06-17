import { useTranslations } from "next-intl";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile } from "@/lib/api";

type Props = {
  profile?: Profile | null;
};

export function Footer({ profile }: Props) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-card/40 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="container-page flex flex-col gap-6 py-10">
        {profile ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-muted">{t("connect")}</p>
            <SocialLinks
              email={profile.email}
              githubUrl={profile.github_url}
              linkedinUrl={profile.linkedin_url}
              size="sm"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">
            © {year}{" "}
            <span className="font-latin text-foreground">kamalian.dev</span>
            <span className="mx-2 text-border">·</span>
            {t("rights")}
          </p>
          <p className="text-muted/90">{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}

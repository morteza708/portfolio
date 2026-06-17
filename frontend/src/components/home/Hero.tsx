import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile } from "@/lib/api";
import { HeroVisual } from "./HeroVisual";

type Props = {
  profile: Profile | null;
};

export function Hero({ profile }: Props) {
  const t = useTranslations("home");

  const name = profile?.full_name || t("name");
  const role = profile?.title || t("role");
  const tagline = profile?.tagline || t("tagline");
  const availability = profile?.availability_status || t("availability");
  const primaryCta = profile?.hero_primary_cta?.trim() || t("ctaProjects");
  const secondaryCta = profile?.hero_secondary_cta?.trim() || t("ctaContact");

  return (
    <section className="container-page py-16 sm:py-24 lg:py-28">
      <div className="hero-panel relative overflow-hidden rounded-3xl border border-border/70 p-6 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-s-0 -top-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-e-0 top-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-12">
          <div>
            <p className="badge-soft">{availability}</p>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("greeting")}{" "}
              <span className="text-gradient">{name}</span>
            </h1>

            <p className="mt-5 text-xl font-medium text-foreground/90 sm:text-2xl">{role}</p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">{tagline}</p>

            <div className="mt-8">
              <SocialLinks
                email={profile?.email}
                githubUrl={profile?.github_url}
                linkedinUrl={profile?.linkedin_url}
                size="sm"
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                {primaryCta}
              </Link>
              <Link href="/contact" className="btn-secondary">
                {secondaryCta}
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

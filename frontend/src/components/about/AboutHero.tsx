import { useTranslations } from "next-intl";
import { MediaImage } from "@/components/media/MediaImage";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile } from "@/lib/api";

type Props = {
  profile: Profile | null;
};

export function AboutHero({ profile }: Props) {
  const t = useTranslations("about");

  const name = profile?.full_name || t("fallbackName");
  const title = profile?.title || t("fallbackTitle");
  const tagline = profile?.tagline || t("subtitle");
  const location = profile?.location;
  const timezone = profile?.timezone;

  return (
    <section className="about-hero">
      <div className="about-hero__glow about-hero__glow--left" />
      <div className="about-hero__glow about-hero__glow--right" />

      <div className="about-hero__grid">
        <div className="about-hero__content">
          <div className="about-hero__content-panel">
            <p className="badge-soft">{t("badge")}</p>
            <h1 className="about-hero__name">{name}</h1>
            <p className="about-hero__title">{title}</p>
            <p className="about-hero__tagline">{tagline}</p>

            {location || timezone ? (
              <p className="about-hero__meta">
                {[location, timezone].filter(Boolean).join(" · ")}
              </p>
            ) : null}

            <SocialLinks
              className="mt-6"
              email={profile?.email}
              githubUrl={profile?.github_url}
              linkedinUrl={profile?.linkedin_url}
              size="sm"
            />
          </div>
        </div>

        <div className="about-hero__photo-wrap">
          <div className="about-hero__photo-ring" aria-hidden="true" />
          {profile?.avatar ? (
            <div className="about-hero__photo">
              <MediaImage
                src={profile.avatar}
                alt={name}
                width={640}
                height={800}
                priority
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 80vw, 320px"
              />
            </div>
          ) : (
            <div className="about-hero__photo about-hero__photo--placeholder">
              <span className="font-latin text-5xl font-bold text-accent">
                {name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("") || "MK"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

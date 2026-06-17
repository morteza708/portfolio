import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutHighlights } from "@/components/about/AboutHighlights";
import { CertificationsSection } from "@/components/about/CertificationsSection";
import { EducationSection } from "@/components/about/EducationSection";
import { ExperienceTimeline } from "@/components/about/ExperienceTimeline";
import {
  getCertifications,
  getEducation,
  getExperiences,
  getProfile,
  normalizeList,
} from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return buildPageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, experiencesData, educationData, certificationsData] = await Promise.all([
    getProfile(locale),
    getExperiences(locale),
    getEducation(locale),
    getCertifications(locale),
  ]);

  const experiences = normalizeList(experiencesData);
  const education = normalizeList(educationData);
  const certifications = normalizeList(certificationsData);
  const highlights = profile?.about_highlights ?? [];

  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="about-page">
      <AboutHero profile={profile} />

      {profile?.bio ? (
        <section className="about-section about-story">
          <h2 className="about-section__title">{t("storyTitle")}</h2>
          <div className="about-story__panel whitespace-pre-line">{profile.bio}</div>
        </section>
      ) : null}

      <AboutHighlights highlights={highlights} title={t("highlightsTitle")} />
      <ExperienceTimeline items={experiences} />
      <EducationSection items={education} />
      <CertificationsSection items={certifications} />
      <AboutCta />
    </div>
  );
}

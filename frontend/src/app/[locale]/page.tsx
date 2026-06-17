import { setRequestLocale } from "next-intl/server";
import { ActivitySummary } from "@/components/home/ActivitySummary";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { SkillsSection } from "@/components/home/SkillsSection";
import { getArticles, getProfile, getProjects, getSkills, normalizeList } from "@/lib/api";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 1800;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, projectsData, skillsData, articlesData] = await Promise.all([
    getProfile(locale),
    getProjects(locale),
    getSkills(locale),
    getArticles(locale),
  ]);

  const projects = normalizeList(projectsData);
  const skills = normalizeList(skillsData);
  const articles = normalizeList(articlesData);

  return (
    <>
      <Hero profile={profile} />
      <ActivitySummary profile={profile} />
      <SkillsSection skills={skills} />
      <FeaturedProjects projects={projects} />
      <LatestArticles articles={articles} />
    </>
  );
}

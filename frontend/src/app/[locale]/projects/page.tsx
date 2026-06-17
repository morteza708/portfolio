import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProjects, normalizeList, type Project } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return buildPageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/projects",
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projectsData = await getProjects(locale);
  const projects = normalizeList(projectsData);

  return <ProjectsContent projects={projects} />;
}

function ProjectsContent({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  return (
    <section className="page-shell">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {projects.length === 0 ? (
        <div className="glass-panel px-6 py-10 text-center text-muted">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

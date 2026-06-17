import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { RichTextContent } from "@/components/content/RichTextContent";
import { MediaImage } from "@/components/media/MediaImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing } from "@/i18n/routing";
import { getProject, getProjects, normalizeList } from "@/lib/api";
import { buildPageMetadata, buildProjectJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const projects = await getProjects(locale);
    for (const project of normalizeList(projects)) {
      params.push({ locale, slug: project.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale, slug);

  if (!project) {
    const t = await getTranslations({ locale, namespace: "projects" });
    return buildPageMetadata({
      locale,
      title: t("metaTitle"),
      description: t("metaDescription"),
      path: "/projects",
    });
  }

  return buildPageMetadata({
    locale,
    title: project.title,
    description: project.summary,
    path: `/projects/${slug}`,
    image: project.cover_image,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProject(locale, slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={buildProjectJsonLd({
          locale,
          slug,
          title: project.title,
          description: project.summary,
          techStack: project.tech_stack,
          image: project.cover_image,
          liveUrl: project.live_url,
          repoUrl: project.repo_url,
        })}
      />
      <ProjectDetail project={project} />
    </>
  );
}

function ProjectDetail({
  project,
}: {
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
}) {
  const t = useTranslations("projects");

  return (
    <section className="page-shell">
      <PageHeader title={project.title} subtitle={project.summary} />

      <div className="max-w-3xl">
        {(project.cover_image_thumb || project.cover_image) ? (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
            <MediaImage
              src={project.cover_image}
              thumbSrc={project.cover_image_thumb}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        {project.description ? (
          <RichTextContent content={project.description} className="mb-8" />
        ) : null}

        <div className="mb-8">
          <h2 className="text-lg font-semibold">{t("techStack")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="chip-accent font-latin">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {t("liveDemo")}
            </a>
          ) : null}
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t("sourceCode")}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

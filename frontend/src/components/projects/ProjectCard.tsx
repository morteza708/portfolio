import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaImage } from "@/components/media/MediaImage";
import type { Project } from "@/lib/api";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const t = useTranslations("projects");

  return (
    <article className="card-surface group flex h-full flex-col">
      <Link href={`/projects/${project.slug}`} className="flex flex-1 flex-col outline-offset-4">
        {(project.cover_image_thumb || project.cover_image) ? (
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
            <MediaImage
              src={project.cover_image}
              thumbSrc={project.cover_image_thumb}
              preferThumb
              alt={project.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="mb-4 h-1 w-12 rounded-full bg-accent/80 transition group-hover:w-16" />
        )}
        <h2 className="text-2xl font-semibold transition group-hover:text-accent">{project.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span key={tech} className="chip-accent font-latin">
              {tech}
            </span>
          ))}
        </div>

        <span className="mt-6 inline-flex text-sm font-semibold text-accent transition group-hover:text-accent-hover">
          {t("viewProject")} →
        </span>
      </Link>

      {(project.live_url || project.repo_url) ? (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-sm font-semibold">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition hover:text-foreground"
            >
              {t("liveDemo")}
            </a>
          ) : null}
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition hover:text-foreground"
            >
              {t("sourceCode")}
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

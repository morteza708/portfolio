import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaImage } from "@/components/media/MediaImage";
import type { Project } from "@/lib/api";

type Props = {
  projects: Project[];
};

export function FeaturedProjects({ projects }: Props) {
  const t = useTranslations("home");
  const tp = useTranslations("projects");
  const featured = projects.filter((project) => project.is_featured).slice(0, 3);

  return (
    <section className="border-t border-border/70 bg-card/20 py-16 sm:py-20">
      <div className="container-page">
        <h2 className="section-title">{t("featuredTitle")}</h2>
        <p className="section-subtitle">{t("featuredSubtitle")}</p>

        {featured.length === 0 ? (
          <div className="glass-panel mt-10 px-6 py-10 text-center text-sm leading-7 text-muted">
            {t("featuredEmpty")}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((project) => (
              <article key={project.slug} className="card-surface group flex flex-col">
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex flex-1 flex-col outline-offset-4"
                >
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
                  <h3 className="text-xl font-semibold transition group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="chip-accent font-latin">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:text-accent-hover">
                    {tp("viewProject")}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import type { AboutHighlight } from "@/lib/api";

type Props = {
  highlights: AboutHighlight[];
  title: string;
};

const icons = ["01", "02", "03"];

export function AboutHighlights({ highlights, title }: Props) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="about-section">
      <h2 className="about-section__title">{title}</h2>
      <div className="about-highlights">
        {highlights.map((item, index) => (
          <article key={item.title} className="about-highlight-card">
            <span className="about-highlight-card__index font-latin">{icons[index] ?? "•"}</span>
            <h3 className="about-highlight-card__title">{item.title}</h3>
            <p className="about-highlight-card__body">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

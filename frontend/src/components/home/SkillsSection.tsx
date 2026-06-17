import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Skill } from "@/lib/api";
import { findTechItem, TECH_STACK } from "@/lib/tech-stack";
import { TechIcon } from "@/components/home/TechIcon";

type DisplayItem = {
  name: string;
  icon: string;
  darkIcon?: string;
  darkEnhance?: "django" | "drf" | "nextjs";
  proficiency: number;
};

type Props = {
  skills: Skill[];
};

function resolveDisplayItems(skills: Skill[]): DisplayItem[] {
  if (skills.length === 0) {
    return TECH_STACK.map((item) => ({ ...item, proficiency: 85 }));
  }

  const resolved: DisplayItem[] = [];

  for (const skill of skills) {
    const tech = findTechItem(skill.name);
    if (!tech) {
      continue;
    }

    resolved.push({
      ...tech,
      proficiency: skill.proficiency,
    });
  }

  return resolved.length > 0 ? resolved : TECH_STACK.map((item) => ({ ...item, proficiency: 85 }));
}

export function SkillsSection({ skills }: Props) {
  const t = useTranslations("home");
  const displayItems = resolveDisplayItems(skills);

  return (
    <section className="section-tint border-t border-border/70 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="section-title">{t("skillsTitle")}</h2>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent sm:block" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayItems.map(({ name, icon, darkIcon, darkEnhance, proficiency }) => (
            <div key={name} className="tech-card group">
              <TechIcon
                name={name}
                icon={icon}
                darkIcon={darkIcon}
                darkEnhance={darkEnhance}
              />
              <div className="w-full space-y-2">
                <span className="font-latin text-sm font-semibold">{name}</span>
                <div className="skill-meter" aria-hidden="true">
                  <div className="skill-meter-fill" style={{ width: `${proficiency}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

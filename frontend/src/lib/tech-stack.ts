export type TechStackItem = {
  name: string;
  icon: string;
  darkIcon?: string;
  aliases?: string[];
  darkEnhance?: "django" | "drf" | "nextjs";
};

export const TECH_STACK: TechStackItem[] = [
  { name: "Python", icon: "/tech/Python.svg", aliases: ["python"] },
  {
    name: "Django",
    icon: "/tech/Django.svg",
    darkIcon: "/tech/dark/Django.svg",
    aliases: ["django"],
    darkEnhance: "django",
  },
  {
    name: "DRF",
    icon: "/tech/Django REST.svg",
    darkIcon: "/tech/dark/Django REST.svg",
    aliases: ["drf", "django rest framework", "django rest"],
    darkEnhance: "drf",
  },
  {
    name: "Next.js",
    icon: "/tech/Next.js.svg",
    darkIcon: "/tech/dark/Next.js.svg",
    aliases: ["next.js", "nextjs"],
    darkEnhance: "nextjs",
  },
  { name: "React", icon: "/tech/React.svg", aliases: ["react", "react.js"] },
  { name: "JavaScript", icon: "/tech/JavaScript.svg", aliases: ["javascript", "js"] },
  { name: "HTML5", icon: "/tech/HTML5.svg", aliases: ["html5", "html"] },
  { name: "CSS3", icon: "/tech/CSS3.svg", aliases: ["css3", "css"] },
  {
    name: "Tailwind CSS",
    icon: "/tech/Tailwind CSS.svg",
    aliases: ["tailwind css", "tailwind", "tailwindcss"],
  },
  { name: "Bootstrap", icon: "/tech/Bootstrap.svg", aliases: ["bootstrap"] },
  {
    name: "PostgreSQL",
    icon: "/tech/PostgresSQL.svg",
    aliases: ["postgresql", "postgres", "postgressql"],
  },
  { name: "MySQL", icon: "/tech/MySQL.svg", aliases: ["mysql"] },
  { name: "Redis", icon: "/tech/Redis.svg", aliases: ["redis"] },
  { name: "Docker", icon: "/tech/Docker.svg", aliases: ["docker"] },
  { name: "Nginx", icon: "/tech/NGINX.svg", aliases: ["nginx"] },
  { name: "Linux", icon: "/tech/Linux.svg", aliases: ["linux"] },
  { name: "Git", icon: "/tech/Git.svg", aliases: ["git", "github"] },
];

export function findTechItem(name: string): TechStackItem | undefined {
  const normalized = name.trim().toLowerCase();

  return TECH_STACK.find((item) => {
    if (item.name.toLowerCase() === normalized) {
      return true;
    }

    return item.aliases?.some((alias) => alias.toLowerCase() === normalized);
  });
}

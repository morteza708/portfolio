import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

type Props = {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  className?: string;
  size?: "sm" | "md";
};

function SocialIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
      {children}
    </span>
  );
}

export function SocialLinks({
  email,
  githubUrl,
  linkedinUrl,
  className = "",
  size = "md",
}: Props) {
  const t = useTranslations("contact");

  const links = [
    email
      ? {
          href: `mailto:${email}`,
          label: t("emailLabel"),
          icon: (
            <SocialIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </SocialIcon>
          ),
        }
      : null,
    githubUrl
      ? {
          href: githubUrl,
          label: t("githubLabel"),
          icon: (
            <SocialIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>
            </SocialIcon>
          ),
        }
      : null,
    linkedinUrl
      ? {
          href: linkedinUrl,
          label: t("linkedinLabel"),
          icon: (
            <SocialIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2Z" />
              </svg>
            </SocialIcon>
          ),
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: ReactNode }>;

  if (links.length === 0) {
    return null;
  }

  const sizeClass = size === "sm" ? "social-link social-link-sm" : "social-link";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          className={sizeClass}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}

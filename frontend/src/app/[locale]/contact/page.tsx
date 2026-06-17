import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getProfile } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return buildPageMetadata({
    locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contact",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = await getProfile(locale);

  return (
    <ContactContent
      email={profile?.email}
      githubUrl={profile?.github_url}
      linkedinUrl={profile?.linkedin_url}
    />
  );
}

function ContactContent({
  email,
  githubUrl,
  linkedinUrl,
}: {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  const t = useTranslations("contact");

  return (
    <section className="page-shell">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] lg:items-start">
        <ContactForm />

        <aside className="glass-panel h-fit p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{t("alternativesTitle")}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{t("alternativesSubtitle")}</p>
          <SocialLinks
            className="mt-6 flex-col items-stretch [&_.social-link]:w-full [&_.social-link]:justify-center"
            email={email}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
          />
        </aside>
      </div>
    </section>
  );
}

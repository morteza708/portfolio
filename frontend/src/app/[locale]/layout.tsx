import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LocaleHtmlAttributes } from "@/components/layout/LocaleHtmlAttributes";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { getProfile } from "@/lib/api";
import { buildPersonJsonLd, getDefaultOgImage, getSiteUrl } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8eef5" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const ogImage = getDefaultOgImage();

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      languages: {
        en: "/en",
        fa: "/fa",
      },
    },
    openGraph: {
      siteName: "kamalian.dev",
      images: [{ url: ogImage, width: 512, height: 512, alt: "kamalian.dev" }],
    },
    twitter: {
      card: "summary",
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/logo/k-mark.png", type: "image/png" },
        { url: "/logo/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/logo/apple-touch.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const profile = await getProfile(locale);

  return (
    <ThemeProvider>
      <LocaleHtmlAttributes locale={locale as Locale} />
      <NextIntlClientProvider messages={messages}>
        <JsonLd data={buildPersonJsonLd(locale, profile)} />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer profile={profile} />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

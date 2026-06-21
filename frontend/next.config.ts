import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function getApiOrigin() {
  return (
    process.env.API_INTERNAL_URL?.replace(/\/api\/v1\/?$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
    "http://localhost:8000"
  );
}

function getMediaRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      pathname: "/media/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/media/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      port: "8000",
      pathname: "/media/**",
    },
    {
      protocol: "http",
      hostname: "api",
      port: "8000",
      pathname: "/media/**",
    },
  ];

  try {
    const origin = new URL(apiUrl.replace(/\/api\/v1\/?$/, "/"));
    const protocol = origin.protocol.replace(":", "") as "http" | "https";
    const hostname = origin.hostname;

    if (!["localhost", "127.0.0.1", "api"].includes(hostname)) {
      patterns.push({
        protocol,
        hostname,
        ...(origin.port ? { port: origin.port } : {}),
        pathname: "/media/**",
      });
    }
  } catch {
    // keep localhost defaults
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: getMediaRemotePatterns(),
  },
  async rewrites() {
    const apiOrigin = getApiOrigin();

    return [
      {
        source: "/media/:path*",
        destination: `${apiOrigin}/django-media/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

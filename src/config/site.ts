const DEFAULT_SITE_URL = "http://localhost:3000";

const rawSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).trim();
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

const DEFAULT_GITHUB_REPO = "narsibhati-dev/glyphcast";

const repo = (
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? DEFAULT_GITHUB_REPO
).trim();

export const BRAND_LOGO_RADIUS_CLASS = "rounded-[10px] sm:rounded-[11px]";

export const SITE_CONFIG = {
  name: "Glyphcast",
  description:
    "Create and export animated ASCII art for modern web experiences.",
  url: siteUrl,
} as const;

export const siteConfig = {
  productName: "Glyphcast",
  siteName: "Glyphcast",
  logoPath: "/logo/logo.svg" as const,
  tagline: "ASCII Studio",
  studioPath: "/studio",
  githubRepo: repo,
  githubUrl: `https://github.com/${repo}`,
  /** Primary GitHub CTA label (nav, hero, footer). */
  githubStarCtaLabel: "Star on GitHub" as const,
  githubApiStarsUrl: `https://api.github.com/repos/${repo}`,
  xUrl: "https://x.com/marsihq" as const,
  xHandle: "@marsihq" as const,
} as const;

export type SiteConfig = typeof siteConfig;

const DEFAULT_GITHUB_REPO = "narsibhati-dev/glyphcast";

const repo = (
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? DEFAULT_GITHUB_REPO
).trim();

export const BRAND_LOGO_RADIUS_CLASS = "rounded-[10px] sm:rounded-[11px]";

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

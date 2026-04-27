const DEFAULT_GITHUB_REPO = "AudoraLabs/glyphcast";

const repo = (process.env.NEXT_PUBLIC_GITHUB_REPO ?? DEFAULT_GITHUB_REPO).trim();

export const siteConfig = {
  productName: "Glyphcast",
  siteName: "Glyphcast",
  logoPath: "/logo/logo.svg" as const,
  tagline: "ASCII Studio",
  studioPath: "/studio",
  githubRepo: repo,
  githubUrl: `https://github.com/${repo}`,
  githubApiStarsUrl: `https://api.github.com/repos/${repo}`,
} as const;

export type SiteConfig = typeof siteConfig;

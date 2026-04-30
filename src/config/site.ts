const DEFAULT_SITE_URL = "http://localhost:3000";

const rawSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).trim();
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const SITE_CONFIG = {
  name: "Glyphcast",
  description:
    "Create and export animated ASCII art for modern web experiences.",
  url: siteUrl,
} as const;

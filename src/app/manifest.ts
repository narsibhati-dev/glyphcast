import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    icons: [
      {
        src: "/favicon/icon0.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/favicon/icon1.png",
        type: "image/png",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: [
      {
        src: "/screenshot-desktop.webp",
        type: "image/webp",
        sizes: "3264x1914",
        form_factor: "wide",
      },
    ],
  };
}

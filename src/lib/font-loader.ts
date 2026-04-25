/**
 * Dynamic Google Fonts loader for ASCII_FONT_PRESETS entries that live on
 * Google Fonts. Call `loadGoogleFont(presetId)` when the user selects a font;
 * a <link> tag is injected once and cached idempotently.
 *
 * System fonts (Menlo, Monaco, Consolas, etc.) and fonts not on Google Fonts
 * are absent from the map — the browser handles them naturally.
 */

/** Preset id → exact Google Fonts family name. */
const GOOGLE_FONTS_MAP: Record<string, string> = {
  roboto: "Roboto Mono",
  "fira-code": "Fira Code",
  "jetbrains-mono": "JetBrains Mono",
  inconsolata: "Inconsolata",
  "source-code-pro": "Source Code Pro",
  "ibm-plex-mono": "IBM Plex Mono",
  "space-mono": "Space Mono",
  vt323: "VT323",
  "share-tech-mono": "Share Tech Mono",
  "press-start-2p": "Press Start 2P",
  audiowide: "Audiowide",
  orbitron: "Orbitron",
  syne: "Syne",
  inter: "Inter",
  outfit: "Outfit",
  montserrat: "Montserrat",
  playfair: "Playfair Display",
  cinzel: "Cinzel",
  "courier-prime": "Courier Prime",
  "anonymous-pro": "Anonymous Pro",
  "cutive-mono": "Cutive Mono",
  "fira-mono": "Fira Mono",
  "overpass-mono": "Overpass Mono",
  "saira-stencil": "Saira Stencil One",
  silkscreen: "Silkscreen",
  "bebas-neue": "Bebas Neue",
  "dm-mono": "DM Mono",
  "ubuntu-mono": "Ubuntu Mono",
  dotgothic16: "DotGothic16",
  "chakra-petch": "Chakra Petch",
  teko: "Teko",
  anton: "Anton",
  "josefin-sans": "Josefin Sans",
  poppins: "Poppins",
};

const loaded = new Set<string>();

/**
 * Inject a Google Fonts stylesheet for the given preset id if needed.
 * Safe to call repeatedly — idempotent.
 */
export function loadGoogleFont(presetId: string): void {
  const fontName = GOOGLE_FONTS_MAP[presetId];
  if (!fontName) return;
  if (loaded.has(presetId)) return;
  loaded.add(presetId);

  if (typeof document === "undefined") return;
  const selector = `link[data-glyphcast-font="${presetId}"]`;
  if (document.querySelector(selector)) return;

  const family = encodeURIComponent(fontName).replace(/%20/g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-glyphcast-font", presetId);
  document.head.appendChild(link);
}

/** Returns true when the preset needs to be fetched from Google Fonts. */
export function isGoogleFont(presetId: string): boolean {
  return presetId in GOOGLE_FONTS_MAP;
}

"use client";

import Navbar from "@/components/landing-ui/navbar";
import ASCIIAnimation from "@/components/ascii-animation";
import { useTheme } from "@/components/theme-provider";
import { ThemeDockButton } from "@/components/theme-dock-button";
import {
  ASCII_SHOWCASE,
  type ASCIIShowcaseEntry,
} from "@/components/ascii-animations";
type ShowcaseConfig = ASCIIShowcaseEntry;
const SHOWCASES: ShowcaseConfig[] = ASCII_SHOWCASE;
const DARK_CARD_BASE = "#151518";
const DARK_CARD_INSET = "#1C1C20";
const DARK_CARD_RAISED = "#222228";
/** Outer card edge — same family as fill, matches `--border` in dark theme */
const DARK_CARD_OUTLINE = DARK_CARD_RAISED;

/** Overlay copy should follow ASCII canvas luminance, not the page theme. */
function isAsciiBackgroundDark(backgroundColor: string | undefined): boolean {
  if (!backgroundColor || typeof backgroundColor !== "string") return true;
  const hex = backgroundColor.replace("#", "").trim();
  if (!(hex.length === 3 || hex.length === 6)) return true;
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.5;
}

/* ── Card ────────────────────────────────────────────────────────── */

function ShowcaseCard({
  config,
  isDark,
}: {
  config: ShowcaseConfig;
  isDark: boolean;
}) {
  const asciiCanvasDark = isAsciiBackgroundDark(
    config.appearance.backgroundColor,
  );
  const overlayDescColor = asciiCanvasDark ? "#D9DAE3" : "#1f2937";
  const overlayFade = asciiCanvasDark
    ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)"
    : "linear-gradient(to top, rgba(255,255,255,0.92) 0%, transparent 100%)";

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0px_16px_48px_rgba(0,0,0,0.10)]"
      style={{
        borderColor: isDark ? DARK_CARD_OUTLINE : "#E5E5E5",
        background: isDark ? DARK_CARD_BASE : "#FFFFFF",
        boxShadow: isDark
          ? "0px 4px 24px rgba(0,0,0,0.24)"
          : "0px 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
        style={{
          background: isDark
            ? `linear-gradient(90deg, transparent 0%, ${DARK_CARD_OUTLINE} 50%, transparent 100%)`
            : "transparent",
        }}
        aria-hidden
      />
      {/* Subtle texture */}
      {!isDark ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] texture-bento-grid"
          aria-hidden
        />
      ) : null}

      {/* Animation — inset panel; title + description overlaid bottom-left */}
      <div
        className="relative z-10 m-3 flex h-[320px] items-center justify-center overflow-hidden rounded-xl border"
        style={{
          borderColor: isDark ? "#26262E" : "#EBEBEB",
          background: isDark ? DARK_CARD_BASE : "#F3F4F6",
        }}
      >
        <ASCIIAnimation
          frames={config.frames}
          appearance={config.appearance}
          fps={config.fps}
          chars={config.chars}
          isPlaying
          fitToContainer
          className="h-full w-full"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-12"
          style={{ background: overlayFade }}
        >
          <p
            className="line-clamp-3 text-left text-sm font-light leading-[1.45] sm:text-[15px]"
            style={{ color: overlayDescColor }}
          >
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ShowcasePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        ...(isDark
          ? {
              background: "#09090B",
              color: "#E8E8F0",
              ["--background" as string]: "#1E1E24",
              ["--foreground" as string]: "oklch(0.92 0.004 264)",
              ["--card" as string]: DARK_CARD_BASE,
              ["--card-foreground" as string]: "oklch(0.92 0.004 264)",
              ["--muted" as string]: DARK_CARD_INSET,
              ["--muted-foreground" as string]: "oklch(0.62 0.008 264)",
              ["--border" as string]: DARK_CARD_RAISED,
              ["--primary" as string]: "oklch(0.92 0.004 264)",
              ["--primary-foreground" as string]: "oklch(0.18 0.006 264)",
              ["--secondary" as string]: DARK_CARD_INSET,
              ["--secondary-foreground" as string]: "oklch(0.92 0.004 264)",
              ["--accent" as string]: DARK_CARD_INSET,
              ["--accent-foreground" as string]: "oklch(0.92 0.004 264)",
            }
          : {
              background: "#F9FAFC",
              color: "#111111",
              ["--background" as string]: "#F9FAFC",
              ["--foreground" as string]: "oklch(0.13 0 0)",
              ["--card" as string]: "#ffffff",
              ["--card-foreground" as string]: "oklch(0.13 0 0)",
              ["--muted" as string]: "oklch(0.96 0 0)",
              ["--muted-foreground" as string]: "oklch(0.42 0 0)",
              ["--border" as string]: "oklch(0.90 0 0)",
              ["--primary" as string]: "oklch(0.13 0 0)",
              ["--primary-foreground" as string]: "oklch(0.98 0 0)",
              ["--secondary" as string]: "oklch(0.96 0 0)",
              ["--secondary-foreground" as string]: "oklch(0.13 0 0)",
              ["--accent" as string]: "oklch(0.96 0 0)",
              ["--accent-foreground" as string]: "oklch(0.13 0 0)",
            }),
      }}
    >
      <div className="flex min-h-dvh w-full flex-col items-center font-satoshi">
        <Navbar />
        <main className="landing-content-width w-full flex-1 px-2 pb-10 pt-20 sm:pb-20 sm:pt-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B54B00]">
            Gallery
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#111] dark:text-[#E8E8F0] sm:text-4xl">
            Showcase
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SHOWCASES.map((config) => (
              <div key={config.id} className="h-full">
                <ShowcaseCard config={config} isDark={isDark} />
              </div>
            ))}
          </div>
        </main>
        <ThemeDockButton />
      </div>
    </div>
  );
}

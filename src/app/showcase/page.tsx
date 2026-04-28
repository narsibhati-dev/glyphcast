"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/landing-ui/navbar";
import ASCIIAnimation from "@/components/ascii-animation";
import { buildASCIIAnimationReactComponentSource } from "@/lib/ascii-export";
import { Button } from "@/components/ui/button";
import {
  ASCII_SHOWCASE,
  type ASCIIShowcaseEntry,
} from "@/components/ascii-components";
type ShowcaseConfig = ASCIIShowcaseEntry;
const SHOWCASES: ShowcaseConfig[] = ASCII_SHOWCASE;

/* ── Card ────────────────────────────────────────────────────────── */

function ShowcaseCard({ config }: { config: ShowcaseConfig }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const source = buildASCIIAnimationReactComponentSource({
      appearance: config.appearance,
      componentName: config.componentName,
      fps: config.fps,
      frames: config.frames,
      chars: config.chars,
    });
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E5E5E5] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0px_16px_48px_rgba(0,0,0,0.10)]"
      style={{ boxShadow: "0px 4px 24px rgba(0,0,0,0.06)" }}
    >
      {/* Subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/textures/bento-pattern.png')",
          backgroundSize: "40px auto",
        }}
        aria-hidden
      />

      {/* Animation — inset gray panel */}
      <div className="relative z-10 m-3 flex h-[320px] items-center justify-center overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#F3F4F6]">
        <ASCIIAnimation
          frames={config.frames}
          appearance={config.appearance}
          fps={config.fps}
          chars={config.chars}
          isPlaying
          fitToContainer
          className="h-full w-full"
        />
      </div>

      {/* Footer row */}
      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 px-4 pb-4 pt-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111]">{config.title}</p>
          <p className="h-9 overflow-hidden text-xs leading-relaxed text-[#888]">
            {config.description}
          </p>
        </div>

        <Button
          variant="landing"
          size="sm"
          onClick={handleCopy}
          className="shrink-0 gap-1.5 px-4"
        >
          {copied ? (
            <Check className="size-3.5 shrink-0 text-emerald-500" />
          ) : (
            <Copy className="size-3.5 shrink-0" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ShowcasePage() {
  return (
    <div
      style={{
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
      }}
    >
      <div className="flex min-h-dvh w-full flex-col items-center font-satoshi">
        <Navbar />
        <main className="landing-content-width w-full flex-1 px-6 pb-20 pt-28 sm:pt-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B54B00]">
            Gallery
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#111] sm:text-4xl">
            Showcase
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SHOWCASES.map((config) => (
              <div key={config.id} className="h-full">
                <ShowcaseCard config={config} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

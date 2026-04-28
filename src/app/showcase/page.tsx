"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/landing-ui/navbar";
import ASCIIAnimation from "@/components/ascii-animation";
import { buildASCIIAnimationReactComponentSource } from "@/lib/ascii-export";
import { Button } from "@/components/ui/button";
import { ASCII_FONT_FAMILY } from "@/lib/ascii-config";
import type { ASCIIAppearance } from "@/lib/ascii-config";
import {
  ASCII_SHOWCASE,
  type ASCIIShowcaseEntry,
} from "@/components/ascii-components";

/* ── Frame generators ────────────────────────────────────────────── */

function genSphereFrames(): string[] {
  const F = 24,
    W = 55,
    H = 22;
  const CHARS = " .:-=+*#%@";
  const R = H * 0.85;
  return Array.from({ length: F }, (_, f) => {
    const t = (f / F) * Math.PI * 2;
    const lx = Math.cos(t) * 0.6;
    const ly = -0.4;
    const lz = Math.sin(t) * 0.6 + 0.8;
    const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const nlx = lx / lLen,
      nly = ly / lLen,
      nlz = lz / lLen;
    return Array.from({ length: H }, (_, row) =>
      Array.from({ length: W }, (_, col) => {
        const sx = (col - W / 2) / (R * 0.5);
        const sy = (row - H / 2) / (R * 0.95);
        const r2 = sx * sx + sy * sy;
        if (r2 > 1) return " ";
        const sz = Math.sqrt(1 - r2);
        const dot = sx * nlx + sy * nly + sz * nlz;
        const b = Math.max(0, dot);
        return CHARS[Math.floor(b * (CHARS.length - 1))];
      }).join(""),
    ).join("\n");
  });
}

function genMatrixFrames(): string[] {
  const F = 14,
    C = 30,
    R = 14;
  const CHARS = "0123456789ABCDEFabcdef!$%&";
  const speeds = [
    1, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3,
    2, 1, 3, 2, 1,
  ];
  return Array.from({ length: F }, (_, f) =>
    Array.from({ length: R }, (_, r) =>
      Array.from({ length: C }, (_, c) => {
        const spd = speeds[c % speeds.length];
        const drop = (f * spd) % R;
        const t1 = (drop - 1 + R) % R;
        const t2 = (drop - 2 + R) % R;
        if (r === drop) return CHARS[(f * 3 + c * 7) % CHARS.length];
        if (r === t1) return CHARS[(f * 3 + c * 7 + 1) % CHARS.length];
        if (r === t2) return CHARS[(f * 3 + c * 7 + 2) % CHARS.length];
        return " ";
      }).join(""),
    ).join("\n"),
  );
}

function genOrbitFrames(): string[] {
  const F = 20,
    C = 41,
    R = 13;
  const cx = 20,
    cy = 6,
    rx = 17,
    ry = 5;
  return Array.from({ length: F }, (_, f) => {
    const angle = (f / F) * Math.PI * 2;
    const dotX = Math.round(cx + rx * Math.cos(angle));
    const dotY = Math.round(cy + ry * Math.sin(angle));
    return Array.from({ length: R }, (_, r) =>
      Array.from({ length: C }, (_, c) => {
        if (r === dotY && c === dotX) return "O";
        if (r === cy && c === cx) return "+";
        const ex = (c - cx) / rx,
          ey = (r - cy) / ry;
        return Math.abs(ex * ex + ey * ey - 1) < 0.15 ? "." : " ";
      }).join(""),
    ).join("\n");
  });
}

function genPulseFrames(): string[] {
  const F = 12,
    C = 41,
    R = 13;
  const cx = 20,
    cy = 6;
  return Array.from({ length: F }, (_, f) => {
    const phase = (f / F) * Math.PI * 2;
    const r1 = 3 + Math.sin(phase);
    const r2 = 6 + 1.5 * Math.sin(phase + Math.PI * 0.5);
    const r3 = 9 + Math.sin(phase + Math.PI);
    return Array.from({ length: R }, (_, r) =>
      Array.from({ length: C }, (_, c) => {
        const dx = (c - cx) / 2,
          dy = r - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - r3) < 0.6) return "+";
        if (Math.abs(dist - r2) < 0.6) return "*";
        if (Math.abs(dist - r1) < 0.6) return "o";
        if (dist < 0.5) return "*";
        return " ";
      }).join(""),
    ).join("\n");
  });
}

const SPHERE_FRAMES = genSphereFrames();
const MATRIX_FRAMES = genMatrixFrames();
const ORBIT_FRAMES = genOrbitFrames();
const PULSE_FRAMES = genPulseFrames();

/* ── Config ──────────────────────────────────────────────────────── */

const BASE: Omit<ASCIIAppearance, "backgroundColor" | "textColor"> = {
  borderRadius: 0,
  fontFamily: ASCII_FONT_FAMILY,
  fontSize: 12,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: -0.18,
  lineHeight: 1.1,
  showFrameCounter: false,
  textEffect: "none",
  useColors: false,
  textEffectThreshold: 0,
};

type ShowcaseConfig = ASCIIShowcaseEntry;

const GENERATED: ShowcaseConfig[] = [
  {
    id: "sphere",
    title: "3D Sphere",
    description: "A lit 3D sphere with rotating diffuse shading.",
    filename: "sphere.tsx",
    accentColor: "#B54B00",
    frames: SPHERE_FRAMES,
    fps: 24,
    chars: " .:-=+*#%@",
    appearance: {
      ...BASE,
      backgroundColor: "#0B0B0D",
      textColor: "#B54B00",
      lineHeight: 0.65,
    },
    componentName: "Sphere",
  },
  {
    id: "matrix",
    title: "Matrix Rain",
    description: "Classic cascading columns of falling characters.",
    filename: "matrix-rain.tsx",
    accentColor: "#00ff41",
    frames: MATRIX_FRAMES,
    fps: 12,
    chars: "0123456789ABCDEFabcdef!$%& ",
    appearance: { ...BASE, backgroundColor: "#000000", textColor: "#00ff41" },
    componentName: "MatrixRain",
  },
  {
    id: "orbit",
    title: "Orbital",
    description: "A marker tracing an elliptical orbit in real time.",
    filename: "orbital.tsx",
    accentColor: "#B54B00",
    frames: ORBIT_FRAMES,
    fps: 24,
    chars: "@%#*+=-:. ",
    appearance: { ...BASE, backgroundColor: "#0B0B0D", textColor: "#C96020" },
    componentName: "Orbital",
  },
  {
    id: "pulse",
    title: "Pulse Rings",
    description: "Concentric rings that breathe in and out rhythmically.",
    filename: "pulse-rings.tsx",
    accentColor: "#94a3b8",
    frames: PULSE_FRAMES,
    fps: 16,
    chars: "@%#*+=-:. ",
    appearance: { ...BASE, backgroundColor: "#0B0B0D", textColor: "#e2e8f0" },
    componentName: "PulseRings",
  },
];

// User's studio exports come first; generated animations fill the rest.
const SHOWCASES: ShowcaseConfig[] = [...ASCII_SHOWCASE, ...GENERATED];

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
      className="group relative overflow-hidden rounded-[20px] border border-[#E5E5E5] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0px_16px_48px_rgba(0,0,0,0.10)]"
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
      <div className="relative z-10 m-3 overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#F3F4F6]">
        <ASCIIAnimation
          frames={config.frames}
          appearance={config.appearance}
          fps={config.fps}
          chars={config.chars}
          isPlaying
          fitWidth
          className="w-full"
        />
      </div>

      {/* Footer row */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pb-4 pt-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#111]">{config.title}</p>
          <p className="truncate text-xs leading-relaxed text-[#888]">
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
              <ShowcaseCard key={config.id} config={config} />
            ))}
          </div>

          {/* <Link
            href="/"
            className="mt-12 inline-block text-sm font-medium text-[#B54B00] underline-offset-4 hover:underline"
          >
            ← Back to home
          </Link> */}
        </main>
      </div>
    </div>
  );
}

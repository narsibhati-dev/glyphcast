"use client";

import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";

import { MiniAsciiCanvas } from "./mini-ascii-canvas";
import { LANDING_SAMPLES, type LandingSample } from "./samples";

const PRESET_BY_ID = new Map(ASCII_CHAR_PRESETS.map((p) => [p.id, p]));

/* ── Dimensions ────────────────────────────────────────────────────────────── */
const CARD_W = 300;
const CARD_H = 210;
const GAP = 20;
const STEP = CARD_W + GAP;
const PAD = 32; // left padding inside the stage
const PIPE_X_PX = 340; // pipe position in px from stage left edge
const SCROLL_DURATION = 14; // seconds per full LANDING_SAMPLES loop

/* Triple the samples so the loop has plenty of runway */
const ALL_CARDS = [...LANDING_SAMPLES, ...LANDING_SAMPLES, ...LANDING_SAMPLES];
const LOOP_DIST = LANDING_SAMPLES.length * STEP; // distance for one full loop

/* ── Device card ───────────────────────────────────────────────────────────── */
interface DeviceCardProps {
  sample: LandingSample;
  showOriginal: boolean;
}

function DeviceCard({ sample, showOriginal }: DeviceCardProps) {
  const preset =
    PRESET_BY_ID.get(sample.defaults.charset) ?? ASCII_CHAR_PRESETS[0];

  return (
    <div
      className="shrink-0 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-xl"
      style={{ width: CARD_W, height: CARD_H }}
    >
      {/* macOS-style title bar */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f56]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[9px] text-zinc-500">
          Glyphcast
        </span>
        <span className="ml-auto font-mono text-[9px] text-zinc-600">
          {sample.label}
        </span>
      </div>

      {/* Content */}
      <div className="relative bg-black" style={{ height: CARD_H - 33 }}>
        {showOriginal ? (
          /* Original image */
          <div className="flex h-full w-full items-center justify-center bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sample.src}
              alt={sample.label}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
        ) : (
          /* ASCII version */
          <MiniAsciiCanvas
            src={sample.src}
            columns={90}
            charset={preset.chars}
            invert={sample.defaults.invert}
            appearance={{
              backgroundColor: "#000000",
              textColor: "#67e8f9",
              fontSize: 7,
              lineHeight: 0.88,
              letterSpacing: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Scrolling strip ───────────────────────────────────────────────────────── */
interface ScrollStripProps {
  showOriginal: boolean;
  motionX: ReturnType<typeof useMotionValue<number>>;
}

function ScrollStrip({ showOriginal, motionX }: ScrollStripProps) {
  const totalWidth = PAD + ALL_CARDS.length * STEP;

  return (
    <motion.div
      className="absolute top-0 left-0 h-full"
      style={{ x: motionX, width: totalWidth }}
    >
      {ALL_CARDS.map((sample, i) => (
        <div
          key={i}
          className="absolute top-0 flex h-full items-center"
          style={{ left: PAD + i * STEP }}
        >
          <DeviceCard sample={sample} showOriginal={showOriginal} />
        </div>
      ))}
    </motion.div>
  );
}

/* ── Scanner stage ─────────────────────────────────────────────────────────── */
function ScannerStage() {
  const x = useMotionValue(0);

  useEffect(() => {
    x.set(0);
    const ctrl = animate(x, -LOOP_DIST, {
      duration: SCROLL_DURATION,
      ease: "linear",
      repeat: Infinity,
    });
    return () => ctrl.stop();
  }, [x]);

  const stageH = CARD_H + 40; // extra vertical room for visual breathing

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
      style={{ height: stageH }}
    >
      {/* ── ASCII base layer (always full stage) ── */}
      <ScrollStrip showOriginal={false} motionX={x} />

      {/* ── Original-image layer — clipped to right of pipe ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${PIPE_X_PX}px)` }}
      >
        <ScrollStrip showOriginal={true} motionX={x} />
      </div>

      {/* ── Pipe ── */}
      <div
        className="pointer-events-none absolute inset-y-0 z-30"
        style={{ left: PIPE_X_PX }}
      >
        {/* Soft glow halo */}
        <div
          className="absolute inset-y-0 -left-4 w-8"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(99,102,241,0.15), rgba(99,102,241,0.25), rgba(99,102,241,0.15), transparent)",
          }}
        />

        {/* Main pipe bar */}
        <div
          className="absolute inset-y-0 left-0 w-[5px] rounded-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent 2%, #818cf8 15%, #818cf8 85%, transparent 98%)",
            boxShadow:
              "0 0 10px 3px rgba(99,102,241,0.55), 0 0 28px 6px rgba(99,102,241,0.2)",
          }}
        />

        {/* Center badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
          <div className="h-8 w-px bg-gradient-to-b from-transparent to-indigo-400/60" />
          <div className="whitespace-nowrap rounded-full border border-indigo-400/40 bg-zinc-950/90 px-3 py-1.5 shadow-[0_0_14px_rgba(99,102,241,0.4)] backdrop-blur-sm">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
              ◈ converting
            </span>
          </div>
          <div className="h-8 w-px bg-gradient-to-t from-transparent to-indigo-400/60" />
        </div>
      </div>

      {/* ── Labels ── */}
      <div className="pointer-events-none absolute left-4 top-3 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-950/80 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
          ASCII
        </span>
      </div>
      <div className="pointer-events-none absolute right-4 top-3 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-950/80 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400 backdrop-blur-sm">
          SOURCE
        </span>
      </div>

      {/* ── Edge fades ── */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-zinc-950 to-transparent" />
    </div>
  );
}

/* ── Examples section ──────────────────────────────────────────────────────── */
export function Examples() {
  return (
    <section id="examples" className="bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
              Plates
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Pre-tuned specimens
              <br />
              <span className="text-zinc-500">to riff on.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base text-zinc-400">
            Each plate renders live. Tap one to load it into the studio above.
          </p>
        </div>

        <ScannerStage />
      </div>
    </section>
  );
}

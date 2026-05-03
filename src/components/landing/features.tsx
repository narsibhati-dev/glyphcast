"use client";

import { motion, type Variants } from "framer-motion";
import { Cpu, Download, Gauge, Lock, Type, Wand2 } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.55 },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

/* Accent palette per card */
const ACCENTS = {
  emerald: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
  },
  sky: {
    border: "border-sky-500/25",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    bar: "bg-sky-400",
    dot: "bg-sky-400",
  },
  violet: {
    border: "border-violet-500/25",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
  },
  amber: {
    border: "border-amber-500/25",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
  },
  indigo: {
    border: "border-indigo-500/25",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    bar: "bg-indigo-400",
    dot: "bg-indigo-400",
  },
  rose: {
    border: "border-rose-500/25",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    bar: "bg-rose-400",
    dot: "bg-rose-400",
  },
};

export function Features() {
  return (
    <section id="features" className="bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
            Capabilities
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            A complete ASCII pipeline,
            <br />
            <span className="text-zinc-500">no install required.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Tune the look, scrub through video, and ship the result — all from a
            single browser tab.
          </p>
        </div>

        {/* Bento — 4 cols at lg, 2 at md */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-3"
        >
          {/* ── 01 Privacy — 2×2 hero ─────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 row-span-2 flex flex-col gap-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:col-span-1 lg:col-span-2"
          >
            {/* Subtle glow */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/8 blur-3xl" />

            {/* Icon + tag */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENTS.emerald.border} ${ACCENTS.emerald.bg} ${ACCENTS.emerald.text}`}
              >
                <Lock className="size-4" />
              </div>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${ACCENTS.emerald.text}`}
              >
                Privacy
              </span>
            </div>

            {/* Network monitor visual */}
            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                  Network Monitor
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    label: "↑ Outbound",
                    value: "0 bytes",
                    color: "text-emerald-400",
                  },
                  {
                    label: "↓ Inbound",
                    value: "0 bytes",
                    color: "text-emerald-400",
                  },
                  {
                    label: "⊘ Server calls",
                    value: "Blocked",
                    color: "text-emerald-400",
                  },
                  {
                    label: "◎ Telemetry",
                    value: "Disabled",
                    color: "text-emerald-400",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5"
                  >
                    <span className="text-zinc-500">{label}</span>
                    <span className={`font-semibold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge cluster */}
            <div className="flex flex-wrap gap-2">
              {["No uploads", "No servers", "No telemetry", "Canvas API"].map(
                (t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-3 py-1 font-mono text-[11px] text-zinc-300"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {t}
                  </span>
                ),
              )}
            </div>

            {/* Text */}
            <div>
              <h3 className="text-lg font-bold text-white">
                100% in your browser
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Conversion runs locally with the Canvas API. Your files never
                leave your device.
              </p>
            </div>
          </motion.div>

          {/* ── 02 Export ─────────────────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-500/8 blur-2xl" />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENTS.sky.border} ${ACCENTS.sky.bg} ${ACCENTS.sky.text}`}
              >
                <Download className="size-4" />
              </div>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${ACCENTS.sky.text}`}
              >
                Export
              </span>
            </div>

            {/* Format badges */}
            <div className="flex gap-2">
              {[
                { ext: ".png", label: "Image" },
                { ext: ".json", label: "Frames" },
                { ext: ".tsx", label: "Component" },
              ].map(({ ext, label }) => (
                <div
                  key={ext}
                  className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3"
                >
                  <span className="font-mono text-sm font-bold text-white">
                    {ext}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Three export targets
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                PNG snapshot, frames as JSON, or a self-contained React
                component.
              </p>
            </div>
          </motion.div>

          {/* ── 03 Glyphs ─────────────────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENTS.violet.border} ${ACCENTS.violet.bg} ${ACCENTS.violet.text}`}
              >
                <Type className="size-4" />
              </div>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${ACCENTS.violet.text}`}
              >
                Glyphs
              </span>
            </div>

            {/* Character showcase */}
            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
              <div className="grid grid-cols-5 gap-2 text-center font-mono text-base">
                {[
                  { char: "Aa", color: "text-white" },
                  { char: "Кк", color: "text-violet-300" },
                  { char: "▓▒░", color: "text-violet-400" },
                  { char: "⠿⠶", color: "text-zinc-500" },
                  { char: "ｦｧ", color: "text-zinc-600" },
                ].map(({ char, color }) => (
                  <span key={char} className={`${color} tracking-wider`}>
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                40+ fonts, 40+ charsets
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                Terminal, katakana, blocks, braille — tweak live.
              </p>
            </div>
          </motion.div>

          {/* ── 04 Performance — 2 cols ───────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 md:col-span-2 lg:col-span-2"
          >
            <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-48 rounded-full bg-amber-500/6 blur-3xl" />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENTS.amber.border} ${ACCENTS.amber.bg} ${ACCENTS.amber.text}`}
              >
                <Gauge className="size-4" />
              </div>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${ACCENTS.amber.text}`}
              >
                Performance
              </span>
            </div>

            {/* Perf bars */}
            <div className="flex-1 space-y-3">
              {[
                { label: "40 cols", pct: 15, fps: "60 fps" },
                { label: "120 cols", pct: 48, fps: "60 fps" },
                { label: "200 cols", pct: 88, fps: "58 fps" },
              ].map(({ label, pct, fps }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-zinc-400">
                      {label}
                    </span>
                    <span
                      className={`font-mono text-[11px] ${ACCENTS.amber.text}`}
                    >
                      {fps}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-amber-400/70 transition-all duration-700 group-hover:bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Real-time tuning
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                useDeferredValue + canvas keeps interactions smooth at any
                density.
              </p>
            </div>
          </motion.div>

          {/* ── 05 Component — 2 cols ─────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 md:col-span-2 lg:col-span-2"
          >
            <div className="pointer-events-none absolute left-0 top-0 h-28 w-40 rounded-full bg-indigo-500/8 blur-3xl" />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACCENTS.indigo.border} ${ACCENTS.indigo.bg} ${ACCENTS.indigo.text}`}
              >
                <Cpu className="size-4" />
              </div>
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${ACCENTS.indigo.text}`}
              >
                Component
              </span>
            </div>

            {/* Code block */}
            <div className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="size-2 rounded-full bg-zinc-700" />
                <span className="size-2 rounded-full bg-zinc-700" />
                <span className="size-2 rounded-full bg-zinc-700" />
                <span className="ml-2 font-mono text-[10px] text-zinc-600">
                  ascii.tsx
                </span>
              </div>
              <pre className="font-mono text-sm leading-relaxed">
                <span className="text-indigo-400">import </span>
                <span className="text-white">ASCIIAnimation </span>
                <span className="text-indigo-400">from </span>
                <span className="text-zinc-400">
                  &apos;./ascii.tsx&apos;{"\n"}
                </span>
                <span className="text-zinc-600">
                  {"\n"}
                  {"// Drop it anywhere"}
                  {"\n"}
                </span>
                <span className="text-zinc-500">{"<"}</span>
                <span className="text-indigo-300">ASCIIAnimation</span>
                <span className="text-zinc-500">{" />"}</span>
              </pre>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Self-contained component
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                One .tsx file, zero extra dependencies. Drop it into any React
                project.
              </p>
            </div>
          </motion.div>

          {/* ── 06 Effects — full width ────────────────────────────────── */}
          <motion.div
            variants={cardVariants}
            className="group relative col-span-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 md:col-span-2 lg:col-span-4"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-500/4 via-transparent to-transparent" />
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ACCENTS.rose.border} ${ACCENTS.rose.bg} ${ACCENTS.rose.text}`}
                >
                  <Wand2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Eight visual effects
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Layered on the cell render pass — switch live, no re-export
                    needed.
                  </p>
                </div>
              </div>

              {/* Effect pills with subtle colors */}
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: "Matrix",
                    color:
                      "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10",
                  },
                  {
                    name: "Glitch",
                    color:
                      "border-red-500/30     text-red-300     hover:bg-red-500/10",
                  },
                  {
                    name: "Neon",
                    color:
                      "border-cyan-500/30    text-cyan-300    hover:bg-cyan-500/10",
                  },
                  {
                    name: "CRT",
                    color:
                      "border-amber-500/30   text-amber-300   hover:bg-amber-500/10",
                  },
                  {
                    name: "Gradient",
                    color:
                      "border-violet-500/30  text-violet-300  hover:bg-violet-500/10",
                  },
                  {
                    name: "Burn",
                    color:
                      "border-orange-500/30  text-orange-300  hover:bg-orange-500/10",
                  },
                  {
                    name: "Neural",
                    color:
                      "border-sky-500/30     text-sky-300     hover:bg-sky-500/10",
                  },
                  {
                    name: "None",
                    color:
                      "border-zinc-700/50    text-zinc-400    hover:bg-zinc-800",
                  },
                ].map(({ name, color }) => (
                  <span
                    key={name}
                    className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors cursor-default ${color}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

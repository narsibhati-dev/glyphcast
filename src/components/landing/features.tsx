"use client";

import { motion, type Variants } from "framer-motion";
import {
  Cpu,
  Download,
  Gauge,
  Lock,
  Type,
  Wand2,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  num: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  body: string;
  span?: string; // Tailwind grid column span class
}

const FEATURES: Feature[] = [
  {
    num: "01",
    tag: "Lock",
    icon: Lock,
    title: "100% in your browser",
    body: "Conversion runs on your device with the Canvas API. No uploads, no servers, no telemetry. Your files never leave.",
    span: "md:col-span-2 md:row-span-2", // Large feature card
  },
  {
    num: "02",
    tag: "Export",
    icon: Download,
    title: "Three export targets",
    body: "Snapshot a PNG, batch-export every video frame as a ZIP, or copy a self-contained React component.",
    span: "md:col-span-1",
  },
  {
    num: "03",
    tag: "Type",
    icon: Type,
    title: "40+ fonts, 40+ charsets",
    body: "From terminal classics to katakana, blocks, and braille — pick a vibe and tweak the brightness ramp live.",
    span: "md:col-span-1",
  },
  {
    num: "04",
    tag: "Tuning",
    icon: Gauge,
    title: "Real-time tuning",
    body: "useDeferredValue + canvas rendering keeps interactions smooth, even on dense 200-column grids.",
    span: "md:col-span-1",
  },
  {
    num: "05",
    tag: "Module",
    icon: Cpu,
    title: "Self-contained component",
    body: "Paste a single .tsx file into your project and render <ASCIIAnimation /> — no extra dependencies.",
    span: "md:col-span-2", // Wide feature card
  },
  {
    num: "06",
    tag: "Effect",
    icon: Wand2,
    title: "Eight visual effects",
    body: "Matrix, glitch, neon, CRT, gradient, burn, neural, or none — layered on top of the cell render pass.",
    span: "md:col-span-1",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

export function Features() {
  return (
    <section id="features" className="bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
            Capabilities
          </p>
          <h2 className="mt-4 font-sans text-4xl font-bold tracking-tight text-white md:text-5xl">
            A complete ASCII pipeline,
            <br />
            <span className="text-zinc-500">no install required.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-400">
            Tune the look, scrub through video, and ship the result — all from a
            single browser tab.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 md:auto-rows-[minmax(180px,auto)] md:grid-cols-3 lg:gap-6"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 transition-colors hover:bg-zinc-900/60 ${
        feature.span || ""
      }`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-800 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-mono text-xs font-semibold tracking-widest text-zinc-500">
          {feature.tag.toUpperCase()}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-sans text-xl font-bold text-white">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          {feature.body}
        </p>
      </div>
    </motion.div>
  );
}

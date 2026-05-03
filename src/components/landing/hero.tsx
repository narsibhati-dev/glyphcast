"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { forwardRef, useMemo } from "react";
import { motion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";
import { MiniAsciiCanvas } from "./mini-ascii-canvas";
import { LANDING_SAMPLES, type LandingSample } from "./samples";

export interface HeroProps {
  sampleId: string;
  columns: number;
  charsetId: string;
  invert: boolean;
  onSampleChange: (id: string) => void;
  onColumnsChange: (cols: number) => void;
  onCharsetChange: (id: string) => void;
  onInvertChange: (b: boolean) => void;
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  {
    columns,
    charsetId,
    invert,
    onColumnsChange,
    onCharsetChange,
    onInvertChange,
  },
  ref,
) {
  const sample = useMemo<LandingSample>(
    () =>
      LANDING_SAMPLES.find((s) => s.id === "abstract") ?? LANDING_SAMPLES[0],
    [],
  );
  const charset = useMemo(
    () =>
      ASCII_CHAR_PRESETS.find((c) => c.id === charsetId) ??
      ASCII_CHAR_PRESETS[0],
    [charsetId],
  );

  return (
    <section
      ref={ref}
      id="hero"
      className="relative overflow-hidden py-24 lg:py-32 bg-zinc-950"
    >
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Centered Text Content */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mb-8 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-400"
          >
            <span>Glyphcast Studio 1.0 is here</span>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="text-balance font-sans text-5xl font-bold tracking-tight text-white sm:text-7xl"
          >
            Render the world in glyphs.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mt-6 text-balance text-lg leading-relaxed text-zinc-400 sm:text-xl"
          >
            Drop in an image or video, tune dozens of fonts, charsets, and
            effects live. Export as PNG, ZIP, or a React component — everything
            stays local in your browser.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-8 text-base"
            >
              <Link href="/studio">
                Open the Studio
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-zinc-800 bg-transparent px-8 text-base text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <a href="#examples">See examples</a>
            </Button>
          </motion.div>
        </div>

        {/* Bento Showcase Card */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="mt-20 mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-2 shadow-2xl shadow-black/50"
        >
          <div className="grid gap-px overflow-hidden rounded-2xl bg-zinc-800 md:grid-cols-[1fr_320px]">
            {/* Left: Canvas */}
            <div className="relative flex aspect-video w-full flex-col bg-zinc-950 p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                  <div className="size-2.5 rounded-full bg-zinc-700" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {sample.label}
                </p>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-xl bg-black">
                <MiniAsciiCanvas
                  src={sample.src}
                  columns={columns}
                  charset={charset.chars}
                  invert={invert}
                  appearance={{
                    backgroundColor: "#000000",
                    textColor: "#38bdf8",
                    fontSize: 9,
                    lineHeight: 0.95,
                    letterSpacing: 0,
                  }}
                />
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex flex-col gap-6 bg-zinc-950 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Columns</h3>
                  <span className="font-mono text-xs text-zinc-400">
                    {columns}
                  </span>
                </div>
                <Slider
                  value={[columns]}
                  min={60}
                  max={220}
                  step={1}
                  onValueChange={([v]) => v !== undefined && onColumnsChange(v)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Charset</h3>
                <Select value={charsetId} onValueChange={onCharsetChange}>
                  <SelectTrigger className="rounded-xl border-zinc-800 bg-zinc-900/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-white">
                    {ASCII_CHAR_PRESETS.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="rounded-lg"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-white">Invert</h3>
                  <p className="text-xs text-zinc-500">Dense glyphs on dark</p>
                </div>
                <Switch checked={invert} onCheckedChange={onInvertChange} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.dl
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-zinc-800/50 sm:grid-cols-4"
        >
          <Stat value="40+" label="Fonts included" />
          <Stat value="40+" label="Character sets" />
          <Stat value="08" label="Visual effects" />
          <Stat value="100%" label="Local processing" />
        </motion.dl>
      </div>
    </section>
  );
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-950 px-4 py-8 text-center">
      <dt className="order-2 mt-2 text-sm font-medium text-zinc-500">
        {label}
      </dt>
      <dd className="order-1 text-3xl font-bold tracking-tight text-white">
        {value}
      </dd>
    </div>
  );
}

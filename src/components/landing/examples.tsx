"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";
import { cn } from "@/lib/utils";

import { MiniAsciiCanvas } from "./mini-ascii-canvas";
import { LANDING_SAMPLES, type LandingSample } from "./samples";

interface ExamplesProps {
  onPick: (sample: LandingSample) => void;
  activeSampleId: string;
}

const PRESET_BY_ID = new Map(ASCII_CHAR_PRESETS.map((p) => [p.id, p]));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
};

export function Examples({ onPick, activeSampleId }: ExamplesProps) {
  return (
    <section id="examples" className="bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
              Plates
            </p>
            <h2 className="mt-4 font-sans text-4xl font-bold tracking-tight text-white md:text-5xl">
              Pre-tuned specimens
              <br />
              <span className="text-zinc-500">to riff on.</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg text-zinc-400">
            Each plate renders live in your browser. Tap one to load it into the studio above.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {LANDING_SAMPLES.map((sample, idx) => {
            const preset =
              PRESET_BY_ID.get(sample.defaults.charset) ??
              ASCII_CHAR_PRESETS[0];
            const isActive = sample.id === activeSampleId;
            const plate = String(idx + 1).padStart(2, "0");

            return (
              <motion.button
                variants={itemVariants}
                key={sample.id}
                type="button"
                onClick={() => onPick(sample)}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-3xl border text-left transition-all duration-300",
                  isActive
                    ? "border-zinc-500 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/60",
                )}
              >
                {/* Plate label */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                      Plate {plate}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                      {sample.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      "size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                </div>

                {/* Canvas */}
                <div className="relative aspect-video w-full overflow-hidden bg-black p-4 sm:p-6">
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-900">
                    <MiniAsciiCanvas
                      src={sample.src}
                      columns={sample.defaults.columns}
                      charset={preset.chars}
                      invert={sample.defaults.invert}
                      appearance={{
                        backgroundColor: "#000000",
                        textColor: "#ffffff",
                        fontSize: 8,
                        lineHeight: 0.95,
                        letterSpacing: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Caption */}
                <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 px-6 py-5">
                  <Caption label="Charset" value={preset.label} />
                  <Caption label="Columns" value={String(sample.defaults.columns)} />
                  <Caption
                    label="Invert"
                    value={sample.defaults.invert ? "Yes" : "No"}
                  />
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Caption({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="truncate font-sans text-sm font-medium text-white">{value}</div>
    </div>
  );
}

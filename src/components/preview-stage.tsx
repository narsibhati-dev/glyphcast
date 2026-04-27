"use client";

import { Pause, Play } from "lucide-react";

import { AsciiCanvas } from "@/components/ascii-canvas";
import { Slider } from "@/components/ui/slider";
import { useAsciiStore } from "@/lib/store";
import { useStudio } from "@/lib/studio-context";

export function PreviewStage() {
  const { canvasRef } = useStudio();

  const source = useAsciiStore((s) => s.source);
  const currentFrame = useAsciiStore((s) => s.currentFrame);
  const totalFrames = useAsciiStore((s) => s.totalFrames);
  const isPlaying = useAsciiStore((s) => s.isPlaying);
  const setPlaying = useAsciiStore((s) => s.setPlaying);
  const setFrame = useAsciiStore((s) => s.setFrame);
  const columns = useAsciiStore((s) => s.columns);
  const mode = useAsciiStore((s) => s.mode);
  const appearance = useAsciiStore((s) => s.appearance);

  const isVideo = source?.kind === "video";

  const cellWidth = appearance.fontSize * 0.6 + appearance.letterSpacing;
  const cellHeight = appearance.fontSize * appearance.lineHeight;
  const cellAspect = cellHeight > 0 ? cellWidth / cellHeight : 0.5;
  const approxRows = source
    ? Math.max(1, Math.round((columns * source.height * cellAspect) / source.width))
    : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Header strip ─────────────────────────────────────────────── */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/50 px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-zinc-700" />
            <div className="size-3 rounded-full bg-zinc-700" />
            <div className="size-3 rounded-full bg-zinc-700" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            Preview
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isVideo && (
            <button
              type="button"
              onClick={() => setPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-8 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-4 font-mono text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-zinc-700"
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Stage ─────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 bg-zinc-950 p-4 sm:p-6">
        <div className="h-full w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-inner">
          {source ? (
            <AsciiCanvas ref={canvasRef} className="block h-full w-full" />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <EmptyState />
            </div>
          )}
        </div>
      </div>

      {/* ── Video scrubber ───────────────────────────────────────────── */}
      {isVideo && (
        <div className="flex shrink-0 items-center gap-4 border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Scrub
          </span>
          <Slider
            value={[currentFrame]}
            min={0}
            max={Math.max(0, (totalFrames || 1) - 1)}
            step={1}
            onValueChange={([v]) => v !== undefined && setFrame(v)}
            className="flex-1"
          />
          <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-white">
            {String(currentFrame + 1).padStart(3, "0")} / {String(totalFrames || 1).padStart(3, "0")}
          </span>
        </div>
      )}

      {/* ── Stats footer ─────────────────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 divide-x divide-y divide-zinc-800 border-t border-zinc-800 bg-zinc-900/50 sm:grid-cols-4 sm:divide-y-0">
        <StatCell label="Mode" value={mode.charAt(0).toUpperCase() + mode.slice(1)} />
        <StatCell
          label="Resolution"
          value={source ? `${source.width}×${source.height}` : ""}
        />
        <StatCell
          label="Grid"
          value={source ? `${columns}×${approxRows}` : ""}
        />
        <StatCell label="Frames" value={isVideo ? String(totalFrames) : ""} />
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-4">
      <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="truncate font-mono text-sm font-semibold tabular-nums text-white">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex select-none flex-col items-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/30">
        <span className="font-mono text-3xl font-black text-zinc-700">A_</span>
      </div>
      <div className="space-y-2">
        <p className="font-sans text-base font-bold tracking-tight text-white">
          No source loaded
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Drop an image or video in the sidebar
        </p>
      </div>
    </div>
  );
}

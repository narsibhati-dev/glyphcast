"use client";

import { Pause, Play } from "lucide-react";

import { AsciiCanvas } from "@/components/ascii-canvas";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* ── Canvas area ─────────────────────────────────────────────────── */}
      {/*
        Key: overflow-auto on outer + min-h-full on inner wrapper.
        When canvas < container → inner is at least container height, canvas centers.
        When canvas > container → inner grows, outer shows scrollbars. No cropping.
      */}
      <div
        className="flex-1 min-h-0 overflow-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="min-h-full flex items-center justify-center p-6">
          {source ? (
            <AsciiCanvas ref={canvasRef} className="inline-block" />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── Video scrubber ────────────────────────────────────────────────── */}
      {isVideo && (
        <div className="flex shrink-0 items-center gap-3 border-t border-border bg-card px-4 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </Button>
          <Slider
            value={[currentFrame]}
            min={0}
            max={Math.max(0, (totalFrames || 1) - 1)}
            step={1}
            onValueChange={([v]) => v !== undefined && setFrame(v)}
            className="flex-1"
          />
          <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
            {currentFrame + 1} / {totalFrames || 1}
          </span>
        </div>
      )}

      {/* ── Stats bar — always present, no layout shift ───────────────────── */}
      <div className="flex shrink-0 divide-x divide-border border-t border-border bg-card">
        <StatCell label="Mode" value={mode.charAt(0).toUpperCase() + mode.slice(1)} />
        <StatCell label="Source" value={source ? `${source.width}×${source.height}` : "—"} />
        <StatCell label="Grid" value={source ? `${columns}×${approxRows}` : "—"} />
        <StatCell label="Frames" value={isVideo ? String(totalFrames) : "—"} />
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-1.5 px-2 min-w-0">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
        {label}
      </span>
      <span className="font-mono text-xs tabular-nums mt-0.5">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex select-none flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border">
        <span className="text-2xl font-mono text-muted-foreground/30">A</span>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">No source loaded</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Drop an image or video in the sidebar to begin
        </p>
      </div>
    </div>
  );
}

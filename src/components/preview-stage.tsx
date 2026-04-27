"use client";

import { useSyncExternalStore } from "react";
import { Moon, Pause, Play, Sun } from "lucide-react";

import { AsciiCanvas } from "@/components/ascii-canvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  STUDIO_OUTLINE_TERTIARY,
  STUDIO_SLIDER_CLASS,
} from "@/lib/studio-theme";
import { useAsciiStore } from "@/lib/store";
import { useStudio } from "@/lib/studio-context";
import { cn } from "@/lib/utils";

const VIDEO_PLAYBACK_HINT = "Load a video in Source Media to enable playback.";

function subscribeToHtmlClass(onChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getIsHtmlDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshotDark(): boolean {
  return false;
}

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

  // Subscribe to the `dark` class on <html> as an external store so we stay in
  // sync with theme changes triggered anywhere in the app, without needing a
  // setState-in-effect (which the React compiler lint flags).
  const isUIDark = useSyncExternalStore(
    subscribeToHtmlClass,
    getIsHtmlDark,
    getServerSnapshotDark,
  );

  const toggleUITheme = () => {
    const newDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("studio-theme", newDark ? "dark" : "light");
  };

  const cellWidth = appearance.fontSize * 0.6 + appearance.letterSpacing;
  const cellHeight = appearance.fontSize * appearance.lineHeight;
  const cellAspect = cellHeight > 0 ? cellWidth / cellHeight : 0.5;
  const approxRows = source
    ? Math.max(
        1,
        Math.round((columns * source.height * cellAspect) / source.width),
      )
    : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Header strip ─────────────────────────────────────────────── */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-zinc-800 bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FAFC_100%)] dark:bg-[linear-gradient(180deg,#18181b_0%,#18181b_100%)] px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full border border-[#D6D6D6] dark:border-zinc-600 bg-white dark:bg-zinc-700 shadow-[0px_0.5px_0_rgba(0,0,0,0.06)]" />
            <div className="size-3 rounded-full border border-[#D6D6D6] dark:border-zinc-600 bg-white dark:bg-zinc-700 shadow-[0px_0.5px_0_rgba(0,0,0,0.06)]" />
            <div className="size-3 rounded-full border border-[#D6D6D6] dark:border-zinc-600 bg-white dark:bg-zinc-700 shadow-[0px_0.5px_0_rgba(0,0,0,0.06)]" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-medium uppercase tracking-widest text-[#888] dark:text-zinc-500">
            Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isVideo ? (
            <Button
              type="button"
              variant="landingBlue"
              size="sm"
              onClick={() => setPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="h-8 gap-2 rounded-full px-4 font-mono text-[10px] uppercase tracking-widest text-white"
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              title={VIDEO_PLAYBACK_HINT}
              aria-label={VIDEO_PLAYBACK_HINT}
              className={cn(
                STUDIO_OUTLINE_TERTIARY,
                "h-8 min-w-0 gap-2 rounded-full px-4 font-mono text-[10px] uppercase tracking-widest text-[#111] dark:text-zinc-300 opacity-60",
              )}
            >
              <Play className="size-3.5 shrink-0 opacity-80" />
              <span>Play</span>
            </Button>
          )}
          <Button
            type="button"
            variant="landingBlue"
            size="sm"
            aria-label={
              isUIDark ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleUITheme}
            className="h-8 gap-2 rounded-full px-4 font-mono text-[10px] uppercase tracking-widest text-white"
          >
            {isUIDark ? (
              <Sun className="size-3.5" />
            ) : (
              <Moon className="size-3.5" />
            )}
            <span>{isUIDark ? "Light Mode" : "Dark Mode"}</span>
          </Button>
        </div>
      </div>

      {/* ── Stage ─────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 bg-[#F9FAFC] dark:bg-zinc-950 p-4 sm:p-6">
        <div className="h-full w-full overflow-hidden rounded-2xl border border-[#D4D4D4] dark:border-zinc-700 bg-zinc-950 shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]">
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
        <div className="flex shrink-0 items-center gap-4 border-t border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#888] dark:text-zinc-500">
            Scrub
          </span>
          <Slider
            className={cn("flex-1", STUDIO_SLIDER_CLASS)}
            value={[currentFrame]}
            min={0}
            max={Math.max(0, (totalFrames || 1) - 1)}
            step={1}
            onValueChange={([v]) => v !== undefined && setFrame(v)}
          />
          <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-[#111] dark:text-zinc-100">
            {String(currentFrame + 1).padStart(3, "0")} /{" "}
            {String(totalFrames || 1).padStart(3, "0")}
          </span>
        </div>
      )}

      {/* ── Stats footer ─────────────────────────────────────────────── */}
      <div className="grid shrink-0 grid-cols-2 divide-x divide-y divide-[#E5E5E5] dark:divide-zinc-800 border-t border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 sm:grid-cols-4 sm:divide-y-0">
        <StatCell
          label="Mode"
          value={mode.charAt(0).toUpperCase() + mode.slice(1)}
        />
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
      <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#888] dark:text-zinc-500">
        {label}
      </span>
      <span className="truncate font-mono text-sm font-semibold tabular-nums text-[#111] dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex select-none flex-col items-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl border border-dashed border-[#B54B00]/35 bg-[#F9FAFC] dark:bg-zinc-900">
        <span className="font-mono text-3xl font-black text-[#B54B00]/40">
          A_
        </span>
      </div>
      <div className="space-y-2">
        <p className="font-sans text-base font-bold tracking-tight text-[#111] dark:text-zinc-100">
          No source loaded
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#666] dark:text-zinc-500">
          Drop an image or video in the sidebar
        </p>
      </div>
    </div>
  );
}

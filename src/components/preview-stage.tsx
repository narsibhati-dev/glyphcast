"use client";

import { Pause, Play } from "lucide-react";

import { AsciiCanvas } from "@/components/ascii-canvas";
import { Badge } from "@/components/ui/badge";
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
  const showFrameCounter = useAsciiStore((s) => s.appearance.showFrameCounter);

  const isVideo = source?.kind === "video";

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px]">
            {source ? `${source.width}x${source.height}` : "no source"}
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px]">
            cols {columns}
          </Badge>
          {isVideo && showFrameCounter && (
            <Badge variant="outline" className="font-mono text-[11px]">
              frame {currentFrame + 1}/{totalFrames || 1}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-border bg-background grid place-items-center p-3">
        {source ? (
          <AsciiCanvas ref={canvasRef} className="inline-block" />
        ) : (
          <div className="text-sm text-muted-foreground">
            Drop an image or video to begin.
          </div>
        )}
      </div>

      {isVideo && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
          </Button>
          <Slider
            value={[currentFrame]}
            min={0}
            max={Math.max(0, (totalFrames || 1) - 1)}
            step={1}
            onValueChange={([v]) => v !== undefined && setFrame(v)}
            className="flex-1"
          />
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground w-16 text-right">
            {currentFrame + 1}/{totalFrames || 1}
          </span>
        </div>
      )}
    </div>
  );
}

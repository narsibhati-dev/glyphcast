"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useAsciiStore } from "@/lib/store";
import {
  imageToAscii,
  type ImageToAsciiResult,
} from "@/lib/ascii-converter";
import { hexToRgba, type ASCIITextEffect } from "@/lib/ascii-config";

export interface AsciiCanvasHandle {
  /** Returns the most recently rendered ASCII frame as a single string. */
  getFrameText: () => string;
  /** Returns a PNG `data:` URL of the current preview canvas. */
  exportPNG: () => string | null;
  /**
   * Iterates the source video, returning ASCII text for each frame.
   * Image sources resolve immediately to a single-element array.
   */
  getFrames: (
    onProgress?: (done: number, total: number) => void,
    signal?: AbortSignal,
  ) => Promise<string[]>;
}

interface AsciiCanvasProps {
  ref?: RefObject<AsciiCanvasHandle | null>;
  className?: string;
}

const CELL_WIDTH_RATIO = 0.6;
const DEBOUNCE_MS = 50;

/**
 * The Canvas 2D API does NOT resolve CSS custom properties (var(--foo)) inside
 * ctx.font strings. Next.js exposes Geist Mono via a CSS variable, so without
 * this resolver the default font falls back to system mono silently.
 * We resolve each var() against the document's computed style at draw-time.
 */
function resolveCanvasFontFamily(fontFamily: string): string {
  if (typeof window === "undefined" || !fontFamily.includes("var(")) {
    return fontFamily;
  }
  return fontFamily.replace(/var\(([^)]+)\)/g, (_, varName: string) => {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(varName.trim())
        .trim() || ""
    );
  });
}

export function AsciiCanvas({ ref, className }: AsciiCanvasProps) {
  const source = useAsciiStore((s) => s.source);
  const appearance = useAsciiStore((s) => s.appearance);
  const columns = useAsciiStore((s) => s.columns);
  const threshold = useAsciiStore((s) => s.threshold);
  const charset = useAsciiStore((s) => s.charset);
  const invert = useAsciiStore((s) => s.invert);
  const isPlaying = useAsciiStore((s) => s.isPlaying);
  const currentFrame = useAsciiStore((s) => s.currentFrame);
  const totalFrames = useAsciiStore((s) => s.totalFrames);
  const setFrame = useAsciiStore((s) => s.setFrame);
  const setPlaying = useAsciiStore((s) => s.setPlaying);

  // useColors lives inside appearance now
  const useColors = appearance.useColors;

  // Deferred numeric/string inputs so heavy state changes don't block the UI.
  const dColumns = useDeferredValue(columns);
  const dThreshold = useDeferredValue(threshold);
  const dCharset = useDeferredValue(charset);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastResultRef = useRef<ImageToAsciiResult | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // cellAspect = cellWidth/cellHeight so the rendered ASCII grid preserves the
  // source image's aspect ratio regardless of lineHeight/letterSpacing changes.
  const cellWidth =
    appearance.fontSize * CELL_WIDTH_RATIO + appearance.letterSpacing;
  const cellHeight = appearance.fontSize * appearance.lineHeight;
  const cellAspect = cellHeight > 0 ? cellWidth / cellHeight : 0.5;

  const draw = useCallback(
    (result: ImageToAsciiResult | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = Math.max(cellWidth * (result?.cols ?? 0), 1);
      const cssHeight = Math.max(cellHeight * (result?.rows ?? 0), 1);

      if (
        canvas.width !== Math.round(cssWidth * dpr) ||
        canvas.height !== Math.round(cssHeight * dpr)
      ) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
      }
      // CSS owns display sizing now (object-fit: contain against the parent).
      // The buffer above gives the canvas its intrinsic aspect for scaling.
      setSize({ width: cssWidth, height: cssHeight });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = appearance.backgroundColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      if (!result || result.rows === 0) return;

      const fontWeight = String(appearance.fontWeight);
      const fontStyle = appearance.fontStyle;
      const resolvedFamily = resolveCanvasFontFamily(appearance.fontFamily);
      ctx.font = `${fontStyle} ${fontWeight} ${appearance.fontSize}px ${resolvedFamily}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.globalCompositeOperation = "source-over";

      paintCells({
        ctx,
        result,
        useColors,
        textColor: appearance.textColor,
        cellWidth,
        cellHeight,
        effect: appearance.textEffect,
        cssWidth,
        cssHeight,
        seed: result.text.length,
        threshold: appearance.textEffectThreshold,
      });

      paintEffectOverlay({
        ctx,
        cssWidth,
        cssHeight,
        effect: appearance.textEffect,
        backgroundColor: appearance.backgroundColor,
        textColor: appearance.textColor,
        threshold: appearance.textEffectThreshold,
      });
    },
    [
      appearance.backgroundColor,
      appearance.fontFamily,
      appearance.fontSize,
      appearance.fontStyle,
      appearance.fontWeight,
      appearance.textColor,
      appearance.textEffect,
      appearance.textEffectThreshold,
      cellHeight,
      cellWidth,
      useColors,
    ],
  );

  const convert = useCallback((): ImageToAsciiResult | null => {
    if (!source) return null;
    return imageToAscii(source.el, {
      columns: dColumns,
      charset: dCharset,
      invert,
      useColors,
      cellAspect,
      threshold: dThreshold,
    });
  }, [source, dColumns, dCharset, invert, useColors, cellAspect, dThreshold]);

  // --- Image mode redraws --------------------------------------------------
  useEffect(() => {
    if (!source || source.kind !== "image") return;
    const handle = window.setTimeout(() => {
      const result = convert();
      lastResultRef.current = result;
      draw(result);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [source, convert, draw]);

  // --- Video frame loop ----------------------------------------------------
  useEffect(() => {
    if (!source || source.kind !== "video") return;
    const video = source.el as HTMLVideoElement;

    let cancelled = false;
    let callbackId = 0;

    const tick = () => {
      if (cancelled) return;
      const result = convert();
      lastResultRef.current = result;
      draw(result);
      // Sync the scrubber's frame index from playback position.
      if (video.duration > 0 && totalFrames > 0) {
        const f = Math.min(
          totalFrames - 1,
          Math.max(
            0,
            Math.floor((video.currentTime / video.duration) * totalFrames),
          ),
        );
        if (f !== currentFrame) setFrame(f);
      }
      scheduleNext();
    };

    const scheduleNext = () => {
      if (cancelled) return;
      const rvfc = (
        video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;
      if (rvfc) {
        callbackId = rvfc.call(video, tick);
      } else {
        callbackId = window.requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      video.play().catch(() => setPlaying(false));
      scheduleNext();
    } else {
      video.pause();
      // One-shot redraw to reflect appearance/conversion changes when paused.
      const result = convert();
      lastResultRef.current = result;
      draw(result);
    }

    return () => {
      cancelled = true;
      const cancelRvfc = (
        video as HTMLVideoElement & {
          cancelVideoFrameCallback?: (id: number) => void;
        }
      ).cancelVideoFrameCallback;
      if (cancelRvfc && callbackId) cancelRvfc.call(video, callbackId);
      else if (callbackId) window.cancelAnimationFrame(callbackId);
    };
    // We intentionally omit currentFrame from deps to avoid restarting the loop
    // on every frame tick; the loop reads it via the closure when seeking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, isPlaying, convert, draw, setFrame, setPlaying, totalFrames]);

  // --- Manual scrub when paused -------------------------------------------
  useEffect(() => {
    if (!source || source.kind !== "video" || isPlaying) return;
    const video: HTMLVideoElement = source.el as HTMLVideoElement;
    if (video.duration > 0 && totalFrames > 0) {
      const target = (currentFrame / totalFrames) * video.duration;
      if (Math.abs(video.currentTime - target) > 1 / 60) {
        // eslint-disable-next-line react-hooks/immutability
        video.currentTime = target;
      }
    }
  }, [source, currentFrame, totalFrames, isPlaying]);

  // --- Imperative handle ---------------------------------------------------
  useImperativeHandle(
    ref,
    () => ({
      getFrameText: () => lastResultRef.current?.text ?? "",
      exportPNG: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.toDataURL("image/png");
      },
      getFrames: async (onProgress, signal) => {
        if (!source) return [];
        if (source.kind === "image") {
          const result = imageToAscii(source.el, {
            columns,
            charset,
            invert,
            useColors,
            cellAspect,
            threshold,
          });
          onProgress?.(1, 1);
          return [result.text];
        }
        const video = source.el as HTMLVideoElement;
        const wasPlaying = !video.paused;
        video.pause();
        const total = Math.max(1, totalFrames);
        const frames: string[] = [];
        for (let f = 0; f < total; f++) {
          if (signal?.aborted) break;
          const t = (f / total) * (video.duration || 1);
          await seekVideo(video, t);
          const result = imageToAscii(video, {
            columns,
            charset,
            invert,
            useColors,
            cellAspect,
            threshold,
          });
          frames.push(result.text);
          onProgress?.(f + 1, total);
        }
        if (wasPlaying) video.play().catch(() => undefined);
        return frames;
      },
    }),
    [
      source,
      columns,
      charset,
      invert,
      useColors,
      cellAspect,
      threshold,
      totalFrames,
    ],
  );

  return (
    <div
      className={className}
      data-canvas-size={`${size.width}x${size.height}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          background: appearance.backgroundColor,
          borderRadius: appearance.borderRadius,
          objectFit: "contain",
        }}
      />
    </div>
  );
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeek = () => {
      video.removeEventListener("seeked", onSeek);
      resolve();
    };
    video.addEventListener("seeked", onSeek, { once: true });
    try {
      video.currentTime = Math.max(
        0,
        Math.min(time, Math.max(0, (video.duration || time) - 1e-3)),
      );
    } catch {
      video.removeEventListener("seeked", onSeek);
      resolve();
    }
  });
}

interface PaintCellsArgs {
  ctx: CanvasRenderingContext2D;
  result: ImageToAsciiResult;
  useColors: boolean;
  textColor: string;
  cellWidth: number;
  cellHeight: number;
  effect: ASCIITextEffect;
  cssWidth: number;
  cssHeight: number;
  seed: number;
  /** 0-1 intensity that scales the active effect. */
  threshold: number;
}

function paintCells({
  ctx,
  result,
  useColors,
  textColor,
  cellWidth,
  cellHeight,
  effect,
  cssWidth,
  cssHeight,
  seed,
  threshold,
}: PaintCellsArgs) {
  const lines = result.text.split("\n");
  const lineCount = Math.min(lines.length, result.rows);

  if (effect === "neon") {
    // threshold scales glow from base to 3× base blur.
    const glowBase = Math.max(2, cellHeight * 0.6);
    ctx.shadowBlur = glowBase * (1 + threshold * 2);
    ctx.shadowColor = useColors ? "#ffffff" : textColor;
  }

  let gradient: CanvasGradient | null = null;
  if (effect === "gradient" && !useColors) {
    gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    gradient.addColorStop(0, "#7c3aed");
    gradient.addColorStop(0.5, "#06b6d4");
    gradient.addColorStop(1, "#22c55e");
  }
  if (effect === "burn" && !useColors) {
    gradient = ctx.createLinearGradient(0, 0, 0, cssHeight);
    gradient.addColorStop(0, "#fde68a");
    gradient.addColorStop(0.6, "#f97316");
    gradient.addColorStop(1, "#7f1d1d");
  }
  if (effect === "neural" && !useColors) {
    gradient = ctx.createLinearGradient(0, 0, cssWidth, 0);
    gradient.addColorStop(0, "#312e81");
    gradient.addColorStop(0.5, "#9333ea");
    gradient.addColorStop(1, "#22d3ee");
  }

  const matrixGreen = "#39ff14";
  // glitch: threshold expands how many rows jitter (0=rare, 1=many)
  const glitchModulo = Math.max(2, Math.round(11 * (1 - threshold * 0.8)));
  const jitterMod = effect === "glitch" ? (seed % 7) - 3 : 0;

  for (let y = 0; y < lineCount; y++) {
    const line = lines[y];
    if (!line) continue;
    const yPx = y * cellHeight;
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === " ") continue;
      const xPx =
        x * cellWidth +
        (effect === "glitch" && (y + seed) % glitchModulo === 0
          ? jitterMod
          : 0);

      let fill: string | CanvasGradient;
      if (useColors && result.colors) {
        fill = result.colors[y]?.[x] ?? textColor;
      } else if (effect === "matrix") {
        fill = matrixGreen;
      } else if (effect === "video") {
        // Slight scanline tint — alternate rows brighten/dim.
        fill = y % 2 === 0 ? textColor : hexToRgba(textColor, 0.7);
      } else if (gradient) {
        fill = gradient;
      } else {
        fill = textColor;
      }

      ctx.fillStyle = fill;
      ctx.fillText(ch, xPx, yPx);
    }
  }

  if (effect === "neon") {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }
}

interface PaintEffectOverlayArgs {
  ctx: CanvasRenderingContext2D;
  cssWidth: number;
  cssHeight: number;
  effect: ASCIITextEffect;
  backgroundColor: string;
  textColor: string;
  /** 0-1 intensity that scales the overlay strength. */
  threshold: number;
}

function paintEffectOverlay({
  ctx,
  cssWidth,
  cssHeight,
  effect,
  backgroundColor,
  threshold,
}: PaintEffectOverlayArgs) {
  if (effect === "video") {
    ctx.save();
    // threshold scales the scanline opacity (0=subtle, 1=heavy).
    ctx.globalAlpha = 0.1 + threshold * 0.2;
    ctx.fillStyle = "#000";
    for (let y = 0; y < cssHeight; y += 3) {
      ctx.fillRect(0, y, cssWidth, 1);
    }
    ctx.restore();
  } else if (effect === "burn") {
    ctx.save();
    const intensity = 0.2 + threshold * 0.3;
    const grad = ctx.createRadialGradient(
      cssWidth / 2,
      cssHeight,
      cssHeight * 0.1,
      cssWidth / 2,
      cssHeight,
      cssHeight,
    );
    grad.addColorStop(0, hexToRgba("#dc2626", intensity));
    grad.addColorStop(1, hexToRgba(backgroundColor, 0));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.restore();
  } else if (effect === "neural") {
    ctx.save();
    ctx.globalAlpha = 0.05 + threshold * 0.1;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 1;
    for (let x = 0; x < cssWidth; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssHeight);
      ctx.stroke();
    }
    ctx.restore();
  }
}

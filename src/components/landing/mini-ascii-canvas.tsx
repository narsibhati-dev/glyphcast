"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { imageToAscii, type ImageToAsciiResult } from "@/lib/ascii-converter";
import {
  DEFAULT_ASCII_APPEARANCE,
  type ASCIIAppearance,
} from "@/lib/ascii-config";

export interface MiniAsciiCanvasProps {
  /** URL of an image (SVG, PNG, JPEG, …). Loaded with `crossOrigin="anonymous"`. */
  src: string;
  columns: number;
  charset: string;
  invert?: boolean;
  useColors?: boolean;
  appearance?: Partial<ASCIIAppearance>;
  className?: string;
}

const CELL_WIDTH_RATIO = 0.6;
const DEBOUNCE_MS = 50;

/**
 * Resolve `var(--foo)` font-family references against the document so the
 * canvas-2D `ctx.font` string actually picks up Next.js font variables.
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

/**
 * Self-contained ASCII preview that renders directly to a `<canvas>`.
 * Used by the landing page; intentionally independent of `useAsciiStore` so
 * landing-page state never leaks into the studio.
 */
export function MiniAsciiCanvas({
  src,
  columns,
  charset,
  invert = false,
  useColors = false,
  appearance,
  className,
}: MiniAsciiCanvasProps) {
  const a = { ...DEFAULT_ASCII_APPEARANCE, ...appearance };

  const dColumns = useDeferredValue(columns);
  const dCharset = useDeferredValue(charset);
  const dInvert = useDeferredValue(invert);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // Bumped from `img.onload` (an external/async event) so a redraw effect can
  // depend on it. We deliberately avoid `setState` in the synchronous body of
  // the loader effect so React Compiler stays happy.
  const [imageTick, setImageTick] = useState(0);

  const cellWidth = a.fontSize * CELL_WIDTH_RATIO + a.letterSpacing;
  const cellHeight = a.fontSize * a.lineHeight;
  const cellAspect = cellHeight > 0 ? cellWidth / cellHeight : 0.5;

  useEffect(() => {
    let cancelled = false;
    imgRef.current = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      setImageTick((t) => t + 1);
    };
    img.onerror = () => {
      if (cancelled) return;
      imgRef.current = null;
      setImageTick((t) => t + 1);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!imgRef.current) return;
    const handle = window.setTimeout(() => {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) return;
      const result = imageToAscii(img, {
        columns: dColumns,
        charset: dCharset,
        invert: dInvert,
        useColors,
        cellAspect,
      });
      paint({
        canvas,
        result,
        appearance: a,
        cellWidth,
        cellHeight,
        useColors,
      });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
    // The `a` object is rebuilt every render but its primitive fields are the
    // dependencies that actually matter; listing them explicitly keeps the
    // effect from running on identity changes alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    imageTick,
    dColumns,
    dCharset,
    dInvert,
    useColors,
    cellAspect,
    cellWidth,
    cellHeight,
    a.backgroundColor,
    a.textColor,
    a.fontFamily,
    a.fontSize,
    a.fontStyle,
    a.fontWeight,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        background: a.backgroundColor,
        borderRadius: a.borderRadius,
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}

interface PaintArgs {
  canvas: HTMLCanvasElement;
  result: ImageToAsciiResult;
  appearance: ASCIIAppearance;
  cellWidth: number;
  cellHeight: number;
  useColors: boolean;
}

function paint({
  canvas,
  result,
  appearance,
  cellWidth,
  cellHeight,
  useColors,
}: PaintArgs) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(cellWidth * result.cols, 1);
  const cssHeight = Math.max(cellHeight * result.rows, 1);

  if (
    canvas.width !== Math.round(cssWidth * dpr) ||
    canvas.height !== Math.round(cssHeight * dpr)
  ) {
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }
  // No canvas.style.width/height: CSS owns display sizing (object-fit: contain
  // against the parent box). The buffer above gives the canvas its intrinsic
  // aspect ratio, so it scales crisply within whatever container holds it.

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = appearance.backgroundColor;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  if (result.rows === 0) return;

  const fontWeight = String(appearance.fontWeight);
  const fontStyle = appearance.fontStyle;
  const family = resolveCanvasFontFamily(appearance.fontFamily);
  ctx.font = `${fontStyle} ${fontWeight} ${appearance.fontSize}px ${family}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const lines = result.text.split("\n");
  const lineCount = Math.min(lines.length, result.rows);
  for (let y = 0; y < lineCount; y++) {
    const line = lines[y];
    if (!line) continue;
    const yPx = y * cellHeight;
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === " ") continue;
      const fill =
        useColors && result.colors
          ? (result.colors[y]?.[x] ?? appearance.textColor)
          : appearance.textColor;
      ctx.fillStyle = fill;
      ctx.fillText(ch, x * cellWidth, yPx);
    }
  }
}

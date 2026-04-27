"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Primary brand orange (top) → light warm tint (bottom) */
const GRADIENT_TOP = "#C96020";
const GRADIENT_BOTTOM = "#FFF8F2";

const CELL = 4;
const DOT = 1;
const MAX_ALPHA = 0.2;

function paint(canvas: HTMLCanvasElement, reverse = false) {
  const parent = canvas.parentElement;
  if (!parent) return;
  const cssW = parent.clientWidth;
  const cssH = parent.clientHeight;
  if (cssW < 1 || cssH < 1) return;

  const dpr = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    2,
  );
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const g = ctx.createLinearGradient(0, 0, 0, cssH);
  g.addColorStop(0, reverse ? GRADIENT_BOTTOM : GRADIENT_TOP);
  g.addColorStop(1, reverse ? GRADIENT_TOP : GRADIENT_BOTTOM);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cssW, cssH);

  for (let y = 0; y < cssH; y += CELL) {
    for (let x = 0; x < cssW; x += CELL) {
      const a = Math.random() * MAX_ALPHA;
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.fillRect(x, y, DOT, DOT);
    }
  }
}

export function BentoCardCanvasBg({
  className,
  reverse,
}: {
  className?: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const run = () => paint(canvas, reverse ?? false);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [reverse]);

  return (
    <canvas
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[16px]",
        className,
      )}
      aria-hidden
    />
  );
}

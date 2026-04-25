/**
 * Generates a self-contained React component as a `.tsx` source string.
 * Consumers paste it into their own project and render <ASCIIAnimation />
 * without needing to add any runtime dependencies.
 */

interface ComponentExportOptions {
  fps?: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  backgroundColor: string;
  textColor: string;
  fontWeight?: string | number;
  fontStyle?: "normal" | "italic";
}

/**
 * Strip `var(--foo)` CSS custom-property references from a font-family string.
 * The generated component is standalone; the CSS variable won't be defined in
 * the consumer's project, so we fall back to the next entry in the stack.
 */
function stripCssVars(fontFamily: string): string {
  const cleaned = fontFamily
    .split(",")
    .map((f) => f.trim())
    .filter((f) => !f.startsWith("var("))
    .join(", ")
    .trim();
  return cleaned || "ui-monospace, monospace";
}

export function buildAnimationComponentSource(
  frames: string[],
  opts: ComponentExportOptions,
): string {
  const fps = opts.fps && opts.fps > 0 ? opts.fps : 24;
  const safeFrames = frames.length > 0 ? frames : [""];
  const framesLiteral = safeFrames
    .map((frame) => JSON.stringify(frame))
    .join(",\n  ");

  // Strip CSS custom properties — they won't resolve in a standalone project.
  const exportFontFamily = stripCssVars(opts.fontFamily);
  const fontWeight = opts.fontWeight ?? "normal";
  const fontStyle = opts.fontStyle ?? "normal";

  return `"use client";

import { useEffect, useState } from "react";

const FRAMES = [
  ${framesLiteral},
];

interface ASCIIAnimationProps {
  /** Override the playback rate (frames per second). */
  fps?: number;
  /** Pause/resume playback. */
  playing?: boolean;
  className?: string;
}

export function ASCIIAnimation({
  fps = ${fps},
  playing = true,
  className,
}: ASCIIAnimationProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!playing || FRAMES.length <= 1) return;
    let raf = 0;
    let last = performance.now();
    const interval = 1000 / Math.max(1, fps);

    const tick = (now: number) => {
      if (now - last >= interval) {
        last = now;
        setFrame((f) => (f + 1) % FRAMES.length);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, playing]);

  return (
    <pre
      className={className}
      style={{
        margin: 0,
        padding: 16,
        background: ${JSON.stringify(opts.backgroundColor)},
        color: ${JSON.stringify(opts.textColor)},
        fontFamily: ${JSON.stringify(exportFontFamily)},
        fontSize: ${opts.fontSize},
        lineHeight: ${opts.lineHeight},
        letterSpacing: ${opts.letterSpacing},
        fontWeight: ${JSON.stringify(String(fontWeight))},
        fontStyle: ${JSON.stringify(fontStyle)},
        whiteSpace: "pre",
        overflow: "auto",
      }}
    >
      {FRAMES[frame]}
    </pre>
  );
}

export default ASCIIAnimation;
`;
}

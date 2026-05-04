"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import FRAMES_JSON from "./frames/stroke-frames.json";

export const FPS = 24;
export const APPEARANCE = {
  backgroundColor: "#0B0B0D",
  borderRadius: 8,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: 12,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: -0.18,
  lineHeight: 0.65,
  showFrameCounter: false,
  textColor: "#B54B00",
  textEffect: "none",
  useColors: false,
  textEffectThreshold: 0,
};
export const CHARS = " .:-=+*#%@";
export const FRAMES = FRAMES_JSON as string[];

export default function StrokeAscii({
  backgroundColor = APPEARANCE.backgroundColor,
}: {
  backgroundColor?: string;
} = {}) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scale, setScale] = useState(1);
  const [layoutSize, setLayoutSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLPreElement>(null);
  const frameIndexRef = useRef(0);
  const measureRetryRef = useRef(0);
  const frames = FRAMES;

  useEffect(() => {
    frameIndexRef.current = 0;
    if (frames.length <= 1) return;
    let animationId: number;
    let lastTime: number | null = null;
    let accumulator = 0;
    const frameDuration = 1000 / FPS;

    const animate = (time: number) => {
      if (lastTime === null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      accumulator += delta;

      if (accumulator >= frameDuration) {
        const stepCount = Math.floor(accumulator / frameDuration);
        accumulator -= stepCount * frameDuration;
        const nextFrame = (frameIndexRef.current + stepCount) % frames.length;
        if (nextFrame !== frameIndexRef.current) {
          frameIndexRef.current = nextFrame;
          setCurrentFrame(nextFrame);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [frames.length]);

  const measure = useCallback(() => {
    const run = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      const naturalWidth = content.scrollWidth;
      const naturalHeight = content.scrollHeight;

      if (naturalWidth <= 0 || naturalHeight <= 0) {
        if (measureRetryRef.current < 8) {
          measureRetryRef.current += 1;
          requestAnimationFrame(() => {
            requestAnimationFrame(run);
          });
        }
        return;
      }
      measureRetryRef.current = 0;
      if (availableWidth <= 0) return;

      const scaleW = availableWidth / naturalWidth;
      const scaleH =
        availableHeight > 0
          ? availableHeight / naturalHeight
          : Number.POSITIVE_INFINITY;
      const newScale = Math.min(scaleW, scaleH, 1);

      setScale(newScale);
      setLayoutSize({
        w: naturalWidth * newScale,
        h: naturalHeight * newScale,
      });
    };
    run();
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  useLayoutEffect(() => {
    measure();
  }, [measure, currentFrame]);

  if (!frames.length) return null;

  const effect = APPEARANCE.textEffect;
  const needsStyles = effect !== "none";
  const text = frames[currentFrame];

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor,
        borderRadius: `${APPEARANCE.borderRadius}px`,
        color: APPEARANCE.textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: APPEARANCE.fontFamily,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 0,
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <div
        style={{
          width: layoutSize ? `${layoutSize.w}px` : "100%",
          height: layoutSize ? `${layoutSize.h}px` : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          minHeight: 0,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {needsStyles && (
            <style
              dangerouslySetInnerHTML={{
                __html: `
					@keyframes ascii-rainbow { 0% { background-position: 0%; } 100% { background-position: 200%; } }
					@keyframes ascii-burn-neon { 0%, 100% { color: #ff3300; text-shadow: 0 0 20px #ff0000, 0 0 40px #ff3300; } 50% { color: #ffffff; text-shadow: 0 0 10px #ffffff, 0 0 20px #ffaa00; } }
					@keyframes ascii-neural-pulse { 0% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } 100% { filter: hue-rotate(360deg); } }
					.ascii-effect-video { background-image: url('https://i.pinimg.com/originals/80/b7/5e/80b75eb774b647c67b2efa531b57ba13.gif'); background-size: cover; background-clip: text; -webkit-background-clip: text; color: transparent !important; }
					.ascii-effect-gradient { background-image: linear-gradient(45deg, #ff4c4c, #b3ff4c, #4c99ff, #4cc3ff, #b34cff); background-size: 200%; background-clip: text; -webkit-background-clip: text; color: transparent !important; animation: ascii-rainbow 5s linear infinite; }
					.ascii-effect-burn { animation: ascii-burn-neon 1.5s alternate infinite ease-in-out; }
					.ascii-effect-neural { animation: ascii-neural-pulse 3s linear infinite; text-shadow: 0 0 10px rgba(0, 100, 255, 0.5), 0 0 20px rgba(0, 50, 255, 0.3); }
				`,
              }}
            />
          )}

          {APPEARANCE.showFrameCounter && (
            <div
              style={{ opacity: 0.5, fontSize: "10px", marginBottom: "8px" }}
            >
              Frame: {currentFrame + 1}/{frames.length}
            </div>
          )}
          <pre
            ref={contentRef}
            style={{
              fontFamily: "inherit",
              fontSize: `${APPEARANCE.fontSize}px`,
              fontWeight: APPEARANCE.fontWeight,
              fontStyle: APPEARANCE.fontStyle,
              letterSpacing: `${APPEARANCE.letterSpacing}em`,
              lineHeight: APPEARANCE.lineHeight,
              margin: 0,
              whiteSpace: "pre",
              ...(effect === "matrix" && APPEARANCE.textEffectThreshold <= 0
                ? {
                    color: "#00ff00",
                    textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
                  }
                : effect === "neon" && APPEARANCE.textEffectThreshold <= 0
                  ? {
                      color: "#ff00ff",
                      textShadow:
                        "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
                    }
                  : effect === "glitch" && APPEARANCE.textEffectThreshold <= 0
                    ? {
                        textShadow: "2px 0 0 red, -2px 0 0 blue",
                      }
                    : {}),
            }}
          >
            {(() => {
              const threshold = APPEARANCE.textEffectThreshold;

              if (!text || effect === "none" || threshold <= 0 || !CHARS) {
                return (
                  <span
                    className={
                      effect === "none" ? "" : `ascii-effect-${effect}`
                    }
                  >
                    {text}
                  </span>
                );
              }

              const thresholdIndex = Math.floor(CHARS.length * threshold);
              const affectedChars = CHARS.slice(thresholdIndex);
              const effectClass = `ascii-effect-${effect}`;

              const effectStyle =
                effect === "matrix"
                  ? {
                      color: "#00ff00",
                      textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",
                    }
                  : effect === "neon"
                    ? {
                        color: "#ff00ff",
                        textShadow:
                          "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",
                      }
                    : effect === "glitch"
                      ? { textShadow: "2px 0 0 red, -2px 0 0 blue" }
                      : {};

              const result = [];
              let currentBatch = "";
              let isBatchAffected = false;

              for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const isAffected = affectedChars.includes(char);

                if (isAffected !== isBatchAffected && currentBatch !== "") {
                  result.push(
                    isBatchAffected ? (
                      <span key={i} className={effectClass} style={effectStyle}>
                        {currentBatch}
                      </span>
                    ) : (
                      currentBatch
                    ),
                  );
                  currentBatch = "";
                }
                currentBatch += char;
                isBatchAffected = isAffected;
              }

              if (currentBatch !== "") {
                result.push(
                  isBatchAffected ? (
                    <span
                      key="final"
                      className={effectClass}
                      style={effectStyle}
                    >
                      {currentBatch}
                    </span>
                  ) : (
                    currentBatch
                  ),
                );
              }

              return result;
            })()}
          </pre>
        </div>
      </div>
    </div>
  );
}

import { type ASCIIAppearance } from "@/lib/ascii-config";

type ASCIIExportParams = {
  appearance: ASCIIAppearance;
  fileName: string;
  fps: number;
  frames: string[];
  chars: string;
};

type ASCIIRenderMetrics = {
  charWidth: number;
  counterHeight: number;
  font: string;
  height: number;
  lineHeightPx: number;
  width: number;
};

export async function exportASCIIAnimationAsVideo({
  appearance,
  fileName,
  fps,
  frames,
  chars,
}: ASCIIExportParams) {
  if (frames.length === 0) {
    throw new Error("Convert a video first so there are frames to export.");
  }

  if (typeof MediaRecorder === "undefined") {
    throw new Error(
      "This browser does not support MediaRecorder video export.",
    );
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The browser could not create a 2D canvas context.");
  }

  const metrics = measureFrames(context, frames, appearance);
  const scale = metrics.width <= 720 ? 2 : 1;
  canvas.width = Math.ceil(metrics.width * scale);
  canvas.height = Math.ceil(metrics.height * scale);

  const stream = canvas.captureStream(fps);
  const mimeType = getSupportedVideoMimeType();

  if (!mimeType) {
    throw new Error("This browser cannot record canvas output as WebM.");
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6_000_000,
  });

  const blobPromise = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onerror = () => {
      reject(
        new Error("Video export failed while recording the canvas stream."),
      );
    };

    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  recorder.start();

  try {
    const frameDuration = 1000 / fps;

    for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
      drawFrame({
        appearance,
        canvas,
        context,
        frame: frames[frameIndex],
        frameIndex,
        metrics,
        scale,
        totalFrames: frames.length,
        chars,
      });

      await wait(frameDuration);
    }

    await wait(frameDuration);
    recorder.stop();
    const blob = await blobPromise;
    downloadBlob(blob, `${sanitizeFileStem(fileName)}.webm`);
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }
}

export function exportASCIIAnimationAsReactComponent({
  appearance,
  fileName,
  fps,
  frames,
  chars,
}: ASCIIExportParams) {
  if (frames.length === 0) {
    throw new Error("Convert a video first so there are frames to export.");
  }

  const stem = sanitizeFileStem(fileName);
  const componentName = toPascalCase(stem);
  const source = buildASCIIAnimationReactComponentSource({
    appearance,
    componentName,
    fps,
    frames,
    chars,
  });

  downloadTextFile(source, `${stem}.tsx`);
}

export async function exportASCIIAsImage({
  appearance,
  fileName,
  frame,
  chars,
  quality = 2,
}: {
  appearance: ASCIIAppearance;
  fileName: string;
  frame: string;
  chars: string;
  quality?: number;
}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("The browser could not create a 2D canvas context.");
  }

  const metrics = measureFrames(context, [frame], appearance);

  const scale = quality;
  canvas.width = Math.ceil(metrics.width * scale);
  canvas.height = Math.ceil(metrics.height * scale);

  drawFrame({
    appearance,
    canvas,
    context,
    frame,
    frameIndex: 0,
    metrics,
    scale,
    totalFrames: 1,
    chars,
  });

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });

  if (!blob) {
    throw new Error("Failed to generate image blob.");
  }

  downloadBlob(blob, `${sanitizeFileStem(fileName)}.png`);
}

export function buildASCIIAnimationReactComponentSource({
  appearance,
  componentName,
  fps,
  frames,
  chars,
}: {
  appearance: ASCIIAppearance;
  componentName: string;
  fps: number;
  frames: string[];
  chars: string;
}) {
  const framesJson = JSON.stringify(frames, null, "\t");
  const appearanceJson = JSON.stringify(appearance, null, "\t");

  return [
    '"use client";',
    "",
    'import React, { useEffect, useRef, useState } from "react";',
    "",
    `const FPS = ${fps};`,
    `const FRAMES = ${framesJson};`,
    `const APPEARANCE = ${appearanceJson};`,
    `const CHARS = ${JSON.stringify(chars)};`,
    "",
    `export default function ${componentName}() {`,
    "\tconst [currentFrame, setCurrentFrame] = useState(0);",
    "\tconst [scale, setScale] = useState(1);",
    "\tconst containerRef = useRef<HTMLDivElement>(null);",
    "\tconst contentRef = useRef<HTMLPreElement>(null);",
    "",
    "\tuseEffect(() => {",
    "\t\tlet animationId: number;",
    "\t\tlet lastTime = 0;",
    "\t\tconst frameDuration = 1000 / FPS;",
    "",
    "\t\tconst animate = (time: number) => {",
    "\t\t\tif (!lastTime) lastTime = time;",
    "\t\t\tconst delta = time - lastTime;",
    "",
    "\t\t\tif (delta >= frameDuration) {",
    "\t\t\t\tsetCurrentFrame((current: number) => (current + 1) % FRAMES.length);",
    "\t\t\t\tlastTime = time - (delta % frameDuration);",
    "\t\t\t}",
    "",
    "\t\t\tanimationId = requestAnimationFrame(animate);",
    "\t\t};",
    "",
    "\t\tanimationId = requestAnimationFrame(animate);",
    "\t\treturn () => cancelAnimationFrame(animationId);",
    "\t}, []);",
    "",
    "\tuseEffect(() => {",
    "\t\tconst measure = () => {",
    "\t\t\tconst container = containerRef.current;",
    "\t\t\tconst content = contentRef.current;",
    "\t\t\tif (!container || !content) return;",
    "",
    "\t\t\tconst availableWidth = container.clientWidth;",
    "\t\t\tconst naturalWidth = content.scrollWidth;",
    "",
    "\t\t\tif (availableWidth > 0 && naturalWidth > 0 && naturalWidth > availableWidth) {",
    "\t\t\t\tsetScale(availableWidth / naturalWidth);",
    "\t\t\t} else {",
    "\t\t\t\tsetScale(1);",
    "\t\t\t}",
    "\t\t};",
    "",
    "\t\tmeasure();",
    "\t\tconst observer = new ResizeObserver(measure);",
    "\t\tif (containerRef.current) observer.observe(containerRef.current);",
    "\t\treturn () => observer.disconnect();",
    "\t}, []);",
    "",
    "\tconst effect = APPEARANCE.textEffect;",
    '\tconst needsStyles = effect !== "none";',
    "",
    "\treturn (",
    "\t\t<div",
    "\t\t\tref={containerRef}",
    "\t\t\tstyle={{",
    "\t\t\t\tbackgroundColor: APPEARANCE.backgroundColor,",
    "\t\t\t\tborderRadius: `${APPEARANCE.borderRadius}px`,",
    "\t\t\t\tcolor: APPEARANCE.textColor,",
    '\t\t\t\tdisplay: "flex",',
    '\t\t\t\tflexDirection: "column",',
    "\t\t\t\tfontFamily: APPEARANCE.fontFamily,",
    '\t\t\t\toverflow: "hidden",',
    '\t\t\t\tposition: "relative",',
    '\t\t\t\twidth: "100%",',
    "\t\t\t}}",
    "\t\t>",
    "\t\t\t{needsStyles && (",
    "\t\t\t\t<style dangerouslySetInnerHTML={{ __html: `",
    "\t\t\t\t\t@keyframes ascii-rainbow { 0% { background-position: 0%; } 100% { background-position: 200%; } }",
    "\t\t\t\t\t@keyframes ascii-burn-neon { 0%, 100% { color: #ff3300; text-shadow: 0 0 20px #ff0000, 0 0 40px #ff3300; } 50% { color: #ffffff; text-shadow: 0 0 10px #ffffff, 0 0 20px #ffaa00; } }",
    "\t\t\t\t\t@keyframes ascii-neural-pulse { 0% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } 100% { filter: hue-rotate(360deg); } }",
    "\t\t\t\t\t.ascii-effect-video { background-image: url('https://i.pinimg.com/originals/80/b7/5e/80b75eb774b647c67b2efa531b57ba13.gif'); background-size: cover; background-clip: text; -webkit-background-clip: text; color: transparent !important; }",
    "\t\t\t\t\t.ascii-effect-gradient { background-image: linear-gradient(45deg, #ff4c4c, #b3ff4c, #4c99ff, #4cc3ff, #b34cff); background-size: 200%; background-clip: text; -webkit-background-clip: text; color: transparent !important; animation: ascii-rainbow 5s linear infinite; }",
    "\t\t\t\t\t.ascii-effect-burn { animation: ascii-burn-neon 1.5s alternate infinite ease-in-out; }",
    "\t\t\t\t\t.ascii-effect-neural { animation: ascii-neural-pulse 3s linear infinite; text-shadow: 0 0 10px rgba(0, 100, 255, 0.5), 0 0 20px rgba(0, 50, 255, 0.3); }",
    "\t\t\t\t` }} />",
    "\t\t\t)}",
    "",
    '\t\t\t<div style={{ transform: `scale(${scale})`, transformOrigin: "left top" }}>',
    "\t\t\t\t{APPEARANCE.showFrameCounter && (",
    '\t\t\t\t\t<div style={{ opacity: 0.5, fontSize: "10px", marginBottom: "8px" }}>',
    "\t\t\t\t\t\tFrame: {currentFrame + 1}/{FRAMES.length}",
    "\t\t\t\t\t</div>",
    "\t\t\t\t)}",
    "\t\t\t\t<pre",
    "\t\t\t\t\tref={contentRef}",
    "\t\t\t\t\tstyle={{",
    '\t\t\t\t\t\tfontFamily: "inherit",',
    "\t\t\t\t\t\tfontSize: `${APPEARANCE.fontSize}px`,",
    "\t\t\t\t\t\tlineHeight: APPEARANCE.lineHeight,",
    "\t\t\t\t\t\tmargin: 0,",
    '\t\t\t\t\t\twhiteSpace: "pre",',
    '\t\t\t\t\t\t...(effect === "matrix" && APPEARANCE.textEffectThreshold <= 0 ? {',
    '\t\t\t\t\t\t\tcolor: "#00ff00",',
    '\t\t\t\t\t\t\ttextShadow: "0 0 10px #00ff00, 0 0 20px #00ff00",',
    '\t\t\t\t\t\t} : effect === "neon" && APPEARANCE.textEffectThreshold <= 0 ? {',
    '\t\t\t\t\t\t\tcolor: "#ff00ff",',
    '\t\t\t\t\t\t\ttextShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff",',
    '\t\t\t\t\t\t} : effect === "glitch" && APPEARANCE.textEffectThreshold <= 0 ? {',
    '\t\t\t\t\t\t\ttextShadow: "2px 0 0 red, -2px 0 0 blue",',
    "\t\t\t\t\t\t} : {}),",
    "\t\t\t\t\t}}",
    "\t\t\t\t>",
    "\t\t\t\t\t{(() => {",
    "\t\t\t\t\t\tconst text = FRAMES[currentFrame];",
    "\t\t\t\t\t\tconst threshold = APPEARANCE.textEffectThreshold;",
    "",
    '\t\t\t\t\t\tif (!text || effect === "none" || threshold <= 0 || !CHARS) {',
    "\t\t\t\t\t\t\treturn (",
    '\t\t\t\t\t\t\t\t<span className={effect === "none" ? "" : `ascii-effect-${effect}`}>',
    "\t\t\t\t\t\t\t\t\t{text}",
    "\t\t\t\t\t\t\t\t</span>",
    "\t\t\t\t\t\t\t);",
    "\t\t\t\t\t\t}",
    "",
    "\t\t\t\t\t\tconst thresholdIndex = Math.floor(CHARS.length * threshold);",
    "\t\t\t\t\t\tconst affectedChars = CHARS.slice(thresholdIndex);",
    "\t\t\t\t\t\tconst effectClass = `ascii-effect-${effect}`;",
    "",
    "\t\t\t\t\t\tconst effectStyle =",
    '\t\t\t\t\t\t\teffect === "matrix" ? { color: "#00ff00", textShadow: "0 0 10px #00ff00, 0 0 20px #00ff00" } :',
    '\t\t\t\t\t\t\teffect === "neon" ? { color: "#ff00ff", textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff" } :',
    '\t\t\t\t\t\t\teffect === "glitch" ? { textShadow: "2px 0 0 red, -2px 0 0 blue" } :',
    "\t\t\t\t\t\t\t{};",
    "",
    "\t\t\t\t\t\tconst result = [];",
    '\t\t\t\t\t\tlet currentBatch = "";',
    "\t\t\t\t\t\tlet isBatchAffected = false;",
    "",
    "\t\t\t\t\t\tfor (let i = 0; i < text.length; i++) {",
    "\t\t\t\t\t\t\tconst char = text[i];",
    "\t\t\t\t\t\t\tconst isAffected = affectedChars.includes(char);",
    "",
    '\t\t\t\t\t\t\tif (isAffected !== isBatchAffected && currentBatch !== "") {',
    "\t\t\t\t\t\t\t\tresult.push(isBatchAffected ?",
    "\t\t\t\t\t\t\t\t\t<span key={i} className={effectClass} style={effectStyle}>{currentBatch}</span> :",
    "\t\t\t\t\t\t\t\t\tcurrentBatch",
    "\t\t\t\t\t\t\t\t);",
    '\t\t\t\t\t\t\t\tcurrentBatch = "";',
    "\t\t\t\t\t\t\t}",
    "\t\t\t\t\t\t\tcurrentBatch += char;",
    "\t\t\t\t\t\t\tisBatchAffected = isAffected;",
    "\t\t\t\t\t\t}",
    "",
    '\t\t\t\t\t\tif (currentBatch !== "") {',
    "\t\t\t\t\t\t\tresult.push(isBatchAffected ?",
    '\t\t\t\t\t\t\t\t<span key="final" className={effectClass} style={effectStyle}>{currentBatch}</span> :',
    "\t\t\t\t\t\t\t\tcurrentBatch",
    "\t\t\t\t\t\t\t);",
    "\t\t\t\t\t\t}",
    "",
    "\t\t\t\t\t\treturn result;",
    "\t\t\t\t\t})()}",
    "\t\t\t\t</pre>",
    "\t\t\t</div>",
    "\t\t</div>",
    "\t);",
    "}",
  ].join("\n");
}

function measureFrames(
  context: CanvasRenderingContext2D,
  frames: string[],
  appearance: ASCIIAppearance,
): ASCIIRenderMetrics {
  const normalizedFrames = frames.map(normalizeFrame);
  const maxColumns = normalizedFrames.reduce(
    (maxWidth, frame) =>
      Math.max(
        maxWidth,
        frame.reduce((rowWidth, row) => Math.max(rowWidth, row.length), 0),
      ),
    0,
  );
  const maxRows = normalizedFrames.reduce(
    (maxHeight, frame) => Math.max(maxHeight, frame.length),
    0,
  );
  const font = `${appearance.fontSize}px ${appearance.fontFamily}`;
  context.font = font;

  const charWidth = Math.max(1, context.measureText("M").width);
  const lineHeightPx = Math.max(1, appearance.fontSize * appearance.lineHeight);
  const counterHeight = appearance.showFrameCounter
    ? appearance.fontSize * 2
    : 0;
  const width = Math.max(360, Math.ceil(maxColumns * charWidth));
  const height = Math.max(
    240,
    Math.ceil(counterHeight + maxRows * lineHeightPx),
  );

  return {
    charWidth,
    counterHeight,
    font,
    height,
    lineHeightPx,
    width,
  };
}

function drawFrame({
  appearance,
  canvas,
  context,
  frame,
  frameIndex,
  metrics,
  scale,
  totalFrames,
  chars,
}: {
  appearance: ASCIIAppearance;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  frame: string;
  frameIndex: number;
  metrics: ASCIIRenderMetrics;
  scale: number;
  totalFrames: number;
  chars: string;
}) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.scale(scale, scale);
  context.fillStyle = appearance.backgroundColor;
  context.fillRect(0, 0, metrics.width, metrics.height);
  context.font = metrics.font;
  context.textBaseline = "top";

  let renderFillStyle: string | CanvasGradient = appearance.textColor;
  const isMatrix = appearance.textEffect === "matrix";
  const isNeon = appearance.textEffect === "neon";
  const isGlitch = appearance.textEffect === "glitch";
  const isGradient = appearance.textEffect === "gradient";
  const isBurn = appearance.textEffect === "burn";
  const isNeural = appearance.textEffect === "neural";
  const isVideo = appearance.textEffect === "video";

  if (isMatrix) {
    renderFillStyle = "#00ff00";
    context.shadowColor = "#00ff00";
    context.shadowBlur = 10;
  } else if (isNeon) {
    renderFillStyle = "#ff00ff";
    context.shadowColor = "#ff00ff";
    context.shadowBlur = 20;
  } else if (isBurn) {
    const t = (Math.sin(frameIndex * 0.5) + 1) / 2;
    renderFillStyle = t > 0.5 ? "#ffffff" : "#ff3300";
    context.shadowColor = renderFillStyle as string;
    context.shadowBlur = t > 0.5 ? 10 : 20;
  } else if (isGradient) {
    const gradient = context.createLinearGradient(
      0,
      0,
      metrics.width,
      metrics.height,
    );
    gradient.addColorStop(0, "#ff4c4c");
    gradient.addColorStop(0.2, "#b3ff4c");
    gradient.addColorStop(0.4, "#4c99ff");
    gradient.addColorStop(0.6, "#4cc3ff");
    gradient.addColorStop(0.8, "#b34cff");
    gradient.addColorStop(1, "#ff4c4c");
    renderFillStyle = gradient;
  } else if (isNeural) {
    const shift = (frameIndex * 10) % metrics.width;
    const gradient = context.createLinearGradient(
      -metrics.width + shift,
      0,
      metrics.width + shift,
      0,
    );

    const colors = [
      "#ff00cc",
      "#3333ff",
      "#00ffcc",
      "#ffff00",
      "#ff6600",
      "#ff00cc",
      "#3333ff",
      "#00ffcc",
      "#ffff00",
      "#ff6600",
      "#ff00cc",
    ];
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color);
    });

    renderFillStyle = gradient;

    const pulse = (Math.sin(frameIndex * 0.2) + 1) / 2;
    context.shadowBlur = 10 + pulse * 10;
    context.shadowColor = "rgba(0, 100, 255, 0.4)";
  } else if (isVideo) {
    renderFillStyle = "#00ff00";
  }

  context.fillStyle = renderFillStyle;

  let y = 0;

  if (appearance.showFrameCounter) {
    context.globalAlpha = 0.78;
    context.fillText(`Frame: ${frameIndex + 1}/${totalFrames}`, 0, y);
    context.globalAlpha = 1;
    y += metrics.counterHeight;
  }

  const rows = normalizeFrame(frame);
  const { textEffectThreshold } = appearance;
  const thresholdIndex =
    textEffectThreshold > 0 && chars
      ? Math.floor(chars.length * textEffectThreshold)
      : -1;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];

    if (thresholdIndex > -1) {
      context.fillStyle = appearance.textColor;
      context.shadowBlur = 0;
      context.fillText(row, 0, y);
    }

    if (isGlitch) {
      context.fillStyle = "red";
      context.fillText(row, 2, y);
      context.fillStyle = "blue";
      context.fillText(row, -2, y);
      context.fillStyle = renderFillStyle;
    }

    context.fillStyle = renderFillStyle;
    if (isMatrix) {
      context.shadowColor = "#00ff00";
      context.shadowBlur = 10;
    } else if (isNeon) {
      context.shadowColor = "#ff00ff";
      context.shadowBlur = 20;
    } else if (isBurn) {
      const t = (Math.sin(frameIndex * 0.5) + 1) / 2;
      context.shadowColor = t > 0.5 ? "#ffffff" : "#ff3300";
      context.shadowBlur = t > 0.5 ? 10 : 20;
    } else if (isNeural) {
      const pulse = (Math.sin(frameIndex * 0.2) + 1) / 2;
      context.shadowBlur = 10 + pulse * 10;
      context.shadowColor = "rgba(0, 100, 255, 0.4)";
    }

    if (thresholdIndex > -1) {
      for (let charIndex = 0; charIndex < row.length; charIndex += 1) {
        const char = row[charIndex];
        if (chars.indexOf(char) >= thresholdIndex) {
          context.fillText(char, charIndex * metrics.charWidth, y);
        }
      }
    } else {
      context.fillText(row, 0, y);
    }

    y += metrics.lineHeightPx;
  }

  context.shadowBlur = 0;
  context.shadowColor = "transparent";
}

function normalizeFrame(frame: string) {
  return frame.replace(/\r/g, "").replace(/\n$/, "").split("\n");
}

function getSupportedVideoMimeType() {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

function downloadBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

function downloadTextFile(content: string, fileName: string) {
  downloadBlob(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
    fileName,
  );
}

function sanitizeFileStem(fileName: string) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  return (
    stem
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "ascii-animation"
  );
}

function toPascalCase(value: string) {
  const normalized = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1));

  const joined = normalized.join("");

  return /^[A-Z]/.test(joined) ? joined : `Ascii${joined}`;
}

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

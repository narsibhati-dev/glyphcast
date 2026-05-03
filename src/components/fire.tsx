"use client";

import ASCIIAnimation from "@/components/ascii-animation";
import FRAMES_JSON from "@/data/ascii-frames/fire-component.frames.json";

const frames = FRAMES_JSON as string[];

export default function Fire() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ASCIIAnimation
        className="w-full h-full"
        frames={frames}
        fps={30}
        chars={" .:░▒▓█"}
        fitToContainer
        appearance={{
          backgroundColor: "transparent",
          borderRadius: 0,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 8,
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          lineHeight: 0.78,
          showFrameCounter: false,
          textColor: "#B54B00",
          textEffect: "none",
          useColors: false,
          textEffectThreshold: 0,
        }}
      />
    </div>
  );
}

import type { ASCIIAppearance } from "@/lib/ascii-config";
import {
  APPEARANCE as ThunderAppearance,
  CHARS as ThunderChars,
  FPS as ThunderFps,
  FRAMES as ThunderFrames,
} from "./thunder";
import {
  APPEARANCE as FireAppearance,
  CHARS as FireChars,
  FPS as FireFps,
  FRAMES as FireFrames,
} from "./fire";

import {
  APPEARANCE as CarAppearance,
  CHARS as CarChars,
  FPS as CarFps,
  FRAMES as CarFrames,
} from "./car";

export interface ASCIIShowcaseEntry {
  id: string;
  title: string;
  description: string;
  filename: string;
  accentColor: string;
  componentName: string;
  frames: string[];
  fps: number;
  chars: string;
  appearance: ASCIIAppearance;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD YOUR OWN ANIMATION
//
// 1. Export your animation from the Glyphcast studio (React component).
// 2. Paste the downloaded .tsx into this folder (with `export const FRAMES = [...]`).
// 3. Run `node scripts/extract-ascii-frames.mjs` (after adding the name to that script)
//    or manually create `src/data/ascii-frames/<id>.frames.json` as a JSON string array,
//    then replace FRAMES with `import ... from "@/data/ascii-frames/<id>.frames.json"`.
// 4. Import FPS / FRAMES / APPEARANCE / CHARS below and add an ASCII_SHOWCASE entry.
// ─────────────────────────────────────────────────────────────────────────────

// Example — uncomment and adapt:
//
// import {
//   FRAMES as MyFrames,
//   APPEARANCE as MyAppearance,
//   FPS as MyFps,
//   CHARS as MyChars,
// } from "./my-animation";
//
// Then add to the array:
// {
//   id: "my-animation",
//   title: "My Animation",
//   description: "Short description of what it does.",
//   filename: "my-animation.tsx",
//   accentColor: "#B54B00",
//   componentName: "MyAnimation",
//   frames: MyFrames,
//   fps: MyFps,
//   chars: MyChars,
//   appearance: MyAppearance,
// },

export const ASCII_SHOWCASE: ASCIIShowcaseEntry[] = [
  {
    id: "car",
    title: "car",
    description: "ASCII car animation.",
    filename: "car.tsx",
    accentColor: "#B54B00",
    componentName: "Car",
    frames: CarFrames,
    fps: CarFps,
    chars: CarChars,
    appearance: CarAppearance as ASCIIAppearance,
  },
  {
    id: "thunder",
    title: "Thunder",
    description: "ASCII thunder/lightning strike animation.",
    filename: "thunder.tsx",
    accentColor: "#B54B00",
    componentName: "Stroke",
    frames: ThunderFrames,
    fps: ThunderFps,
    chars: ThunderChars,
    appearance: ThunderAppearance as ASCIIAppearance,
  },
  {
    id: "fire",
    title: "Fire",
    description: "ASCII fire animation with dynamic flame motion.",
    filename: "fire.tsx",
    accentColor: "#B54B00",
    componentName: "Ascii",
    frames: FireFrames,
    fps: FireFps,
    chars: FireChars,
    appearance: FireAppearance as ASCIIAppearance,
  },
];

export {
  APPEARANCE as THUNDER_APPEARANCE,
  CHARS as THUNDER_CHARS,
  FPS as THUNDER_FPS,
  FRAMES as THUNDER_FRAMES,
} from "./thunder";

export {
  APPEARANCE as FIRE_APPEARANCE,
  CHARS as FIRE_CHARS,
  FPS as FIRE_FPS,
  FRAMES as FIRE_FRAMES,
} from "./fire";

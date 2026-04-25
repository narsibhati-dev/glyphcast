/**
 * Source-of-truth for landing-page sample images. Both the Hero converter and
 * the Examples gallery read from this list so the two stay in sync.
 */
export interface LandingSample {
  id: string;
  label: string;
  description: string;
  src: string;
  /** Recommended defaults so each sample looks its best out of the gate. */
  defaults: {
    columns: number;
    charset: string;
    invert: boolean;
  };
}

export const LANDING_SAMPLES: LandingSample[] = [
  {
    id: "skyline",
    label: "Skyline",
    description: "Sunset over jagged peaks — high tonal range.",
    src: "/samples/skyline.svg",
    defaults: { columns: 160, charset: "default", invert: false },
  },
  {
    id: "portrait",
    label: "Portrait",
    description: "Rim-lit silhouette with soft shadow falloff.",
    src: "/samples/portrait.svg",
    defaults: { columns: 140, charset: "cinematic", invert: false },
  },
  {
    id: "abstract",
    label: "Abstract",
    description: "Layered orbs in cool/warm contrast.",
    src: "/samples/abstract.svg",
    defaults: { columns: 180, charset: "blocks", invert: false },
  },
  {
    id: "glyph",
    label: "Glyph",
    description: "Single bold character on a grid.",
    src: "/samples/glyph.svg",
    defaults: { columns: 120, charset: "matrix", invert: false },
  },
];

export const DEFAULT_LANDING_SAMPLE_ID = LANDING_SAMPLES[0].id;

export function getLandingSample(id: string | null | undefined): LandingSample {
  if (!id) return LANDING_SAMPLES[0];
  return LANDING_SAMPLES.find((s) => s.id === id) ?? LANDING_SAMPLES[0];
}

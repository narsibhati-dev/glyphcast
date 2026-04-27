"use client";

import { ImagesBadge } from "./images-badge";

const HANDOFF_SVGS = [
  "/bento/doc-mp4.svg",
  "/bento/doc-txt.svg",
  "/bento/doc-zip.svg",
] as const;

export default function ImagesBadgeDemoFour() {
  return (
    <div className="flex w-full items-center justify-center">
      <ImagesBadge
        text="Export previews"
        images={[...HANDOFF_SVGS]}
        hoverTranslateY={-130}
        hoverSpread={34}
        hoverRotation={10}
        teaserImageWidths={[110, 110, 110]}
        hoverImageWidths={[132, 142, 132]}
      />
    </div>
  );
}

"use client";

import React from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface PortalMarqueeTransformProps {
  className?: string;
  /** Stronger blue glow on thumbnails (e.g. dark bento card). */
  bentoShowcase?: boolean;
  /** Class for the vertical split handle (e.g. brand color on light bento). */
  splitBarClassName?: string;
  direction?: "rtl" | "ltr";
}

interface MarqueeMediaItem {
  src: string;
  type: "image" | "video";
}

const SOURCE_MEDIA: MarqueeMediaItem[] = [
  { src: "/portal-marquee-video/stroke-ascii.mp4", type: "video" },
  { src: "/portal-marquee-video/fire-ascii.mp4", type: "video" },
  { src: "/portal-marquee-video/skull-ascii.mp4", type: "video" },
  { src: "/portal-marquee-video/car-drifting-ascii.mp4", type: "video" },
];

const TRANSFORMED_MEDIA: MarqueeMediaItem[] = [
  { src: "/portal-marquee-video/below-video/stroke.gif", type: "image" },
  { src: "/portal-marquee-video/below-video/fire.mp4", type: "video" },
  { src: "/portal-marquee-video/below-video/skull.gif", type: "image" },
  { src: "/portal-marquee-video/below-video/car.gif", type: "image" },
];

function MarqueeStrip({
  media,
  isActive,
  transformed = false,
  strongGlow = false,
  direction = "rtl",
}: {
  media: MarqueeMediaItem[];
  isActive: boolean;
  transformed?: boolean;
  strongGlow?: boolean;
  direction?: "rtl" | "ltr";
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [loopWidth, setLoopWidth] = React.useState(0);
  const loopMedia = [...media, ...media];

  React.useEffect(() => {
    const updateLoopWidth = () => {
      if (!trackRef.current) {
        return;
      }

      setLoopWidth(trackRef.current.scrollWidth / 2);
    };

    updateLoopWidth();
    window.addEventListener("resize", updateLoopWidth);

    return () => {
      window.removeEventListener("resize", updateLoopWidth);
    };
  }, [media]);

  useAnimationFrame((_, delta) => {
    if (!isActive || loopWidth <= 0) {
      return;
    }

    const speed = 26; // pixels per second
    const step = (delta / 1000) * speed;

    if (direction === "ltr") {
      const nextX = x.get() + step;
      if (nextX >= 0) {
        x.set(nextX - loopWidth);
        return;
      }
      x.set(nextX);
      return;
    }

    const nextX = x.get() - step;
    if (nextX <= -loopWidth) {
      x.set(nextX + loopWidth);
      return;
    }
    x.set(nextX);
  });

  return (
    <motion.div
      ref={trackRef}
      className="absolute top-1/2 left-0 flex w-max -translate-y-1/2 items-center gap-5 pr-5"
      style={{ x }}
    >
      {loopMedia.map((item, index) => (
        <div
          key={`${item.src}-${index}-${transformed ? "transformed" : "source"}`}
          className={cn(
            "relative h-[154px] w-[234px] shrink-0 overflow-hidden rounded-2xl sm:h-[172px] sm:w-[262px]",
            "shadow-none",
          )}
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              className="h-full w-full object-cover"
              style={
                transformed
                  ? {
                      filter:
                        "grayscale(0.2) contrast(1.2) saturate(1.15) brightness(0.92)",
                    }
                  : undefined
              }
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Moving preview"
            />
          ) : (
            <img
              src={item.src}
              alt="Moving preview"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              style={
                transformed
                  ? {
                      filter:
                        "grayscale(0.2) contrast(1.2) saturate(1.15) brightness(0.92)",
                    }
                  : undefined
              }
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

export default function PortalMarqueeTransform({
  className,
  bentoShowcase = false,
  splitBarClassName = "bg-[#023cc4]",
  direction = "rtl",
}: PortalMarqueeTransformProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCanHover = () => setCanHover(mediaQuery.matches);
    updateCanHover();
    mediaQuery.addEventListener("change", updateCanHover);
    return () => mediaQuery.removeEventListener("change", updateCanHover);
  }, []);

  const isMarqueeActive = canHover ? isHovered : true;

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-[220px] overflow-hidden rounded-xl sm:min-h-[250px]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <MarqueeStrip
          media={TRANSFORMED_MEDIA}
          isActive={isMarqueeActive}
          strongGlow={bentoShowcase}
          direction={direction}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 50%)" }}
      >
        <MarqueeStrip
          media={SOURCE_MEDIA}
          isActive={isMarqueeActive}
          transformed
          strongGlow={bentoShowcase}
          direction={direction}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 z-20 h-[188px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[212px]",
          splitBarClassName,
        )}
      />
    </div>
  );
}

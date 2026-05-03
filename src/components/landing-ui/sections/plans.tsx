"use client";
import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { DmOnXButton } from "@/components/landing-ui/dm-on-x-button";

const ASCII_FREE = [
  " ░░░░░░░░░░░░░ ",
  "░  ▒▒▒▒▒▒▒▒▒  ░",
  "░ ▒  ·  ·  ▒ ░",
  "░ ▒  ASCII  ▒ ░",
  "░ ▒  STUDIO ▒ ░",
  "░  ▒▒▒▒▒▒▒▒▒  ░",
  " ░░░░░░░░░░░░░ ",
];

const ASCII_PRO = [
  "╔═══════════════╗",
  "║  ┌─────────┐  ║",
  "║  │ ▓▓▓▓▓▓▓ │  ║",
  "║  │ ▓ PRO ▓ │  ║",
  "║  │ ▓▓▓▓▓▓▓ │  ║",
  "║  └─────────┘  ║",
  "╚═══════════════╝",
];

const AsciiVisual = ({ tier }: { tier: "basic" | "premium" }) => {
  const frames = tier === "premium" ? ASCII_PRO : ASCII_FREE;
  const [activeRow, setActiveRow] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveRow((p) => (p + 1) % frames.length);
    }, 380);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frames.length]);

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <pre
        className="select-none leading-relaxed text-sm font-mono"
        style={{ color: tier === "premium" ? "#B54B00" : "#888" }}
      >
        {frames.map((row, i) => (
          <div
            key={i}
            style={{
              opacity: i === activeRow ? 1 : 0.45,
              fontWeight: i === activeRow ? 700 : 400,
              transition: "opacity 0.3s ease, font-weight 0.3s ease",
            }}
          >
            {row}
          </div>
        ))}
      </pre>
    </div>
  );
};

const Plans = () => {
  const DARK_CARD_BASE = "#151518";
  const DARK_CARD_LEVEL_3 = "#26262E";
  const DARK_CARD_DEEP_INSET = "#2E2E38";

  const sideColumnWidthPx = 260;
  const [isPlansPanelHovered, setIsPlansPanelHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "premium">("basic");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const cardBg = isDark ? DARK_CARD_LEVEL_3 : "#FFFFFF";
  const innerBg = isDark ? DARK_CARD_DEEP_INSET : "#F5F5F5";
  const outerBg = isDark ? DARK_CARD_BASE : "#F3F3F3";

  const contentVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.22,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.07,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, scale: 0.97, filter: "blur(4px)" },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(4px)",
      transition: { duration: 0.16, ease: "easeIn" },
    },
  };

  const pointsContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.055,
        delayChildren: 0.04,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  };

  const pointVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(3px)" },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(3px)",
      transition: { duration: 0.12, ease: "easeIn" },
    },
  };
  const basicPoints = [
    "Image, GIF, and video to ASCII in the browser",
    "Live preview with play and scrub",
    "Charset presets for density and feel",
    "Font stacks and typography controls",
    "Grid width, threshold, invert, and source color",
    "Stylized treatments on the ASCII layer",
    "Export PNG, video, React, ZIP, or clipboard",
  ];
  const premiumPoints = [
    "Everything in Basic",
    "Export at higher resolutions (1x to 4x) and chosen format",
    "Crop and rotate before you export",
    "Website backgrounds: blur, solid, source image, or transparent",
    "Advanced character styles, blend modes, opacity, and overlays",
    "Animated ASCII with motion controls, plus interactive lighting",
    "Deep post-processing: CRT, glitch, bloom, grain, and more",
    "Pro masking: freehand brush, size, invert, overlay, clear",
  ];

  return (
    <div
      id="plans"
      className="flex flex-col justify-center items-center scroll-mt-32"
    >
      <div
        className="flex  p-1.5 justify-center items-center relative"
        style={{
          background: "#B54B00",
          boxShadow:
            "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08), inset 2px 3px 3.5px rgba(255, 255, 255, 0.18)",
          borderRadius: "99px",
        }}
      >
        <button
          className="relative px-7 py-3 flex justify-center items-center font-medium"
          style={{ borderRadius: "99px", zIndex: 1 }}
          onClick={() => setActiveTab("basic")}
        >
          {activeTab === "basic" && (
            <motion.div
              layoutId="plans-tab-pill"
              className="absolute inset-0"
              style={{
                background: "#F5F5F5",
                boxShadow:
                  "0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 2px 2.2px rgba(255,255,255,0.1)",
                borderRadius: "99px",
                zIndex: 0,
              }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }}
              initial={false}
            />
          )}
          <span
            className="relative z-10"
            style={{
              color: activeTab === "basic" ? "#222" : "#fff",
            }}
          >
            Basic
          </span>
        </button>
        <button
          className="relative px-7 py-3 flex justify-center items-center font-medium"
          style={{ borderRadius: "99px", zIndex: 1 }}
          onClick={() => setActiveTab("premium")}
        >
          {activeTab === "premium" && (
            <motion.div
              layoutId="plans-tab-pill"
              className="absolute inset-0"
              style={{
                background: "#F5F5F5",
                boxShadow:
                  "0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 2px 2.2px rgba(255,255,255,0.1)",
                borderRadius: "99px",
                zIndex: 0,
              }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }}
              initial={false}
            />
          )}
          <span
            className="relative z-10"
            style={{
              color: activeTab === "premium" ? "#222" : "#fff",
            }}
          >
            Premium
          </span>
        </button>
      </div>
      <div
        className="landing-content-width border mt-10 relative overflow-hidden"
        onMouseEnter={() => setIsPlansPanelHovered(true)}
        onMouseLeave={() => setIsPlansPanelHovered(false)}
        style={{
          background: outerBg,
          boxShadow:
            "0px 1px 0px rgba(255, 255, 255, 0.25), inset 0px 1px 2px 1px rgba(0, 0, 0, 0.15)",
          borderRadius: "32px",
        }}
      >
        <video
          className="pointer-events-none absolute object-cover transition-opacity duration-300"
          src="/pricing-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            opacity: isPlansPanelHovered ? 1 : 0,
            height: "100%",
            width: "105%",
            objectFit: "cover",
          }}
        />
        <div
          className="relative z-10 grid gap-4 p-4 grid-cols-1 items-stretch md:[grid-template-columns:1fr_var(--plans-side-col)]"
          style={
            {
              "--plans-side-col": `${sideColumnWidthPx}px`,
            } as React.CSSProperties
          }
        >
          <motion.div
            layout="position"
            className="px-8 py-7"
            style={{
              background: cardBg,
              boxShadow:
                "0px 15px 6px rgba(0, 0, 0, 0.01), 0px 4px 4px rgba(0, 0, 0, 0.09), 0px 1px 2px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
                  opacity: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <motion.div
                    className="flex gap-2 items-center"
                    variants={sectionVariants}
                  >
                    <span className=" font-medium text-2xl">
                      {activeTab === "basic" ? "Basic" : "Premium"}
                    </span>{" "}
                  </motion.div>
                  <motion.div
                    style={{ lineHeight: "120%" }}
                    className="text-lg mt-3"
                    variants={sectionVariants}
                  >
                    {activeTab === "basic"
                      ? "In-browser studio: images, GIFs, and video to ASCII; export PNG, video, React, ZIP, or clipboard."
                      : "Pro controls for export scale, framing, web-ready backgrounds, advanced styles, animation, lighting, masking, and post-processing."}
                  </motion.div>
                  <motion.div
                    className="mt-6 flex flex-col gap-4"
                    variants={pointsContainerVariants}
                  >
                    {(activeTab === "basic" ? basicPoints : premiumPoints).map(
                      (point) => (
                        <motion.div
                          key={point}
                          className="flex gap-1.5"
                          variants={pointVariants}
                        >
                          <Check className="text-muted-foreground shrink-0 size-5 mt-0.5" />
                          <span className="text">{point}</span>
                        </motion.div>
                      ),
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div
            className="h-full"
            style={{
              background: cardBg,
              boxShadow:
                "0px 15px 6px rgba(0, 0, 0, 0.01), 0px 4px 4px rgba(0, 0, 0, 0.09), 0px 1px 2px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
            }}
          >
            <div className="p-3 flex gap-3 flex-col h-full">
              <div
                className="h-full flex-1 border rounded-xl"
                style={{
                  background: innerBg,
                  boxShadow:
                    "0px 1px 0px rgba(255, 255, 255, 0.25), inset 0px 1px 2px rgba(0, 0, 0, 0.15)",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    className="h-full max-sm:min-h-[20vh]"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.38,
                        duration: 0.18,
                        ease: [0.22, 1, 0.36, 1] as const,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.05, ease: "linear" },
                    }}
                  >
                    <AsciiVisual tier={activeTab} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <DmOnXButton className="w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;

"use client";
import { Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImagesBadgeDemoFour from "@/components/images-badge-demo-4";
import PortalMarqueeTransform from "@/components/portal-marquee-transform";
import MagnifiedBento from "@/components/magnified-bento";
import { BentoCardCanvasBg } from "@/components/landing-ui/bento-card-canvas-bg";

const sectionHeaderGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const sectionEyebrow = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionTitle = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const bentoRow = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const bentoStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const Bento = () => {
  return (
    <div className="flex flex-col text-center justify-center items-center">
      <motion.header
        className="flex flex-col items-center"
        variants={sectionHeaderGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        aria-labelledby="bento-section-heading"
      >
        <motion.div
          variants={sectionEyebrow}
          className="flex justify-center items-center gap-2 text-xs border-2 border-blue-light-active px-2 py-1 rounded-full"
        >
          <motion.span
            className="inline-flex text-[#B54B00]"
            animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            aria-hidden
          >
            <Sparkles size={16} />
          </motion.span>
          <span id="bento-eyebrow">What the studio gives you</span>
        </motion.div>
        <motion.span
          id="bento-section-heading"
          variants={sectionTitle}
          className="text-3xl sm:text-4xl md:text-5xl mt-2"
        >
          One workspace for <br />
          <span
            style={
              {
                background: "linear-gradient(55.33deg, #B54B00 1%, #E07030 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textFillColor: "transparent",
              } as React.CSSProperties
            }
          >
            your ASCII stack
          </span>
        </motion.span>
      </motion.header>

      <motion.div
        className="landing-content-width gap-4 mt-10 grid grid-rows-1 md:grid-rows-[8fr_6fr] h-auto md:h-[80vh]"
        variants={bentoStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5% 0px" }}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-100 sm:min-h-0"
          variants={bentoRow}
        >
          <div
            className="relative"
            style={{
              border: "1px solid #E5E5E5",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06), 0px 1px 3px rgba(0,0,0,0.04)",
              borderRadius: "16px",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[16px]">
              <BentoCardCanvasBg />
            </div>
            <div className="relative z-10 flex justify-between flex-col h-full">
              <div className="h-full">
                <MagnifiedBento />
              </div>
              <div className="flex flex-col text-left items-start w-full">
                <span className="text-xl font-medium px-6">Dial in the glyph grid</span>
                <span className="text-xs px-6 pb-6 font-medium text-muted-foreground">
                  Scrub presets and density under the lens—see exactly how your charset
                  will read before you pick an export.
                </span>
              </div>
            </div>
          </div>
          <div
            className="relative p-6"
            style={{
              border: "1px solid #E5E5E5",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06), 0px 1px 3px rgba(0,0,0,0.04)",
              borderRadius: "16px",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[16px]">
              <BentoCardCanvasBg />
            </div>
            <div className="relative z-10 flex justify-between flex-col h-full">
              <div className="h-full flex z-30 justify-center items-center">
                <ImagesBadgeDemoFour />
              </div>
              <div className="flex flex-col items-start text-left w-full">
                <span className="text-xl font-medium">Hand off without rework</span>
                <span className="text-xs font-medium text-muted-foreground">
                  Download stills, MP4, or a drop-in component—one click from the preview
                  you already trust.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-4 min-h-80 sm:min-h-0"
          variants={bentoRow}
        >
          <div
            className="relative"
            style={{
              border: "1px solid #E5E5E5",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.06), 0px 1px 3px rgba(0,0,0,0.04)",
              borderRadius: "16px",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[16px]">
              <BentoCardCanvasBg />
            </div>
            <div className="flex flex-col h-full text-left items-start w-full relative z-20">
              <span className="text-xl font-medium mt-6 px-6">Motion that stays in sync</span>
              <span className="text-xs font-medium text-muted-foreground px-6">
                The split preview keeps source and text conversion aligned: hover to scroll
                the strip and read the final rhythm before you ship the sequence.
              </span>
              <div className="h-full w-full z-30 flex justify-center items-center min-h-0">
                <PortalMarqueeTransform className="h-full w-full" />
              </div>
            </div>
          </div>
          <div
            className="relative overflow-hidden p-6 flex justify-between flex-col"
            style={{
              background: "#B54B00",
              borderRadius: "16px",
            }}
          >
            <div
              className="pointer-events-none opacity-[0.1] z-0 absolute inset-0 bg-repeat"
              style={{
                backgroundImage: "url('/textures/bento-pattern.png')",
                backgroundSize: "40px auto",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex justify-end gap-4">
              <div
                style={{
                  background: "radial-gradient(circle at 30% 30%, #E07030 0%, #C96020 60%, #A03800 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,200,150,0.3)",
                }}
                className="h-14 aspect-square w-14 rounded-full"
              />
            </div>
            <div className="relative z-10 flex flex-col items-start w-full">
              <span className="text-3xl text-[#FFF8F2]">Build in the open studio</span>
              <Link href={"/studio"} className="inline-flex w-fit">
                <Button
                  className="group mt-2 w-fit justify-center relative overflow-hidden transition-[padding] duration-200 hover:pr-10"
                  variant="landing"
                  size="landing"
                >
                  Jump into the studio
                  <ChevronRight className="w-4 absolute right-4 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Bento;

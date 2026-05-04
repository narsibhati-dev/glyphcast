"use client";

import { motion, type Variants } from "framer-motion";
import { Settings, Download, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BRAND_LOGO_RADIUS_CLASS, siteConfig } from "@/lib/site";
import { BentoCardCanvasBg } from "@/components/landing-ui/bento-card-canvas-bg";
import VideoShowcaseReel from "@/components/landing-ui/video-showcase-reel";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Features() {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-20 px-4 w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="flex flex-col items-center text-center landing-content-width mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-center justify-center gap-2 rounded-full border-2 border-blue-light-active bg-blue-light px-3 py-1.5 text-xs dark:border-[#FFB07A]/50 dark:bg-zinc-950/95 dark:shadow-[inset_0_0_0_1px_rgba(255,176,122,0.12)]"
        >
          <motion.span
            className="inline-flex text-[#B54B00] dark:text-[#FFB07A]"
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
          <span className="font-medium text-[#111111] dark:text-zinc-100">
            Core Capabilities
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mb-12 text-3xl font-medium sm:text-4xl md:text-5xl dark:text-zinc-50"
        >
          Everything you need to <br />
          <span
            style={{
              background: "linear-gradient(55.33deg, #B54B00 1%, #E07030 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            create perfect ASCII
          </span>
        </motion.h2>

        <div className="mt-4 grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-y-6">
          {/* Card 1 — top-left; slightly narrower than 7/5 pinwheel so card 2 breathes */}
          <motion.div
            variants={itemVariants}
            className="group relative flex flex-col items-start overflow-hidden rounded-[16px] text-left sm:col-span-6 sm:row-start-1 sm:col-start-1 lg:col-span-7"
            style={{
              background: "#FFF3EC",
              border: "1px solid #FFD0AC",
              boxShadow:
                "0px 4px 16px rgba(181,75,0,0.08), 0px 1px 3px rgba(181,75,0,0.06)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-[16px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(181,75,0,0.14) 0%, rgba(181,75,0,0.03) 46%, rgba(181,75,0,0.10) 100%)",
              }}
            />
            <div className="relative z-10 h-[152px] w-full sm:h-[min(32vw,240px)] sm:min-h-[176px]">
              <VideoShowcaseReel />
            </div>
            <div className="relative z-10 flex w-full flex-col items-start px-4 pb-4 text-left sm:px-6 sm:pb-6">
              <h3 className="text-lg font-medium text-[#111111] sm:text-xl">
                Real-time Conversion
              </h3>
              <p className="text-[#333333] font-medium text-[11px] sm:text-xs leading-relaxed">
                Watch source videos transform into ASCII art live in the browser
                — no uploads, no waiting.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="group relative flex min-h-[200px] flex-col items-start overflow-hidden rounded-[16px] p-6 text-left sm:col-span-6 sm:col-start-7 sm:row-start-1 sm:min-h-[220px] sm:self-stretch sm:p-8 lg:col-span-5 lg:col-start-8"
            style={{
              background: "#FFF3EC",
              border: "1px solid #FFD0AC",
              boxShadow:
                "0px 4px 16px rgba(181,75,0,0.06), 0px 1px 3px rgba(181,75,0,0.04)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[16px]">
              <BentoCardCanvasBg />
            </div>
            <div className="relative z-10 w-full">
              <h3 className="text-xl sm:text-2xl font-medium text-[#FFF8F2] mb-2 sm:mb-3">
                Customizable Output
              </h3>
              <p className="text-[#FFF8F2]/90 font-medium text-[13px] sm:text-sm leading-relaxed">
                Adjust character sets, colors, and resolution to match your
                exact aesthetic.
              </p>
            </div>
            <div className="relative z-10 mt-auto w-fit pt-6">
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#FFD0AC]">
                <Settings className="h-6 w-6 text-[#B54B00]" />
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="group relative flex min-h-[220px] flex-col items-start overflow-hidden rounded-[16px] p-6 text-left sm:col-span-7 sm:col-start-1 sm:row-start-2 sm:min-h-[260px] sm:self-stretch sm:p-8 lg:col-span-6"
            style={{
              background: "#FFF3EC",
              border: "1px solid #FFD0AC",
              boxShadow:
                "0px 4px 16px rgba(181,75,0,0.06), 0px 1px 3px rgba(181,75,0,0.04)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[16px]">
              <BentoCardCanvasBg reverse />
            </div>
            <div className="relative z-10 w-full">
              <h3 className="text-xl sm:text-2xl font-medium text-[#111111] mb-2 sm:mb-3">
                Multiple Formats
              </h3>
              <p className="text-[#333333] font-medium text-[13px] sm:text-sm leading-relaxed max-w-sm">
                Download your creations as high-quality videos, image sequences,
                or copy-paste text formats.
              </p>
            </div>
            <div className="mt-auto pt-6 relative z-10 w-fit">
              <div className="p-3 rounded-xl bg-black/10 backdrop-blur-md shadow-sm ring-1 ring-white/20">
                <Download className="w-6 h-6 text-[#FFF8F2]" />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Build in the open studio */}
          <motion.div
            variants={itemVariants}
            className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[16px] p-6 sm:col-span-5 sm:col-start-8 sm:row-start-2 sm:min-h-[240px] sm:self-stretch sm:p-8 lg:col-span-6 lg:col-start-7"
            style={{
              background:
                "linear-gradient(135deg, #6B2800 0%, #B54B00 55%, #D96020 100%)",
            }}
          >
            <div
              className="pointer-events-none opacity-[0.1] z-0 absolute inset-0 texture-bento-grid"
              aria-hidden="true"
            />
            <div className="relative z-10 flex justify-end gap-4">
              <Image
                src={siteConfig.logoPath}
                alt={`${siteConfig.productName} logo`}
                width={56}
                height={56}
                loading="lazy"
                className={`h-12 w-12 object-contain ring-1 ring-white/25 shadow-md sm:h-14 sm:w-14 ${BRAND_LOGO_RADIUS_CLASS}`}
              />
            </div>
            <div className="relative z-10 flex w-full flex-col items-start mt-auto pt-8">
              <span className="text-2xl text-[#FFF8F2] sm:text-3xl">
                Build in the open studio
              </span>
              <Link href={"/studio"} className="inline-flex w-fit mt-3">
                <Button
                  className="group w-fit justify-center relative overflow-hidden transition-[padding] duration-200 hover:pr-10"
                  variant="landing"
                  size="landing"
                >
                  Jump into the studio
                  <ChevronRight className="w-4 absolute right-4 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

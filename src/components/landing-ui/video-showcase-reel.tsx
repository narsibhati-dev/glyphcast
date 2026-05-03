"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const VIDEOS = [
  {
    ascii: "/media/landing-reel/rendered/fire.mp4",
    source: "/media/landing-reel/original/fire.mp4",
    label: "Fire",
  },
  {
    ascii: "/media/landing-reel/rendered/skull.mp4",
    source: "/media/landing-reel/original/skull.gif",
    label: "Skull",
  },
  {
    ascii: "/media/landing-reel/rendered/car.mp4",
    source: "/media/landing-reel/original/car.gif",
    label: "Car Drift",
  },
  {
    ascii: "/media/landing-reel/rendered/stroke.mp4",
    source: "/media/landing-reel/original/stroke.gif",
    label: "Stroke",
  },
];

const CYCLE_MS = 4000;

export default function VideoShowcaseReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAscii, setShowAscii] = useState(false);

  // Auto-cycle through videos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
      setShowAscii(false);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  // Toggle between source and ASCII every half cycle
  useEffect(() => {
    const toggle = setTimeout(() => {
      setShowAscii(true);
    }, CYCLE_MS * 0.45);
    return () => clearTimeout(toggle);
  }, [activeIndex]);

  const current = VIDEOS[activeIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Floating source card (back, slightly rotated) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`source-${activeIndex}`}
          className="absolute rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5"
          style={{
            width: "62%",
            height: "78%",
            left: "6%",
            top: "11%",
          }}
          initial={{ opacity: 0, x: -30, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: -4 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {current.source.endsWith(".mp4") ? (
            <video
              src={current.source}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={current.source}
                alt="Source video"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          {/* Source label */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-[#333] uppercase tracking-wider">
              Source
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating ASCII card (front, overlapping) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`ascii-${activeIndex}`}
          className="absolute rounded-xl overflow-hidden shadow-2xl ring-1 ring-[#B54B00]/20"
          style={{
            width: "58%",
            height: "74%",
            right: "4%",
            bottom: "8%",
          }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{
            opacity: showAscii ? 1 : 0,
            y: showAscii ? 0 : 20,
            scale: showAscii ? 1 : 0.92,
          }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            src={current.ascii}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* ASCII label */}
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#B54B00] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              ASCII
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {VIDEOS.map((v, i) => (
          <button
            key={v.label}
            onClick={() => {
              setActiveIndex(i);
              setShowAscii(false);
            }}
            className="relative w-5 h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{
              background:
                i === activeIndex
                  ? "rgba(181, 75, 0, 0.25)"
                  : "rgba(181, 75, 0, 0.1)",
            }}
            aria-label={`Show ${v.label}`}
          >
            {i === activeIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[#B54B00]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: CYCLE_MS / 1000,
                  ease: "linear",
                }}
                key={`p-${activeIndex}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

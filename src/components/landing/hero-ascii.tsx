"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroAsciiProps {
  className?: string;
}

export default function HeroAscii({ className }: HeroAsciiProps) {
  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    fetch("/ascii/hero-frames.json")
      .then((r) => r.json())
      .then((frames: string[]) => setFrame(frames[0] ?? null));
  }, []);

  if (!frame) return null;

  return (
    <motion.pre
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={cn(
        "mx-auto max-w-full overflow-hidden flex items-center justify-center rounded-2xl",
        className,
      )}
      style={{
        margin: 0,
        padding: 16,
        background: "transparent",
        color: "#38bdf8",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 8,
        lineHeight: 0.78,
        letterSpacing: 0,
        fontWeight: "normal",
        fontStyle: "normal",
        whiteSpace: "pre",
      }}
    >
      {frame}
    </motion.pre>
  );
}

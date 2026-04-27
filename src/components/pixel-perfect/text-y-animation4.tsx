"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextYAnimation4Props {
  text: string;
  secondText: string;
  isActive: boolean;
  className?: string;
  firstClassName?: string;
  secondClassName?: string;
}

export default function TextYAnimation4({
  text,
  secondText,
  isActive,
  className,
  firstClassName,
  secondClassName,
}: TextYAnimation4Props) {
  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          <motion.span
            key="second"
            className={cn("block", secondClassName)}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {secondText}
          </motion.span>
        ) : (
          <motion.span
            key="first"
            className={cn("block", firstClassName)}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

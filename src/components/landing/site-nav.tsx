"use client";

import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SiteNav() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center p-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-6 py-3 transition-all duration-300 ${
          isScrolled
            ? "border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link
          href="/"
          aria-label="Glyphcast home"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
            <span className="font-sans text-sm font-black tracking-tighter">G</span>
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-white">
            Glyphcast
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#examples"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Examples
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Source code"
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <Code2 className="size-4" />
              Code
            </a>
          </div>
          <Button asChild size="sm" className="h-9 rounded-full px-5">
            <Link href="/studio">
              Studio
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}

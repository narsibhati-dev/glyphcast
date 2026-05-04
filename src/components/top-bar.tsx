"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BRAND_LOGO_RADIUS_CLASS, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  return (
    <header
      suppressHydrationWarning
      className="flex h-14 shrink-0 items-center justify-between border-b border-[#E5E5E5] dark:border-zinc-800 bg-[#F9FAFC] dark:bg-zinc-950 px-6"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-full border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-[#F9FAFC] dark:hover:bg-zinc-700 hover:text-[#111] dark:hover:text-zinc-100 md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className={cn("size-4", sidebarOpen && "hidden")} />
          <X className={cn("size-4", !sidebarOpen && "hidden")} />
        </button>

        <Link
          href="/"
          aria-label="Glyphcast home"
          className="group flex shrink-0 items-center gap-2 transition-all duration-300 hover:opacity-80 md:gap-3"
        >
          <Image
            src={siteConfig.logoPath}
            alt="Logo"
            width={36}
            height={36}
            priority
            unoptimized
            className={cn(
              "h-8 w-8 object-contain md:h-9 md:w-9",
              BRAND_LOGO_RADIUS_CLASS,
            )}
          />
          <div className="flex min-w-0 items-baseline gap-1.5 sm:gap-2">
            <span className="[font-family:var(--font-ascii-brand)] text-base font-medium tracking-wide whitespace-nowrap text-[#111] dark:text-zinc-100 md:text-lg">
              {siteConfig.productName}
            </span>
            <span className="hidden rounded-full border border-[#E5C4A5] dark:border-zinc-700 bg-[#FFF8F3] dark:bg-zinc-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#B54B00] sm:inline">
              Studio
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 font-satoshi text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
        <span className="hidden md:inline">Browser-Native</span>
      </div>
    </header>
  );
}

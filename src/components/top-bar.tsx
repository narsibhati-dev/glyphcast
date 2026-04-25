"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  return (
    <header
      suppressHydrationWarning
      className="flex h-14 shrink-0 items-center justify-between bg-zinc-950 px-6"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {/* Both icons always in DOM — avoids server/client hydration mismatch */}
          <Menu className={cn("size-4", sidebarOpen && "hidden")} />
          <X className={cn("size-4", !sidebarOpen && "hidden")} />
        </button>

        <Link
          href="/"
          aria-label="Glyphcast home"
          className="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-white text-zinc-950">
            <span className="font-sans text-xs font-black tracking-tighter">G</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              Glyphcast
            </span>
            <span className="hidden rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 sm:inline">
              Studio
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
        <span className="hidden md:inline">Browser-Native</span>
      </div>
    </header>
  );
}

"use client";

import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAsciiStore } from "@/lib/store";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const source = useAsciiStore((s) => s.source);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Sparkles className="size-3.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Glyphcast</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
              ASCII Studio
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active source indicator */}
        {source && (
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
              {source.file?.name ?? "sample.svg"}
            </span>
            <span className="font-mono text-xs text-muted-foreground/60">
              {source.width}×{source.height}
            </span>
          </div>
        )}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="size-4 hidden dark:block" />
        </button>
      </div>
    </header>
  );
}

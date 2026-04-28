"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeDockButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-[#2A2A31] bg-white/85 dark:bg-[#151518]/95 px-3 py-2 text-xs font-medium text-[#444] dark:text-[#D4D4DC] shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white dark:hover:bg-[#1C1C20]"
    >
      {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      <span>Theme</span>
    </button>
  );
}

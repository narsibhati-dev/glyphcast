"use client";

import { useEffect, useRef, useState } from "react";

import { TopBar } from "@/components/top-bar";
import { LeftSidebar } from "@/components/left-sidebar";
import { PreviewStage } from "@/components/preview-stage";
import { StudioProvider } from "@/lib/studio-context";
import { useAsciiStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { DesktopOnlyGate } from "@/components/desktop-only-gate";

export default function StudioPage() {
  return (
    <DesktopOnlyGate>
      <StudioProvider>
        <StudioShell />
      </StudioProvider>
    </DesktopOnlyGate>
  );
}

function StudioShell() {
  useKeyboardShortcuts();
  useDefaultSample();

  const previewRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = localStorage.getItem("studio-theme");
    const dark = stored ? stored === "dark" : mq.matches;
    document.documentElement.classList.toggle("dark", dark);

    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("studio-theme")) {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("studio-theme");
    };
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="flex h-dvh flex-col overflow-hidden bg-[#F9FAFC] dark:bg-zinc-950 font-satoshi text-[#111] dark:text-zinc-100"
    >
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      {/* Main Studio Area with slight padding for floating panels */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden p-2 sm:p-4 gap-4">
        {/* Sidebar */}
        <aside
          suppressHydrationWarning
          className={cn(
            "w-[320px] shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] rounded-3xl border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-black/6 dark:shadow-black/40",
            "fixed inset-y-4 left-4 z-40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            sidebarOpen ? "translate-x-0" : "-translate-x-[120%]",
            "md:relative md:inset-auto md:z-auto md:translate-x-0",
          )}
        >
          <LeftSidebar previewRef={previewRef} />
        </aside>

        {/* Mobile Backdrop */}
        <div
          aria-hidden
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "fixed inset-0 z-30 bg-zinc-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300",
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        />

        {/* Preview */}
        <main
          suppressHydrationWarning
          ref={previewRef}
          className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden rounded-3xl border border-[#E5E5E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]"
        >
          <PreviewStage />
        </main>
      </div>
    </div>
  );
}

function useDefaultSample() {
  const source = useAsciiStore((s) => s.source);
  const setSource = useAsciiStore((s) => s.setSource);
  const setPlaying = useAsciiStore((s) => s.setPlaying);
  const patchAppearance = useAsciiStore((s) => s.patchAppearance);

  useEffect(() => {
    const stored = localStorage.getItem("studio-theme");
    const isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    patchAppearance({ backgroundColor: isDark ? "#0B0B0D" : "#ffffff" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (source) return;
    let cancelled = false;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const onLoadedMetadata = () => {
      if (cancelled) return;
      setSource({
        kind: "video",
        el: video,
        file: null,
        url: video.src,
        width: video.videoWidth || 1280,
        height: video.videoHeight || 720,
        durationMs: Number.isFinite(video.duration) ? video.duration * 1000 : 0,
      });
      setPlaying(true);
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.src = "/portal-marquee-video/below-video/fire.mp4";
    video.load();
    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

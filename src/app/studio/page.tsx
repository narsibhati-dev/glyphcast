"use client";

import { useEffect, useRef, useState } from "react";

import { TopBar } from "@/components/top-bar";
import { LeftSidebar } from "@/components/left-sidebar";
import { PreviewStage } from "@/components/preview-stage";
import { StudioProvider } from "@/lib/studio-context";
import { useAsciiStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

export default function StudioPage() {
  return (
    <StudioProvider>
      <StudioShell />
    </StudioProvider>
  );
}

function StudioShell() {
  useKeyboardShortcuts();
  useDefaultSample();

  const previewRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      suppressHydrationWarning
      className="flex h-dvh flex-col overflow-hidden bg-zinc-950"
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
            "w-[320px] shrink-0 overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black/50",
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
            "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
        />

        {/* Preview */}
        <main
          suppressHydrationWarning
          ref={previewRef}
          className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30"
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

  useEffect(() => {
    if (source) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      setSource({
        kind: "image",
        el: img,
        file: null,
        url: img.src,
        width: img.naturalWidth || 600,
        height: img.naturalHeight || 400,
      });
    };
    img.src = "/samples/skyline.svg";
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

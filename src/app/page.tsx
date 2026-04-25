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
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-[272px] shrink-0 border-r border-border bg-sidebar overflow-y-auto",
            "fixed top-12 bottom-0 left-0 z-30",
            "transition-transform duration-200 ease-in-out will-change-transform",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:top-auto md:bottom-auto md:z-auto md:translate-x-0",
          )}
        >
          <LeftSidebar previewRef={previewRef} />
        </aside>

        {/* Backdrop */}
        <div
          aria-hidden
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity duration-200",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
        />

        {/* Preview */}
        <main
          ref={previewRef}
          className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden"
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
    img.src = "/sample.svg";
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

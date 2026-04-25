"use client";

import { useEffect } from "react";

import { TopBar } from "@/components/top-bar";
import { SourceUploader } from "@/components/source-uploader";
import { PreviewStage } from "@/components/preview-stage";
import { RightPanel } from "@/components/right-panel";

import { StudioProvider } from "@/lib/studio-context";
import { useAsciiStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

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

  return (
    <div className="grid h-dvh w-full grid-rows-[3.5rem_1fr] overflow-hidden">
      <TopBar />
      <main className="grid min-h-0 grid-cols-[300px_1fr_340px] gap-0">
        <aside className="border-r border-border bg-card/20 p-4 overflow-y-auto">
          <SourceUploader />
        </aside>
        <section className="min-w-0 p-4">
          <PreviewStage />
        </section>
        <aside className="border-l border-border bg-card/20 p-4 overflow-hidden flex flex-col">
          <RightPanel />
        </aside>
      </main>
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
    return () => {
      cancelled = true;
    };
    // Run once on mount; relying on `source` keeps it from re-firing once loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

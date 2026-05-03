"use client";

import { useEffect } from "react";
import { useAsciiStore } from "@/lib/store";
import { useStudio } from "@/lib/studio-context";

export function useKeyboardShortcuts() {
  const togglePlaying = useAsciiStore((s) => s.togglePlaying);
  const stepFrame = useAsciiStore((s) => s.stepFrame);
  const { requestExport } = useStudio();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when the user is typing into a form control.
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        requestExport();
        return;
      }

      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlaying();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepFrame(-1);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFrame(1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlaying, stepFrame, requestExport]);
}

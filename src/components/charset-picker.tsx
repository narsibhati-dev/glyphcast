"use client";

import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";
import { useAsciiStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CharsetPicker() {
  const charsetPresetId = useAsciiStore((s) => s.charsetPresetId);
  const setCharsetPreset = useAsciiStore((s) => s.setCharsetPreset);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {ASCII_CHAR_PRESETS.map((preset) => {
        const selected = preset.id === charsetPresetId;
        // Show first ~12 non-space chars so the preview is never blank
        const preview = preset.chars.replace(/^\s+/, "").slice(0, 12) || preset.chars.slice(0, 12);
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setCharsetPreset(preset.id)}
            className={cn(
              "rounded-md border border-border bg-card/60 p-2 text-left transition-colors",
              "hover:border-foreground/30 hover:bg-card",
              selected && "border-primary/60 ring-2 ring-primary/40 bg-card",
            )}
          >
            <div className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {preset.label}
            </div>
            <div className="mt-1 truncate font-mono text-[11px] text-foreground/80 leading-none">
              {preview}
            </div>
          </button>
        );
      })}
    </div>
  );
}

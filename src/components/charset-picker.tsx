"use client";

import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";
import { useAsciiStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CharsetPicker() {
  const charsetPresetId = useAsciiStore((s) => s.charsetPresetId);
  const setCharsetPreset = useAsciiStore((s) => s.setCharsetPreset);

  return (
    <div className="grid grid-cols-2 bg-background">
      {ASCII_CHAR_PRESETS.map((preset, i) => {
        const selected = preset.id === charsetPresetId;
        const preview =
          preset.chars.replace(/^\s+/, "").slice(0, 14) ||
          preset.chars.slice(0, 14);
        const isLastRow =
          i >= ASCII_CHAR_PRESETS.length - (ASCII_CHAR_PRESETS.length % 2 || 2);
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setCharsetPreset(preset.id)}
            className={cn(
              "border-b border-r border-border p-2 text-left transition-colors",
              "hover:bg-muted/50",
              /* Remove double borders on right column */
              i % 2 === 1 && "border-r-0",
              /* Remove bottom border on last row */
              isLastRow && "border-b-0",
              selected &&
                "bg-primary/8 border-primary/30 ring-inset ring-1 ring-primary/25",
            )}
          >
            <div className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">
              {preset.label}
            </div>
            <div
              className={cn(
                "mt-0.5 truncate font-mono text-[10px] leading-none",
                selected ? "text-primary/80" : "text-foreground/60",
              )}
            >
              {preview}
            </div>
          </button>
        );
      })}
    </div>
  );
}

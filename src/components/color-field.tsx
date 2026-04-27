"use client";

import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group/swatch flex items-center gap-2 border border-border bg-card px-2 py-1 transition-colors hover:border-foreground/60"
            aria-label={`Pick ${label}`}
          >
            <span
              className="size-4 shrink-0 rounded border border-border/80"
              style={{ background: value }}
            />
            <span className="font-mono text-[9px] uppercase tabular-nums tracking-wide text-foreground">
              {value}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex w-auto flex-col gap-3 p-3">
          <HexColorPicker color={value} onChange={onChange} />
          <Input
            value={value}
            onChange={(e) => onChange(normalizeHex(e.target.value))}
            spellCheck={false}
            autoComplete="off"
            className="h-8 font-mono text-xs uppercase"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function normalizeHex(input: string): string {
  let v = input.trim();
  if (!v.startsWith("#")) v = `#${v}`;
  return v.slice(0, 7);
}

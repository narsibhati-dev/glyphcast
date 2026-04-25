"use client";

import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs text-muted-foreground shrink-0">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs hover:border-primary/50 transition-colors"
            aria-label={`Pick ${label}`}
          >
            <span className="h-4 w-4 rounded border border-border/50 shrink-0" style={{ background: value }} />
            <span className="font-mono uppercase tracking-wide text-foreground/80">{value}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-3 flex flex-col gap-3">
          <HexColorPicker color={value} onChange={onChange} />
          <Input value={value} onChange={(e) => onChange(normalizeHex(e.target.value))}
            spellCheck={false} autoComplete="off" className="font-mono text-xs h-8" />
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

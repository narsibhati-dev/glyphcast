"use client";

import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-md border border-input bg-card px-2 py-1 text-xs",
              "hover:border-foreground/40 transition-colors",
            )}
            aria-label={`Pick ${label}`}
          >
            <span
              className="size-4 rounded-sm border border-border"
              style={{ background: value }}
            />
            <span className="font-mono uppercase tracking-wide">{value}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto p-3 flex flex-col gap-3"
        >
          <HexColorPicker color={value} onChange={onChange} />
          <Input
            value={value}
            onChange={(e) => onChange(normalizeHex(e.target.value))}
            spellCheck={false}
            autoComplete="off"
            className="font-mono text-xs"
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

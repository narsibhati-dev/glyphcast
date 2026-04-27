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
  asRow?: boolean;
}

export function ColorField({ label, value, onChange, asRow }: ColorFieldProps) {
  const trigger = (
    <button
      type="button"
      className={
        asRow
          ? "flex items-center gap-2.5 w-full rounded-lg border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-2 transition-colors hover:border-[#B54B00]/50"
          : "flex w-full items-center gap-2 rounded-md border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5 transition-colors hover:border-[#B54B00]/40"
      }
      aria-label={`Pick ${label}`}
    >
      {asRow ? (
        <>
          <span
            className="size-5 shrink-0 rounded-md border border-black/10"
            style={{ background: value }}
          />
          <span className="flex-1 text-left font-sans text-xs text-[#111] dark:text-zinc-100">
            {label}
          </span>
          <span className="font-mono text-[9px] uppercase tabular-nums text-[#888] dark:text-zinc-500 tracking-wide">
            {value}
          </span>
        </>
      ) : (
        <>
          <span
            className="size-4 shrink-0 rounded border border-[#E5E5E5] dark:border-zinc-600"
            style={{ background: value }}
          />
          <span className="font-mono text-[9px] uppercase tabular-nums tracking-wide text-[#111] dark:text-zinc-100 truncate">
            {value}
          </span>
        </>
      )}
    </button>
  );

  if (asRow) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
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
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#888] dark:text-zinc-500">
        {label}
      </span>
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
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

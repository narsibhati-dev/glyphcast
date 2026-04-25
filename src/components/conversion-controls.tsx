"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CharsetPicker } from "@/components/charset-picker";
import { useAsciiStore } from "@/lib/store";

export function ConversionControls() {
  const columns = useAsciiStore((s) => s.columns);
  const threshold = useAsciiStore((s) => s.threshold);
  const invert = useAsciiStore((s) => s.invert);
  const charset = useAsciiStore((s) => s.charset);
  const setColumns = useAsciiStore((s) => s.setColumns);
  const setThreshold = useAsciiStore((s) => s.setThreshold);
  const setInvert = useAsciiStore((s) => s.setInvert);
  const setCharset = useAsciiStore((s) => s.setCharset);

  return (
    <div className="flex flex-col gap-5">
      <ControlRow label="Columns" value={columns}>
        <Slider
          min={40}
          max={300}
          step={1}
          value={[columns]}
          onValueChange={([v]) => setColumns(v ?? columns)}
        />
      </ControlRow>

      <ControlRow label="Threshold" value={threshold}>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[threshold]}
          onValueChange={([v]) => setThreshold(v ?? threshold)}
        />
      </ControlRow>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="invert" className="text-xs font-medium text-muted-foreground">
          Invert brightness
        </Label>
        <Switch id="invert" checked={invert} onCheckedChange={setInvert} />
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Charset preset
        </Label>
        <CharsetPicker />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="custom-charset" className="text-xs font-medium text-muted-foreground">
          Custom charset
        </Label>
        <Input
          id="custom-charset"
          value={charset}
          onChange={(e) => setCharset(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-xs"
        />
        <p className="text-[10px] text-muted-foreground">
          Order from darkest (left) to brightest (right).
        </p>
      </div>
    </div>
  );
}

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        <span className="font-mono text-xs tabular-nums text-foreground/80">
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}

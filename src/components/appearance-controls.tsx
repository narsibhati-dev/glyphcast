"use client";

import { Bold, Italic } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorField } from "@/components/color-field";

import { useAsciiStore } from "@/lib/store";
import {
  ASCII_FONT_PRESETS,
  type ASCIITextEffect,
} from "@/lib/ascii-config";
import { loadGoogleFont } from "@/lib/font-loader";

const TEXT_EFFECTS: { value: ASCIITextEffect; label: string }[] = [
  { value: "none", label: "None" },
  { value: "matrix", label: "Matrix" },
  { value: "glitch", label: "Glitch" },
  { value: "neon", label: "Neon" },
  { value: "video", label: "CRT / Video" },
  { value: "gradient", label: "Gradient" },
  { value: "burn", label: "Burn" },
  { value: "neural", label: "Neural" },
];

export function AppearanceControls() {
  const appearance = useAsciiStore((s) => s.appearance);
  const patchAppearance = useAsciiStore((s) => s.patchAppearance);

  const isBold =
    appearance.fontWeight === "bold" ||
    appearance.fontWeight === 700 ||
    appearance.fontWeight === "700";

  const fontId =
    ASCII_FONT_PRESETS.find((f) => f.value === appearance.fontFamily)?.id ??
    ASCII_FONT_PRESETS[0].id;

  return (
    <div className="flex flex-col gap-5">
      {/* Font family */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Font family
        </Label>
        <Select
          value={fontId}
          onValueChange={(id) => {
            const preset = ASCII_FONT_PRESETS.find((f) => f.id === id);
            if (preset) {
              loadGoogleFont(id);
              patchAppearance({ fontFamily: preset.value });
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a font" />
          </SelectTrigger>
          <SelectContent>
            {ASCII_FONT_PRESETS.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                <span style={{ fontFamily: preset.value }}>{preset.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bold / Italic */}
      <div className="flex items-center gap-2">
        <Toggle
          pressed={isBold}
          onPressedChange={(v) =>
            patchAppearance({ fontWeight: v ? "bold" : "normal" })
          }
          variant="outline"
          aria-label="Toggle bold"
        >
          <Bold className="size-3.5" />
        </Toggle>
        <Toggle
          pressed={appearance.fontStyle === "italic"}
          onPressedChange={(v) =>
            patchAppearance({ fontStyle: v ? "italic" : "normal" })
          }
          variant="outline"
          aria-label="Toggle italic"
        >
          <Italic className="size-3.5" />
        </Toggle>
      </div>

      <ControlRow label="Font size" value={appearance.fontSize}>
        <Slider
          min={4}
          max={24}
          step={1}
          value={[appearance.fontSize]}
          onValueChange={([v]) =>
            v !== undefined && patchAppearance({ fontSize: v })
          }
        />
      </ControlRow>

      <ControlRow
        label="Vertical gap"
        value={appearance.lineHeight.toFixed(2)}
      >
        <Slider
          min={0.5}
          max={1.5}
          step={0.01}
          value={[appearance.lineHeight]}
          onValueChange={([v]) =>
            v !== undefined && patchAppearance({ lineHeight: v })
          }
        />
      </ControlRow>

      <ControlRow
        label="Horizontal gap"
        value={appearance.letterSpacing.toFixed(2)}
      >
        <Slider
          min={-2}
          max={4}
          step={0.01}
          value={[appearance.letterSpacing]}
          onValueChange={([v]) =>
            v !== undefined && patchAppearance({ letterSpacing: v })
          }
        />
      </ControlRow>

      <ControlRow
        label="Corner radius"
        value={`${appearance.borderRadius}px`}
      >
        <Slider
          min={0}
          max={24}
          step={1}
          value={[appearance.borderRadius]}
          onValueChange={([v]) =>
            v !== undefined && patchAppearance({ borderRadius: v })
          }
        />
      </ControlRow>

      <Separator />

      <ColorField
        label="Background"
        value={appearance.backgroundColor}
        onChange={(v) => patchAppearance({ backgroundColor: v })}
      />
      <ColorField
        label="Text color"
        value={appearance.textColor}
        onChange={(v) => patchAppearance({ textColor: v })}
      />

      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor="use-colors"
          className="text-xs font-medium text-muted-foreground"
        >
          Use source colors
        </Label>
        <Switch
          id="use-colors"
          checked={appearance.useColors}
          onCheckedChange={(v) => patchAppearance({ useColors: v })}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor="show-frame-counter"
          className="text-xs font-medium text-muted-foreground"
        >
          Show frame counter
        </Label>
        <Switch
          id="show-frame-counter"
          checked={appearance.showFrameCounter}
          onCheckedChange={(v) => patchAppearance({ showFrameCounter: v })}
        />
      </div>

      <Separator />

      {/* Text effect */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Text effect
        </Label>
        <Select
          value={appearance.textEffect}
          onValueChange={(v) =>
            patchAppearance({ textEffect: v as ASCIITextEffect })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEXT_EFFECTS.map((eff) => (
              <SelectItem key={eff.value} value={eff.value}>
                {eff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {appearance.textEffect !== "none" && (
        <ControlRow
          label="Effect intensity"
          value={appearance.textEffectThreshold.toFixed(2)}
        >
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[appearance.textEffectThreshold]}
            onValueChange={([v]) =>
              v !== undefined && patchAppearance({ textEffectThreshold: v })
            }
          />
        </ControlRow>
      )}
    </div>
  );
}

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value: number | string;
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

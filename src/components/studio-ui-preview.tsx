import React from "react";
import {
  Bold,
  Copy,
  FileCode2,
  Image as ImageIcon,
  Italic,
  RotateCcw,
  Search,
  Upload,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  STUDIO_OUTLINE_TERTIARY,
  STUDIO_SLIDER_CLASS,
} from "@/lib/studio-theme";
import { cn } from "@/lib/utils";
import Fire from "./fire";

/** Visual tokens for hero mock studio — match landing: neutral borders, #F9FAFC surfaces, #B54B00 accents. */
const PREVIEW = {
  card: "overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.04)]",
  cardHeader:
    "border-b border-[#E5E5E5] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FAFC_100%)] px-3 py-2.5",
  label: "text-[10px] font-medium uppercase tracking-[0.12em] text-[#888]",
  labelNarrow: "text-[9px] font-medium uppercase tracking-[0.12em] text-[#888]",
  meta: "text-[10px] text-[#666]",
  valueMono: "text-[10px] font-mono tabular-nums text-[#666]",
  field:
    "h-7 text-[10px] border-[#E5E5E5] bg-white text-[#111] shadow-none focus-visible:border-[#B54B00] focus-visible:ring-[#B54B00]/20",
  slider: STUDIO_SLIDER_CLASS,
} as const;

const outlineTertiary = STUDIO_OUTLINE_TERTIARY;

export default function StudioUiPreview() {
  return (
    <div className="mt-10 landing-content-width max-w-[1100px] max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-[#E5E5E5] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFD_100%)] font-satoshi text-[#111] shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
      <section className="w-full rounded-[32px] bg-white p-3 md:p-4">
        <div className="grid gap-3 lg:grid-cols-[min(320px,38vw)_1fr]">
          <div className="space-y-3">
            <Panel title="Source Media">
              <button
                type="button"
                className={cn(
                  "flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#B54B00]/40 bg-[#F9FAFC] text-xs text-[#666] transition-colors hover:border-[#B54B00]/60 hover:bg-[#FFF5ED]/80",
                )}
              >
                <Upload className="h-3.5 w-3.5 text-[#B54B00]/80" />
                Drag and drop, click to upload
              </button>
              <div
                className={cn(
                  "rounded-lg border border-[#E5E5E5] bg-white px-2 py-1.5 text-[10px] text-[#666]",
                )}
              >
                demo-video.mp4 • 17.4 MB
              </div>
              <Button
                type="button"
                variant="landingBlue"
                className="h-7 w-full min-h-0 rounded-full text-[10px] py-0"
                size="sm"
              >
                Convert to ASCII
              </Button>
            </Panel>

            <Panel title="Conversion">
              <div className="space-y-1">
                <Label className={PREVIEW.label}>Quality</Label>
                <Select defaultValue="mid">
                  <SelectTrigger
                    className={cn(
                      "h-7 rounded-lg text-xs text-[#111]",
                      PREVIEW.field,
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-xl border-[#E5E5E5] bg-white text-[#111] shadow-[0px_14px_36px_rgba(0,0,0,0.12)]"
                    position="popper"
                  >
                    <SelectItem
                      value="low"
                      className="rounded-lg py-2 text-[11px] font-medium text-[#111] data-[highlighted]:bg-[#FFF5ED] data-[highlighted]:text-[#111] focus:bg-[#FFF5ED] focus:text-[#111] data-[state=checked]:bg-[#FFF5ED] data-[state=checked]:text-[#111]"
                    >
                      Low (Performance)
                    </SelectItem>
                    <SelectItem
                      value="mid"
                      className="rounded-lg py-2 text-[11px] font-medium text-[#111] data-[highlighted]:bg-[#FFF5ED] data-[highlighted]:text-[#111] focus:bg-[#FFF5ED] focus:text-[#111] data-[state=checked]:bg-[#FFF5ED] data-[state=checked]:text-[#111]"
                    >
                      Mid (Balanced)
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className="rounded-lg py-2 text-[11px] font-medium text-[#111] data-[highlighted]:bg-[#FFF5ED] data-[highlighted]:text-[#111] focus:bg-[#FFF5ED] focus:text-[#111] data-[state=checked]:bg-[#FFF5ED] data-[state=checked]:text-[#111]"
                    >
                      High (Detail)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SliderField
                label="Columns"
                value={130}
                min={10}
                max={400}
                step={5}
              />
              <SliderField
                label="Threshold"
                value={30}
                min={0}
                max={200}
                step={5}
              />
              <div className="space-y-1">
                <Label className={PREVIEW.label}>Charset</Label>
                <Input
                  className={cn("h-7 font-mono", PREVIEW.field)}
                  value=" .,:;i1tfLCG08@"
                  readOnly
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="h-7 min-h-0 flex-1 rounded-full px-3 text-[10px] py-0"
                  size="sm"
                  variant="landing"
                >
                  Invert
                </Button>
                <Button
                  type="button"
                  className="h-7 min-h-0 text-[10px] text-[#111] hover:bg-[#F9FAFC]"
                  size="sm"
                  variant="ghost"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </Panel>

            <Panel title="Appearance">
              <div className="space-y-1">
                <Label className={PREVIEW.label}>Font Family</Label>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-8 w-full justify-between rounded-full px-3 text-xs font-medium",
                    outlineTertiary,
                  )}
                >
                  JetBrains Mono
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#F3F3F3]">
                    <Search className="h-3.5 w-3.5 text-[#777]" />
                  </span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-8 flex-1 gap-1 rounded-full border-[#D8D8D8] bg-white text-[11px] font-medium shadow-[inset_0px_1px_0px_#FFFFFF]",
                    outlineTertiary,
                  )}
                >
                  <Bold className="h-3 w-3" />
                  Bold
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-8 flex-1 gap-1 rounded-full border-[#D8D8D8] bg-white text-[11px] font-medium shadow-[inset_0px_1px_0px_#FFFFFF]",
                    outlineTertiary,
                  )}
                >
                  <Italic className="h-3 w-3" />
                  Italic
                </Button>
              </div>
              <SliderField
                label="Font Size"
                value={10}
                min={0.5}
                max={24}
                step={0.1}
              />
              <SliderField
                label="Vertical Gap"
                value={0.95}
                min={0.6}
                max={1.6}
                step={0.01}
              />
              <SliderField
                label="Horizontal Gap"
                value={0.04}
                min={-0.5}
                max={1}
                step={0.01}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-full border border-[#D8D8D8] bg-white px-3 text-[11px] text-[#111] transition-colors hover:bg-[#F9FAFC]"
                >
                  <span className="size-3 rounded-full bg-[#B54B00]" />
                  #B54B00
                </button>
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-full border border-[#D8D8D8] bg-white px-3 text-[11px] text-[#111] transition-colors hover:bg-[#F9FAFC]"
                >
                  <span className="size-3 rounded-full border border-[#CFCFCF] bg-white" />
                  #FFFFFF
                </button>
              </div>
            </Panel>

            <Panel title="Export">
              <Label className="px-1 text-center text-[9px] font-medium uppercase tracking-[0.1em] text-[#7A7A7A] leading-relaxed">
                Full React component with in-app text frame exports
              </Label>
              <textarea
                readOnly
                className="h-24 w-full resize-none rounded-2xl border border-[#DCDCDC] bg-[linear-gradient(180deg,#FDFDFD_0%,#F7F7F9_100%)] p-4 font-mono text-[11px] leading-relaxed text-[#1F1F1F] shadow-[inset_0px_1px_0px_#FFFFFF]"
                value={'<ASCIIAnimation frames={["..."]} />'}
              />
              <Button
                type="button"
                size="sm"
                variant="landingBlue"
                className="h-8 w-full min-h-0 gap-1 rounded-full px-3 text-[11px] py-0"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Full React Component
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    outlineTertiary,
                    "h-8 min-w-0 justify-center gap-1.5 rounded-full border-[#D8D8D8] bg-white px-2 text-[9px] font-medium",
                  )}
                >
                  <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 truncate">Image</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    outlineTertiary,
                    "h-8 min-w-0 justify-center gap-1.5 rounded-full border-[#D8D8D8] bg-white px-2 text-[9px] font-medium",
                  )}
                >
                  <Video className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 truncate">Video</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 min-w-0 justify-center gap-1.5 rounded-full border border-[#EBC6A5] bg-[#FFF5ED] px-2 text-[9px] font-medium text-[#7A3300] hover:bg-[#FFECDD]"
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 truncate">Component</span>
                </Button>
              </div>
            </Panel>
          </div>

          <div className="sticky top-3 md:top-4 h-fit">
            <div className={PREVIEW.card}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  PREVIEW.cardHeader,
                )}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111]">
                  Preview
                </span>
                <span className={cn("font-medium", PREVIEW.meta)}>
                  240f · 130x72 (780x684px)
                </span>
              </div>

              <div className="overflow-auto p-3">
                <div
                  className={cn(
                    "overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#F9FAFC]",
                  )}
                >
                  <Fire />
                </div>
              </div>

              <div
                className={cn(
                  "border-t border-[#E5E5E5] bg-[#F9FAFC] px-4 py-2.5",
                )}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className={PREVIEW.labelNarrow}>
                    Timeline Scrubber
                  </Label>
                  <span className={cn(PREVIEW.valueMono, "text-[#666]")}>
                    00:12.4 / 00:34.8
                  </span>
                </div>
                <Slider
                  className={PREVIEW.slider}
                  defaultValue={[12.4]}
                  max={34.8}
                  min={0}
                  step={0.1}
                />
              </div>

              <div className="grid grid-cols-3 border-t border-[#E5E5E5]">
                <Stat label="Frames" value="240" />
                <Stat label="Grid" value="130x72" />
                <Stat label="Resolution" value="780x684px" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className={PREVIEW.card}>
      <div className={PREVIEW.cardHeader}>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111]">
          {title}
        </span>
      </div>
      <div className="space-y-2.5 p-2.5">{children}</div>
    </div>
  );
}

function SliderField({
  label,
  max,
  min,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className={PREVIEW.label}>{label}</Label>
        <span
          className={cn("text-[10px] tabular-nums font-medium text-[#666]")}
        >
          {value}
        </span>
      </div>
      <Slider
        className={PREVIEW.slider}
        defaultValue={[value]}
        max={max}
        min={min}
        step={step}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="border-r border-[#E5E5E5] px-2 py-2.5 text-center last:border-r-0 transition-colors hover:bg-[#F9FAFC]"
    >
      <div className={cn(PREVIEW.labelNarrow, "mb-0.5")}>{label}</div>
      <div className="text-[12px] font-medium tabular-nums leading-tight text-[#111]">
        {value}
      </div>
    </button>
  );
}

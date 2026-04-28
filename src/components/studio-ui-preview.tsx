"use client";
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
import { Slider } from "@/components/ui/slider";
import {
  STUDIO_OUTLINE_TERTIARY,
  STUDIO_SLIDER_CLASS,
} from "@/lib/studio-theme";
import { cn } from "@/lib/utils";
import Fire from "./fire";
import { useTheme } from "@/components/theme-provider";

export default function StudioUiPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const PREVIEW = {
    card: cn(
      "overflow-hidden rounded-xl border shadow-[0px_1px_2px_rgba(0,0,0,0.04)]",
      isDark ? "border-zinc-700 bg-zinc-800" : "border-[#E5E5E5] bg-white",
    ),
    cardHeader: cn(
      "border-b px-3 py-2.5",
      isDark
        ? "border-zinc-700 bg-zinc-800"
        : "border-[#E5E5E5] bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FAFC_100%)]",
    ),
    label: cn(
      "text-[10px] font-medium uppercase tracking-[0.12em]",
      isDark ? "text-zinc-400" : "text-[#888]",
    ),
    labelNarrow: cn(
      "text-[9px] font-medium uppercase tracking-[0.12em]",
      isDark ? "text-zinc-400" : "text-[#888]",
    ),
    meta: cn("text-[10px]", isDark ? "text-zinc-400" : "text-[#666]"),
    valueMono: cn(
      "text-[10px] font-mono tabular-nums",
      isDark ? "text-zinc-400" : "text-[#666]",
    ),
    field: cn(
      "h-7 text-[10px] shadow-none focus-visible:border-[#B54B00] focus-visible:ring-[#B54B00]/20",
      isDark
        ? "border-zinc-700 bg-zinc-900 text-zinc-100"
        : "border-[#E5E5E5] bg-white text-[#111]",
    ),
    slider: STUDIO_SLIDER_CLASS,
    sectionBg: isDark ? "bg-zinc-900" : "bg-white",
    wrapperBg: isDark
      ? "bg-zinc-900 text-zinc-100 border-zinc-700"
      : "bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFD_100%)] text-[#111] border-[#E5E5E5]",
    previewCanvasBg: isDark
      ? "bg-zinc-950 border-zinc-700"
      : "bg-[#F9FAFC] border-[#E5E5E5]",
    previewFooterBg: isDark
      ? "bg-zinc-800 border-zinc-700"
      : "bg-[#F9FAFC] border-[#E5E5E5]",
    statBorder: isDark ? "border-zinc-700" : "border-[#E5E5E5]",
    statHover: isDark ? "hover:bg-zinc-700" : "hover:bg-[#F9FAFC]",
    statText: isDark ? "text-zinc-100" : "text-[#111]",
    uploadBg: isDark
      ? "bg-zinc-900 border-[#B54B00]/40 text-zinc-400 hover:border-[#B54B00]/60 hover:bg-[#2A1800]/40"
      : "bg-[#F9FAFC] border-[#B54B00]/40 text-[#666] hover:border-[#B54B00]/60 hover:bg-[#FFF5ED]/80",
    fileMeta: isDark
      ? "border-zinc-700 bg-zinc-900 text-zinc-400"
      : "border-[#E5E5E5] bg-white text-[#666]",
    selectContent: isDark
      ? "rounded-xl border-zinc-700 bg-zinc-800 text-zinc-100 shadow-[0px_14px_36px_rgba(0,0,0,0.3)]"
      : "rounded-xl border-[#E5E5E5] bg-white text-[#111] shadow-[0px_14px_36px_rgba(0,0,0,0.12)]",
    selectItem: isDark
      ? "rounded-lg py-2 text-[11px] font-medium text-zinc-100 data-[highlighted]:bg-zinc-700 data-[highlighted]:text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100 data-[state=checked]:bg-zinc-700 data-[state=checked]:text-zinc-100"
      : "rounded-lg py-2 text-[11px] font-medium text-[#111] data-[highlighted]:bg-[#FFF5ED] data-[highlighted]:text-[#111] focus:bg-[#FFF5ED] focus:text-[#111] data-[state=checked]:bg-[#FFF5ED] data-[state=checked]:text-[#111]",
    outlineBtn: isDark
      ? "border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
      : "border-[#D8D8D8] bg-white text-[#111] hover:bg-[#F9FAFC]",
    fontSearchBtn: isDark ? "bg-zinc-700" : "bg-[#F3F3F3]",
    fontSearchIcon: isDark ? "text-zinc-400" : "text-[#777]",
    textarea: isDark
      ? "border-zinc-700 bg-zinc-900 text-zinc-100"
      : "border-[#DCDCDC] bg-[linear-gradient(180deg,#FDFDFD_0%,#F7F7F9_100%)] text-[#1F1F1F]",
    componentBtn: isDark
      ? "border-[#7A3300]/60 bg-[#2A1800] text-[#FFAB70] hover:bg-[#3A2000]"
      : "border-[#EBC6A5] bg-[#FFF5ED] text-[#7A3300] hover:bg-[#FFECDD]",
    resetBtn: isDark
      ? "text-zinc-300 hover:bg-zinc-700"
      : "text-[#111] hover:bg-[#F9FAFC]",
    colorPillBg: isDark
      ? "border-zinc-700 bg-zinc-800 text-zinc-100"
      : "border-[#D8D8D8] bg-white text-[#111]",
  };

  const outlineTertiary = STUDIO_OUTLINE_TERTIARY;

  return (
    <div
      className={cn(
        "mt-10 landing-content-width max-w-[1100px] overflow-x-hidden rounded-3xl border font-satoshi shadow-[0px_4px_24px_rgba(0,0,0,0.06)]",
        PREVIEW.wrapperBg,
      )}
    >
      <section
        className={cn("w-full rounded-[32px] p-3 md:p-4", PREVIEW.sectionBg)}
      >
        <div className="grid gap-3 lg:grid-cols-[min(320px,38vw)_1fr]">
          <div className="space-y-3 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1 lg:[&::-webkit-scrollbar]:hidden lg:[scrollbar-width:none]">
            <Panel title="Source Media" isDark={isDark} PREVIEW={PREVIEW}>
              <button
                type="button"
                className={cn(
                  "flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-xs transition-colors",
                  PREVIEW.uploadBg,
                )}
              >
                <Upload className="h-3.5 w-3.5 text-[#B54B00]/80" />
                Drag and drop, click to upload
              </button>
              <div
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-[10px]",
                  PREVIEW.fileMeta,
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

            <Panel title="Conversion" isDark={isDark} PREVIEW={PREVIEW}>
              <SliderField
                label="Threshold"
                value={30}
                min={0}
                max={200}
                step={5}
                PREVIEW={PREVIEW}
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
                  className={cn("h-7 min-h-0 text-[10px]", PREVIEW.resetBtn)}
                  size="sm"
                  variant="ghost"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </Panel>

            <Panel title="Appearance" isDark={isDark} PREVIEW={PREVIEW}>
              <div className="space-y-1">
                <Label className={PREVIEW.label}>Font Family</Label>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-8 w-full justify-between rounded-full px-3 text-xs font-medium",
                    PREVIEW.outlineBtn,
                  )}
                >
                  JetBrains Mono
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full",
                      PREVIEW.fontSearchBtn,
                    )}
                  >
                    <Search
                      className={cn("h-3.5 w-3.5", PREVIEW.fontSearchIcon)}
                    />
                  </span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-8 flex-1 gap-1 rounded-full border text-[11px] font-medium shadow-[inset_0px_1px_0px_rgba(255,255,255,0.1)]",
                    PREVIEW.outlineBtn,
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
                    "h-8 flex-1 gap-1 rounded-full border text-[11px] font-medium shadow-[inset_0px_1px_0px_rgba(255,255,255,0.1)]",
                    PREVIEW.outlineBtn,
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
                PREVIEW={PREVIEW}
              />
              <SliderField
                label="Vertical Gap"
                value={0.95}
                min={0.6}
                max={1.6}
                step={0.01}
                PREVIEW={PREVIEW}
              />
              <SliderField
                label="Horizontal Gap"
                value={0.04}
                min={-0.5}
                max={1}
                step={0.01}
                PREVIEW={PREVIEW}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-full border px-3 text-[11px] transition-colors",
                    PREVIEW.colorPillBg,
                  )}
                >
                  <span className="size-3 rounded-full bg-[#B54B00]" />
                  #B54B00
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-full border px-3 text-[11px] transition-colors",
                    PREVIEW.colorPillBg,
                  )}
                >
                  <span
                    className={cn(
                      "size-3 rounded-full border",
                      isDark
                        ? "border-zinc-600 bg-zinc-900"
                        : "border-[#CFCFCF] bg-white",
                    )}
                  />
                  {isDark ? "#18181B" : "#FFFFFF"}
                </button>
              </div>
            </Panel>

            <Panel title="Export" isDark={isDark} PREVIEW={PREVIEW}>
              <Label
                className={cn(
                  "px-1 text-center text-[9px] font-medium uppercase tracking-[0.1em] leading-relaxed",
                  isDark ? "text-zinc-500" : "text-[#7A7A7A]",
                )}
              >
                Full React component with in-app text frame exports
              </Label>
              <textarea
                readOnly
                className={cn(
                  "h-24 w-full resize-none rounded-2xl border p-4 font-mono text-[11px] leading-relaxed shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]",
                  PREVIEW.textarea,
                )}
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
                    "h-8 min-w-0 justify-center gap-1.5 rounded-full border px-2 text-[9px] font-medium",
                    PREVIEW.outlineBtn,
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
                    "h-8 min-w-0 justify-center gap-1.5 rounded-full border px-2 text-[9px] font-medium",
                    PREVIEW.outlineBtn,
                  )}
                >
                  <Video className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 truncate">Video</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-8 min-w-0 justify-center gap-1.5 rounded-full border px-2 text-[9px] font-medium",
                    PREVIEW.componentBtn,
                  )}
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 truncate">Component</span>
                </Button>
              </div>
            </Panel>
          </div>

          <div className="h-full lg:sticky lg:top-3 xl:top-4 lg:max-h-[70vh]">
            <div className={cn(PREVIEW.card, "flex h-full flex-col")}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  PREVIEW.cardHeader,
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider",
                    isDark ? "text-zinc-100" : "text-[#111]",
                  )}
                >
                  Preview
                </span>
                <span className={cn("font-medium", PREVIEW.meta)}>
                  240f · 130x72 (780x684px)
                </span>
              </div>

              <div
                className={cn(
                  "flex-1 overflow-hidden p-3",
                  isDark ? "bg-zinc-800" : "bg-white",
                )}
              >
                <div
                  className={cn(
                    "relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden rounded-lg border",
                    PREVIEW.previewCanvasBg,
                  )}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "scale(0.6)",
                      transformOrigin: "center center",
                    }}
                  >
                    <Fire />
                  </div>
                </div>
              </div>

              <div
                className={cn("border-t px-4 py-2.5", PREVIEW.previewFooterBg)}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className={PREVIEW.labelNarrow}>
                    Timeline Scrubber
                  </Label>
                  <span className={cn(PREVIEW.valueMono)}>
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

              <div
                className={cn("grid grid-cols-3 border-t", PREVIEW.statBorder)}
              >
                <Stat
                  label="Frames"
                  value="240"
                  isDark={isDark}
                  PREVIEW={PREVIEW}
                />
                <Stat
                  label="Grid"
                  value="130x72"
                  isDark={isDark}
                  PREVIEW={PREVIEW}
                />
                <Stat
                  label="Resolution"
                  value="780x684px"
                  isDark={isDark}
                  PREVIEW={PREVIEW}
                />
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
  isDark,
  PREVIEW,
}: {
  children: React.ReactNode;
  title: string;
  isDark: boolean;
  PREVIEW: Record<string, string>;
}) {
  return (
    <div className={PREVIEW.card}>
      <div className={PREVIEW.cardHeader}>
        <span
          className={cn(
            "text-[11px] font-semibold uppercase tracking-wider",
            isDark ? "text-zinc-100" : "text-[#111]",
          )}
        >
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
  PREVIEW,
}: {
  label: string;
  max: number;
  min: number;
  step: number;
  value: number;
  PREVIEW: Record<string, string>;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className={PREVIEW.label}>{label}</Label>
        <span
          className={cn(
            "text-[10px] tabular-nums font-medium",
            PREVIEW.valueMono,
          )}
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

function Stat({
  label,
  value,
  isDark,
  PREVIEW,
}: {
  label: string;
  value: string;
  isDark: boolean;
  PREVIEW: Record<string, string>;
}) {
  return (
    <button
      type="button"
      className={cn(
        "border-r px-2 py-2.5 text-center last:border-r-0 transition-colors",
        PREVIEW.statBorder,
        PREVIEW.statHover,
      )}
    >
      <div className={cn(PREVIEW.labelNarrow, "mb-0.5")}>{label}</div>
      <div
        className={cn(
          "text-[12px] font-medium tabular-nums leading-tight",
          PREVIEW.statText,
        )}
      >
        {value}
      </div>
    </button>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { parseGIF, decompressFrames } from "gifuct-js";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Code2,
  Copy,
  FileArchive,
  Film,
  Image as ImageIcon,
  ImageDown,
  Italic,
  Trash2,
  Upload,
  Wand2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ToggleButton from "@/components/toggle-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorField } from "@/components/color-field";

import { useAsciiStore, type StudioSource } from "@/lib/store";
import {
  ASCII_FONT_PRESETS,
  ASCII_CHAR_PRESETS,
  DEFAULT_ASCII_APPEARANCE,
} from "@/lib/ascii-config";
import {
  buildASCIIAnimationReactComponentSource,
  exportASCIIAnimationAsVideo,
  exportASCIIAsImage,
  exportASCIIAsZip,
} from "@/lib/ascii-export";
import { loadGoogleFont } from "@/lib/font-loader";
import { useStudio } from "@/lib/studio-context";
import {
  STUDIO_CARD_OUTLINE,
  STUDIO_DROPZONE,
  STUDIO_FIELD_CLASS,
  STUDIO_FIELD_MONO_CLASS,
  STUDIO_FIELD_READONLY_MUTED,
  STUDIO_OUTLINE_TERTIARY,
  STUDIO_SELECT_CONTENT,
  STUDIO_SELECT_ITEM,
  STUDIO_SLIDER_CLASS,
  STUDIO_TEXT_LABEL,
  STUDIO_TEXT_META,
} from "@/lib/studio-theme";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Layout primitives                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

function AccordionSection({
  title,
  defaultOpen = false,
  action,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-[#E5E5E5]/70 dark:border-zinc-800/70 last:border-0">
      <header
        className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 select-none transition-colors hover:bg-[#F9FAFC] dark:hover:bg-zinc-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "size-3.5 text-[#B54B00]/40 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90",
            )}
          />
          <h3 className="font-sans text-xs font-semibold tracking-wide text-[#111] dark:text-zinc-100">
            {title}
          </h3>
        </div>
        <div onClick={(e) => e.stopPropagation()}>{action}</div>
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ResetChip({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="landing"
      size="sm"
      className="h-7 min-h-0 rounded-full px-3 py-0 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#B54B00]"
    >
      Reset
    </Button>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className={cn("font-sans text-xs", STUDIO_TEXT_LABEL)}>
      {children}
    </span>
  );
}

function MiniDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1">
      <span
        className={cn(
          "font-mono text-[9px] font-semibold uppercase tracking-widest",
          STUDIO_TEXT_LABEL,
        )}
      >
        {label}
      </span>
      <div className="h-px flex-1 bg-[#E5E5E5]/80" />
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function ColorSwatchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return <ColorField label={label} value={value} onChange={onChange} asRow />;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <span className="min-w-[3ch] text-right font-mono text-[10px] tabular-nums text-[#111] dark:text-zinc-100">
          {display ?? value}
        </span>
      </div>
      <Slider
        className={STUDIO_SLIDER_CLASS}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => v !== undefined && onChange(v)}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Source                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

const MAX_BYTES = 30 * 1024 * 1024;

function SourceSection() {
  const source = useAsciiStore((s) => s.source);
  const setSource = useAsciiStore((s) => s.setSource);
  const setPlaying = useAsciiStore((s) => s.setPlaying);
  const clearSource = useAsciiStore((s) => s.clearSource);
  const setMode = useAsciiStore((s) => s.setMode);
  const sourceKind = source?.kind;
  const { requestExportAction, isExporting } = useStudio();
  const sourceRef = useRef(source);
  useEffect(() => {
    sourceRef.current = source;
  });

  const onDrop = useCallback(
    async (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error(rejected[0].errors[0]?.message ?? "File rejected");
        return;
      }
      const file = accepted[0];
      if (!file) return;
      try {
        const built = await loadSourceFromFile(file);
        if (sourceRef.current?.url) URL.revokeObjectURL(sourceRef.current.url);
        // Remove DOM-mounted GIF img if previous source was a GIF
        const prevEl = sourceRef.current?.el as
          | (HTMLImageElement & { _isGifMounted?: boolean })
          | undefined;
        if (prevEl?._isGifMounted && prevEl.parentElement)
          prevEl.parentElement.removeChild(prevEl);
        setSource(built);
        if (built.kind === "video" || built.kind === "gif") setPlaying(true);
        toast.success(`Loaded ${file.name}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load file");
      }
    },
    [setSource, setPlaying],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [], "image/gif": [] },
    multiple: false,
    maxSize: MAX_BYTES,
  });

  return (
    <AccordionSection title="Source Media" defaultOpen={true}>
      <div
        suppressHydrationWarning
        {...getRootProps()}
        className={cn(
          "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-3 px-3 py-5 text-center",
          STUDIO_DROPZONE,
          isDragActive && "border-[#B54B00] bg-[#FFF5ED]/90",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-3.5 w-3.5 shrink-0 text-[#B54B00]/80" />
        <div className="space-y-1">
          <p className="font-sans text-xs font-semibold text-[#111] dark:text-zinc-100">
            {isDragActive ? "Drop to load" : "Drop or browse"}
          </p>
          <p className="font-sans text-[10px] text-[#666] dark:text-zinc-500">
            Image, GIF, or video · up to 30 MB
          </p>
        </div>
      </div>

      {source && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-white dark:bg-zinc-800 p-2 pl-3",
            STUDIO_CARD_OUTLINE,
            "shadow-[0px_1px_2px_rgba(0,0,0,0.04)]",
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#E5E5E5] dark:border-zinc-700 bg-[#F9FAFC] dark:bg-zinc-700 text-[#B54B00]">
            {source.kind === "image" ? (
              <ImageIcon className="size-3.5" />
            ) : (
              <Film className="size-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-xs font-semibold text-[#111] dark:text-zinc-100">
              {source.file?.name ?? "Sample source"}
            </p>
            <p className="font-mono text-[10px] tabular-nums text-[#666] dark:text-zinc-500">
              {source.width} × {source.height}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (source.url) URL.revokeObjectURL(source.url);
              clearSource();
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-[#888] transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remove source"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="landingBlue"
            size="sm"
            className="h-8 w-full min-h-0 gap-2 rounded-full px-3 py-0 font-sans text-[11px] font-semibold tracking-wide"
            disabled={!source || isExporting}
          >
            <Wand2 className="size-3.5" />
            {isExporting ? "Exporting…" : "Export ASCII"}
            <ChevronDown className="ml-1.5 size-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-56 border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#111] dark:text-zinc-100 shadow-md shadow-black/5 dark:shadow-black/30 ring-0"
        >
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-[#333] dark:text-zinc-200 focus:bg-[#FFF5ED] dark:focus:bg-zinc-800 focus:text-[#B54B00]"
            onClick={() => {
              setMode("image");
              setTimeout(() => requestExportAction("image"), 50);
            }}
          >
            <ImageIcon className="size-4 text-[#B54B00]/60" />
            <span className="font-sans text-xs">Export as Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-[#333] dark:text-zinc-200 focus:bg-[#FFF5ED] dark:focus:bg-zinc-800 focus:text-[#B54B00]"
            disabled={sourceKind !== "video" && sourceKind !== "gif"}
            onClick={() => {
              setMode("video");
              setTimeout(() => requestExportAction("video"), 50);
            }}
          >
            <Film className="size-4 text-[#B54B00]/60" />
            <span className="font-sans text-xs">Export as Video</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-[#333] dark:text-zinc-200 focus:bg-[#FFF5ED] dark:focus:bg-zinc-800 focus:text-[#B54B00]"
            onClick={() => {
              setMode("component");
              setTimeout(() => requestExportAction("component"), 50);
            }}
          >
            <Code2 className="size-4 text-[#B54B00]/60" />
            <span className="font-sans text-xs">Export as React Component</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-[#333] dark:text-zinc-200 focus:bg-[#FFF5ED] dark:focus:bg-zinc-800 focus:text-[#B54B00]"
            onClick={() => {
              setTimeout(() => requestExportAction("zip"), 50);
            }}
          >
            <FileArchive className="size-4 text-[#B54B00]/60" />
            <span className="font-sans text-xs">Export as ZIP</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-[#333] dark:text-zinc-200 focus:bg-[#FFF5ED] dark:focus:bg-zinc-800 focus:text-[#B54B00]"
            onClick={() => {
              setTimeout(() => requestExportAction("copy"), 50);
            }}
          >
            <Copy className="size-4 text-[#B54B00]/60" />
            <span className="font-sans text-xs">Copy Code</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AccordionSection>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Background Canvas                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

function BackgroundCanvasSection({
  previewRef,
}: {
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  const columns = useAsciiStore((s) => s.columns);
  const setColumns = useAsciiStore((s) => s.setColumns);
  const responsiveFit = useAsciiStore((s) => s.responsiveFit);
  const setResponsiveFit = useAsciiStore((s) => s.setResponsiveFit);
  const appearance = useAsciiStore((s) => s.appearance);
  const source = useAsciiStore((s) => s.source);

  const cellWidth = appearance.fontSize * 0.6 + appearance.letterSpacing;
  const cellHeight = appearance.fontSize * appearance.lineHeight;
  const cellAspect = cellHeight > 0 ? cellWidth / cellHeight : 0.5;
  const approxRows = source
    ? Math.max(
        1,
        Math.round((columns * source.height * cellAspect) / source.width),
      )
    : "";

  useEffect(() => {
    if (!responsiveFit || !previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (!width) return;
      setColumns(
        Math.max(40, Math.min(300, Math.floor(width / Math.max(1, cellWidth)))),
      );
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [responsiveFit, previewRef, cellWidth, setColumns]);

  return (
    <AccordionSection title="Canvas Settings" defaultOpen={false}>
      <Row label="Auto-Fit Screen">
        <ToggleButton toggle={responsiveFit} setToggle={setResponsiveFit} />
      </Row>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <FieldLabel>Width (Cols)</FieldLabel>
          <div
            className={cn(
              "flex items-center overflow-hidden rounded-md border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800",
              responsiveFit && "opacity-50 pointer-events-none",
            )}
          >
            <button
              type="button"
              onClick={() => setColumns(Math.max(40, columns - 1))}
              disabled={responsiveFit || columns <= 40}
              className="flex h-8 w-7 shrink-0 items-center justify-center border-r border-[#E5E5E5] dark:border-zinc-700 text-[#888] dark:text-zinc-400 hover:bg-[#F9FAFC] dark:hover:bg-zinc-700 hover:text-[#111] dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 4.5h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              type="number"
              className="h-8 w-full min-w-0 bg-transparent text-center font-mono text-xs tabular-nums text-[#111] dark:text-zinc-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              value={columns}
              min={40}
              max={300}
              disabled={responsiveFit}
              onChange={(e) => setColumns(Number(e.target.value))}
            />
            <button
              type="button"
              onClick={() => setColumns(Math.min(300, columns + 1))}
              disabled={responsiveFit || columns >= 300}
              className="flex h-8 w-7 shrink-0 items-center justify-center border-l border-[#E5E5E5] dark:border-zinc-700 text-[#888] dark:text-zinc-400 hover:bg-[#F9FAFC] dark:hover:bg-zinc-700 hover:text-[#111] dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 2v6M2 5h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Height (Rows)</FieldLabel>
          <Input
            type="text"
            readOnly
            className={STUDIO_FIELD_READONLY_MUTED}
            value={approxRows}
          />
        </div>
      </div>
    </AccordionSection>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Conversion                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

const DEFAULT_PRESET =
  ASCII_CHAR_PRESETS.find((preset) => preset.id === "terminal") ??
  ASCII_CHAR_PRESETS[0];

function ConversionSection() {
  const threshold = useAsciiStore((s) => s.threshold);
  const invert = useAsciiStore((s) => s.invert);
  const charset = useAsciiStore((s) => s.charset);
  const charsetPresetId = useAsciiStore((s) => s.charsetPresetId);
  const setColumns = useAsciiStore((s) => s.setColumns);
  const setThreshold = useAsciiStore((s) => s.setThreshold);
  const setInvert = useAsciiStore((s) => s.setInvert);
  const setCharset = useAsciiStore((s) => s.setCharset);
  const setCharsetPreset = useAsciiStore((s) => s.setCharsetPreset);

  const reset = () => {
    setColumns(130);
    setThreshold(-12);
    setInvert(false);
    setCharsetPreset(DEFAULT_PRESET.id);
  };

  return (
    <AccordionSection
      title="Conversion"
      defaultOpen={false}
      action={<ResetChip onClick={reset} />}
    >
      <SliderField
        label="Density Threshold"
        value={threshold}
        min={-100}
        max={100}
        step={1}
        onChange={setThreshold}
      />

      <div className="space-y-2 pt-2">
        <div className="space-y-1.5">
          <FieldLabel>Character Set Mapping</FieldLabel>
          <p
            className={cn(
              "max-w-full text-[10px] leading-relaxed",
              STUDIO_TEXT_META,
            )}
          >
            There are many built-in brightness ramps and styles, so the menu is
            long scroll the list, or type your own sequence in the field below.
            Muted gray in each row is a sample of the character order (dark →
            light), not the preview&apos;s ink color (set under Appearance).
          </p>
        </div>
        <Select
          value={charsetPresetId ?? "__custom__"}
          onValueChange={(id) => {
            if (id !== "__custom__") setCharsetPreset(id);
          }}
        >
          <SelectTrigger className={cn(STUDIO_FIELD_CLASS, "font-sans")}>
            <SelectValue placeholder="Select preset…" />
          </SelectTrigger>
          <SelectContent
            className={cn(STUDIO_SELECT_CONTENT, "max-h-[min(50dvh,280px)]")}
          >
            {ASCII_CHAR_PRESETS.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id}
                className={STUDIO_SELECT_ITEM}
              >
                <span className="font-semibold">{p.label}</span>
                <span className="ml-2 font-mono text-[10px] text-[#666] dark:text-zinc-500">
                  {p.chars.replace(/^\s+/, "").slice(0, 14)}
                </span>
              </SelectItem>
            ))}
            {!charsetPresetId && (
              <SelectItem value="__custom__" className={STUDIO_SELECT_ITEM}>
                Custom
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          value={charset}
          onChange={(e) => setCharset(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className={STUDIO_FIELD_MONO_CLASS}
          placeholder="darkest → brightest chars"
        />
      </div>

      <Row label="Invert Mapping">
        <ToggleButton toggle={invert} setToggle={setInvert} />
      </Row>
    </AccordionSection>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Appearance                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function AppearanceSection() {
  const appearance = useAsciiStore((s) => s.appearance);
  const patchAppearance = useAsciiStore((s) => s.patchAppearance);

  const isBold =
    appearance.fontWeight === "bold" ||
    appearance.fontWeight === 700 ||
    appearance.fontWeight === "700";
  const fontId =
    ASCII_FONT_PRESETS.find((f) => f.value === appearance.fontFamily)?.id ??
    ASCII_FONT_PRESETS[0]?.id ??
    "";

  return (
    <AccordionSection
      title="Appearance"
      defaultOpen={false}
      action={
        <ResetChip onClick={() => patchAppearance(DEFAULT_ASCII_APPEARANCE)} />
      }
    >
      <MiniDivider label="Typography" />
      <div className="space-y-2">
        <FieldLabel>Font Family</FieldLabel>
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
          <SelectTrigger className={cn(STUDIO_FIELD_CLASS, "font-sans")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={STUDIO_SELECT_CONTENT}>
            {ASCII_FONT_PRESETS.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id}
                className={STUDIO_SELECT_ITEM}
              >
                <span style={{ fontFamily: p.value }}>{p.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Row label="Style & Weight">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isBold}
            onClick={() =>
              patchAppearance({ fontWeight: isBold ? "normal" : "bold" })
            }
            className={cn(
              STUDIO_OUTLINE_TERTIARY,
              "h-7 w-8 min-w-8 rounded-full border-[#D8D8D8] p-0",
              isBold &&
                "border-[#EBC6A5] bg-[#FFF5ED] text-[#7A3300] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]",
            )}
          >
            <Bold className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={appearance.fontStyle === "italic"}
            onClick={() =>
              patchAppearance({
                fontStyle:
                  appearance.fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={cn(
              STUDIO_OUTLINE_TERTIARY,
              "h-7 w-8 min-w-8 rounded-full border-[#D8D8D8] p-0",
              appearance.fontStyle === "italic" &&
                "border-[#EBC6A5] bg-[#FFF5ED] text-[#7A3300] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]",
            )}
          >
            <Italic className="size-3.5" />
          </Button>
        </div>
      </Row>

      <SliderField
        label="Font Size"
        value={appearance.fontSize}
        min={4}
        max={24}
        step={0.5}
        onChange={(v) => patchAppearance({ fontSize: v })}
        display={`${appearance.fontSize.toFixed(1)}px`}
      />
      <div className="grid grid-cols-2 gap-4">
        <SliderField
          label="Line Height"
          value={appearance.lineHeight}
          min={0.5}
          max={1.6}
          step={0.01}
          onChange={(v) => patchAppearance({ lineHeight: v })}
          display={appearance.lineHeight.toFixed(2)}
        />
        <SliderField
          label="Letter Spacing"
          value={appearance.letterSpacing}
          min={-0.5}
          max={1}
          step={0.01}
          onChange={(v) => patchAppearance({ letterSpacing: v })}
          display={appearance.letterSpacing.toFixed(2)}
        />
      </div>

      <MiniDivider label="Theme Colors" />
      {/* Color rows */}
      <div className="space-y-1.5">
        <ColorSwatchRow
          label="Background"
          value={appearance.backgroundColor}
          onChange={(v) => patchAppearance({ backgroundColor: v })}
        />
        <ColorSwatchRow
          label="Text"
          value={appearance.textColor}
          onChange={(v) => patchAppearance({ textColor: v })}
        />
      </div>
      <Row label="Use Source Colors">
        <ToggleButton
          toggle={appearance.useColors}
          setToggle={(v) => patchAppearance({ useColors: v })}
        />
      </Row>

      <MiniDivider label="Meta" />
      <Row label="Show Frame Counter">
        <ToggleButton
          toggle={appearance.showFrameCounter}
          setToggle={(v) => patchAppearance({ showFrameCounter: v })}
        />
      </Row>
    </AccordionSection>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Export                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function ExportChip({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isComponent = label === "React";
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        STUDIO_OUTLINE_TERTIARY,
        "h-8 min-w-0 justify-center gap-1.5 rounded-full border-[#D8D8D8] dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 text-[9px] font-medium",
        !isComponent &&
          "hover:border-[#B54B00]/40 hover:bg-[#FFF5ED] dark:hover:bg-zinc-700 hover:text-[#B54B00]",
        isComponent &&
          "border-[#EBC6A5] dark:border-zinc-600 bg-[#FFF5ED] dark:bg-zinc-700/60 text-[#7A3300] dark:text-[#B54B00] hover:bg-[#FFECDD] dark:hover:bg-zinc-700",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
    </Button>
  );
}

function ExportSection() {
  const PROGRESS_TOAST_ID = "studio-export-progress";
  const {
    canvasRef,
    registerExportHandler,
    registerExportActions,
    isExporting,
    setIsExporting,
  } = useStudio();
  const source = useAsciiStore((s) => s.source);
  const appearance = useAsciiStore((s) => s.appearance);
  const charset = useAsciiStore((s) => s.charset);
  const mode = useAsciiStore((s) => s.mode);

  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [exportStage, setExportStage] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const dismissProgressToast = useCallback(() => {
    toast.dismiss(PROGRESS_TOAST_ID);
  }, []);

  useEffect(() => {
    if (!isExporting) return;
    const clampedProgress = Math.max(0, Math.min(100, progress));
    toast.loading("Exporting…", {
      id: PROGRESS_TOAST_ID,
      description: (
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{exportStage || "Preparing export"}</span>
            <span className="tabular-nums">{clampedProgress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#B54B00] transition-all duration-300"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>
      ),
      position: "bottom-center",
      duration: Number.POSITIVE_INFINITY,
      action: {
        label: "Cancel",
        onClick: () => abortRef.current?.abort(),
      },
    });
  }, [exportStage, isExporting, progress]);

  const stem = useCallback(
    () =>
      filename.trim() || source?.file?.name?.replace(/\.[^.]+$/, "") || "ascii",
    [filename, source],
  );

  const downloadTextFile = useCallback((content: string, fileName: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const downloadPNG = useCallback(async () => {
    const result = canvasRef.current?.getFrameResult();
    const frame = result?.text ?? canvasRef.current?.getFrameText() ?? "";
    if (!frame) {
      toast.error("Nothing to export yet");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setExportStage("Rendering image");
    setProgress(30);
    try {
      await exportASCIIAsImage({
        appearance,
        fileName: stem(),
        frame,
        colors: result?.colors,
        chars: charset,
        quality: 2,
      });
      setProgress(100);
      dismissProgressToast();
      toast.success("Image exported", { position: "bottom-center" });
    } catch (err) {
      dismissProgressToast();
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
      setExportStage("");
    }
  }, [appearance, canvasRef, charset, isExporting, setIsExporting, stem]);

  const copyText = useCallback(async () => {
    const text = canvasRef.current?.getFrameText() ?? "";
    if (!text) {
      toast.error("Nothing to copy yet");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard access denied");
    }
  }, [canvasRef]);

  const exportVideo = useCallback(async () => {
    if (!source || (source.kind !== "video" && source.kind !== "gif")) {
      toast.error("Load a video or GIF first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let frameCount = 0;
    try {
      await exportASCIIAnimationAsVideo({
        appearance,
        fileName: stem(),
        fps:
          source.kind === "gif" && source.gifFrames?.length
            ? Math.round(
                1000 /
                  (source.gifFrames.reduce((s, f) => s + f.delayMs, 0) /
                    source.gifFrames.length),
              )
            : 24,
        chars: charset,
        sourceWidth: source.width,
        sourceHeight: source.height,
        onStage: setExportStage,
        onProgress: setProgress,
        streamFrames: (onFrame, signal) => {
          if (!canvasRef.current) return Promise.resolve();
          return canvasRef.current.streamFrames(
            async (text, colors, idx, total) => {
              frameCount = total;
              await onFrame(text, colors, idx, total);
            },
            signal ?? ctrl.signal,
          );
        },
      });
      dismissProgressToast();
      toast.success("Video exported", { position: "bottom-center" });
    } catch (err) {
      dismissProgressToast();
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.message("Export cancelled", { position: "bottom-center" });
      } else {
        toast.error(err instanceof Error ? err.message : "Export failed");
      }
    } finally {
      setIsExporting(false);
      setProgress(0);
      setExportStage("");
      abortRef.current = null;
    }
  }, [
    appearance,
    canvasRef,
    charset,
    isExporting,
    setIsExporting,
    source,
    stem,
  ]);

  const exportComponent = useCallback(async () => {
    if (!source) {
      toast.error("Load a file first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);
    setExportStage("Capturing frames");
    try {
      const results =
        (await canvasRef.current?.getFrames((done, total) =>
          setProgress(Math.round((done / total) * 80)),
        )) ?? [];
      if (!results.length) {
        toast.error("No frames captured");
        return;
      }
      setExportStage("Building component");
      setProgress(85);
      const code = buildASCIIAnimationReactComponentSource({
        appearance: { ...appearance, showFrameCounter: false },
        componentName: toPascalCase(stem()),
        fps: 24,
        frames: results.map((r) => r.text),
        chars: charset,
        sourceWidth: source.width,
        sourceHeight: source.height,
      });
      setProgress(100);
      dismissProgressToast();
      downloadTextFile(code, `${stem()}.tsx`);
      toast.success("React component exported", { position: "bottom-center" });
    } catch (err) {
      dismissProgressToast();
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
      setExportStage("");
    }
  }, [
    appearance,
    canvasRef,
    charset,
    downloadTextFile,
    isExporting,
    setIsExporting,
    source,
    stem,
  ]);

  const exportZip = useCallback(async () => {
    if (!source) {
      toast.error("Load a file first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);
    setExportStage("Capturing frames");
    try {
      const results =
        (await canvasRef.current?.getFrames((done, total) =>
          setProgress(Math.round((done / total) * 80)),
        )) ?? [];
      if (!results.length) {
        toast.error("No frames captured");
        return;
      }
      setExportStage("Building ZIP");
      setProgress(90);
      exportASCIIAsZip({
        frames: results.map((r) => r.text),
        fileName: stem(),
      });
      setProgress(100);
      dismissProgressToast();
      toast.success("ZIP exported", { position: "bottom-center" });
    } catch (err) {
      dismissProgressToast();
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
      setExportStage("");
    }
  }, [canvasRef, isExporting, setIsExporting, source, stem]);

  useEffect(() => {
    const h =
      mode === "image"
        ? downloadPNG
        : mode === "video"
          ? exportVideo
          : exportComponent;
    registerExportHandler(h);
    return () => registerExportHandler(null);
  }, [mode, downloadPNG, exportVideo, exportComponent, registerExportHandler]);

  useEffect(() => {
    registerExportActions({
      image: downloadPNG,
      video: exportVideo,
      component: exportComponent,
      zip: exportZip,
      copy: copyText,
    });
    return () => registerExportActions(null);
  }, [
    copyText,
    downloadPNG,
    exportComponent,
    exportVideo,
    exportZip,
    registerExportActions,
  ]);

  return (
    <>
      <AccordionSection title="Export Actions" defaultOpen={false}>
        <div className="space-y-2">
          <FieldLabel>File Name</FieldLabel>
          <Input
            placeholder="filename (optional)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className={STUDIO_FIELD_MONO_CLASS}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ExportChip
            icon={Copy}
            label="Copy"
            onClick={copyText}
            disabled={isExporting}
          />
          <ExportChip
            icon={Film}
            label="Video"
            onClick={exportVideo}
            disabled={
              isExporting ||
              !source ||
              (source.kind !== "video" && source.kind !== "gif")
            }
          />
          <ExportChip
            icon={ImageDown}
            label="Image"
            onClick={downloadPNG}
            disabled={isExporting || !source}
          />
          <ExportChip
            icon={Code2}
            label="React"
            onClick={exportComponent}
            disabled={isExporting || !source}
          />
          <ExportChip
            icon={FileArchive}
            label="ZIP"
            onClick={exportZip}
            disabled={isExporting || !source}
          />
        </div>
      </AccordionSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Root                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export function LeftSidebar({
  previewRef,
}: {
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col">
      <SourceSection />
      <BackgroundCanvasSection previewRef={previewRef} />
      <ConversionSection />
      <AppearanceSection />
      <ExportSection />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* File helpers                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

async function loadSourceFromFile(file: File): Promise<StudioSource> {
  const url = URL.createObjectURL(file);

  if (file.type === "image/gif") {
    const buffer = await file.arrayBuffer();
    const parsed = parseGIF(buffer);
    const rawFrames = decompressFrames(parsed, true);

    if (rawFrames.length <= 1) {
      // Static GIF — treat as plain image
      const img = await loadImage(url);
      return {
        kind: "image",
        el: img,
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    }

    const { width: gifW, height: gifH } = parsed.lsd;

    // Composite frames onto a persistent canvas, respecting disposal methods
    const compositeCanvas = document.createElement("canvas");
    compositeCanvas.width = gifW;
    compositeCanvas.height = gifH;
    const ctx = compositeCanvas.getContext("2d")!;

    const gifFrames: { canvas: HTMLCanvasElement; delayMs: number }[] = [];
    let prevState: ImageData | null = null;

    for (const frame of rawFrames) {
      if (frame.disposalType === 3) {
        prevState = ctx.getImageData(0, 0, gifW, gifH);
      }

      const patch = new ImageData(
        new Uint8ClampedArray(frame.patch),
        frame.dims.width,
        frame.dims.height,
      );
      ctx.putImageData(patch, frame.dims.left, frame.dims.top);

      const fc = document.createElement("canvas");
      fc.width = gifW;
      fc.height = gifH;
      fc.getContext("2d")!.drawImage(compositeCanvas, 0, 0);
      gifFrames.push({
        canvas: fc,
        delayMs: Math.max(20, frame.delay ?? 100),
      });

      if (frame.disposalType === 2) {
        ctx.clearRect(
          frame.dims.left,
          frame.dims.top,
          frame.dims.width,
          frame.dims.height,
        );
      } else if (frame.disposalType === 3 && prevState) {
        ctx.putImageData(prevState, 0, 0);
        prevState = null;
      }
    }

    // el is a canvas we'll paint the current frame into during playback
    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = gifW;
    displayCanvas.height = gifH;
    displayCanvas.getContext("2d")!.drawImage(gifFrames[0].canvas, 0, 0);

    return {
      kind: "gif",
      el: displayCanvas,
      file,
      url,
      width: gifW,
      height: gifH,
      gifFrames,
    };
  }

  if (file.type.startsWith("image/")) {
    const img = await loadImage(url);
    return {
      kind: "image",
      el: img,
      file,
      url,
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
  }

  if (file.type.startsWith("video/")) {
    const video = await loadVideo(url);
    return {
      kind: "video",
      el: video,
      file,
      url,
      width: video.videoWidth,
      height: video.videoHeight,
      durationMs: Number.isFinite(video.duration) ? video.duration * 1000 : 0,
    };
  }
  URL.revokeObjectURL(url);
  throw new Error("Unsupported file type");
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Failed to load image"));
    img.src = url;
  });
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((res, rej) => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.preload = "auto";
    v.onloadedmetadata = () => requestAnimationFrame(() => res(v));
    v.onerror = () => rej(new Error("Failed to load video"));
    v.src = url;
  });
}

function toPascalCase(value: string) {
  const normalized = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1));
  const joined = normalized.join("");
  return joined && /^[A-Z]/.test(joined)
    ? joined
    : `Ascii${joined || "Export"}`;
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Code2,
  Copy,
  Film,
  Image as ImageIcon,
  ImageDown,
  Italic,
  Trash2,
  Upload,
  Wand2,
  ChevronDown,
} from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorField } from "@/components/color-field";
import {
  ExportResultDialog,
  type ExportResult,
} from "@/components/export-result-dialog";

import { useAsciiStore, type StudioSource, type StudioMode } from "@/lib/store";
import {
  ASCII_FONT_PRESETS,
  ASCII_CHAR_PRESETS,
  DEFAULT_ASCII_APPEARANCE,
  type ASCIITextEffect,
} from "@/lib/ascii-config";
import { loadGoogleFont } from "@/lib/font-loader";
import { useStudio } from "@/lib/studio-context";
import { buildAnimationComponentSource } from "@/lib/component-export";
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
    <section className="border-b border-zinc-800/50 last:border-0">
      <header
        className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 select-none hover:bg-zinc-800/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "size-3.5 text-zinc-500 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
          <h3 className="font-sans text-xs font-semibold tracking-wide text-white">
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
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm bg-zinc-800/50 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-white"
    >
      Reset
    </button>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-sans text-xs text-zinc-400">
      {children}
    </span>
  );
}

function MiniDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1">
      <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-600">
        {label}
      </span>
      <div className="h-px flex-1 bg-zinc-800/50" />
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
        <span className="min-w-[3ch] text-right font-mono text-[10px] tabular-nums text-white">
          {display ?? value}
        </span>
      </div>
      <Slider
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

const MAX_BYTES = 100 * 1024 * 1024;

function SourceSection() {
  const source = useAsciiStore((s) => s.source);
  const setSource = useAsciiStore((s) => s.setSource);
  const clearSource = useAsciiStore((s) => s.clearSource);
  const mode = useAsciiStore((s) => s.mode);
  const setMode = useAsciiStore((s) => s.setMode);
  const sourceKind = source?.kind;
  const { requestExport, isExporting } = useStudio();
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
        setSource(built);
        toast.success(`Loaded ${file.name}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load file");
      }
    },
    [setSource],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: false,
    maxSize: MAX_BYTES,
  });

  const MODES: { value: StudioMode; label: string }[] = [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "component", label: "React" },
  ];

  return (
    <AccordionSection title="Source Media" defaultOpen={true}>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 py-6 text-center transition-colors",
          "hover:border-zinc-500 hover:bg-zinc-800/50",
          isDragActive && "border-zinc-400 bg-zinc-800",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
          <Upload className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="font-sans text-xs font-semibold text-white">
            {isDragActive ? "Drop to load" : "Drop or browse"}
          </p>
          <p className="font-sans text-[10px] text-zinc-500">
            Image or Video up to 100MB
          </p>
        </div>
      </div>

      {source && (
        <div className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/30 p-2 pl-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-zinc-800 text-white">
            {source.kind === "image" ? (
              <ImageIcon className="size-3.5" />
            ) : (
              <Film className="size-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-xs font-semibold text-white">
              {source.file?.name ?? "Sample source"}
            </p>
            <p className="font-mono text-[10px] tabular-nums text-zinc-500">
              {source.width} × {source.height}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (source.url) URL.revokeObjectURL(source.url);
              clearSource();
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remove source"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 w-full gap-2 rounded-md font-sans text-xs font-semibold tracking-wide bg-white text-zinc-950 hover:bg-zinc-200"
            disabled={!source || isExporting}
          >
            <Wand2 className="size-3.5" />
            {isExporting ? "Generating…" : "Generate Output"}
            <ChevronDown className="ml-1.5 size-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[calc(100%-2rem)] min-w-[200px] border-zinc-800 bg-zinc-950">
          <DropdownMenuItem
            className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-white"
            onClick={() => {
              setMode("image");
              setTimeout(requestExport, 50);
            }}
          >
            <ImageIcon className="size-4 text-zinc-400" />
            <span className="font-sans text-xs">Export as Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-white"
            disabled={sourceKind !== "video"}
            onClick={() => {
              setMode("video");
              setTimeout(requestExport, 50);
            }}
          >
            <Film className="size-4 text-zinc-400" />
            <span className="font-sans text-xs">Export as Video</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-white"
            onClick={() => {
              setMode("component");
              setTimeout(requestExport, 50);
            }}
          >
            <Code2 className="size-4 text-zinc-400" />
            <span className="font-sans text-xs">Export as React Component</span>
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
    : "—";

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
        <Switch checked={responsiveFit} onCheckedChange={setResponsiveFit} />
      </Row>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <FieldLabel>Width (Cols)</FieldLabel>
          <Input
            type="number"
            className="h-8 w-full rounded-sm border-zinc-800 bg-zinc-900/50 font-mono text-xs tabular-nums text-white"
            value={columns}
            min={40}
            max={300}
            disabled={responsiveFit}
            onChange={(e) => setColumns(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Height (Rows)</FieldLabel>
          <Input
            type="text"
            readOnly
            className="h-8 w-full rounded-sm border-transparent bg-zinc-900/30 font-mono text-xs tabular-nums text-zinc-500"
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

const DEFAULT_PRESET = ASCII_CHAR_PRESETS[0];

function ConversionSection() {
  const columns = useAsciiStore((s) => s.columns);
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
    setThreshold(0);
    setInvert(false);
    setCharsetPreset(DEFAULT_PRESET.id);
  };

  return (
    <AccordionSection title="Conversion" defaultOpen={false} action={<ResetChip onClick={reset} />}>
      <SliderField
        label="Density Threshold"
        value={threshold}
        min={-100}
        max={100}
        step={1}
        onChange={setThreshold}
      />

      <div className="space-y-2 pt-2">
        <FieldLabel>Character Set Mapping</FieldLabel>
        <Select
          value={charsetPresetId ?? "__custom__"}
          onValueChange={(id) => {
            if (id !== "__custom__") setCharsetPreset(id);
          }}
        >
          <SelectTrigger className="h-8 w-full rounded-sm border-zinc-800 bg-zinc-900/50 text-xs text-white">
            <SelectValue placeholder="Select preset…" />
          </SelectTrigger>
          <SelectContent className="max-h-[180px] rounded-md border-zinc-800 bg-zinc-950">
            {ASCII_CHAR_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id} className="rounded-sm text-xs text-white focus:bg-zinc-800">
                <span className="font-semibold">{p.label}</span>
                <span className="ml-2 font-mono text-[10px] text-zinc-500">
                  {p.chars.replace(/^\s+/, "").slice(0, 14)}
                </span>
              </SelectItem>
            ))}
            {!charsetPresetId && (
              <SelectItem value="__custom__" className="rounded-sm text-xs text-white focus:bg-zinc-800">
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
          className="h-8 rounded-sm border-zinc-800 bg-zinc-900/30 font-mono text-xs text-zinc-300"
          placeholder="darkest → brightest chars"
        />
      </div>

      <Row label="Invert Mapping">
        <Switch checked={invert} onCheckedChange={setInvert} />
      </Row>
    </AccordionSection>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Appearance                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

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
      action={<ResetChip onClick={() => patchAppearance(DEFAULT_ASCII_APPEARANCE)} />}
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
          <SelectTrigger className="h-8 w-full rounded-sm border-zinc-800 bg-zinc-900/50 text-xs text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[180px] rounded-md border-zinc-800 bg-zinc-950">
            {ASCII_FONT_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id} className="rounded-sm text-xs text-white focus:bg-zinc-800">
                <span style={{ fontFamily: p.value }}>{p.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Row label="Style & Weight">
        <div className="flex items-center overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/50">
          <Toggle
            pressed={isBold}
            onPressedChange={(v) =>
              patchAppearance({ fontWeight: v ? "bold" : "normal" })
            }
            className="h-7 w-8 rounded-none border-0 hover:bg-zinc-700 data-[state=on]:bg-zinc-800 data-[state=on]:text-white"
          >
            <Bold className="size-3.5" />
          </Toggle>
          <div className="h-4 w-px bg-zinc-800" />
          <Toggle
            pressed={appearance.fontStyle === "italic"}
            onPressedChange={(v) =>
              patchAppearance({ fontStyle: v ? "italic" : "normal" })
            }
            className="h-7 w-8 rounded-none border-0 hover:bg-zinc-700 data-[state=on]:bg-zinc-800 data-[state=on]:text-white"
          >
            <Italic className="size-3.5" />
          </Toggle>
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
      <div className="grid grid-cols-2 gap-2">
        <ColorField
          label="Background"
          value={appearance.backgroundColor}
          onChange={(v) => patchAppearance({ backgroundColor: v })}
        />
        <ColorField
          label="Text"
          value={appearance.textColor}
          onChange={(v) => patchAppearance({ textColor: v })}
        />
      </div>
      <Row label="Use Source Colors">
        <Switch
          checked={appearance.useColors}
          onCheckedChange={(v) => patchAppearance({ useColors: v })}
        />
      </Row>

      <MiniDivider label="Filters & Effects" />
      <div className="space-y-2">
        <FieldLabel>Text Effect</FieldLabel>
        <Select
          value={appearance.textEffect}
          onValueChange={(v) =>
            patchAppearance({ textEffect: v as ASCIITextEffect })
          }
        >
          <SelectTrigger className="h-8 w-full rounded-sm border-zinc-800 bg-zinc-900/50 text-xs text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[180px] rounded-md border-zinc-800 bg-zinc-950">
            {TEXT_EFFECTS.map((e) => (
              <SelectItem key={e.value} value={e.value} className="rounded-sm text-xs text-white focus:bg-zinc-800">
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {appearance.textEffect !== "none" && (
        <SliderField
          label="Intensity"
          value={appearance.textEffectThreshold}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => patchAppearance({ textEffectThreshold: v })}
          display={appearance.textEffectThreshold.toFixed(2)}
        />
      )}

      <MiniDivider label="Meta" />
      <Row label="Show Frame Counter">
        <Switch
          checked={appearance.showFrameCounter}
          onCheckedChange={(v) => patchAppearance({ showFrameCounter: v })}
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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex h-14 flex-col items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400 transition-colors",
        "hover:border-zinc-500 hover:bg-zinc-800 hover:text-white",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900/50 disabled:hover:text-zinc-400",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function ExportSection() {
  const { canvasRef, registerExportHandler, isExporting, setIsExporting } =
    useStudio();
  const source = useAsciiStore((s) => s.source);
  const appearance = useAsciiStore((s) => s.appearance);
  const mode = useAsciiStore((s) => s.mode);

  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [exportResult, setExportResult] = useState<ExportResult>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stem = useCallback(
    () =>
      filename.trim() ||
      source?.file?.name?.replace(/\.[^.]+$/, "") ||
      "ascii",
    [filename, source],
  );

  const downloadPNG = useCallback(async () => {
    const dataUrl = canvasRef.current?.exportPNG();
    if (!dataUrl) {
      toast.error("Nothing to export yet");
      return;
    }
    setExportResult({ kind: "png", dataUrl, filename: `${stem()}.png` });
  }, [canvasRef, stem]);

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

  const exportZip = useCallback(async () => {
    if (!source || source.kind !== "video") {
      toast.error("Load a video first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const frames =
        (await canvasRef.current?.getFrames(
          (done, total) => setProgress(Math.round((done / total) * 100)),
          ctrl.signal,
        )) ?? [];
      if (!frames.length) {
        toast.error("No frames captured");
        return;
      }
      const zip = new JSZip();
      const pad = String(frames.length).length;
      frames.forEach((f, i) =>
        zip.file(`frame-${String(i).padStart(pad, "0")}.txt`, f),
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${stem()}.zip`);
      URL.revokeObjectURL(url);
      setExportResult({
        kind: "zip",
        frameCount: frames.length,
        filename: `${stem()}.zip`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
      abortRef.current = null;
    }
  }, [canvasRef, stem, isExporting, setIsExporting, source]);

  const exportComponent = useCallback(async () => {
    if (!source) {
      toast.error("Load a file first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);
    try {
      const frames =
        (await canvasRef.current?.getFrames((done, total) =>
          setProgress(Math.round((done / total) * 100)),
        )) ?? [];
      const code = buildAnimationComponentSource(frames, {
        fps: 24,
        fontFamily: appearance.fontFamily,
        fontSize: appearance.fontSize,
        lineHeight: appearance.lineHeight,
        letterSpacing: appearance.letterSpacing,
        backgroundColor: appearance.backgroundColor,
        textColor: appearance.textColor,
        fontWeight: appearance.fontWeight,
        fontStyle: appearance.fontStyle,
      });
      setExportResult({ kind: "component", code, filename: `${stem()}.tsx` });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [appearance, canvasRef, stem, isExporting, setIsExporting, source]);

  useEffect(() => {
    const h =
      mode === "image"
        ? downloadPNG
        : mode === "video"
          ? exportZip
          : exportComponent;
    registerExportHandler(h);
    return () => registerExportHandler(null);
  }, [mode, downloadPNG, exportZip, exportComponent, registerExportHandler]);

  return (
    <>
      <AccordionSection title="Export Actions" defaultOpen={false}>
        <div className="space-y-2">
          <FieldLabel>File Name</FieldLabel>
          <Input
            placeholder="filename (optional)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="h-8 rounded-sm border-zinc-800 bg-zinc-900/50 font-mono text-xs text-zinc-300"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <ExportChip
            icon={Copy}
            label="Copy"
            onClick={copyText}
            disabled={isExporting}
          />
          <ExportChip
            icon={Film}
            label="Video"
            onClick={exportZip}
            disabled={isExporting || !source || source.kind !== "video"}
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
        </div>

        <div className="h-4">
          {isExporting && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-white transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] font-semibold tabular-nums text-white">
                {progress}%
              </span>
              <button
                type="button"
                className="font-sans text-[10px] font-bold text-zinc-500 transition-colors hover:text-red-400"
                onClick={() => abortRef.current?.abort()}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </AccordionSection>

      <ExportResultDialog
        result={exportResult}
        onClose={() => setExportResult(null)}
      />
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

function triggerDownload(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

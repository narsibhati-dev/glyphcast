"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  Bold,
  Copy,
  FileCode2,
  Film,
  Image as ImageIcon,
  ImageDown,
  Italic,
  RotateCcw,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-secondary/40 px-4 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

/** Horizontal rule with centred label — groups related controls */
function SubGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
          {label}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs text-muted-foreground shrink-0">{label}</Label>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function SliderField({
  label, value, min, max, step, onChange, display,
}: {
  label: string; value: number; min: number; max: number;
  step: number; onChange: (v: number) => void; display?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums text-foreground/75">
          {display ?? value}
        </span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]}
        onValueChange={([v]) => v !== undefined && onChange(v)} className="h-1.5" />
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
  useEffect(() => { sourceRef.current = source; });

  const onDrop = useCallback(async (accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0) { toast.error(rejected[0].errors[0]?.message ?? "File rejected"); return; }
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
  }, [setSource]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [], "video/*": [] }, multiple: false, maxSize: MAX_BYTES,
  });

  const MODES: { value: StudioMode; label: string }[] = [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "component", label: "Component" },
  ];

  return (
    <SectionCard title="Source">
      <div {...getRootProps()} className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-center transition-colors",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/8",
      )}>
        <input {...getInputProps()} />
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-colors",
          isDragActive && "bg-primary/15",
        )}>
          <Upload className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isDragActive ? "Drop to load" : "Drop a file or click to browse"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Images, GIFs, videos · 100 MB max
          </p>
        </div>
      </div>

      {source && (
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            {source.kind === "image" ? <ImageIcon className="size-3.5" /> : <Film className="size-3.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{source.file?.name ?? "Sample image"}</p>
            <p className="font-mono text-[10px] text-muted-foreground">{source.width} × {source.height}</p>
          </div>
          <button type="button"
            onClick={() => { if (source.url) URL.revokeObjectURL(source.url); clearSource(); }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

      <Tabs value={mode} onValueChange={(v) => setMode(v as StudioMode)}>
        <TabsList className="w-full h-8">
          {MODES.map((m) => (
            <TabsTrigger key={m.value} value={m.value} className="flex-1 text-xs"
              disabled={m.value === "video" && sourceKind !== "video"}>
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Button className="w-full gap-2" size="sm" onClick={requestExport} disabled={!source || isExporting}>
        <Wand2 className="size-3.5" />
        {isExporting ? "Exporting…" : "Export"}
      </Button>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Canvas                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function CanvasSection({ previewRef }: { previewRef: React.RefObject<HTMLDivElement | null> }) {
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
    ? Math.max(1, Math.round((columns * source.height * cellAspect) / source.width))
    : "—";

  useEffect(() => {
    if (!responsiveFit || !previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (!width) return;
      setColumns(Math.max(40, Math.min(300, Math.floor(width / Math.max(1, cellWidth)))));
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [responsiveFit, previewRef, cellWidth, setColumns]);

  return (
    <SectionCard title="Canvas">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Width (cols)</Label>
          <Input type="number" className="h-8 font-mono text-xs" value={columns}
            min={40} max={300} disabled={responsiveFit}
            onChange={(e) => setColumns(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Height (rows)</Label>
          <Input type="text" readOnly className="h-8 font-mono text-xs opacity-40 cursor-default" value={approxRows} />
        </div>
      </div>
      <FieldRow label="Responsive fit">
        <Switch checked={responsiveFit} onCheckedChange={setResponsiveFit} />
      </FieldRow>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Conversion                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

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

  return (
    <SectionCard title="Conversion">
      <SliderField label="Columns" value={columns} min={40} max={300} step={1} onChange={setColumns} />
      <SliderField label="Threshold" value={threshold} min={-100} max={100} step={1} onChange={setThreshold} />
      <FieldRow label="Invert brightness">
        <Switch checked={invert} onCheckedChange={setInvert} />
      </FieldRow>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Character set</Label>
        {/* 5 items visible, scroll for rest */}
        <Select value={charsetPresetId ?? "__custom__"}
          onValueChange={(id) => { if (id !== "__custom__") setCharsetPreset(id); }}>
          <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Select preset…" /></SelectTrigger>
          <SelectContent className="max-h-[168px]">
            {ASCII_CHAR_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                <span className="font-medium">{p.label}</span>
                <span className="font-mono text-muted-foreground/60 text-[10px] ml-2 max-w-[100px] truncate">
                  {p.chars.replace(/^\s+/, "").slice(0, 16)}
                </span>
              </SelectItem>
            ))}
            {!charsetPresetId && <SelectItem value="__custom__" className="text-xs">Custom</SelectItem>}
          </SelectContent>
        </Select>
        <Input value={charset} onChange={(e) => setCharset(e.target.value)}
          spellCheck={false} autoComplete="off" className="h-8 font-mono text-xs"
          placeholder="darkest → brightest chars" />
      </div>
    </SectionCard>
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

  const isBold = appearance.fontWeight === "bold" || appearance.fontWeight === 700 || appearance.fontWeight === "700";
  const fontId = ASCII_FONT_PRESETS.find((f) => f.value === appearance.fontFamily)?.id ?? ASCII_FONT_PRESETS[0]?.id ?? "";

  return (
    <SectionCard title="Appearance">
      {/* ── Typography ── */}
      <SubGroup label="Typography">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Font family</Label>
          {/* 5 fonts visible */}
          <Select value={fontId} onValueChange={(id) => {
            const preset = ASCII_FONT_PRESETS.find((f) => f.id === id);
            if (preset) { loadGoogleFont(id); patchAppearance({ fontFamily: preset.value }); }
          }}>
            <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-[168px]">
              {ASCII_FONT_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  <span style={{ fontFamily: p.value }}>{p.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FieldRow label="Style">
          <div className="flex items-center rounded-md border border-border overflow-hidden">
            <Toggle pressed={isBold} onPressedChange={(v) => patchAppearance({ fontWeight: v ? "bold" : "normal" })}
              className="rounded-none border-0 h-8 w-10 data-[state=on]:bg-secondary">
              <Bold className="size-3.5" />
            </Toggle>
            <div className="w-px h-5 bg-border" />
            <Toggle pressed={appearance.fontStyle === "italic"} onPressedChange={(v) => patchAppearance({ fontStyle: v ? "italic" : "normal" })}
              className="rounded-none border-0 h-8 w-10 data-[state=on]:bg-secondary">
              <Italic className="size-3.5" />
            </Toggle>
          </div>
        </FieldRow>

        <SliderField label="Size" value={appearance.fontSize} min={4} max={24} step={0.5}
          onChange={(v) => patchAppearance({ fontSize: v })} display={`${appearance.fontSize.toFixed(1)}px`} />
        <SliderField label="Line height" value={appearance.lineHeight} min={0.5} max={1.6} step={0.01}
          onChange={(v) => patchAppearance({ lineHeight: v })} display={appearance.lineHeight.toFixed(2)} />
        <SliderField label="Letter spacing" value={appearance.letterSpacing} min={-0.5} max={1} step={0.01}
          onChange={(v) => patchAppearance({ letterSpacing: v })} display={appearance.letterSpacing.toFixed(2)} />
      </SubGroup>

      {/* ── Colors ── */}
      <SubGroup label="Colors">
        <ColorField label="Background" value={appearance.backgroundColor}
          onChange={(v) => patchAppearance({ backgroundColor: v })} />
        <ColorField label="Text" value={appearance.textColor}
          onChange={(v) => patchAppearance({ textColor: v })} />
        <FieldRow label="Use source colors">
          <Switch checked={appearance.useColors} onCheckedChange={(v) => patchAppearance({ useColors: v })} />
        </FieldRow>
      </SubGroup>

      {/* ── Canvas ── */}
      <SubGroup label="Canvas">
        <SliderField label="Corner radius" value={appearance.borderRadius} min={0} max={24} step={1}
          onChange={(v) => patchAppearance({ borderRadius: v })} display={`${appearance.borderRadius}px`} />
        <FieldRow label="Frame counter">
          <Switch checked={appearance.showFrameCounter} onCheckedChange={(v) => patchAppearance({ showFrameCounter: v })} />
        </FieldRow>
      </SubGroup>

      {/* ── Effects ── */}
      <SubGroup label="Effects">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Text effect</Label>
          <Select value={appearance.textEffect} onValueChange={(v) => patchAppearance({ textEffect: v as ASCIITextEffect })}>
            <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
            {/* All 8 effects, 5 visible */}
            <SelectContent className="max-h-[168px]">
              {TEXT_EFFECTS.map((e) => (
                <SelectItem key={e.value} value={e.value} className="text-xs">{e.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {appearance.textEffect !== "none" && (
          <SliderField label="Intensity" value={appearance.textEffectThreshold} min={0} max={1} step={0.01}
            onChange={(v) => patchAppearance({ textEffectThreshold: v })} display={appearance.textEffectThreshold.toFixed(2)} />
        )}
      </SubGroup>

      <Button variant="outline" size="sm" className="w-full gap-2 text-xs"
        onClick={() => patchAppearance(DEFAULT_ASCII_APPEARANCE)}>
        <RotateCcw className="size-3.5" />
        Reset to defaults
      </Button>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Export                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function ExportSection() {
  const { canvasRef, registerExportHandler, isExporting, setIsExporting } = useStudio();
  const source = useAsciiStore((s) => s.source);
  const appearance = useAsciiStore((s) => s.appearance);
  const mode = useAsciiStore((s) => s.mode);

  const [filename, setFilename] = useState("");
  const [progress, setProgress] = useState(0);
  const [exportResult, setExportResult] = useState<ExportResult>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stem = () => filename.trim() || source?.file?.name?.replace(/\.[^.]+$/, "") || "ascii";

  const downloadPNG = useCallback(async () => {
    const dataUrl = canvasRef.current?.exportPNG();
    if (!dataUrl) { toast.error("Nothing to export yet"); return; }
    const filename = `${stem()}.png`;
    // Trigger download then show popup
    setExportResult({ kind: "png", dataUrl, filename });
  }, [canvasRef, filename]);

  const copyText = useCallback(async () => {
    const text = canvasRef.current?.getFrameText() ?? "";
    if (!text) { toast.error("Nothing to copy yet"); return; }
    try { await navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }
    catch { toast.error("Clipboard access denied"); }
  }, [canvasRef]);

  const exportZip = useCallback(async () => {
    if (!source || source.kind !== "video") { toast.error("Load a video first"); return; }
    if (isExporting) return;
    setIsExporting(true); setProgress(0);
    const ctrl = new AbortController(); abortRef.current = ctrl;
    try {
      const frames = (await canvasRef.current?.getFrames(
        (done, total) => setProgress(Math.round((done / total) * 100)), ctrl.signal,
      )) ?? [];
      if (!frames.length) { toast.error("No frames captured"); return; }
      const zip = new JSZip();
      const pad = String(frames.length).length;
      frames.forEach((f, i) => zip.file(`frame-${String(i).padStart(pad, "0")}.txt`, f));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${stem()}.zip`);
      URL.revokeObjectURL(url);
      setExportResult({ kind: "zip", frameCount: frames.length, filename: `${stem()}.zip` });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Export failed"); }
    finally { setIsExporting(false); setProgress(0); abortRef.current = null; }
  }, [canvasRef, filename, isExporting, setIsExporting, source]);

  const exportComponent = useCallback(async () => {
    if (!source) { toast.error("Load a file first"); return; }
    if (isExporting) return;
    setIsExporting(true); setProgress(0);
    try {
      const frames = (await canvasRef.current?.getFrames(
        (done, total) => setProgress(Math.round((done / total) * 100)),
      )) ?? [];
      const code = buildAnimationComponentSource(frames, {
        fps: 24, fontFamily: appearance.fontFamily, fontSize: appearance.fontSize,
        lineHeight: appearance.lineHeight, letterSpacing: appearance.letterSpacing,
        backgroundColor: appearance.backgroundColor, textColor: appearance.textColor,
        fontWeight: appearance.fontWeight, fontStyle: appearance.fontStyle,
      });
      setExportResult({ kind: "component", code, filename: `${stem()}.tsx` });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setIsExporting(false); setProgress(0); }
  }, [appearance, canvasRef, filename, isExporting, setIsExporting, source]);

  useEffect(() => {
    const h = mode === "image" ? downloadPNG : mode === "video" ? exportZip : exportComponent;
    registerExportHandler(h);
    return () => registerExportHandler(null);
  }, [mode, downloadPNG, exportZip, exportComponent, registerExportHandler]);

  return (
    <>
      <SectionCard title="Export">
        <Input placeholder="filename (optional)" value={filename}
          onChange={(e) => setFilename(e.target.value)} className="h-8 text-xs" />

        {/* Fixed height progress row */}
        <div className="h-4">
          {isExporting && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{progress}%</span>
              <button type="button" className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => abortRef.current?.abort()}>Cancel</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={copyText} disabled={isExporting}>
            <Copy className="size-3.5" /> Copy text
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={downloadPNG} disabled={isExporting || !source}>
            <ImageDown className="size-3.5" /> Save PNG
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={exportZip}
            disabled={isExporting || !source || source.kind !== "video"}>
            <Film className="size-3.5" /> Frames ZIP
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={exportComponent} disabled={isExporting || !source}>
            <FileCode2 className="size-3.5" /> Component
          </Button>
        </div>
      </SectionCard>

      {/* Export result popup */}
      <ExportResultDialog result={exportResult} onClose={() => setExportResult(null)} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Root                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export function LeftSidebar({ previewRef }: { previewRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="flex flex-col gap-3 p-3 pb-6">
      <SourceSection />
      <CanvasSection previewRef={previewRef} />
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
    return { kind: "image", el: img, file, url, width: img.naturalWidth, height: img.naturalHeight };
  }
  if (file.type.startsWith("video/")) {
    const video = await loadVideo(url);
    return { kind: "video", el: video, file, url, width: video.videoWidth, height: video.videoHeight,
      durationMs: Number.isFinite(video.duration) ? video.duration * 1000 : 0 };
  }
  URL.revokeObjectURL(url);
  throw new Error("Unsupported file type");
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; img.decoding = "async";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Failed to load image"));
    img.src = url;
  });
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((res, rej) => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous"; v.muted = true; v.playsInline = true;
    v.loop = true; v.preload = "auto";
    v.onloadedmetadata = () => requestAnimationFrame(() => res(v));
    v.onerror = () => rej(new Error("Failed to load video"));
    v.src = url;
  });
}

function triggerDownload(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href; a.download = name; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
}

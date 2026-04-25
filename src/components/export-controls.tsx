"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Download, FileCode2, ImageDown } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAsciiStore } from "@/lib/store";
import { useStudio } from "@/lib/studio-context";
import { buildAnimationComponentSource } from "@/lib/component-export";

export function ExportControls() {
  const mode = useAsciiStore((s) => s.mode);

  return (
    <div className="flex flex-col gap-4">
      {mode === "image" && <ImageExport />}
      {mode === "video" && <VideoExport />}
      {mode === "component" && <ComponentExport />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Image                                                                      */
/* -------------------------------------------------------------------------- */

function ImageExport() {
  const { canvasRef, registerExportHandler } = useStudio();
  const source = useAsciiStore((s) => s.source);

  const handleDownloadPNG = useCallback(() => {
    const url = canvasRef.current?.exportPNG();
    if (!url) {
      toast.error("Nothing to export yet");
      return;
    }
    triggerDownload(url, makeFileName(source?.file?.name, "ascii", "png"));
    toast.success("Saved PNG");
  }, [canvasRef, source]);

  const handleCopyText = useCallback(async () => {
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

  useEffect(() => {
    registerExportHandler(handleDownloadPNG);
    return () => registerExportHandler(null);
  }, [registerExportHandler, handleDownloadPNG]);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="default" onClick={handleDownloadPNG} className="w-full">
        <ImageDown className="mr-1.5 size-3.5" /> Download PNG
      </Button>
      <Button variant="outline" onClick={handleCopyText} className="w-full">
        <Copy className="mr-1.5 size-3.5" /> Copy text
      </Button>
      <p className="mt-1 text-[11px] text-muted-foreground">
        PNG is a snapshot of the rendered canvas. Plain-text copy preserves the
        raw ASCII grid for pasting into Markdown, code, or chat.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Video                                                                      */
/* -------------------------------------------------------------------------- */

function VideoExport() {
  const { canvasRef, registerExportHandler, isExporting, setIsExporting } =
    useStudio();
  const source = useAsciiStore((s) => s.source);
  const totalFrames = useAsciiStore((s) => s.totalFrames);

  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const handleExport = useCallback(async () => {
    if (!source || source.kind !== "video") {
      toast.error("Load a video first");
      return;
    }
    if (isExporting) return;
    setIsExporting(true);
    setProgress(0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const frames =
        (await canvasRef.current?.getFrames(
          (done, total) => setProgress(Math.round((done / total) * 100)),
          controller.signal,
        )) ?? [];

      if (frames.length === 0) {
        toast.error("No frames captured");
        return;
      }

      const zip = new JSZip();
      const pad = String(frames.length).length;
      frames.forEach((frame, i) => {
        zip.file(`frame-${String(i).padStart(pad, "0")}.txt`, frame);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, makeFileName(source.file?.name, "ascii-frames", "zip"));
      URL.revokeObjectURL(url);
      toast.success(`Exported ${frames.length} frames`);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Frame export failed",
      );
    } finally {
      setIsExporting(false);
      setProgress(0);
      abortRef.current = null;
    }
  }, [canvasRef, source, isExporting, setIsExporting]);

  useEffect(() => {
    registerExportHandler(handleExport);
    return () => registerExportHandler(null);
  }, [registerExportHandler, handleExport]);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-muted-foreground">
        {totalFrames || 0} frames at the current 24&nbsp;fps assumption.
      </div>
      <Button onClick={handleExport} disabled={isExporting} className="w-full">
        <Download className="mr-1.5 size-3.5" />
        {isExporting ? `Exporting... ${progress}%` : "Export frames as ZIP"}
      </Button>
      {isExporting && (
        <div className="flex flex-col gap-1.5">
          <Progress value={progress} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => abortRef.current?.abort()}
          >
            Cancel
          </Button>
        </div>
      )}
      <p className="text-[11px] text-muted-foreground">
        Each frame becomes a `.txt` file inside the ZIP. Combine with your
        favourite renderer or feed back into the Component export.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function ComponentExport() {
  const { canvasRef, registerExportHandler, isExporting, setIsExporting } =
    useStudio();
  const source = useAsciiStore((s) => s.source);
  const appearance = useAsciiStore((s) => s.appearance);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async () => {
    if (!source) {
      toast.error("Load an image or video first");
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
      const src = buildAnimationComponentSource(frames, {
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
      setCode(src);
      setOpen(true);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, [appearance, canvasRef, isExporting, setIsExporting, source]);

  useEffect(() => {
    registerExportHandler(generate);
    return () => registerExportHandler(null);
  }, [registerExportHandler, generate]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied component source");
    } catch {
      toast.error("Clipboard access denied");
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Bundles the current frames into a self-contained{" "}
        <code className="font-mono">{`<ASCIIAnimation />`}</code> React
        component. Drop the source into any React project; no extra deps.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={generate} disabled={isExporting} className="w-full">
            <FileCode2 className="mr-1.5 size-3.5" />
            {isExporting ? `Generating... ${progress}%` : "Generate component"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[min(900px,calc(100vw-2rem))]">
          <DialogHeader>
            <DialogTitle>Generated component</DialogTitle>
            <DialogDescription>
              Copy this into{" "}
              <code className="font-mono">components/ascii-animation.tsx</code>{" "}
              and render it anywhere.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 min-h-0">
            <Label className="text-xs text-muted-foreground">Source</Label>
            <pre className="max-h-[55vh] overflow-auto rounded-md border border-border bg-background/60 p-3 font-mono text-xs leading-relaxed">
              {code}
            </pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={copyCode}>
              <Copy className="mr-1.5 size-3.5" /> Copy source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isExporting && <Progress value={progress} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function makeFileName(
  original: string | undefined,
  fallback: string,
  ext: string,
): string {
  const base = (original ?? fallback).replace(/\.[^.]+$/, "");
  return `${base || fallback}.${ext}`;
}

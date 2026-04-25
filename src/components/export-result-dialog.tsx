"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ExportResult =
  | { kind: "png"; dataUrl: string; filename: string }
  | { kind: "zip"; frameCount: number; filename: string }
  | { kind: "component"; code: string; filename: string }
  | null;

interface Props {
  result: ExportResult;
  onClose: () => void;
}

const TITLES: Record<string, string> = {
  png: "Image exported",
  zip: "Frames exported",
  component: "React component",
};

const KICKERS: Record<string, string> = {
  png: "01 / Plate",
  zip: "02 / Sequence",
  component: "03 / Module",
};

export function ExportResultDialog({ result, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (result?.kind !== "component") return;
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadComponent = () => {
    if (result?.kind !== "component") return;
    const blob = new Blob([result.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (result?.kind !== "png") return;
    const a = document.createElement("a");
    a.href = result.dataUrl;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Dialog open={result !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={
          result?.kind === "component"
            ? "max-w-[calc(100vw-2rem)] md:max-w-3xl"
            : "max-w-[calc(100vw-2rem)] md:max-w-md"
        }
      >
        <DialogHeader>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {result ? KICKERS[result.kind] : ""}
          </p>
          <DialogTitle>{result ? TITLES[result.kind] : ""}</DialogTitle>
        </DialogHeader>

        {/* ── PNG ── */}
        {result?.kind === "png" && (
          <div className="space-y-2">
            <div className="border border-border">
              <div
                className="relative"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(var(--muted) 0% 25%, transparent 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              >
                <img
                  src={result.dataUrl}
                  alt="Exported PNG"
                  className="relative max-h-72 w-full object-contain"
                />
              </div>
            </div>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {result.filename}
            </p>
          </div>
        )}

        {/* ── ZIP ── */}
        {result?.kind === "zip" && (
          <div className="space-y-2">
            <div className="border border-border bg-secondary/30 py-10 text-center">
              <p className="font-heading text-6xl font-black tabular-nums leading-none text-foreground">
                {result.frameCount}
              </p>
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Frames · Text Files
              </p>
            </div>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {result.filename}
            </p>
          </div>
        )}

        {/* ── Component ── */}
        {result?.kind === "component" && (
          <div className="min-w-0 space-y-2 overflow-hidden">
            <div className="min-w-0 overflow-hidden border border-border">
              <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-1.5">
                <span className="truncate font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {result.filename}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleCopyCode}
                    className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  >
                    {copied ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleDownloadComponent}
                    className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  >
                    <Download className="size-3" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="max-h-96 max-w-full overflow-auto whitespace-pre bg-muted/40 p-4 font-mono text-[11px] leading-relaxed text-foreground">
                <code>{result.code}</code>
              </pre>
            </div>
          </div>
        )}

        <DialogFooter showCloseButton>
          {result?.kind === "png" && (
            <Button size="sm" onClick={handleDownloadPng} className="gap-2">
              <Download className="size-3.5" />
              Download PNG
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

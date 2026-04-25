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

  const titles: Record<string, string> = {
    png: "Image exported",
    zip: "Frames exported",
    component: "React component",
  };

  return (
    <Dialog open={result !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={
          result?.kind === "component"
            ? "sm:max-w-2xl"
            : "sm:max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle>{result ? titles[result.kind] : ""}</DialogTitle>
        </DialogHeader>

        {/* ── PNG ── */}
        {result?.kind === "png" && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
              {/* checkerboard for transparency */}
              <div
                className="relative"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%)",
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
            <p className="font-mono text-xs text-muted-foreground text-center">
              {result.filename}
            </p>
          </div>
        )}

        {/* ── ZIP ── */}
        {result?.kind === "zip" && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/20 py-8 text-center">
              <p className="font-mono text-5xl font-bold text-primary">
                {result.frameCount}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                frames exported as text files
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground text-center">
              {result.filename}
            </p>
          </div>
        )}

        {/* ── Component ── */}
        {result?.kind === "component" && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {result.filename}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1.5 px-2 text-xs"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="size-3 text-green-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1.5 px-2 text-xs"
                    onClick={handleDownloadComponent}
                  >
                    <Download className="size-3" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="max-h-96 overflow-auto bg-muted/10 p-4 text-[11px] font-mono leading-relaxed text-foreground/85">
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

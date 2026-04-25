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
  | { kind: "image"; filename: string }
  | { kind: "video"; frameCount: number; durationSec: number; filename: string }
  | { kind: "component"; code: string; filename: string }
  | null;

interface Props {
  result: ExportResult;
  onClose: () => void;
}

const TITLES: Record<string, string> = {
  image: "Image exported",
  video: "Video exported",
  component: "React component",
};

const KICKERS: Record<string, string> = {
  image: "01 / Plate",
  video: "02 / Sequence",
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

        {/* ── IMAGE ── */}
        {result?.kind === "image" && (
          <div className="space-y-2">
            <div className="border border-border bg-secondary/20 py-10 text-center">
              <p className="font-heading text-5xl font-black tracking-tight text-foreground">
                SAVED
              </p>
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                PNG Download Complete
              </p>
            </div>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {result.filename}
            </p>
          </div>
        )}

        {/* ── VIDEO ── */}
        {result?.kind === "video" && (
          <div className="space-y-2">
            <div className="border border-border bg-secondary/30 py-10 text-center">
              <p className="font-heading text-6xl font-black tabular-nums leading-none text-foreground">
                {result.frameCount}
              </p>
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Frames · {result.durationSec.toFixed(2)}s · WEBM
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

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

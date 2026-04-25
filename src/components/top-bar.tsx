"use client";

import { Download, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAsciiStore, type StudioMode } from "@/lib/store";
import { useStudio } from "@/lib/studio-context";

const MODES: { value: StudioMode; label: string }[] = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "component", label: "Component" },
];

export function TopBar() {
  const mode = useAsciiStore((s) => s.mode);
  const setMode = useAsciiStore((s) => s.setMode);
  const sourceKind = useAsciiStore((s) => s.source?.kind);

  const { requestExport, isExporting } = useStudio();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/40 px-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md bg-foreground text-background">
          <Sparkles className="size-4" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Glyphcast</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            ASCII studio
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as StudioMode)}
        >
          <TabsList>
            {MODES.map((m) => (
              <TabsTrigger
                key={m.value}
                value={m.value}
                disabled={m.value === "video" && sourceKind !== "video"}
              >
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button onClick={requestExport} disabled={isExporting} size="sm">
          <Download className="mr-1.5 size-3.5" />
          Export
        </Button>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageDown, Film, Code2, FileArchive, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAsciiStore } from "@/lib/store";
import { useStudio, type ExportActionName } from "@/lib/studio-context";
import { STUDIO_FIELD_MONO_CLASS, STUDIO_TEXT_LABEL } from "@/lib/studio-theme";
import { cn } from "@/lib/utils";

type ModalFormat = "image" | "video" | "component" | "zip";

const MODAL_FORMATS: {
  id: ModalFormat;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}[] = [
  {
    id: "image",
    label: "Image",
    subtitle: "Export a static PNG",
    icon: ImageDown,
  },
  {
    id: "video",
    label: "Video",
    subtitle: "Export animated MP4 (video/GIF)",
    icon: Film,
  },
  {
    id: "component",
    label: "React Component",
    subtitle: "Export as a .tsx file",
    icon: Code2,
  },
  {
    id: "zip",
    label: "ZIP Archive",
    subtitle: "All frames as plain text files",
    icon: FileArchive,
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 30,
      opacity: { duration: 0.15 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 8,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const exportFilename = useAsciiStore((s) => s.exportFilename);
  const setExportFilename = useAsciiStore((s) => s.setExportFilename);
  const source = useAsciiStore((s) => s.source);
  const setMode = useAsciiStore((s) => s.setMode);

  const { requestExportAction, isExporting } = useStudio();

  const [selectedFormat, setSelectedFormat] = useState<ModalFormat>("image");

  const isVideoDisabled =
    !source || (source.kind !== "video" && source.kind !== "gif");

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleExport() {
    if (selectedFormat === "video") setMode("video");
    else if (selectedFormat === "component") setMode("component");
    else setMode("image");
    onClose();
    const actionMap: Record<ModalFormat, ExportActionName> = {
      image: "image",
      video: "video",
      component: "component",
      zip: "zip",
    };
    setTimeout(() => requestExportAction(actionMap[selectedFormat]), 150);
  }

  function handleCopy() {
    onClose();
    setTimeout(() => requestExportAction("copy"), 150);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="export-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] px-4"
          onClick={onClose}
        >
          <motion.div
            key="export-modal-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-sm flex flex-col overflow-hidden",
              "rounded-2xl",
              "bg-white dark:bg-zinc-900",
              "border border-[#E5E5E5] dark:border-zinc-700",
              "shadow-[0px_24px_48px_rgba(0,0,0,0.18),0px_8px_16px_rgba(0,0,0,0.10)]",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-zinc-800">
              <h2 className="font-sans text-sm font-semibold tracking-wide text-[#111] dark:text-zinc-100">
                Export
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-7 items-center justify-center rounded-md text-[#888] dark:text-zinc-400 hover:bg-[#F9FAFC] dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-5 px-5 py-5">
              {/* File name */}
              <div className="space-y-1.5">
                <span
                  className={cn(
                    "font-mono text-[9px] font-semibold uppercase tracking-widest",
                    STUDIO_TEXT_LABEL,
                  )}
                >
                  File Name
                </span>
                <Input
                  placeholder="filename (optional)"
                  value={exportFilename}
                  onChange={(e) => setExportFilename(e.target.value)}
                  className={STUDIO_FIELD_MONO_CLASS}
                />
              </div>

              {/* Format selection */}
              <div className="space-y-1.5">
                <span
                  className={cn(
                    "font-mono text-[9px] font-semibold uppercase tracking-widest",
                    STUDIO_TEXT_LABEL,
                  )}
                >
                  How do you want to export?
                </span>
                <div className="flex flex-col gap-1.5">
                  {MODAL_FORMATS.map(({ id, label, subtitle, icon: Icon }) => {
                    const disabled = id === "video" && isVideoDisabled;
                    const selected = selectedFormat === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setSelectedFormat(id)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all",
                          "border",
                          selected
                            ? "border-[#B54B00] bg-[#FFF5ED] dark:bg-[#B54B00]/10 dark:border-[#B54B00]"
                            : "border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#B54B00]/40",
                          disabled && "opacity-40 cursor-not-allowed",
                        )}
                      >
                        {/* Radio dot */}
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            selected
                              ? "border-[#B54B00]"
                              : "border-[#D6D6D6] dark:border-zinc-600",
                          )}
                        >
                          {selected && (
                            <span className="size-2 rounded-full bg-[#B54B00]" />
                          )}
                        </span>

                        {/* Icon box */}
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            selected
                              ? "bg-[#B54B00]/15 text-[#B54B00]"
                              : "bg-[#F9FAFC] dark:bg-zinc-700 text-[#888] dark:text-zinc-400",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>

                        {/* Label + subtitle */}
                        <span className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className={cn(
                              "font-sans text-xs font-semibold",
                              selected
                                ? "text-[#B54B00]"
                                : "text-[#111] dark:text-zinc-100",
                            )}
                          >
                            {label}
                          </span>
                          <span className="font-sans text-[10px] text-[#888] dark:text-zinc-400 leading-tight">
                            {subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 px-5 pb-5">
              {/* Copy Code */}
              <Button
                type="button"
                variant="landing"
                size="sm"
                onClick={handleCopy}
                disabled={isExporting}
                className="w-full h-9 rounded-full font-sans text-[11px] font-semibold tracking-wide text-[#B54B00] gap-2"
              >
                <Copy className="size-3.5" />
                Copy Code
              </Button>

              {/* Cancel + Export */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="flex-1 h-9 rounded-full font-sans text-[11px] font-semibold tracking-wide border-[#E5E5E5] dark:border-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="landingBlue"
                  size="sm"
                  onClick={handleExport}
                  disabled={
                    isExporting ||
                    !source ||
                    (selectedFormat === "video" && isVideoDisabled)
                  }
                  className="flex-1 h-9 rounded-full font-sans text-[11px] font-semibold tracking-wide"
                >
                  Export
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import type { AsciiCanvasHandle } from "@/components/ascii-canvas";

export type ExportHandler = () => void | Promise<void>;

interface StudioContextValue {
  canvasRef: RefObject<AsciiCanvasHandle | null>;
  requestExport: () => void;
  registerExportHandler: (handler: ExportHandler | null) => void;
  isExporting: boolean;
  setIsExporting: (b: boolean) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<AsciiCanvasHandle | null>(null);
  const exportHandlerRef = useRef<ExportHandler | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const requestExport = useCallback(() => {
    const handler = exportHandlerRef.current;
    if (handler) void handler();
  }, []);

  const registerExportHandler = useCallback((handler: ExportHandler | null) => {
    exportHandlerRef.current = handler;
  }, []);

  const value = useMemo<StudioContextValue>(
    () => ({
      canvasRef,
      requestExport,
      registerExportHandler,
      isExporting,
      setIsExporting,
    }),
    [requestExport, registerExportHandler, isExporting],
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio must be used within <StudioProvider>");
  }
  return ctx;
}

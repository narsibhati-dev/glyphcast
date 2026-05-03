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
export type ExportActionName = "image" | "video" | "component" | "json";
export type ExportActionMap = Partial<Record<ExportActionName, ExportHandler>>;

interface StudioContextValue {
  canvasRef: RefObject<AsciiCanvasHandle | null>;
  requestExport: () => void;
  registerExportHandler: (handler: ExportHandler | null) => void;
  requestExportAction: (name: ExportActionName) => void;
  registerExportActions: (actions: ExportActionMap | null) => void;
  isExporting: boolean;
  setIsExporting: (b: boolean) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<AsciiCanvasHandle | null>(null);
  const exportHandlerRef = useRef<ExportHandler | null>(null);
  const exportActionsRef = useRef<ExportActionMap>({});
  const [isExporting, setIsExporting] = useState(false);

  const requestExport = useCallback(() => {
    const handler = exportHandlerRef.current;
    if (handler) void handler();
  }, []);

  const registerExportHandler = useCallback((handler: ExportHandler | null) => {
    exportHandlerRef.current = handler;
  }, []);

  const requestExportAction = useCallback((name: ExportActionName) => {
    const handler = exportActionsRef.current[name];
    if (handler) void handler();
  }, []);

  const registerExportActions = useCallback(
    (actions: ExportActionMap | null) => {
      exportActionsRef.current = actions ?? {};
    },
    [],
  );

  const value = useMemo<StudioContextValue>(
    () => ({
      canvasRef,
      requestExport,
      registerExportHandler,
      requestExportAction,
      registerExportActions,
      isExporting,
      setIsExporting,
    }),
    [
      requestExport,
      registerExportHandler,
      requestExportAction,
      registerExportActions,
      isExporting,
    ],
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

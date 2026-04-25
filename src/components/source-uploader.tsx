"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Film, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAsciiStore, type StudioSource } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAX_BYTES = 100 * 1024 * 1024;

export function SourceUploader() {
  const source = useAsciiStore((s) => s.source);
  const setSource = useAsciiStore((s) => s.setSource);
  const clearSource = useAsciiStore((s) => s.clearSource);

  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const sourceRef = useRef(source);
  // Keep the ref in sync without touching it during render.
  useEffect(() => {
    sourceRef.current = source;
  });

  const onDrop = useCallback(
    async (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const message = rejected[0].errors[0]?.message ?? "File was rejected";
        toast.error(message);
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
        console.error(err);
        toast.error(
          err instanceof Error ? err.message : "Could not load that file",
        );
      }
    },
    [setSource],
  );

  const thumbnail =
    source?.kind === "image" ? source.url : videoThumbnail;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: false,
    maxSize: MAX_BYTES,
  });

  // Capture a poster image for video sources. Image sources are derived above.
  useEffect(() => {
    if (source?.kind !== "video") return;
    let cancelled = false;
    void captureVideoThumbnail(source.el as HTMLVideoElement).then((data) => {
      if (!cancelled) setVideoThumbnail(data);
    });
    return () => {
      cancelled = true;
    };
  }, [source]);

  // Revoke the object URL on unmount so we don't leak blob references.
  useEffect(() => {
    return () => {
      if (sourceRef.current?.url) URL.revokeObjectURL(sourceRef.current.url);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Source
      </h2>

      <div
        {...getRootProps()}
        className={cn(
          "rounded-lg border border-dashed border-border bg-card/40 px-3 py-6 text-center text-sm cursor-pointer transition-colors",
          "hover:border-foreground/40 hover:bg-card/70",
          isDragActive && "border-primary bg-primary/5 text-foreground",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 size-5 text-muted-foreground" />
        <p className="text-foreground/90 font-medium">
          {isDragActive ? "Drop to load" : "Drop image or video"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, GIF, MP4, WebM &middot; up to 100&nbsp;MB
        </p>
      </div>

      {source ? (
        <Card className="flex flex-col gap-3 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {source.kind === "image" ? (
                <ImageIcon className="size-3.5" />
              ) : (
                <Film className="size-3.5" />
              )}
              <span className="uppercase tracking-wide">{source.kind}</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove source"
              onClick={() => {
                if (source.url) URL.revokeObjectURL(source.url);
                clearSource();
                setVideoThumbnail(null);
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-background">
            {thumbnail ? (
              // Plain <img> so a blob/data URL works without next/image config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={source.file?.name ?? "Source thumbnail"}
                className="w-full max-h-40 object-contain"
              />
            ) : (
              <div className="h-32 grid place-items-center text-xs text-muted-foreground">
                Loading preview...
              </div>
            )}
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="truncate" title={source.file?.name ?? "Sample"}>
              {source.file?.name ?? "Sample"}
            </dd>
            <dt className="text-muted-foreground">Size</dt>
            <dd>{formatBytes(source.file?.size ?? 0)}</dd>
            <dt className="text-muted-foreground">Resolution</dt>
            <dd>
              {source.width} x {source.height}
            </dd>
            {source.kind === "video" && (
              <>
                <dt className="text-muted-foreground">Duration</dt>
                <dd>{formatDuration(source.durationMs ?? 0)}</dd>
              </>
            )}
          </dl>
        </Card>
      ) : null}
    </div>
  );
}

async function loadSourceFromFile(file: File): Promise<StudioSource> {
  const url = URL.createObjectURL(file);
  if (file.type.startsWith("image/")) {
    const img = await loadImageElement(url);
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
    const video = await loadVideoElement(url);
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

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

function loadVideoElement(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    video.onloadedmetadata = () => {
      // Some browsers need a tick to populate dimensions properly.
      requestAnimationFrame(() => resolve(video));
    };
    video.onerror = () => reject(new Error("Failed to load video"));
    video.src = url;
  });
}

async function captureVideoThumbnail(
  video: HTMLVideoElement,
): Promise<string | null> {
  if (!video.videoWidth || !video.videoHeight) return null;
  const canvas = document.createElement("canvas");
  const maxW = 320;
  const ratio = video.videoHeight / video.videoWidth;
  canvas.width = Math.min(maxW, video.videoWidth);
  canvas.height = Math.round(canvas.width * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  try {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.min(units.length - 1, Math.floor(Math.log10(bytes) / 3));
  return `${(bytes / 10 ** (exp * 3)).toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

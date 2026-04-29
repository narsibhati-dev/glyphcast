"use client";

import { Monitor } from "lucide-react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { siteConfig } from "@/lib/site";

export function DesktopOnlyGate({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return null;

  if (!isDesktop) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-zinc-950 px-6 text-center font-satoshi">
        <div
          className="flex size-16 items-center justify-center rounded-2xl"
          style={{
            background:
              "radial-gradient(152.32% 683.53% at 108.86% 152.32%, #FFD9B8 0%, #FFF5ED 100%)",
            boxShadow:
              "0px 4px 24px rgba(181, 75, 0, 0.25), inset 0px 2px 2.2px #FFFFFF",
          }}
        >
          <Monitor className="size-8 text-[#B54B00]" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-zinc-100">Desktop only</h1>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Please switch to a bigger screen and open {siteConfig.productName}{" "}
            Studio on a laptop or desktop.
          </p>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs text-zinc-600">
            Open this link on your laptop or desktop
          </p>
          <code className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-300">
            {typeof window !== "undefined"
              ? window.location.href
              : `${siteConfig.studioPath}`}
          </code>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

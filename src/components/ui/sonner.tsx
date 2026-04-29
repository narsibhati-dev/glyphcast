"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

function useDocumentDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const isDark = useDocumentDark();

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-3.5 text-emerald-400" />,
        info: <InfoIcon className="size-3.5 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-3.5 text-amber-400" />,
        error: <OctagonXIcon className="size-3.5 text-red-400" />,
        loading: (
          <Loader2Icon className="size-3.5 animate-spin text-zinc-400" />
        ),
      }}
      style={
        {
          "--normal-bg": isDark ? "#1C1C1F" : "#ffffff",
          "--normal-text": isDark ? "#F4F4F5" : "#111111",
          "--normal-border": isDark ? "#2E2E35" : "#E5E5E5",
          "--success-bg": isDark ? "#1C1C1F" : "#ffffff",
          "--success-text": isDark ? "#F4F4F5" : "#111111",
          "--success-border": isDark ? "#2E2E35" : "#E5E5E5",
          "--error-bg": isDark ? "#1C1C1F" : "#ffffff",
          "--error-text": isDark ? "#F4F4F5" : "#111111",
          "--error-border": isDark ? "#2E2E35" : "#E5E5E5",
          "--border-radius": "14px",
          "--toast-width": "340px",
          fontFamily: "var(--font-sans)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: [
            "shadow-xl border px-4 py-3.5 gap-3",
            isDark
              ? "bg-[#1C1C1F] border-[#2E2E35] text-zinc-100 shadow-black/50"
              : "bg-white border-[#E5E5E5] text-[#111111] shadow-black/8",
          ].join(" "),
          title: "text-sm font-medium leading-snug",
          description: "text-xs leading-relaxed mt-0.5",
          closeButton: [
            "!border rounded-full !size-5 transition-colors",
            isDark
              ? "!bg-zinc-800 !border-zinc-700 hover:!bg-zinc-700 !text-zinc-400"
              : "!bg-zinc-100 !border-zinc-200 hover:!bg-zinc-200 !text-zinc-500",
          ].join(" "),
          actionButton:
            "!bg-[#B54B00] !text-white hover:!bg-[#9E4200] !border-0 !rounded-lg !text-xs !font-medium !px-3 !h-7 !shadow-[inset_0px_1px_2px_rgba(255,255,255,0.15)]",
          icon: "mt-0.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

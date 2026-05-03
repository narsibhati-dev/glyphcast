"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/showcase", label: "Showcase" },
  { href: "/#pricing", label: "Pricing" },
] as const;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const barSurface = scrolled
    ? isDark
      ? "border-[#36363F]/95 bg-[#1C1C22]/88 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      : "border-black/8 bg-white/88 shadow-[0_8px_40px_rgba(0,0,0,0.09)] backdrop-blur-xl"
    : "border-transparent bg-transparent shadow-none backdrop-blur-none";

  return (
    <div className="landing-navbar-scroll fixed top-5 z-50 px-1 sm:px-0">
      <nav
        aria-label="Main"
        className={cn(
          "flex items-center justify-between gap-3 rounded-full border px-2 py-2 pl-3 transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3 sm:pl-4",
          barSurface,
        )}
      >
        <div className="flex min-w-0 shrink-0 items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B54B00]"
          >
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.productName} home`}
              width={48}
              height={48}
              priority
              unoptimized
              className="size-9 shrink-0 rounded-[11px] object-contain lg:size-11"
            />
            <span className="[font-family:var(--font-ascii-brand)] text-[15px] font-medium tracking-wide text-[#111] dark:text-zinc-100 lg:text-lg">
              {siteConfig.productName}
            </span>
          </Link>
        </div>

        {/* Center nav — desktop */}
        <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
          <div
            className={cn(
              "flex items-center rounded-full p-1 ring-1 transition-colors duration-300",
              scrolled
                ? isDark
                  ? "bg-white/6 ring-white/10"
                  : "bg-black/4 ring-black/6"
                : isDark
                  ? "bg-white/5 ring-white/8"
                  : "bg-black/3 ring-black/5",
            )}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/6 hover:text-foreground dark:text-[#B9BAC6] dark:hover:bg-white/10 dark:hover:text-[#F2F2F7]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative group/repo flex items-center justify-center">
              <div className="relative transition-transform duration-200 group-hover/repo:-translate-y-0.5">
                <Link
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 block w-fit"
                >
                  <Button
                    className="min-w-48 justify-center transition-all duration-200 hover:shadow-[0_10px_22px_rgba(181,75,0,0.2)]"
                    variant="landing"
                    size="landing"
                  >
                    Give us a star
                  </Button>
                </Link>
                <span className="pointer-events-none absolute -inset-1 rounded-[999px] border border-[#B54B00]/35 opacity-0 group-hover/repo:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            <Link href={siteConfig.studioPath} className="shrink-0">
              <Button
                className="group min-w-48 justify-center relative overflow-hidden transition-[padding] duration-200 hover:pr-10"
                variant="landingBlue"
                size="landing"
              >
                Open studio
                <ChevronRight className="w-4 absolute right-4 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
              isDark ? "hover:bg-white/10" : "hover:bg-black/6",
            )}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-nav"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-[22px]" strokeWidth={2} />
            ) : (
              <Menu className="size-[22px]" strokeWidth={2} />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div
          id="landing-mobile-nav"
          className={cn(
            "lg:hidden mt-3 overflow-hidden rounded-2xl border shadow-[0_16px_48px_rgba(0,0,0,0.15)] duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2",
            isDark
              ? "border-[#36363F] bg-[#1C1C22]/96 backdrop-blur-xl"
              : "border-black/8 bg-white/96 backdrop-blur-xl",
          )}
        >
          <p className="px-4 pt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#B54B00]">
            Navigate
          </p>
          <div className="flex flex-col gap-0.5 p-2 pt-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                  isDark
                    ? "text-[#E8E8F0] hover:bg-white/7"
                    : "text-[#111] hover:bg-black/5",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
          <div
            className={cn(
              "flex flex-col gap-2 border-t p-3",
              isDark ? "border-[#36363F]" : "border-black/6",
            )}
          >
            <div className="relative group/repo w-full">
              <div className="relative w-full transition-transform duration-200 group-hover/repo:-translate-y-0.5">
                <Link
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 block w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    className="w-full transition-all duration-200 hover:shadow-[0_10px_22px_rgba(181,75,0,0.2)]"
                    variant="landing"
                    size="landing"
                  >
                    Give us a star
                  </Button>
                </Link>
                <span className="pointer-events-none absolute -inset-1 rounded-[999px] border border-[#B54B00]/35 opacity-0 group-hover/repo:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            <Link
              href={siteConfig.studioPath}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                className="group w-full relative overflow-hidden transition-[padding] duration-200 hover:pr-10"
                variant="landingBlue"
                size="landing"
              >
                Open studio
                <ChevronRight className="w-4 absolute right-4 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;

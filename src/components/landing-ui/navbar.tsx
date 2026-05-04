"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "../ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { BRAND_LOGO_RADIUS_CLASS, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/showcase", label: "Showcase" },
  { href: "/#plans", label: "Plans" },
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
      ? "border-[#36363F]/95 bg-[#1C1C22]/88 shadow-[0_4px_20px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      : "border-black/8 bg-white/88 shadow-[0_3px_16px_rgba(0,0,0,0.055)] backdrop-blur-xl"
    : "border-transparent bg-transparent shadow-none backdrop-blur-none";

  return (
    <div className="landing-navbar-scroll fixed top-5 z-50 box-border max-w-full min-w-0 px-2 sm:px-0">
      <nav
        aria-label="Main"
        className={cn(
          "grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 rounded-full border px-2 py-2 transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-x-3 sm:px-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-4",
          barSurface,
        )}
      >
        {/* Brand — column 1 */}
        <div className="col-start-1 flex min-w-0 justify-self-start">
          <Link
            href="/"
            className="flex min-w-0 max-w-full items-center gap-2 rounded-full py-1 pr-1 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B54B00] sm:gap-2.5 sm:pr-2"
          >
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.productName} home`}
              width={48}
              height={48}
              priority
              unoptimized
              className={cn(
                "size-8 shrink-0 object-contain sm:size-9 lg:size-11",
                BRAND_LOGO_RADIUS_CLASS,
              )}
            />
            <span className="[font-family:var(--font-ascii-brand)] truncate text-[14px] font-medium tracking-wide text-[#111] dark:text-zinc-100 sm:text-[15px] lg:text-lg">
              {siteConfig.productName}
            </span>
          </Link>
        </div>

        {/* Center nav — column 2 on md+ (hidden on small screens without breaking grid) */}
        <div className="col-start-2 hidden justify-self-center px-0.5 sm:px-1 md:block md:row-start-1">
          <div
            className={cn(
              "flex max-w-full items-center rounded-full p-1 ring-1 transition-colors duration-300",
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
                className="shrink-0 rounded-full px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-black/6 hover:text-foreground sm:px-3 sm:text-sm dark:text-[#B9BAC6] dark:hover:bg-white/10 dark:hover:text-[#F2F2F7] lg:px-4"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions — column 2 on mobile, column 3 on md+ */}
        <div className="col-start-2 flex min-w-0 justify-end justify-self-end md:col-start-3">
          <div className="hidden min-w-0 items-center gap-1.5 lg:flex xl:gap-2">
            <div className="relative min-w-0 group/repo flex items-center justify-center">
              <div className="relative min-w-0 transition-transform duration-200 group-hover/repo:-translate-y-0.5">
                <Link
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block min-w-0 max-w-full"
                >
                  <Button
                    className="max-w-full justify-center px-3 py-2.5 text-[13px] transition-all duration-200 hover:shadow-[0_10px_22px_rgba(181,75,0,0.2)] xl:px-5.5 xl:py-3.5 xl:text-sm"
                    variant="landing"
                    size="landing"
                  >
                    {siteConfig.githubStarCtaLabel}
                  </Button>
                </Link>
                <span className="pointer-events-none absolute -inset-1 rounded-[999px] border border-[#B54B00]/35 opacity-0 transition-opacity duration-200 group-hover/repo:opacity-100" />
              </div>
            </div>
            <Link href={siteConfig.studioPath} className="min-w-0 shrink-0">
              <Button
                className="group inline-flex max-w-full min-w-0 items-center justify-center gap-2 px-3 py-2.5 text-[13px] xl:px-5.5 xl:py-3.5 xl:text-sm"
                variant="landingBlue"
                size="landing"
              >
                Open studio
                <ChevronRight
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  aria-hidden
                />
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors sm:size-10 lg:hidden",
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
            "mt-3 max-h-[min(70dvh,calc(100dvh-5.5rem))] overflow-y-auto overscroll-contain rounded-2xl border shadow-[0_16px_48px_rgba(0,0,0,0.15)] duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 lg:hidden",
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
                    {siteConfig.githubStarCtaLabel}
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
                className="group inline-flex w-full items-center justify-center gap-2"
                variant="landingBlue"
                size="landing"
              >
                Open studio
                <ChevronRight
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                  aria-hidden
                />
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;

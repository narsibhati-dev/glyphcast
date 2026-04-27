"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { siteConfig } from "@/lib/site";

const Footer = () => {
  return (
    <div className="flex justify-center items-center pb-10 sm:pb-20">
      <div
        className="landing-content-width overflow-hidden relative"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
          borderRadius: "24px",
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url('/textures/bento-pattern.png')",
            backgroundSize: "40px auto",
          }}
          aria-hidden="true"
        />

        {/* Top nav bar */}
        <div className="relative z-10 flex items-center justify-between px-8 sm:px-12 pt-8 sm:pt-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
          >
            <img
              src={siteConfig.logoPath}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-contain"
              width={32}
              height={32}
            />
            <span className="[font-family:var(--font-ascii-brand)] text-base sm:text-lg font-medium text-[#111] tracking-wide">
              {siteConfig.productName}
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-[#999]">
            <Link
              href="/#pricing"
              className="hover:text-[#111] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111] transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 px-8 sm:px-12 pt-16 sm:pt-20 pb-10">
          <div className="flex flex-col gap-4 max-w-lg">
            <div className="text-[11px] font-mono text-[#B54B00] tracking-[0.25em] uppercase">
              Ready to start?
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#111] leading-tight">
              Start creating
              <br />
              ASCII art.
            </div>
            <div className="text-sm text-[#888] leading-relaxed max-w-xs">
              No setup required. Drop in an image or video and convert it to
              ASCII in seconds.
            </div>
          </div>

          <div className="flex w-fit max-w-full shrink-0 flex-col items-end gap-2 self-center sm:self-end">
            <Link href={siteConfig.studioPath} className="inline-flex">
              <Button
                className="group relative min-w-48 justify-center overflow-hidden transition-[padding] duration-200 hover:pr-10"
                variant="landingBlue"
                size="landing"
              >
                Open studio
                <ChevronRight className="w-4 absolute right-4 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200" />
              </Button>
            </Link>
            <div className="relative group/repo inline-flex">
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
                    Star the repo
                  </Button>
                </Link>
                <span className="pointer-events-none absolute -inset-1 rounded-[999px] border border-[#B54B00]/35 opacity-0 group-hover/repo:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative z-10 mx-8 sm:mx-12 h-px bg-[#E8E8E8]" />

        {/* Large pixel wordmark (name is announced on the home link above) */}
        <div
          className="relative z-10 px-6 sm:px-8 pt-6 pb-8 sm:pb-10 overflow-hidden flex justify-center"
          aria-hidden="true"
        >
          <p
            className="[font-family:var(--font-ascii-brand)] m-0 select-none text-center font-medium leading-tight text-[#111]"
            style={{ fontSize: "clamp(2.25rem, 11vw, 6rem)" }}
          >
            {siteConfig.productName}
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 flex items-center justify-between px-8 sm:px-12 pb-6 text-[11px] text-[#BBBBBB]">
          <span>© 2026 {siteConfig.productName}</span>
          <span>Built with love for the ASCII community</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

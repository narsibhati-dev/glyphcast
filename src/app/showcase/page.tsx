import Link from "next/link";

import Navbar from "@/components/landing-ui/navbar";
import { siteConfig } from "@/lib/site";

export default function ShowcasePage() {
  return (
    <div
      style={{
        background: "#F9FAFC",
        color: "#111111",
        ["--background" as string]: "#F9FAFC",
        ["--foreground" as string]: "oklch(0.13 0 0)",
        ["--card" as string]: "#ffffff",
        ["--card-foreground" as string]: "oklch(0.13 0 0)",
        ["--muted" as string]: "oklch(0.96 0 0)",
        ["--muted-foreground" as string]: "oklch(0.42 0 0)",
        ["--border" as string]: "oklch(0.90 0 0)",
        ["--primary" as string]: "oklch(0.13 0 0)",
        ["--primary-foreground" as string]: "oklch(0.98 0 0)",
        ["--secondary" as string]: "oklch(0.96 0 0)",
        ["--secondary-foreground" as string]: "oklch(0.13 0 0)",
        ["--accent" as string]: "oklch(0.96 0 0)",
        ["--accent-foreground" as string]: "oklch(0.13 0 0)",
      }}
    >
      <div className="flex min-h-dvh w-full flex-col items-center font-satoshi">
        <Navbar />
        <main className="landing-content-width w-full flex-1 px-6 pb-20 pt-28 sm:pt-32">
          <p className="text-[11px] font-mono tracking-[0.25em] text-[#B54B00] uppercase">
            Gallery
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#111] sm:text-4xl">
            Showcase
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#666]">
            A curated look at what you can make with {siteConfig.productName}. This page
            is a home for example pieces and community highlights.
          </p>
          <p className="mt-6 text-sm text-[#999]">More to come soon.</p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm font-medium text-[#B54B00] underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </main>
      </div>
    </div>
  );
}

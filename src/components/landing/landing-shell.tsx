"use client";

import { useTheme } from "@/components/theme-provider";
import Navbar from "@/components/landing-ui/navbar";
import Bento from "@/components/landing-ui/sections/bento";
import Faq from "@/components/landing-ui/sections/faq";
import Footer from "@/components/landing-ui/sections/footer";
import HeroSection from "@/components/landing-ui/sections/herosection";
import Pricing from "@/components/landing-ui/sections/pricing";

export function LandingShell() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={isDark ? "dark" : ""}
      style={
        isDark
          ? {
              background: "#09090B",
              color: "#E8E8F0",
              ["--background" as string]: "#1E1E24",
              ["--foreground" as string]: "oklch(0.92 0.004 264)",
              ["--card" as string]: "#26262E",
              ["--card-foreground" as string]: "oklch(0.92 0.004 264)",
              ["--muted" as string]: "oklch(0.28 0.006 264)",
              ["--muted-foreground" as string]: "oklch(0.62 0.008 264)",
              ["--border" as string]: "oklch(0.32 0.006 264)",
              ["--primary" as string]: "oklch(0.92 0.004 264)",
              ["--primary-foreground" as string]: "oklch(0.18 0.006 264)",
              ["--secondary" as string]: "oklch(0.28 0.006 264)",
              ["--secondary-foreground" as string]: "oklch(0.92 0.004 264)",
              ["--accent" as string]: "oklch(0.28 0.006 264)",
              ["--accent-foreground" as string]: "oklch(0.92 0.004 264)",
              ["--popover" as string]: "#26262E",
              ["--popover-foreground" as string]: "oklch(0.92 0.004 264)",
            }
          : {
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
              ["--popover" as string]: "#ffffff",
              ["--popover-foreground" as string]: "oklch(0.13 0 0)",
            }
      }
    >
      <div className="flex flex-col justify-center items-center min-h-screen w-full relative font-satoshi">
        <Navbar />
        <div className="landing-sections-stack">
          <div className="w-full relative">
            <HeroSection />
          </div>
          <Bento />
          <Pricing />
          <Faq />
          <Footer />
        </div>
      </div>
    </div>
  );
}

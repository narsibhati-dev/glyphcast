"use client";

import Navbar from "@/components/landing-ui/navbar";
import Bento from "@/components/landing-ui/sections/bento";
import Faq from "@/components/landing-ui/sections/faq";
import Footer from "@/components/landing-ui/sections/footer";
import HeroSection from "@/components/landing-ui/sections/herosection";
import Pricing from "@/components/landing-ui/sections/pricing";

export function LandingShell() {
  return (
    <div style={{
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
    }}>
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

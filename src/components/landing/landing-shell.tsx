"use client";

import Navbar from "@/components/landing-ui/navbar";
import Bento from "@/components/landing-ui/sections/bento";
import Faq from "@/components/landing-ui/sections/faq";
import Footer from "@/components/landing-ui/sections/footer";
import HeroSection from "@/components/landing-ui/sections/herosection";
import Pricing from "@/components/landing-ui/sections/pricing";
import { ThemeDockButton } from "@/components/theme-dock-button";

export function LandingShell() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
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
        <ThemeDockButton />
      </div>
    </div>
  );
}

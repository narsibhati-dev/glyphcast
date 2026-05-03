"use client";

import Navbar from "@/components/landing-ui/navbar";
import Features from "@/components/landing-ui/sections/features";
import Faq from "@/components/landing-ui/sections/faq";
import Footer from "@/components/landing-ui/sections/footer";
import HeroSection from "@/components/landing-ui/sections/herosection";
import Plans from "@/components/landing-ui/sections/plans";
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
          <Features />
          <Plans />
          <Faq />
          <Footer />
        </div>
        <ThemeDockButton />
      </div>
    </div>
  );
}

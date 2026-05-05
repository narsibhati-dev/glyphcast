"use client";

import Navbar from "@/components/landing/navbar";
import Features from "@/components/landing/sections/features";
import Faq from "@/components/landing/sections/faq";
import Footer from "@/components/landing/sections/footer";
import HeroSection from "@/components/landing/sections/herosection";
import Plans from "@/components/landing/sections/plans";
import { ThemeDockButton } from "@/components/shared/theme-dock-button";

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

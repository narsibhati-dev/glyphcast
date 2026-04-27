"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { siteConfig } from "@/lib/site";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-navbar-scroll fixed top-6 z-50">
      {/* Main navbar bar */}
      <div
        className={`flex justify-between items-center p-3 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-white/80 border-black/[0.08] backdrop-blur-sm shadow-sm"
            : "bg-transparent border-transparent backdrop-blur-none shadow-none"
        }`}
      >
        <section className="flex justify-center items-center gap-x-6">
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 transition-all duration-300 hover:opacity-80"
          >
            <img
              src={siteConfig.logoPath}
              alt="Logo"
              className="object-contain w-10 h-10 aspect-square rounded-xl lg:h-12 lg:w-12"
              width={48}
              height={48}
            />
            <span className="text-base lg:text-xl whitespace-nowrap font-medium tracking-tight">
              {siteConfig.productName}
            </span>
          </Link>
          <NavigationMenu className="z-50 hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4" asChild>
                  <Link
                    href="/#pricing"
                    className="text-sm hover:text-black text-muted-foreground transition-colors duration-300"
                  >
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4" asChild>
                  <Link
                    href="/showcase"
                    className="text-sm hover:text-black text-muted-foreground transition-colors duration-300"
                  >
                    Showcase
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </section>

        {/* Desktop buttons */}
        <section className="hidden lg:flex items-center gap-2">
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
                  Star the repo
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
        </section>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-4 flex flex-col gap-1">
          <Link
            href="/studio"
            className="py-2.5 px-3 rounded-xl hover:bg-accent text-sm font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tools
          </Link>
          <Link
            href="/faq"
            className="py-2.5 px-3 rounded-xl hover:bg-accent text-sm font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQs
          </Link>
          <Link
            href="/#pricing"
            className="py-2.5 px-3 rounded-xl hover:bg-accent text-sm font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/showcase"
            className="py-2.5 px-3 rounded-xl hover:bg-accent text-sm font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Showcase
          </Link>
          <div className="flex gap-2 pt-2 border-t border-border mt-1">
            <div className="relative group/repo flex-1 flex items-center justify-center">
              <div className="relative w-full transition-transform duration-200 group-hover/repo:-translate-y-0.5">
                <Link
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 block w-full"
                >
                  <Button
                    className="w-full transition-all duration-200 hover:shadow-[0_10px_22px_rgba(181,75,0,0.2)]"
                    variant="landing"
                    size="landing"
                  >
                    Star the repo
                  </Button>
                </Link>
                <span className="pointer-events-none absolute -inset-1 rounded-[999px] border border-[#B54B00]/35 opacity-0 group-hover/repo:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            <Link href={siteConfig.studioPath} className="flex-1">
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
      )}
    </div>
  );
};

export default Navbar;

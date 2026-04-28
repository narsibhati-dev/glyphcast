"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import StudioUiPreview from "@/components/studio-ui-preview";
import TextYAnimation4 from "@/components/text-animation";
import Sponsor from "../sponsor";
import { siteConfig } from "@/lib/site";

const HeroSection = () => {
  const [starsCount, setStarsCount] = React.useState(0);
  const [isFootageHovered, setIsFootageHovered] = React.useState(false);
  const [isAsciiHovered, setIsAsciiHovered] = React.useState(false);
  const [isIntoHovered, setIsIntoHovered] = React.useState(false);
  const [isSequencesHovered, setIsSequencesHovered] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch(siteConfig.githubApiStarsUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.stargazers_count === "number") {
          setStarsCount(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {" "}
      <section className="z-10 flex flex-col w-full items-center justify-center text-center mt-[12vh] md:mt-[23vh]">
        <div className="z-40 flex flex-col justify-center items-center">
          <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
            className="border border-[#FFD9B8] p-0.5 rounded-full inline-flex justify-center items-center bg-[radial-gradient(circle_at_center,_rgba(181,75,0,0.12)_0%,_rgba(181,75,0,0.04)_50%,_rgba(181,75,0,0)_80%)]"
          >
            <Link
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className=" px-4 flex py-1.5  text-[10px] text-white"
              style={{
                background:
                  "linear-gradient(137.68deg, #B54B00 22.55%, #C96020 86.49%)",
                boxShadow:
                  "0px 8px 24px rgba(181,75,0,0.3), inset 0px 1px 4px 2px rgba(255,200,160,0.4)",
                borderRadius: "100px",
              }}
            >
              <span className="mr-1">
                <NumberFlow value={starsCount} />
              </span>
              Stargazers on GitHub
            </Link>
          </motion.div>
          <div className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl relative cursor-default">
            Convert{" "}
            <motion.span
              className="relative inline-block align-baseline"
              onHoverStart={() => setIsFootageHovered(true)}
              onHoverEnd={() => setIsFootageHovered(false)}
            >
              <span
                className={`transition-all duration-200 ${
                  isFootageHovered ? "text-[#B54B00] " : "text-black"
                }`}
              >
                Videos
              </span>
            </motion.span>{" "}
            <span className=" relative inline-block align-baseline">
              <motion.span
                className="inline-block transition-all duration-200"
                onHoverStart={() => setIsIntoHovered(true)}
                onHoverEnd={() => setIsIntoHovered(false)}
                animate={{
                  color: isIntoHovered ? "#B54B00" : "#111111",
                  y: isIntoHovered ? -2 : 0,
                  scale: isIntoHovered ? 1.04 : 1,
                }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
              >
                into
              </motion.span>{" "}
              <motion.span
                className="absolute left-0 -bottom-2 h-[3px] rounded-full bg-[#B54B00]"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: isIntoHovered ? "100%" : "0%",
                  opacity: isIntoHovered ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </span>
            <br />
            <motion.span
              className="relative inline-block align-baseline"
              onHoverStart={() => setIsAsciiHovered(true)}
              onHoverEnd={() => setIsAsciiHovered(false)}
            >
              <span
                className={`transition-all duration-200 inline-block ${
                  isAsciiHovered ? "text-[#B54B00] " : "text-black"
                }`}
              >
                <TextYAnimation4
                  text="ASCII"
                  secondText="ASCII"
                  isActive={isAsciiHovered}
                  className="leading-none"
                  firstClassName="uppercase [font-family:var(--font-ascii-brand)]"
                  secondClassName="uppercase [font-family:var(--font-ascii-brand)]"
                />
              </span>
            </motion.span>{" "}
            <span
              className="relative inline-block"
              onMouseEnter={() => setIsSequencesHovered(true)}
              onMouseLeave={() => setIsSequencesHovered(false)}
            >
              <motion.span
                className="relative z-10 inline-block"
                animate={{
                  color: isSequencesHovered ? "#B54B00" : "#111111",
                  y: isSequencesHovered ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
              >
                Sequences
              </motion.span>
              <motion.span
                className="absolute inset-x-0 -bottom-1 h-[0.22em] rounded-sm bg-[#FFE2CC]"
                initial={false}
                animate={{
                  opacity: isSequencesHovered ? 1 : 0,
                  scaleX: isSequencesHovered ? 1 : 0.35,
                }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ transformOrigin: "left center" }}
              />
            </span>
          </div>
          <div
            style={{
              lineHeight: "120%",
            }}
            className="text-base sm:text-xl mt-5 px-4 sm:px-0"
          >
            Each frame is rebuilt from your charset, then played in order
            <br className="hidden sm:block" /> so the motion reads as one smooth
            stream.
          </div>
          <section className="mt-8 flex flex-col items-center gap-2 md:flex-row md:justify-center">
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
          </section>
          <div>
            <Sponsor />
          </div>
        </div>
        <div className="mt-12 relative z-40">
          <StudioUiPreview />
        </div>
      </section>
    </>
  );
};

export default HeroSection;

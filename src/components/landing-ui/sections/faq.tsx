import { CustomAccordion } from "@/components/custom-accordion";
import { DmOnXButton } from "@/components/landing-ui/dm-on-x-button";
import React from "react";

type FAQItem = {
  id: string;
  number: string;
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    id: "item-1",
    number: "01",
    question: "What export formats does Glyphcast support?",
    answer:
      "Glyphcast exports ASCII art as a PNG snapshot, a ZIP of individual frame text files, or a self-contained React (.tsx) component with all frames embedded, ready to drop into any project.",
  },
  {
    id: "item-2",
    number: "02",
    question: "Does my media get uploaded to a server?",
    answer:
      "Never. All conversion happens locally in your browser using the Canvas API. Your images and videos never leave your device, and there is zero telemetry or server calls.",
  },
  {
    id: "item-3",
    number: "03",
    question: "How do I customise the look of my ASCII output?",
    answer:
      "You have full control over font family, font size, line height, letter spacing, foreground/background colors, character sets (40+), and visual effects like Matrix, Glitch, Neon, CRT, and more, all tweaked live in the studio.",
  },
  {
    id: "item-4",
    number: "04",
    question: "Is Glyphcast free to use?",
    answer:
      "Yes, the core studio is free and open-source. Star the repo on GitHub to stay updated. A paid tier with priority support and early access to new features is planned for the future.",
  },
  {
    id: "item-5",
    number: "05",
    question: "How do I request a new feature or report a bug?",
    answer:
      "Open an issue on the GitHub repository. Feature requests are prioritised by community votes, and bugs are triaged weekly. Pull requests are very welcome too!",
  },
];

const Faq = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="landing-content-width flex flex-col items-center gap-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="text-3xl md:text-4xl font-medium">
            Frequently asked questions
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Can&apos;t find the answer you&apos;re looking for?{" "}
            <span className="text-foreground font-medium">
              I&apos;m here to help.
            </span>
          </p>
        </div>

        <div className="w-full">
          <CustomAccordion
            items={faqItems.map((item) => ({
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>

        <DmOnXButton />
      </div>
    </div>
  );
};

export default Faq;

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type DmOnXButtonProps = {
  className?: string;
};

export function DmOnXButton({ className }: DmOnXButtonProps) {
  return (
    <Button
      variant="landingBlue"
      size="landing"
      asChild
      className={cn(className)}
    >
      <Link
        href={siteConfig.xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Message ${siteConfig.xHandle} on X`}
      >
        DM me on{" "}
        <svg
          className="text-white"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden={true}
        >
          <path
            d="M0.75 12.75L5.78227 7.71773M5.78227 7.71773L0.75 0.75H4.08333L7.71773 5.78227M5.78227 7.71773L9.41667 12.75H12.75L7.71773 5.78227M12.75 0.75L7.71773 5.78227"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </Button>
  );
}

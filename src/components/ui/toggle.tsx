"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-xs text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-pressed:bg-foreground aria-pressed:text-background data-[state=on]:bg-foreground data-[state=on]:text-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-secondary",
      },
      size: {
        default: "h-8 min-w-8 px-2.5",
        sm: "h-7 min-w-7 px-2 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3",
        lg: "h-9 min-w-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };

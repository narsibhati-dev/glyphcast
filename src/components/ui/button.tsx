import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xs border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary",
        outline:
          "border-border bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted aria-expanded:bg-muted",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        destructive:
          "border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10",
        link: "text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground",
        landing:
          "bg-[#FFFFFF] shadow-[0px_4px_1px_rgba(0,0,0,0.01),0px_2px_1px_rgba(0,0,0,0.05),0px_1px_1px_rgba(0,0,0,0.09),0px_0px_1px_rgba(0,0,0,0.1),inset_0px_2px_2.2px_#FFFFFF] rounded-[99px] text-[#0f172a] hover:bg-[#FFFFFF]/90",
        landingBlue:
          "bg-[#B54B00] shadow-[0px_0px_4px_rgba(0,0,0,0.04),0px_8px_16px_rgba(0,0,0,0.08),inset_2px_3px_3.5px_rgba(255,255,255,0.18)] rounded-[77px] text-white hover:bg-[#9E4200]",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10",
        landing: "px-5.5 py-3.5 gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

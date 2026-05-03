"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-xs border border-input transition-colors outline-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground aria-invalid:border-destructive data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-checked:border-primary data-checked:bg-primary data-unchecked:bg-card data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none ml-px block bg-foreground transition-transform group-data-[size=default]/switch:size-2.5 group-data-[size=sm]/switch:size-2 group-data-[size=default]/switch:data-checked:translate-x-3 group-data-[size=sm]/switch:data-checked:translate-x-2.5 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 data-checked:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

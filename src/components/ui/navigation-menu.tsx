"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}
  </nav>
));
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative", className)} {...props} />
));
NavigationMenuItem.displayName = "NavigationMenuItem";

interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, asChild, children, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      ref={ref as React.Ref<HTMLAnchorElement>}
      className={cn(
        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};

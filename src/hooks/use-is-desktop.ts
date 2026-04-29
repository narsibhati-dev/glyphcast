"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_BREAKPOINT = 768;

export function useIsDesktop() {
  const isDesktop = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches,
    () => null,
  );

  return isDesktop as boolean | null;
}

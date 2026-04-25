import { Suspense } from "react";

import { LandingShell } from "@/components/landing/landing-shell";

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <LandingShell />
    </Suspense>
  );
}
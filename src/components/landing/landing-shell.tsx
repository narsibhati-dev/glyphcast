"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ASCII_CHAR_PRESETS } from "@/lib/ascii-config";

import { Examples } from "./examples";
import { Features } from "./features";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { ASCIIAnimation } from "./ascii-animation";
import { SiteNav } from "./site-nav";
import {
  DEFAULT_LANDING_SAMPLE_ID,
  LANDING_SAMPLES,
  getLandingSample,
  type LandingSample,
} from "./samples";

const VALID_CHARSET_IDS = new Set(ASCII_CHAR_PRESETS.map((c) => c.id));
const VALID_SAMPLE_IDS = new Set(LANDING_SAMPLES.map((s) => s.id));

const MIN_COLUMNS = 60;
const MAX_COLUMNS = 220;

function clampColumns(n: number): number {
  if (!Number.isFinite(n)) return 160;
  return Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.round(n)));
}

export function LandingShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const heroRef = useRef<HTMLElement>(null);

  const [sampleId, setSampleId] = useState<string>(() => {
    const v = searchParams.get("sample");
    return v && VALID_SAMPLE_IDS.has(v) ? v : DEFAULT_LANDING_SAMPLE_ID;
  });
  const [columns, setColumns] = useState<number>(() => {
    const v = Number(searchParams.get("cols"));
    if (Number.isFinite(v) && v >= MIN_COLUMNS && v <= MAX_COLUMNS) {
      return Math.round(v);
    }
    return getLandingSample(searchParams.get("sample")).defaults.columns;
  });
  const [charsetId, setCharsetId] = useState<string>(() => {
    const v = searchParams.get("charset");
    if (v && VALID_CHARSET_IDS.has(v)) return v;
    return getLandingSample(searchParams.get("sample")).defaults.charset;
  });
  const [invert, setInvert] = useState<boolean>(() => {
    return searchParams.get("invert") === "1";
  });

  // Sync state -> URL (debounced via the browser's own scheduling). We use
  // `router.replace` so back-button doesn't fill up with intermediate states.
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sample", sampleId);
    params.set("cols", String(columns));
    params.set("charset", charsetId);
    if (invert) params.set("invert", "1");
    const next = `${pathname}?${params.toString()}`;
    const current = `${pathname}?${searchParams.toString()}`;
    if (next !== current) {
      router.replace(next, { scroll: false });
    }
  }, [sampleId, columns, charsetId, invert, pathname, router, searchParams]);

  const applySample = useCallback((sample: LandingSample) => {
    setSampleId(sample.id);
    setColumns(clampColumns(sample.defaults.columns));
    setCharsetId(sample.defaults.charset);
    setInvert(sample.defaults.invert);
  }, []);

  const handlePickFromExamples = useCallback(
    (sample: LandingSample) => {
      applySample(sample);
      requestAnimationFrame(() => {
        heroRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [applySample],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <Hero
          ref={heroRef}
          sampleId={sampleId}
          columns={columns}
          charsetId={charsetId}
          invert={invert}
          onSampleChange={(id) => {
            const sample = getLandingSample(id);
            applySample(sample);
          }}
          onColumnsChange={(cols) => setColumns(clampColumns(cols))}
          onCharsetChange={setCharsetId}
          onInvertChange={setInvert}
        />
        {/* <section className="py-24 lg:py-32 bg-zinc-950 overflow-hidden flex flex-col items-center border-y border-zinc-900/50">
          <div className="mb-12 text-center">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-white md:text-4xl">
              Studio outputs, <span className="text-zinc-500">ready to ship.</span>
            </h2>
            <p className="mt-4 text-zinc-400">React components generated instantly.</p>
          </div>
          <ASCIIAnimation className="w-full max-w-5xl" />
        </section> */}
        <Features />
        <Examples
          activeSampleId={sampleId}
          onPick={handlePickFromExamples}
        />
      </main>
      <Footer />
    </div>
  );
}

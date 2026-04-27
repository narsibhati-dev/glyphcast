import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
                <span className="font-sans text-sm font-black tracking-tighter">
                  G
                </span>
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                Glyphcast
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">
              A browser-native ASCII studio. Drop a frame, tune the glyphs, ship
              a self-contained component.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-semibold text-white">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/studio"
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Studio
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-semibold text-white">
              Connect
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://github.com/narsibhati-dev/glyphcast"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  <Code2 className="size-4" />
                  GitHub Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {year} Glyphcast. All rights reserved.
          </p>
          <a
            href="https://github.com/narsibhati-dev/glyphcast"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            View source
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

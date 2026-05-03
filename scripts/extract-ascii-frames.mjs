/**
 * Reads `export const FRAMES = [...]` from pasted studio `.tsx` files and writes JSON.
 * Expects each file to still contain the inline FRAMES array (not yet migrated to JSON).
 * Run: node scripts/extract-ascii-frames.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function extractFramesArrayLiteral(content) {
  const marker = "export const FRAMES = ";
  const start = content.indexOf(marker);
  if (start === -1) throw new Error("export const FRAMES not found");

  let i = start + marker.length;
  while (i < content.length && content[i] !== "[") i++;
  if (i >= content.length) throw new Error("opening [ not found");
  const bracketStart = i;

  let depth = 0;
  for (; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < content.length) {
        if (content[i] === "\\") {
          i += 2;
          continue;
        }
        if (content[i] === quote) break;
        i++;
      }
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return content.slice(bracketStart, i + 1);
    }
  }
  throw new Error("unclosed FRAMES array");
}

const root = path.join(import.meta.dirname, "..");
const componentsDir = path.join(root, "src/components/ascii-animations");
const outDir = path.join(root, "src/data/ascii-frames");
fs.mkdirSync(outDir, { recursive: true });

for (const name of ["thunder", "car", "fire"]) {
  const tsPath = path.join(componentsDir, `${name}.tsx`);
  const content = fs.readFileSync(tsPath, "utf8");
  const literal = extractFramesArrayLiteral(content);
  const frames = vm.runInNewContext(literal, Object.create(null), {
    timeout: 120_000,
  });
  if (!Array.isArray(frames))
    throw new Error(`${name}: expected array, got ${typeof frames}`);
  const outPath = path.join(outDir, `${name}.frames.json`);
  fs.writeFileSync(outPath, JSON.stringify(frames));
  console.log(outPath, frames.length, "frames");
}

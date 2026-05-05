/**
 * Pure image -> ASCII conversion utilities.
 *
 * The conversion is intentionally side-effect-free aside from a single
 * module-scoped offscreen canvas that we reuse across calls to avoid GC churn
 * during video playback. The function does not mutate any inputs.
 */

export interface ImageToAsciiOptions {
  /** Number of ASCII columns. Rows are derived from the source aspect ratio. */
  columns: number;
  /** Characters ordered from darkest (index 0) to brightest (last index). */
  charset: string;
  /** Flip the brightness -> char mapping. */
  invert: boolean;
  /** Capture per-cell `rgb(r,g,b)` strings for color rendering. */
  useColors: boolean;
  /**
   * Pixel-aspect compensation for tall glyphs. Typical monospace fonts render
   * ~2x as tall as wide, so a value around 0.5 keeps the picture square.
   */
  cellAspect: number;
  /**
   * Optional brightness offset in the [-100, 100] range. Mapped to a small
   * additive offset on the 0-255 luminance prior to charset lookup. The "Threshold"
   * slider in the UI feeds this so the user can push the image lighter or darker.
   */
  threshold?: number;
}

export interface ImageToAsciiResult {
  text: string;
  /** Present only when `useColors: true`. `colors[row][col]` is `rgb(r,g,b)`. */
  colors?: string[][];
  rows: number;
  cols: number;
}

export type ConvertibleSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;

let scratchCanvas: HTMLCanvasElement | null = null;
let scratchCtx: CanvasRenderingContext2D | null = null;

function getScratchContext(
  width: number,
  height: number,
): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  if (!scratchCanvas) {
    scratchCanvas = document.createElement("canvas");
  }
  if (scratchCanvas.width !== width || scratchCanvas.height !== height) {
    scratchCanvas.width = width;
    scratchCanvas.height = height;
  }
  if (!scratchCtx || scratchCtx.canvas !== scratchCanvas) {
    scratchCtx = scratchCanvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D | null;
  }
  if (!scratchCtx) {
    throw new Error("ascii-converter: 2D canvas context is unavailable");
  }
  return { canvas: scratchCanvas, ctx: scratchCtx };
}

function getSourceDimensions(source: ConvertibleSource): {
  width: number;
  height: number;
} {
  if (source instanceof HTMLVideoElement) {
    return {
      width: source.videoWidth || source.clientWidth || 0,
      height: source.videoHeight || source.clientHeight || 0,
    };
  }
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}

const EMPTY_RESULT: ImageToAsciiResult = { text: "", rows: 0, cols: 0 };

export function imageToAscii(
  source: ConvertibleSource,
  opts: ImageToAsciiOptions,
): ImageToAsciiResult {
  const { width: srcW, height: srcH } = getSourceDimensions(source);
  if (!srcW || !srcH) return EMPTY_RESULT;

  const charset = opts.charset.length > 0 ? opts.charset : " .:-=+*#%@";
  const cellAspect = opts.cellAspect > 0 ? opts.cellAspect : 0.5;
  const cols = Math.max(1, Math.floor(opts.columns));
  const rows = Math.max(1, Math.round((cols * srcH * cellAspect) / srcW));

  const { ctx } = getScratchContext(cols, rows);
  ctx.clearRect(0, 0, cols, rows);
  // The browser handles bilinear sampling; results look good enough for ASCII.
  ctx.drawImage(source, 0, 0, cols, rows);

  let pixels: Uint8ClampedArray;
  try {
    pixels = ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    // Tainted canvas (cross-origin image) -- nothing we can do client-side.
    return { ...EMPTY_RESULT, rows, cols };
  }

  const charsetLen = charset.length;
  const lastCharIdx = charsetLen - 1;
  const offset = ((opts.threshold ?? 0) / 100) * 255;

  const lineLength = cols + 1; // newline per row
  const text = new Array<string>(rows * lineLength);
  const colorGrid: string[][] | undefined = opts.useColors
    ? new Array(rows)
    : undefined;

  for (let y = 0; y < rows; y++) {
    const colorRow = colorGrid ? new Array<string>(cols) : undefined;
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      // ITU-R BT.601 luma coefficients.
      let lum = 0.299 * r + 0.587 * g + 0.114 * b + offset;
      if (lum < 0) lum = 0;
      else if (lum > 255) lum = 255;

      let idx = Math.floor((lum / 255) * lastCharIdx);
      if (opts.invert) idx = lastCharIdx - idx;

      text[y * lineLength + x] = charset[idx];

      if (colorRow) {
        colorRow[x] = `rgb(${r}, ${g}, ${b})`;
      }
    }
    text[y * lineLength + cols] = "\n";
    if (colorRow && colorGrid) colorGrid[y] = colorRow;
  }

  return {
    text: text.join(""),
    colors: colorGrid,
    rows,
    cols,
  };
}

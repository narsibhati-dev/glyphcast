/**
 * Shared UI tokens for `/studio` — aligned with the hero mini-dashboard
 * ([`studio-ui-preview`](../components/studio-ui-preview.tsx)) and landing.
 * Each token includes both light and dark variants.
 */
export const STUDIO_SLIDER_CLASS =
  "w-full **:data-[slot=slider-track]:h-[2px] **:data-[slot=slider-track]:rounded-full **:data-[slot=slider-track]:bg-[#D6D6D6] dark:**:data-[slot=slider-track]:bg-zinc-700 **:data-[slot=slider-range]:bg-[#B54B00] **:data-[slot=slider-thumb]:h-3 **:data-[slot=slider-thumb]:w-3 **:data-[slot=slider-thumb]:rounded-full **:data-[slot=slider-thumb]:border **:data-[slot=slider-thumb]:border-[#B54B00] **:data-[slot=slider-thumb]:bg-white dark:**:data-[slot=slider-thumb]:bg-zinc-900";

export const STUDIO_TEXT_BODY = "text-[#111] dark:text-zinc-100";
export const STUDIO_TEXT_LABEL = "text-[#888] dark:text-zinc-400";
export const STUDIO_TEXT_META = "text-[#666] dark:text-zinc-500";

/** Mini-dashboard outline pill button treatment. */
export const STUDIO_OUTLINE_TERTIARY =
  "h-7 border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#111] dark:text-zinc-200 hover:bg-[#F9FAFC] dark:hover:bg-zinc-700 text-[10px]";

/** Studio switch treatment for neutral card controls. */
export const STUDIO_SWITCH_CLASS =
  "h-6 w-11 rounded-full border border-[#D8DCE2] dark:border-zinc-700 bg-[#ECEFF3] dark:bg-zinc-800 p-0.5 data-checked:border-[#B54B00] data-checked:bg-[#B54B00] data-unchecked:bg-[#ECEFF3] dark:data-unchecked:bg-zinc-800 [&_[data-slot=switch-thumb]]:!ml-0 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:rounded-full [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:shadow-[0px_1px_3px_rgba(0,0,0,0.20)] [&_[data-slot=switch-thumb]]:transition-transform [&_[data-slot=switch-thumb]]:duration-200 [&_[data-slot=switch-thumb]]:ease-out [&_[data-slot=switch-thumb]]:!translate-x-0 data-checked:[&_[data-slot=switch-thumb]]:!translate-x-5";

/**
 * Text fields / selects on `/studio` — same tokens as `PREVIEW.field` in
 * studio-ui-preview (border #E5E5E5, white bg, brand focus ring).
 */
export const STUDIO_FIELD_CLASS =
  "h-8 w-full rounded-md border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-[#111] dark:text-zinc-100 shadow-none focus-visible:border-[#B54B00] focus-visible:ring-2 focus-visible:ring-[#B54B00]/20";

export const STUDIO_FIELD_MONO_CLASS =
  "h-8 w-full rounded-md border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-xs tabular-nums text-[#111] dark:text-zinc-100 shadow-none focus-visible:border-[#B54B00] focus-visible:ring-2 focus-visible:ring-[#B54B00]/20";

export const STUDIO_FIELD_READONLY_MUTED =
  "h-8 w-full rounded-md border border-transparent bg-[#F9FAFC] dark:bg-zinc-800/50 font-mono text-xs tabular-nums text-[#888] dark:text-zinc-500";

export const STUDIO_SELECT_CONTENT =
  "max-h-[180px] rounded-xl border border-[#E5E5E5] dark:border-zinc-700 bg-white dark:bg-zinc-900";

export const STUDIO_SELECT_ITEM =
  "rounded-sm text-xs text-[#111] dark:text-zinc-200 focus:bg-[#F9FAFC] dark:focus:bg-zinc-800 focus:text-[#B54B00]";

/** Card / panel border aligned with `PREVIEW.card` */
export const STUDIO_CARD_OUTLINE =
  "border border-[#E5E5E5] dark:border-zinc-800";

/**
 * Dashed "upload" surface — matches hero Source Media dropzone in
 * studio-ui-preview.
 */
export const STUDIO_DROPZONE =
  "rounded-xl border border-dashed border-[#B54B00]/40 bg-[#F9FAFC] dark:bg-zinc-900 text-xs text-[#666] dark:text-zinc-500 transition-colors hover:border-[#B54B00]/60 hover:bg-[#FFF5ED]/80 dark:hover:bg-zinc-800/80";

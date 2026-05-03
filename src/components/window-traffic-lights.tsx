import { cn } from "@/lib/utils";

const DOT =
  "size-3 shrink-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-inset ring-black/12 dark:ring-white/10";

export function WindowTrafficLights({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
      <span
        className={cn(
          DOT,
          "bg-[#FF5F57] dark:bg-[#FF5F57]/90",
          "ring-[#E0433A]/40 dark:ring-[#C73B33]/50",
        )}
      />
      <span
        className={cn(
          DOT,
          "bg-[#FFBD2E] dark:bg-[#FFBD2E]/90",
          "ring-[#DEA123]/45 dark:ring-[#C28E1F]/50",
        )}
      />
      <span
        className={cn(
          DOT,
          "bg-[#28C840] dark:bg-[#28C840]/90",
          "ring-[#1AAB29]/45 dark:ring-[#178A22]/50",
        )}
      />
    </div>
  );
}

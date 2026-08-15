import type { EvidenceStatus } from "@/lib/fleet-systems";
import { cn } from "@/lib/utils";

interface EvidenceBadgeProps {
  status: EvidenceStatus;
  className?: string;
}

export default function EvidenceBadge({
  status,
  className,
}: EvidenceBadgeProps) {
  const isShipped = status.startsWith("Shipped");

  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]",
        isShipped
          ? "border-accent/40 bg-accent/[0.07] text-accent"
          : "border-neon/30 bg-neon/[0.05] text-neon",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          isShipped ? "bg-accent" : "bg-neon",
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}


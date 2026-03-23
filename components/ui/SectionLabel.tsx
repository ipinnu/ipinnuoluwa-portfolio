import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs text-text-tertiary uppercase tracking-widest",
        className
      )}
    >
      {label}
    </p>
  );
}

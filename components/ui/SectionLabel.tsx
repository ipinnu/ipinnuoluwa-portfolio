import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-px h-4 bg-neon flex-shrink-0" />
      <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}

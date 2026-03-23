import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  className?: string;
}

export default function Tag({ label, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-xs text-text-secondary border border-border px-2 py-0.5 rounded-sm",
        className
      )}
    >
      {label}
    </span>
  );
}

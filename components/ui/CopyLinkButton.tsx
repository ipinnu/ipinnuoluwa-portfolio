"use client";

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(url)}
      className="block font-mono text-xs text-text-secondary hover:text-accent transition-colors"
    >
      Copy link →
    </button>
  );
}

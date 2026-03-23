import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-6">
          404
        </p>
        <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary mb-4">
          Not found.
        </h1>
        <p className="text-text-secondary mb-10 max-w-sm mx-auto">
          This page doesn&apos;t exist. Maybe it never did, or maybe you found
          a broken link.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold text-sm px-6 py-3 rounded-sm hover:bg-accent-dim transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}

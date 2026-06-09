import { RESOURCE_CATEGORIES } from "@/lib/react-hub/resources";

export default function ResourcesPage() {
  return (
    <div className="px-6 py-8 max-w-2xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-accent tracking-widest uppercase mb-2">
          // resources
        </p>
        <h1 className="font-syne font-black text-2xl text-text-primary mb-2">
          External Resources
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Vetted docs, channels, articles, and communities. These complement the
          lessons — not a replacement.
        </p>
      </div>

      <div className="space-y-10">
        {RESOURCE_CATEGORIES.map((category) => (
          <div key={category.title}>
            <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase mb-3">
              {category.title}
            </p>
            <div className="space-y-px">
              {category.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-6 group border-b border-border py-4 hover:bg-bg-secondary px-3 -mx-3 transition-colors"
                >
                  <div>
                    <p className="text-sm text-text-primary group-hover:text-neon transition-colors mb-0.5">
                      {link.label}
                    </p>
                    {link.description && (
                      <p className="text-xs text-text-tertiary leading-relaxed">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-xs text-text-tertiary group-hover:text-neon flex-shrink-0 pt-0.5 transition-colors">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

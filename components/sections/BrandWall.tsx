import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import { brands } from "@/lib/brands";

export default function BrandWall() {
  return (
    <section
      className="border-t border-border bg-bg-secondary/40 py-20 md:py-28"
      aria-labelledby="brand-wall-title"
    >
      <div className="max-w-content mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end md:gap-16">
          <FadeUp>
            <SectionLabel label="Client trust" className="mb-4" />
            <h2
              id="brand-wall-title"
              className="font-syne text-3xl font-bold text-text-primary md:text-4xl"
            >
              Brands I&apos;ve helped move forward
            </h2>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
              From first launches to follow-on product and web work, I help
              teams turn ambitious ideas into clear, usable experiences that
              are ready for real customers.
            </p>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, index) => {
            const content = (
              <>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                  {brand.sector}
                </span>
                <span className="mt-5 font-syne text-base font-bold tracking-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
                  {brand.shortName}
                </span>
                <span className="mt-2 text-xs leading-relaxed text-text-tertiary">
                  {brand.name}
                </span>
              </>
            );

            return (
              <FadeUp key={brand.name} delay={Math.min(index * 0.04, 0.2)}>
                {brand.href ? (
                  <a
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${brand.name}`}
                    className="group flex min-h-36 cursor-pointer flex-col border-b border-r border-border p-5 transition-colors duration-200 hover:bg-bg-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:min-h-40 md:p-6"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex min-h-36 flex-col border-b border-r border-border p-5 md:min-h-40 md:p-6">
                    {content}
                  </div>
                )}
              </FadeUp>
            );
          })}

          <FadeUp delay={0.24}>
            <Link
              href="/work"
              className="group flex min-h-36 cursor-pointer flex-col justify-between border-b border-r border-border bg-bg-tertiary p-5 transition-colors duration-200 hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:min-h-40 md:p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary group-hover:text-bg-primary/70">
                The proof
              </span>
              <span className="font-syne text-base font-bold text-accent group-hover:text-bg-primary">
                Explore the work <span aria-hidden="true">→</span>
              </span>
            </Link>
          </FadeUp>
        </div>

        <FadeUp delay={0.16}>
          <div className="mt-8 flex items-start gap-3 border-l-2 border-accent pl-4">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <p className="font-mono text-xs leading-relaxed text-text-tertiary">
              Repeat collaboration includes both product and marketing delivery
              for the same brand—a sign that good work earns the next brief.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

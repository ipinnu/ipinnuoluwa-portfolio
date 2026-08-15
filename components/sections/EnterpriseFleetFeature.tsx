import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

export default function EnterpriseFleetFeature() {
  return (
    <section
      className="border-t border-border py-16 md:py-20"
      aria-labelledby="enterprise-fleet-feature-title"
    >
      <div className="mx-auto max-w-content px-6">
        <FadeUp>
          <div className="grid gap-8 border border-border bg-bg-secondary p-6 md:grid-cols-[0.72fr_1.28fr] md:items-stretch md:p-8">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <SectionLabel label="Enterprise systems" className="mb-4" />
                <h2
                  id="enterprise-fleet-feature-title"
                  className="font-syne text-2xl font-bold text-text-primary md:text-3xl"
                >
                  Fleet intelligence beyond the dashboard.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-text-secondary">
                  A focused account of shipped fleet systems, the engineering
                  decisions behind them, and how I believe the category moves
                  from visibility to coordinated action.
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                  3,000+ vehicle operational footprint
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-text-tertiary">
                  Built for warm employer and partner conversations
                </p>
              </div>
            </div>

            <Link
              href="/work/fleet-systems"
              className="group relative min-h-80 cursor-pointer overflow-hidden border border-border bg-[#0b0d0c] p-6 transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon sm:p-8"
            >
              <div
                className="absolute inset-0 opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle at 78% 28%, rgba(232,255,71,.13), transparent 26%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
                  backgroundSize: "auto, 36px 36px, 36px 36px",
                }}
              />

              <div className="relative flex h-full min-h-64 flex-col justify-between">
                <div className="flex items-start justify-between gap-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                    Specialist case study
                  </span>
                  <span className="grid h-11 w-11 place-items-center border border-white/10 text-text-secondary transition-colors duration-200 group-hover:border-neon/40 group-hover:text-neon">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </div>

                <div className="my-10">
                  <div className="flex items-end gap-2" aria-hidden="true">
                    {[34, 52, 46, 78, 61, 92, 73, 100].map((height, index) => (
                      <span
                        key={`${height}-${index}`}
                        className="w-full border-t border-neon/50 bg-gradient-to-t from-accent/[0.03] to-neon/[0.12]"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                    <span>Visibility</span>
                    <span>Context</span>
                    <span>Automation</span>
                  </div>
                </div>

                <div>
                  <p className="font-syne text-2xl font-black text-text-primary sm:text-3xl">
                    See the systems. Follow the progression.
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-neon transition-colors duration-200 group-hover:text-white">
                    Enter the fleet systems case study{" "}
                    <span aria-hidden="true">↗</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}


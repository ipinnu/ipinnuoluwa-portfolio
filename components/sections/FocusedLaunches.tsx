import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

export default function FocusedLaunches() {
  return (
    <section
      className="border-t border-border py-16 md:py-20"
      aria-labelledby="focused-launches-title"
    >
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <div className="grid gap-8 border border-border bg-bg-secondary p-6 md:grid-cols-[0.75fr_1.25fr] md:items-stretch md:p-8">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <SectionLabel label="Focused launches" className="mb-4" />
                <h2
                  id="focused-launches-title"
                  className="font-syne text-2xl font-bold text-text-primary md:text-3xl"
                >
                  Focused pages for focused outcomes.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
                  I also design focused, conversion-led landing pages for
                  bookings, launches, events, and service businesses—built to
                  move visitors toward one clear action.
                </p>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                One page · One audience · One conversion goal
              </p>
            </div>

            <a
              href="https://kb-s-booking-site.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the live KB La Maestea DJ booking landing page"
              className="group grid min-h-80 cursor-pointer overflow-hidden border border-border bg-[#0c0712] transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:grid-cols-[1fr_0.72fr]"
            >
              <div className="relative flex min-h-64 flex-col justify-between overflow-hidden p-6 sm:min-h-80">
                <div
                  className="absolute inset-0 opacity-70"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 55%, rgba(134, 62, 180, .42), transparent 34%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
                    backgroundSize: "auto, 36px 36px, 36px 36px",
                  }}
                />
                <div className="relative">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d6a6db]">
                    DJ booking experience
                  </p>
                  <h3 className="mt-4 font-syne text-3xl font-black leading-[0.92] text-white sm:text-4xl">
                    KB LA
                    <br />
                    MAESTEA
                  </h3>
                </div>

                <div className="relative flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                      Now spinning
                    </p>
                    <p className="mt-1 font-syne text-sm font-bold text-white/90">
                      The Experience
                    </p>
                  </div>
                  <svg
                    className="h-12 w-20 text-[#d6a6db]"
                    viewBox="0 0 80 48"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 35c9 0 9-18 18-18s9 23 18 23 9-31 18-31 9 20 22 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-white/10 bg-[#160b21] p-6 sm:border-l sm:border-t-0">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d6a6db]">
                    Booking console
                  </p>
                  <p className="mt-3 font-syne text-xl font-bold text-white">
                    Lock in your date
                  </p>

                  <div className="mt-6 flex gap-2" aria-hidden="true">
                    {[0, 1, 2, 3].map((step) => (
                      <span
                        key={step}
                        className={`h-1 flex-1 ${
                          step === 0 ? "bg-[#d6a6db]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 space-y-3" aria-hidden="true">
                    <span className="block h-10 rounded-sm border border-white/10 bg-white/[0.025]" />
                    <span className="block h-10 rounded-sm border border-white/10 bg-white/[0.025]" />
                    <div className="flex flex-wrap gap-2">
                      <span className="h-7 w-20 rounded-full border border-white/10" />
                      <span className="h-7 w-24 rounded-full border border-white/10" />
                      <span className="h-7 w-16 rounded-full border border-white/10" />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                    <span>Multi-step UX</span>
                    <span aria-hidden="true">·</span>
                    <span>Spotify</span>
                    <span aria-hidden="true">·</span>
                    <span>Responsive</span>
                  </div>
                  <p className="mt-4 font-mono text-[10px] text-[#d6a6db] transition-colors group-hover:text-white">
                    View live landing page <span aria-hidden="true">↗</span>
                  </p>
                </div>
              </div>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

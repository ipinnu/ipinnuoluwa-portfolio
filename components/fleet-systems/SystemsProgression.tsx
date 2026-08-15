import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import { maturityStages } from "@/lib/fleet-systems";
import EvidenceBadge from "./EvidenceBadge";
import MediaEvidence from "./MediaEvidence";

export default function SystemsProgression() {
  return (
    <section
      id="product-thesis"
      aria-labelledby="product-thesis-title"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="mx-auto max-w-content px-6">
        <FadeUp>
          <div className="grid gap-8 md:grid-cols-[0.72fr_1.28fr] md:items-end">
            <div>
              <SectionLabel label="Product thesis" className="mb-5" />
              <h2
                id="product-thesis-title"
                className="font-syne text-4xl font-black leading-[0.98] text-text-primary md:text-6xl"
              >
                From seeing the fleet to moving it intelligently.
              </h2>
            </div>
            <div className="border-l-2 border-neon pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                The way I think this category matures
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                This is my product thesis—not a disclosed employer roadmap.
                Each stage should remove a more expensive layer of operational
                uncertainty: first visibility, then context, then coordinated
                action.
              </p>
            </div>
          </div>
        </FadeUp>

        <div className="mt-16 space-y-16 md:mt-24 md:space-y-28">
          {maturityStages.map((stage, stageIndex) => (
            <article
              key={stage.version}
              className={
                stage.media.length > 0
                  ? "relative grid gap-8 md:grid-cols-[0.72fr_1.28fr] md:gap-12"
                  : "relative max-w-3xl"
              }
            >
              <FadeUp className="md:sticky md:top-28 md:self-start">
                <div className="flex items-start justify-between gap-4 border-t border-border pt-5">
                  <span className="font-mono text-5xl font-medium tracking-[-0.08em] text-white/[0.12] md:text-7xl">
                    {stage.version}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-text-tertiary">
                    0{stageIndex + 1} / 03
                  </span>
                </div>
                <EvidenceBadge status={stage.status} className="mt-7" />
                <h3 className="mt-5 font-syne text-3xl font-black text-text-primary md:text-4xl">
                  {stage.name}
                </h3>
                <p className="mt-2 font-syne text-xl font-semibold text-accent">
                  {stage.promise}
                </p>
                <p className="mt-6 max-w-lg text-base leading-7 text-text-secondary">
                  {stage.summary}
                </p>

                <ul className="mt-7 space-y-3" aria-label={`${stage.name} capabilities`}>
                  {stage.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex gap-3 text-sm leading-6 text-text-secondary"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-neon" />
                      {capability}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border border-accent/20 bg-accent/[0.045] p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                    Operational value
                  </p>
                  <p className="mt-3 text-sm leading-6 text-text-primary">
                    {stage.businessValue}
                  </p>
                </div>
              </FadeUp>

              {stage.media.length > 0 && (
                <FadeUp delay={0.08}>
                  <div className="space-y-5">
                    {stage.media.map((item, mediaIndex) => (
                      <MediaEvidence
                        key={item.id}
                        item={item}
                        featured={mediaIndex === 0}
                      />
                    ))}
                  </div>
                </FadeUp>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


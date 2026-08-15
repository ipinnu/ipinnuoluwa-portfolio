import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import CompanyFitCarousel from "@/components/fleet-systems/CompanyFitCarousel";
import EvidenceBadge from "@/components/fleet-systems/EvidenceBadge";
import MediaEvidence from "@/components/fleet-systems/MediaEvidence";
import SystemsProgression from "@/components/fleet-systems/SystemsProgression";
import {
  architectureDecisions,
  erpMedia,
  systemProof,
} from "@/lib/fleet-systems";

export const metadata: Metadata = {
  title: "Fleet & Logistics Systems Engineering",
  description:
    "A focused case study on engineering multi-tenant fleet visibility, telemetry integrations, field operations tools, and the path from visibility to automation across 3,000+ vehicles.",
  openGraph: {
    title: "Fleet & Logistics Systems Engineering | Ipinnuoluwa Oladipo",
    description:
      "Shipped fleet systems, operational engineering decisions, and a product thesis for what comes next.",
    type: "article",
    url: "/work/fleet-systems",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fleet & Logistics Systems Engineering",
    description:
      "Shipped fleet systems, operational engineering decisions, and a product thesis for what comes next.",
  },
};

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function FleetSystemsPage() {
  return (
    <article className="overflow-hidden bg-bg-primary">
      <header className="glow-top grid-bg relative border-b border-border pb-20 pt-36 md:pb-28 md:pt-44">
        <div
          className="pointer-events-none absolute right-[-12rem] top-28 h-[28rem] w-[28rem] rounded-full border border-accent/10"
          aria-hidden="true"
        >
          <div className="absolute inset-16 rounded-full border border-neon/10" />
          <div className="absolute inset-32 rounded-full border border-accent/15" />
        </div>

        <div className="relative mx-auto max-w-content px-6">
          <FadeUp>
            <Link
              href="/work"
              className="inline-flex min-h-11 cursor-pointer items-center font-mono text-xs text-text-tertiary transition-colors duration-200 hover:text-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
            >
              ← Back to work
            </Link>

            <div className="mt-10 grid gap-12 md:grid-cols-[1.3fr_0.7fr] md:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_18px_rgba(232,255,71,.65)]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                    Enterprise fleet & logistics
                  </p>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-tertiary">
                    Focused engineering case study
                  </span>
                </div>

                <h1 className="mt-7 max-w-5xl font-syne text-5xl font-black leading-[0.9] tracking-[-0.045em] text-text-primary sm:text-6xl md:text-[5.5rem]">
                  Fleet systems that move from signal to decision.
                </h1>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-text-secondary md:text-xl">
                  I engineer multi-tenant dashboards, telemetry pipelines,
                  driver-risk tooling, and field operations products for
                  enterprise fleets in oil & gas and logistics.
                </p>
              </div>

              <div className="border-l border-border pl-6">
                <p className="font-mono text-5xl font-medium tracking-[-0.06em] text-neon md:text-6xl">
                  3,000+
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-text-secondary">
                  vehicles within the operational footprint of systems I work
                  with.
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">
              {systemProof.map((proof) => (
                <div key={proof.value} className="bg-bg-secondary p-6">
                  <p className="font-syne text-xl font-bold text-text-primary">
                    {proof.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {proof.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </header>

      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto grid max-w-content gap-10 px-6 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <FadeUp>
            <SectionLabel label="How I work" className="mb-5" />
            <h2 className="font-syne text-3xl font-black leading-tight text-text-primary md:text-4xl">
              How I work within a product team.
            </h2>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="max-w-3xl">
              <p className="text-xl leading-8 text-text-primary">
                I collaborate across engineering, product, design, and
                operations—balancing technical trade-offs with product scope
                and delivery timelines. I communicate and document progress
                clearly, and own features through to production.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {["Discover", "Architect", "Deliver", "Validate"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="border border-border bg-bg-secondary p-4"
                    >
                      <span className="font-mono text-[9px] text-neon">
                        0{index + 1}
                      </span>
                      <p className="mt-4 font-syne text-sm font-bold text-text-primary">
                        {step}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section
        id="shipped-system"
        aria-labelledby="shipped-system-title"
        className="py-20 md:py-28"
      >
        <div className="mx-auto max-w-content px-6">
          <FadeUp>
            <div className="flex flex-col gap-7 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <EvidenceBadge status="Shipped · Anonymized" />
                <SectionLabel label="Primary proof" className="mb-5 mt-8" />
                <h2
                  id="shipped-system-title"
                  className="max-w-4xl font-syne text-4xl font-black leading-[0.98] text-text-primary md:text-6xl"
                >
                  One operational view from fragmented fleet signals.
                </h2>
              </div>
              <p className="max-w-md text-base leading-7 text-text-secondary">
                Built for enterprise fleet operators in oil & gas and
                logistics. Client identities, branding, and operational data
                remain private.
              </p>
            </div>
          </FadeUp>

          <div className="mt-12 grid gap-8 md:grid-cols-[0.78fr_1.22fr] md:gap-16">
            <FadeUp>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                  The operational problem
                </p>
                <p className="mt-5 text-xl leading-8 text-text-primary">
                  I inherited fragmented telemetry—inconsistent JSON payloads
                  across providers, no shared operational view, and reporting
                  that ate the time meant for exceptions.
                </p>
                <p className="mt-6 text-base leading-7 text-text-secondary">
                  I ingested those dumps first, moved the store to SQLite when
                  file queries stalled, then hit write locks under concurrent
                  dashboard reads and migrated to Postgres. Four enterprise
                  tenants ran on a DigitalOcean Basic droplet—1 vCPU, 1 GB RAM,
                  25 GB disk, ~$6/mo—until memory and I/O became the
                  bottleneck. I right-sized to 2 vCPU / 4 GB / 80 GB / 4 TB
                  transfer at $24/mo, keeping tenant isolation and
                  rate-limited provider sync without overspending.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <div className="border border-border bg-bg-secondary">
                <div className="border-b border-border p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-text-tertiary">
                    Signal path
                  </p>
                </div>
                <div className="grid gap-px bg-border sm:grid-cols-4">
                  {[
                    ["01", "Provider JSON"],
                    ["02", "SQLite"],
                    ["03", "Postgres"],
                    ["04", "Four tenant dashboards"],
                  ].map(([index, label]) => (
                    <div key={index} className="bg-[#0d0f0e] p-5">
                      <span className="font-mono text-[9px] text-neon">
                        {index}
                      </span>
                      <p className="mt-8 text-sm leading-5 text-text-primary">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          <div className="mt-16">
            <FadeUp>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                The decisions that made it dependable
              </p>
            </FadeUp>
            <div className="mt-6 grid gap-px bg-border lg:grid-cols-3">
              {architectureDecisions.map((decision, index) => (
                <FadeUp key={decision.index} delay={index * 0.06}>
                  <article className="h-full bg-bg-secondary p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-neon">
                        {decision.index}
                      </span>
                      <span className="h-px w-12 bg-border" />
                    </div>
                    <h3 className="mt-10 font-syne text-xl font-bold text-text-primary">
                      {decision.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-text-secondary">
                      {decision.description}
                    </p>
                    <p className="mt-8 border-t border-border pt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                      {decision.impact}
                    </p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp>
            <div className="mt-12 border-l-2 border-neon bg-neon/[0.035] p-6 md:p-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-neon">
                The result
              </p>
              <p className="mt-4 max-w-4xl font-syne text-2xl font-bold leading-snug text-text-primary md:text-3xl">
                A reusable operational foundation that helps teams see fleet
                state, surface risk, and produce reporting without rebuilding
                the product for every enterprise environment.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section
        aria-labelledby="check-in-title"
        className="border-y border-border bg-bg-secondary/40 py-20 md:py-28"
      >
        <div className="mx-auto max-w-content px-6">
          <FadeUp>
            <EvidenceBadge status="Shipped · Anonymized" />
            <SectionLabel label="Field operations" className="mb-5 mt-8" />
            <h2
              id="check-in-title"
              className="max-w-4xl font-syne text-3xl font-black leading-tight text-text-primary md:text-5xl"
            >
              Replace the daily chase with a habit people can complete.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-text-secondary">
              Phone calls and spreadsheets made field status slow to collect,
              inconsistent to interpret, and difficult to audit. The check-in
              app turns that fragmented routine into a short, repeatable
              mobile workflow.
            </p>
            <div className="mt-8 max-w-xl border border-border bg-bg-primary p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                Adoption principle
              </p>
              <p className="mt-3 text-sm leading-6 text-text-primary">
                Ask only for what operations needs, make exceptions easy to
                explain, and confirm clearly that the update was received.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <SystemsProgression />

      <section
        aria-labelledby="next-systems-title"
        className="border-t border-border bg-bg-secondary/35 py-20 md:py-28"
      >
        <div className="mx-auto max-w-content px-6">
          <FadeUp>
            <SectionLabel label="What comes next" className="mb-5" />
            <h2
              id="next-systems-title"
              className="max-w-4xl font-syne text-4xl font-black leading-[0.98] text-text-primary md:text-6xl"
            >
              Connect the vehicle record to the whole operation.
            </h2>
          </FadeUp>

          <FadeUp>
            <div className="mt-12 max-w-3xl">
              <EvidenceBadge status="In development · Concept stage" />
              <h3 className="mt-6 font-syne text-2xl font-bold text-text-primary">
                A fleet/logistics ERP concept
              </h3>
              <p className="mt-5 text-base leading-7 text-text-secondary">
                Fleet operations often split maintenance, compliance,
                dispatch, cost, and incident records across disconnected
                tools. The concept gives every vehicle one operational
                history, so a decision is made with the full asset context
                rather than whichever spreadsheet was opened first.
              </p>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-text-tertiary">
                No delivery timeline is being announced.
              </p>
            </div>
          </FadeUp>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {erpMedia.map((item, index) => (
              <MediaEvidence
                key={item.id}
                item={item}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="scenario-title"
        className="border-t border-border py-20 md:py-28"
      >
        <div className="mx-auto max-w-content px-6">
          <FadeUp>
            <div className="border border-neon/25 bg-neon/[0.035] p-5 sm:p-6">
              <EvidenceBadge status="Unaffiliated personal concept" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                Not built for or with Shell. No affiliation or endorsement is
                implied.
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-10 max-w-3xl">
              <SectionLabel label="Applied reimagining" className="mb-5" />
              <h2
                id="scenario-title"
                className="font-syne text-3xl font-black leading-tight text-text-primary md:text-5xl"
              >
                What this thesis could look like in a distributed energy fleet.
              </h2>
              <p className="mt-6 text-base leading-7 text-text-secondary">
                The Shell-context exploration is an honest personal concept: a
                recognizable operating environment used to make the systems
                thinking concrete. It does not claim access to Shell data,
                products, or internal operations.
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <CompanyFitCarousel />
          </FadeUp>
        </div>
      </section>

      <section className="glow-top grid-bg relative border-t border-border py-24 md:py-32">
        <div className="relative mx-auto max-w-content px-6">
          <FadeUp>
            <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                  Direct line
                </p>
                <h2 className="mt-6 max-w-4xl font-syne text-4xl font-black leading-[0.98] text-text-primary md:text-6xl">
                  Building or scaling fleet technology?
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                  If the team needs an engineer who can connect telemetry,
                  product decisions, and day-to-day operations, let&apos;s talk
                  systems.
                </p>
              </div>

              <a
                href="mailto:ipinnuoluwa@gmail.com?subject=Fleet%20systems%20conversation"
                className="group inline-flex min-h-14 cursor-pointer items-center justify-between gap-8 bg-neon px-6 py-4 font-syne text-sm font-bold text-bg-primary transition-colors duration-200 hover:bg-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
              >
                Email Ipinnuoluwa directly
                <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </article>
  );
}


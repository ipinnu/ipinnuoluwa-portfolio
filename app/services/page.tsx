import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Flutter mobile app development, Next.js web frontend, and product consulting for startups and SMEs.",
};

const services = [
  {
    id: "mobile",
    label: "01",
    title: "Mobile App Development",
    audience: "Startups, founders, SMEs with a validated idea",
    description:
      "I build cross-platform mobile apps with Flutter (Android + iOS) or React Native — from wireframe to store submission. You get one codebase, two platforms, and a developer who's done this end-to-end.",
    includes: [
      "Flutter (Android + iOS) or React Native",
      "Firebase / Supabase backend integration",
      "State management (Bloc, Riverpod, or Context)",
      "Play Store & App Store submission",
      "CI/CD pipeline setup with GitHub Actions",
    ],
    model: "Project-based · Discovery call first",
    pricing: "From $2,000 · From ₦2,000,000",
  },
  {
    id: "web",
    label: "02",
    title: "Web Frontend Development",
    audience: "Businesses needing a web presence or internal tool",
    description:
      "Next.js and React applications that are fast, accessible, and built to last. I care about performance scores, not just how it looks in Figma. Every component is typed, tested, and ready for production.",
    includes: [
      "Next.js / React application",
      "Responsive, mobile-first design",
      "Framer Motion animations",
      "REST API / Supabase integration",
      "Performance & accessibility audit",
    ],
    model: "Project-based · Discovery call first",
    pricing: "From $800 · From ₦800,000",
  },
  {
    id: "consulting",
    label: "03",
    title: "Product & Tech Consulting",
    audience: "SMEs, NGOs, early-stage companies without a technical co-founder",
    description:
      "You have the idea and the business. I'll help you figure out the tech. From setting up Microsoft 365 for your whole team to scoping a product roadmap — I've done it for NGOs and startups, and I'll do it for you.",
    includes: [
      "Business tech setup (M365, internal tools, workflows)",
      "Product scoping & roadmap development",
      "Team setup & advisory for early engineering",
      "Existing codebase review & tech debt audit",
      "Vendor selection & integration planning",
    ],
    model: "Project-based or advisory retainer · Discovery call first",
    pricing: "From $500 · From ₦500,000",
  },
];

const processSteps = [
  { phase: "Discovery", duration: "Day 1", description: "We talk through your project on a free 30-min call." },
  { phase: "Proposal", duration: "3 days", description: "I send a written scope, timeline, and price. No surprises." },
  { phase: "Build", duration: "2–8 weeks", description: "Weekly updates. You're never left wondering what's happening." },
  { phase: "Review", duration: "1 week", description: "You test everything. We fix, refine, and polish together." },
  { phase: "Handoff", duration: "Final day", description: "Full code ownership, documentation, and walkthrough." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="What I offer" className="mb-6" />
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6">
              Services
            </h1>
            <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
              I take projects from idea to shipped. Whether you need a mobile
              app, a web product, or someone to help you think through the
              technology — I can help.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-20 md:py-32">
        <div className="max-w-content mx-auto px-6 space-y-0">
          {services.map((service, i) => (
            <FadeUp key={service.id} delay={i * 0.1}>
              <div
                id={service.id}
                className="border-b border-border py-16 grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div>
                  <span className="font-mono text-xs text-accent block mb-4">
                    {service.label}
                  </span>
                  <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-4">
                    {service.title}
                  </h2>
                  <p className="font-mono text-xs text-text-tertiary mb-6">
                    For: {service.audience}
                  </p>
                  <p className="text-text-secondary leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="font-mono text-xs text-text-tertiary">
                      {service.model}
                    </p>
                    <p className="font-syne font-semibold text-lg text-text-primary">
                      {service.pricing}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-6">
                    What&apos;s included
                  </p>
                  <ul className="space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="text-accent mt-0.5 flex-shrink-0">
                          →
                        </span>
                        <span className="text-text-secondary text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Link
                      href="/hire"
                      className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold text-sm px-6 py-3 rounded-sm hover:bg-accent-dim transition-colors"
                    >
                      Start a project →
                    </Link>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* How I Work */}
      <section className="py-20 md:py-32 border-t border-border bg-bg-secondary">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="The process" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-4">
              How I work
            </h2>
            <p className="text-text-secondary mb-16 max-w-xl">
              No ghosting. No scope creep surprises. Clear communication
              throughout.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border">
            {processSteps.map((step, i) => (
              <FadeUp key={step.phase} delay={i * 0.08}>
                <div className="bg-bg-secondary p-6 h-full">
                  <span className="font-mono text-xs text-text-tertiary block mb-1">
                    {step.duration}
                  </span>
                  <h3 className="font-syne font-semibold text-sm text-accent mb-3">
                    {step.phase}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

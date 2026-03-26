import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Flutter mobile app development, full website development with Next.js, AWS & Firebase, and product consulting for startups and SMEs.",
};

const services = [
  {
    id: "enterprise",
    label: "00",
    title: "Enterprise Business Systems",
    audience: "Established businesses, SMEs, and organisations replacing legacy tools or building operational infrastructure",
    description:
      "A custom internal platform built around how your business actually runs. Multi-role dashboards, workflow tools, real-time data and the cloud infrastructure to support it. For businesses that have outgrown spreadsheets and off-the-shelf software.",
    includes: [
      "Custom multi-role platform (admin, staff, management views)",
      "Real-time data dashboards & reporting",
      "Role-based access control & authentication",
      "AWS enterprise deployment (VPC, RDS, auto-scaling)",
      "CRM / ERP integration (HubSpot, Salesforce, or custom)",
      "Audit logs, compliance & data export features",
      "Staff onboarding, documentation & training",
      "6 months dedicated post-launch support",
    ],
    model: "Project-based · Fixed scope · Discovery call first",
    pricing: "From £2,500",
    anchor: true,
    premium: true,
  },
  {
    id: "anchor",
    label: "01",
    title: "Internal Tools & Dashboards",
    audience: "Startups and growing teams who need custom tooling without enterprise overhead",
    description:
      "Custom web apps for teams. Admin panels, operations dashboards, workflow tools, internal portals. The kind of thing that replaces five spreadsheets and a WhatsApp group.",
    includes: [
      "Custom Next.js web application",
      "Admin panel & data dashboard",
      "User authentication & role management",
      "AWS or Firebase backend & hosting",
      "REST API or database integration",
      "Domain setup & SSL configuration",
      "3 months post-launch support",
    ],
    model: "Project-based · Fixed scope · Discovery call first",
    pricing: "From £900",
    anchor: true,
    premium: false,
  },
  {
    id: "mobile",
    label: "02",
    title: "Mobile App Development",
    audience: "Startups, founders, SMEs with a validated idea",
    description:
      "I build cross-platform mobile apps with Flutter or React Native. One codebase, Android and iOS, from wireframe to store submission. I have done this end to end.",
    includes: [
      "Flutter (Android + iOS) or React Native",
      "Firebase / Supabase backend integration",
      "State management (Bloc, Riverpod, or Context)",
      "Play Store & App Store submission",
      "CI/CD pipeline setup with GitHub Actions",
    ],
    model: "Project-based · Discovery call first",
    pricing: "From £400",
    anchor: false,
    premium: false,
  },
  {
    id: "web",
    label: "03",
    title: "Full Website Development",
    audience: "Businesses needing a web presence or internal tool",
    description:
      "Full websites and web apps. Frontend in Next.js and React, backend on AWS or Firebase, deployed and production-ready. Not just the UI.",
    includes: [
      "Next.js / React application",
      "AWS (S3, EC2, Lambda, Amplify) deployment",
      "Firebase (Auth, Firestore, Hosting) integration",
      "REST API / Supabase backend integration",
      "Responsive, mobile-first design",
      "Performance & accessibility audit",
      "Domain setup & hosting configuration",
    ],
    model: "Project-based · Discovery call first",
    pricing: "From £300",
    anchor: false,
    premium: false,
  },
  {
    id: "consulting",
    label: "04",
    title: "Product & Tech Consulting",
    audience: "SMEs, NGOs, early-stage companies without a technical co-founder",
    description:
      "You have the business. I help with the tech side. Setting up tools, scoping products, reviewing codebases. I have done it for NGOs, startups and growing teams.",
    includes: [
      "Business tech setup (M365, internal tools, workflows)",
      "Product scoping & roadmap development",
      "Team setup & advisory for early engineering",
      "Existing codebase review & tech debt audit",
      "Vendor selection & integration planning",
    ],
    model: "Project-based or advisory retainer · Discovery call first",
    pricing: "From £150",
    anchor: false,
    premium: false,
  },
];

const processSteps = [
  { phase: "Discovery", duration: "Day 1", description: "We go through your project on a 30-minute call." },
  { phase: "Proposal", duration: "3 days", description: "I send a written scope, timeline and price." },
  { phase: "Build", duration: "2–8 weeks", description: "Weekly updates so you always know what is happening." },
  { phase: "Review", duration: "1 week", description: "You test it. We fix what needs fixing." },
  { phase: "Handoff", duration: "Final day", description: "Full code ownership, docs and a walkthrough." },
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
              I take projects from idea to shipped. Mobile app, web product
              or tech guidance. I can help with all of it.
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
                className={`border-b border-border py-16 grid grid-cols-1 md:grid-cols-2 gap-12 ${
                  service.premium ? "pl-6 border-l-2 border-l-accent" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-accent">
                      {service.label}
                    </span>
                    {service.premium && (
                      <span className="font-mono text-[10px] text-bg-primary bg-accent px-2 py-0.5 rounded-sm">
                        Premium
                      </span>
                    )}
                    {service.anchor && !service.premium && (
                      <span className="font-mono text-[10px] text-accent border border-accent/40 px-2 py-0.5 rounded-sm">
                        Popular
                      </span>
                    )}
                  </div>
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
                    <p className={`font-syne font-semibold text-lg ${service.anchor ? "text-accent" : "text-text-primary"}`}>
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

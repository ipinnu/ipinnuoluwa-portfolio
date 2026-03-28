import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Systems architecture, enterprise product engineering, mobile platform development, and technical advisory. Built for operators who need serious infrastructure.",
};

const services = [
  {
    id: "architecture",
    label: "01",
    title: "Systems Architecture & Strategy",
    audience: "Founders, operators, and businesses investing in serious infrastructure",
    description:
      "Before a line of code is written, the system must be understood. I diagnose your current state, identify structural gaps, and design the complete system — data models, component relationships, integration points, and operational flows. This is the work that makes everything else coherent.",
    includes: [
      "Current-state audit and gap analysis",
      "System architecture design (data models, APIs, flows)",
      "Technology selection and infrastructure specification",
      "Integration architecture (third-party tools and APIs)",
      "Technical roadmap with phased delivery plan",
      "Architecture documentation for internal teams",
    ],
    model: "Fixed-scope engagement · Discovery first",
    pricing: "From £800",
    anchor: false,
    premium: true,
  },
  {
    id: "enterprise",
    label: "02",
    title: "Enterprise Product Engineering",
    audience: "Established businesses replacing legacy tools or building operational infrastructure",
    description:
      "A custom operational platform built around how your business actually runs. Multi-role dashboards, workflow engines, real-time data, and the cloud infrastructure to support it at scale. For businesses that have outgrown off-the-shelf software.",
    includes: [
      "Custom multi-role platform (admin, staff, management views)",
      "Real-time data dashboards and reporting",
      "Role-based access control and authentication",
      "AWS enterprise deployment (VPC, RDS, auto-scaling)",
      "CRM / ERP integration or custom-built equivalent",
      "Audit logs, compliance, and data export",
      "Staff onboarding, documentation, and training",
      "6 months dedicated post-launch support",
    ],
    model: "Project-based · Fixed scope · Discovery first",
    pricing: "From £2,500",
    anchor: true,
    premium: false,
  },
  {
    id: "internal-tools",
    label: "03",
    title: "Internal Tools & Web Systems",
    audience: "Growing teams that need custom tooling without enterprise overhead",
    description:
      "Custom web applications for teams who have outgrown spreadsheets. Admin panels, operations dashboards, workflow tools, internal portals. Built with Next.js, deployed to production, handed over with full documentation.",
    includes: [
      "Custom Next.js web application",
      "Admin panel and data dashboard",
      "User authentication and role management",
      "AWS or Firebase backend and hosting",
      "REST API or database integration",
      "Domain setup and SSL",
      "3 months post-launch support",
    ],
    model: "Project-based · Fixed scope · Discovery first",
    pricing: "From £900",
    anchor: false,
    premium: false,
  },
  {
    id: "mobile",
    label: "04",
    title: "Mobile Platform Development",
    audience: "Startups and founders with a validated product idea",
    description:
      "Cross-platform mobile applications built with Flutter or React Native. One codebase, both stores. I handle architecture, state management, backend integration, and submission — end to end.",
    includes: [
      "Flutter (Android + iOS) or React Native",
      "Firebase or Supabase backend integration",
      "State management (Bloc, Riverpod, or Context)",
      "Play Store and App Store submission",
      "CI/CD pipeline with GitHub Actions",
    ],
    model: "Project-based · Discovery first",
    pricing: "From £400",
    anchor: false,
    premium: false,
  },
  {
    id: "advisory",
    label: "05",
    title: "Technical Advisory",
    audience: "Founders and SMEs without a technical co-founder",
    description:
      "Embedded strategic guidance on the technical side of your business. I help you make better decisions — on tooling, vendors, product scope, and engineering structure — so you stop paying the cost of uninformed choices.",
    includes: [
      "Business technology audit and recommendations",
      "Product scoping and roadmap development",
      "Early engineering team structure and hiring guidance",
      "Codebase review and technical debt assessment",
      "Vendor and integration selection",
    ],
    model: "Project-based or monthly retainer · Discovery first",
    pricing: "From £150",
    anchor: false,
    premium: false,
  },
];

const processSteps = [
  { phase: "Diagnose", duration: "Day 1", description: "20-minute call to map your current state, goals, and constraints. I will tell you plainly if I can help." },
  { phase: "Architect", duration: "3–5 days", description: "I design the system and send a written scope, architecture, timeline, and fixed price." },
  { phase: "Build", duration: "2–8 weeks", description: "Precision implementation with weekly checkpoints. No surprises." },
  { phase: "Validate", duration: "1 week", description: "You test against real conditions. We address what needs fixing before anything ships." },
  { phase: "Transfer", duration: "Final day", description: "Full code ownership, documentation, and a walkthrough. You own everything." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Capabilities" className="mb-6" />
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6">
              What I build
            </h1>
            <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
              I operate across strategy, engineering, and platforms. Each
              engagement begins with understanding your system — not your
              budget.
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
                    <a
                      href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Brief%20overview%3A%20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold text-sm px-6 py-3 rounded-sm hover:bg-accent-dim transition-colors"
                    >
                      Start a Project →
                    </a>
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
            <SectionLabel label="The method" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-4">
              Operating framework
            </h2>
            <p className="text-text-secondary mb-16 max-w-xl">
              Every engagement follows the same five-phase structure. Process
              is not a formality — it is how quality gets reproduced.
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

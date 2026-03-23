import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mechanical Engineering graduate turned mobile and product engineer. Based in Lagos, building for the world.",
};

const experience = [
  {
    role: "Technical Officer",
    company: "iNSDEC",
    period: "2025 – Present",
    description:
      "Deployed Microsoft 365 for the entire organisation, built internal workflow tools, and shipped the company website.",
  },
  {
    role: "Product Manager + Flutter Contributor",
    company: "Autodrive",
    period: "2023 – 2025",
    description:
      "Led the product through two years of development — roadmap, sprints, and direct code contributions — to Play Store launch.",
  },
  {
    role: "Frontend Engineer",
    company: "HermexTravels",
    period: "2024",
    description:
      "Built responsive Flutter UI components and REST API integrations for a travel booking platform.",
  },
];

const education = [
  {
    degree: "B.Eng Mechanical Engineering",
    institution: "Covenant University",
    period: "Graduated 2024",
  },
  {
    degree: "Flutter Development Bootcamp",
    institution: "London App Brewery",
    period: "2023",
  },
];

const stack = [
  "Flutter",
  "React Native",
  "Next.js",
  "React",
  "TypeScript",
  "Firebase",
  "Supabase",
  "AWS",
  "Bloc",
  "Riverpod",
  "Framer Motion",
  "GitHub Actions",
  "Microsoft 365",
  "PostgreSQL",
];

const values = [
  {
    statement: "I ship. Not just prototype.",
    detail:
      "Ideas are cheap. The Play Store is crowded with almost-finished apps. I care about the last 20% — the part that gets it live.",
  },
  {
    statement: "I communicate clearly, even when it's hard.",
    detail:
      "If something is going wrong or taking longer than expected, I tell you. You'll never be left guessing.",
  },
  {
    statement: "I build for users, not portfolios.",
    detail:
      "Every design decision starts with the user who will actually touch this product. Not what looks good in a screenshot.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeUp>
              <SectionLabel label="About" className="mb-6" />
              <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-8">
                The person
                <br />
                <span className="text-accent">behind the code</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  I studied Mechanical Engineering at Covenant University in
                  Nigeria — which taught me to think in systems, not just
                  features. When I discovered I could build the software I was
                  designing on paper, I never looked back.
                </p>
                <p>
                  I&apos;m based in Lagos, building mobile apps and web
                  products for Nigerian startups, SMEs, and international
                  remote clients. Every project I take on gets shipped. That&apos;s
                  the standard.
                </p>
                <p>
                  When I&apos;m not writing code, I&apos;m documenting what I
                  learn — because the best way to understand something is to
                  explain it clearly.
                </p>
              </div>
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 mt-8 bg-accent text-bg-primary font-syne font-semibold text-sm px-6 py-3 rounded-sm hover:bg-accent-dim transition-colors"
              >
                Work with me →
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="How I work" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
              What I stand for
            </h2>
          </FadeUp>

          <div className="space-y-px bg-border">
            {values.map((value, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-bg-primary p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 group hover:bg-bg-secondary transition-colors">
                  <h3 className="font-syne font-bold text-xl text-text-primary group-hover:text-accent transition-colors">
                    &ldquo;{value.statement}&rdquo;
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.detail}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Experience timeline */}
            <div>
              <FadeUp>
                <SectionLabel label="Experience" className="mb-10" />
              </FadeUp>
              <div className="space-y-10">
                {experience.map((item, i) => (
                  <FadeUp key={i} delay={i * 0.1}>
                    <div className="grid grid-cols-[auto_1fr] gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        {i < experience.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className="font-mono text-xs text-text-tertiary mb-1">
                          {item.period}
                        </p>
                        <h3 className="font-syne font-semibold text-text-primary mb-0.5">
                          {item.role}
                        </h3>
                        <p className="font-mono text-xs text-accent mb-3">
                          {item.company}
                        </p>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

            {/* Education + CV */}
            <div>
              <FadeUp>
                <SectionLabel label="Education" className="mb-10" />
              </FadeUp>
              <div className="space-y-6 mb-12">
                {education.map((item, i) => (
                  <FadeUp key={i} delay={i * 0.1}>
                    <div className="border-l-2 border-border pl-6 hover:border-accent transition-colors">
                      <p className="font-mono text-xs text-text-tertiary mb-1">
                        {item.period}
                      </p>
                      <h3 className="font-syne font-semibold text-text-primary mb-0.5">
                        {item.degree}
                      </h3>
                      <p className="font-mono text-xs text-text-secondary">
                        {item.institution}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={0.2}>
                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center gap-2 border border-border text-text-primary font-syne font-medium text-sm px-6 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
                >
                  Download CV ↓
                </a>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Tools" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-12">
              Tech stack
            </h2>
          </FadeUp>

          <div className="flex flex-wrap gap-3">
            {stack.map((tech, i) => (
              <FadeUp key={tech} delay={i * 0.03}>
                <span className="font-mono text-sm text-text-secondary border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors cursor-default">
                  {tech}
                </span>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

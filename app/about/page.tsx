import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Systems architect and product engineer. Mechanical Engineering background, operating at the intersection of structure and software. Based in Lagos.",
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
      "Handled roadmap, sprint planning and direct code contributions. Shipped the product to the Play Store.",
  },
  {
    role: "Frontend Engineer",
    company: "HermexTravels",
    period: "2024",
    description:
      "Built the Flutter front end for a travel platform spanning trip planning, flight and hotel booking, visa support, and booking management. Developed reusable responsive components, integrated REST APIs, handled asynchronous UI states, and optimised data-heavy search results for a smoother production mobile experience.",
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
    statement: "Structure first. Code second.",
    detail:
      "A system without architecture is just a collection of files waiting to fail. I design the structure before anything is built — data flows, boundaries, dependencies. That is what makes scale possible.",
  },
  {
    statement: "Delivery is a professional obligation.",
    detail:
      "I do not build prototypes. I build systems that ship, run in production, and transfer cleanly. The last 20% that separates a demo from a product is where most of my attention goes.",
  },
  {
    statement: "No dependency. Full ownership.",
    detail:
      "Every engagement ends with the client owning everything: code, documentation, architecture decisions. I do not build systems that require me to maintain them unless that is the explicit arrangement.",
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
                Built on
                <br />
                <span className="text-accent">systems thinking</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  I studied Mechanical Engineering at Covenant University.
                  Engineering trains you to think in systems — loads,
                  constraints, failure points, tolerances. At some point I
                  realised I could build the systems I was drawing on paper.
                  That was the shift.
                </p>
                <p>
                  I operate at the intersection of architecture and
                  execution. I do not just write code — I design the
                  structure that makes it work under real conditions. Based
                  in Lagos, working with clients across Nigeria and
                  internationally.
                </p>
                <p>
                  Every engagement I take is documented, structured, and
                  delivered with full ownership transfer. I do not build
                  dependencies.
                </p>
              </div>
              <a
                href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Brief%20overview%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 bg-accent text-bg-primary font-syne font-semibold text-sm px-6 py-3 rounded-sm hover:bg-accent-dim transition-colors"
              >
                Start a Project →
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section
        className="py-20 md:py-28 border-b border-border"
        aria-labelledby="recognition-title"
      >
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="External validation" className="mb-10" />
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-10 lg:gap-16 items-start">
            <FadeUp>
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden border border-border bg-bg-secondary">
                  <Image
                    src="/images/recognition/tech-advantage-support-grant-2026.jpg"
                    alt="Top-five finalists at the 2026 Tech Advantage Support Grant at The Roundtable Lekki"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 62vw, 100vw"
                  />
                </div>
                <figcaption className="mt-4 max-w-3xl font-mono text-[11px] leading-relaxed text-text-tertiary">
                  Top-five finalists at The Roundtable Lekki · May 2026. The
                  session opened with Iyinoluwa Aboyeji, co-founder of Andela
                  and Flutterwave.
                </figcaption>
              </figure>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="lg:pt-2">
                <p className="font-mono text-sm tracking-[0.18em] text-accent mb-6">
                  03 / 70
                </p>
                <h2
                  id="recognition-title"
                  className="font-syne font-bold text-3xl md:text-4xl text-text-primary leading-tight mb-6"
                >
                  Third place in a field of 70.
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    At the 2026 Tech Advantage Support Grant, I represented the
                    only technology-led solution among the five finalists.
                  </p>
                  <p>
                    The competition tested the idea beyond the product itself:
                    its relevance, commercial potential, and ability to
                    communicate clearly under scrutiny.
                  </p>
                </div>
                <p className="mt-8 border-l-2 border-accent pl-4 font-mono text-xs uppercase tracking-[0.12em] leading-relaxed text-text-primary">
                  Only technology-led top-five solution
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Operating principles" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
              How I work
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

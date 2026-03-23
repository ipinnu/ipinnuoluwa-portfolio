import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import HireForm from "@/components/sections/HireForm";

export const metadata: Metadata = {
  title: "Hire Me",
  description:
    "Start a project with Ipinnuoluwa. Book a free discovery call or send project details.",
};

const nextSteps = [
  {
    step: "01",
    title: "I review your submission",
    description:
      "I read every submission personally. No automated filters.",
  },
  {
    step: "02",
    title: "I reply within 48 hours",
    description:
      "You'll hear from me within 2 business days — usually sooner.",
  },
  {
    step: "03",
    title: "We book a call",
    description:
      "If it's a good fit, we jump on a free 30-min discovery call.",
  },
];

export default function HirePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Let's work" className="mb-6" />
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6">
              Start a project
            </h1>
            <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
              Tell me what you&apos;re building. I&apos;ll tell you if I can
              help, how long it&apos;ll take, and what it&apos;ll cost.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-20 md:py-32">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">
            {/* Form */}
            <FadeUp>
              <h2 className="font-syne font-bold text-2xl text-text-primary mb-8">
                Project details
              </h2>
              <HireForm />
            </FadeUp>

            {/* Info panel */}
            <FadeUp delay={0.1}>
              <div className="space-y-8">
                {/* What happens next */}
                <div className="bg-bg-secondary border border-border p-8">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-6">
                    What happens next
                  </p>
                  <div className="space-y-6">
                    {nextSteps.map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <span className="font-mono text-xs text-accent flex-shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <div>
                          <p className="font-syne font-semibold text-sm text-text-primary mb-1">
                            {item.title}
                          </p>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response time */}
                <div className="bg-bg-secondary border border-border p-8">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    Response time
                  </p>
                  <p className="font-syne font-semibold text-text-primary mb-2">
                    Usually within 48 hours
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Preferred contact:{" "}
                    <a
                      href="mailto:ipinnuoluwa@gmail.com"
                      className="text-accent hover:underline"
                    >
                      ipinnuoluwa@gmail.com
                    </a>
                  </p>
                </div>

                {/* Book a call — Cal.com embed */}
                <div className="bg-bg-secondary border border-border p-8">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    Book a discovery call
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed mb-4">
                    Prefer to talk first? Book a free 30-minute call directly.
                  </p>
                  {/* Cal.com embed placeholder — replace NEXT_PUBLIC_CAL_USERNAME */}
                  <a
                    href={`https://cal.com/${process.env.NEXT_PUBLIC_CAL_USERNAME || "ipinnuoluwa"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border text-text-primary font-mono text-xs px-4 py-2.5 hover:border-accent hover:text-accent transition-colors"
                  >
                    Open calendar →
                  </a>
                </div>

                {/* Just saying hi */}
                <p className="text-text-tertiary text-xs leading-relaxed">
                  Not ready to commit?{" "}
                  <a
                    href="mailto:ipinnuoluwa@gmail.com"
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    Just say hi. →
                  </a>
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

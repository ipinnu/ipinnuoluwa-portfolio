import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

const steps = [
  { number: "01", title: "Discovery call", description: "We talk through your idea, goals, and constraints." },
  { number: "02", title: "Scope & proposal", description: "I send a clear proposal with scope, timeline, and price." },
  { number: "03", title: "Build", description: "Regular updates, no surprises. You see progress every week." },
  { number: "04", title: "Review & ship", description: "You test it. We refine. Then we launch." },
  { number: "05", title: "Handoff", description: "Code, docs, and knowledge transfer. You own everything." },
];

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <SectionLabel label="How it works" className="mb-4" />
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
            The process
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border">
          {steps.map((step, i) => (
            <FadeUp key={step.number} delay={i * 0.08}>
              <div className="bg-bg-primary p-6 h-full">
                <span className="font-mono text-xs text-accent block mb-4">
                  {step.number}
                </span>
                <h3 className="font-syne font-semibold text-sm text-text-primary mb-2">
                  {step.title}
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
  );
}

import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

const steps = [
  { number: "01", title: "Diagnose", description: "Map the current state, constraints, and failure points before any solution is proposed." },
  { number: "02", title: "Architect", description: "Design the system structure, data flows, and component relationships. Nothing built without a blueprint." },
  { number: "03", title: "Build", description: "Precision implementation with weekly checkpoints. You always know where things stand." },
  { number: "04", title: "Validate", description: "Stress-tested against real conditions before anything ships." },
  { number: "05", title: "Transfer", description: "Full ownership: code, documentation, and a live walkthrough. No dependency on me." },
];

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <SectionLabel label="The method" className="mb-4" />
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
            Operating framework
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

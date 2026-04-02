import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

const services = [
  { number: "01", title: "Websites & Web Presence", href: "/services#websites" },
  { number: "02", title: "Mobile Apps", href: "/services#mobile" },
  { number: "03", title: "Web Apps & Custom Tools", href: "/services#tools" },
  { number: "04", title: "Strategy & Technical Advisory", href: "/services#strategy" },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <SectionLabel label="Capabilities" className="mb-4" />
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
            What I build
          </h2>
        </FadeUp>

        <div className="divide-y divide-border border-t border-b border-border">
          {services.map((service, i) => (
            <FadeUp key={service.number} delay={i * 0.07}>
              <Link
                href={service.href}
                className="flex items-center justify-between py-5 group"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-xs text-accent w-6 flex-shrink-0">
                    {service.number}
                  </span>
                  <span className="font-syne font-semibold text-xl text-text-primary group-hover:text-accent transition-colors">
                    {service.title}
                  </span>
                </div>
                <span className="font-mono text-text-tertiary group-hover:text-accent transition-colors">
                  →
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.35}>
          <div className="mt-10">
            <Link
              href="/services"
              className="font-mono text-sm text-text-secondary hover:text-accent transition-colors"
            >
              View all capabilities →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

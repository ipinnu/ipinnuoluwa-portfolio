import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";

const services = [
  {
    number: "01",
    title: "Mobile App Development",
    description:
      "Flutter and React Native. Cross-platform, from wireframe to store submission.",
    tags: ["Flutter", "React Native", "Firebase"],
    href: "/services#mobile",
  },
  {
    number: "02",
    title: "Full Website Development",
    description:
      "Next.js frontend, AWS or Firebase backend, deployed and production-ready.",
    tags: ["Next.js", "React", "AWS", "Firebase", "Hosting"],
    href: "/services#web",
  },
  {
    number: "03",
    title: "Product Consulting",
    description:
      "Strategy, scoping, team setup. For founders who need tech guidance without a technical co-founder.",
    tags: ["Strategy", "Roadmap", "M365"],
    href: "/services#consulting",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <SectionLabel label="What I do" className="mb-4" />
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary mb-16">
            Services
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {services.map((service, i) => (
            <FadeUp key={service.number} delay={i * 0.1}>
              <div className="bg-bg-primary p-8 h-full group hover:bg-bg-secondary transition-colors flex flex-col">
                <span className="font-mono text-xs text-accent mb-6">
                  {service.number}
                </span>
                <h3 className="font-syne font-bold text-lg text-text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-text-tertiary border border-border px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={service.href}
                  className="font-mono text-xs text-text-secondary group-hover:text-accent transition-colors"
                >
                  Learn more →
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import BottomCTA from "@/components/sections/BottomCTA";

const services = [
  {
    id: "websites",
    label: "01",
    title: "Websites & Web Presence",
    tagline: "For SMEs, freelancers, and individuals",
    description:
      "A website that actually represents you — not a template someone else picked. I design and build clean, fast, professional websites that work on every device and leave a good first impression.",
    includes: [
      "Custom design and full development",
      "Mobile-responsive on all screen sizes",
      "Contact forms, booking, and integrations",
      "Domain setup, hosting, and SSL",
      "SEO basics and page speed optimisation",
      "1 month of post-launch support",
    ],
    model: "Fixed price · Fast turnaround",
    pricing: "From £400",
  },
  {
    id: "mobile",
    label: "02",
    title: "Mobile Apps",
    tagline: "For founders and individuals with a product idea",
    description:
      "Cross-platform mobile apps built with Flutter or React Native. One codebase, both stores. I handle everything — architecture, backend, and submission — so you end up with a real, working app.",
    includes: [
      "Flutter (Android + iOS) or React Native",
      "Firebase or Supabase backend integration",
      "User authentication and onboarding",
      "Play Store and App Store submission",
      "Push notifications and core app features",
      "3 months post-launch support",
    ],
    model: "Project-based · Discovery first",
    pricing: "From £600",
  },
  {
    id: "tools",
    label: "03",
    title: "Web Apps & Custom Tools",
    tagline: "For teams that have outgrown off-the-shelf software",
    description:
      "Custom platforms built around how your operation actually runs. Admin panels, dashboards, internal portals, workflow tools — designed precisely for your process, not a generic SaaS that almost fits.",
    includes: [
      "Custom Next.js web application",
      "Role-based access and user management",
      "Data dashboards and reporting views",
      "Backend integration or purpose-built API",
      "AWS or Firebase deployment",
      "Documentation and team handover",
      "3 months post-launch support",
    ],
    model: "Project-based · Fixed scope · Discovery first",
    pricing: "From £900",
  },
  {
    id: "strategy",
    label: "04",
    title: "Strategy & Technical Advisory",
    tagline: "For founders and business owners who need direction",
    description:
      "Technical guidance for people who are making decisions without a dedicated tech lead. I help you scope products, choose the right tools, avoid expensive mistakes, and build the right thing — before you build the wrong one.",
    includes: [
      "Business technology audit and recommendations",
      "Product scoping and roadmap development",
      "Vendor and tool selection",
      "Codebase review and technical debt assessment",
      "Early team structure and hiring guidance",
    ],
    model: "Project-based or monthly retainer",
    pricing: "From £150",
  },
];

export default function ServicesPage() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

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
              From a personal website to a full product — tap a service to see
              what&apos;s involved.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-20 md:py-32">
        <div className="max-w-content mx-auto px-6">
          <div className="divide-y divide-border border-t border-border">
            {services.map((service, i) => {
              const isOpen = open === service.id;
              return (
                <FadeUp key={service.id} delay={i * 0.07}>
                  <div>
                    {/* Row trigger */}
                    <button
                      onClick={() => toggle(service.id)}
                      className="w-full flex items-center justify-between py-6 text-left group"
                    >
                      <div className="flex items-center gap-5">
                        <span className="font-mono text-xs text-accent w-6 flex-shrink-0">
                          {service.label}
                        </span>
                        <div>
                          <span className="font-syne font-semibold text-xl md:text-2xl text-text-primary group-hover:text-accent transition-colors">
                            {service.title}
                          </span>
                          <span className="hidden md:inline font-mono text-xs text-text-tertiary ml-4">
                            {service.tagline}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xl text-text-tertiary transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    {/* Expanded card */}
                    {isOpen && (
                      <div className="pb-10">
                        <div className="border border-border bg-bg-secondary rounded-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                          {/* Left */}
                          <div>
                            <p className="font-mono text-xs text-text-tertiary mb-4 md:hidden">
                              {service.tagline}
                            </p>
                            <p className="text-text-secondary leading-relaxed mb-8">
                              {service.description}
                            </p>
                            <div className="space-y-1">
                              <p className="font-mono text-xs text-text-tertiary">
                                {service.model}
                              </p>
                              <p className="font-syne font-semibold text-xl text-accent">
                                {service.pricing}
                              </p>
                            </div>
                          </div>

                          {/* Right */}
                          <div>
                            <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-5">
                              What&apos;s included
                            </p>
                            <ul className="space-y-3 mb-8">
                              {service.includes.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-3"
                                >
                                  <span className="text-accent mt-0.5 flex-shrink-0">
                                    →
                                  </span>
                                  <span className="text-text-secondary text-sm leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
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
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

import type { Metadata } from "next";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectGrid from "@/components/sections/ProjectGrid";
import BottomCTA from "@/components/sections/BottomCTA";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Portfolio of Flutter apps, web products, and consulting engagements. Real projects, real outcomes.",
};

export default function WorkPage() {
  return (
    <>
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Portfolio" className="mb-6" />
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6">
              Things I&apos;ve built
            </h1>
            <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
              A selection of projects across mobile, web, and consulting.
              Every one of these shipped.
            </p>
          </FadeUp>
        </div>
      </section>

      <ProjectGrid />
      <BottomCTA />
    </>
  );
}

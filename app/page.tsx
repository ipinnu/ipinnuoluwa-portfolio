import HeroSection from "@/components/sections/HeroSection";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import ServicesPreview from "@/components/sections/ServicesPreview";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ProcessSection from "@/components/sections/ProcessSection";
import BottomCTA from "@/components/sections/BottomCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <ServicesPreview />
      <FeaturedWork />
      <ProcessSection />
      <BottomCTA />
    </>
  );
}

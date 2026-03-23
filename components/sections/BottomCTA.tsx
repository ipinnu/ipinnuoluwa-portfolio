import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export default function BottomCTA() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <h2 className="font-syne font-black text-4xl md:text-6xl lg:text-7xl text-text-primary leading-tight">
                Got a project
                <br />
                <span className="text-accent">in mind?</span>
              </h2>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold px-8 py-4 rounded-sm hover:bg-accent-dim transition-colors text-sm md:text-base"
              >
                Book a free discovery call →
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

import FadeUp from "@/components/ui/FadeUp";
import { conversationUrl } from "@/lib/contact";

export default function BottomCTA() {
  return (
    <section className="py-20 md:py-32 border-t border-border relative overflow-hidden">
      {/* Ambient radial glow — light source at bottom of page */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(232,255,71,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-content mx-auto px-6 relative z-10">
        <FadeUp>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <h2
                className="font-syne font-black text-text-primary leading-none tracking-tight"
                style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
              >
                Have something
                <br />
                <span className="text-accent">on your mind?</span>
              </h2>
              <p className="text-text-tertiary font-mono text-xs mt-6 max-w-sm leading-relaxed">
                You don&apos;t need a perfect brief. Tell me what you&apos;re
                thinking about and we&apos;ll find a useful next step together.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={conversationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold px-8 py-4 rounded-[3px] hover:bg-accent-dim transition-colors text-sm md:text-base"
              >
                Let&apos;s talk ↗
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

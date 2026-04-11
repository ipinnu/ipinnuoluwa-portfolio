import FadeUp from "@/components/ui/FadeUp";

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
                If you&apos;re building
                <br />
                <span className="text-neon">something serious.</span>
              </h2>
              <p className="text-text-tertiary font-mono text-xs mt-6 max-w-sm leading-relaxed">
                Serious projects only. We&apos;ll talk for 20 minutes and I&apos;ll
                tell you plainly if I can help.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Brief%20overview%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold px-8 py-4 rounded-[3px] hover:bg-accent-dim transition-colors text-sm md:text-base"
              >
                Start a Project →
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

import FadeUp from "@/components/ui/FadeUp";

export default function BottomCTA() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <FadeUp>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <h2 className="font-syne font-black text-4xl md:text-6xl lg:text-7xl text-text-primary leading-tight">
                If you&apos;re building
                <br />
                <span className="text-accent">something serious.</span>
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
                className="inline-flex items-center gap-2 bg-accent text-bg-primary font-syne font-semibold px-8 py-4 rounded-sm hover:bg-accent-dim transition-colors text-sm md:text-base"
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

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

// ─── Counter animation ────────────────────────────────────────────────────────
function useCounter(target: number, duration: number) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Stack tags ───────────────────────────────────────────────────────────────
const stackTags = ["Systems Architecture", "Enterprise Platforms", "Mobile Development", "Product Strategy", "Cloud Infrastructure"];

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" />
      <path d="M5 6.5v5M5 4.5v.01M8 11.5V9a1.5 1.5 0 0 1 3 0v2.5M8 6.5v5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 11.5c-3.5 1-3.5-2-5-2.5m10 3.5v-2.3a2 2 0 0 0-.5-1.5c2-.2 4-1 4-4.5a3.5 3.5 0 0 0-1-2.4 3.3 3.3 0 0 0-.1-2.4s-.8-.3-2.5.9a8.7 8.7 0 0 0-4.5 0C5.4 1.1 4.5 1.4 4.5 1.4A3.3 3.3 0 0 0 4.4 3.8 3.5 3.5 0 0 0 3.5 6.2c0 3.5 2 4.3 4 4.5a2 2 0 0 0-.5 1.5v2.3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="5.5" width="13" height="9" rx="1.5" />
      <path d="M5.5 5.5V4a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 10.5 4v1.5M1.5 9.5h13" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1v8M4 6l3 3 3-3M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2.5" width="12" height="9" rx="1.5" />
      <path d="M1 4l6 4.5L13 4" />
    </svg>
  );
}

// ─── Stat box ─────────────────────────────────────────────────────────────────
function StatBox({ target, duration, label }: { target: number; duration: number; label: string }) {
  const count = useCounter(target, duration);
  return (
    <div style={{ backgroundColor: "#0A0A0A", border: "0.5px solid #1A1A1A", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 800, color: "#F5F5F0", lineHeight: 1 }}>
        {count}<span style={{ color: "#A3C4B4", fontSize: 20 }}>+</span>
      </div>
      <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, color: "#444440", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroSection() {
  const shouldReduce = useReducedMotion();
  const leftRef = useRef(null);
  const isInView = useInView(leftRef, { once: true, margin: "-80px" });

  // 3D tilt for profile card
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: dy * -5, y: dx * 5 });
  }, [shouldReduce]);

  const handleCardMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <section style={{ backgroundColor: "#0A0A0A", minHeight: "100svh", position: "relative", display: "flex", alignItems: "center", paddingTop: 64, paddingBottom: 0 }}>

      {/* Ambient radial glow — light source at top */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(232,255,71,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(163,196,180,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163,196,180,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Grid */}
      <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", width: "100%", position: "relative", zIndex: 1 }}>

        {/* ── Left column ── */}
        <motion.div
          ref={leftRef}
          variants={shouldReduce ? undefined : containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
          className="hero-left"
        >
          {/* Eyebrow rule + label */}
          <motion.div variants={shouldReduce ? undefined : itemVariants} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: 32, height: "0.5px", backgroundColor: "#333330" }} />
            <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#555552", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
              Systems · Architecture · Product Engineering
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={shouldReduce ? undefined : itemVariants}
            style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(40px, 5vw, 72px)", color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0 }}
          >
            I architect systems
            <br />
            <span style={{ color: "#E8FF47" }}>that run businesses.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={shouldReduce ? undefined : itemVariants}
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 17, fontWeight: 300, color: "#888884", lineHeight: 1.7, maxWidth: 480, margin: 0 }}
          >
            Most software fails not from bad code, but from missing structure.
            I design and build the operational systems — mobile platforms,
            enterprise tools, internal infrastructure — that organisations
            depend on to function.
          </motion.p>

          {/* Stack tags */}
          <motion.div variants={shouldReduce ? undefined : itemVariants} style={{ display: "flex", flexWrap: "wrap", gap: 8 }} className="tags-row">
            {stackTags.map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#3A3A38", backgroundColor: "#0D0D0D", border: "0.5px solid #1A1A1A", padding: "5px 10px", borderRadius: 2 }}>
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={shouldReduce ? undefined : itemVariants} style={{ display: "flex", gap: 12, flexWrap: "wrap" }} className="cta-row">
            <motion.div whileHover={shouldReduce ? {} : { y: -2 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
              <a
                href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Here%27s%20a%20brief%20overview%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", backgroundColor: "#A3C4B4", color: "#0A0A0A", fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 600, padding: "12px 24px", borderRadius: 4, textDecoration: "none" }}
              >
                Start a Project →
              </a>
            </motion.div>
            <Link href="/work" className="ghost-cta" style={{ display: "inline-block", backgroundColor: "transparent", color: "#888884", fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 400, padding: "12px 24px", borderRadius: 8, border: "0.5px solid #333330", textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}>
              View Case Studies
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right column — Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="hero-right"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              backgroundColor: "#111111",
              border: "0.5px solid #222220",
              borderRadius: 12,
              padding: "0 0 24px 0",
              width: "100%",
              maxWidth: 340,
              overflow: "hidden",
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: tilt.x === 0 && tilt.y === 0
                ? "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)"
                : "transform 0.1s ease",
              willChange: "transform",
              cursor: "default",
            }}
          >
            {/* Accent bar */}
            <div style={{ height: 3, backgroundColor: "#A3C4B4" }} />

            {/* Profile image — full frame, no crop */}
            <Image
              src="/images/Profile picture.jpeg"
              alt="Ipinnuoluwa Oladipo"
              width={340}
              height={0}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />

            {/* Identity */}
            <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <p style={{ fontFamily: "var(--font-syne)", fontSize: 17, fontWeight: 700, color: "#F5F5F0", margin: 0 }}>
                Ipinnuoluwa Oladipo
              </p>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 300, color: "#888884", margin: 0 }}>
                Systems Architect · Product Engineer
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#444440", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#444440" }}>Lagos, Nigeria</span>
              </div>
            </div>

            {/* Availability signal */}
            <div style={{ borderTop: "0.5px solid #1A1A1A", borderBottom: "0.5px solid #1A1A1A", padding: "10px 0", display: "flex", justifyContent: "center", marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#111111", border: "0.5px solid #222220", borderRadius: 99, padding: "7px 16px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#A3C4B4", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#888884", letterSpacing: "0.06em" }}>
                  Selective intake · 2 spots open
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px 24px 0" }}>
              {[
                { href: "https://linkedin.com/in/YOUR_LINKEDIN", icon: <LinkedInIcon />, label: "LinkedIn" },
                { href: "https://github.com/YOUR_GITHUB", icon: <GitHubIcon />, label: "GitHub" },
                { href: "https://YOUR_ORG_URL", icon: <BriefcaseIcon />, label: "Freelance Org" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-btn"
                  style={{ width: 36, height: 36, borderRadius: 8, border: "0.5px solid #222220", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#444440", transition: "border-color 0.15s, color 0.15s", textDecoration: "none" }}>
                  {icon}
                </a>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "16px 24px 0" }}>
              <StatBox target={6} duration={1200} label="Systems Delivered" />
              <StatBox target={2} duration={1000} label="Years Operating" />
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", backgroundColor: "#1A1A1A", margin: "20px 24px 0" }} />

            {/* Button stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 24px 0" }}>
              <a
                href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%20Here%27s%20a%20brief%20overview%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#A3C4B4", color: "#0A0A0A", fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 600, borderRadius: 4, padding: "11px 16px", textDecoration: "none" }}
              >
                Start a Project →
              </a>
              <a href="/about" className="contact-btn"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "transparent", color: "#888884", fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 400, borderRadius: 4, padding: "11px 16px", border: "0.5px solid #222220", textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}>
                <EnvelopeIcon />
                Who I am
              </a>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}

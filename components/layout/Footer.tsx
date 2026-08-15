"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const footerLinks = {
  Work: [
    { href: "/work", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/hire", label: "Hire Me" },
  ],
  Explore: [
    { href: "/blog", label: "Blog" },
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About" },
  ],
};

const socialLinks = [
  { href: "https://twitter.com/ipinnuoluwa", label: "Twitter" },
  { href: "https://www.linkedin.com/in/ipinnu-oladipo-876360235/", label: "LinkedIn" },
  { href: "https://github.com/ipinnu", label: "GitHub" },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

function LogoTwinkleStar({ hidden }: { hidden: boolean }) {
  if (hidden) return null;

  return (
    <>
      <motion.span
        aria-hidden
        className="absolute pointer-events-none"
        style={{ top: -4, right: -16, zIndex: 1 }}
        animate={{
          opacity: [0.12, 0.35, 0.9, 0.4, 0.12],
          scale: [0.65, 0.85, 1.15, 0.9, 0.65],
          x: [10, 6, 2, 0, 10],
          y: [8, 4, 1, -1, 8],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M5.5 0L6.6 4.1L10.5 5.5L6.6 6.9L5.5 11L4.4 6.9L0.5 5.5L4.4 4.1Z"
            fill="#E8FF47"
            style={{ filter: "drop-shadow(0 0 4px rgba(232,255,71,0.9))" }}
          />
        </svg>
      </motion.span>

      <motion.span
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          top: 6,
          right: -8,
          width: 2,
          height: 2,
          backgroundColor: "#A3C4B4",
          boxShadow: "0 0 3px rgba(163,196,180,0.8)",
          zIndex: 1,
        }}
        animate={{
          opacity: [0, 0.2, 0.7, 0.15, 0],
          x: [14, 9, 4, 1, 14],
          y: [10, 6, 3, 1, 10],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      />
    </>
  );
}

export default function Footer() {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [burst, setBurst] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glowStage, setGlowStage] = useState(0); // 0=none 1=dim 2=mid 3=full

  const handleLogoTap = useCallback(() => {
    tapCount.current += 1;

    setGlowStage(tapCount.current);

    if (tapTimer.current) clearTimeout(tapTimer.current);

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);

      const generated: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        angle: (i / 16) * 360,
        distance: 40 + Math.random() * 30,
      }));
      setParticles(generated);
      setBurst(true);
      setGlowStage(3);

      setTimeout(() => {
        setBurst(false);
        setParticles([]);
        setGlowStage(0);
        router.push("/my-world");
      }, 700);
    } else {
      tapTimer.current = setTimeout(() => {
        tapCount.current = 0;
        setGlowStage(0);
      }, 800);
    }
  }, [router]);

  const glowColor =
    glowStage === 0
      ? "#A3C4B4"
      : glowStage === 1
        ? "#b8d4c8"
        : glowStage === 2
          ? "#E8FF47"
          : "#E8FF47";

  const glowShadow =
    glowStage === 0
      ? "none"
      : glowStage === 1
        ? "0 0 8px #A3C4B440"
        : glowStage === 2
          ? "0 0 16px #E8FF4780"
          : "0 0 28px #E8FF47, 0 0 60px #E8FF4740";

  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="relative inline-block mb-4">
              <LogoTwinkleStar hidden={burst || glowStage > 0} />

              <motion.a
                ref={logoRef}
                href="/"
                onClick={(e) => e.preventDefault()}
                onTap={handleLogoTap}
                className="font-syne font-bold text-2xl block select-none cursor-pointer relative z-[2]"
                style={{
                  color: glowColor,
                  textShadow: glowShadow,
                  transition: "color 0.2s, text-shadow 0.2s",
                }}
              >
                ipi.
              </motion.a>

              {/* Particles */}
              <AnimatePresence>
                {burst &&
                  particles.map((p) => {
                    const rad = (p.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * p.distance;
                    const ty = Math.sin(rad) * p.distance;
                    return (
                      <motion.span
                        key={p.id}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <span
                          className="block rounded-full"
                          style={{
                            width: p.id % 3 === 0 ? 3 : 2,
                            height: p.id % 3 === 0 ? 3 : 2,
                            backgroundColor:
                              p.id % 2 === 0 ? "#E8FF47" : "#A3C4B4",
                            boxShadow:
                              p.id % 2 === 0
                                ? "0 0 4px #E8FF47"
                                : "0 0 4px #A3C4B4",
                          }}
                        />
                      </motion.span>
                    );
                  })}
              </AnimatePresence>

              {/* Ripple ring on burst */}
              <AnimatePresence>
                {burst && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border pointer-events-none"
                    style={{ borderColor: "#E8FF47" }}
                  />
                )}
              </AnimatePresence>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Flutter & product engineer based in Lagos, Nigeria. Building
              mobile apps and web products for startups and businesses
              worldwide.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-tertiary">
            © {new Date().getFullYear()} Ipinnuoluwa Oladipo. Built by me.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

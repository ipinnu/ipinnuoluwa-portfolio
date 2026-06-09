"use client";

import { motion } from "framer-motion";
import { COURSES } from "@/lib/resources";

interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

export default function ResourcesHero({ postCount }: { postCount: number }) {
  const availableCourses = COURSES.filter((c) => c.status === "available").length;
  const totalXP = COURSES.reduce((sum, c) => sum + c.xp, 0);

  const stats: Stat[] = [
    { label: "courses available", value: availableCourses, color: "#E8FF47" },
    { label: "incoming", value: COURSES.length - availableCourses },
    { label: "articles", value: postCount },
    { label: "total XP", value: `${totalXP.toLocaleString()} XP`, color: "#A3C4B4" },
  ];

  return (
    <section className="relative pt-36 pb-16 overflow-hidden">
      {/* Scanline grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E8FF47 1px, transparent 1px),
            linear-gradient(to bottom, #E8FF47 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial neon glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #E8FF4710 0%, transparent 70%)",
        }}
      />

      <div className="max-w-content mx-auto px-6 relative">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[10px] text-neon tracking-[0.3em] uppercase mb-6"
        >
          &gt;_ resources.init()
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-4"
        >
          Learn.{" "}
          <span
            className="relative"
            style={{ color: "#E8FF47", textShadow: "0 0 40px #E8FF4740" }}
          >
            Ship.
          </span>{" "}
          Level up.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-text-secondary text-lg max-w-xl leading-relaxed mb-12"
        >
          Interactive React courses, field notes, and everything I wish I had
          when I was starting out. Free. No fluff.
        </motion.p>

        {/* HUD stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="inline-flex flex-wrap gap-0 border border-border divide-x divide-border"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-5 py-3">
              <p
                className="font-mono font-medium text-lg leading-none mb-0.5"
                style={{ color: stat.color ?? "#888884" }}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

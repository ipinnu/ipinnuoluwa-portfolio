"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TOTAL_XP } from "@/lib/react-hub/xp";
import { TOTAL_LESSONS } from "@/lib/react-hub/curriculum";

interface RainParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  shape: "dot" | "plus" | "star";
}

function useRainParticles(count: number): RainParticle[] {
  const ref = useRef<RainParticle[]>([]);
  if (ref.current.length === 0) {
    const colors = ["#E8FF47", "#E8FF47", "#A3C4B4", "#FFFFFF", "#E8FF47"];
    ref.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: 2 + Math.random() * 3,
      color: colors[i % colors.length],
      shape: (["dot", "plus", "star"] as const)[i % 3],
    }));
  }
  return ref.current;
}

function ConfettiRain() {
  const particles = useRainParticles(40);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-5%", opacity: 1, rotate: 0 }}
          animate={{ y: "105vh", opacity: [1, 1, 0], rotate: 360 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            ease: "linear",
          }}
          className="absolute"
          style={{ left: `${p.x}%`, top: 0 }}
        >
          {p.shape === "plus" ? (
            <svg
              width={p.size * 3}
              height={p.size * 3}
              viewBox="0 0 12 12"
              opacity={0.7}
            >
              <path
                d="M6 1v10M1 6h10"
                stroke={p.color}
                strokeWidth="1.5"
              />
            </svg>
          ) : p.shape === "star" ? (
            <svg width={p.size * 3} height={p.size * 3} viewBox="0 0 12 12" opacity={0.6}>
              <path
                d="M6 1l1.2 3.7H11L8 6.9l1.2 3.7L6 8.4 2.8 10.6 4 6.9 1 4.7h3.8z"
                fill={p.color}
              />
            </svg>
          ) : (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                opacity: 0.8,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function BigCheckmark() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            delay: i * 0.4,
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
          className="absolute inset-0 rounded-full border border-neon pointer-events-none"
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
        className="w-32 h-32 rounded-full border-2 border-neon flex items-center justify-center"
        style={{
          boxShadow: "0 0 40px #E8FF4780, inset 0 0 40px #E8FF4715",
        }}
      >
        <svg viewBox="0 0 40 40" fill="none" width={44} height={44}>
          <motion.path
            d="M8 20l9 9L32 10"
            stroke="#E8FF47"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

interface CourseCompleteScreenProps {
  earnedXP: number;
}

export default function CourseCompleteScreen({ earnedXP }: CourseCompleteScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      <ConfettiRain />

      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E8FF47 1px, transparent 1px),
            linear-gradient(to bottom, #E8FF47 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #E8FF4715 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-[10px] text-neon tracking-[0.3em] uppercase mb-6"
        >
          &gt;_ course.complete()
        </motion.p>

        <BigCheckmark />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-syne font-black text-5xl md:text-7xl mb-2"
          style={{ color: "#E8FF47", textShadow: "0 0 60px #E8FF4760" }}
        >
          COURSE
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-syne font-black text-5xl md:text-7xl text-text-primary mb-8"
        >
          COMPLETE.
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-flex gap-0 border border-neon/30 divide-x divide-neon/20 mb-8"
        >
          <div className="px-6 py-4">
            <p
              className="font-mono font-bold text-2xl text-neon mb-0.5"
              style={{ textShadow: "0 0 16px #E8FF47" }}
            >
              {TOTAL_LESSONS}
            </p>
            <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">
              Lessons
            </p>
          </div>
          <div className="px-6 py-4">
            <p
              className="font-mono font-bold text-2xl text-neon mb-0.5"
              style={{ textShadow: "0 0 16px #E8FF47" }}
            >
              {earnedXP.toLocaleString()}
            </p>
            <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">
              XP Earned
            </p>
          </div>
          <div className="px-6 py-4">
            <p
              className="font-mono font-bold text-2xl text-accent mb-0.5"
            >
              React
            </p>
            <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">
              Fundamentals
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-text-secondary text-base leading-relaxed mb-10 max-w-md"
        >
          You've finished all 12 lessons. You understand components, state,
          effects, and data fetching. Now build something real.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/resources"
            className="font-mono text-sm bg-neon text-bg-primary font-semibold px-6 py-3 hover:bg-neon/90 transition-colors"
          >
            Back to Resources →
          </Link>
          <a
            href={`https://twitter.com/intent/tweet?text=Just%20finished%20the%20React%20Fundamentals%20course%20on%20ipinnuoluwa.com.ng%20%E2%80%94%20${TOTAL_LESSONS}%20lessons%2C%20${earnedXP}%20XP%20earned.%20%F0%9F%9F%A1`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm border border-border text-text-secondary px-6 py-3 hover:border-accent/40 hover:text-text-primary transition-colors"
          >
            Share on Twitter
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

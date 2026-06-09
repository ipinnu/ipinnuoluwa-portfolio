"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Lesson } from "@/lib/react-hub/curriculum";
import { LESSON_XP, LESSON_CONGRATS } from "@/lib/react-hub/xp";

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  shape: "dot" | "plus" | "square";
  delay: number;
}

const COLORS = ["#E8FF47", "#E8FF47", "#A3C4B4", "#E8FF47", "#FFFFFF"];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360 + Math.random() * 15 - 7.5,
    distance: 80 + Math.random() * 60,
    size: Math.random() > 0.6 ? 4 : 2.5,
    color: COLORS[i % COLORS.length],
    shape: (["dot", "plus", "square"] as const)[i % 3],
    delay: Math.random() * 0.1,
  }));
}

function ParticleBurst({ active }: { active: boolean }) {
  const particles = useRef(generateParticles(28));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <AnimatePresence>
        {active &&
          particles.current.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            return (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.9,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute"
              >
                {p.shape === "plus" ? (
                  <svg width={p.size * 3} height={p.size * 3} viewBox="0 0 12 12">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke={p.color}
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      borderRadius: p.shape === "dot" ? "50%" : "1px",
                      boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}

function CheckRing({ visible }: { visible: boolean }) {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6">
      <ParticleBurst active={visible} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full border-2 border-neon flex items-center justify-center"
        style={{ boxShadow: "0 0 24px #E8FF4760, inset 0 0 24px #E8FF4710" }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={28} height={28}>
          <motion.path
            d="M5 12l5 5L19 7"
            stroke="#E8FF47"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={visible ? { pathLength: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      {/* Outer ring pulse */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="absolute inset-0 rounded-full border border-neon pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface LessonCompleteModalProps {
  lesson: Lesson;
  next: Lesson | null;
  onDismiss: () => void;
}

export default function LessonCompleteModal({
  lesson,
  next,
  onDismiss,
}: LessonCompleteModalProps) {
  const xp = LESSON_XP[lesson.id] ?? 50;
  const message = LESSON_CONGRATS[lesson.id] ?? "Lesson complete. Keep going.";

  // Dismiss on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-bg-primary border border-neon/30 p-8 text-center overflow-hidden"
        style={{ boxShadow: "0 0 60px #E8FF4715" }}
      >
        {/* Corner brackets */}
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <span
            key={i}
            className={`absolute w-4 h-4 ${cls}`}
            style={{ borderColor: "#E8FF47" }}
          />
        ))}

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #E8FF47 0px, #E8FF47 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Label */}
        <p className="font-mono text-[10px] text-neon tracking-[0.3em] uppercase mb-5">
          // lesson.complete()
        </p>

        {/* Check ring + particles */}
        <CheckRing visible />

        {/* Lesson info */}
        <p className="font-mono text-[10px] text-text-tertiary mb-1">
          Lesson {lesson.id} of 12
        </p>
        <h2 className="font-syne font-black text-xl text-text-primary mb-4">
          {lesson.title}
        </h2>

        {/* XP badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center gap-2 border border-neon/40 bg-neon/5 px-4 py-2 mb-4"
        >
          <span
            className="font-mono font-bold text-xl text-neon"
            style={{ textShadow: "0 0 12px #E8FF47" }}
          >
            +{xp} XP
          </span>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-secondary text-sm leading-relaxed mb-8"
        >
          {message}
        </motion.p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-center">
          {next ? (
            <Link
              href={`/resources/react/${next.slug}`}
              onClick={onDismiss}
              className="font-mono text-xs bg-neon text-bg-primary font-semibold px-5 py-2.5 hover:bg-neon/90 transition-colors"
            >
              {next.title} →
            </Link>
          ) : (
            <Link
              href="/resources"
              onClick={onDismiss}
              className="font-mono text-xs bg-neon text-bg-primary font-semibold px-5 py-2.5 hover:bg-neon/90 transition-colors"
            >
              Back to Resources →
            </Link>
          )}
          <button
            onClick={onDismiss}
            className="font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors px-3 py-2.5"
          >
            Stay here
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

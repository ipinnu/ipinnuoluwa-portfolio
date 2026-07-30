"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useGlossary } from "./GlossaryContext";
import { CURRICULUM } from "@/lib/react-hub/curriculum";

export default function GlossaryPanel() {
  const { activeTerm, closeTerm } = useGlossary();

  useEffect(() => {
    if (!activeTerm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTerm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTerm, closeTerm]);

  const learnMoreLesson =
    activeTerm?.learnMoreLesson != null
      ? CURRICULUM.find(
          (lesson) =>
            lesson.id === activeTerm.learnMoreLesson && lesson.id <= 11,
        )
      : null;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {activeTerm && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeTerm}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {activeTerm && (
          <motion.aside
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
            style={{
              width: "clamp(300px, 90vw, 400px)",
              background: "#0A0A0A",
              borderLeft: "1px solid rgba(232,255,71,0.25)",
              boxShadow: "-8px 0 40px rgba(232,255,71,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 p-6 border-b"
              style={{ borderColor: "rgba(232,255,71,0.12)" }}
            >
              <div>
                <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase mb-2">
                  // Glossary
                </p>
                <h2
                  className="font-syne font-black text-2xl tracking-tight"
                  style={{ color: "#E8FF47", textShadow: "0 0 20px #E8FF4740" }}
                >
                  {activeTerm.term}
                </h2>
              </div>
              <button
                onClick={closeTerm}
                className="flex-shrink-0 mt-1 w-8 h-8 flex items-center justify-center border border-border text-text-tertiary hover:text-text-primary hover:border-border/80 transition-colors font-mono text-sm"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Plain English */}
              <div>
                <p
                  className="font-mono text-[9px] tracking-widest uppercase mb-3"
                  style={{ color: "#A3C4B4" }}
                >
                  In plain English
                </p>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {activeTerm.plainEnglish}
                </p>
              </div>

              {/* In React */}
              <div
                className="border-l-2 pl-4"
                style={{ borderColor: "rgba(232,255,71,0.4)" }}
              >
                <p className="font-mono text-[9px] text-neon/70 tracking-widest uppercase mb-3">
                  In React, this means
                </p>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {activeTerm.inReact}
                </p>
              </div>

              {/* Code example */}
              {activeTerm.example && (
                <div>
                  <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase mb-3">
                    Example
                  </p>
                  <pre
                    className="text-[12px] leading-relaxed overflow-x-auto p-4 rounded-[2px]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#A3C4B4",
                      fontFamily: "var(--font-jetbrains-mono, monospace)",
                    }}
                  >
                    {activeTerm.example}
                  </pre>
                </div>
              )}

              {/* Learn more */}
              {learnMoreLesson && (
                <div
                  className="p-4 border"
                  style={{
                    background: "rgba(163,196,180,0.04)",
                    borderColor: "rgba(163,196,180,0.2)",
                  }}
                >
                  <p
                    className="font-mono text-[9px] tracking-widest uppercase mb-2"
                    style={{ color: "#A3C4B4" }}
                  >
                    Covered in depth
                  </p>
                  <Link
                    href={`/resources/react/field-guide/${learnMoreLesson.slug}`}
                    onClick={closeTerm}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Concept {learnMoreLesson.id}: {learnMoreLesson.title} →
                  </Link>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-6 py-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <p className="font-mono text-[9px] text-text-tertiary">
                Press{" "}
                <kbd className="border border-border px-1 py-0.5 text-[9px]">
                  ESC
                </kbd>{" "}
                or click any highlighted term to explore
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

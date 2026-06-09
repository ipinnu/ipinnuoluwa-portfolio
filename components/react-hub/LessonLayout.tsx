"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Lesson } from "@/lib/react-hub/curriculum";
import {
  markComplete,
  unmarkComplete,
  markVisited,
  isComplete,
  getProgress,
} from "@/lib/react-hub/progress";
import { LESSON_XP, getEarnedXP, TOTAL_XP } from "@/lib/react-hub/xp";
import ConceptSection from "./ConceptSection";
import PracticeSection from "./PracticeSection";
import LessonCompleteModal from "./LessonCompleteModal";
import CourseCompleteScreen from "./CourseCompleteScreen";
import AnnotatedCode from "./AnnotatedCode";

const SECTION_LABELS = [
  { id: "concept", label: "Concept" },
  { id: "example", label: "Example" },
  { id: "practice", label: "Practice" },
  { id: "resources", label: "Resources" },
];

const LESSON_12_SECTIONS = [
  { id: "concept", label: "Concept" },
  { id: "practice", label: "Project" },
  { id: "resources", label: "Resources" },
];

// Floating "+XP" animation that plays on completion
function XpFloat({ xp, visible }: { xp: number; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1, y: 0, x: 0 }}
          animate={{ opacity: 0, y: -40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 top-0 pointer-events-none select-none"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <span
            className="font-mono font-bold text-sm text-neon"
            style={{ textShadow: "0 0 12px #E8FF47" }}
          >
            +{xp} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface LessonLayoutProps {
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}

export default function LessonLayout({ lesson, prev, next }: LessonLayoutProps) {
  const sections = lesson.id === 12 ? LESSON_12_SECTIONS : SECTION_LABELS;

  const [activeSection, setActiveSection] = useState("concept");
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Reset section tab when navigating between lessons
  useEffect(() => {
    setActiveSection("concept");
    setShowModal(false);
    setShowXpFloat(false);

    markVisited(lesson.id);
    const alreadyDone = isComplete(lesson.id);
    setDone(alreadyDone);

    const p = getProgress();
    setEarnedXP(getEarnedXP(p.completedLessons));

    window.dispatchEvent(new Event("hub-progress-update"));
  }, [lesson.id]);

  const handleComplete = useCallback(() => {
    if (done) return;
    const p = markComplete(lesson.id);
    setDone(true);
    setShowXpFloat(true);
    setEarnedXP(getEarnedXP(p.completedLessons));
    window.dispatchEvent(new Event("hub-progress-update"));

    setTimeout(() => {
      setShowXpFloat(false);
      if (lesson.id === 12) {
        setShowCourseComplete(true);
      } else {
        setShowModal(true);
      }
    }, 400);
  }, [done, lesson.id]);

  const handleUnmark = useCallback(() => {
    const p = unmarkComplete(lesson.id);
    setDone(false);
    setEarnedXP(getEarnedXP(p.completedLessons));
    window.dispatchEvent(new Event("hub-progress-update"));
  }, [lesson.id]);

  const xp = LESSON_XP[lesson.id] ?? 50;

  return (
    <>
      <article className="min-h-screen">
        {/* Lesson header */}
        <div className="border-b border-border px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase mb-1">
                Lesson {lesson.id} of 12 ·{" "}
                <span className="text-neon">+{xp} XP</span>
              </p>
              <h1 className="font-syne font-black text-2xl md:text-3xl text-text-primary">
                {lesson.title}
              </h1>
            </div>

            <div className="relative flex-shrink-0">
              <XpFloat xp={xp} visible={showXpFloat} />
              {done ? (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleUnmark}
                  title="Click to unmark"
                  className="group flex items-center gap-1.5 font-mono text-[10px] text-neon border border-neon/40 px-3 py-1.5 transition-all duration-200 hover:border-border hover:text-text-tertiary"
                  style={{ boxShadow: "0 0 12px #E8FF4720" }}
                >
                  <span className="group-hover:hidden">✓ Complete</span>
                  <span className="hidden group-hover:inline">Unmark</span>
                </motion.button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="font-mono text-[10px] text-text-secondary border border-border px-3 py-1.5 hover:border-neon/40 hover:text-neon hover:bg-neon/5 transition-all duration-200"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex items-center gap-1 mt-5 flex-wrap">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={[
                  "font-mono text-[10px] px-3 py-1.5 border transition-all duration-200",
                  activeSection === s.id
                    ? "border-neon/60 text-neon bg-neon/5"
                    : "border-border text-text-tertiary hover:text-text-secondary hover:border-border/80",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section content — animated transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-8"
          >
            {activeSection === "concept" && (
              <ConceptSection paragraphs={lesson.concept} />
            )}

            {activeSection === "example" && lesson.example && (
              <AnnotatedCode
                code={lesson.example}
                highlights={lesson.exampleHighlights ?? []}
              />
            )}

            {activeSection === "practice" && (
              <PracticeSection
                exercises={lesson.exercises}
                practiceNote={lesson.practiceNote}
              />
            )}

            {activeSection === "resources" && (
              <div className="space-y-2 max-w-lg">
                <p className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase mb-5">
                  Further Reading
                </p>
                {lesson.docLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group border border-border p-4 hover:border-accent/40 hover:bg-bg-secondary transition-all duration-200"
                  >
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      {link.label}
                    </span>
                    <span className="font-mono text-xs text-text-tertiary group-hover:text-accent transition-colors">
                      →
                    </span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Lesson footer nav */}
        <div className="border-t border-border px-6 py-6 flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/resources/react/${prev.slug}`}
              className="font-mono text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/resources/react/${next.slug}`}
              className="group flex items-center gap-2 font-mono text-xs text-neon hover:opacity-80 transition-opacity"
            >
              {next.title}{" "}
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                →
              </span>
            </Link>
          ) : (
            <span className="font-mono text-xs text-text-tertiary">
              {done ? "Course complete ✓" : "Final lesson"}
            </span>
          )}
        </div>
      </article>

      {/* Lesson complete modal */}
      <AnimatePresence>
        {showModal && (
          <LessonCompleteModal
            lesson={lesson}
            next={next}
            onDismiss={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Course complete full screen */}
      <AnimatePresence>
        {showCourseComplete && (
          <CourseCompleteScreen earnedXP={earnedXP} />
        )}
      </AnimatePresence>
    </>
  );
}

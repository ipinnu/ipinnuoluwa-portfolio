"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lesson } from "@/lib/react-hub/curriculum";
import { FIELD_GUIDE_TOTAL } from "@/lib/react-hub/field-guide";
import {
  getFieldGuideProgress,
  setFieldGuideLessonComplete,
  visitFieldGuideLesson,
} from "@/lib/react-hub/field-guide-progress";
import AnnotatedCode from "./AnnotatedCode";
import ConceptSection from "./ConceptSection";
import PracticeSection from "./PracticeSection";

const sections = [
  { id: "concept", label: "Concept" },
  { id: "example", label: "Example" },
  { id: "practice", label: "Practice" },
  { id: "resources", label: "Resources" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function FieldGuideLesson({
  lesson,
  prev,
  next,
}: {
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("concept");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setActiveSection("concept");
    visitFieldGuideLesson(lesson.slug);
    setComplete(
      getFieldGuideProgress().completedLessons.includes(lesson.slug),
    );
    window.dispatchEvent(new Event("field-guide-progress-update"));
  }, [lesson.slug]);

  const toggleComplete = useCallback(() => {
    const progress = setFieldGuideLessonComplete(lesson.slug, !complete);
    setComplete(progress.completedLessons.includes(lesson.slug));
    window.dispatchEvent(new Event("field-guide-progress-update"));
  }, [complete, lesson.slug]);

  return (
    <article className="min-h-screen">
      <header className="border-b border-border px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/resources/react/field-guide"
            className="inline-flex min-h-11 items-center font-mono text-xs text-accent transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
          >
            ← React Field Guide
          </Link>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Concept {lesson.id} of {FIELD_GUIDE_TOTAL}
              </p>
              <h1 className="mt-2 font-syne text-3xl font-black text-text-primary sm:text-4xl">
                {lesson.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={toggleComplete}
              aria-pressed={complete}
              className={[
                "min-h-11 cursor-pointer border px-4 font-mono text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon",
                complete
                  ? "border-neon bg-neon text-bg-primary"
                  : "border-border text-text-secondary hover:border-neon/50 hover:text-neon",
              ].join(" ")}
            >
              {complete ? "✓ Concept complete · undo" : "Mark concept complete"}
            </button>
          </div>

          <nav
            aria-label="Field Guide lesson sections"
            className="mt-6 flex flex-wrap gap-2"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                aria-current={
                  activeSection === section.id ? "page" : undefined
                }
                className={[
                  "min-h-11 cursor-pointer border px-4 font-mono text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon",
                  activeSection === section.id
                    ? "border-neon/60 bg-neon/5 text-neon"
                    : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary",
                ].join(" ")}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "concept" && (
              <ConceptSection paragraphs={lesson.concept} />
            )}

            {activeSection === "example" && (
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
              <section className="max-w-xl">
                <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                  Further reading
                </p>
                <div className="mt-5 space-y-3">
                  {lesson.docLinks.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-14 items-center justify-between gap-4 border border-border p-4 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
                    >
                      {resource.label}
                      <span
                        aria-hidden
                        className="font-mono text-accent transition-transform group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="border-t border-border px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Link
              href={`/resources/react/field-guide/${prev.slug}`}
              className="inline-flex min-h-11 items-center text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
            >
              ← {prev.title}
            </Link>
          ) : (
            <Link
              href="/resources/react/field-guide"
              className="inline-flex min-h-11 items-center text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              ← Field Guide
            </Link>
          )}

          {next ? (
            <Link
              href={`/resources/react/field-guide/${next.slug}`}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-neon transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
            >
              Next: {next.title} →
            </Link>
          ) : (
            <Link
              href="/resources/react/field-guide"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-neon transition-opacity hover:opacity-80"
            >
              Guided tour complete →
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}

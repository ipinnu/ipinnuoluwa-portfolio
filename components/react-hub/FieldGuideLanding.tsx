"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FIELD_GUIDE_LESSONS,
  FIELD_GUIDE_TOTAL,
} from "@/lib/react-hub/field-guide";
import {
  getFieldGuideProgress,
  type FieldGuideProgress,
} from "@/lib/react-hub/field-guide-progress";

const emptyProgress: FieldGuideProgress = {
  completedLessons: [],
  lastVisited: null,
};

export default function FieldGuideLanding() {
  const [progress, setProgress] = useState<FieldGuideProgress>(emptyProgress);

  useEffect(() => {
    const update = () => setProgress(getFieldGuideProgress());
    update();
    window.addEventListener("field-guide-progress-update", update);
    return () =>
      window.removeEventListener("field-guide-progress-update", update);
  }, []);

  const continueLesson = useMemo(
    () =>
      FIELD_GUIDE_LESSONS.find(
        (lesson) => lesson.slug === progress.lastVisited,
      ) ?? FIELD_GUIDE_LESSONS[0],
    [progress.lastVisited],
  );

  const completedCount = FIELD_GUIDE_LESSONS.filter((lesson) =>
    progress.completedLessons.includes(lesson.slug),
  ).length;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(163,196,180,0.12),transparent_36%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            React Hub · Deeper reference
          </p>
          <h1 className="mt-5 max-w-4xl font-syne text-4xl font-black leading-[1.05] text-text-primary sm:text-6xl">
            The React Field Guide
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-8 text-text-secondary">
            Understand one React idea at a time through focused explanations,
            annotated examples, and small interactive exercises. No project
            context is required.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/resources/react/field-guide/${continueLesson.slug}`}
              className="inline-flex min-h-12 items-center justify-center bg-neon px-6 font-mono text-sm font-bold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
            >
              {progress.lastVisited
                ? "Continue the guided tour"
                : "Begin the guided tour"}{" "}
              →
            </Link>
            <a
              href="#concepts"
              className="inline-flex min-h-12 items-center justify-center border border-border px-6 font-mono text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
            >
              Browse all concepts
            </a>
          </div>

          <div className="mt-10 max-w-xl border border-border bg-bg-secondary p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Guided-tour progress
              </p>
              <p className="font-mono text-xs text-neon">
                {completedCount}/{FIELD_GUIDE_TOTAL}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden bg-bg-tertiary">
              <div
                className="h-full bg-neon transition-[width] duration-300"
                style={{
                  width: `${(completedCount / FIELD_GUIDE_TOTAL) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="concepts"
        className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Browse the guide
          </p>
          <h2 className="mt-4 max-w-3xl font-syne text-3xl font-black text-text-primary">
            Follow the sequence, or open the idea you need.
          </h2>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-text-secondary">
            The order is designed for first-time learners. Browsing is here for
            review, not as another decision you must make before beginning.
          </p>

          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {FIELD_GUIDE_LESSONS.map((lesson) => {
              const complete = progress.completedLessons.includes(lesson.slug);
              const current = progress.lastVisited === lesson.slug;

              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/resources/react/field-guide/${lesson.slug}`}
                    className="group flex min-h-24 items-center gap-4 border border-border bg-bg-secondary p-5 transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
                  >
                    <span
                      className={[
                        "flex h-10 w-10 flex-none items-center justify-center border font-mono text-xs",
                        complete
                          ? "border-neon bg-neon text-bg-primary"
                          : "border-border text-text-secondary",
                      ].join(" ")}
                    >
                      {complete ? "✓" : String(lesson.id).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-syne text-lg font-bold text-text-primary">
                        {lesson.title}
                      </span>
                      <span className="mt-1 block text-sm text-text-secondary">
                        {complete
                          ? "Concept reviewed"
                          : current
                            ? "Continue here"
                            : "Concept · Example · Practice"}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-sm text-accent transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}

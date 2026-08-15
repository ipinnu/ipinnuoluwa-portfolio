"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lesson } from "@/lib/react-hub/course";
import { TOTAL_LESSONS, getModuleById } from "@/lib/react-hub/course";
import {
  getProgress,
  isComplete,
  markComplete,
  markVisited,
  recordExerciseEvidence,
} from "@/lib/react-hub/progress";

const SandpackExercise = dynamic(() => import("./SandpackExercise"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center border border-border bg-bg-secondary">
      <span className="font-mono text-xs text-text-tertiary">Preparing the browser workspace…</span>
    </div>
  ),
});

function ExerciseCard({
  lessonId,
  exercise,
  completed,
  onComplete,
}: {
  lessonId: string;
  exercise: Lesson["exercises"][number];
  completed: boolean;
  onComplete: (exerciseId: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  return (
    <article className="border border-border bg-bg-secondary p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {exercise.type}
        </span>
        {completed && <span className="font-mono text-[10px] text-neon">✓ reviewed</span>}
      </div>
      <p className="max-w-[70ch] text-base leading-7 text-text-primary">{exercise.instruction}</p>
      <label className="mt-5 block">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          Think before the guide
        </span>
        <textarea
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setShowGuide(false);
          }}
          rows={4}
          placeholder="Write your reasoning in your own words…"
          className="w-full resize-y border border-border bg-bg-primary px-4 py-3 text-base leading-7 text-text-primary placeholder:text-text-tertiary focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20"
        />
      </label>

      {!showGuide ? (
        <button
          type="button"
          disabled={answer.trim().length < 20}
          onClick={() => setShowGuide(true)}
          className="mt-3 min-h-11 cursor-pointer bg-neon px-4 font-mono text-xs font-bold text-bg-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
        >
          Compare with the guide
        </button>
      ) : (
        <div className="mt-4 border-l-2 border-neon bg-neon/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon">Concept guide</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
            {(exercise.answerGuide ?? []).map((point) => <li key={point}>— {point}</li>)}
          </ul>
          <button
            type="button"
            disabled={completed}
            onClick={() => onComplete(exercise.id)}
            className="mt-4 min-h-11 cursor-pointer border border-neon/50 px-4 font-mono text-xs text-neon hover:bg-neon/10 disabled:cursor-default disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
          >
            {completed ? "Reasoning reviewed" : "I compared my reasoning"}
          </button>
        </div>
      )}
    </article>
  );
}

export default function ProjectLessonLayout({
  lesson,
  prev,
  next,
}: {
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  const module = getModuleById(lesson.moduleId);
  const [done, setDone] = useState(false);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [workspaceChecked, setWorkspaceChecked] = useState(false);

  useEffect(() => {
    markVisited(lesson.id);
    const progress = getProgress();
    setDone(isComplete(lesson.id));
    setEvidence(progress.exerciseEvidence[lesson.id] ?? []);
    setWorkspaceChecked(false);
    window.dispatchEvent(new Event("hub-progress-update"));
  }, [lesson.id]);

  const recordEvidence = useCallback((exerciseId: string) => {
    const progress = recordExerciseEvidence(lesson.id, exerciseId);
    setEvidence(progress.exerciseEvidence[lesson.id] ?? []);
    window.dispatchEvent(new Event("hub-progress-update"));
  }, [lesson.id]);

  const requirementsMet = evidence.length === lesson.exercises.length && workspaceChecked;

  function completeLesson() {
    if (!requirementsMet || done) return;
    markComplete(lesson.id);
    setDone(true);
    window.dispatchEvent(new Event("hub-progress-update"));
  }

  return (
    <article className="min-h-screen">
      <header className="border-b border-border px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Module {module.order} · Lesson {lesson.order} of {TOTAL_LESSONS} · {lesson.duration}
          </p>
          <h1 className="mt-3 max-w-4xl font-syne text-3xl font-black leading-tight text-text-primary sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-base leading-7 text-text-secondary">{lesson.outcome}</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-14 px-5 py-10 sm:px-8 lg:px-12">
        <section aria-labelledby="product-problem">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">01 · The product problem</p>
          <h2 id="product-problem" className="mt-3 font-syne text-2xl font-bold text-text-primary">
            Why this lesson exists
          </h2>
          <p className="mt-4 max-w-[70ch] text-base leading-8 text-text-secondary">{lesson.productProblem}</p>
        </section>

        <section aria-labelledby="under-the-hood">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">02 · Under the hood</p>
          <h2 id="under-the-hood" className="mt-3 font-syne text-2xl font-bold text-text-primary">
            Build the mental model
          </h2>
          <div className="mt-5 max-w-[70ch] space-y-5">
            {lesson.concept.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-text-secondary">{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="think-first">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">03 · Think before code</p>
          <h2 id="think-first" className="mt-3 font-syne text-2xl font-bold text-text-primary">
            Say the steps plainly
          </h2>
          <ol className="mt-5 max-w-3xl border border-border bg-bg-secondary">
            {lesson.pseudocode.map((step, index) => (
              <li key={step} className="flex gap-4 border-b border-border px-5 py-4 last:border-b-0">
                <span className="font-mono text-xs text-neon">{String(index + 1).padStart(2, "0")}</span>
                <code className="font-mono text-sm leading-6 text-text-primary">{step}</code>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="workspace">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">04 · Build the next slice</p>
          <h2 id="workspace" className="mt-3 font-syne text-2xl font-bold text-text-primary">
            Your expense tracker
          </h2>
          <p className="mb-5 mt-3 max-w-[70ch] text-base leading-7 text-text-secondary">
            Read the files, change something deliberately, and use the live preview to connect the code to the visible product.
          </p>
          <SandpackExercise files={lesson.workspace} lessonId={lesson.id} />
        </section>

        <section aria-labelledby="practice">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">05 · Predict, trace, build, explain</p>
          <h2 id="practice" className="mt-3 font-syne text-2xl font-bold text-text-primary">
            Prove the idea is yours
          </h2>
          <div className="mt-5 space-y-4">
            {lesson.exercises.map((exercise) => (
              <ExerciseCard
                key={`${lesson.id}-${exercise.id}`}
                lessonId={lesson.id}
                exercise={exercise}
                completed={evidence.includes(exercise.id)}
                onComplete={recordEvidence}
              />
            ))}
          </div>
        </section>

        <section className="border border-neon/30 bg-neon/5 p-6" aria-labelledby="checkpoint">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon">06 · Checkpoint</p>
          <h2 id="checkpoint" className="mt-3 font-syne text-2xl font-bold text-text-primary">Your app now…</h2>
          <p className="mt-3 max-w-[70ch] text-base leading-7 text-text-secondary">{lesson.milestone}</p>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-text-secondary">
            <input
              type="checkbox"
              checked={workspaceChecked}
              onChange={(event) => setWorkspaceChecked(event.target.checked)}
              className="mt-1 h-5 w-5 accent-[#E8FF47]"
            />
            <span>I changed or inspected the workspace and confirmed the visible milestone in the preview.</span>
          </label>
          <button
            type="button"
            onClick={completeLesson}
            disabled={!requirementsMet || done}
            className="mt-5 min-h-11 cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            {done ? "✓ Checkpoint complete" : "Complete checkpoint"}
          </button>
          {!requirementsMet && (
            <p className="mt-3 font-mono text-[10px] text-text-tertiary">
              Review both reasoning exercises and confirm the workspace milestone to continue.
            </p>
          )}
        </section>

        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">Official references</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {lesson.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center border border-border px-4 text-sm text-text-secondary hover:border-accent/50 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
              >
                {resource.label} ↗
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          {prev ? (
            <Link className="text-sm text-text-secondary hover:text-text-primary" href={`/resources/react/${prev.slug}`}>
              ← {prev.title}
            </Link>
          ) : <Link className="text-sm text-text-secondary hover:text-text-primary" href="/resources/react/intro">← Start Here</Link>}
          {next ? (
            <Link className="text-right text-sm text-neon hover:opacity-80" href={`/resources/react/${next.slug}`}>
              {next.title} →
            </Link>
          ) : <span className="text-sm text-neon">Project path complete</span>}
        </div>
      </footer>
    </article>
  );
}

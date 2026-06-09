"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Exercise, Lesson } from "@/lib/react-hub/curriculum";

const SandpackExercise = dynamic(() => import("./SandpackExercise"), {
  ssr: false,
  loading: () => (
    <div className="border border-border bg-bg-secondary h-64 flex items-center justify-center">
      <span className="font-mono text-xs text-text-tertiary animate-pulse">
        Loading editor...
      </span>
    </div>
  ),
});

const LEVEL_LABELS: Record<string, string> = {
  fix: "Fix It",
  build: "Build It",
  explain: "Explain It",
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  fix: "Something in the code below is broken. Figure out what's wrong and fix it.",
  build: "Build the component from scratch using the starter code provided.",
  explain: "No code editor for this one — just write your answer in plain English.",
};

function ExplainExercise({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const keywords = exercise.checkKeywords ?? [];

  const foundKeywords = checked
    ? keywords.filter((kw) => answer.toLowerCase().includes(kw.toLowerCase()))
    : [];

  const missingKeywords = checked
    ? keywords.filter((kw) => !answer.toLowerCase().includes(kw.toLowerCase()))
    : [];

  const passed = checked && missingKeywords.length === 0;

  return (
    <div className="space-y-3">
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setChecked(false);
        }}
        placeholder="Write your answer here..."
        rows={5}
        className="w-full bg-bg-secondary border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary font-dm-sans resize-none focus:outline-none focus:border-neon/40 transition-colors rounded-[2px]"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setChecked(true)}
          disabled={!answer.trim()}
          className="font-mono text-xs px-4 py-2 bg-neon text-bg-primary font-semibold rounded-[2px] hover:bg-neon/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
        {checked && (
          <span
            className={[
              "font-mono text-xs",
              passed ? "text-neon" : "text-text-secondary",
            ].join(" ")}
          >
            {passed ? "✓ Good answer" : `Hint: try mentioning...`}
          </span>
        )}
      </div>

      {checked && !passed && missingKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {missingKeywords.map((kw) => (
            <span
              key={kw}
              className="font-mono text-[10px] px-2 py-0.5 border border-border text-text-tertiary"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {checked && foundKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {foundKeywords.map((kw) => (
            <span
              key={kw}
              className="font-mono text-[10px] px-2 py-0.5 border border-neon/30 text-neon"
            >
              ✓ {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface PracticeSectionProps {
  exercises: Exercise[];
  practiceNote: string;
}

export default function PracticeSection({ exercises, practiceNote }: PracticeSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const exercise = exercises[activeIdx];

  return (
    <div className="space-y-6">
      {/* Concept link callout */}
      <div className="border border-border bg-bg-secondary p-4 flex gap-3">
        <span className="font-mono text-[10px] text-neon mt-0.5 flex-shrink-0 select-none">
          ▸
        </span>
        <div>
          <p className="font-mono text-[10px] text-neon tracking-widest uppercase mb-1">
            What this tests
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {practiceNote}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1">
        {exercises.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={[
              "font-mono text-[10px] px-3 py-1.5 border transition-colors",
              activeIdx === i
                ? "border-neon text-neon bg-neon/5"
                : "border-border text-text-tertiary hover:text-text-secondary",
            ].join(" ")}
            style={activeIdx === i ? { backgroundColor: "rgba(232,255,71,0.05)" } : {}}
          >
            {LEVEL_LABELS[ex.type]}
          </button>
        ))}
      </div>

      {/* Task */}
      <div className="space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          <span className="font-mono text-[10px] text-text-tertiary mr-2 uppercase">
            Task:
          </span>
          {exercise.instruction}
        </p>

        {exercise.type !== "explain" && exercise.starterCode ? (
          <SandpackExercise
            key={activeIdx}
            code={exercise.starterCode}
            exerciseType={exercise.type}
          />
        ) : exercise.type === "explain" ? (
          <ExplainExercise key={activeIdx} exercise={exercise} index={activeIdx} />
        ) : null}
      </div>
    </div>
  );
}

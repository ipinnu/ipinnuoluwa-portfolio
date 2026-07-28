"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLearnerAuth } from "./LearnerAuth";

type Point = {
  keyword: string;
  title: string;
  explanation: string;
  example: string;
};

type Laboratory = {
  id: string;
  title: string;
  short: string;
  instruction: string;
  help: string;
  points: Point[];
};

export type FoundationModuleConfig = {
  id: "module-2" | "module-3";
  order: number;
  title: string;
  mission: string;
  headline: string;
  description: string;
  laboratories: Laboratory[];
  completion: string;
  nextModule?: {
    href: string;
    label: string;
  };
};

const pointStyles = [
  { text: "text-accent", surface: "border-accent/45 bg-accent/10" },
  { text: "text-[#38d9ff]", surface: "border-[#38d9ff]/45 bg-[#38d9ff]/10" },
  { text: "text-neon", surface: "border-neon/45 bg-neon/10" },
  { text: "text-text-primary", surface: "border-text-primary/35 bg-white/5" },
] as const;

function GuidedLaboratory({
  laboratory,
  initiallyComplete,
  onComplete,
}: {
  laboratory: Laboratory;
  initiallyComplete: boolean;
  onComplete: () => void;
}) {
  const [completed, setCompleted] = useState<number[]>(
    initiallyComplete ? laboratory.points.map((_, index) => index) : [],
  );
  const [selected, setSelected] = useState(
    initiallyComplete ? laboratory.points.length - 1 : 0,
  );
  const [helpPinned, setHelpPinned] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const point = laboratory.points[selected];
  const style = pointStyles[selected % pointStyles.length];
  const finished = completed.length === laboratory.points.length;

  function continueLab() {
    if (!completed.includes(selected)) {
      const next = [...completed, selected];
      setCompleted(next);
      if (next.length === laboratory.points.length) onComplete();
    }
    if (selected < laboratory.points.length - 1) setSelected(selected + 1);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border border-border bg-bg-secondary p-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-[68ch] text-sm leading-6 text-text-secondary">
          {laboratory.instruction}
        </p>
        <div
          className="relative shrink-0"
          onMouseEnter={() => setHelpHovered(true)}
          onMouseLeave={() => setHelpHovered(false)}
          onFocusCapture={() => setHelpHovered(true)}
          onBlurCapture={() => setHelpHovered(false)}
        >
          <button
            type="button"
            aria-expanded={helpPinned || helpHovered}
            aria-controls={`${laboratory.id}-help`}
            onClick={() => setHelpPinned((current) => !current)}
            className="min-h-11 cursor-pointer border border-accent/40 px-4 font-mono text-xs text-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
          >
            Need help?
          </button>
          {(helpPinned || helpHovered) && (
            <div
              id={`${laboratory.id}-help`}
              role="note"
              className="z-20 mt-2 w-full border border-accent/30 bg-[#101512] p-4 text-sm leading-6 text-text-secondary shadow-2xl sm:absolute sm:right-0 sm:w-80"
            >
              {laboratory.help}
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-text-tertiary">Laboratory progress</span>
        <span className={finished ? "text-neon" : "text-accent"}>
          {finished ? "✓ Complete" : `${completed.length}/${laboratory.points.length} points`}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-2">
          {laboratory.points.map((item, index) => {
            const itemStyle = pointStyles[index % pointStyles.length];
            const done = completed.includes(index);
            const locked = index > completed.length;
            return (
              <button
                key={item.keyword}
                type="button"
                disabled={locked}
                onClick={() => setSelected(index)}
                aria-current={selected === index ? "step" : undefined}
                className={[
                  "flex min-h-16 w-full items-center gap-3 border px-4 text-left transition-colors",
                  locked ? "cursor-not-allowed border-border opacity-35" : "cursor-pointer hover:brightness-125",
                  selected === index ? itemStyle.surface : "border-border bg-bg-secondary",
                ].join(" ")}
              >
                <span className={`font-mono text-[10px] font-bold ${itemStyle.text}`}>
                  {done ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className={`block font-mono text-[10px] font-bold tracking-widest ${itemStyle.text}`}>
                    {item.keyword}
                  </span>
                  <span className="mt-1 block text-sm text-text-primary">{item.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={`min-h-72 border p-5 sm:p-6 ${style.surface}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={point.keyword}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <p className={`font-mono text-[10px] font-bold tracking-widest ${style.text}`}>
                Point {String(selected + 1).padStart(2, "0")} · {point.keyword}
              </p>
              <h3 className="mt-3 font-syne text-2xl font-bold text-text-primary">{point.title}</h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{point.explanation}</p>
              <pre className="mt-5 overflow-x-auto border border-border bg-bg-primary/80 p-4 text-sm leading-6 text-text-primary">
                <code>{point.example}</code>
              </pre>
              <button
                type="button"
                onClick={continueLab}
                disabled={finished && selected === laboratory.points.length - 1}
                className="mt-5 min-h-12 w-full cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 disabled:cursor-default disabled:bg-accent"
              >
                {selected === laboratory.points.length - 1
                  ? finished ? "✓ Laboratory complete" : "Complete this laboratory"
                  : `Continue to ${laboratory.points[selected + 1].keyword} →`}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function FoundationModuleLab({ config }: { config: FoundationModuleConfig }) {
  const { session, learnerName } = useLearnerAuth();
  const [active, setActive] = useState(config.laboratories[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [versions, setVersions] = useState<Record<string, number>>({});
  const storageKey = `react-hub-${config.id}-explored`;
  const activeIndex = config.laboratories.findIndex((lab) => lab.id === active);
  const laboratory = config.laboratories[activeIndex] ?? config.laboratories[0];

  useEffect(() => {
    try {
      setCompleted(JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[]);
    } catch {
      setCompleted([]);
    }
  }, [storageKey]);

  async function setCompletion(labId: string, explored: boolean) {
    const next = explored
      ? Array.from(new Set([...completed, labId]))
      : completed.filter((id) => id !== labId);
    setCompleted(next);
    if (!explored) {
      setVersions((current) => ({ ...current, [labId]: (current[labId] ?? 0) + 1 }));
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("hub-module-progress-update"));
    } catch {}

    if (session) {
      await supabase.from("course_progress").upsert({
        learner_id: session.user.id,
        module_id: config.id,
        activity_id: labId,
        explored,
        payload: {},
        updated_at: new Date().toISOString(),
      });
    }
  }

  const isComplete = completed.includes(laboratory.id);

  return (
    <main className="hub-lab-theme">
      <header className="hub-lab-hero border-b border-[#29332d] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="hub-kicker">Module {config.order} · {config.title}</p>
          <div className="hub-mission-badge mt-4">
            <span className="hub-mission-orbit" />
            Mission {String(config.order).padStart(2, "0")} · {config.mission}
          </div>
          <h1 className="mt-5 max-w-4xl font-syne text-4xl font-black leading-[1.05] text-white sm:text-6xl">
            {config.headline}
          </h1>
          <p className="mt-4 max-w-[70ch] text-base leading-8 text-text-secondary">
            Welcome, {learnerName}. {config.description}
          </p>

          <div className="mt-10">
            <p className="hub-kicker">Choose your laboratory</p>
            <p className="mt-2 text-sm text-[#8b968f]">Start anywhere available. Complete every point to finish a laboratory.</p>
          </div>
          <nav className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={`${config.title} laboratories`}>
            {config.laboratories.map((lab, index) => {
              const done = completed.includes(lab.id);
              return (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => setActive(lab.id)}
                  aria-current={active === lab.id ? "step" : undefined}
                  className={["hub-station", active === lab.id ? "is-active" : "", done ? "is-explored" : ""].join(" ")}
                >
                  <span className="hub-station-icon font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hub-station-number">{done ? "✓ DONE" : String(index + 1).padStart(2, "0")}</span>
                  <strong>{lab.title}</strong>
                  <small>{done ? "Lab complete" : active === lab.id ? "In progress" : lab.short}</small>
                  <span className="hub-station-arrow" aria-hidden="true">→</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="hub-lab-stage mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        <section className="hub-lab-card">
          <div className="hub-lab-heading">
            <div>
              <p className="hub-kicker">Laboratory {String(activeIndex + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 max-w-3xl font-syne text-3xl font-black text-white sm:text-4xl">{laboratory.title}</h2>
            </div>
            {isComplete ? (
              <button
                type="button"
                onClick={() => setCompletion(laboratory.id, false)}
                className="hub-safe-chip hub-safe-chip-button"
                aria-label={`Mark ${laboratory.title} incomplete and restart it`}
              >
                <span />✓ Lab complete · undo
              </button>
            ) : (
              <div className="hub-safe-chip"><span />No wrong moves</div>
            )}
          </div>
          <div className="mt-8">
            <GuidedLaboratory
              key={`${laboratory.id}-${versions[laboratory.id] ?? 0}`}
              laboratory={laboratory}
              initiallyComplete={isComplete}
              onComplete={() => setCompletion(laboratory.id, true)}
            />
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => setActive(config.laboratories[activeIndex - 1].id)}
            className="min-h-11 cursor-pointer text-sm text-text-secondary hover:text-text-primary disabled:cursor-default disabled:opacity-30"
          >
            ← Previous laboratory
          </button>
          {activeIndex < config.laboratories.length - 1 ? (
            <button
              type="button"
              onClick={() => setActive(config.laboratories[activeIndex + 1].id)}
              className="min-h-11 cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90"
            >
              Explore the next laboratory →
            </button>
          ) : (
            <div className="max-w-md sm:text-right">
              <p className="text-sm leading-6 text-text-secondary">{config.completion}</p>
              {config.nextModule && (
                <Link
                  href={config.nextModule.href}
                  className="mt-4 inline-flex min-h-11 items-center bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
                >
                  {config.nextModule.label} →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

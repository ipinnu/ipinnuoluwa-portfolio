"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LAB_MODULES } from "@/lib/react-hub/module-map";
import { useLearnerAuth } from "./LearnerAuth";
import {
  dismissMigrationNotice,
  shouldShowMigrationNotice,
} from "@/lib/react-hub/progress";

const webLayers = [
  ["HTML", "Structure", "The meaningful content: headings, forms, buttons, and lists."],
  ["CSS", "Presentation", "Layout, spacing, colour, typography, and responsive behavior."],
  ["JavaScript", "Behavior", "Values, decisions, events, calculations, and browser APIs."],
  ["TypeScript", "Clarity", "Labels that catch mismatched data before it reaches a learner."],
  ["React", "Coordination", "Components and state that keep changing data synchronized with the screen."],
];

export default function CourseIntro() {
  const { session, openAuth } = useLearnerAuth();
  const [showMigration, setShowMigration] = useState(false);

  useEffect(() => {
    setShowMigration(shouldShowMigrationNotice());
  }, []);

  const target = "/resources/react/module-1";
  const begin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      event.preventDefault();
      openAuth(target);
    }
  };

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-border px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(232,255,71,0.09),transparent_35%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">
            Free · zero prerequisites · one real project
          </p>
          <h1 className="mt-5 max-w-4xl font-syne text-4xl font-black leading-[1.05] text-text-primary sm:text-6xl">
            Learn how the web works by building something that works.
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-8 text-text-secondary">
            Start in the browser with no installation. Explore the web from first principles, then build one expense tracker across ten connected modules and deploy it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={target}
              onClick={begin}
              className="flex min-h-12 items-center justify-center bg-neon px-6 font-mono text-sm font-bold text-bg-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
            >
              Enter Module 1 →
            </Link>
            <a href="#roadmap" className="flex min-h-12 items-center justify-center border border-border px-6 font-mono text-sm text-text-secondary hover:border-accent/50 hover:text-text-primary">
              See the full path
            </a>
          </div>
          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {[["10", "connected modules"], ["4", "labs in Module 1"], ["0", "setup to begin"], ["1", "deployed project"]].map(([value, label]) => (
              <div key={label} className="bg-bg-primary p-4">
                <p className="font-mono text-2xl font-bold text-text-primary">{value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showMigration && (
        <section className="border-b border-accent/30 bg-accent/5 px-5 py-5 sm:px-8 lg:px-12" aria-live="polite">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[70ch] text-sm leading-6 text-text-secondary">
              This is a rebuilt project-led course. Your earlier progress remains stored, but this new path starts clean because its milestones are different.
            </p>
            <button
              type="button"
              onClick={() => {
                dismissMigrationNotice();
                setShowMigration(false);
              }}
              className="min-h-11 cursor-pointer border border-accent/40 px-4 font-mono text-xs text-accent hover:bg-accent/10"
            >
              Understood
            </button>
          </div>
        </section>
      )}

      <section className="border-b border-border px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">One browser, five layers</p>
          <h2 className="mt-4 max-w-3xl font-syne text-3xl font-black text-text-primary">
            React makes more sense when the foundations stop being mysterious.
          </h2>
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-5">
            {webLayers.map(([name, job, detail]) => (
              <article key={name} className="bg-bg-primary p-5">
                <p className="font-mono text-sm font-bold text-neon">{name}</p>
                <p className="mt-2 text-sm font-semibold text-text-primary">{job}</p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">The project path</p>
          <h2 className="mt-4 font-syne text-3xl font-black text-text-primary">Ten modules. One evolving project.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {LAB_MODULES.map((module) => (
              <article key={module.id} className="border border-border bg-bg-secondary p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neon">Module {module.order}</p>
                <h3 className="mt-2 font-syne text-xl font-bold text-text-primary">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{module.promise}</p>
                <p className="mt-5 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  {module.status === "available" ? "Available now" : module.status === "next" ? "Built next" : "Planned"}
                </p>
              </article>
            ))}
          </div>
          <Link href={target} onClick={begin} className="mt-8 inline-flex min-h-12 items-center bg-neon px-6 font-mono text-sm font-bold text-bg-primary hover:opacity-90">
            Enter the first laboratory →
          </Link>
        </div>
      </section>
    </main>
  );
}

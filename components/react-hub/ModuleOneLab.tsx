"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLearnerAuth } from "./LearnerAuth";

const stations = [
  { id: "browser", label: "You Are the Browser", short: "Trace the signal", number: "01" },
  { id: "machine", label: "Input → Output Machine", number: "02" },
  { id: "break", label: "Break the Web", short: "Reveal each layer", number: "03" },
  { id: "files", label: "File Explorer", short: "Connect the pieces", number: "04" },
] as const;

type StationId = (typeof stations)[number]["id"];

const webEras = [
  {
    id: "origin",
    eyebrow: "1990 · The origin",
    title: "One computer served the first web.",
    promise: "CONNECT",
    image: "/images/react-hub/first-web-server.jpg",
    alt: "The NeXT workstation used by Tim Berners-Lee at CERN as the first web server",
    body: "A browser asked. A server answered.\nThat simple conversation is still underneath the web you use today.",
    credit: "Coolcaesar / Wikimedia Commons · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:First_Web_Server.jpg",
  },
  {
    id: "web1",
    eyebrow: "1991 · Web 1",
    title: "The web began as linked knowledge.",
    promise: "READ",
    image: "/images/react-hub/first-website.png",
    alt: "Public-domain capture of the first World Wide Web website in its original browser",
    body: "Early pages were mostly documents and links. HTML gave ideas structure and URLs gave every document an address.",
    credit: "CERN / Tim Berners-Lee · Public domain",
    href: "https://commons.wikimedia.org/wiki/File:W3_First_Website.png",
  },
  {
    id: "now",
    eyebrow: "Now · Web 2 and beyond",
    title: "Pages became places where people create.",
    promise: "READ · WRITE · OWN?",
    image: "/images/react-hub/modern-code.jpg",
    alt: "A modern laptop screen showing source code",
    body: "Web 2 made participation normal. Web3 is an evolving vision of decentralized ownership. Both still depend on files, requests, browsers, and code.",
    credit: "Slashme / Wikimedia Commons · CC0",
    href: "https://commons.wikimedia.org/wiki/File:RustCodeOnScreen.jpg",
  },
] as const;

function StationGlyph({ id }: { id: StationId }) {
  const paths: Record<StationId, React.ReactNode> = {
    browser: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 14h4m2 0h4" />
      </>
    ),
    machine: (
      <>
        <path d="M4 7h5v5H4zM15 12h5v5h-5zM9 9.5h3a3 3 0 0 1 3 3v2.5" />
        <path d="m12 12 3 3-3 3" />
      </>
    ),
    break: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    files: (
      <>
        <path d="M3 6.5h7l2 2h9v10.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5Z" />
        <path d="M3 11h18" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      {paths[id]}
    </svg>
  );
}

function WebHistory() {
  const [era, setEra] = useState<(typeof webEras)[number]["id"]>("origin");
  const selected = webEras.find((item) => item.id === era) ?? webEras[0];

  return (
    <section className="hub-history" aria-labelledby="web-history-title">
      <div className="hub-history-copy">
        <div>
          <p className="hub-kicker">Signal from the past</p>
          <h2 id="web-history-title" className="mt-3 font-syne text-2xl font-bold text-white sm:text-3xl">
            The tools change. The conversation remains.
          </h2>
        </div>
        <div className="hub-era-tabs" role="tablist" aria-label="Explore moments in web history">
          {webEras.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={era === item.id}
              onClick={() => setEra(item.id)}
              className={era === item.id ? "is-active" : ""}
            >
              {item.id === "origin" ? "Origin" : item.id === "web1" ? "Web 1" : "Now"}
            </button>
          ))}
        </div>
      </div>

      <div className="hub-history-frame">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0"
          >
            <Image
              src={selected.image}
              alt={selected.alt}
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="hub-history-scrim" />
        <div className="hub-history-story">
          <p>{selected.eyebrow}</p>
          <strong>{selected.title}</strong>
          <span>{selected.body}</span>
          <b>{selected.promise}</b>
        </div>
      </div>
      <a href={selected.href} target="_blank" rel="noreferrer" className="hub-credit">
        Photo: {selected.credit}
      </a>
    </section>
  );
}

function LabShell({
  label,
  title,
  description,
  complete,
  onReset,
  children,
}: {
  label: string;
  title: string;
  description: string;
  complete: boolean;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="hub-lab-card">
      <div className="hub-lab-heading">
        <div>
          <p className="hub-kicker">{label}</p>
          <h2 className="mt-3 max-w-3xl font-syne text-3xl font-black text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-[68ch] text-base leading-8 text-[#b9c2bc]">{description}</p>
        </div>
        {complete ? (
          <button
            type="button"
            onClick={onReset}
            className="hub-safe-chip hub-safe-chip-button"
            aria-label={`Mark ${label} incomplete and restart it`}
            title="Tap to mark this lab incomplete and restart it"
          >
            <span />
            ✓ Lab complete · undo
          </button>
        ) : (
          <div className="hub-safe-chip">
            <span />
            No wrong moves
          </div>
        )}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function BrowserLab({
  initiallyComplete,
  onExplore,
}: {
  initiallyComplete: boolean;
  onExplore: () => void;
}) {
  const steps = [
    ["URL entered", "https://learn.example/expense-tracker"],
    ["Request travels", "GET /expense-tracker"],
    ["Server responds", "200 OK · page resources attached"],
    ["Packages arrive", "index.html · styles.css · script.js · wallet.svg"],
    ["Browser assembles", "Structure, presentation, behavior, and media become one experience"],
  ];
  const [step, setStep] = useState(initiallyComplete ? steps.length - 1 : 0);

  function advance() {
    const next = Math.min(step + 1, steps.length - 1);
    setStep(next);
    if (next === steps.length - 1) onExplore();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <div className="border border-border bg-bg-secondary p-5">
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Select the <strong className="font-mono text-neon">SEND THE REQUEST</strong> button. Each lime-highlighted step shows the request moving between the browser and server.
        </p>
        <div className="flex min-h-12 items-center gap-3 border border-border bg-bg-primary px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-neon" />
          <span className="font-mono text-xs text-text-primary">https://learn.example/expense-tracker</span>
        </div>
        <div className="relative mt-5 min-h-[330px] overflow-hidden border border-border bg-[#070B12] p-5">
          <div className="absolute left-8 top-8 h-16 w-24 border border-accent/50 bg-accent/10 p-3 text-center font-mono text-[10px] text-accent">
            BROWSER
          </div>
          <div className="absolute bottom-8 right-8 h-16 w-24 border border-neon/50 bg-neon/10 p-3 text-center font-mono text-[10px] text-neon">
            SERVER
          </div>
          <div className="absolute left-[34%] top-[46%] w-[34%] border-t border-dashed border-text-tertiary" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-x-5 top-[38%] text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{steps[step][0]}</p>
              <p className="mt-3 text-sm leading-6 text-text-primary">{steps[step][1]}</p>
            </motion.div>
          </AnimatePresence>
          {step >= 3 && (
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
              {["HTML", "CSS", "JS", "SVG"].map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: .8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * .08 }}
                  className="border border-border bg-bg-secondary px-3 py-2 font-mono text-[10px] text-text-secondary"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={advance}
          disabled={step === steps.length - 1}
          className="mt-4 min-h-12 w-full cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 disabled:cursor-default disabled:bg-accent disabled:opacity-80"
        >
          {step === 0 ? "Send the request" : step === steps.length - 1 ? "The page is alive" : "Follow the journey"}
        </button>
      </div>

      <div className="border border-border p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">What is happening?</p>
        <ol className="mt-4 space-y-2">
          {steps.map(([title, detail], index) => (
            <li
              key={title}
              className={[
                "border p-4 transition-colors",
                index <= step ? "border-neon/30 bg-neon/5" : "border-border opacity-45",
              ].join(" ")}
            >
              <p className="font-mono text-[10px] text-neon">{String(index + 1).padStart(2, "0")} · {title}</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm leading-6 text-text-secondary">
          You just followed a complete web request. Every website begins with a conversation like this, even when the real journey happens in milliseconds.
        </p>
      </div>
    </div>
  );
}

function MachineLab({
  initiallyComplete,
  onExplore,
}: {
  initiallyComplete: boolean;
  onExplore: () => void;
}) {
  const points = [
    {
      id: "form",
      keyword: "INPUT",
      label: "Description + amount",
      explanation: "Information enters the program through the expense form.",
      example: "The learner types “Bus fare” and “₦1,500”.",
      color: "text-accent",
      surface: "border-accent/50 bg-accent/10",
    },
    {
      id: "validation",
      keyword: "PROCESS",
      label: "Validation + calculation",
      explanation: "Instructions check the information and calculate a new total.",
      example: "The program confirms the amount is valid, then adds it to existing expenses.",
      color: "text-[#38d9ff]",
      surface: "border-[#38d9ff]/50 bg-[#38d9ff]/10",
    },
    {
      id: "receipt",
      keyword: "OUTPUT",
      label: "Receipt + total",
      explanation: "The result becomes visible so the learner can understand what happened.",
      example: "A new expense row appears and the total changes on screen.",
      color: "text-neon",
      surface: "border-neon/50 bg-neon/10",
    },
    {
      id: "saved",
      keyword: "STORAGE",
      label: "Saved expenses",
      explanation: "The program keeps information so it can return during a later visit.",
      example: "The expense remains available after the page is closed and reopened.",
      color: "text-text-primary",
      surface: "border-text-primary/40 bg-white/5",
    },
  ] as const;
  type PointId = (typeof points)[number]["id"];
  const [completed, setCompleted] = useState<PointId[]>(
    initiallyComplete ? points.map((point) => point.id) : [],
  );
  const [selectedId, setSelectedId] = useState<PointId>(
    initiallyComplete ? points[points.length - 1].id : points[0].id,
  );
  const [helpPinned, setHelpPinned] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const selected = points.find((point) => point.id === selectedId) ?? points[0];
  const selectedIndex = points.findIndex((point) => point.id === selected.id);
  const showHelp = helpPinned || helpHovered;

  function explorePoint(id: PointId, index: number) {
    if (index > completed.length) return;
    setSelectedId(id);
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    if (next.length === points.length) onExplore();
  }

  function continueJourney() {
    explorePoint(selected.id, selectedIndex);
    if (selectedIndex < points.length - 1) {
      const next = points[selectedIndex + 1];
      setSelectedId(next.id);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border border-border bg-bg-secondary p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon">Four-point process</p>
          <p className="mt-2 max-w-[66ch] text-sm leading-6 text-text-secondary">
            Follow the expense from <strong className="text-accent">INPUT</strong> to{" "}
            <strong className="text-[#38d9ff]">PROCESS</strong>,{" "}
            <strong className="text-neon">OUTPUT</strong>, and{" "}
            <strong className="text-text-primary">STORAGE</strong>. The repeated word and color show where you are.
          </p>
        </div>
        <div
          className="relative shrink-0"
          onMouseEnter={() => setHelpHovered(true)}
          onMouseLeave={() => setHelpHovered(false)}
          onFocusCapture={() => setHelpHovered(true)}
          onBlurCapture={() => setHelpHovered(false)}
        >
          <button
            type="button"
            aria-expanded={showHelp}
            aria-controls="machine-lab-help"
            onClick={() => setHelpPinned((current) => !current)}
            className="min-h-11 cursor-pointer border border-accent/40 px-4 font-mono text-xs text-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
          >
            Need help?
          </button>
          {showHelp && (
            <div
              id="machine-lab-help"
              role="note"
              className="z-20 mt-2 w-full border border-accent/30 bg-[#101512] p-4 text-sm leading-6 text-text-secondary shadow-2xl sm:absolute sm:right-0 sm:w-80"
            >
              Start at point 01 and use “Continue” after reading the example. Completed points stay available so you can review them.
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-text-tertiary">Process progress</span>
        <span className={completed.length === points.length ? "text-neon" : "text-accent"}>
          {completed.length === points.length ? "✓ Lab complete" : `${completed.length}/4 points`}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-2">
          {points.map((point, index) => {
            const done = completed.includes(point.id);
            const locked = index > completed.length;
            const active = selected.id === point.id;
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => explorePoint(point.id, index)}
                disabled={locked}
                aria-current={active ? "step" : undefined}
                className={[
                  "flex min-h-16 w-full items-center gap-3 border px-4 text-left transition-colors",
                  locked ? "cursor-not-allowed border-border opacity-35" : "cursor-pointer hover:brightness-125",
                  active ? point.surface : "border-border bg-bg-secondary",
                ].join(" ")}
              >
                <span className={`font-mono text-[10px] font-bold ${point.color}`}>
                  {done ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className={`block font-mono text-[10px] font-bold tracking-widest ${point.color}`}>{point.keyword}</span>
                  <span className="mt-1 block text-sm text-text-primary">{point.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={`min-h-72 border p-5 sm:p-6 ${selected.surface}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <p className={`font-mono text-[10px] font-bold tracking-widest ${selected.color}`}>
                Point {String(selectedIndex + 1).padStart(2, "0")} · {selected.keyword}
              </p>
              <h3 className="mt-3 font-syne text-2xl font-bold text-text-primary">{selected.label}</h3>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{selected.explanation}</p>
              <div className="mt-5 border border-border bg-bg-primary/70 p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">Expense tracker example</p>
                <p className="mt-2 text-sm leading-6 text-text-primary">{selected.example}</p>
              </div>
              <button
                type="button"
                onClick={continueJourney}
                disabled={completed.length === points.length && selectedIndex === points.length - 1}
                className="mt-5 min-h-12 w-full cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 disabled:cursor-default disabled:bg-accent"
              >
                {selectedIndex === points.length - 1
                  ? completed.length === points.length ? "✓ Four-point process complete" : "Complete the process"
                  : `Continue to ${points[selectedIndex + 1].keyword} →`}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BreakWebLab({
  initiallyComplete,
  onExplore,
}: {
  initiallyComplete: boolean;
  onExplore: () => void;
}) {
  const [layers, setLayers] = useState({
    html: true,
    css: true,
    javascript: true,
    server: true,
    fast: true,
    image: true,
  });
  const [feedback, setFeedback] = useState("Everything is connected. Explore one switch at a time.");

  const switches = [
    ["html", "HTML", "HTML supplies the meaningful structure. With it hidden, the browser has no page content to arrange."],
    ["css", "CSS", "The content still exists, but its designed presentation disappears."],
    ["javascript", "JavaScript", "The page stays visible, but adding an expense no longer performs an action."],
    ["server", "Server connection", "Without a response, the browser cannot receive the page resources."],
    ["fast", "Fast network", "A slower connection reveals the waiting state that fast networks usually hide."],
    ["image", "Wallet image", "The rest of the page survives when one optional resource is missing."],
  ] as const;
  const [tried, setTried] = useState<string[]>(
    initiallyComplete ? switches.map(([key]) => key) : [],
  );

  function toggle(key: keyof typeof layers, explanation: string) {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
    setFeedback(explanation);
    if (!tried.includes(key)) {
      const next = [...tried, key];
      setTried(next);
      if (next.length === switches.length) onExplore();
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className="border border-border bg-bg-secondary p-4">
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          <strong className="font-mono text-neon">SWITCH</strong> every web layer once. The matching lime state shows which layer is currently on.
        </p>
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
          <span className="text-accent">Web layers</span>
          <span className={tried.length === switches.length ? "text-neon" : "text-text-tertiary"}>
            {tried.length === switches.length ? "✓ Complete" : `${tried.length}/6 explored`}
          </span>
        </div>
        <div className="space-y-2">
          {switches.map(([key, label, explanation]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key, explanation)}
              aria-pressed={layers[key]}
              className="flex min-h-12 w-full cursor-pointer items-center justify-between border border-border px-3 text-left text-sm text-text-primary hover:border-neon/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
            >
              <span>{tried.includes(key) ? "✓ " : ""}{label}</span>
              <span className={layers[key] ? "font-mono text-[10px] text-neon" : "font-mono text-[10px] text-text-tertiary"}>
                {layers[key] ? "ON" : "OFF"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className={layers.css ? "min-h-[410px] rounded-2xl bg-[#F3F5EF] p-5 text-[#172018]" : "min-h-[410px] bg-white p-2 text-black"}>
          {!layers.server ? (
            <div className="flex min-h-[360px] items-center justify-center text-center">
              <div><p className="text-4xl">503</p><p className="mt-2">The server did not respond.</p></div>
            </div>
          ) : !layers.fast ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center"><span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" /><p className="mt-3">Resources are travelling slowly…</p></div>
            </div>
          ) : !layers.html ? (
            <div className="flex min-h-[360px] items-center justify-center font-mono text-sm text-gray-500">
              The document has no visible structure.
            </div>
          ) : (
            <div className={layers.css ? "mx-auto max-w-xl" : ""}>
              <div className={layers.css ? "flex items-center justify-between" : ""}>
                <div>
                  <p className={layers.css ? "text-xs font-bold uppercase tracking-widest text-[#58705E]" : ""}>My first project</p>
                  <h3 className={layers.css ? "mt-2 text-3xl font-black" : ""}>Expense Tracker</h3>
                </div>
                {layers.image ? (
                  <div className={layers.css ? "flex h-14 w-14 items-center justify-center rounded-full bg-[#DFE8D9]" : ""} aria-label="Wallet illustration">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Z" /><path d="M3 7l3-3h11v3M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
                    </svg>
                  </div>
                ) : <span>[wallet.svg missing]</span>}
              </div>
              <div className={layers.css ? "mt-6 rounded-xl border border-[#D8DED5] bg-white p-4 shadow-sm" : ""}>
                <label className={layers.css ? "block text-sm font-semibold" : ""}>Expense
                  <input className={layers.css ? "mt-2 min-h-11 w-full rounded-lg border border-[#C8D0C5] px-3" : ""} defaultValue="Bus fare" />
                </label>
                <button
                  type="button"
                  onClick={() => setFeedback(layers.javascript ? "JavaScript received the click and would add the expense." : "The button is visible, but JavaScript is off, so no behavior runs.")}
                  className={layers.css ? "mt-3 min-h-11 rounded-lg bg-[#172018] px-4 font-bold text-white" : ""}
                >
                  Add expense
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 border-l-2 border-neon bg-neon/5 p-4 text-sm leading-6 text-text-secondary" role="status">{feedback}</p>
      </div>
    </div>
  );
}

function FileLab({
  initiallyComplete,
  onExplore,
}: {
  initiallyComplete: boolean;
  onExplore: () => void;
}) {
  const files = [
    { id: "html", name: "index.html", folder: "/", link: "The browser begins with this document." },
    { id: "css", name: "styles.css", folder: "/css/", link: 'HTML now refers to "./css/styles.css".' },
    { id: "js", name: "script.js", folder: "/js/", link: 'HTML now refers to "./js/script.js".' },
    { id: "image", name: "wallet.svg", folder: "/images/", link: 'HTML now refers to "./images/wallet.svg".' },
  ];
  const [organized, setOrganized] = useState<string[]>(
    initiallyComplete ? files.map((file) => file.id) : [],
  );
  const selected = files.find((file) => organized[organized.length - 1] === file.id);

  function organize(id: string) {
    if (organized.includes(id)) return;
    const next = [...organized, id];
    setOrganized(next);
    if (next.length === files.length) onExplore();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <div className="border border-border bg-[#080B10] p-5">
        <p className="mb-4 text-sm leading-6 text-text-secondary">
          Select each lime <strong className="font-mono text-neon">EXPLORE</strong> action. Its matching lime path appears in the explanation panel after the file is connected.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">expense-tracker/</p>
        <div className="mt-4 space-y-2 font-mono text-xs">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => organize(file.id)}
              className="flex min-h-11 w-full cursor-pointer items-center justify-between border border-border px-3 text-left text-text-secondary hover:border-neon/40 hover:text-text-primary"
            >
              <span>{organized.includes(file.id) ? `${file.folder}${file.name}` : `/${file.name}`}</span>
              <span className="text-neon">{organized.includes(file.id) ? "connected" : "explore"}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border border-border p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neon">Paths are directions</p>
        <h3 className="mt-3 font-syne text-2xl font-bold text-text-primary">
          A folder move changes the directions, not the file itself.
        </h3>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Select each file to place it in a descriptive folder. Watch its path update to tell the browser where it now lives.
        </p>
        <div className="mt-6 min-h-40 border border-border bg-bg-secondary p-4">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-sm text-neon">{selected.folder}{selected.name}</p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{selected.link}</p>
            </motion.div>
          ) : (
            <p className="text-sm leading-6 text-text-tertiary">Select a file to explore its place in the project.</p>
          )}
        </div>
        {organized.length === files.length && (
          <p className="mt-4 border-l-2 border-neon bg-neon/5 p-4 text-sm leading-6 text-text-secondary">
            Your project is organized and every resource has a clear address. This is all a path is: directions from one file to another.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ModuleOneLab() {
  const { session, learnerName } = useLearnerAuth();
  const [active, setActive] = useState<StationId>("browser");
  const [explored, setExplored] = useState<StationId[]>([]);
  const [latestSignal, setLatestSignal] = useState<string | null>(null);
  const [labVersions, setLabVersions] = useState<Record<StationId, number>>({
    browser: 0,
    machine: 0,
    break: 0,
    files: 0,
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("react-hub-module-1-explored") ?? "[]") as StationId[];
      setExplored(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (!latestSignal) return;
    const timer = window.setTimeout(() => setLatestSignal(null), 3600);
    return () => window.clearTimeout(timer);
  }, [latestSignal]);

  const activeIndex = stations.findIndex((station) => station.id === active);

  async function markExplored(activityId: StationId) {
    if (explored.includes(activityId)) return;
    const next = [...explored, activityId];
    setExplored(next);
    setLatestSignal(stations.find((station) => station.id === activityId)?.label ?? "New signal");
    try {
      localStorage.setItem("react-hub-module-1-explored", JSON.stringify(next));
      window.dispatchEvent(new Event("hub-module-progress-update"));
    } catch {}

    if (session) {
      await supabase.from("course_progress").upsert({
        learner_id: session.user.id,
        module_id: "module-1",
        activity_id: activityId,
        explored: true,
        payload: {},
        updated_at: new Date().toISOString(),
      });
    }
  }

  async function markIncomplete(activityId: StationId) {
    const next = explored.filter((id) => id !== activityId);
    setExplored(next);
    setLatestSignal(null);
    setLabVersions((current) => ({
      ...current,
      [activityId]: current[activityId] + 1,
    }));

    try {
      localStorage.setItem("react-hub-module-1-explored", JSON.stringify(next));
      window.dispatchEvent(new Event("hub-module-progress-update"));
    } catch {}

    if (session) {
      await supabase.from("course_progress").upsert({
        learner_id: session.user.id,
        module_id: "module-1",
        activity_id: activityId,
        explored: false,
        payload: {},
        updated_at: new Date().toISOString(),
      });
    }
  }

  const stationContent = useMemo(() => ({
    browser: <BrowserLab key={`browser-${labVersions.browser}`} initiallyComplete={explored.includes("browser")} onExplore={() => markExplored("browser")} />,
    machine: <MachineLab key={`machine-${labVersions.machine}`} initiallyComplete={explored.includes("machine")} onExplore={() => markExplored("machine")} />,
    break: <BreakWebLab key={`break-${labVersions.break}`} initiallyComplete={explored.includes("break")} onExplore={() => markExplored("break")} />,
    files: <FileLab key={`files-${labVersions.files}`} initiallyComplete={explored.includes("files")} onExplore={() => markExplored("files")} />,
  }), [explored, labVersions, session]);

  return (
    <main className="hub-lab-theme">
      <header className="hub-lab-hero border-b border-[#29332d] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="hub-kicker">
            Module 1 · Computers, Programs, and the Web
          </p>
          <div className="mt-4">
            <div>
              <div className="hub-mission-badge"><span className="hub-mission-orbit" />Mission 01 · Demystify the web</div>
              <h1 className="mt-5 max-w-4xl font-syne text-4xl font-black leading-[1.05] text-white sm:text-6xl">
                The web is not magic.
                <span className="block hub-gradient-text">It is a system you can touch.</span>
              </h1>
              <p className="mt-4 max-w-[70ch] text-base leading-8 text-text-secondary">
                Welcome, {learnerName}. Pull the web apart, follow its signals, and put it back together. Nothing here is a test.
              </p>
            </div>
          </div>

          <WebHistory />

          <div className="mt-10">
            <p className="hub-kicker">Choose your laboratory</p>
            <p className="mt-2 text-sm text-[#8b968f]">Start anywhere. Every station reveals one invisible layer.</p>
          </div>

          <nav className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Module 1 laboratories">
            {stations.map((station) => (
              <button
                key={station.id}
                type="button"
                onClick={() => setActive(station.id)}
                aria-current={active === station.id ? "step" : undefined}
                className={[
                  "hub-station",
                  active === station.id ? "is-active" : "",
                  explored.includes(station.id) ? "is-explored" : "",
                ].join(" ")}
              >
                <span className="hub-station-icon"><StationGlyph id={station.id} /></span>
                <span className="hub-station-number">{explored.includes(station.id) ? "✓ DONE" : station.number}</span>
                <strong>{station.label}</strong>
                <small>{explored.includes(station.id) ? "Lab complete" : active === station.id ? "In progress" : "Ready to explore"}</small>
                <span className="hub-station-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="hub-lab-stage mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: .2 }}
          >
            {active === "browser" && (
              <LabShell label="Laboratory 01" title="You Are the Browser" description="Follow a URL from the address bar to a server and watch separate resources become one webpage." complete={explored.includes("browser")} onReset={() => markIncomplete("browser")}>
                {stationContent.browser}
              </LabShell>
            )}
            {active === "machine" && (
              <LabShell label="Laboratory 02" title="The Input–Process–Output Machine" description="Trace “Bus fare” for ₦1,500 from the form, through validation and total calculation, to the visible receipt and saved expense history." complete={explored.includes("machine")} onReset={() => markIncomplete("machine")}>
                {stationContent.machine}
              </LabShell>
            )}
            {active === "break" && (
              <LabShell label="Laboratory 03" title="Break the Web" description="Switch the web’s layers on and off. Nothing can be damaged; every change reveals what that layer contributes." complete={explored.includes("break")} onReset={() => markIncomplete("break")}>
                {stationContent.break}
              </LabShell>
            )}
            {active === "files" && (
              <LabShell label="Laboratory 04" title="File Explorer Mystery" description="Move the project’s resources into folders and watch their addresses change." complete={explored.includes("files")} onReset={() => markIncomplete("files")}>
                {stationContent.files}
              </LabShell>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => setActive(stations[activeIndex - 1].id)}
            className="min-h-11 cursor-pointer text-sm text-text-secondary hover:text-text-primary disabled:cursor-default disabled:opacity-30"
          >
            ← Previous laboratory
          </button>
          {activeIndex < stations.length - 1 ? (
            <button
              type="button"
              onClick={() => setActive(stations[activeIndex + 1].id)}
              className="min-h-11 cursor-pointer bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90"
            >
              Explore the next laboratory →
            </button>
          ) : (
            <div className="max-w-md sm:text-right">
              <p className="text-sm leading-6 text-text-secondary">
                You have seen the web as a complete system. You do not need to memorise it yet—the next module will let you build its HTML structure.
              </p>
              <Link
                href="/resources/react/module-2"
                className="mt-4 inline-flex min-h-11 items-center bg-neon px-5 font-mono text-xs font-bold text-bg-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
              >
                Continue to HTML →
              </Link>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {latestSignal && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="hub-signal-toast"
          >
            <span><StationGlyph id={active} /></span>
            <div><small>Signal discovered</small><strong>{latestSignal}</strong></div>
            <button type="button" onClick={() => setLatestSignal(null)} aria-label="Dismiss signal notification">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

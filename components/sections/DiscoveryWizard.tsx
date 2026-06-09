"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type Answers = {
  business: string;
  problem: string;
  users: string;
  goal_month: string;
  goal_year: string;
  goal_three_years: string;
  current_solution: string;
  must_have: string[];
  nice_to_have: string[];
  examples: string;
  needs_payment: string;
  needs_admin: string;
  has_branding: string;
  timeline: string;
  budget_range: string;
  success: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  referral: string;
};

const INITIAL: Answers = {
  business: "", problem: "", users: "", goal_month: "", goal_year: "", goal_three_years: "", current_solution: "",
  must_have: [], nice_to_have: [], examples: "",
  needs_payment: "", needs_admin: "", has_branding: "",
  timeline: "", budget_range: "", success: "",
  name: "", email: "", company: "", project_type: "", referral: "",
};

type QuestionType = "textarea" | "multichip" | "yesno" | "threeway" | "pillselect" | "timegoals";

interface Question {
  step: number;
  phase: string;
  prompt: string;
  subtext?: string;
  type: QuestionType;
  field: keyof Answers;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
}

// ─── Questions ───────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // DISCOVER
  {
    step: 0, phase: "DISCOVER",
    prompt: "What does your business do?",
    subtext: "A brief description helps me understand your world.",
    type: "textarea", field: "business",
    placeholder: "We help small businesses automate their invoicing...",
  },
  {
    step: 1, phase: "DISCOVER",
    prompt: "What problem are you trying to solve?",
    subtext: "The clearer the problem, the sharper the solution.",
    type: "textarea", field: "problem",
    placeholder: "Our customers lose 3 hours a week on manual data entry...",
  },
  {
    step: 2, phase: "DISCOVER",
    prompt: "Who are your users?",
    subtext: "Tell me about the people this is built for.",
    type: "textarea", field: "users",
    placeholder: "Small business owners, mostly non-technical, aged 30–55...",
  },
  {
    step: 3, phase: "DISCOVER",
    prompt: "What are your goals?",
    subtext: "Think in three horizons — where you want to be soon, in a year, and long term.",
    type: "timegoals", field: "goal_month",
  },
  {
    step: 4, phase: "DISCOVER",
    prompt: "How is this currently done today?",
    subtext: "'We use a spreadsheet' is a completely valid answer.",
    type: "textarea", field: "current_solution",
    placeholder: "Right now we use a mix of email and Google Sheets...",
    optional: true,
  },
  // REQUIREMENTS
  {
    step: 5, phase: "REQUIREMENTS",
    prompt: "What features are absolutely required?",
    subtext: "Must-haves — the product can't launch without these.",
    type: "multichip", field: "must_have",
    options: ["User auth", "Notifications", "Search", "Dashboard", "File uploads", "Real-time data", "Public API", "Reports & analytics", "Multi-language", "Offline mode"],
    placeholder: "Another must-have...",
  },
  {
    step: 6, phase: "REQUIREMENTS",
    prompt: "What features would be nice to have later?",
    subtext: "V2 territory — good to plan for, not required at launch.",
    type: "multichip", field: "nice_to_have",
    options: ["User auth", "Notifications", "Search", "Dashboard", "File uploads", "Real-time data", "Public API", "Reports & analytics", "Multi-language", "Offline mode"],
    placeholder: "Another future feature...",
    optional: true,
  },
  {
    step: 7, phase: "REQUIREMENTS",
    prompt: "Do you have examples of similar products?",
    subtext: "Links, app names, or screenshots — reference points help a lot.",
    type: "textarea", field: "examples",
    placeholder: "Something like Notion but for X, or the way Stripe's dashboard...",
    optional: true,
  },
  {
    step: 8, phase: "REQUIREMENTS",
    prompt: "Do you need payment processing?",
    type: "yesno", field: "needs_payment",
  },
  {
    step: 9, phase: "REQUIREMENTS",
    prompt: "Do you need an admin dashboard?",
    subtext: "A backend panel for managing users, content, or data.",
    type: "yesno", field: "needs_admin",
  },
  {
    step: 10, phase: "REQUIREMENTS",
    prompt: "Do you already have branding or content?",
    subtext: "Logo, copy, assets — whatever's ready.",
    type: "threeway", field: "has_branding",
    options: ["Yes, all set", "Partially ready", "Starting fresh"],
  },
  // SCOPE
  {
    step: 11, phase: "SCOPE",
    prompt: "What is your desired timeline?",
    type: "pillselect", field: "timeline",
    options: ["ASAP", "1–3 months", "3–6 months", "Flexible"],
  },
  {
    step: 12, phase: "SCOPE",
    prompt: "What is your estimated budget?",
    subtext: "No judgment — this just helps me scope the work honestly.",
    type: "pillselect", field: "budget_range",
    options: ["Under $500", "$500 – $2K", "$2K – $5K", "$5K+", "Let's discuss"],
  },
  {
    step: 13, phase: "SCOPE",
    prompt: "What would make this project a success?",
    subtext: "Your definition of a win — whatever that looks like.",
    type: "textarea", field: "success",
    placeholder: "If users actually use it daily and it saves them time, that's a win...",
  },
];

const TOTAL = QUESTIONS.length; // 14, then step 14 = identity, step 15 = summary

const PHASES = [
  { id: "DISCOVER",      label: "Discover",      range: [0, 4],   color: "text-accent border-accent/40" },
  { id: "REQUIREMENTS",  label: "Requirements",  range: [5, 10],  color: "text-blue-400 border-blue-400/40" },
  { id: "SCOPE",         label: "Scope",         range: [11, 13], color: "text-amber-400 border-amber-400/40" },
  { id: "IDENTITY",      label: "About You",     range: [14, 14], color: "text-purple-400 border-purple-400/40" },
];

function getPhase(step: number) {
  return PHASES.find(p => step >= p.range[0] && step <= p.range[1]) ?? PHASES[3];
}

const FEEDBACKS = ["Nice.", "Got it.", "Good to know.", "Noted.", "Perfect.", "Love that.", "Helpful."];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass = cn(
  "w-full bg-bg-tertiary border border-border text-text-primary text-sm px-4 py-3",
  "focus:outline-none focus:border-accent transition-colors placeholder:text-text-tertiary"
);
const labelClass = "block font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider";

// ─── Main component ───────────────────────────────────────────────────────────

export default function DiscoveryWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [visible, setVisible] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [chipInput, setChipInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const isSummary = step === TOTAL + 1;
  const isIdentity = step === TOTAL;
  const currentQ = QUESTIONS[step];
  const phase = getPhase(isIdentity ? TOTAL : step);
  const displayStep = Math.min(step, TOTAL);
  const xp = Math.round((displayStep / (TOTAL + 1)) * 100);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function showMicro() {
    const msg = FEEDBACKS[Math.floor(Math.random() * FEEDBACKS.length)];
    setFeedback(msg);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1400);
  }

  function transition(fn: () => void) {
    setVisible(false);
    setTimeout(() => { fn(); setChipInput(""); setVisible(true); }, 190);
  }

  function advance() { showMicro(); transition(() => setStep(s => s + 1)); }
  function retreat() { transition(() => setStep(s => s - 1)); }

  function setField(field: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }));
  }

  function toggleChip(field: keyof Answers, value: string) {
    setAnswers(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  }

  function addCustomChip(field: keyof Answers) {
    const val = chipInput.trim();
    if (!val) return;
    setAnswers(prev => {
      const arr = prev[field] as string[];
      return arr.includes(val) ? prev : { ...prev, [field]: [...arr, val] };
    });
    setChipInput("");
  }

  function canAdvance(): boolean {
    if (!currentQ) return true;
    if (currentQ.optional) return true;
    const val = answers[currentQ.field];
    if (currentQ.type === "textarea") return (val as string).trim().length > 0;
    if (currentQ.type === "multichip") return (val as string[]).length > 0;
    if (currentQ.type === "timegoals") return answers.goal_month.trim().length > 0 && answers.goal_year.trim().length > 0 && answers.goal_three_years.trim().length > 0;
    return (val as string).length > 0;
  }

  function identityValid() {
    return (
      answers.name.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email) &&
      answers.project_type.length > 0
    );
  }

  async function handleSubmit() {
    setSubmitStatus("loading");
    const description = [
      answers.business    && `BUSINESS: ${answers.business}`,
      answers.problem     && `PROBLEM: ${answers.problem}`,
      answers.users       && `USERS: ${answers.users}`,
      answers.goal_month      && `GOAL (this month): ${answers.goal_month}`,
      answers.goal_year       && `GOAL (this year): ${answers.goal_year}`,
      answers.goal_three_years && `GOAL (next 3 years): ${answers.goal_three_years}`,
      answers.current_solution && `CURRENT SOLUTION: ${answers.current_solution}`,
      answers.must_have.length  && `MUST-HAVE: ${answers.must_have.join(", ")}`,
      answers.nice_to_have.length && `NICE-TO-HAVE: ${answers.nice_to_have.join(", ")}`,
      answers.examples    && `EXAMPLES: ${answers.examples}`,
      answers.needs_payment && `PAYMENT: ${answers.needs_payment}`,
      answers.needs_admin   && `ADMIN: ${answers.needs_admin}`,
      answers.has_branding  && `BRANDING: ${answers.has_branding}`,
      answers.success       && `SUCCESS: ${answers.success}`,
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers.name,
          email: answers.email,
          company: answers.company,
          project_type: answers.project_type,
          budget_range: answers.budget_range,
          timeline: answers.timeline,
          description,
          referral: answers.referral,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────────

  if (submitStatus === "success") {
    return (
      <div className="border border-accent/30 bg-accent/5 p-12 text-center">
        <CheckIcon className="w-8 h-8 text-accent mx-auto mb-4" />
        <h3 className="font-syne font-bold text-2xl text-text-primary mb-2">All done.</h3>
        <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
          Your brief is in. I&apos;ll review it and get back to you within 48 hours.
        </p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header: phase badge + step counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className={cn("font-mono text-xs px-2.5 py-1 border", isSummary ? "text-accent border-accent/40" : phase.color)}>
            {isSummary ? "REVIEW" : phase.id}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {isSummary ? `${TOTAL + 1} / ${TOTAL + 1}` : `${step + 1} / ${TOTAL + 1}`}
          </span>
        </div>

        {/* XP bar */}
        <div className="h-0.5 bg-bg-tertiary overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${isSummary ? 100 : xp}%` }}
          />
        </div>

        {/* Phase segments */}
        <div className="flex items-center gap-1 mt-2">
          {PHASES.map(p => {
            const done = step > p.range[1];
            const active = !isSummary && step >= p.range[0] && step <= p.range[1];
            return (
              <div
                key={p.id}
                title={p.label}
                className={cn(
                  "h-px flex-1 transition-colors duration-300",
                  done ? "bg-accent" : active ? "bg-accent/40" : "bg-border"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Micro-feedback */}
      <div
        aria-live="polite"
        className={cn(
          "font-mono text-xs text-accent mb-4 h-4 transition-all duration-300",
          showFeedback ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        )}
      >
        {feedback}
      </div>

      {/* Card */}
      <div className={cn(
        "transition-all duration-200",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
      )}>
        {isSummary ? (
          <SummaryStep
            answers={answers}
            onBack={retreat}
            onSubmit={handleSubmit}
            status={submitStatus}
            error={submitError}
          />
        ) : isIdentity ? (
          <IdentityStep
            answers={answers}
            onChange={setField}
            onBack={retreat}
            onNext={advance}
            valid={identityValid()}
          />
        ) : (
          <QuestionStep
            question={currentQ}
            answers={answers}
            chipInput={chipInput}
            onChipInput={setChipInput}
            onField={setField}
            onToggleChip={toggleChip}
            onAddChip={addCustomChip}
            onBack={step > 0 ? retreat : undefined}
            onNext={advance}
            canNext={canAdvance()}
          />
        )}
      </div>
    </div>
  );
}

// ─── QuestionStep ─────────────────────────────────────────────────────────────

function QuestionStep({
  question, answers, chipInput, onChipInput, onField, onToggleChip, onAddChip, onBack, onNext, canNext,
}: {
  question: Question;
  answers: Answers;
  chipInput: string;
  onChipInput: (v: string) => void;
  onField: (f: keyof Answers, v: string) => void;
  onToggleChip: (f: keyof Answers, v: string) => void;
  onAddChip: (f: keyof Answers) => void;
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  const { prompt, subtext, type, field, options, placeholder, optional } = question;

  return (
    <div>
      {/* Question */}
      <div className="mb-6">
        <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary leading-snug mb-2">
          {prompt}
          {optional && (
            <span className="font-mono text-xs text-text-tertiary ml-2 font-normal">optional</span>
          )}
        </h2>
        {subtext && (
          <p className="text-text-secondary text-sm leading-relaxed">{subtext}</p>
        )}
      </div>

      {/* Input area */}
      <div className="mb-8">
        {type === "textarea" && (
          <div>
            <label htmlFor={`q-${field}`} className="sr-only">{prompt}</label>
            <textarea
              id={`q-${field}`}
              rows={4}
              value={answers[field] as string}
              onChange={e => onField(field, e.target.value)}
              placeholder={placeholder}
              className={cn(inputClass, "resize-y min-h-[100px]")}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canNext) onNext();
              }}
            />
            <p className="font-mono text-xs text-text-tertiary mt-1.5">⌘↵ to continue</p>
          </div>
        )}

        {(type === "multichip") && options && (
          <MultiChip
            field={field}
            options={options}
            selected={answers[field] as string[]}
            chipInput={chipInput}
            onInput={onChipInput}
            onToggle={onToggleChip}
            onAdd={onAddChip}
            placeholder={placeholder}
          />
        )}

        {type === "yesno" && (
          <div className="flex gap-3">
            {["Yes", "No"].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => onField(field, opt)}
                className={cn(
                  "flex-1 py-4 border font-syne font-semibold text-sm transition-all duration-200 cursor-pointer",
                  answers[field] === opt
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {type === "threeway" && options && (
          <div className="flex flex-col gap-2">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => onField(field, opt)}
                className={cn(
                  "w-full py-3.5 px-5 border text-left font-syne text-sm transition-all duration-200 cursor-pointer",
                  answers[field] === opt
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {type === "timegoals" && (
          <div className="space-y-4">
            {([
              { key: "goal_month",        horizon: "This month",    placeholder: "Ship the MVP landing page..." },
              { key: "goal_year",         horizon: "This year",     placeholder: "Hit 100 paying customers..." },
              { key: "goal_three_years",  horizon: "Next 3 years",  placeholder: "Become the go-to tool for X in our market..." },
            ] as const).map(({ key, horizon, placeholder: ph }) => (
              <div key={key}>
                <label htmlFor={`tg-${key}`} className={labelClass}>{horizon}</label>
                <input
                  id={`tg-${key}`}
                  type="text"
                  value={answers[key]}
                  onChange={e => onField(key, e.target.value)}
                  placeholder={ph}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        )}

        {type === "pillselect" && options && (
          <div className="flex flex-wrap gap-2">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => onField(field, opt)}
                className={cn(
                  "px-5 py-2.5 border font-mono text-xs transition-all duration-200 cursor-pointer",
                  answers[field] === opt
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <NavRow
        onBack={onBack}
        onNext={onNext}
        canNext={canNext}
        nextLabel={optional && !canNext ? "Skip →" : "Continue →"}
      />
    </div>
  );
}

// ─── MultiChip ────────────────────────────────────────────────────────────────

function MultiChip({
  field, options, selected, chipInput, onInput, onToggle, onAdd, placeholder,
}: {
  field: keyof Answers;
  options: string[];
  selected: string[];
  chipInput: string;
  onInput: (v: string) => void;
  onToggle: (f: keyof Answers, v: string) => void;
  onAdd: (f: keyof Answers) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(field, opt)}
              className={cn(
                "px-4 py-2 border text-xs font-mono transition-all duration-200 cursor-pointer",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
              )}
            >
              {active && <span className="mr-1.5">✓</span>}
              {opt}
            </button>
          );
        })}
        {/* Custom chips added by user */}
        {selected.filter(s => !options.includes(s)).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onToggle(field, s)}
            className="px-4 py-2 border border-accent/60 bg-accent/10 text-accent text-xs font-mono cursor-pointer transition-all duration-200 hover:border-accent"
          >
            <span className="mr-1.5">✓</span>{s}
          </button>
        ))}
      </div>

      {/* Custom chip input */}
      <div className="flex gap-2">
        <label htmlFor={`chip-input-${field}`} className="sr-only">Add custom option</label>
        <input
          id={`chip-input-${field}`}
          type="text"
          value={chipInput}
          onChange={e => onInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAdd(field); } }}
          placeholder={placeholder ?? "Add your own..."}
          className={cn(inputClass, "text-xs py-2")}
        />
        <button
          type="button"
          onClick={() => onAdd(field)}
          disabled={!chipInput.trim()}
          className="px-4 py-2 border border-border text-text-secondary font-mono text-xs hover:border-accent hover:text-accent transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <p className="font-mono text-xs text-text-tertiary mt-2">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}

// ─── IdentityStep ─────────────────────────────────────────────────────────────

function IdentityStep({
  answers, onChange, onBack, onNext, valid,
}: {
  answers: Answers;
  onChange: (f: keyof Answers, v: string) => void;
  onBack: () => void;
  onNext: () => void;
  valid: boolean;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary leading-snug mb-2">
          Almost there. Who should I reach back to?
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Your info stays private and is used only to follow up.
        </p>
      </div>

      <div className="space-y-5 mb-8">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id-name" className={labelClass}>Name *</label>
            <input
              id="id-name"
              type="text"
              required
              value={answers.name}
              onChange={e => onChange("name", e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="id-email" className={labelClass}>Email *</label>
            <input
              id="id-email"
              type="email"
              required
              value={answers.email}
              onChange={e => onChange("email", e.target.value)}
              placeholder="you@company.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label htmlFor="id-company" className={labelClass}>
            Company <span className="text-text-tertiary normal-case font-normal">(optional)</span>
          </label>
          <input
            id="id-company"
            type="text"
            value={answers.company}
            onChange={e => onChange("company", e.target.value)}
            placeholder="Your company or startup"
            className={inputClass}
          />
        </div>

        {/* Project type */}
        <div>
          <label htmlFor="id-project-type" className={labelClass}>Project Type *</label>
          <select
            id="id-project-type"
            required
            value={answers.project_type}
            onChange={e => onChange("project_type", e.target.value)}
            className={cn(inputClass, "cursor-pointer")}
          >
            <option value="" disabled>Select a project type</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Web App">Web App</option>
            <option value="Product Consulting">Product Consulting</option>
            <option value="Business Tech">Business Tech</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Referral */}
        <div>
          <label htmlFor="id-referral" className={labelClass}>
            How did you find me?{" "}
            <span className="text-text-tertiary normal-case font-normal">(optional)</span>
          </label>
          <input
            id="id-referral"
            type="text"
            value={answers.referral}
            onChange={e => onChange("referral", e.target.value)}
            placeholder="Twitter, LinkedIn, a friend..."
            className={inputClass}
          />
        </div>
      </div>

      <NavRow onBack={onBack} onNext={onNext} canNext={valid} nextLabel="Review answers →" />
    </div>
  );
}

// ─── SummaryStep ──────────────────────────────────────────────────────────────

const SUMMARY_GROUPS = [
  {
    label: "Discovery",
    rows: [
      { key: "business",         label: "Business" },
      { key: "problem",          label: "Problem" },
      { key: "users",            label: "Users" },
      { key: "goal_month",        label: "Goal — this month" },
      { key: "goal_year",         label: "Goal — this year" },
      { key: "goal_three_years",  label: "Goal — next 3 years" },
      { key: "current_solution", label: "Current solution" },
    ],
  },
  {
    label: "Requirements",
    rows: [
      { key: "must_have",    label: "Must-have features" },
      { key: "nice_to_have", label: "Nice-to-have" },
      { key: "examples",     label: "Examples" },
      { key: "needs_payment", label: "Payment processing" },
      { key: "needs_admin",   label: "Admin dashboard" },
      { key: "has_branding",  label: "Branding/content" },
    ],
  },
  {
    label: "Scope",
    rows: [
      { key: "timeline",     label: "Timeline" },
      { key: "budget_range", label: "Budget" },
      { key: "success",      label: "Success criteria" },
    ],
  },
  {
    label: "About You",
    rows: [
      { key: "name",         label: "Name" },
      { key: "email",        label: "Email" },
      { key: "company",      label: "Company" },
      { key: "project_type", label: "Project type" },
    ],
  },
] as const;

function SummaryStep({
  answers, onBack, onSubmit, status, error,
}: {
  answers: Answers;
  onBack: () => void;
  onSubmit: () => void;
  status: "idle" | "loading" | "success" | "error";
  error: string;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary mb-2">
          Here&apos;s your brief.
        </h2>
        <p className="text-text-secondary text-sm">
          Review everything before I send it. You can go back to edit any step.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {SUMMARY_GROUPS.map(group => (
          <div key={group.label} className="border border-border bg-bg-secondary">
            <div className="px-5 py-3 border-b border-border">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">
                {group.label}
              </span>
            </div>
            <div className="divide-y divide-border">
              {group.rows.map(row => {
                const val = answers[row.key as keyof Answers];
                const display = Array.isArray(val) ? val.join(", ") : val;
                if (!display) return null;
                return (
                  <div key={row.key} className="px-5 py-3 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-mono text-xs text-text-tertiary pt-0.5">{row.label}</span>
                    <span className="text-text-primary text-sm leading-relaxed">{display}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400 border border-red-400/30 bg-red-400/5 px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-border text-text-secondary font-mono text-xs hover:border-accent/50 hover:text-text-primary transition-colors cursor-pointer"
        >
          ← Edit answers
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={status === "loading"}
          className="flex-1 bg-accent text-bg-primary font-syne font-semibold py-3 hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          {status === "loading" ? "Sending..." : "Send brief →"}
        </button>
      </div>
    </div>
  );
}

// ─── NavRow ───────────────────────────────────────────────────────────────────

function NavRow({
  onBack, onNext, canNext, nextLabel = "Continue →",
}: {
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 border border-border text-text-secondary font-mono text-xs hover:border-accent/50 hover:text-text-primary transition-colors cursor-pointer"
        >
          ←
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "flex-1 py-3 font-syne font-semibold text-sm transition-all duration-200 cursor-pointer",
          canNext
            ? "bg-accent text-bg-primary hover:bg-accent/90"
            : "bg-bg-tertiary text-text-tertiary border border-border cursor-not-allowed opacity-50"
        )}
      >
        {nextLabel}
      </button>
    </div>
  );
}

// ─── CheckIcon ────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

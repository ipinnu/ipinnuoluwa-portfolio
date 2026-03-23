"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  company: string;
  project_type: string;
  budget_range: string;
  timeline: string;
  description: string;
  referral: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  project_type: "",
  budget_range: "",
  timeline: "",
  description: "",
  referral: "",
};

export default function HireForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const inputClass = cn(
    "w-full bg-bg-tertiary border border-border text-text-primary text-sm px-4 py-3 rounded-sm",
    "focus:outline-none focus:border-accent transition-colors",
    "placeholder:text-text-tertiary"
  );

  const labelClass = "block font-mono text-xs text-text-secondary mb-2 uppercase tracking-wider";

  if (status === "success") {
    return (
      <div className="border border-accent/30 bg-accent/5 p-10 text-center">
        <div className="text-accent text-3xl mb-4">✓</div>
        <h3 className="font-syne font-bold text-xl text-text-primary mb-2">
          Got it.
        </h3>
        <p className="text-text-secondary">
          I&apos;ll reply within 48 hours. Keep an eye on {form.email || "your inbox"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelClass}>
          Company <span className="text-text-tertiary normal-case">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={form.company}
          onChange={handleChange}
          placeholder="Your company or startup"
          className={inputClass}
        />
      </div>

      {/* Project Type */}
      <div>
        <label htmlFor="project_type" className={labelClass}>
          Project Type *
        </label>
        <select
          id="project_type"
          name="project_type"
          required
          value={form.project_type}
          onChange={handleChange}
          className={cn(inputClass, "cursor-pointer")}
        >
          <option value="" disabled>
            Select a project type
          </option>
          <option value="Mobile App">Mobile App</option>
          <option value="Web App">Web App</option>
          <option value="Product Consulting">Product Consulting</option>
          <option value="Business Tech">Business Tech</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Budget + Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget_range" className={labelClass}>
            Budget Range *
          </label>
          <select
            id="budget_range"
            name="budget_range"
            required
            value={form.budget_range}
            onChange={handleChange}
            className={cn(inputClass, "cursor-pointer")}
          >
            <option value="" disabled>
              Select a range
            </option>
            <option value="Under $500">Under $500</option>
            <option value="$500–$2000">$500 – $2,000</option>
            <option value="$2000–$5000">$2,000 – $5,000</option>
            <option value="$5000+">$5,000+</option>
            <option value="Let's discuss">Let&apos;s discuss</option>
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className={labelClass}>
            Timeline *
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            value={form.timeline}
            onChange={handleChange}
            className={cn(inputClass, "cursor-pointer")}
          >
            <option value="" disabled>
              When do you need this?
            </option>
            <option value="ASAP">ASAP</option>
            <option value="1–3 months">1 – 3 months</option>
            <option value="3–6 months">3 – 6 months</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Tell me about the project *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="What are you building? What problem does it solve? What do you have so far?"
          className={cn(inputClass, "resize-y min-h-[120px]")}
        />
      </div>

      {/* Referral */}
      <div>
        <label htmlFor="referral" className={labelClass}>
          How did you find me?{" "}
          <span className="text-text-tertiary normal-case">(optional)</span>
        </label>
        <input
          id="referral"
          name="referral"
          type="text"
          value={form.referral}
          onChange={handleChange}
          placeholder="Twitter, LinkedIn, a friend..."
          className={inputClass}
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="font-mono text-xs text-red-400 border border-red-400/30 bg-red-400/5 px-4 py-3">
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-accent text-bg-primary font-syne font-semibold py-4 rounded-sm hover:bg-accent-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send message →"}
      </button>
    </form>
  );
}

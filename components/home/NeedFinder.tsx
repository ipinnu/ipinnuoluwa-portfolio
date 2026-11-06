"use client";

import { useState } from "react";
import { conversationUrl } from "@/lib/contact";
import styles from "./home.module.css";

const startingPoints = [
  {
    label: "I have an idea",
    title: "Let's work out what is worth building.",
    detail: "You don't need a finished brief. We can start with who you're helping, what is difficult for them today, and the simplest useful version of your idea.",
    outcome: "A clearer problem, a sensible first version, and a direction to explore.",
    prompt: "I have an idea, but I'm not sure what to build first. Here's what I'm thinking: ",
  },
  {
    label: "My business needs a website",
    title: "Give people a clear reason to choose you.",
    detail: "Let's look at what your visitors need to understand and do. That could mean a focused landing page, a business website, or a booking experience rather than a bigger system.",
    outcome: "A website shaped around your audience and the action you want them to take.",
    prompt: "I'd like a website for my business. Here's what we do and what visitors should be able to do: ",
  },
  {
    label: "We do too much manually",
    title: "Let's untangle the busywork.",
    detail: "If your team is juggling spreadsheets, messages, payments, or repeated follow-ups, we can map the workflow and find where a portal, dashboard, or custom tool would actually help.",
    outcome: "A clearer workflow and a practical way to reduce repetitive work.",
    prompt: "Our team is doing too much manually. The part we'd like to improve is: ",
  },
  {
    label: "I have a product already",
    title: "Make the next version a better one.",
    detail: "Maybe a feature needs shipping, the mobile experience feels awkward, or your team needs another engineer. We can look at what exists and decide what needs attention first.",
    outcome: "A focused next step for improving the product you already have.",
    prompt: "I have an existing product and would like some help. Here's where we are: ",
  },
];

export default function NeedFinder() {
  const [selected, setSelected] = useState(0);
  const current = startingPoints[selected];
  return (
    <div className={styles.finder}>
      <div className={styles.choices} role="group" aria-label="What sounds most like your situation?">
        {startingPoints.map((point, index) => (
          <button key={point.label} type="button" aria-pressed={selected === index}
            aria-controls="starting-point-detail" onClick={() => setSelected(index)}>
            <span className={styles.choiceNumber}>0{index + 1}</span>
            {point.label}<span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div id="starting-point-detail" className={styles.finderDetail} aria-live="polite" aria-atomic="true">
        <p className={styles.eyebrow}>A possible way forward</p>
        <h3>{current.title}</h3>
        <p>{current.detail}</p>
        <p className={styles.finderOutcome}>{current.outcome}</p>
        <a className={styles.button} href={conversationUrl(`Hi Ipinnuoluwa! ${current.prompt}`)} target="_blank" rel="noopener noreferrer">
          Let's talk this through <span aria-hidden="true">↗</span>
        </a>
        <small>A starting point, not a package. We'll figure out the right fit together.</small>
      </div>
    </div>
  );
}

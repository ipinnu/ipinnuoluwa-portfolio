"use client";

import { Fragment } from "react";
import {
  GLOSSARY_MAP,
  GLOSSARY_TERMS_SORTED,
} from "@/lib/react-hub/glossary";
import { useGlossary } from "./GlossaryContext";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build one regex from all known terms (sorted longest-first to avoid partial matches)
const TERM_PATTERN = new RegExp(
  `(${GLOSSARY_TERMS_SORTED.map(escapeRegex).join("|")})`,
  "gi"
);

interface Segment {
  type: "text" | "term";
  content: string;
}

function parseSegments(text: string): Segment[] {
  const parts = text.split(TERM_PATTERN);
  const segments: Segment[] = [];

  for (const part of parts) {
    if (!part) continue;
    const isKnownTerm = GLOSSARY_MAP.has(part.toLowerCase());
    segments.push({ type: isKnownTerm ? "term" : "text", content: part });
  }

  return segments;
}

function TermSpan({ text }: { text: string }) {
  const { openTerm } = useGlossary();

  return (
    <button
      onClick={() => openTerm(text)}
      className="inline font-[inherit] text-[inherit] text-left cursor-pointer transition-all duration-150 hover:opacity-80"
      style={{
        color: "#A3C4B4",
        textDecoration: "underline",
        textDecorationStyle: "dashed",
        textDecorationColor: "rgba(163,196,180,0.5)",
        textUnderlineOffset: "3px",
        background: "none",
        border: "none",
        padding: 0,
      }}
      title={`Click to learn about "${text}"`}
    >
      {text}
    </button>
  );
}

export default function ConceptText({ text }: { text: string }) {
  const segments = parseSegments(text);

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "term" ? (
          <TermSpan key={i} text={seg.content} />
        ) : (
          <Fragment key={i}>{seg.content}</Fragment>
        )
      )}
    </>
  );
}

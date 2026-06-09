"use client";

import { Sandpack, SandpackTheme } from "@codesandbox/sandpack-react";
import { PracticeLevel } from "@/lib/react-hub/curriculum";

const reactHubTheme: SandpackTheme = {
  colors: {
    surface1: "#0A0A0A",
    surface2: "#111111",
    surface3: "#1A1A1A",
    clickable: "#888888",
    base: "#CCCCCC",
    disabled: "#444444",
    hover: "#E8FF47",
    accent: "#E8FF47",
    error: "#FF4444",
    errorSurface: "#1A0000",
  },
  font: {
    body: "DM Sans, sans-serif",
    mono: "JetBrains Mono, monospace",
    size: "14px",
    lineHeight: "1.6",
  },
  syntax: {
    plain: "#CCCCCC",
    comment: { color: "#555550", fontStyle: "italic" },
    keyword: "#E8FF47",
    tag: "#A3C4B4",
    punctuation: "#888880",
    definition: "#E8FF47",
    property: "#A3C4B4",
    static: "#FF9060",
    string: "#88CC88",
  },
};

interface SandpackExerciseProps {
  code: string;
  exerciseType: PracticeLevel;
}

export default function SandpackExercise({ code, exerciseType }: SandpackExerciseProps) {
  const isBuild = exerciseType === "build";

  return (
    <div className="overflow-hidden border border-border">
      {/* Header bar */}
      <div className="px-4 py-2 bg-bg-secondary border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] text-neon tracking-widest uppercase">
          {isBuild ? "Build It" : "Fix It"}
        </span>
        <span className="font-mono text-[10px] text-text-tertiary">
          {isBuild
            ? "write your code → preview updates live"
            : "find the bug and fix it → preview clears on success"}
        </span>
      </div>

      <Sandpack
        template="react"
        theme={reactHubTheme}
        files={{ "/App.js": code }}
        options={{
          editorHeight: 380,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: false,
          resizablePanels: true,
        }}
      />

      {/* Build It hint strip below the editor */}
      {isBuild && (
        <div
          className="px-4 py-2.5 border-t border-border flex items-center gap-2"
          style={{ backgroundColor: "rgba(232,255,71,0.03)" }}
        >
          <span className="font-mono text-[10px] text-neon">▸</span>
          <p className="font-mono text-[11px] text-text-tertiary leading-snug">
            The preview starts blank — that's expected. Replace the starter code
            with your component and the preview will update instantly.
          </p>
        </div>
      )}
    </div>
  );
}

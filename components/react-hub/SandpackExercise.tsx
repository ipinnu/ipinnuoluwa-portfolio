"use client";

import { Sandpack, SandpackTheme } from "@codesandbox/sandpack-react";
import type { WorkspaceFiles } from "@/lib/react-hub/course";

const theme: SandpackTheme = {
  colors: {
    surface1: "#0A0A0A",
    surface2: "#111111",
    surface3: "#1A1A1A",
    clickable: "#A3C4B4",
    base: "#F5F5F0",
    disabled: "#444440",
    hover: "#E8FF47",
    accent: "#E8FF47",
    error: "#FF6B6B",
    errorSurface: "#241010",
  },
  font: {
    body: "DM Sans, sans-serif",
    mono: "JetBrains Mono, monospace",
    size: "14px",
    lineHeight: "1.65",
  },
  syntax: {
    plain: "#F5F5F0",
    comment: { color: "#777770", fontStyle: "italic" },
    keyword: "#E8FF47",
    tag: "#A3C4B4",
    punctuation: "#A8A8A0",
    definition: "#F3B56A",
    property: "#A3C4B4",
    static: "#FF9060",
    string: "#9AD89A",
  },
};

export default function SandpackExercise({
  files,
  lessonId,
  code,
  exerciseType,
}: {
  files?: WorkspaceFiles;
  lessonId?: string;
  code?: string;
  exerciseType?: string;
}) {
  const resolvedFiles = files ?? { "/App.tsx": code ?? "export default function App() { return null }" };
  const resolvedLessonId = lessonId ?? `legacy-${exerciseType ?? "exercise"}`;

  return (
    <div className="overflow-hidden border border-border">
      <div className="flex flex-col gap-1 border-b border-border bg-bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
          Browser workspace
        </span>
        <span className="font-mono text-[10px] text-text-tertiary">
          React + TypeScript · preview updates live
        </span>
      </div>

      <Sandpack
        key={resolvedLessonId}
        template="react-ts"
        theme={theme}
        files={resolvedFiles}
        options={{
          activeFile: "/App.tsx",
          visibleFiles: ["/App.tsx", "/types.ts", "/styles.css"],
          editorHeight: 520,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          resizablePanels: true,
        }}
      />

      <p className="border-t border-border bg-neon/5 px-4 py-3 font-mono text-[11px] leading-relaxed text-text-tertiary">
        This lesson has its own safe checkpoint. Experiment here without damaging an earlier milestone.
      </p>
    </div>
  );
}

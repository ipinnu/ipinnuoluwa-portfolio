"use client";

import { motion } from "framer-motion";
import { TOTAL_LESSONS } from "@/lib/react-hub/curriculum";

interface ProgressBarProps {
  completed: number;
}

export default function ProgressBar({ completed }: ProgressBarProps) {
  const pct = Math.round((completed / TOTAL_LESSONS) * 100);
  const allDone = completed === TOTAL_LESSONS;

  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
          {allDone ? "✓ Path complete" : "Learning Path"}
        </span>
        <span
          className="font-mono text-[10px] font-medium"
          style={{
            color: allDone ? "#E8FF47" : "#888884",
            textShadow: allDone ? "0 0 8px #E8FF4780" : "none",
          }}
        >
          {completed}/{TOTAL_LESSONS}
        </span>
      </div>

      {/* Track */}
      <div className="h-1 w-full bg-border overflow-hidden">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            backgroundColor: "#E8FF47",
            boxShadow: pct > 0 ? "0 0 8px #E8FF4780" : "none",
          }}
        />
      </div>

      {pct > 0 && (
        <div className="mt-1.5 flex justify-end">
          <span
            className="font-mono text-[9px]"
            style={{ color: "rgba(232,255,71,0.5)" }}
          >
            {pct}%
          </span>
        </div>
      )}
    </div>
  );
}

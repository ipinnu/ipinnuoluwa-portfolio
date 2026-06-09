"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CURRICULUM } from "@/lib/react-hub/curriculum";
import { getProgress, HubProgress } from "@/lib/react-hub/progress";
import { getEarnedXP, TOTAL_XP } from "@/lib/react-hub/xp";
import ProgressBar from "./ProgressBar";

const HUB_NAV = [
  { label: "Learning Path", href: "/resources/react" },
  { label: "Resources", href: "/resources/react/resources" },
];

const FOUNDATION_NAV = [
  { label: "The Web Before React", href: "/resources/react/intro" },
];

const COMING_SOON = [
  "Concept Library",
  "Challenges",
  "Build Real Websites",
  "AI Mentor",
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [progress, setProgress] = useState<HubProgress>({
    completedLessons: [],
    lastVisited: null,
  });

  useEffect(() => {
    setProgress(getProgress());
    const handler = () => setProgress(getProgress());
    window.addEventListener("hub-progress-update", handler);
    return () => window.removeEventListener("hub-progress-update", handler);
  }, []);

  const isLessonActive = (slug: string) =>
    pathname === `/resources/react/${slug}`;

  const isNavActive = (href: string) =>
    href === "/resources/react"
      ? pathname === href || pathname === "/resources/react/"
      : pathname.startsWith(href);

  const earnedXP = getEarnedXP(progress.completedLessons);

  return (
    <aside className="flex flex-col h-full bg-bg-primary border-r border-border overflow-y-auto">
      {/* Hub nav */}
      <div className="p-4 border-b border-border">
        <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase mb-3">
          // React Hub
        </p>
        <nav className="space-y-0.5">
          {HUB_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "block px-3 py-2 font-mono text-xs transition-colors",
                isNavActive(item.href)
                  ? "text-neon"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
              ].join(" ")}
              style={isNavActive(item.href) ? { backgroundColor: "rgba(232,255,71,0.05)" } : {}}
            >
              {item.label}
            </Link>
          ))}
          {COMING_SOON.map((label) => (
            <span
              key={label}
              className="flex items-center justify-between px-3 py-2 font-mono text-xs cursor-not-allowed select-none"
              style={{ color: "rgba(68,68,64,0.5)" }}
            >
              {label}
              <span className="text-[9px] tracking-widest">SOON</span>
            </span>
          ))}
        </nav>
      </div>

      {/* Foundation — pre-lesson context */}
      <div className="p-4 border-b border-border">
        <p className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase mb-3">
          // Foundation
        </p>
        <nav className="space-y-0.5">
          {FOUNDATION_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "flex items-center gap-2 px-3 py-2 font-mono text-xs transition-colors",
                isNavActive(item.href)
                  ? "text-neon"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
              ].join(" ")}
              style={isNavActive(item.href) ? { backgroundColor: "rgba(232,255,71,0.05)" } : {}}
            >
              <span style={{ color: "#A3C4B4", fontSize: 9 }}>◈</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Progress */}
      <ProgressBar completed={progress.completedLessons.length} />

      {/* XP summary */}
      {earnedXP > 0 && (
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
            XP Earned
          </span>
          <span
            className="font-mono text-[10px] font-medium text-neon"
            style={{ textShadow: earnedXP > 0 ? "0 0 8px #E8FF4760" : "none" }}
          >
            {earnedXP.toLocaleString()} / {TOTAL_XP.toLocaleString()}
          </span>
        </div>
      )}

      {/* Lesson list */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {CURRICULUM.map((lesson) => {
          const done = progress.completedLessons.includes(lesson.id);
          const active = isLessonActive(lesson.slug);

          return (
            <Link
              key={lesson.id}
              href={`/resources/react/${lesson.slug}`}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-3 py-2.5 group transition-all duration-200 relative",
                active ? "text-neon" : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
              ].join(" ")}
              style={active ? { backgroundColor: "rgba(232,255,71,0.05)" } : {}}
            >
              {/* Active left bar */}
              {active && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1 bottom-1 w-0.5 bg-neon"
                  style={{ boxShadow: "0 0 6px #E8FF47" }}
                />
              )}

              {/* Lesson number / checkmark */}
              <span
                className={[
                  "flex-shrink-0 w-5 h-5 flex items-center justify-center font-mono text-[10px] border transition-all duration-200",
                  done
                    ? "border-neon/50 text-neon"
                    : active
                      ? "border-neon/30 text-neon"
                      : "border-border text-text-tertiary",
                ].join(" ")}
                style={done ? { backgroundColor: "rgba(232,255,71,0.1)", boxShadow: "0 0 6px #E8FF4730" } : {}}
              >
                {done ? "✓" : String(lesson.id).padStart(2, "0")}
              </span>

              <span className="text-xs leading-snug line-clamp-1 flex-1">
                {lesson.title}
              </span>

              {done && !active && (
                <span className="flex-shrink-0 w-1 h-1 rounded-full bg-neon/40" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileSidebarToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border w-full text-left bg-bg-secondary"
      aria-label={isOpen ? "Close menu" : "Open lesson menu"}
    >
      <span className="font-mono text-[10px] text-text-secondary tracking-widest uppercase">
        {isOpen ? "↑ Close" : "☰ Lessons"}
      </span>
      <span className="font-mono text-[10px] text-text-tertiary">
        React Hub
      </span>
    </button>
  );
}

export function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden overflow-hidden border-b border-border"
          style={{ maxHeight: "60vh" }}
        >
          <Sidebar onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

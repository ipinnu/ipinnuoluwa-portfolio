"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LAB_MODULES } from "@/lib/react-hub/module-map";
import { useLearnerAuth } from "./LearnerAuth";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { session, learnerName, openAuth, signOut } = useLearnerAuth();
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateExplored = () => {
      const next: Record<string, number> = {};
      LAB_MODULES.forEach((module) => {
        try {
          const saved = JSON.parse(
            localStorage.getItem(`react-hub-${module.id}-explored`) ?? "[]",
          ) as string[];
          next[module.id] = saved.length;
        } catch {
          next[module.id] = 0;
        }
      });
      setModuleProgress(next);
    };

    updateExplored();
    window.addEventListener("hub-module-progress-update", updateExplored);
    return () =>
      window.removeEventListener("hub-module-progress-update", updateExplored);
  }, [pathname]);

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-border bg-bg-primary">
      <div className="border-b border-border p-4">
        <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
          // React Hub · Web Laboratory
        </p>
        {session ? (
          <div className="mt-4 flex items-center justify-between gap-3 border border-border bg-bg-secondary p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{learnerName}</p>
              <p className="mt-0.5 truncate font-mono text-[9px] text-text-tertiary">{session.user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="min-h-11 cursor-pointer px-2 font-mono text-[9px] text-text-tertiary hover:text-text-primary"
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuth()}
            className="mt-4 min-h-11 w-full cursor-pointer border border-neon/40 px-3 font-mono text-[10px] text-neon hover:bg-neon/5"
          >
            Create account / Sign in
          </button>
        )}
      </div>

      <nav className="border-b border-border p-2">
        <Link
          href="/resources/react/intro"
          onClick={onClose}
          className={[
            "flex min-h-11 items-center px-3 text-xs transition-colors",
            pathname === "/resources/react/intro"
              ? "bg-neon/5 text-neon"
              : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
          ].join(" ")}
        >
          Start Here
        </Link>
        <Link
          href="/resources/react/resources"
          onClick={onClose}
          className="flex min-h-11 items-center px-3 text-xs text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
        >
          Resources
        </Link>
      </nav>

      <nav className="flex-1 p-2" aria-label="Course modules">
        {LAB_MODULES.map((module) => {
          const available = module.status === "available";
          const active = pathname === `/resources/react/${module.id}`;

          if (!available) {
            return (
              <div key={module.id} className="flex min-h-16 items-center gap-3 px-3 opacity-45">
                <span className="flex h-7 w-7 flex-none items-center justify-center border border-border font-mono text-[9px] text-text-tertiary">
                  {String(module.order).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-text-secondary">{module.title}</span>
                  <span className="mt-1 block font-mono text-[8px] uppercase tracking-widest text-text-tertiary">
                    {module.status === "next" ? "Built next" : "Planned"}
                  </span>
                </span>
              </div>
            );
          }

          return (
            <Link
              key={module.id}
              href={`/resources/react/${module.id}`}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={[
                "relative flex min-h-16 items-center gap-3 px-3 transition-colors",
                active ? "bg-neon/5 text-neon" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {active && <span className="absolute inset-y-1 left-0 w-0.5 bg-neon" />}
              <span className="flex h-7 w-7 flex-none items-center justify-center border border-neon/40 font-mono text-[9px] text-neon">
                {String(module.order).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">{module.title}</span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-widest text-accent">
                  {moduleProgress[module.id] ?? 0}/4 laboratories explored
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileSidebarToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-11 w-full cursor-pointer items-center justify-between border-b border-border bg-bg-secondary px-4 text-left md:hidden"
      aria-label={isOpen ? "Close course navigation" : "Open course navigation"}
      aria-expanded={isOpen}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
        {isOpen ? "Close" : "Course path"}
      </span>
      <span aria-hidden className="font-mono text-sm text-neon">{isOpen ? "×" : "☰"}</span>
    </button>
  );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "min(72vh, 720px)", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-border md:hidden"
        >
          <Sidebar onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

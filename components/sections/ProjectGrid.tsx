"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/projects";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

type Filter = "all" | "mobile" | "web" | "consulting";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mobile", label: "Mobile" },
  { value: "web", label: "Web" },
  { value: "consulting", label: "Consulting" },
];

export default function ProjectGrid() {
  const [active, setActive] = useState<Filter>("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={cn(
                "font-mono text-xs px-4 py-2 rounded-sm border transition-colors whitespace-nowrap",
                active === f.value
                  ? "bg-accent text-bg-primary border-accent"
                  : "border-border text-text-secondary hover:text-text-primary hover:border-text-tertiary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group block bg-bg-secondary hover:bg-bg-tertiary transition-colors p-8 h-full"
                >
                  {/* Status */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-text-tertiary border border-border px-2 py-0.5">
                      {project.status}
                    </span>
                    <span className="font-mono text-xs text-text-tertiary">
                      {project.timeline}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-syne font-bold text-2xl text-text-primary mb-3 group-hover:text-accent transition-colors">
                    {project.title}
                  </h2>

                  {/* Role */}
                  <p className="font-mono text-xs text-text-tertiary mb-4">
                    {project.role}
                  </p>

                  {/* Summary */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Outcome */}
                  <p className="font-mono text-xs text-accent/70 mb-6 leading-relaxed">
                    {project.outcome}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>

                  <span className="font-mono text-xs text-text-secondary group-hover:text-accent transition-colors">
                    View case study →
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

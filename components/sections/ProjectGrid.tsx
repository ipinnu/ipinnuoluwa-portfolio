"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      ? [...projects].sort((a, b) => a.order_index - b.order_index)
      : projects
          .filter((p) => p.category === active)
          .sort((a, b) => a.order_index - b.order_index);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                aria-pressed={active === f.value}
                className={cn(
                "min-h-11 cursor-pointer font-mono text-xs px-4 py-2 rounded-sm border transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
                  className="group block bg-bg-secondary hover:bg-bg-tertiary transition-colors h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  {/* Cover image */}
                  {project.image && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-bg-tertiary">
                      <Image
                        src={project.image}
                        alt={`${project.title} project preview`}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/60 to-transparent" />
                    </div>
                  )}
                  {!project.image && (
                    <div className="relative flex aspect-[16/9] w-full items-end overflow-hidden bg-[radial-gradient(circle_at_75%_20%,rgba(163,196,180,0.18),transparent_35%),linear-gradient(135deg,#1a1a1a,#0a0a0a)] p-6">
                      <div
                        className="absolute inset-0 opacity-30"
                        aria-hidden="true"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                          backgroundSize: "32px 32px",
                        }}
                      />
                      <span className="relative font-syne text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                        {project.title}
                      </span>
                    </div>
                  )}

                  <div className="p-8">
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
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

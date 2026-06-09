"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Course, LEVEL_LABELS, LEVEL_COLORS } from "@/lib/resources";

function CornerBrackets({ color }: { color: string }) {
  return (
    <>
      <span
        className="absolute top-0 left-0 w-3 h-3 border-t border-l"
        style={{ borderColor: color }}
      />
      <span
        className="absolute top-0 right-0 w-3 h-3 border-t border-r"
        style={{ borderColor: color }}
      />
      <span
        className="absolute bottom-0 left-0 w-3 h-3 border-b border-l"
        style={{ borderColor: color }}
      />
      <span
        className="absolute bottom-0 right-0 w-3 h-3 border-b border-r"
        style={{ borderColor: color }}
      />
    </>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

interface CourseCardProps {
  course: Course;
  index: number;
  progress?: number;
}

function CourseCard({ course, index, progress = 0 }: CourseCardProps) {
  const isAvailable = course.status === "available";
  const levelColor = LEVEL_COLORS[course.level];

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative group"
    >
      <div
        className={[
          "relative p-6 border transition-all duration-300 overflow-hidden",
          isAvailable
            ? "bg-bg-secondary border-border hover:border-neon/40 cursor-pointer"
            : "bg-bg-secondary/50 border-border/40 cursor-default",
        ].join(" ")}
      >
        <CornerBrackets color={isAvailable ? levelColor : "#333330"} />

        {/* Glow on hover (available only) */}
        {isAvailable && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${levelColor}08 0%, transparent 70%)` }}
          />
        )}

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="font-mono text-[10px] font-medium tracking-widest"
            style={{ color: isAvailable ? levelColor : "#444440" }}
          >
            {LEVEL_LABELS[course.level]}
          </span>
          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 w-24 bg-border overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: levelColor,
                    boxShadow: `0 0 6px ${levelColor}80`,
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-text-tertiary">
                {progress}%
              </span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-text-tertiary font-mono text-[10px] tracking-widest">
              <LockIcon /> SOON
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={[
            "font-syne font-bold text-xl mb-1 transition-colors duration-300",
            isAvailable
              ? "text-text-primary group-hover:text-neon"
              : "text-text-tertiary",
          ].join(" ")}
        >
          {course.title}
        </h3>
        <p
          className={[
            "font-mono text-xs mb-3",
            isAvailable ? "text-text-secondary" : "text-text-tertiary/60",
          ].join(" ")}
        >
          {course.subtitle}
        </p>

        {/* Description */}
        <p
          className={[
            "text-sm leading-relaxed mb-5",
            isAvailable ? "text-text-secondary" : "text-text-tertiary/50",
          ].join(" ")}
        >
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 border"
              style={
                isAvailable
                  ? { borderColor: `${levelColor}40`, color: levelColor }
                  : { borderColor: "#333330", color: "#444440" }
              }
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-text-tertiary">
              {course.totalModules} modules
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">
              {course.totalDuration}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: isAvailable ? levelColor : "#444440" }}
            >
              +{course.xp} XP
            </span>
          </div>
          {isAvailable && (
            <span className="font-mono text-xs text-neon group-hover:translate-x-0.5 transition-transform duration-200">
              {progress > 0 ? "Continue →" : "Start →"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isAvailable) {
    return (
      <Link href={`/resources/${course.slug}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <p className="font-mono text-[10px] text-neon tracking-widest uppercase mb-2">
              // courses
            </p>
            <h2 className="font-syne font-bold text-3xl text-text-primary">
              React Training
            </h2>
          </div>
          <span className="font-mono text-xs text-text-tertiary hidden md:block">
            {courses.filter((c) => c.status === "available").length} available ·{" "}
            {courses.filter((c) => c.status === "coming_soon").length} incoming
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "available" | "coming_soon";

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "exercise";
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  modules: CourseModule[];
  totalDuration: string;
  totalModules: number;
  status: CourseStatus;
  tags: string[];
  xp: number;
}

export const COURSES: Course[] = [
  {
    id: "react-fundamentals",
    slug: "react",
    title: "React Fundamentals",
    subtitle: "Master the building blocks",
    description:
      "From zero to confident. Components, props, state, effects — the mental model that makes everything else click.",
    level: "beginner",
    totalModules: 9,
    totalDuration: "4h 30m",
    status: "available",
    tags: ["React", "JSX", "Hooks", "State"],
    xp: 350,
    modules: [
      { id: "m1", title: "Why React?", duration: "18m", type: "video" },
      { id: "m2", title: "JSX & the Virtual DOM", duration: "22m", type: "video" },
      { id: "m3", title: "Components & Props", duration: "30m", type: "video" },
      { id: "m4", title: "State with useState", duration: "28m", type: "video" },
      { id: "m5", title: "Side Effects & useEffect", duration: "35m", type: "video" },
      { id: "m6", title: "Lists & Keys", duration: "20m", type: "video" },
      { id: "m7", title: "Forms & Controlled Inputs", duration: "25m", type: "video" },
      { id: "m8", title: "Component Composition", duration: "28m", type: "video" },
      { id: "m9", title: "Build: Mini Task App", duration: "44m", type: "exercise" },
    ],
  },
  {
    id: "component-patterns",
    slug: "component-patterns",
    title: "Component Patterns",
    subtitle: "Architecture that scales",
    description:
      "Compound components, render props, custom hooks — the patterns senior engineers actually use to keep codebases sane.",
    level: "intermediate",
    totalModules: 8,
    totalDuration: "5h 10m",
    status: "coming_soon",
    tags: ["Patterns", "Custom Hooks", "Context", "Composition"],
    xp: 450,
    modules: [],
  },
  {
    id: "state-management",
    slug: "state-management",
    title: "State Management",
    subtitle: "Zustand, Context & beyond",
    description:
      "When useState isn't enough. A practical tour of global state, server state, and how to choose the right tool.",
    level: "intermediate",
    totalModules: 7,
    totalDuration: "4h 50m",
    status: "coming_soon",
    tags: ["Zustand", "React Query", "Context", "TanStack"],
    xp: 400,
    modules: [],
  },
  {
    id: "performance",
    slug: "performance",
    title: "React Performance",
    subtitle: "Fast by design",
    description:
      "Memo, lazy loading, profiling, Suspense — what actually moves the needle and what's premature optimization.",
    level: "advanced",
    totalModules: 6,
    totalDuration: "3h 40m",
    status: "coming_soon",
    tags: ["Memo", "Suspense", "Profiling", "Lazy"],
    xp: 500,
    modules: [],
  },
];

export const LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: "LVL 01",
  intermediate: "LVL 02",
  advanced: "LVL 03",
};

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  beginner: "#A3C4B4",
  intermediate: "#E8FF47",
  advanced: "#FF6B4A",
};

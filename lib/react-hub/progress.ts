import { COURSE_VERSION } from "./course";

const STORAGE_KEY = `react-hub-progress-v${COURSE_VERSION}`;
const LEGACY_STORAGE_KEY = "react-hub-progress";
const MIGRATION_NOTICE_KEY = "react-hub-v2-migration-notice";

export interface HubProgress {
  version: number;
  completedLessons: string[];
  lastVisited: string | null;
  exerciseEvidence: Record<string, string[]>;
  startedAt: string | null;
}

function defaultProgress(): HubProgress {
  return {
    version: COURSE_VERSION,
    completedLessons: [],
    lastVisited: null,
    exerciseEvidence: {},
    startedAt: null,
  };
}

function isProgress(value: unknown): value is HubProgress {
  if (!value || typeof value !== "object") return false;
  const progress = value as Partial<HubProgress>;
  return (
    progress.version === COURSE_VERSION &&
    Array.isArray(progress.completedLessons) &&
    progress.completedLessons.every((id) => typeof id === "string")
  );
}

export function getProgress(): HubProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!isProgress(parsed)) return defaultProgress();
    return {
      ...defaultProgress(),
      ...parsed,
      exerciseEvidence: parsed.exerciseEvidence ?? {},
    };
  } catch {
    return defaultProgress();
  }
}

export function hasLegacyProgress(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(LEGACY_STORAGE_KEY));
}

export function shouldShowMigrationNotice(): boolean {
  if (typeof window === "undefined") return false;
  return hasLegacyProgress() && localStorage.getItem(MIGRATION_NOTICE_KEY) !== "seen";
}

export function dismissMigrationNotice(): void {
  try {
    localStorage.setItem(MIGRATION_NOTICE_KEY, "seen");
  } catch {}
}

export function startCourse(firstLessonId: string): HubProgress {
  const progress = getProgress();
  progress.lastVisited = progress.lastVisited ?? firstLessonId;
  progress.startedAt = progress.startedAt ?? new Date().toISOString();
  save(progress);
  return progress;
}

export function markComplete(lessonId: string | number): HubProgress {
  const normalizedId = String(lessonId);
  const progress = getProgress();
  if (!progress.completedLessons.includes(normalizedId)) {
    progress.completedLessons = [...progress.completedLessons, normalizedId];
  }
  progress.lastVisited = normalizedId;
  progress.startedAt = progress.startedAt ?? new Date().toISOString();
  save(progress);
  return progress;
}

export function markVisited(lessonId: string | number): HubProgress {
  const normalizedId = String(lessonId);
  const progress = getProgress();
  progress.lastVisited = normalizedId;
  progress.startedAt = progress.startedAt ?? new Date().toISOString();
  save(progress);
  return progress;
}

export function recordExerciseEvidence(lessonId: string, exerciseId: string): HubProgress {
  const progress = getProgress();
  const current = progress.exerciseEvidence[lessonId] ?? [];
  if (!current.includes(exerciseId)) {
    progress.exerciseEvidence = {
      ...progress.exerciseEvidence,
      [lessonId]: [...current, exerciseId],
    };
  }
  save(progress);
  return progress;
}

export function unmarkComplete(lessonId: string | number): HubProgress {
  const normalizedId = String(lessonId);
  const progress = getProgress();
  progress.completedLessons = progress.completedLessons.filter((id) => id !== normalizedId);
  save(progress);
  return progress;
}

export function isComplete(lessonId: string | number): boolean {
  return getProgress().completedLessons.includes(String(lessonId));
}

export function resetCourse(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function save(progress: HubProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

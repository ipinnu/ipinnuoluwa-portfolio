const STORAGE_KEY = "react-hub-progress";

export interface HubProgress {
  completedLessons: number[];
  lastVisited: number | null;
}

function defaultProgress(): HubProgress {
  return { completedLessons: [], lastVisited: null };
}

export function getProgress(): HubProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as HubProgress;
  } catch {
    return defaultProgress();
  }
}

export function markComplete(lessonId: number): HubProgress {
  const p = getProgress();
  if (!p.completedLessons.includes(lessonId)) {
    p.completedLessons = [...p.completedLessons, lessonId];
  }
  p.lastVisited = lessonId;
  save(p);
  return p;
}

export function markVisited(lessonId: number): HubProgress {
  const p = getProgress();
  p.lastVisited = lessonId;
  save(p);
  return p;
}

export function unmarkComplete(lessonId: number): HubProgress {
  const p = getProgress();
  p.completedLessons = p.completedLessons.filter((id) => id !== lessonId);
  save(p);
  return p;
}

export function isComplete(lessonId: number): boolean {
  return getProgress().completedLessons.includes(lessonId);
}

function save(p: HubProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

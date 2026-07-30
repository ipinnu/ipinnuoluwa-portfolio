const STORAGE_KEY = "react-hub-field-guide-progress-v1";

export interface FieldGuideProgress {
  completedLessons: string[];
  lastVisited: string | null;
}

function emptyProgress(): FieldGuideProgress {
  return { completedLessons: [], lastVisited: null };
}

function saveFieldGuideProgress(progress: FieldGuideProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

export function getFieldGuideProgress(): FieldGuideProgress {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();

    const parsed = JSON.parse(raw) as Partial<FieldGuideProgress>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons.filter(
            (slug): slug is string => typeof slug === "string",
          )
        : [],
      lastVisited:
        typeof parsed.lastVisited === "string" ? parsed.lastVisited : null,
    };
  } catch {
    return emptyProgress();
  }
}

export function visitFieldGuideLesson(slug: string): FieldGuideProgress {
  const progress = getFieldGuideProgress();
  progress.lastVisited = slug;
  saveFieldGuideProgress(progress);
  return progress;
}

export function setFieldGuideLessonComplete(
  slug: string,
  complete: boolean,
): FieldGuideProgress {
  const progress = getFieldGuideProgress();
  progress.completedLessons = complete
    ? Array.from(new Set([...progress.completedLessons, slug]))
    : progress.completedLessons.filter((lessonSlug) => lessonSlug !== slug);
  progress.lastVisited = slug;
  saveFieldGuideProgress(progress);
  return progress;
}

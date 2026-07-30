import { CURRICULUM, type Lesson } from "./curriculum";

export const FIELD_GUIDE_LESSONS = CURRICULUM.filter(
  (lesson) => lesson.id <= 11,
);

export const FIELD_GUIDE_TOTAL = FIELD_GUIDE_LESSONS.length;

export function getFieldGuideLesson(slug: string): Lesson | undefined {
  return FIELD_GUIDE_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getAdjacentFieldGuideLessons(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const index = FIELD_GUIDE_LESSONS.findIndex(
    (lesson) => lesson.slug === slug,
  );

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? FIELD_GUIDE_LESSONS[index - 1] : null,
    next:
      index < FIELD_GUIDE_LESSONS.length - 1
        ? FIELD_GUIDE_LESSONS[index + 1]
        : null,
  };
}

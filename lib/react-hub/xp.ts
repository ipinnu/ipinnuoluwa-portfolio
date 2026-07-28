import { CURRICULUM, TOTAL_XP } from "./course";

export { TOTAL_XP };

export const LESSON_XP: Record<string, number> = Object.fromEntries(
  CURRICULUM.map((lesson) => [lesson.id, lesson.xp]),
);

export const LESSON_CONGRATS: Record<string, string> = Object.fromEntries(
  CURRICULUM.map((lesson) => [lesson.id, lesson.milestone]),
);

export function getEarnedXP(completedLessons: string[]): number {
  return completedLessons.reduce((sum, id) => sum + (LESSON_XP[id] ?? 0), 0);
}

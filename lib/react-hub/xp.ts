export const LESSON_XP: Record<number, number> = {
  1: 50,
  2: 60,
  3: 70,
  4: 80,
  5: 100,
  6: 80,
  7: 90,
  8: 80,
  9: 90,
  10: 110,
  11: 120,
  12: 250,
};

export const LESSON_CONGRATS: Record<number, string> = {
  1: "First step taken. You now know what React is.",
  2: "JSX unlocked. You're writing React markup now.",
  3: "Components clicked. Build UIs like Lego blocks.",
  4: "Props mastered. Data flows where you send it.",
  5: "State added. Your UI can now remember things.",
  6: "Events wired. Your components respond to the world.",
  7: "Conditionals in. You control what shows and when.",
  8: "Lists rendered. Arrays are no longer a problem.",
  9: "Forms controlled. React owns the input, not the DOM.",
  10: "Effects understood. Side effects are no longer side issues.",
  11: "Data fetching solid. Real APIs, real apps.",
  12: "All 12 lessons done. You can build real things with React.",
};

export const TOTAL_XP = Object.values(LESSON_XP).reduce((a, b) => a + b, 0);

export function getEarnedXP(completedLessons: number[]): number {
  return completedLessons.reduce((sum, id) => sum + (LESSON_XP[id] ?? 0), 0);
}

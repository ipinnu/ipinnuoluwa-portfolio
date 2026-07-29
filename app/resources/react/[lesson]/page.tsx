import { redirect } from "next/navigation";

/**
 * Legacy React Hub lesson URLs used to render the retired sixteen-lesson
 * curriculum. Keep this route as a compatibility redirect so bookmarks,
 * previously issued email-confirmation links, and shared lesson URLs lead
 * learners into the current course instead of exposing two course systems.
 */
export default function LegacyLessonRedirect() {
  redirect("/resources/react/intro");
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FieldGuideLesson from "@/components/react-hub/FieldGuideLesson";
import {
  FIELD_GUIDE_LESSONS,
  getAdjacentFieldGuideLessons,
  getFieldGuideLesson,
} from "@/lib/react-hub/field-guide";

export function generateStaticParams() {
  return FIELD_GUIDE_LESSONS.map((lesson) => ({ lesson: lesson.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { lesson: string };
}): Metadata {
  const lesson = getFieldGuideLesson(params.lesson);
  if (!lesson) return {};

  return {
    title: `${lesson.title} · React Field Guide`,
    description: lesson.concept[0],
  };
}

export default function FieldGuideLessonPage({
  params,
}: {
  params: { lesson: string };
}) {
  const lesson = getFieldGuideLesson(params.lesson);
  if (!lesson) notFound();

  const { prev, next } = getAdjacentFieldGuideLessons(lesson.slug);

  return <FieldGuideLesson lesson={lesson} prev={prev} next={next} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLessonBySlug,
  getAdjacentLessons,
  CURRICULUM,
} from "@/lib/react-hub/curriculum";
import LessonLayout from "@/components/react-hub/LessonLayout";

interface Props {
  params: { lesson: string };
}

export function generateStaticParams() {
  return CURRICULUM.map((l) => ({ lesson: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lesson = getLessonBySlug(params.lesson);
  if (!lesson) return { title: "Lesson Not Found" };
  return {
    title: `${lesson.title} — React Hub`,
    description: lesson.concept[0],
  };
}

export default function LessonPage({ params }: Props) {
  const lesson = getLessonBySlug(params.lesson);
  if (!lesson) notFound();

  const { prev, next } = getAdjacentLessons(params.lesson);

  return <LessonLayout lesson={lesson} prev={prev} next={next} />;
}

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { COURSES } from "@/lib/resources";
import ResourcesHero from "@/components/resources/ResourcesHero";
import CourseGrid from "@/components/resources/CourseGrid";
import ArticlesSection from "@/components/resources/ArticlesSection";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Interactive React courses, articles, and everything you need to level up as a developer.",
};

export default function ResourcesPage() {
  const posts = getAllPosts();

  return (
    <main>
      <ResourcesHero postCount={posts.length} />
      <CourseGrid courses={COURSES} />
      <ArticlesSection posts={posts} />
    </main>
  );
}

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { COURSES } from "@/lib/resources";
import ResourcesHero from "@/components/resources/ResourcesHero";
import CourseGrid from "@/components/resources/CourseGrid";
import ArticlesSection from "@/components/resources/ArticlesSection";
import Link from "next/link";

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
      <section className="max-w-content mx-auto px-6 pt-10">
        <Link
          href="/resources/jobs"
          className="group block border border-border bg-bg-secondary p-6 md:p-8 hover:border-neon/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon mb-2">
            // private tool
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-syne font-bold text-2xl text-text-primary group-hover:text-neon">
                Opportunity desk
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Job feed, shortlist, application pipeline and drafting workspace.
              </p>
            </div>
            <span className="font-mono text-xs text-neon">Open tracker →</span>
          </div>
        </Link>
      </section>
      <CourseGrid courses={COURSES} />
      <ArticlesSection posts={posts} />
    </main>
  );
}

// Every post feeds Instagram carousels, Twitter threads, and LinkedIn summaries.
// Write once, distribute everywhere.

import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import Tag from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on Flutter, product development, and building software in Lagos.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <SectionLabel label="Writing" className="mb-6" />
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6">
              Blog
            </h1>
            <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
              Thoughts on Flutter, product, and what it takes to ship software
              from Lagos.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-content mx-auto px-6">
          {posts.length === 0 ? (
            <FadeUp>
              <div className="border border-border p-12 text-center">
                <p className="font-mono text-xs text-text-tertiary mb-3">
                  Coming soon
                </p>
                <p className="text-text-secondary">
                  Posts are being drafted. Check back soon.
                </p>
              </div>
            </FadeUp>
          ) : (
            <div className="space-y-px">
              {posts.map((post, i) => (
                <FadeUp key={post.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block bg-bg-secondary hover:bg-bg-tertiary transition-colors border-b border-border p-8 md:p-10"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.frontmatter.tags.map((tag) => (
                            <Tag key={tag} label={tag} />
                          ))}
                        </div>
                        <h2 className="font-syne font-bold text-2xl text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {post.frontmatter.title}
                        </h2>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                          {post.frontmatter.summary}
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 flex-shrink-0">
                        <p className="font-mono text-xs text-text-tertiary">
                          {formatDate(post.frontmatter.date)}
                        </p>
                        <p className="font-mono text-xs text-text-tertiary">
                          {post.readTime} min read
                        </p>
                        <span className="font-mono text-xs text-text-secondary group-hover:text-accent transition-colors md:mt-4">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

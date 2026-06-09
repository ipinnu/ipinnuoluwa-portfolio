"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Post } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  post: Post;
  index: number;
}

function ArticleCard({ post, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-start gap-4 p-5 border-b border-border hover:bg-bg-secondary transition-colors duration-200"
      >
        <span className="font-mono text-[10px] text-text-tertiary pt-0.5 w-8 flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-syne font-semibold text-base text-text-primary group-hover:text-neon transition-colors duration-200 mb-1 leading-snug">
            {post.frontmatter.title}
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
            {post.frontmatter.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="font-mono text-[10px] text-text-tertiary">
            {formatDate(post.frontmatter.date)}
          </span>
          <span className="font-mono text-[10px] text-text-tertiary">
            {post.readTime}m read
          </span>
          <span className="font-mono text-[10px] text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Read →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

interface ArticlesSectionProps {
  posts: Post[];
}

export default function ArticlesSection({ posts }: ArticlesSectionProps) {
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <p className="font-mono text-[10px] text-accent tracking-widest uppercase mb-2">
              // articles
            </p>
            <h2 className="font-syne font-bold text-3xl text-text-primary">
              Field Notes
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-mono text-xs text-text-secondary hover:text-neon transition-colors duration-200"
          >
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <p className="font-mono text-xs text-text-tertiary mb-2">
              // pending
            </p>
            <p className="text-text-secondary text-sm">
              Articles are being drafted. Check back soon.
            </p>
          </div>
        ) : (
          <div className="border-t border-border">
            {posts.map((post, i) => (
              <ArticleCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

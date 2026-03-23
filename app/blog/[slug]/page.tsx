import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import FadeUp from "@/components/ui/FadeUp";
import Tag from "@/components/ui/Tag";
import ViewCounter from "@/components/ui/ViewCounter";
import ReadingProgress from "@/components/ui/ReadingProgress";
import CopyLinkButton from "@/components/ui/CopyLinkButton";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const shareUrl = `https://ipinnuoluwa.dev/blog/${params.slug}`;

  return (
    <>
      <ReadingProgress />

      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <Link
              href="/blog"
              className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors block mb-8"
            >
              ← Back to blog
            </Link>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>

            <h1 className="font-syne font-black text-4xl md:text-6xl text-text-primary leading-tight mb-6 max-w-3xl">
              {post.frontmatter.title}
            </h1>

            <p className="text-text-secondary text-lg max-w-2xl leading-relaxed mb-8">
              {post.frontmatter.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="font-syne font-bold text-xs text-bg-primary">
                    IO
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  Ipinnuoluwa Oladipo
                </span>
              </div>
              <span className="font-mono text-xs text-text-tertiary">
                {formatDate(post.frontmatter.date)}
              </span>
              <span className="font-mono text-xs text-text-tertiary">
                {post.readTime} min read
              </span>
              <ViewCounter slug={params.slug} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-16">
            <FadeUp>
              <article className="prose max-w-none">
                <MDXRemote source={post.content} />
              </article>
            </FadeUp>

            {/* Sidebar: Share */}
            <FadeUp delay={0.1}>
              <div className="lg:sticky lg:top-24 space-y-6">
                <div>
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    Share
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                      Share on Twitter →
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                      Share on LinkedIn →
                    </a>
                    <CopyLinkButton url={shareUrl} />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    More posts
                  </p>
                  <Link
                    href="/blog"
                    className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
                  >
                    ← All posts
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

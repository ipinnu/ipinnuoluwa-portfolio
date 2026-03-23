import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, projects } from "@/lib/projects";
import Tag from "@/components/ui/Tag";
import FadeUp from "@/components/ui/FadeUp";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: `${project.summary} — ${project.outcome}`,
    openGraph: {
      title: `${project.title} | Ipinnuoluwa Oladipo`,
      description: `${project.summary} — ${project.outcome}`,
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 border-b border-border">
        <div className="max-w-content mx-auto px-6">
          <FadeUp>
            <Link
              href="/work"
              className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors block mb-8"
            >
              ← Back to work
            </Link>
            <h1 className="font-syne font-black text-5xl md:text-7xl text-text-primary leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
              {project.summary}
            </p>
          </FadeUp>

          {/* Meta row */}
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border">
              <div>
                <p className="font-mono text-xs text-text-tertiary mb-2">
                  Role
                </p>
                <p className="text-text-primary text-sm font-medium">
                  {project.role}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-text-tertiary mb-2">
                  Timeline
                </p>
                <p className="text-text-primary text-sm font-medium">
                  {project.timeline}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-text-tertiary mb-2">
                  Status
                </p>
                <p className="text-text-primary text-sm font-medium">
                  {project.status}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-text-tertiary mb-2">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs text-text-secondary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Case study body */}
      <section className="py-20 md:py-32">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-16">
              <FadeUp>
                <div>
                  <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
                    The Problem
                  </p>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {project.problem}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.05}>
                <div>
                  <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
                    My Role
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {project.role}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div>
                  <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
                    The Build
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {project.build}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="bg-bg-secondary border border-border p-8">
                  <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
                    The Outcome
                  </p>
                  <p className="font-syne font-bold text-2xl text-text-primary leading-snug">
                    {project.outcome}
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div>
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    One lesson
                  </p>
                  <p className="text-text-secondary leading-relaxed italic border-l-2 border-accent pl-6">
                    {project.lessons}
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <FadeUp delay={0.1}>
                <div className="bg-bg-secondary border border-border p-6">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <Tag key={s} label={s} />
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="bg-bg-secondary border border-border p-6">
                  <p className="font-mono text-xs text-text-tertiary uppercase tracking-widest mb-4">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <Link
                  href="/hire"
                  className="block bg-accent text-bg-primary text-center font-syne font-semibold text-sm px-6 py-4 rounded-sm hover:bg-accent-dim transition-colors"
                >
                  Want something like this? Hire me →
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Next project */}
      {nextProject && (
        <section className="border-t border-border">
          <Link
            href={`/work/${nextProject.slug}`}
            className="group block py-16"
          >
            <div className="max-w-content mx-auto px-6 flex items-center justify-between gap-8">
              <div>
                <p className="font-mono text-xs text-text-tertiary mb-2">
                  Next project
                </p>
                <h3 className="font-syne font-bold text-3xl text-text-primary group-hover:text-accent transition-colors">
                  {nextProject.title}
                </h3>
              </div>
              <span className="text-text-secondary group-hover:text-accent transition-colors text-2xl">
                →
              </span>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}

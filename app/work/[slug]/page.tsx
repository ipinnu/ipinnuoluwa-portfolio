import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, projects } from "@/lib/projects";
import Tag from "@/components/ui/Tag";
import FadeUp from "@/components/ui/FadeUp";
import ProjectMediaGallery from "@/components/sections/ProjectMediaGallery";

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

      {/* Hero image */}
      {project.image && (
        <div className="border-b border-border bg-bg-secondary">
          <div className="max-w-content mx-auto">
            {project.media ? (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} — product overview`}
                  fill
                  className="object-cover object-top"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <Image
                src={project.image}
                alt={`${project.title} — overview`}
                width={6672}
                height={5896}
                style={{ width: "100%", height: "auto" }}
                priority
              />
            )}
          </div>
        </div>
      )}
      {!project.image && (
        <div className="border-b border-border bg-bg-secondary">
          <div className="max-w-content mx-auto px-6 py-8">
            <div className="relative flex min-h-64 items-end overflow-hidden border border-border bg-[radial-gradient(circle_at_75%_20%,rgba(163,196,180,0.18),transparent_35%),linear-gradient(135deg,#1a1a1a,#0a0a0a)] p-8 md:min-h-96 md:p-12">
              <div
                className="absolute inset-0 opacity-30"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="relative">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  Live client work
                </p>
                <p className="font-syne text-4xl font-black tracking-tight text-text-primary md:text-6xl">
                  {project.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {project.proofPoints && project.proofPoints.length > 0 && (
                <FadeUp delay={0.04}>
                  <div
                    className="grid grid-cols-2 border-l border-t border-border"
                    aria-label={`${project.title} engineering footprint`}
                  >
                    {project.proofPoints.map((point) => (
                      <div
                        key={point.label}
                        className="min-h-32 border-b border-r border-border bg-bg-secondary p-5 md:p-6"
                      >
                        <p className="font-syne text-2xl font-black text-accent md:text-3xl">
                          {point.value}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
                          {point.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </FadeUp>
              )}

              {project.images && project.images.length >= 1 && (
                <FadeUp delay={0.05}>
                  {project.imageLayout === "stack" ? (
                    <figure>
                      <div className="rounded-xl overflow-hidden border border-border bg-bg-secondary">
                        <Image
                          src={project.images[0]}
                          alt={`${project.title} screen 1`}
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 66vw"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      {project.imageCaptions?.[0] && (
                        <figcaption className="border-x border-b border-border bg-bg-secondary p-4 text-sm leading-relaxed text-text-tertiary">
                          {project.imageCaptions[0]}
                        </figcaption>
                      )}
                    </figure>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 items-start">
                      {[project.images[0], project.images[1]].map((src, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden border border-border bg-bg-secondary"
                        >
                          <Image
                            src={src}
                            alt={`${project.title} screen ${i + 1}`}
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 50vw, 33vw"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </FadeUp>
              )}

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
                  <div className="space-y-4">
                    {project.build.split("\n\n").map((para, i) => (
                      <p key={i} className="text-text-secondary leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {project.highlights && project.highlights.length > 0 && (
                <FadeUp delay={0.11}>
                  <div>
                    <p className="font-mono text-xs text-accent uppercase tracking-widest mb-4">
                      Engineering Highlights
                    </p>
                    <ul className="grid gap-px bg-border sm:grid-cols-2">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex min-h-24 gap-3 bg-bg-secondary p-5 text-sm leading-relaxed text-text-secondary"
                        >
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="m4 10 3.5 3.5L16 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              )}

              {project.media && project.media.length > 0 && (
                <FadeUp delay={0.12}>
                  <ProjectMediaGallery
                    projectTitle={project.title}
                    media={project.media}
                  />
                </FadeUp>
              )}

              {project.imageLayout === "stack" && project.images && project.images.length >= 2 && (
                <FadeUp delay={0.12}>
                  <div className="flex flex-col gap-4">
                    {project.images.slice(1).map((src, i) => (
                      <div key={i} className="max-w-xs mx-auto w-full">
                        <div className="rounded-xl overflow-hidden border border-border bg-bg-secondary">
                          <Image
                            src={src}
                            alt={`${project.title} screen ${i + 2}`}
                            width={0}
                            height={0}
                            sizes="320px"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeUp>
              )}

              {project.images && project.images.length >= 3 && project.imageLayout !== "stack" && (
                <FadeUp delay={0.12}>
                  <div className="rounded-xl overflow-hidden border border-border bg-bg-secondary">
                    <Image
                      src={project.images[2]}
                      alt={`${project.title} — detail screen`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </FadeUp>
              )}

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

              {project.liveUrl && (
                <FadeUp delay={0.2}>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-bg-secondary border border-accent text-accent text-center font-syne font-semibold text-sm px-6 py-4 rounded-sm hover:bg-accent hover:text-bg-primary transition-colors"
                  >
                    Visit live site →
                  </a>
                </FadeUp>
              )}

              {project.playStoreUrl && (
                <FadeUp delay={0.22}>
                  <a
                    href={project.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-bg-secondary border border-border text-text-secondary text-center font-syne font-semibold text-sm px-6 py-4 rounded-sm hover:border-accent hover:text-accent transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.76c.3.17.65.19.97.07l11.65-6.73-2.6-2.6-10.02 9.26zM.5 1.4C.19 1.74 0 2.24 0 2.9v18.2c0 .66.19 1.16.5 1.5l.08.08 10.2-10.2v-.24L.58 1.32.5 1.4zM19.37 9.04l-2.77-1.6-2.93 2.93 2.93 2.93 2.79-1.61c.8-.46.8-1.2-.02-1.65zM4.15.25L15.8 6.97l-2.6 2.6L3.18.31c.32-.13.68-.1.97.06v-.12z"/>
                    </svg>
                    View on Play Store ↗
                  </a>
                </FadeUp>
              )}

              {project.note && (
                <FadeUp delay={0.23}>
                  <div className="border border-border bg-bg-secondary p-6">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                      Implementation note
                    </p>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {project.note}
                    </p>
                  </div>
                </FadeUp>
              )}

              <FadeUp delay={0.25}>
                <a
                  href="https://wa.me/2348133754181?text=Hi%20Ipinnuoluwa%2C%20I%20saw%20your%20work%20and%20would%20like%20to%20discuss%20a%20similar%20project.%20Brief%20overview%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-accent text-bg-primary text-center font-syne font-semibold text-sm px-6 py-4 rounded-sm hover:bg-accent-dim transition-colors"
                >
                  Build something like this →
                </a>
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

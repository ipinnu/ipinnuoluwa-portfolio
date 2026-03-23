import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import SectionLabel from "@/components/ui/SectionLabel";
import { getFeaturedProjects } from "@/lib/projects";
import Tag from "@/components/ui/Tag";

export default function FeaturedWork() {
  const projects = getFeaturedProjects();

  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionLabel label="Selected work" className="mb-4" />
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-text-primary">
              Things I&apos;ve built
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/work"
              className="font-mono text-xs text-text-secondary hover:text-accent transition-colors hidden md:block"
            >
              View all work →
            </Link>
          </FadeUp>
        </div>

        <div className="space-y-px">
          {projects.map((project, i) => (
            <FadeUp key={project.slug} delay={i * 0.12}>
              <Link
                href={`/work/${project.slug}`}
                className="group block bg-bg-secondary hover:bg-bg-tertiary transition-colors border border-border p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs text-text-tertiary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-xs text-text-tertiary border border-border px-2 py-0.5">
                        {project.status}
                      </span>
                    </div>
                    <h3 className="font-syne font-bold text-2xl md:text-3xl text-text-primary mb-3 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-xl mb-4">
                      {project.summary}
                    </p>
                    <p className="font-mono text-xs text-text-tertiary">
                      {project.outcome}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 md:items-end">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {project.tags.map((tag) => (
                        <Tag key={tag} label={tag} />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-text-secondary group-hover:text-accent transition-colors">
                      View case study →
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/work"
            className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
          >
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}

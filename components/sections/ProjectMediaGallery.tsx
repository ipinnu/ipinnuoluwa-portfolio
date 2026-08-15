import type { Project } from "@/lib/projects";

interface ProjectMediaGalleryProps {
  projectTitle: string;
  media: NonNullable<Project["media"]>;
}

export default function ProjectMediaGallery({
  projectTitle,
  media,
}: ProjectMediaGalleryProps) {
  return (
    <section aria-labelledby="product-walkthroughs">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Product evidence
          </p>
          <h2
            id="product-walkthroughs"
            className="font-syne text-2xl font-bold text-text-primary"
          >
            Product walkthroughs
          </h2>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
          Click to play · Audio controlled by you
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {media.map((item, index) => {
          const descriptionId = `${projectTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}-media-${index}`;

          return (
            <figure
              key={item.src}
              className={
                media.length === 1 || index === 0 ? "md:col-span-2" : undefined
              }
            >
              <div className="overflow-hidden rounded-xl border border-border bg-black">
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="none"
                  poster={item.poster}
                  aria-label={`${projectTitle}: ${item.title}`}
                  aria-describedby={descriptionId}
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support embedded video.
                </video>
              </div>
              <figcaption
                id={descriptionId}
                className="border-x border-b border-border bg-bg-secondary p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-syne text-base font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
                    {item.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

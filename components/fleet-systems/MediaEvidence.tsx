"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { FleetMediaSlot } from "@/lib/fleet-systems";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import EvidenceBadge from "./EvidenceBadge";

interface MediaEvidenceProps {
  item: FleetMediaSlot;
  featured?: boolean;
  expandable?: boolean;
}

function ScreenshotSchematic() {
  return (
    <div
      className="absolute inset-0 grid grid-cols-[4.5rem_1fr] bg-[#0d100e]"
      aria-hidden="true"
    >
      <div className="border-r border-white/[0.07] p-3">
        <span className="block h-5 w-5 rounded-sm bg-neon/70" />
        <div className="mt-8 space-y-3">
          {[78, 58, 70, 48, 65].map((width) => (
            <span
              key={width}
              className="block h-1 rounded-full bg-white/10"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="block h-2 w-24 rounded-full bg-white/20" />
            <span className="block h-1.5 w-36 rounded-full bg-white/10" />
          </div>
          <span className="h-7 w-20 border border-accent/20 bg-accent/[0.06]" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {[0, 1, 2].map((card) => (
            <div
              key={card}
              className="h-16 border border-white/[0.06] bg-white/[0.025] p-2 sm:h-20"
            >
              <span className="block h-1 w-8 bg-white/10" />
              <span className="mt-3 block h-3 w-12 bg-accent/30" />
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[1.35fr_0.65fr] gap-3">
          <div className="relative h-28 overflow-hidden border border-white/[0.06] bg-white/[0.02] sm:h-36">
            <svg
              viewBox="0 0 400 150"
              className="absolute inset-0 h-full w-full text-neon/55"
            >
              <path
                d="M0 118 C48 118 45 82 90 88 S140 58 185 72 S235 38 280 54 S335 20 400 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M0 132 C60 120 72 126 120 105 S210 120 260 88 S340 105 400 72"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity=".35"
              />
            </svg>
          </div>
          <div className="h-28 border border-white/[0.06] bg-[radial-gradient(circle_at_50%_48%,rgba(163,196,180,.18),transparent_38%)] sm:h-36" />
        </div>
      </div>
    </div>
  );
}

function VideoSchematic() {
  return (
    <div
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_50%,rgba(232,255,71,.08),transparent_28%),linear-gradient(135deg,#0d100e,#090a09)]"
      aria-hidden="true"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full border border-neon/35 bg-neon/[0.07] text-neon">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path d="m9 7 8 5-8 5V7Z" fill="currentColor" />
        </svg>
      </span>
      <span className="absolute bottom-5 left-5 right-5 h-px bg-white/10">
        <span className="block h-px w-1/4 bg-neon/70" />
      </span>
    </div>
  );
}

export default function MediaEvidence({
  item,
  featured = false,
  expandable = false,
}: MediaEvidenceProps) {
  const [open, setOpen] = useState(false);
  const hasScreenshot = item.kind === "screenshot" && item.src;
  const hasVideo = item.kind === "video" && item.src;
  const canExpand = expandable && hasScreenshot;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <figure
        className={
          featured
            ? "overflow-hidden border border-border bg-bg-secondary"
            : "overflow-hidden border border-border bg-[#0d0f0e]"
        }
      >
        <div
          className={`relative overflow-hidden border-b border-border ${
            featured ? "aspect-[16/9]" : "aspect-video"
          }`}
        >
          {hasScreenshot ? (
            canExpand ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Expand ${item.title}`}
                className="absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neon"
              >
                <Image
                  src={item.src!}
                  alt={item.alt ?? item.description}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </button>
            ) : (
              <Image
                src={item.src!}
                alt={item.alt ?? item.description}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 70vw"
              />
            )
          ) : hasVideo ? (
            <video
              className="h-full w-full bg-black object-contain"
              controls
              playsInline
              preload="none"
              poster={item.poster}
              aria-label={item.title}
            >
              <source src={item.src} type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          ) : item.kind === "screenshot" ? (
            <ScreenshotSchematic />
          ) : (
            <VideoSchematic />
          )}

          {!item.src && (
            <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
              <span className="inline-flex border border-white/10 bg-black/70 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/55 backdrop-blur">
                {item.kind} placeholder · Media incoming
              </span>
            </div>
          )}
        </div>

        <figcaption className="p-4 sm:p-5">
          {item.status && <EvidenceBadge status={item.status} />}
          <h3
            className={`font-syne text-base font-bold text-text-primary sm:text-lg ${
              item.status ? "mt-4" : ""
            }`}
          >
            {item.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {item.description}
          </p>
        </figcaption>
      </figure>

      {open && item.src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close expanded image"
            className="absolute right-4 top-4 grid h-11 w-11 cursor-pointer place-items-center border border-white/15 bg-black/50 text-white transition-colors duration-200 hover:border-neon hover:text-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <div
            className="relative h-[min(86vh,820px)] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={item.src}
              alt={item.alt ?? item.description}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

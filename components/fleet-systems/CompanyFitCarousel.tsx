"use client";

import Image from "next/image";
import { useRef } from "react";
import { companyFit } from "@/lib/fleet-systems";

export default function CompanyFitCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);

  const move = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
            Illustrative operating environments
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Named for category fit only. These are not clients or affiliations.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Show previous company examples"
            className="grid h-11 w-11 cursor-pointer place-items-center border border-border text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="m14.5 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Show next company examples"
            className="grid h-11 w-11 cursor-pointer place-items-center border border-border text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Examples of companies operating fleets suited to these systems"
        className="no-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto border border-border bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
      >
        {companyFit.map((company, index) => (
          <li
            key={company.name}
            className="flex min-h-44 min-w-[78%] snap-start flex-col justify-between bg-bg-secondary p-6 sm:min-w-[19rem]"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-text-tertiary">
              Example {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex h-16 items-center">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={180}
                  height={64}
                  className="max-h-14 w-auto max-w-[11rem] object-contain object-left"
                />
              </div>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-text-tertiary">
                {company.name}
              </p>
              <p className="mt-2 text-sm text-text-secondary">{company.sector}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


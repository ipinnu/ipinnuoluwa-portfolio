"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collaborationTeams, type CollaborationTeam } from "@/lib/brands";
import styles from "./teams-carousel.module.css";

function TeamName({ team }: { team: CollaborationTeam }) {
  const start = team.accentText ? team.name.indexOf(team.accentText) : -1;
  if (start < 0 || !team.accentText || !team.accent) return <>{team.name}</>;
  return (
    <span>
      {team.name.slice(0, start)}
      <span className={styles[team.accent]}>{team.accentText}</span>
      {team.name.slice(start + team.accentText.length)}
    </span>
  );
}

export default function TeamsCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const list = track.current;
    if (!list || interacting || focused || reducedMotion) return;

    let frame: number;
    let previousTime: number | undefined;
    let position = list.scrollLeft;
    let loopWidth = 0;
    const measure = () => {
      const first = list.children[0] as HTMLElement;
      const copy = list.children[collaborationTeams.length] as HTMLElement;
      loopWidth = copy.getBoundingClientRect().left - first.getBoundingClientRect().left;
      position = list.scrollLeft;
    };
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    measure();

    const scroll = (time: number) => {
      if (previousTime !== undefined && !document.hidden && loopWidth > 0) {
        // Retain fractional pixels so the speed stays consistent at any refresh rate.
        position = (position + Math.min(time - previousTime, 64) * 0.03) % loopWidth;
        list.scrollLeft = position;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(scroll);
    };
    frame = window.requestAnimationFrame(scroll);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, [interacting, focused, reducedMotion]);

  return (
    <section className={styles.carousel} aria-label="Teams I've worked with" aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}>
      <div className={styles.heading}>
        <p>Teams I&apos;ve<br />worked with</p>
      </div>
      <ul id="teams-carousel-track" ref={track} className={styles.track} tabIndex={0}
        aria-label="Scroll to explore all teams. Focus or hover to pause automatic scrolling."
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onTouchStart={(event) => event.currentTarget.focus({ preventScroll: true })}>
        {[...collaborationTeams, ...collaborationTeams].map((team, index) => (
          <li key={`${team.name}-${index}`} aria-hidden={index >= collaborationTeams.length ? true : undefined}
            className={`${styles.team} ${index >= collaborationTeams.length ? styles.copy : ""} ${team.accent && !team.accentText ? styles[team.accent] : ""}`}>
            {team.affiliation ? (
              <span className={styles.affiliatedTeam}>
                <span><TeamName team={team} /></span>
                <span className={styles.affiliationLabel}>In affiliation with</span>
                <Image src={team.affiliation.logo} alt={`${team.affiliation.name} logo`} width={100} height={28} className={styles.affiliationLogo} />
              </span>
            ) : team.logo && team.showName ? (
              <span className={styles.brandIdentity}>
                <span className={`${styles.brandIcon} ${team.logoHasPadding ? styles.paddedIcon : ""}`}><Image src={team.logo} alt="" width={128} height={128} /></span>
                <span>{team.name}</span>
              </span>
            ) : team.logo ? (
              <Image src={team.logo} alt={`${team.name} logo`} width={team.logoSize === "large" ? 160 : 140} height={team.logoSize === "large" ? 128 : 64} className={`${styles.logo} ${team.logoSize === "large" ? styles.largeLogo : ""}`} />
            ) : team.icon === "airplane" ? (
              <span className={styles.brandIdentity}>
                <svg className={styles.airplane} viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17.8 19.2 16 11l3.5-3.5c1.5-1.5 2-3.5 1-4.5s-3-.5-4.5 1L12.5 7.5 4.3 5.7c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3l5.3 3.5-3 4.5H3l-1 1 3 2 2 3 1-1v-2.5l4.5-3 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1Z" />
                </svg>
                <TeamName team={team} />
              </span>
            ) : <TeamName team={team} />}
          </li>
        ))}
      </ul>
    </section>
  );
}

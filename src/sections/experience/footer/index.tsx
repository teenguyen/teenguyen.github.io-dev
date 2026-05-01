"use client";

import { useEffect, useRef } from "react";
import HeroLogo from "@/sections/hero/Logo";
import Socials from "@/sections/hero/Socials";
import styles from "./index.module.css";
import clsx from "clsx";

const DRAW_MS = 520;

type ExperienceFooterProps = {
  active: boolean;
  /** Sync with experience table choreography (ms after slide activates) */
  lineDelayMs: number;
};

export default function ExperienceFooter({
  active,
  lineDelayMs,
}: ExperienceFooterProps) {
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!active) return;

    const line = lineRef.current;
    if (!line) return;

    let cancelled = false;
    let startTimer = 0;
    let cleanupTimer = 0;
    let raf = 0;

    const armDash = () => {
      if (cancelled) return;
      const len = line.getTotalLength();
      if (len <= 0) {
        raf = requestAnimationFrame(armDash);
        return;
      }

      line.style.transition = "none";
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      line.getBoundingClientRect();

      startTimer = window.setTimeout(() => {
        if (cancelled) return;
        line.style.transition = `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        line.style.strokeDashoffset = "0";
      }, lineDelayMs);

      cleanupTimer = window.setTimeout(
        () => {
          if (cancelled) return;
          line.style.transition = "";
          line.style.strokeDasharray = "";
          line.style.strokeDashoffset = "";
        },
        lineDelayMs + DRAW_MS + 50,
      );
    };

    raf = requestAnimationFrame(armDash);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(startTimer);
      window.clearTimeout(cleanupTimer);
      line.style.transition = "";
      line.style.strokeDasharray = "";
      line.style.strokeDashoffset = "";
    };
  }, [active, lineDelayMs]);

  return (
    <footer className={styles.footer}>
      <div className={styles.hrWrapper} aria-hidden>
        <svg
          className={styles.hr}
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            ref={lineRef}
            className={styles.hrLine}
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            vectorEffect="nonScalingStroke"
          />
        </svg>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerContentSocials}>
          <HeroLogo />
          <Socials vertical />
        </div>
        <p className={clsx("subtitle", styles.footerText)}>
          Built with love, from Sydney to San Francisco and back again ❤︎
        </p>
      </div>
    </footer>
  );
}

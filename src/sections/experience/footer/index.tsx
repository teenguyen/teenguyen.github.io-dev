"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroAnimatedLogo, {
  addHeroLogoRevealToTimeline,
  heroLogoRevealDuration,
  prepareHeroLogoReveal,
} from "@/sections/hero/HeroAnimatedLogo";
import Socials, {
  addSocialsStaggerRevealToTimeline,
  SOCIALS_COL_REVEAL_DURATION,
  SOCIALS_STAGGER_STEP,
} from "@/sections/hero/Socials";
import styles from "./index.module.css";
import clsx from "clsx";

const DRAW_MS = 520;
const MEASURE_RETRY_CAP = 120;
const FOOTER_SOCIALS_OVERLAP_BEFORE_LOGO_END = 0.42;
/** Match hero ScreenTwo tagline initial offset (`INITIAL_Y`). */
const FOOTER_TAGLINE_INITIAL_Y = 16;
/** Slower than hero taglines (`TAGLINE_REVEAL_DURATION` 0.8). */
const FOOTER_TAGLINE_REVEAL_DURATION = 0.8;

type ExperienceFooterProps = {
  active: boolean;
  lineDelayMs: number;
};

function killFooterAnimations(
  line: SVGLineElement | null,
  svg: SVGSVGElement | null,
  socialsNav: HTMLElement | null,
  tagLine: HTMLElement | null,
) {
  if (line) gsap.killTweensOf(line);
  if (svg) gsap.killTweensOf(svg.querySelectorAll("path"));
  if (socialsNav) gsap.killTweensOf(socialsNav.querySelectorAll("li"));
  if (tagLine) gsap.killTweensOf(tagLine);
}

export default function ExperienceFooter({
  active,
  lineDelayMs,
}: ExperienceFooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const socialsNavRef = useRef<HTMLElement | null>(null);
  const footerTagRef = useRef<HTMLParagraphElement | null>(null);
  const choreographyRunIdRef = useRef(0);

  useGSAP(
    () => {
      const line = lineRef.current;
      const svg = logoRef.current;
      const socialsNav = socialsNavRef.current;
      const tagLine = footerTagRef.current;

      choreographyRunIdRef.current += 1;
      const runId = choreographyRunIdRef.current;

      killFooterAnimations(line, svg, socialsNav, tagLine);

      if (!active) {
        return;
      }

      if (!line || !svg || !socialsNav || !tagLine) return;

      gsap.set(tagLine, {
        opacity: 0,
        y: FOOTER_TAGLINE_INITIAL_Y,
      });

      let attempts = 0;

      const measureAndBuild = () => {
        if (runId !== choreographyRunIdRef.current) return;

        attempts++;
        const lineLen = line.getTotalLength();
        const logoReady = prepareHeroLogoReveal(svg);

        if (lineLen <= 0 || !logoReady) {
          if (attempts < MEASURE_RETRY_CAP) {
            gsap.delayedCall(0, measureAndBuild);
          }
          return;
        }

        if (runId !== choreographyRunIdRef.current) return;

        const delaySec = lineDelayMs / 1000;
        const drawSec = DRAW_MS / 1000;
        const logoStart = delaySec + drawSec;

        gsap.set(line, {
          strokeDasharray: lineLen,
          strokeDashoffset: lineLen,
        });

        const tl = gsap.timeline();
        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: drawSec,
            ease: "power2.out",
          },
          delaySec,
        ).set(
          line,
          {
            clearProps: "strokeDasharray,strokeDashoffset",
          },
          logoStart,
        );

        addHeroLogoRevealToTimeline(tl, svg, logoStart);

        const pathCount = svg.querySelectorAll("path").length;
        const logoRevealTotal = heroLogoRevealDuration(pathCount);
        const socialsStart =
          logoStart +
          Math.max(0, logoRevealTotal - FOOTER_SOCIALS_OVERLAP_BEFORE_LOGO_END);

        addSocialsStaggerRevealToTimeline(tl, socialsNav, socialsStart, true);

        const socialCount = socialsNav.querySelectorAll("li").length;
        const verticalSocialRevealDuration =
          socialCount > 0
            ? (socialCount - 1) * SOCIALS_STAGGER_STEP +
              SOCIALS_COL_REVEAL_DURATION
            : 0;
        const tagStart = socialsStart + verticalSocialRevealDuration;

        tl.to(
          tagLine,
          {
            opacity: 1,
            y: 0,
            duration: FOOTER_TAGLINE_REVEAL_DURATION,
            ease: "power2.out",
          },
          tagStart,
        );
      };

      measureAndBuild();
    },
    {
      scope: footerRef,
      dependencies: [active, lineDelayMs],
    },
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
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
          <HeroAnimatedLogo ref={logoRef} />
          <Socials ref={socialsNavRef} vertical />
        </div>
        <p ref={footerTagRef} className={clsx("subtitle", styles.footerText)}>
          Built with love, from Sydney to San Francisco and back again ❤︎
        </p>
      </div>
    </footer>
  );
}

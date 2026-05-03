"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Starmap from "@/demos/starmap/Starmap";
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

/** Slower than hero taglines (`TAGLINE_REVEAL_DURATION` 0.8). */
const FOOTER_REVEAL_DURATION = 0.8;

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

function killStarmapBackdrop(backdrop: HTMLDivElement | null) {
  if (backdrop) gsap.killTweensOf(backdrop);
}

export default function ExperienceFooter({
  active,
  lineDelayMs,
}: ExperienceFooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const starmapBackdropRef = useRef<HTMLDivElement>(null);
  const [footerStarmapPlaying, setFooterStarmapPlaying] = useState(false);
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

      const starmapBackdrop = starmapBackdropRef.current;
      killStarmapBackdrop(starmapBackdrop);

      if (!active) {
        if (starmapBackdrop) gsap.set(starmapBackdrop, { autoAlpha: 0 });
        queueMicrotask(() => {
          setFooterStarmapPlaying(false);
        });
        return;
      }

      if (!line || !svg || !socialsNav || !tagLine || !starmapBackdrop) return;

      gsap.set(starmapBackdrop, { autoAlpha: 0 });

      gsap.set(tagLine, {
        opacity: 0,
        y: 16,
      });

      let attempts = 0;

      const measureAndBuild = () => {
        if (runId !== choreographyRunIdRef.current) return;

        attempts++;
        const lineLen = line.getTotalLength();
        const logoReady = prepareHeroLogoReveal(svg);

        if (lineLen <= 0 || !logoReady) {
          if (attempts < 120) {
            gsap.delayedCall(0, measureAndBuild);
          }
          return;
        }

        if (runId !== choreographyRunIdRef.current) return;

        const delaySec = lineDelayMs / 1000;
        const drawSec = 0.52;
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
        const socialsStart = logoStart + Math.max(0, logoRevealTotal - 0.42); // 0.42 is the overlap before the logo ends

        addSocialsStaggerRevealToTimeline(tl, socialsNav, socialsStart, true);

        const socialCount = socialsNav.querySelectorAll("li").length;
        const verticalSocialRevealDuration =
          socialCount > 0
            ? (socialCount - 1) * SOCIALS_STAGGER_STEP +
              SOCIALS_COL_REVEAL_DURATION
            : 0;
        const tagStart = socialsStart + verticalSocialRevealDuration;
        const tagEndSec = tagStart + FOOTER_REVEAL_DURATION;
        const starmapPlayingAt = Math.max(
          0,
          tagEndSec - 0.2, // 0.2 is the overlap before the tagline ends
        );

        tl.to(
          tagLine,
          {
            opacity: 1,
            y: 0,
            duration: FOOTER_REVEAL_DURATION,
            ease: "power2.out",
          },
          tagStart,
        )
          .call(
            () => {
              setFooterStarmapPlaying(true);
            },
            undefined,
            starmapPlayingAt,
          )
          .to(
            starmapBackdrop,
            {
              autoAlpha: 1,
              duration: FOOTER_REVEAL_DURATION,
              ease: "power2.out",
            },
            tagEndSec,
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
      <div
        ref={starmapBackdropRef}
        className={styles.starmapBackdrop}
        aria-hidden
      >
        <Starmap playing={footerStarmapPlaying} />
      </div>
      <div className={styles.footerForeground}>
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
        <div className={styles.footerContent}>
          <div className={styles.footerContentSocials}>
            <HeroAnimatedLogo ref={logoRef} />
            <Socials ref={socialsNavRef} vertical />
          </div>
          <p ref={footerTagRef} className={clsx("subtitle", styles.footerText)}>
            Built with love, from Sydney to San Francisco and back again ❤︎
          </p>
        </div>
      </div>
    </footer>
  );
}

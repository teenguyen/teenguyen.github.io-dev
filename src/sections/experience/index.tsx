"use client";

import { useEffect, useRef } from "react";
import { useActiveSlideIndex, useSlideIndex } from "../SectionSlider";
import ExperienceDesktop from "./ExperienceDesktop";
import ExperienceMobile from "./ExperienceMobile";
import { EXPERIENCE_T0, EXPERIENCE_ANIM_DUR } from "./consts";
import ExperienceFooter from "./footer";
import styles from "./index.module.css";

/**
 * When the Experience footer GSAP timeline should start drawing the horizontal rule,
 * in ms from slide activation. Sum tracks the entrance effect (see `showCell` / `T1`):
 *   T0          — wait for slide settle; first grid stroke begins (`outer1Ref` at T0).
 *   ANIM_DUR    — duration of wrap-1 outer rectangle draw (900ms).
 *   200         — gap between wrap-1 finishing and `T1`; wrap-2 outer begins at T1.
 *   940         — offset after T1 until `showCell("edu", …)` (last row fades in).
 *   420         — buffer after the edu cue for `.cell` opacity / layout to read as “landed”.
 *   750         — extra hold so the footer reads as a separate beat after the grid.
 */
const EXPERIENCE_FOOTER_RULE_DELAY_MS =
  EXPERIENCE_T0 + EXPERIENCE_ANIM_DUR + 200 + 940 + 420 + 750;

/** Edge slack so OS overscroll / float scrollTop doesn't trap slide navigation. */
const SCROLL_BOUNDARY_EPS = 3;

export default function Experience() {
  const sectionIndex = useSlideIndex();
  const activeSection = useActiveSlideIndex();
  const isActive = sectionIndex === activeSection;

  const scrollRef = useRef<HTMLDivElement>(null);
  const experienceTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 1) return;

      if (e.deltaY === 0) return;

      const top = el.scrollTop;

      if (e.deltaY > 0 && top >= maxScroll - SCROLL_BOUNDARY_EPS) return;
      if (e.deltaY < 0 && top <= SCROLL_BOUNDARY_EPS) return;

      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className={styles.section}>
      <div ref={scrollRef} className={styles.scrollArea}>
        <div className={styles.content}>
          <h2 ref={experienceTitleRef} className={styles.heading}>
            experience
          </h2>
          <ExperienceDesktop isActive={isActive} />
          <ExperienceMobile
            isActive={isActive}
            experienceTitleRef={experienceTitleRef}
          />
        </div>
        <ExperienceFooter
          active={isActive}
          lineDelayMs={EXPERIENCE_FOOTER_RULE_DELAY_MS}
        />
      </div>
    </section>
  );
}

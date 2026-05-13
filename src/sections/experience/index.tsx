"use client";

import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ExperienceDesktop from "./ExperienceDesktop";
import ExperienceMobile from "./ExperienceMobile";
import styles from "./index.module.css";

/**
 * Use 0 (isIntersecting): a fixed ratio like 0.5 never fires for sections taller
 * than ~2× the viewport, because max intersection ratio stays below that value.
 */
const SECTION_IN_VIEW_THRESHOLD = 0;

export default function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionVisible = useIntersectionObserver(
    sectionRef,
    SECTION_IN_VIEW_THRESHOLD,
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.divider}>
        <hr />
        <h6>EXPERIENCE</h6>
      </div>
      <div className={styles.content}>
        <ExperienceDesktop isActive={sectionVisible} />
        <ExperienceMobile isActive={sectionVisible} />
      </div>
    </section>
  );
}

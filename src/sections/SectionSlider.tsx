"use client";

import { Children, ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./SectionSlider.module.css";

const TWEEN_DURATION = 1.25;

type SectionSliderProps = {
  children: ReactNode;
};

export default function SectionSlider({ children }: SectionSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const slides = Children.toArray(children);
  const slideCount = slides.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || slideCount < 2) return;

    const goTo = (next: number) => {
      const clamped = Math.max(0, Math.min(slideCount - 1, next));
      if (clamped === activeRef.current) return;
      if (gsap.isTweening(container)) return;

      activeRef.current = clamped;
      gsap.to(container, {
        y: -clamped * window.innerHeight,
        duration: TWEEN_DURATION,
        ease: "power4.inOut",
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (gsap.isTweening(container)) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      goTo(activeRef.current + direction);
    };

    const onResize = () => {
      gsap.set(container, { y: -activeRef.current * window.innerHeight });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [slideCount]);

  return (
    <div className={styles.master}>
      <div ref={containerRef} className={styles.panelWrap}>
        {slides.map((child, i) => (
          <div key={i} className={styles.panel}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * @param threshold - IntersectionObserver threshold option. Default `0`. When latching
 *   (`isReplay` false) and `threshold > 0`, the hit uses `intersectionRatio >= threshold`;
 *   when `threshold === 0`, the hit uses `isIntersecting`.
 * @param isReplay - `false` (default): once the observer first reports an intersecting hit
 *   (for `threshold`), the returned value latches `true` and the observer disconnects.
 *   `true`: returned value mirrors live intersection (enter/leave).
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  threshold: number = 0,
  isReplay = false,
): boolean {
  const [satisfied, setSatisfied] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (isReplay) {
      const obs = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          setSatisfied(!!e?.isIntersecting);
        },
        { threshold },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }

    let done = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (done) return;
        const e = entries[0];
        const hit =
          threshold > 0
            ? (e?.intersectionRatio ?? 0) >= threshold
            : !!e?.isIntersecting;
        if (hit) {
          done = true;
          setSatisfied(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);

    // Fallback when the section is already on screen (scroll restoration, deep links):
    // some engines deliver the first IO callback late; without this, consumers can stay
    // stuck in a pre-intersection state through layout-dependent follow-up work.
    if (threshold === 0) {
      requestAnimationFrame(() => {
        if (done) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const visible =
          r.bottom > 0 &&
          r.right > 0 &&
          r.top < vh &&
          r.left < vw;
        if (visible) {
          done = true;
          setSatisfied(true);
          obs.disconnect();
        }
      });
    }

    return () => {
      done = true;
      obs.disconnect();
    };
  }, [elementRef, threshold, isReplay]);

  return satisfied;
}

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
    return () => {
      done = true;
      obs.disconnect();
    };
  }, [elementRef, threshold, isReplay]);

  return satisfied;
}

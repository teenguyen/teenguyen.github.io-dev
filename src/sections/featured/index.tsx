"use client";

import { useEffect, useRef } from "react";
import styles from "./index.module.css";
import LiveRamp from "./LiveRamp";
import SoFi from "./SoFi";
import { SCROLL_BOUNDARY_EPS } from "../consts";

export default function Featured() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className={styles.divider}>
          <hr />
          <h6>FEATURED WORK</h6>
        </div>
        <div className={styles.content}>
          <SoFi />
          <LiveRamp />
        </div>
      </div>
    </section>
  );
}

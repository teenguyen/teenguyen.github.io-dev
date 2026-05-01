"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useActiveSlideIndex, useSlideIndex } from "../SectionSlider";
import ExperienceFooter from "./footer";
import styles from "./index.module.css";

const CURRENT_JOB = {
  title: "senior front end engineer",
  company: "SOCIAL FINANCE",
  location: "SAN FRANCISCO CA, USA",
  dates: "MARCH 2023 – DECEMBER 2025",
  logo: "/experience/sofi.svg",
};

const PRIOR_JOBS = [
  {
    id: "lr",
    title: "senior front end engineer",
    company: "LIVERAMP",
    location: "SAN FRANCISCO, USA",
    dates: "SEP 2018 – JAN 2023",
    logo: "/experience/liveramp.svg",
  },
  {
    id: "rba",
    title: "front end / java developer",
    company: "RESERVE BANK OF AUSTRALIA",
    location: "SYDNEY, AUS",
    dates: "MAR 2016 – AUG 2018",
    logo: "/experience/rba.svg",
  },
];

const EARLY_JOBS = [
  {
    role: "it graduate",
    company: "RESERVE BANK OF AUSTRALIA",
    year: "2014",
    logo: "/experience/rba.svg",
  },
  {
    role: "developer operations",
    company: "ING DIRECT",
    year: "2013",
    logo: "/experience/ing%20direct.svg",
  },
  {
    role: "junior java developer",
    company: "SYPLE TECHNOLOGIES",
    year: "2012",
    logo: "/experience/syple.svg",
  },
  {
    role: "junior .net developer",
    company: "MERRILL LYNCH",
    year: "2011",
    logo: "/experience/merrill%20lynch.svg",
  },
];

const EDUCATION = [
  {
    degree: "bachelor of information technology\nco-op scholarship",
    school: "UNIVERSITY OF TECHNOLOGY, SYDNEY",
  },
];

type Rect = { top: number; left: number; right: number; bottom: number };

type Wrap1Paths = { outer: string; divH: string; divV: string };
type Wrap2Paths = {
  outer: string;
  divH: string;
  divV: string;
  divEdu: string;
};

const ANIM_DUR = 900;
/** Edge slack so OS overscroll / float scrollTop doesn't trap slide navigation. */
const SCROLL_BOUNDARY_EPS = 3;
/** Base delay before first grid stroke (slide settle + extra pause). */
const T0 = 350;
/** After education cell starts fading in (+ buffer for .cell opacity transition) */
const FOOTER_RULE_DELAY_MS = T0 + ANIM_DUR + 200 + 940 + 420;

function getRect(el: HTMLElement, parent: HTMLElement): Rect {
  const er = el.getBoundingClientRect();
  const pr = parent.getBoundingClientRect();
  return {
    top: er.top - pr.top,
    left: er.left - pr.left,
    right: er.right - pr.left,
    bottom: er.bottom - pr.top,
  };
}

export default function Experience() {
  const sectionIndex = useSlideIndex();
  const activeSection = useActiveSlideIndex();
  const isActive = sectionIndex === activeSection;

  const scrollRef = useRef<HTMLDivElement>(null);
  const wrap1Ref = useRef<HTMLDivElement>(null);
  const wrap2Ref = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const lrRef = useRef<HTMLDivElement>(null);
  const rbaRef = useRef<HTMLDivElement>(null);
  const earlyRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const eduHeadingRef = useRef<HTMLDivElement>(null);

  const outer1Ref = useRef<SVGPathElement>(null);
  const divH1Ref = useRef<SVGPathElement>(null);
  const divV1Ref = useRef<SVGPathElement>(null);
  const outer2Ref = useRef<SVGPathElement>(null);
  const divH2Ref = useRef<SVGPathElement>(null);
  const divV2Ref = useRef<SVGPathElement>(null);
  const divEdu2Ref = useRef<SVGPathElement>(null);

  const [wrap1Size, setWrap1Size] = useState({ w: 0, h: 0 });
  const [wrap2Size, setWrap2Size] = useState({ w: 0, h: 0 });
  const [wrap1Paths, setWrap1Paths] = useState<Wrap1Paths | null>(null);
  const [wrap2Paths, setWrap2Paths] = useState<Wrap2Paths | null>(null);
  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set());
  const playingRef = useRef(false);

  useEffect(() => {
    const wrap1 = wrap1Ref.current;
    const wrap2 = wrap2Ref.current;
    if (!wrap1 || !wrap2) return;

    const measure = () => {
      if (
        !wrap1 ||
        !wrap2 ||
        !heroRef.current ||
        !lrRef.current ||
        !earlyRef.current ||
        !eduRef.current ||
        !eduHeadingRef.current
      ) {
        return;
      }

      const wr1 = wrap1.getBoundingClientRect();
      const hero = getRect(heroRef.current, wrap1);
      const lr = getRect(lrRef.current, wrap1);
      const W1 = wr1.width;
      const H1 = wr1.height;
      const divY1 = hero.bottom;
      const divX1 = lr.right;

      setWrap1Size({ w: W1, h: H1 });
      setWrap1Paths({
        outer: `M 0 0 L ${W1} 0 L ${W1} ${H1} L 0 ${H1} Z`,
        divH: `M 0 ${divY1} L ${W1} ${divY1}`,
        divV: `M ${divX1} ${divY1} L ${divX1} ${H1}`,
      });

      const wr2 = wrap2.getBoundingClientRect();
      const early = getRect(earlyRef.current, wrap2);
      const eduHeading = getRect(eduHeadingRef.current, wrap2);
      const W2 = wr2.width;
      const H2 = wr2.height;
      const divY2 = early.bottom;
      const divX2 = early.right;
      // Position the education-row divider just to the left of the
      // "education" heading, on the gutter rather than against the glyphs.
      const eduPadX = parseFloat(getComputedStyle(eduRef.current).paddingLeft);
      const divXEdu = eduHeading.left - (isNaN(eduPadX) ? 0 : eduPadX);

      setWrap2Size({ w: W2, h: H2 });
      setWrap2Paths({
        outer: `M 0 0 L ${W2} 0 L ${W2} ${H2} L 0 ${H2} Z`,
        divH: `M 0 ${divY2} L ${W2} ${divY2}`,
        divV: `M ${divX2} 0 L ${divX2} ${divY2}`,
        divEdu: `M ${divXEdu} ${divY2} L ${divXEdu} ${H2}`,
      });
    };

    const raf = requestAnimationFrame(measure);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 120);
    });
    ro.observe(wrap1);
    ro.observe(wrap2);

    return () => {
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, []);

  // Run the entrance animation each time this slide becomes active.
  useEffect(() => {
    if (!isActive) {
      playingRef.current = false;
      return;
    }
    if (!wrap1Paths || !wrap2Paths) return;
    if (playingRef.current) return;
    playingRef.current = true;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timeouts.push(setTimeout(fn, delay));
    };

    const animateLine = (
      el: SVGPathElement | null,
      duration: number,
      delay: number,
    ) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.transition = "none";
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      // force reflow so the no-transition reset takes hold
      el.getBoundingClientRect();
      schedule(() => {
        el.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        el.style.strokeDashoffset = "0";
      }, delay);
      // Drop inline stroke styles after the draw so resize-driven path-d
      // changes don't leave a stale dasharray clipping the perimeter.
      schedule(
        () => {
          el.style.transition = "";
          el.style.strokeDasharray = "";
          el.style.strokeDashoffset = "";
        },
        delay + duration + 50,
      );
    };

    const showCell = (id: string, delay: number) => {
      schedule(() => {
        setVisibleCells((prev) => {
          if (prev.has(id)) return prev;
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }, delay);
    };

    // Drop any cells left visible from the previous activation so the
    // staggered fade-in actually has something to fade in from.
    schedule(() => setVisibleCells(new Set()), 0);

    const outer1Len = 2 * (wrap1Size.w + wrap1Size.h);
    if (outer1Ref.current) {
      outer1Ref.current.style.transition = "none";
      outer1Ref.current.style.strokeDasharray = String(outer1Len);
      outer1Ref.current.style.strokeDashoffset = String(outer1Len);
      outer1Ref.current.getBoundingClientRect();
      schedule(() => {
        if (!outer1Ref.current) return;
        outer1Ref.current.style.transition = `stroke-dashoffset ${ANIM_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        outer1Ref.current.style.strokeDashoffset = "0";
      }, T0);
      schedule(
        () => {
          if (!outer1Ref.current) return;
          outer1Ref.current.style.transition = "";
          outer1Ref.current.style.strokeDasharray = "";
          outer1Ref.current.style.strokeDashoffset = "";
        },
        T0 + ANIM_DUR + 50,
      );
    }

    animateLine(divH1Ref.current, 500, T0 + 420);
    animateLine(divV1Ref.current, 350, T0 + 620);

    showCell("hero", T0 + 700);
    showCell("lr", T0 + 820);
    showCell("rba", T0 + 920);

    const T1 = T0 + ANIM_DUR + 200;

    const outer2Len = 2 * (wrap2Size.w + wrap2Size.h);
    if (outer2Ref.current) {
      outer2Ref.current.style.transition = "none";
      outer2Ref.current.style.strokeDasharray = String(outer2Len);
      outer2Ref.current.style.strokeDashoffset = String(outer2Len);
      outer2Ref.current.getBoundingClientRect();
      schedule(() => {
        if (!outer2Ref.current) return;
        outer2Ref.current.style.transition = `stroke-dashoffset ${ANIM_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        outer2Ref.current.style.strokeDashoffset = "0";
      }, T1);
      schedule(
        () => {
          if (!outer2Ref.current) return;
          outer2Ref.current.style.transition = "";
          outer2Ref.current.style.strokeDasharray = "";
          outer2Ref.current.style.strokeDashoffset = "";
        },
        T1 + ANIM_DUR + 50,
      );
    }

    animateLine(divV2Ref.current, 400, T1 + 300);
    animateLine(divH2Ref.current, 500, T1 + 450);
    animateLine(divEdu2Ref.current, 400, T1 + 600);

    showCell("early", T1 + 700);
    showCell("logos", T1 + 820);
    showCell("edu", T1 + 940);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive, wrap1Paths, wrap2Paths, wrap1Size, wrap2Size]);

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

  const cellClass = (id: string) =>
    clsx(styles.cell, visibleCells.has(id) && styles.cellVisible);

  const viewBox1 = `0 0 ${wrap1Size.w} ${wrap1Size.h}`;
  const viewBox2 = `0 0 ${wrap2Size.w} ${wrap2Size.h}`;

  return (
    <section className={styles.section}>
      <div ref={scrollRef} className={styles.inner}>
        <h2 className={styles.heading}>experience</h2>

        <div className={styles.tableWrapper}>
          <div ref={wrap1Ref} className={styles.gridWrapper}>
            <svg
              className={styles.gridLines}
              viewBox={viewBox1}
              width={wrap1Size.w}
              height={wrap1Size.h}
            >
              {wrap1Paths && (
                <>
                  <path
                    ref={outer1Ref}
                    className={styles.gridLine}
                    d={wrap1Paths.outer}
                  />
                  <path
                    ref={divH1Ref}
                    className={styles.gridLine}
                    d={wrap1Paths.divH}
                  />
                  <path
                    ref={divV1Ref}
                    className={styles.gridLine}
                    d={wrap1Paths.divV}
                  />
                </>
              )}
            </svg>

            <div className={styles.expGrid}>
              <div
                ref={heroRef}
                className={clsx(cellClass("hero"), styles.hero)}
              >
                <Image
                  className={styles.heroLogo}
                  src={CURRENT_JOB.logo}
                  alt={`${CURRENT_JOB.company} logo`}
                  width={100}
                  height={100}
                />
                <div className={styles.textWrapper}>
                  <div className={styles.heroTitleRow}>
                    <p className={styles.heroTitle}>{CURRENT_JOB.title}</p>
                    <p className={styles.heroMeta}>{CURRENT_JOB.company}</p>
                  </div>
                  <p className={styles.heroMeta}>
                    {`${CURRENT_JOB.location}\n${CURRENT_JOB.dates}`}
                  </p>
                </div>
              </div>

              <div className={styles.subRow}>
                {PRIOR_JOBS.map((job) => (
                  <div
                    key={job.id}
                    ref={job.id === "lr" ? lrRef : rbaRef}
                    className={clsx(cellClass(job.id), styles.subCell)}
                  >
                    <Image
                      className={styles.subLogo}
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={40}
                      height={40}
                    />
                    <div className={styles.textWrapper}>
                      <p className={styles.subTitle}>{job.title}</p>
                      <p className={styles.subMeta}>{job.company}</p>
                      <p
                        className={styles.subMeta}
                      >{`${job.location}\n${job.dates}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={wrap2Ref} className={styles.gridWrapper}>
            <svg
              className={styles.gridLines}
              viewBox={viewBox2}
              width={wrap2Size.w}
              height={wrap2Size.h}
            >
              {wrap2Paths && (
                <>
                  <path
                    ref={outer2Ref}
                    className={styles.gridLine}
                    d={wrap2Paths.outer}
                  />
                  <path
                    ref={divH2Ref}
                    className={styles.gridLine}
                    d={wrap2Paths.divH}
                  />
                  <path
                    ref={divV2Ref}
                    className={styles.gridLine}
                    d={wrap2Paths.divV}
                  />
                  <path
                    ref={divEdu2Ref}
                    className={styles.gridLine}
                    d={wrap2Paths.divEdu}
                  />
                </>
              )}
            </svg>

            <div className={styles.expGrid}>
              <div className={styles.earlyRow}>
                <h3
                  ref={earlyRef}
                  className={clsx(
                    cellClass("early"),
                    styles.earlyLabel,
                    styles.accentSectionHeading,
                  )}
                >
                  early career
                </h3>
                <div
                  ref={logosRef}
                  className={clsx(cellClass("logos"), styles.earlyLogos)}
                >
                  {EARLY_JOBS.map((job) => (
                    <div key={job.year} className={styles.detailItem}>
                      <Image
                        className={styles.earlyLogo}
                        src={job.logo}
                        alt={`${job.company} logo`}
                        width={36}
                        height={36}
                      />
                      <p className={styles.serifDetailTitle}>{job.role}</p>
                      <p className={styles.sansDetailSubtext}>
                        {`${job.company}\n${job.year}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                ref={eduRef}
                className={clsx(cellClass("edu"), styles.eduRow)}
              >
                <h3 ref={eduHeadingRef} className={styles.accentSectionHeading}>
                  education
                </h3>
                {EDUCATION.map(({ degree, school }) => (
                  <div key={degree} className={styles.eduDetail}>
                    <p className={styles.serifDetailTitle}>{degree}</p>
                    <p className={styles.sansDetailSubtext}>{school}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

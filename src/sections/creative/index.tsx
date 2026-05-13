"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import Blurb from "./Blurb";
import Slide from "./Slide";
import Starmap from "@/demos/starmap/Starmap";
import styles from "./index.module.css";

const BLURB_ACCENT_VERTICAL_OUTSET = 2;

export default function Creative() {
  const [active, setActive] = useState(0);
  const animating = useRef(false);
  const userInteracted = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blurbsRef = useRef<HTMLDivElement | null>(null);
  const blurbBodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blurbAccentRef = useRef<HTMLDivElement | null>(null);
  const blurbAccentReady = useRef(false);

  const syncBlurbAccent = useCallback(
    (animate: boolean) => {
      const container = blurbsRef.current;
      const accent = blurbAccentRef.current;
      const body = blurbBodyRefs.current[active];
      if (!container || !accent || !body) return;

      const cr = container.getBoundingClientRect();
      const br = body.getBoundingClientRect();
      const top =
        br.top - cr.top + container.scrollTop - BLURB_ACCENT_VERTICAL_OUTSET;
      const left = br.left - cr.left + container.scrollLeft;
      const height = br.height + BLURB_ACCENT_VERTICAL_OUTSET * 2;

      if (!blurbAccentReady.current) {
        gsap.set(accent, { top, left, height });
        blurbAccentReady.current = true;
        return;
      }

      if (animate) {
        gsap.to(accent, {
          top,
          left,
          height,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.set(accent, { top, left, height });
      }
    },
    [active],
  );

  useLayoutEffect(() => {
    syncBlurbAccent(true);
  }, [syncBlurbAccent]);

  useEffect(() => {
    const container = blurbsRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      syncBlurbAccent(false);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [syncBlurbAccent]);

  const goTo = useCallback(
    (next: number) => {
      if (animating.current || next === active) return;
      animating.current = true;

      const prev = active;
      const dir = next > prev ? 1 : -1;
      setActive(next);

      gsap.set(slideRefs.current[next], {
        y: dir > 0 ? "100%" : "-100%",
        zIndex: 2,
      });

      gsap
        .timeline({
          onComplete: () => {
            animating.current = false;
          },
        })
        .to(
          slideRefs.current[prev],
          { y: dir > 0 ? "-100%" : "100%", duration: 0.5, ease: "power2.out" },
          0,
        )
        .to(
          slideRefs.current[next],
          { y: "0%", duration: 0.5, ease: "power2.out" },
          0,
        );
    },
    [active],
  );

  useEffect(() => {
    if (userInteracted.current) return;
    const t = setTimeout(() => goTo((active + 1) % BLURBS.length), 4000);
    return () => clearTimeout(t);
  }, [active, goTo]);

  return (
    <section className={styles.section}>
      <div className={styles.divider}>
        <hr />
        <h6>CREATIVE</h6>
      </div>
      <div className={styles.content}>
        <div className={styles.media}>
          {BLURBS.map((blurb, i) => (
            <Slide
              key={blurb.title}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              src={blurb.image}
              alt={blurb.title}
              initial={i === 0}
              playing={i === active}
            />
          ))}
        </div>

        <div className={styles.article}>
          <div ref={blurbsRef} className={styles.blurbs}>
            <div
              ref={blurbAccentRef}
              className={styles.blurbAccent}
              aria-hidden
            />
            {BLURBS.map((blurb, i) => (
              <Blurb
                key={blurb.title}
                index={i + 1}
                title={blurb.title}
                description={blurb.description}
                skills={blurb.skills}
                linkProps={blurb.linkProps}
                active={i === active}
                bodyRef={(el) => {
                  blurbBodyRefs.current[i] = el;
                }}
                onClick={() => {
                  userInteracted.current = true;
                  goTo(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const BLURBS = [
  // {
  //   title: "GSAP motion",
  //   description:
  //     "Physics-based easing, staggered sequences, squash & stretch – exploring what the browser feels like as a stage. Each sketch started as a question about timing.",
  //   skills: "GSAP · CANVAS · EASING · PHYSICS",
  //   image: "/featured/lr-buttons.png",
  // },
  {
    title: "custom SVGs & CSS animations",
    description:
      "Pixel-faithful SVG recreation of the Animal Crossing Nookphone. Every button, hand drawn and animated in pure CSS. Built because it seemed fun, which is the best reason. (WIP)",
    skills: "SVG · CSS ANIMATION · ANIMAL CROSSING",
    linkProps: {
      children: "/nook-phone",
      href: "/nook-phone",
    },
    image: "/creative/creative-nook.mp4",
  },
  {
    title: "interactive celestial map",
    description:
      "A celestial map that allows you to explore the stars and constellations in the night sky.",
    skills: "D3.JS · CANVAS · GEOMETRIC PROJECTIONS",
    image: Starmap,
  },
  {
    title: "dark & light glassmorphism theming",
    description:
      "The GitHub issues tracker reimagined in frosted glass. An exercise in layered transparency & making utility UI feel tactile.",
    skills: "API · GLASSMORPHISM · CSS THEMING",
    linkProps: {
      children: "/react-issues",
      href: "/react-issues",
    },
    image: "/creative/creative-github.mp4",
  },
];

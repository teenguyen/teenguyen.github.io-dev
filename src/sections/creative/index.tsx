"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Blurb from "./Blurb";
import Slide from "./Slide";
import { useActiveSlideIndex, useSlideIndex } from "../SectionSlider";
import styles from "./index.module.css";
import Starmap from "@/demos/starmap/Starmap";

export default function Creative() {
  const sectionIndex = useSlideIndex();
  const activeSection = useActiveSlideIndex();
  const isActive = sectionIndex === activeSection;

  const [active, setActive] = useState(0);
  const animating = useRef(false);
  const userInteracted = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    if (!isActive) return;
    userInteracted.current = false;
    animating.current = false;
    queueMicrotask(() => setActive(0));
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.set(el, {
        y: i === 0 ? "0%" : "100%",
        zIndex: i === 0 ? 1 : 0,
      });
    });
  }, [isActive]);

  useEffect(() => {
    if (!isActive || userInteracted.current) return;
    const t = setTimeout(() => goTo((active + 1) % BLURBS.length), 4000);
    return () => clearTimeout(t);
  }, [isActive, active, goTo]);

  return (
    <section className={styles.section}>
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
              playing={isActive && i === active}
            />
          ))}
        </div>

        <div className={styles.article}>
          <h2 className={styles.heading}>creative</h2>

          <div className={styles.blurbs}>
            {BLURBS.map((blurb, i) => (
              <Blurb
                key={blurb.title}
                index={i + 1}
                title={blurb.title}
                description={blurb.description}
                skills={blurb.skills}
                linkProps={blurb.linkProps}
                active={i === active}
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
  {
    title: "GSAP motion",
    description:
      "Physics-based easing, staggered sequences, squash & stretch – exploring what the browser feels like as a stage. Each sketch started as a question about timing.",
    skills: "GSAP · CANVAS · EASING · PHYSICS",
    image: "/featured/lr-buttons.png",
  },
  {
    title: "custom SVGs & CSS animations",
    description:
      "Pixel-faithful SVG recreation of the Animal Crossing Nookphone. Every button, hand drawn and animated in pure CSS. Built because it seemed fun, which is the best reason. (WIP)",
    skills: "SVG · CSS ANIMATION · ANIMAL CROSSING",
    linkProps: {
      children: "HERO",
      href: "/creative/nookphone",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    image: "/featured/lr-buttons.png",
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
      children: "HERO",
      href: "/creative/github-issues",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    image: "/creative/creative-github.mp4",
  },
];

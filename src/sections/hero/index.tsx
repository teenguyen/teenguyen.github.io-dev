"use client";

import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Starmap from "@/demos/starmap/Starmap";
import HeroAnimatedLogo, {
  addHeroLogoRevealToTimeline,
  prepareHeroLogoReveal,
} from "@/components/HeroAnimatedLogo";
import Socials, {
  addSocialsStaggerRevealToTimeline,
  prepareSocialsReveal,
  SOCIALS_STAGGER_REVEAL_OVERLAP,
} from "@/components/Socials";
import styles from "./index.module.css";

const PARALLAX_STARMAP_SPEED = 0.75;
const PARALLAX_CONTENT_SPEED = 0.1;
const TIMELINE_START = 0;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const socialsRef = useRef<HTMLElement | null>(null);
  const starmapLayerRef = useRef<HTMLDivElement | null>(null);
  const brandParallaxRef = useRef<HTMLDivElement | null>(null);
  const starmapBottomSentinelRef = useRef<HTMLDivElement | null>(null);

  const [beginCelestialReveal, setBeginCelestialReveal] = useState(false);
  const [parallaxReady, setParallaxReady] = useState(false);
  const [taglinesVisible, setTaglinesVisible] = useState(false);
  /** CSS fade when hero bottom sentinel crosses (same milestone as taglines). */
  const [logoFadeOut, setLogoFadeOut] = useState(false);

  useGSAP(
    () => {
      const svg = logoRef.current;
      const nav = socialsRef.current;
      if (!svg || !nav) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        prepareHeroLogoReveal(svg);
        for (const path of Array.from(svg.querySelectorAll("path"))) {
          gsap.set(path, {
            strokeDashoffset: 0,
            fillOpacity: 1,
            strokeOpacity: 0,
          });
        }
        gsap.set(svg, { opacity: 1 });
        prepareSocialsReveal(nav, false);
        const items = Array.from(nav.querySelectorAll(":scope > ul > li"));
        gsap.set(items, { autoAlpha: 1, y: 0 });
        gsap.set(nav, { y: 0 });
        setBeginCelestialReveal(true);
        setParallaxReady(true);
        return;
      }

      let attempts = 0;

      const buildIntro = () => {
        attempts += 1;
        const logoReady = prepareHeroLogoReveal(svg);
        const socialsReady = prepareSocialsReveal(nav, false);

        if (!logoReady || !socialsReady) {
          if (attempts < 120) {
            gsap.delayedCall(0, buildIntro);
          } else {
            setBeginCelestialReveal(true);
            setParallaxReady(true);
          }
          return;
        }

        gsap.set(svg, { opacity: 1 });
        gsap.set(nav, { y: 0 });

        const introTimeline = gsap.timeline();
        addHeroLogoRevealToTimeline(introTimeline, svg, TIMELINE_START);
        addSocialsStaggerRevealToTimeline(
          introTimeline,
          nav,
          SOCIALS_STAGGER_REVEAL_OVERLAP,
          false,
        );

        introTimeline.eventCallback("onComplete", () => {
          setBeginCelestialReveal(true);
          setParallaxReady(true);
        });
      };

      buildIntro();
    },
    { scope: heroRef },
  );

  useEffect(() => {
    const sentinel = starmapBottomSentinelRef.current;
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const bottomFullyVisible =
          entry.isIntersecting && entry.intersectionRatio >= 1;
        if (bottomFullyVisible) {
          setTaglinesVisible(true);
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setLogoFadeOut(true);
          }
          obs.disconnect();
        }
      },
      { threshold: [0, 1] },
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!parallaxReady) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const starmapEl = starmapLayerRef.current;
    const brandEl = brandParallaxRef.current;
    if (!starmapEl || !brandEl) return;

    let ticking = false;

    const applyScrollFx = () => {
      const y = window.scrollY;
      starmapEl.style.transform = `translate3d(0, ${y * PARALLAX_STARMAP_SPEED}px, 0)`;
      brandEl.style.transform = `translate3d(0, ${y * PARALLAX_CONTENT_SPEED}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyScrollFx);
      }
    };

    applyScrollFx();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", applyScrollFx);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyScrollFx);
    };
  }, [parallaxReady]);

  return (
    <header ref={heroRef} className={styles.hero}>
      <Starmap
        rootRef={starmapLayerRef}
        className={styles.parallaxLayer}
        beginCelestialReveal={beginCelestialReveal}
      />
      <div className={styles.content}>
        <div
          ref={brandParallaxRef}
          className={clsx(styles.parallaxLayer, styles.titleContainer)}
        >
          <div className={styles.logoAndSocials}>
            <HeroAnimatedLogo
              ref={logoRef}
              className={clsx(styles.logo, logoFadeOut && styles.logoFadeOut)}
            />
            <Socials ref={socialsRef} />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          styles.taglinesRail,
          taglinesVisible && styles.taglinesRailVisible,
        )}
      >
        <div className={styles.taglines}>
          <p className={styles.tagTextTop}>
            I build the parts of products people{" "}
            <span className={styles.tagTextItalics}>actually</span>{" "}
            <span className={styles.tagTextTheme}>touch–</span>
          </p>
          <p className={styles.tagTextBottom}>
            motion, rhythm, and the details most never notice, but always{" "}
            <span className={styles.tagTextThemeLight}>feel</span>
          </p>
        </div>
      </div>
      <div
        ref={starmapBottomSentinelRef}
        className={styles.starmapBottomSentinel}
        aria-hidden
      />
    </header>
  );
}

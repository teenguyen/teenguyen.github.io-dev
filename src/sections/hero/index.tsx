"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Starmap from "../../demos/starmap/Starmap";
import {
  useSliderApi,
  useSlideIndex,
  type WheelInterceptor,
} from "../SectionSlider";
import ScreenOne from "./ScreenOne";
import ScreenTwo from "./ScreenTwo";
import styles from "./index.module.css";

const SMALL_VIEWPORT_MAX_WIDTH = 768;
const SHORT_VIEWPORT_MAX_HEIGHT = 720;
const SOCIALS_TOP_INSET_SMALL = 32;
const SOCIALS_TOP_INSET_LARGE = 64;
const INITIAL_Y = 16;
const SOCIAL_ICONS_PEAK_Y = -4;
const LOGO_PATH_DELAY_STEP = 0.1;
const LOGO_DRAW_DURATION = 0.5;
const LOGO_FILL = 0.3;
const LOGO_STROKE_WIDTH = 1;
const LOGO_STROKE_DASH_OFFSET_EPSILON = 0.5;
const SOCIALS_REVEAL_DURATION = 0.4;
const SOCIALS_SETTLE_DURATION = 0.25;
const SOCIALS_STAGGER = 0.08;
const SOCIALS_REVEAL_OVERLAP = "-=0.5";
const SOCIALS_SETTLE_OFFSET = ">-0.1";
const TAGLINE_REVEAL_DURATION = 0.8;
const HERO_FADE_DURATION = 0.35;
const SOCIALS_AND_STARMAP_SCROLL_DURATION = 1;
const TAGLINE_LINE_ONE_START = 1;
const TAGLINE_LINE_TWO_START = 1.24;
const TIMELINE_START = 0;
const SCREEN_TWO_INITIAL_Y = 24;
const SCREEN_TWO_REVEAL_DURATION = 0.45;
export default function Hero() {
  const sliderApi = useSliderApi();
  const slideIndex = useSlideIndex();
  const [beginCelestialReveal, setBeginCelestialReveal] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const screenOneRef = useRef<HTMLDivElement | null>(null);
  const screenTwoRef = useRef<HTMLDivElement | null>(null);
  const starmapWrapRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const lineOneRef = useRef<HTMLParagraphElement | null>(null);
  const lineTwoRef = useRef<HTMLParagraphElement | null>(null);
  const phase2TimelineRef = useRef<gsap.core.Timeline | null>(null);
  const phase1DoneRef = useRef(false);

  useGSAP(
    () => {
      if (
        !rootRef.current ||
        !stageRef.current ||
        !screenOneRef.current ||
        !screenTwoRef.current ||
        !starmapWrapRef.current ||
        !logoWrapRef.current ||
        !socialsRef.current ||
        !lineOneRef.current ||
        !lineTwoRef.current
      ) {
        return;
      }

      gsap.set([lineOneRef.current, lineTwoRef.current], {
        opacity: 0,
        y: INITIAL_Y,
      });

      gsap.set(logoWrapRef.current, { opacity: 1 });
      gsap.set(socialsRef.current, { y: 0 });
      gsap.set(starmapWrapRef.current, { y: 0 });
      gsap.set(screenOneRef.current, { autoAlpha: 1 });
      gsap.set(screenTwoRef.current, {
        autoAlpha: 0,
        y: SCREEN_TWO_INITIAL_Y,
      });

      const logoPaths = Array.from(
        logoRef.current?.querySelectorAll("path") ?? [],
      );
      const socialIcons = Array.from(
        socialsRef.current?.querySelectorAll("svg") ?? [],
      );
      const introTimeline = gsap.timeline();

      logoPaths.forEach((path, i) => {
        const length = path.getTotalLength();
        const pathDelay = i * LOGO_PATH_DELAY_STEP;
        const drawDuration = LOGO_DRAW_DURATION;
        const fillStart = LOGO_FILL;
        const fillDuration = LOGO_FILL;

        gsap.set(path, {
          stroke: "var(--theme-color)",
          strokeWidth: LOGO_STROKE_WIDTH,
          strokeDasharray: length,
          strokeDashoffset: length + LOGO_STROKE_DASH_OFFSET_EPSILON,
          fillOpacity: 0,
          strokeOpacity: 1,
        });

        introTimeline
          .to(
            path,
            {
              strokeDashoffset: 0,
              duration: drawDuration,
              ease: "sine.inOut",
            },
            pathDelay,
          )
          .to(
            path,
            {
              fillOpacity: 1,
              strokeOpacity: 0,
              duration: fillDuration,
              ease: "power1.inOut",
            },
            pathDelay + fillStart,
          );
      });

      gsap.set(socialIcons, { opacity: 0, y: INITIAL_Y });

      introTimeline
        .to(
          socialIcons,
          {
            opacity: 1,
            y: SOCIAL_ICONS_PEAK_Y,
            duration: SOCIALS_REVEAL_DURATION,
            ease: "none",
            stagger: SOCIALS_STAGGER,
          },
          SOCIALS_REVEAL_OVERLAP,
        )
        .to(
          socialIcons,
          {
            y: 0,
            duration: SOCIALS_SETTLE_DURATION,
            ease: "power2.inOut",
            stagger: SOCIALS_STAGGER,
          },
          SOCIALS_SETTLE_OFFSET,
        );
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.inOut",
        },
      });
      const revealTagLine = {
        opacity: 1,
        y: 0,
        duration: TAGLINE_REVEAL_DURATION,
        ease: "power2.out",
      } as const;

      const socialsTargetTopPx = () => {
        const shortViewport =
          window.innerHeight <= SHORT_VIEWPORT_MAX_HEIGHT ||
          window.innerWidth <= SMALL_VIEWPORT_MAX_WIDTH;
        return shortViewport
          ? SOCIALS_TOP_INSET_SMALL
          : SOCIALS_TOP_INSET_LARGE;
      };

      const socialsScrollY = () => {
        const socialsEl = socialsRef.current!;
        const socialsRect = socialsEl.getBoundingClientRect();
        const currentY = Number(gsap.getProperty(socialsEl, "y")) || 0;
        // getBoundingClientRect() includes transforms; remove current translateY
        // so we always compute from the element's base layout position.
        const baseTop = socialsRect.top - currentY;
        return socialsTargetTopPx() - baseTop;
      };

      timeline
        .to(
          logoWrapRef.current,
          {
            opacity: 0,
            duration: HERO_FADE_DURATION,
          },
          TIMELINE_START,
        )
        .to(
          [socialsRef.current, starmapWrapRef.current],
          {
            y: socialsScrollY,
            duration: SOCIALS_AND_STARMAP_SCROLL_DURATION,
          },
          TIMELINE_START,
        )
        .to(
          screenOneRef.current,
          {
            autoAlpha: 0,
            duration: HERO_FADE_DURATION,
          },
          0.22,
        )
        .to(
          screenTwoRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: SCREEN_TWO_REVEAL_DURATION,
          },
          0.48,
        )
        .to(lineOneRef.current, revealTagLine, TAGLINE_LINE_ONE_START)
        .to(lineTwoRef.current, revealTagLine, TAGLINE_LINE_TWO_START);

      phase2TimelineRef.current = timeline;

      introTimeline.eventCallback("onComplete", () => {
        setBeginCelestialReveal(true);
        phase1DoneRef.current = true;
      });
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!sliderApi) return;

    const interceptor: WheelInterceptor = (direction) => {
      const tl = phase2TimelineRef.current;
      if (!tl) return false;
      if (!phase1DoneRef.current) return true;

      const progress = tl.progress();

      if (direction === 1) {
        if (progress < 1) {
          tl.play();
          return true;
        }
        return false;
      }

      if (progress > 0) {
        tl.reverse();
        return true;
      }
      return false;
    };

    sliderApi.setInterceptor(slideIndex, interceptor);
    return () => sliderApi.setInterceptor(slideIndex, null);
  }, [sliderApi, slideIndex]);

  return (
    <section ref={rootRef} className={styles.hero}>
      <div ref={stageRef} className={styles.stage}>
        <div ref={starmapWrapRef} className={styles.starmapBackground}>
          <Starmap
            className={styles.starmapFill}
            beginCelestialReveal={beginCelestialReveal}
          />
          <div className={styles.starmapFade} aria-hidden />
        </div>
        <ScreenOne
          screenOneRef={screenOneRef}
          logoWrapRef={logoWrapRef}
          logoRef={logoRef}
          socialsRef={socialsRef}
        />
        <ScreenTwo
          screenTwoRef={screenTwoRef}
          lineOneRef={lineOneRef}
          lineTwoRef={lineTwoRef}
        />
      </div>
    </section>
  );
}

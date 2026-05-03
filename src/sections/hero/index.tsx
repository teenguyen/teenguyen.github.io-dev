"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Starmap from "../../demos/starmap/Starmap";
import { SECTION_LAYOUT_BREAKPOINT_PX_DEFAULT_ROOT } from "../consts";
import {
  useSliderApi,
  useSlideIndex,
  type WheelInterceptor,
} from "../SectionSlider";
import { addHeroLogoRevealToTimeline } from "./HeroAnimatedLogo";
import {
  addSocialsStaggerRevealToTimeline,
  SOCIALS_STAGGER_REVEAL_OVERLAP,
} from "./Socials";
import ScreenOne from "./ScreenOne";
import ScreenTwo from "./ScreenTwo";
import styles from "./index.module.css";

const SHORT_VIEWPORT_MAX_HEIGHT = 720;
const SOCIALS_TOP_INSET_SMALL = 32;
const SOCIALS_TOP_INSET_LARGE = 64;
const INITIAL_Y = 16;
const HERO_FADE_DURATION = 0.35;
const SOCIALS_AND_STARMAP_SCROLL_DURATION = 1;
const TAGLINE_LINE_ONE_START = 1;
const TAGLINE_LINE_TWO_START = 1.24;
const TIMELINE_START = 0;
const LOGO_ANIMATION_START = TIMELINE_START;
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
  const logoRef = useRef<SVGSVGElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const lineOneRef = useRef<HTMLParagraphElement | null>(null);
  const lineTwoRef = useRef<HTMLParagraphElement | null>(null);
  const phase2TimelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (
        !rootRef.current ||
        !stageRef.current ||
        !screenOneRef.current ||
        !screenTwoRef.current ||
        !starmapWrapRef.current ||
        !logoRef.current ||
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

      gsap.set(logoRef.current, { opacity: 1 });
      gsap.set(socialsRef.current, { y: 0 });
      gsap.set(starmapWrapRef.current, { y: 0 });
      gsap.set(screenOneRef.current, { autoAlpha: 1 });
      gsap.set(screenTwoRef.current, {
        autoAlpha: 0,
        y: SCREEN_TWO_INITIAL_Y,
      });

      const socialsNav =
        socialsRef.current?.querySelector<HTMLElement>("nav") ?? null;

      const introTimeline = gsap.timeline();

      addHeroLogoRevealToTimeline(
        introTimeline,
        logoRef.current,
        LOGO_ANIMATION_START,
      );

      if (socialsNav) {
        addSocialsStaggerRevealToTimeline(
          introTimeline,
          socialsNav,
          SOCIALS_STAGGER_REVEAL_OVERLAP,
          false,
        );
      }
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.inOut",
        },
      });
      const revealTagLine = {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      } as const;

      const socialsTargetTopPx = () => {
        const shortViewport =
          window.innerHeight <= SHORT_VIEWPORT_MAX_HEIGHT ||
          window.innerWidth <= SECTION_LAYOUT_BREAKPOINT_PX_DEFAULT_ROOT;
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
          logoRef.current,
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
      });
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!sliderApi) return;

    const interceptor: WheelInterceptor = (direction, _event) => {
      const tl = phase2TimelineRef.current;
      if (!tl) return false;

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

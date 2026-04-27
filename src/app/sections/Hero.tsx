"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Codepen, GitHub, Linkedin, Mail } from "react-feather";
import HeroLogo from "./HeroLogo";
import Starmap from "../demos/starmap/Starmap";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const SMALL_VIEWPORT_MAX_WIDTH = 768;
const SHORT_VIEWPORT_MAX_HEIGHT = 720;
const SOCIALS_TOP_INSET_SMALL = 32;
const SOCIALS_TOP_INSET_LARGE = 64;
const SOCIAL_ICON_PROPS = {
  size: "2.5rem",
  strokeWidth: 1,
  color: "var(--theme-color)",
} as const;

const SOCIAL_LINKS = [
  { href: "https://codepen.io/teenguyen", Icon: Codepen, label: "Codepen" },
  { href: "https://github.com/teenguyen", Icon: GitHub, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/theresaanguyen/",
    Icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:tee.nguyen+portfolio@live.com.au",
    Icon: Mail,
    label: "Email",
  },
] as const;

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const starmapWrapRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const lineOneRef = useRef<HTMLParagraphElement | null>(null);
  const lineTwoRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      if (
        !rootRef.current ||
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
        y: 16,
      });

      gsap.set(logoWrapRef.current, { opacity: 1 });
      gsap.set(socialsRef.current, { y: 0 });
      gsap.set(starmapWrapRef.current, { y: 0 });

      const logoPaths = Array.from(
        logoRef.current?.querySelectorAll("path") ?? [],
      );
      const socialIcons = Array.from(
        socialsRef.current?.querySelectorAll("svg") ?? [],
      );
      const introTimeline = gsap.timeline();

      logoPaths.forEach((path, i) => {
        const length = path.getTotalLength();
        const pathDelay = i * 0.14;
        const drawDuration = 0.8;
        const fillStart = 0.3;
        const fillDuration = 0.4;

        gsap.set(path, {
          stroke: "var(--theme-color)",
          strokeWidth: 1,
          strokeDasharray: length,
          strokeDashoffset: length + 0.5,
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

      gsap.set(socialIcons, { opacity: 0, y: 16 });

      introTimeline
        .to(
          socialIcons,
          {
            opacity: 1,
            y: -4,
            duration: 0.4,
            ease: "none",
            stagger: 0.08,
          },
          "-=0.5",
        )
        .to(
          socialIcons,
          {
            y: 0,
            duration: 0.26,
            ease: "power2.inOut",
            stagger: 0.08,
          },
          ">-0.1",
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
        duration: 0.35,
        ease: "power2.out",
      } as const;

      /** 4rem from viewport top on roomy layouts; 2rem when short or narrow (matches Hero CSS). */
      const socialsTargetTopPx = () => {
        const shortViewport =
          window.innerHeight <= SHORT_VIEWPORT_MAX_HEIGHT ||
          window.innerWidth <= SMALL_VIEWPORT_MAX_WIDTH;
        return shortViewport ? SOCIALS_TOP_INSET_SMALL : SOCIALS_TOP_INSET_LARGE;
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
            duration: 0.35,
          },
          0,
        )
        .to(
          [socialsRef.current, starmapWrapRef.current],
          {
            y: socialsScrollY,
            duration: 0.95,
          },
          0,
        )
        .to(
          lineOneRef.current,
          revealTagLine,
          0.42,
        )
        .to(
          lineTwoRef.current,
          revealTagLine,
          0.72,
        );

      const syncTimelineToScroll = (progress: number) => {
        // Keep visual state deterministic after ScrollTrigger refresh/resize.
        if (progress <= 0.01) {
          timeline.pause(0);
          return;
        }
        if (progress >= 0.99) {
          timeline.pause(1);
          return;
        }
        timeline.pause(progress);
      };

      ScrollTrigger.create({
        trigger: rootRef.current,
        pin: rootRef.current,
        start: "top top",
        end: "+=10%",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          timeline.invalidate();
          syncTimelineToScroll(self.progress);
        },
        onUpdate: (self) => {
          if (
            self.direction === 1 &&
            self.progress > 0.01 &&
            timeline.progress() < 0.99
          ) {
            timeline.play();
          }

          if (
            self.direction === -1 &&
            self.progress < 0.99 &&
            timeline.progress() > 0.01
          ) {
            timeline.reverse();
          }
        },
        onLeaveBack: () => {
          timeline.pause(0);
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.hero}>
      <div ref={starmapWrapRef} className={styles.starmapBackground}>
        <Starmap className={styles.starmapFill} />
        <div className={styles.starmapFade} aria-hidden />
      </div>
      <header className={styles.header}>
        <div ref={logoWrapRef} className={styles.logoWrap}>
          <HeroLogo ref={logoRef} className={styles.logo} />
        </div>
        <div ref={socialsRef} className={styles.socials}>
          {SOCIAL_LINKS.map(({ href, Icon, label }) => {
            const isExternal = href.startsWith("http");
            return (
              <a
                key={href}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={label}
              >
                <Icon {...SOCIAL_ICON_PROPS} />
              </a>
            );
          })}
        </div>
      </header>

      <div className={styles.tagText}>
        <p ref={lineOneRef} className={styles.tagTextTop}>
          I build the parts of products people{" "}
          <span className={styles.tagTextItalics}>actually</span>{" "}
          <span className={styles.tagTextTheme}>touch–</span>
        </p>
        <p ref={lineTwoRef} className={styles.tagTextBottom}>
          motion, rhythm, and the details most never notice, but always{" "}
          <span className={styles.tagTextThemeLight}>feel</span>
        </p>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Codepen, GitHub, Linkedin, Mail } from "react-feather";
import HeroLogo from "./HeroLogo";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const lineOneRef = useRef<HTMLParagraphElement | null>(null);
  const lineTwoRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      if (
        !rootRef.current ||
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
          socialsRef.current,
          {
            y: () => {
              const socialsRect = socialsRef.current!.getBoundingClientRect();
              const targetTop = window.innerWidth <= 1024 ? 32 : 64;
              return targetTop - socialsRect.top;
            },
            duration: 0.95,
          },
          0,
        )
        .to(
          lineOneRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0.42,
        )
        .to(
          lineTwoRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0.72,
        );

      ScrollTrigger.create({
        trigger: rootRef.current,
        pin: rootRef.current,
        start: "top top",
        end: "+=10%",
        anticipatePin: 1,
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
      <header className={styles.header}>
        <div ref={logoWrapRef} className={styles.logoWrap}>
          <HeroLogo ref={logoRef} className={styles.logo} />
        </div>
        <div ref={socialsRef} className={styles.socials}>
          <a
            href="https://codepen.io/teenguyen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Codepen size="2.5rem" strokeWidth={1} color="var(--theme-color)" />
          </a>
          <a
            href="https://github.com/teenguyen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub size="2.5rem" strokeWidth={1} color="var(--theme-color)" />
          </a>
          <a
            href="https://www.linkedin.com/in/theresaanguyen/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin
              size="2.5rem"
              strokeWidth={1}
              color="var(--theme-color)"
            />
          </a>
          <a href="mailto:tee.nguyen+portfolio@live.com.au">
            <Mail size="2.5rem" strokeWidth={1} color="var(--theme-color)" />
          </a>
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

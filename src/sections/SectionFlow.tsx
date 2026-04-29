"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SNAP_SCROLL_DURATION = 1;

type SectionFlowProps = {
  children: ReactNode;
};

export default function SectionFlow({ children }: SectionFlowProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const sections = gsap.utils.toArray<HTMLElement>(
        ":scope > section",
        root,
      );

      let activeTween: gsap.core.Tween | null = null;
      let activeTarget: HTMLElement | null = null;

      const snapToSection = (section: HTMLElement) => {
        const targetY = section.getBoundingClientRect().top + window.scrollY;
        const distanceToTarget = Math.abs(window.scrollY - targetY);
        if (distanceToTarget < 2) {
          activeTarget = null;
          return;
        }
        if (activeTarget === section && activeTween) return;

        activeTarget = section;
        activeTween?.kill();
        activeTween = gsap.to(window, {
          duration: SNAP_SCROLL_DURATION,
          ease: "power2.out",
          overwrite: true,
          scrollTo: { y: section, autoKill: false },
          onComplete: () => {
            activeTween = null;
            activeTarget = null;
          },
          onInterrupt: () => {
            activeTween = null;
            activeTarget = null;
          },
        });
      };

      sections.forEach((section, index) => {
        if (index === 0) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            if (activeTarget && activeTarget !== section) return;
            snapToSection(section);
          },
          onEnterBack: () => {
            if (activeTarget && activeTarget !== section) return;
            snapToSection(section);
          },
        });
      });
    },
    { scope: rootRef },
  );

  return <main ref={rootRef}>{children}</main>;
}

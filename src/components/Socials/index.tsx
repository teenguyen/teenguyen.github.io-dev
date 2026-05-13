"use client";

import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";
import { Codepen, GitHub, Linkedin, Mail } from "react-feather";
import gsap from "gsap";
import styles from "./index.module.css";

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/in/theresaanguyen/",
    Icon: Linkedin,
    label: "LinkedIn",
    detail: "linkedin.com/in/theresaanguyen",
  },
  {
    href: "mailto:tee.nguyen+portfolio@live.com.au",
    Icon: Mail,
    label: "Email",
    detail: "tee.nguyen+portfolio@live.com.au",
  },
  {
    href: "https://github.com/teenguyen",
    Icon: GitHub,
    label: "GitHub",
    detail: "github.com/teenguyen",
  },
  {
    href: "https://codepen.io/teenguyen",
    Icon: Codepen,
    label: "Codepen",
    detail: "codepen.io/teenguyen",
  },
] as const;

export const SOCIALS_COL_REVEAL_DURATION = 0.5;
export const SOCIALS_STAGGER_STEP = 0.08;
export const SOCIALS_STAGGER_REVEAL_OVERLAP = "-=0.5";

function socialRevealItems(nav: HTMLElement | null): HTMLElement[] {
  return Array.from(nav?.querySelectorAll(":scope > ul > li") ?? []);
}

/**
 * Hides each `<li>` until the stagger timeline runs (`autoAlpha` avoids invisible focus traps).
 */
export function prepareSocialsReveal(
  nav: HTMLElement | null,
  vertical: boolean,
): boolean {
  const items = socialRevealItems(nav);
  if (items.length === 0) return false;

  if (vertical) {
    gsap.set(items, { autoAlpha: 0, x: -18 });
  } else {
    gsap.set(items, { autoAlpha: 0, y: 16 });
  }
  return true;
}

/**
 * hero row uses a two-phase **Y** motion with overshoot
 * vertical column uses a single **X** slide plus fade, no bounce
 */
export function addSocialsStaggerRevealToTimeline(
  timeline: gsap.core.Timeline,
  nav: HTMLElement | null,
  position: gsap.Position,
  vertical = false,
): void {
  const items = socialRevealItems(nav);
  if (items.length === 0) return;

  prepareSocialsReveal(nav, vertical);

  if (vertical) {
    timeline.to(
      items,
      {
        autoAlpha: 1,
        x: 0,
        duration: SOCIALS_COL_REVEAL_DURATION,
        ease: "power2.out",
        stagger: SOCIALS_STAGGER_STEP,
      },
      position,
    );
  } else {
    timeline
      .to(
        items,
        {
          autoAlpha: 1,
          y: -4,
          duration: 0.4,
          ease: "none",
          stagger: SOCIALS_STAGGER_STEP,
        },
        position,
      )
      .to(
        items,
        {
          y: 0,
          duration: 0.25,
          ease: "power2.inOut",
          stagger: SOCIALS_STAGGER_STEP,
        },
        ">-0.1",
      );
  }
}

type SocialsProps = {
  vertical?: boolean;
  className?: string;
};

const Socials = forwardRef<HTMLElement, SocialsProps>(function Socials(
  { vertical = false },
  ref,
) {
  const iconBase = {
    strokeWidth: 1.5 as const,
    color: "var(--theme-color)",
  };

  return (
    <nav
      ref={ref}
      className={clsx(vertical && styles.vertical)}
      aria-label="Social links"
    >
      <ul className={styles.list}>
        {SOCIAL_LINKS.map(({ href, Icon, label, detail }) => {
          const isExternal = href.startsWith("http");
          const iconSize = vertical ? "1.5rem" : "2.5rem";

          return (
            <li key={href}>
              <Link
                href={href}
                className={styles.link}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...(vertical ? {} : { "aria-label": label })}
              >
                <Icon {...iconBase} size={iconSize} aria-hidden />
                {vertical ? <p>{detail}</p> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export default Socials;

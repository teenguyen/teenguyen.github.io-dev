import { RefObject } from "react";
import { Codepen, GitHub, Linkedin, Mail } from "react-feather";
import HeroLogo from "./HeroLogo";
import styles from "./Hero.module.css";

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

type HeroScreenOneProps = {
  screenOneRef: RefObject<HTMLDivElement | null>;
  logoWrapRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<SVGSVGElement | null>;
  socialsRef: RefObject<HTMLDivElement | null>;
};

export default function HeroScreenOne({
  screenOneRef,
  logoWrapRef,
  logoRef,
  socialsRef,
}: HeroScreenOneProps) {
  return (
    <>
      <div ref={screenOneRef} className={styles.heroScreenOne}>
        <header className={styles.header}>
          <div ref={logoWrapRef} className={styles.logoWrap}>
            <HeroLogo ref={logoRef} className={styles.logo} />
          </div>
        </header>
      </div>
      <div ref={socialsRef} className={styles.socialsLayer}>
        <div className={styles.socials}>
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
      </div>
    </>
  );
}


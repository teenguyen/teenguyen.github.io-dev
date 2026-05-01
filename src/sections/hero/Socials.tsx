import clsx from "clsx";
import Link from "next/link";
import { Codepen, GitHub, Linkedin, Mail } from "react-feather";
import styles from "./Socials.module.css";

const SOCIAL_LINKS = [
  {
    href: "https://codepen.io/teenguyen",
    Icon: Codepen,
    label: "Codepen",
    detail: "codepen.io/teenguyen",
  },
  {
    href: "https://github.com/teenguyen",
    Icon: GitHub,
    label: "GitHub",
    detail: "github.com/teenguyen",
  },
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
] as const;

type SocialsProps = {
  vertical?: boolean;
  className?: string;
};

export default function Socials({ vertical = false, className }: SocialsProps) {
  const iconBase = {
    strokeWidth: 1.5 as const,
    color: "var(--theme-color)",
  };

  return (
    <nav
      className={clsx(styles.nav, vertical && styles.vertical, className)}
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
}

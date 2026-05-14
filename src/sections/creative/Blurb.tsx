import type { Ref } from "react";
import Link, { type LinkProps } from "next/link";
import clsx from "clsx";
import styles from "./Blurb.module.css";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

type BlurbProps = {
  index: number;
  title: string;
  description: string;
  skills: string;
  linkProps?: LinkProps | string;
  active: boolean;
  onClick: () => void;
  bodyRef?: Ref<HTMLDivElement | null>;
};

export default function Blurb({
  index,
  title,
  description,
  skills,
  linkProps,
  active,
  onClick,
  bodyRef,
}: BlurbProps) {
  const link =
    typeof linkProps === "string"
      ? {
          props: { href: linkProps } as LinkProps,
          external: isExternalHref(linkProps),
        }
      : linkProps
        ? {
            props: linkProps,
            external:
              typeof linkProps.href === "string" &&
              isExternalHref(linkProps.href),
          }
        : null;

  return (
    <button
      className={clsx(styles.blurb, active && styles.blurbActive)}
      onClick={onClick}
      type="button"
    >
      <p className={clsx("subtitle", styles.index)}>
        {index.toString().padStart(2, "0")}
      </p>
      <div ref={bodyRef} className={styles.blurbBody}>
        <h3 className={styles.title}>{title}</h3>
        <p>{description}</p>
        <p className="subtitle">{skills}</p>
        <div>
          {link && (
            <Link
              className="subtitle"
              {...link.props}
              {...(link.external
                ? { target: "_blank" as const, rel: "noopener noreferrer" }
                : {})}
            />
          )}
        </div>
      </div>
    </button>
  );
}

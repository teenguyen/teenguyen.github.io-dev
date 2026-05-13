import type { Ref } from "react";
import Link, { LinkProps } from "next/link";
import clsx from "clsx";
import styles from "./Blurb.module.css";

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
  return (
    <div
      className={clsx(styles.blurb, active && styles.blurbActive)}
      onClick={onClick}
    >
      <p className={clsx("subtitle", styles.index)}>
        {index.toString().padStart(2, "0")}
      </p>
      <div ref={bodyRef} className={styles.blurbBody}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <p className="subtitle">{skills}</p>
        {linkProps && (
          <Link className="subtitle" {...(linkProps as LinkProps)} />
        )}
      </div>
    </div>
  );
}

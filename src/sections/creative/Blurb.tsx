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
};

export default function Blurb({
  index,
  title,
  description,
  skills,
  linkProps,
  active,
  onClick,
}: BlurbProps) {
  return (
    <div
      className={clsx(styles.blurb, active && styles.blurbActive)}
      onClick={onClick}
    >
      <p className={clsx("subtitle", styles.index)}>
        {index.toString().padStart(2, "0")}
      </p>
      <div className={styles.blurbBody}>
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

"use client";

import Link from "next/link";
import { useEffect } from "react";
import clsx from "clsx";
import styles from "./shared.module.css";

type CaseStudyWrapperProps = {
  children: React.ReactNode;
  portfolioHref: string;
};

export default function CaseStudyWrapper({
  children,
  portfolioHref,
}: CaseStudyWrapperProps) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.overscrollBehaviorY = "auto";
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href={portfolioHref} className="subtitle">
          ← PORTFOLIO
        </Link>
        <h6 className={clsx("subtitle", styles.name)}>THERESA NGUYEN</h6>
      </header>
      {children}

      <div className={styles.divider}>
        <h6>FEATURED WORK</h6>
        <hr />
      </div>
    </main>
  );
}

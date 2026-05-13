import Link from "next/link";
import clsx from "clsx";
import styles from "./shared.module.css";

type CaseStudyWrapperProps = {
  children: React.ReactNode;
};

export default function CaseStudyWrapper({ children }: CaseStudyWrapperProps) {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/#featured" className="subtitle">
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

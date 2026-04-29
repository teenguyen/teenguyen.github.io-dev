import Link from "next/link";
import clsx from "clsx";
import styles from "./layout.module.css";

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className="subtitle">
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

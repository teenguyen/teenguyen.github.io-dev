"use client";

import Link from "next/link";
import { useRef } from "react";
import Starmap from "@/demos/starmap/Starmap";
import styles from "./page.module.css";

export default function StarmapView() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <header className={styles.header}>
        <Link href="/#creative" className="subtitle">
          ← PORTFOLIO
        </Link>
        <h6 className="subtitle">THERESA NGUYEN</h6>
      </header>
      <Starmap rootRef={rootRef} playing interactive />
    </>
  );
}

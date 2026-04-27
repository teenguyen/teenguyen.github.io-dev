import { RefObject } from "react";
import styles from "./index.module.css";

type ScreenTwoProps = {
  screenTwoRef: RefObject<HTMLDivElement | null>;
  lineOneRef: RefObject<HTMLParagraphElement | null>;
  lineTwoRef: RefObject<HTMLParagraphElement | null>;
};

export default function ScreenTwo({
  screenTwoRef,
  lineOneRef,
  lineTwoRef,
}: ScreenTwoProps) {
  return (
    <div ref={screenTwoRef} className={styles.heroScreenTwo}>
      <div className={styles.tagText}>
        <p ref={lineOneRef} className={styles.tagTextTop}>
          I build the parts of products people{" "}
          <span className={styles.tagTextItalics}>actually</span>{" "}
          <span className={styles.tagTextTheme}>touch–</span>
        </p>
        <p ref={lineTwoRef} className={styles.tagTextBottom}>
          motion, rhythm, and the details most never notice, but always{" "}
          <span className={styles.tagTextThemeLight}>feel</span>
        </p>
      </div>
    </div>
  );
}

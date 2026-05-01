import { RefObject } from "react";
import HeroLogo from "./Logo";
import Socials from "./Socials";
import styles from "./index.module.css";

type ScreenOneProps = {
  screenOneRef: RefObject<HTMLDivElement | null>;
  logoWrapRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<SVGSVGElement | null>;
  socialsRef: RefObject<HTMLDivElement | null>;
};

export default function ScreenOne({
  screenOneRef,
  logoWrapRef,
  logoRef,
  socialsRef,
}: ScreenOneProps) {
  return (
    <>
      <div ref={screenOneRef} className={styles.heroScreenOne}>
        <header className={styles.header}>
          <div ref={logoWrapRef} className={styles.logoWrap}>
            <HeroLogo ref={logoRef} className={styles.logo} />
          </div>
        </header>
      </div>
      <div className={styles.socialsLayer}>
        <div ref={socialsRef} className={styles.socialsShift}>
          <Socials />
        </div>
      </div>
    </>
  );
}

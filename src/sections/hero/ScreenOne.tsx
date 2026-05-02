import { RefObject } from "react";
import HeroAnimatedLogo from "./HeroAnimatedLogo";
import Socials from "./Socials";
import styles from "./index.module.css";

type ScreenOneProps = {
  screenOneRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<SVGSVGElement | null>;
  socialsRef: RefObject<HTMLDivElement | null>;
};

export default function ScreenOne({
  screenOneRef,
  logoRef,
  socialsRef,
}: ScreenOneProps) {
  return (
    <>
      <div ref={screenOneRef} className={styles.heroScreenOne}>
        <header className={styles.header}>
          <HeroAnimatedLogo ref={logoRef} />
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

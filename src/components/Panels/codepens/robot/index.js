import React, { useEffect } from "react";
import gsap from "gsap";
import { ReactComponent as RobotSvg } from "./robot.svg";
import css from "./index.module.css";

export default function Spaceship() {
  useEffect(() => {
    const animation = {
      duration: 10,
      yoyo: true,
      repeat: -1
    };
    const sway = {
      rotation: [0, 25, -25]
    };

    gsap.to(".wholerobot", {
      ...animation,
      keyframes: {
        x: [0, 75, -75]
      }
    });

    gsap.to(".robot", {
      ...animation,
      transformOrigin: "bottom center",
      transformBox: "fillBox",
      keyframes: sway
    });

    gsap.to(".cog", {
      ...animation,
      transformOrigin: "center",
      transformBox: "fillBox",
      keyframes: {
        rotation: [0, 360, -360]
      }
    });

    gsap.to([".leftForearm", ".rightForearm"], {
      ...animation,
      transformOrigin: "top center",
      transformBox: "fillBox",
      keyframes: sway
    });

    gsap.to(".dialhand", {
      ...animation,
      duration: 0.5,
      transformOrigin: "top left",
      rotation: 600
    });
  }, []);

  return (
    <span className={css.codepen}>
      <RobotSvg />
    </span>
  );
}

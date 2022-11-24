import React, { useEffect } from "react";
import gsap from "gsap";
import { ReactComponent as SpaceshipSvg } from "./spaceship.svg";
import css from "./index.module.css";

export default function Spaceship() {
  useEffect(() => {
    const stars = document.getElementById("stars").children;

    [...stars].forEach(star => {
      gsap
        .fromTo(
          star,
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: gsap.utils.random(1, 3),
            repeat: -1,
            yoyo: true
          }
        )
        .delay(gsap.utils.random(0, 2));
    });

    const tl = gsap.timeline({ repeat: -1 });

    gsap.set(["#ufo", "#beam", "#person"], {
      opacity: 0,
      transformOrigin: "center",
      transformBox: "fillBox"
    });

    tl.fromTo(
      "#ufo",
      {
        x: -500,
        y: -250,
        rotation: 15
      },
      {
        opacity: 1,
        duration: 2,
        x: 0,
        y: 0,
        rotation: 3
      }
    );

    tl.to(
      "#ufo",
      {
        duration: 1.25,
        keyframes: {
          rotation: [3, -3, 3, -3, 0]
        }
      },
      "-=0.75"
    );

    tl.to("#beam", {
      duration: 0.75,
      opacity: 1
    });

    tl.fromTo(
      "#person",
      {
        opacity: 1,
        y: 50
      },
      {
        y: -75,
        duration: 2
      }
    );

    tl.to("#person", { duration: 0, opacity: 0 });

    tl.to("#beam", {
      duration: 0.35,
      opacity: 0
    });

    tl.to("#ufo", {
      duration: 1,
      rotation: 15,
      x: -20,
      y: 10
    });

    tl.to("#ufo", {
      duration: 1,
      x: 200,
      y: -200,
      scale: 0
    });
  }, []);

  return (
    <span className={css.codepen}>
      <SpaceshipSvg />
    </span>
  );
}

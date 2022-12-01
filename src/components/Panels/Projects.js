import React, { useState } from "react";
import /* ChevronsLeft, ChevronsRight */ "react-feather";
import Chip from "./components/Chip";
import SpaceshipPen from "./codepens/spaceship";
import RobotPen from "./codepens/robot";
import motifImg from "../images/proj/motif.png";
import produce48Img from "../images/proj/produce48.png";
import starmapImg from "../images/proj/starmap.png";
import spaceshipImg from "../images/proj/spaceship.png";
import robotImg from "../images/proj/robot.png";
import css from "./Projects.module.css";

export default function Projects({ setPortfolioView }) {
  const motif = {
    label: "motif Component Library",
    shortLabel: "motif",
    img: (
      <img
        src={motifImg}
        alt="screenshot of landing page for the motif component library documentation"
      />
    ),
    desc: (
      <>
        <p>Custom component library for LiveRamp applications and projects.</p>
        <div className={css.chips}>
          <Chip label="React" />
          <Chip label="React Hooks" />
          <Chip label="React Context" />
          <Chip label="Material UI" />
          <Chip label="data tables" />
          <Chip label="JSS" />
          <Chip label="styled components" />
          <Chip label="rollup" />
          <Chip label="ES6+" />
          <Chip label="REST" />
          <Chip label="Atomic Design" />
          <Chip label="Figma" />
        </div>
        <br />
        <a className="textLink" href="https://motif.nexus.liveramp.com/">
          https://motif.nexus.liveramp.com/
        </a>
      </>
    ),
    darkText: true
  };

  const starmap = {
    shortLabel: "star chart",
    label: "d3.js Star Chart",
    img: <img src={starmapImg} alt="screenshot of d3.js star map project" />,
    desc: (
      <>
        <p>Interactive chart to map out stars, galaxies and constellations.</p>
        <div className={css.chips}>
          <Chip label="d3.js" />
          <Chip label="GeoJSON" />
          <Chip label="Promises" />
          <Chip label="vanilla JavaScript" />
        </div>
        <br />
        <button className="textLink" onClick={() => setPortfolioView(false)}>
          Hide the portfolio, show me the star map!
        </button>
      </>
    )
  };

  const produce48 = {
    label: "Produce48 Sorter",
    shortLabel: "produce48 sorter",
    img: (
      <img
        src={produce48Img}
        alt="screenshot of produce48 idol sorter showing girls that will be part of the sort"
      />
    ),
    desc: (
      <>
        <p>
          Produce 48 idol sorter to rank competitors by favourites for the top
          12 places.
        </p>
        <div className={css.chips}>
          <Chip label="React" />
          <Chip label="Redux" />
          <Chip label="React Router" />
          <Chip label="SCSS" />
          <Chip label="ES6+" />
          <Chip label="Sorting Algorithms" />
        </div>
        <br />
        <a
          className="textLink"
          href="https://theresa-nguyen.com/projects/produce48-sorter/index.html"
        >
          https://theresa-nguyen.com/projects/produce48-sorter
        </a>
      </>
    ),
    darkText: true
  };

  const spaceship = {
    label: "GSAP Spaceship",
    shortLabel: "gsap spaceship",
    img: (
      <img
        src={spaceshipImg}
        alt="screenshot of gsap spaceship animation project"
      />
    ),
    desc: (
      <>
        <p>Cassie Evans' GSAP workshop on timeline-based animations</p>
        <div className={css.chips}>
          <Chip label="GSAP" />
          <Chip label="SVG" />
        </div>
        <br />
        <a className="textLink" href="https://codepen.io/teenguyen/pen/dydERQZ">
          codepen
        </a>
      </>
    ),
    codepen: <SpaceshipPen />
  };

  const robot = {
    shortLabel: "gsap robot",
    label: "GSAP Robot",
    img: (
      <img src={robotImg} alt="screenshot of gsap robot animation project" />
    ),
    desc: (
      <>
        <p>Cassie Evans' GSAP workshop on animations</p>
        <div className={css.chips}>
          <Chip label="GSAP" />
          <Chip label="SVG" />
        </div>
        <br />
        <a className="textLink" href="https://codepen.io/teenguyen/pen/vYdwZEm">
          codepen
        </a>
      </>
    ),
    codepen: <RobotPen />
  };

  const projs = { motif, starmap, produce48, spaceship, robot };
  // const MAX_LENGTH = Object.keys(projs).length;
  const [main, setMain] = useState(projs.motif);
  // const [first, setFirst] = useState(0);

  // const shiftLeft = () => {
  //   if (first + 1 > MAX_LENGTH) {
  //     setFirst(0);
  //   } else {
  //     setFirst(first + 1);
  //   }
  // };

  // const shiftRight = () => {
  //   if (first - 1 < 0) {
  //     setFirst(MAX_LENGTH);
  //   } else {
  //     setFirst(first - 1);
  //   }
  // };

  return (
    <div id={css.projs} className="panel">
      <div key={main.label} className={css.mainproj}>
        <div className={css.maindisplay}>
          {main?.codepen ? main.codepen : main.img}
        </div>
        <div>
          <h3>{main.label}</h3>
          {main.desc}
        </div>
      </div>
      <div className={css.carouselProj}>
        {/* <button className={css.arrowButton} onClick={shiftLeft}>
          <ChevronsLeft />
        </button> */}
        {Object.keys(projs).map(label => (
          <button
            className={css.projButton}
            key={label}
            onClick={() => setMain(projs[label])}
          >
            {projs[label].img}
            <h3
              className={projs[label]?.darkText ? css.projButtonDarkText : null}
            >
              {projs[label].shortLabel}
            </h3>
          </button>
        ))}
        {/* <button className={css.arrowButton} onClick={shiftRight}>
          <ChevronsRight />
        </button> */}
      </div>
    </div>
  );
}

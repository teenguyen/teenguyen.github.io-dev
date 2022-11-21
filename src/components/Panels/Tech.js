import React from "react";
import css from "./Tech.module.css";

export default function Tech() {
  return (
    <div id={css.tech} className="panel">
      <span>
        <h3>web</h3>
        <ul>
          <li>HTML5</li>
          <li>CSS3</li>
          <li>DOM</li>
          <li>SVG</li>
        </ul>
      </span>
      <span>
        <h3>javascript</h3>
        <ul>
          <li>React</li>
          <li>Redux</li>
          <li>Hooks</li>
          <li>Typescript</li>
          <li>ES2022</li>
        </ul>
      </span>
      <span>
        <h3>interface libraries</h3>
        <ul>
          <li>Material UI</li>
          <li>Tailwind CSS</li>
          <li>Bootstrap</li>
        </ul>
      </span>
      <span>
        <h3>module bundlers</h3>
        <ul>
          <li>webpack</li>
          <li>rollup</li>
        </ul>
      </span>
      <span>
        <h3>package managers</h3>
        <ul>
          <li>npm</li>
          <li>yarn</li>
        </ul>
      </span>
      <span>
        <h3>testing</h3>
        <ul>
          <li>jest</li>
          <li>browser debugging</li>
        </ul>
      </span>
      <span>
        <h3>web services</h3>
        <ul>
          <li>rest</li>
          <li>ajax</li>
        </ul>
      </span>
      <span>
        <h3>css preprocessors</h3>
        <ul>
          <li>css modules</li>
          <li>styled components</li>
          <li>sass</li>
        </ul>
      </span>
      <span>
        <h3>other libraries</h3>
        <ul>
          <li>d3.js</li>
          <li>gsap</li>
        </ul>
      </span>
    </div>
  );
}

import React from "react";
import { Codepen, GitHub, Linkedin, Send } from "react-feather";
// import { ReactComponent as AvatarWelcome } from "./Avatars/Welcome.svg";
import welcomeImg from "./avatars/welcome.png";
import "./Portfolio.css";

export default function Portfolio() {
  return (
    <div className="portfolio">
      <header>
        <h1>Theresa Nguyen</h1>
        <div>
          <h2>Front End / UX Engineer</h2>
          <h2>Component Library Specialist</h2>
          <div className="contact">
            <a href="https://github.com/teenguyen">
              <GitHub />
            </a>
            <a href="https://codepen.io/ryuuseiistar">
              <Codepen />
            </a>
            <a href="https://linkedin.com/in/theresaanguyen">
              <Linkedin />
            </a>
            <a href="mailto:tee.nguyen+githubpage@live.com.au">
              <Send />
            </a>
          </div>
        </div>
      </header>

      <main>
        <div id="info">
          <span>
            <img src={welcomeImg} alt="animated girl with two cats" />
          </span>
          <p>
            Hi, my name is Theresa and I am a front end / UX engineer; born in
            sunny-side Sydney, now living and working in the cool Bay Area. I'm
            in Silicon Valley chasing aesthetic colour palettes, playful
            designs, and most importantly: beautiful, clean code.
          </p>
        </div>
        <div id="tech">
          <h3>web</h3>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
          <h3>web</h3>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
          <h3>web</h3>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
          <h3>web</h3>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

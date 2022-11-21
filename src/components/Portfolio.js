import React from "react";
import { Codepen, GitHub, Linkedin, Send } from "react-feather";
import welcomeImg from "./images/welcome.png";
import Tech from "./Panels/Tech";
import Exp from "./Panels/Exp";
import MiniProjects from "./Panels/MiniProjects";
import "./Portfolio.css";

export default function Portfolio(props) {
  return (
    <div id="portfolio" {...props}>
      <header>
        <h1>Theresa Nguyen</h1>
        <div>
          <h2>Front End / UX Engineer</h2>
          <div className="contact">
            <a title="Github" href="https://github.com/teenguyen">
              <GitHub />
            </a>
            <a title="Codepen" href="https://codepen.io/ryuuseiistar">
              <Codepen />
            </a>
            <a title="LinkedIn" href="https://linkedin.com/in/theresaanguyen">
              <Linkedin />
            </a>
            <a title="Email" href="mailto:tee.nguyen+githubpage@live.com.au">
              <Send />
            </a>
          </div>
        </div>
      </header>

      <main>
        <div id="info" className="banner">
          <p>
            Hi, my name is Theresa and I am a front end / UX engineer; born in
            sunny-side Sydney, now living and working in the cool Bay Area. I
            specialise in creating boutique UIs, with a passion for immersive
            user experiences and creative coding. I have 4 years experience in
            building and maintaining comprehensive component libraries that have
            empowered hundreds of engineers to architect accessible and
            trustworthy products and platforms.
          </p>
        </div>
        <Tech />
        <Exp />
        <MiniProjects />
      </main>

      <footer className="banner">
        <div id="footerContactDiv">
          <h2>keep in touch with me via:</h2>
          <span className="contact">
            <a
              className="textLink"
              title="Email"
              href="mailto:tee.nguyen+githubpage@live.com.au"
            >
              email
            </a>
            <a
              className="textLink"
              title="LinkedIn"
              href="https://linkedin.com/in/theresaanguyen"
            >
              linkedin
            </a>
            <a
              className="textLink"
              title="Github"
              href="https://github.com/teenguyen"
            >
              github
            </a>
            <a
              className="textLink"
              title="Codepen"
              href="https://codepen.io/ryuuseiistar"
            >
              codepen
            </a>
          </span>
        </div>
        <div id="footerImgDiv">
          <img id="footerImg" src={welcomeImg} alt="girl with two cats" />
        </div>
      </footer>
    </div>
  );
}

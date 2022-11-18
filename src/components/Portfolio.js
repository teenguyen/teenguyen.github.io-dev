import React from "react";
import { Codepen, GitHub, Linkedin, Send } from "react-feather";
import welcomeImg from "./images/welcome.png";
import liverampLogo from "./images/lr.jpg";
import rbaLogo from "./images/rba.jpg";
import ingLogo from "./images/ing.jpg";
import sypleLogo from "./images/syple.jpg";
import bofamlLogo from "./images/bofaml.jpg";
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
        <div id="tech" className="panel">
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
        <div id="exp" className="panel">
          <span className="current">
            <img src={liverampLogo} alt="LiveRamp logo" />
            <h3>LiveRamp</h3>
            <sub>September 2018 - Present</sub>
            <p>Front End Engineer</p>
            <p>Applications Experience (AX) Team</p>
          </span>
          <div id="exp-previous">
            <span>
              <img src={rbaLogo} alt="Reserve Bank of Australia logo" />
              <h4>Reserve Bank of Australia</h4>
              <p>January 2014 - August 2018</p>
              <p>Front End/Java Developer</p>
            </span>
            <span>
              <img src={ingLogo} alt="ING Direct logo" />
              <h4>ING Direct</h4>
              <p>January - June 2013</p>
              <p>DevOps | Co-Op Program</p>
            </span>
            <span>
              <img src={sypleLogo} alt="Syple Technologies logo" />
              <h4>Syple Technologies</h4>
              <p>March - September 2013</p>
              <p>Junior Java Developer</p>
            </span>
            <span>
              <img src={bofamlLogo} alt="Bank of America Merrill Lynch logo" />
              <h4>Bank of America Merrill Lynch</h4>
              <p>July - December 2018</p>
              <p>Junior .NET Developer | Co-Op Program</p>
            </span>
          </div>
        </div>
        <div id="mini-projects" className="panel"></div>
      </main>
      <footer className="banner">
        <span id="footerContactSpan">
          <span>
            <h2>keep in touch with me via:</h2>
          </span>
          <span className="contact">
            <span>
              <a
                className="textLink"
                title="Email"
                href="mailto:tee.nguyen+githubpage@live.com.au"
              >
                email
              </a>
            </span>
            <span>
              <a
                className="textLink"
                title="LinkedIn"
                href="https://linkedin.com/in/theresaanguyen"
              >
                linkedin
              </a>
            </span>
            <span>
              <a
                className="textLink"
                title="Github"
                href="https://github.com/teenguyen"
              >
                github
              </a>
            </span>
            <span>
              <a
                className="textLink"
                title="Codepen"
                href="https://codepen.io/ryuuseiistar"
              >
                codepen
              </a>
            </span>
          </span>
        </span>
        <span id="footerImgSpan">
          <img id="footerImg" src={welcomeImg} alt="girl with two cats" />
        </span>
      </footer>
    </div>
  );
}

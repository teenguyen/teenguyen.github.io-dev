import React, { useLayoutEffect, useState } from "react";
import Starmap from "./Starmap";
import Portfolio from "./Portfolio";
import "./App.css";

function App() {
  let [portfolioView, setPortfolioView] = useState(true);
  let [showButton, setShowButton] = useState(true);

  const scrollListener = () => {
    let hideAtHeight = 500;
    const documentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    documentScroll > hideAtHeight ? setShowButton(false) : setShowButton(true);

    let opacity = 1;
    document.getElementById("starmapButton").style.opacity =
      opacity - documentScroll / hideAtHeight;
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  /* add floaty button to switch context between portfolio/starmap */
  return (
    <>
      <Starmap portfolioView={portfolioView} />
      <Portfolio
        id="portfolio"
        style={{
          opacity: portfolioView ? 1 : 0,
          transition: "opacity 250ms ease-in-out"
        }}
      />
      <a
        id="starmapButton"
        className="textLink"
        onClick={() => setPortfolioView(!portfolioView)}
        style={{ visibility: showButton ? "visible" : "hidden" }}
      >
        {portfolioView
          ? "Show me the starmap!"
          : "Lower the starmap into the background"}
      </a>
    </>
  );
}

export default App;

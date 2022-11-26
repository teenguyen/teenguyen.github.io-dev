import React, { useEffect, useState } from "react";
import Starmap from "./Starmap";
import Portfolio from "./Portfolio";
import "./App.css";

const FULL_OPACITY = 1;

function App() {
  let [portfolioView, setPortfolioView] = useState(true);
  let [showButton, setShowButton] = useState(true);

  const scrollListener = () => {
    const hideAtHeight = 500;
    const documentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    documentScroll > hideAtHeight ? setShowButton(false) : setShowButton(true);
    let opacity = FULL_OPACITY - documentScroll / hideAtHeight;
    document.getElementById("starmapButton").style.opacity = opacity;
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  useEffect(() => {
    let displayTimeout;
    let portfolio = document.getElementById("portfolio");
    if (!portfolioView) {
      portfolio.style.opacity = 0;
      displayTimeout = setTimeout(
        () => (portfolio.style.display = "none"),
        500
      );
    } else {
      portfolio.style.opacity = 1;
      portfolio.style.display = "block";
    }

    return () => {
      clearTimeout(displayTimeout);
    };
  }, [portfolioView]);

  return (
    <>
      <Starmap portfolioView={portfolioView} />
      <Portfolio id="portfolio" setPortfolioView={setPortfolioView} />
      <button
        id="starmapButton"
        className="textLink"
        onClick={() => setPortfolioView(!portfolioView)}
        style={{ display: showButton ? "block" : "none" }}
      >
        {portfolioView
          ? "Show me the starmap!"
          : "Lower the starmap into the background"}
      </button>
    </>
  );
}

export default App;

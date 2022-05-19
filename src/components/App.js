import React, { useState } from "react";
import Starmap from "./Starmap";
import Portfolio from "./Portfolio";
import "./App.css";

function App() {
  let [portfolioView, setPortfolioView] = useState(true);
  let state = {
    portfolioView,
    setPortfolioView
  };

  /* add floaty button to switch context between portfolio/starmap */
  return (
    <div className="parallax-wrapper">
      <Starmap portfolioView={portfolioView} />
      {portfolioView && <Portfolio />}
    </div>
  );
}

export default App;

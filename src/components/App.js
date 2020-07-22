import React, { useState } from "react";
import Starmap from "./Starmap";

function App() {
  let [portfolioView, setPortfolioView] = useState(true);
  return (
    <>
      <Starmap portfolioView={portfolioView} />
      {/* add floaty button to switch context between portfolio/starmap */}
    </>
  );
}

export default App;

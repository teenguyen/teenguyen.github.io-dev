import React, { useState } from "react";
import liverampLogo from "../images/lr.jpg";
import rbaLogo from "../images/rba.jpg";
import ingLogo from "../images/ing.jpg";
import sypleLogo from "../images/syple.jpg";
import bofamlLogo from "../images/bofaml.jpg";
import css from "./Exp.module.css";

const liveramp = {
  name: "LiveRamp",
  img: <img src={liverampLogo} alt="LiveRamp logo" />,
  years: "September 2018 - Present",
  role: "Front End Engineer",
  team: "Applications Experience (AX) Team"
};

const rba = {
  name: "Reserve Bank of Australia",
  img: <img src={rbaLogo} alt="Reserve Bank of Australia logo" />,
  years: "January 2014 - August 2018",
  role: "Front End/Java Developer",
  team: ""
};

const ingdirect = {
  name: "ING Direct",
  img: <img src={ingLogo} alt="ING Direct logo" />,
  years: "January - June 2013",
  role: "DevOps | Co-Op Program",
  team: ""
};

const syple = {
  name: "Syple Technologies",
  img: <img src={sypleLogo} alt="Syple Technologies logo" />,
  years: "March - September 2013",
  role: "Junior Java Developer",
  team: ""
};

const bofaml = {
  name: "Bank of America Merrill Lynch",
  img: <img src={bofamlLogo} alt="Bank of America Merrill Lynch logo" />,
  years: "July - December 2018",
  role: "Junior .NET Developer | Co-Op Program",
  team: ""
};

const jobs = { liveramp, rba, ingdirect, syple, bofaml };

export default function Exp() {
  let [main, setMain] = useState("liveramp");

  return (
    <div id={css.exp} className="panel">
      <span className="current"></span>
      <div id={css.expPrevious}></div>
    </div>
  );
}

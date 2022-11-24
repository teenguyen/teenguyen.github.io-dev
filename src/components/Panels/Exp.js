import React from "react";
import liverampLogo from "../images/exp/lr.jpg";
import rbaLogo from "../images/exp/rba.jpg";
import ingLogo from "../images/exp/ing.jpg";
import sypleLogo from "../images/exp/syple.jpg";
import bofamlLogo from "../images/exp/bofaml.jpg";
import css from "./Exp.module.css";

const prev = [
  {
    name: "Reserve Bank of Australia",
    img: <img src={rbaLogo} alt="Reserve Bank of Australia logo" />,
    years: "January 2014 - August 2018",
    role: "Front End/Java Developer"
  },
  {
    name: "ING Direct",
    img: <img src={ingLogo} alt="ING Direct logo" />,
    years: "January - June 2013",
    role: "DevOps | Co-Op Program"
  },
  {
    name: "Syple Technologies",
    img: <img src={sypleLogo} alt="Syple Technologies logo" />,
    years: "March - September 2013",
    role: "Junior Java Developer"
  },
  {
    name: "Bank of America Merrill Lynch",
    img: <img src={bofamlLogo} alt="Bank of America Merrill Lynch logo" />,
    years: "July - December 2018",
    role: "Junior .NET Developer | Co-Op Program"
  }
];

export default function Exp() {
  return (
    <div id={css.exp} className="panel">
      <span id={css.current}>
        <img src={liverampLogo} alt="LiveRamp logo" />
        <h3>LiveRamp</h3>
        <sub>September 2018 - Present</sub>
        <p>Front End Engineer</p>
        <p>Applications Experience (AX) Team</p>
      </span>
      <div className={css.previousJobs}>
        {prev.map(job => (
          <span key={job.name} className={css.previousJob}>
            {job.img}
            <h4>{job.name}</h4>
            <sub>{job.years}</sub>
            <p>{job.role}</p>
          </span>
        ))}
      </div>
    </div>
  );
}

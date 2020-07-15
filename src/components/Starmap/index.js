import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import css from "./index.module.css";

export default function Starmap({ portfolioView }) {
  let w = 1920;
  let h = 1080;
  let [graticule, setGraticule] = useState(null);
  let [stars, setStars] = useState(null);
  let [milkyway, setMilkyway] = useState(null);
  let [constellationsLines, setConstellationsLines] = useState(null);
  let [constellationsNames, setConstellationsNames] = useState(null);

  useEffect(() => {
    let w = 1920;
    let h = 1080;
    let projection = d3
      .geoMercator()
      .translate([w / 2, h / 2])
      .scale(400);
    let path = d3.geoPath(projection);
    let graticuleData = d3.geoGraticule10();
    let svg = d3.select("#starmap");

    setGraticule(
      <path
        stroke="black"
        strokeWidth="1px"
        strokeOpacity="0.1"
        d={path(graticuleData)}
      />
    );

    async function fetchData() {
      let dataFolder = process.env.PUBLIC_URL + "/data";
      Promise.all([
        d3.json(`${dataFolder}/stars.json`),
        d3.json(`${dataFolder}/milkyway.json`),
        d3.json(`${dataFolder}/constellations.lines.json`),
        d3.json(`${dataFolder}/constellations.names.json`),
      ])
        .then(
          ([
            starData,
            milkywayData,
            constellationLineData,
            constellationNameData,
          ]) => {
            // geometry: {type: "Point", coordinates: Array(2)}
            // id: 88
            // properties: {mag: 5.71, bv: "0.911"}
            // type: "Feature"
            setStars(
              starData.features.map(star => (
                <path
                  key={star.id}
                  fill="white"
                  fillOpacity={0.25 * star.properties.bv}
                  style={{
                    transform: `scale(${0.1 * star.properties.mag})`,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  d={path(star.geometry)}
                />
              ))
            );
            // geometry: {type: "Polygon", coordinates: Array(10)}
            // id: "ol1"
            // properties: {}
            // type: "Feature"
            setMilkyway(
              milkywayData.features.map(range => (
                <path
                  key={range.id}
                  fill="white"
                  fillOpacity="0.02"
                  d={path(range.geometry)}
                />
              ))
            );
            // geometry: {type: "MultiLineString", coordinates: Array(5)}
            // id: "And"
            // properties: {rank: "1"}
            // type: "Feature"
            setConstellationsLines(
              constellationLineData.features.map(line => (
                <path
                  key={`line-${line.id}`}
                  stroke="white"
                  strokeOpacity="0.1"
                  fill="transparent"
                  d={path(line)}
                />
              ))
            );
            // geometry: {type: "Point", coordinates: Array(2)}
            // id: "And"
            // properties: {name: "Andromeda", desig: "And", gen: "Andromedae", rank: "1", en: "Andromeda", …}
            // type: "Feature"
            setConstellationsNames(
              constellationNameData.features.map(name => {
                let [x, y] = projection(name.geometry.coordinates);
                return (
                  <foreignObject
                    className={css.labelContainer}
                    key={`name-${name.id}`}
                    x={x}
                    y={y}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className={css.label}
                    >
                      {name.properties.name}
                    </div>
                  </foreignObject>
                );
              })
            );
          }
        )
        .catch(err => console.log(`Error loading or parsing data. ${err}`));
    }

    fetchData();
  }, []);

  return (
    <svg id="starmap" height={h} width={w}>
      {graticule}
      {stars}
      {milkyway}
      {constellationsLines}
      {constellationsNames}
    </svg>
  );
}


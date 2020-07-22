import React, { Component } from "react";
import * as d3 from "d3";
import css from "./index.module.css";

let w = 1920;
let h = 1080;
export default class Starmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starData: null,
      milkywayData: null,
      constellationData: null,
      constellationNameData: null,
      stars: <></>,
      milkyway: <></>,
      constellations: <></>,
      constellationNames: <></>,
    };
  }

  async componentDidMount() {
    let svg = d3.select("#starmap");
    let projection = d3
      .geoMercator()
      .translate([w / 2, h / 2])
      // .scale(300);
      .scale(1000)
      .angle(15);
    let path = d3.geoPath(projection);
    let graticuleData = d3.geoGraticule10();

    svg
      .append("path")
      .datum(graticuleData)
      .attr("d", path)
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("stroke-opacity", "0.1");

    let data;
    try {
      let dataFolder = process.env.PUBLIC_URL + "/data";
      data = await Promise.all([
        d3.json(`${dataFolder}/stars.json`),
        d3.json(`${dataFolder}/milkyway.json`),
        d3.json(`${dataFolder}/constellations.lines.json`),
        d3.json(`${dataFolder}/constellations.names.json`),
      ])
        .then(
          ([
            starData,
            milkywayData,
            constellationData,
            constellationNameData,
          ]) => ({
            starData,
            milkywayData,
            constellationData,
            constellationNameData,
          })
        )
        .catch(err => console.log(`Error loading or parsing data. ${err}`));
      this.drawData(data, projection, path);
    } catch (e) {
      console.error(`Something somewhere went wrong :( ${e}`);
    }

    let initialScale = projection.scale();
    let drag = d3.drag().on("drag", () => {
      const rotate = projection.rotate();
      const k = 25 / projection.scale();
      projection.rotate([
        rotate[0] + d3.event.dx * k,
        rotate[1] - d3.event.dy * k,
      ]);
      path = d3.geoPath(projection);
      svg.selectAll("path").attr("d", path);
    });
    let zoom = d3.zoom().on("zoom", () => {
      if (d3.event.transform.k > 0.3) {
        projection.scale(initialScale * d3.event.transform.k);
        path = d3.geoPath(projection);
        svg.selectAll("path").attr("d", path);
      } else {
        d3.event.transform.k = 0.3;
      }
    });

    svg.call(drag).call(zoom);

    // d3.timer(elapsed => {
    //   const rotate = projection.rotate();
    //   const k = 25 / projection.scale();
    //   projection.rotate([rotate[0] - 1 * k, rotate[1]]);
    //   path = d3.geoPath(projection);
    //   svg.selectAll("path").attr("d", path);
    // }, 200);
  }

  drawData(data, projection, path) {
    let { portfolioView } = this.props;
    let {
      starData,
      milkywayData,
      constellationData,
      constellationNameData,
    } = data;

    // geometry: {type: "Point", coordinates: Array(2)}
    // id: 88
    // properties: {mag: 5.71, bv: "0.911"}
    // type: "Feature"
    let stars = starData.features.map(star => (
      <path
        key={star.id}
        className={css.stars}
        fillOpacity={
          (portfolioView ? 0.25 : 1) *
          (star.properties.bv > 0 ? star.properties.bv : -star.properties.bv)
        }
        transform={`scale(${0.1 * star.properties.mag})`}
        d={path(star.geometry)}
      />
    ));
    // geometry: {type: "Polygon", coordinates: Array(10)}
    // id: "ol1"
    // properties: {}
    // type: "Feature"
    let milkyway = (
      <>
        <defs>
          <filter id="milkyway-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="white" />
          </filter>
        </defs>
        {milkywayData.features.map(range => (
          <path
            key={range.id}
            className={css.milkyway}
            d={path(range.geometry)}
          />
        ))}
      </>
    );
    // geometry: {type: "MultiLineString", coordinates: Array(5)}
    // id: "And"
    // properties: {rank: "1"}
    // type: "Feature"
    let constellations = constellationData.features.map(line => (
      <path
        key={`line-${line.id}`}
        strokeOpacity={portfolioView ? 0.1 : 0.2}
        strokeWidth={portfolioView ? 1 : 2}
        className={css.constellationLines}
        d={path(line)}
      />
    ));
    // geometry: {type: "Point", coordinates: Array(2)}
    // id: "And"
    // properties: {name: "Andromeda", desig: "And", gen: "Andromedae", rank: "1", en: "Andromeda", …}
    // type: "Feature"
    let constellationNames = <></>;
    if (!portfolioView) {
      constellationNames = constellationNameData.features.map(name => {
        let [x, y] = projection(name.geometry.coordinates);
        return (
          <foreignObject
            className={css.labelContainer}
            key={`name-${name.id}`}
            x={x}
            y={y}
          >
            <div xmlns="http://www.w3.org/1999/xhtml" className={css.label}>
              {name.properties.name}
            </div>
          </foreignObject>
        );
      });
    }

    this.setState({ stars, milkyway, constellations, constellationNames });
  }

  render() {
    let { stars, milkyway, constellations, constellationNames } = this.state;
    return (
      <svg
        id="starmap"
        height="100vh"
        width="100vw"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        {stars}
        {milkyway}
        {constellations}
        {constellationNames}
      </svg>
    );
  }
}

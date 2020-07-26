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
      .scale(300);
    // .scale(1000)
    // .angle(15);
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
      this.drawData(svg, data, path, projection);
    } catch (e) {
      console.error(`Something somewhere went wrong :( ${e}`);
    }

    // let drag = d3.drag().on("drag", () => {
    //   const rotate = projection.rotate();
    //   const k = 25 / projection.scale();
    //   projection.rotate([
    //     rotate[0] + d3.event.dx * k,
    //     rotate[1] - d3.event.dy * k,
    //   ]);
    //   path = d3.geoPath(projection);
    //   svg.selectAll("path").attr("d", path);
    // });
    // let zoom = d3.zoom().on("zoom", () => {
    //   if (d3.event.transform.k > 0.3) {
    //     projection.scale(projection.scale() * d3.event.transform.k);
    //     path = d3.geoPath(projection);
    //     svg.selectAll("path").attr("d", path);
    //   } else {
    //     d3.event.transform.k = 0.3;
    //   }
    // });

    // svg.call(drag).call(zoom);

    // d3.timer(elapsed => {
    //   const rotate = projection.rotate();
    //   const k = 25 / projection.scale();
    //   projection.rotate([rotate[0] - 1 * k, rotate[1]]);
    //   path = d3.geoPath(projection);
    //   svg.selectAll("path").attr("d", path);
    // }, 200);
  }

  drawData(svg, data, path, projection) {
    let { portfolioView } = this.props;
    let {
      starData,
      milkywayData,
      constellationData,
      constellationNameData,
    } = data;

    svg
      .append("g")
      .attr("id", "stars")
      .selectAll("path")
      .data(starData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", css.stars)
      .attr(
        "fill-opacity",
        star =>
          (portfolioView ? 0.25 : 1) *
          (star.properties.bv > 0 ? star.properties.bv : -star.properties.bv)
      )
      .attr("transform", star => `scale(${0.1 * star.properties.mag})`);

    svg
      .append("g")
      .attr("id", "milkyway")
      .selectAll("path")
      .data(milkywayData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", css.milkyway);

    svg
      .append("g")
      .attr("id", "constellations")
      .selectAll("path")
      .data(constellationData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", css.constellationLines)
      .attr("stroke-opacity", portfolioView ? 0.1 : 0.2)
      .attr("stroke-width", portfolioView ? 1 : 2);

    // if (!portfolioView) {
    svg
      .append("g")
      .attr("id", "constellation-names")
      .selectAll("path")
      .data(constellationNameData.features)
      .enter()
      .append("foreignObject")
      .attr("class", css.labelContainer)
      .attr("x", name => projection(name.geometry.coordinates)[0])
      .attr("y", name => projection(name.geometry.coordinates)[1])
      .append("xhtml:div")
      .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .attr("class", css.label)
      .html(name => name.properties.name);
    // .text(name => name.properties.name);
    // }
  }

  //     constellationNames = constellationNameData.features.map(name => {
  //       let [x, y] = projection(name.geometry.coordinates);
  //       return (
  //         <foreignObject
  //           className={css.labelContainer}
  //           key={`name-${name.id}`}
  //           x={x}
  //           y={y}
  //         >
  //           <div xmlns="http://www.w3.org/1999/xhtml" className={css.label}>
  //             {name.properties.name}
  //           </div>
  //         </foreignObject>
  //       );
  //     });

  render() {
    return (
      <svg
        id="starmap"
        height="100vh"
        width="100vw"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="milkyway-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="white" />
          </filter>
        </defs>
      </svg>
    );
  }
}

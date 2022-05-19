import React, { Component } from "react";
import * as d3 from "d3";

let w = 1920;
let h = 1080;
export default class Starmap extends Component {
  constructor() {
    this.state = {
      data: null
    };
  }

  async componentDidMount() {
    let canvas = d3.select("#starmap");
    let ctx = canvas.node().getContext("2d");
    let projection = d3
      .geoMercator()
      .translate([w / 2, h / 2])
      // .scale(200);
      .scale(1000)
      .angle(15);
    let path = d3.geoPath(projection, ctx);

    let data;
    try {
      let dataFolder = process.env.PUBLIC_URL + "/data";
      data = await Promise.all([
        d3.json(`${dataFolder}/stars.json`),
        d3.json(`${dataFolder}/milkyway.json`),
        d3.json(`${dataFolder}/constellations.lines.json`),
        d3.json(`${dataFolder}/constellations.names.json`)
      ])
        .then(
          ([
            starData,
            milkywayData,
            constellationData,
            constellationNameData
          ]) =>
            this.setState({
              data: {
                starData,
                milkywayData,
                constellationData,
                constellationNameData
              },
              ctx,
              path,
              projection
            })
        )
        .catch(err => console.log(`Error loading or parsing data. ${err}`));
      this.drawData();
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
    //   this.drawData();
    // });
    // let zoom = d3.zoom().on("zoom", () => {
    //   if (d3.event.transform.k > 0.3) {
    //     projection.scale(projection.scale() * d3.event.transform.k);
    //     path = d3.geoPath(projection);
    //     this.drawData();
    //   } else {
    //     d3.event.transform.k = 0.3;
    //   }
    // });
    //
    // canvas.call(drag).call(zoom);

    d3.timer(elapsed => {
      const rotate = projection.rotate();
      const k = 25 / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      path = d3.geoPath(projection);
      this.drawData();
    }, 200);
  }

  drawData() {
    let { data, ctx, path, projection } = this.state;
    let { starData, milkywayData, constellationData, constellationNameData } =
      data;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let graticuleData = d3.geoGraticule10();
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    path(graticuleData);
    ctx.stroke();

    let magnitudeScale = d3
      .scaleLinear()
      .domain(d3.extent(starData.features, star => star.properties.mag))
      .range([5, 1]);
    let starPath = d3
      .geoPath(projection, ctx)
      .pointRadius(d => magnitudeScale(d.properties.mag));

    starData.features.forEach(star => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${
        (this.props.portfolioView ? 0.25 : 1) * Math.abs(star.properties.bv)
      })`;
      starPath(star);
      ctx.fill();
    });

    milkywayData.features.forEach(milkyway => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255, 0.03)";
      path(milkyway);
      ctx.fill();
    });

    constellationData.features.forEach(constellation => {
      ctx.beginPath();
      ctx.lineWidth = this.props.portfolioView ? 1 : 2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${
        this.props.portfolioView ? 0.1 : 0.2
      })`;
      path(constellation);
      ctx.stroke();
    });

    if (!this.props.portfolioView) {
      constellationNameData.features.forEach(name => {
        let [x, y] = projection(name.geometry.coordinates);
        x = x.toFixed(3);
        y = y.toFixed(3);
        let width = ctx.measureText(name.properties.name).width + 8;
        let height = 22;
        let cornerRadius = 8;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(20, 24, 82, 0.9)";
        ctx.lineJoin = "round";
        ctx.lineWidth = 16;
        ctx.strokeRect(
          x + cornerRadius / 2,
          y + cornerRadius / 2,
          width - cornerRadius,
          height - cornerRadius
        );

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "16px Montserrat";
        ctx.textBaseline = "top";
        ctx.fillText(name.properties.name, x, y);
        ctx.stroke();
      });
    }
  }

  render() {
    return <canvas id="starmap" height="2160" width="3840" />;
  }
}

import React, { Component } from "react";
import * as d3 from "d3";

const WIDTH = 1920;
const HEIGHT = 1080;
const SCALE = 1000;
export default class Starmap extends Component {
  constructor() {
    super();

    this.state = {
      data: null,
      height: HEIGHT,
      width: WIDTH
    };

    this.updateHeightWidth = this.updateHeightWidth.bind(this);
  }

  async componentDidMount() {
    let canvas = d3.select("#starmap");
    let ctx = canvas.node().getContext("2d");
    let projection = d3.geoMercator().scale(SCALE).angle(15);

    let height = window.innerHeight;
    let width = window.innerWidth;
    window.addEventListener("resize", this.updateHeightWidth);

    let dataFolder = process.env.PUBLIC_URL + "/data";
    await Promise.all([
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
        ]) => {
          try {
            let miniStarData = Object.assign({}, starData);
            miniStarData.features = miniStarData.features.filter(
              star => star.properties.mag > 5.5
            );

            this.setState({
              data: {
                miniStarData,
                starData,
                milkywayData,
                constellationData,
                constellationNameData
              },
              height,
              width,
              canvas,
              ctx,
              projection
            });
          } catch (e) {
            console.error(`Something somewhere went wrong :( ${e}`);
          }
        }
      )
      .catch(err => console.log(`Error loading or parsing data. ${err}`));
    this.drawData();
    this.drawData();

    // disabling until performance is improved :(
    // d3.timer(() => {
    //   const rotate = projection.rotate();
    //   const k = 25 / projection.scale();
    //   projection.rotate([rotate[0] - 1 * k, rotate[1]]);
    //   this.drawData();
    // });
  }

  componentDidUpdate(prevProps) {
    let { portfolioView } = this.props;

    if (prevProps.portfolioView !== portfolioView) {
      let { canvas, projection } = this.state;
      if (!portfolioView) {
        canvas.call(
          d3.drag().on("drag", event => {
            const rotate = projection.rotate();
            const k = 50 / projection.scale();
            projection.rotate([
              rotate[0] + event.dx * k,
              rotate[1] - event.dy * k
            ]);
            this.drawData();
          })
        );
        // canvas.call(
        //   d3.zoom().on("zoom", event => {
        //     if (event.transform.k < 0.3) {
        //       event.transform.k = 0.3;
        //     }
        //     projection.scale(SCALE * event.transform.k);
        //     this.drawData();
        //   })
        // );
        this.drawData();
      } else {
        canvas.call(d3.drag().on("drag", null));
        // canvas.call(d3.zoom().on("zoom", null));
        this.drawData();
      }
    }
  }

  updateHeightWidth() {
    let height = window.innerHeight;
    let width = window.innerWidth;

    this.setState({ height, width });
    this.drawData();
  }

  drawData() {
    let { portfolioView } = this.props;
    let { data, height, width, ctx, projection } = this.state;
    let {
      miniStarData,
      starData,
      milkywayData,
      constellationData,
      constellationNameData
    } = data;

    ctx.clearRect(0, 0, width, height);

    let graticuleData = d3.geoGraticule10();
    let graticulePath = d3.geoPath(projection, ctx);
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    graticulePath(graticuleData);
    ctx.stroke();

    let milkywayPath = d3.geoPath(projection, ctx);
    milkywayData.features.forEach(milkyway => {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255, 0.03)";
      milkywayPath(milkyway);
      ctx.fill();
    });

    let constellationPath = d3.geoPath(projection, ctx);
    constellationData.features.forEach(constellation => {
      ctx.beginPath();
      ctx.lineWidth = portfolioView ? 1 : 2;
      ctx.strokeStyle = `rgba(255, 255, 255, ${portfolioView ? 0.1 : 0.2})`;
      constellationPath(constellation);
      ctx.stroke();
    });

    let magnitudeScale = d3
      .scaleLinear()
      .domain(d3.extent(starData.features, star => star.properties.mag))
      .range([10, 1]);
    let starPath = d3
      .geoPath(projection, ctx)
      .pointRadius(d => magnitudeScale(d.properties.mag));
    if (portfolioView) {
      miniStarData.features.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${
          0.25 * Math.abs(star.properties.bv)
        })`;
        starPath(star);
        ctx.fill();
      });
    } else {
      starData.features.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.properties.bv)})`;
        starPath(star);
        ctx.fill();
      });

      constellationNameData.features.forEach(name => {
        let [x, y] = projection(name.geometry.coordinates);
        x = x.toFixed(3);
        y = y.toFixed(3);
        let constellationWidth =
          ctx.measureText(name.properties.name).width + 8;
        let constellationHeight = 22;
        let cornerRadius = 8;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(20, 24, 82, 0.65)";
        ctx.lineJoin = "round";
        ctx.lineWidth = 16;
        ctx.strokeRect(
          x + cornerRadius / 2,
          y + cornerRadius / 2,
          constellationWidth - cornerRadius,
          constellationHeight - cornerRadius
        );

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "16px Montserrat";
        ctx.textBaseline = "top";
        ctx.fillText(name.properties.name, x, y);
        ctx.stroke();
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateHeightWidth);
  }

  render() {
    return (
      <canvas
        id="starmap"
        height={this.state.height}
        width={this.state.width}
      />
    );
  }
}

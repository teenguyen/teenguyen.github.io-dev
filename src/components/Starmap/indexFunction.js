import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const WIDTH = 1920;
const HEIGHT = 1080;
const SCALE = 1000;

// WIP trying to convert this to a React function
export default function Starmap({ portfolioView }) {
  let [data, setData] = useState(null);
  let [canvas, setCanvas] = useState(null);
  let [ctx, setCtx] = useState(null);
  let projection = d3
    .geoMercator()
    .translate([WIDTH / 2, HEIGHT / 2])
    .scale(SCALE)
    .angle(15);

  useEffect(() => {
    let isMounted = true;

    let canvas = d3.select("#starmap");
    let ctx = canvas.node().getContext("2d");

    setCanvas(canvas);
    setCtx(ctx);

    const fetchData = async () => {
      const dataFolder = process.env.PUBLIC_URL + "/data";
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
            let miniStarData = Object.assign({}, starData);
            miniStarData.features = miniStarData.features.filter(
              star => star.properties.mag > 5
            );

            if (isMounted) {
              setData({
                miniStarData,
                starData,
                milkywayData,
                constellationData,
                constellationNameData
              });
            }
          }
        )
        .catch(err => console.log(`Error loading or parsing data. ${err}`));
    };

    fetchData();

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    const timer = () => {
      d3.timer(() => {
        const rotate = projection.rotate();
        const k = 25 / projection.scale();
        projection.rotate([rotate[0] - 1 * k, rotate[1]]);
      }, 200);
    };

    timer();
  }, [projection]);

  useEffect(() => {
    d3.timer(() => {
      const rotate = projection.rotate();
      const k = 25 / projection.scale();
      projection.rotate([rotate[0] - 1 * k, rotate[1]]);
    }, 200);
  }, [projection]);

  useEffect(() => {
    if (!data) return undefined;

    let {
      miniStarData,
      starData,
      milkywayData,
      constellationData,
      constellationNameData
    } = data;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
        let width = ctx.measureText(name.properties.name).width + 8;
        let height = 22;
        let cornerRadius = 8;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(20, 24, 82, 0.65)";
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
  }, [portfolioView, ctx, projection, data]);

  useEffect(() => {
    if (!canvas) return undefined;

    if (portfolioView) {
      canvas.call(d3.drag().on("drag", () => {}));
      canvas.call(d3.zoom().on("zoom", () => {}));
    } else {
      canvas.call(
        d3.drag().on("drag", () => {
          const rotate = projection.rotate();
          const k = 50 / projection.scale();
          projection.rotate([
            rotate[0] + d3.event.dx * k,
            rotate[1] - d3.event.dy * k
          ]);
        })
      );
      canvas.call(
        d3.zoom().on("zoom", () => {
          if (d3.event.transform.k < 0.3) {
            d3.event.transform.k = 0.3;
          }
          projection.scale(SCALE * d3.event.transform.k);
        })
      );
    }
  }, [portfolioView, canvas, projection]);

  return <canvas id="starmap" height="2160" width="3840" />;
}

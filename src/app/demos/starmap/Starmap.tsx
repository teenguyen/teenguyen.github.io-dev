"use client";

import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./Starmap.module.css";

type StarFeature = {
  geometry: { coordinates: [number, number] };
  properties: { mag: number; bv?: number };
};

type LineFeature = {
  geometry: { type: string; coordinates: unknown };
};

type StarCollection = { features: StarFeature[] };
type LineCollection = { features: LineFeature[] };

type SkyData = {
  stars: StarCollection;
  constellations: LineCollection;
};

const BASE_HEIGHT = 1080;
const BASE_SCALE = 1000;
const HASH_SIN_MULTIPLIER = 12.9898;
const HASH_SPREAD_MULTIPLIER = 43758.5453;
const STAR_VARIANT_COUNT = 4;

function seededVariant(seed: number) {
  const value = Math.abs(
    Math.sin(seed * HASH_SIN_MULTIPLIER) * HASH_SPREAD_MULTIPLIER,
  );
  const fraction = value - Math.floor(value);
  return Math.floor(fraction * STAR_VARIANT_COUNT);
}

function drawStarGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  points: number,
  outerRadius: number,
) {
  const innerRadius = outerRadius * 0.45;
  const step = Math.PI / points;

  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * step;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
}

function drawRectangularFourPointGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
) {
  const vertical = outerRadius * 1.45;
  const horizontal = outerRadius * 1.08;
  const coreX = outerRadius * 0.14;
  const shoulderY = outerRadius * 0.32;

  ctx.beginPath();
  ctx.moveTo(x, y - vertical);
  ctx.quadraticCurveTo(x + coreX, y - shoulderY, x + horizontal, y);
  ctx.quadraticCurveTo(x + coreX, y + shoulderY, x, y + vertical);
  ctx.quadraticCurveTo(x - coreX, y + shoulderY, x - horizontal, y);
  ctx.quadraticCurveTo(x - coreX, y - shoulderY, x, y - vertical);
  ctx.closePath();
  ctx.fill();
}

function drawCrossGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const half = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - half, y);
  ctx.lineTo(x + half, y);
  ctx.moveTo(x, y - half);
  ctx.lineTo(x, y + half);
  ctx.stroke();
}

export default function Starmap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<SkyData | null>(null);
  const rafRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const data = dataRef.current;
    if (!container || !canvas || !data) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const themeColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-color-48")
      .trim();
    const themeColor25 = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-color-25")
      .trim();

    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 2])
      .scale((Math.min(width, height) / BASE_HEIGHT) * BASE_SCALE)
      .angle(15);

    const graticulePath = d3.geoPath(projection, ctx);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    graticulePath(d3.geoGraticule10());
    ctx.stroke();

    const linePath = d3.geoPath(projection, ctx);
    ctx.strokeStyle = themeColor25;
    data.constellations.features.forEach((line) => {
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      linePath(line as d3.GeoPermissibleObjects);
      ctx.stroke();
    });

    const magnitudeScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data.stars.features, (star) => star.properties.mag) as [
          number,
          number,
        ],
      )
      .range([15, 1.1]);

    ctx.fillStyle = themeColor;
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 0.7;
    data.stars.features.forEach((star) => {
      const projected = projection(star.geometry.coordinates);
      if (!projected) return;
      const [x, y] = projected;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      const seed =
        star.geometry.coordinates[0] * 1000 +
        star.geometry.coordinates[1] * 1000;
      const variant = seededVariant(seed);
      const radius = magnitudeScale(star.properties.mag);
      if (radius <= 1.6) {
        drawCrossGlyph(ctx, x, y, Math.max(1.4, radius * 1.8));
        return;
      }

      if (variant === 1) {
        drawRectangularFourPointGlyph(ctx, x, y, radius);
        return;
      }

      if (variant === 0) {
        drawStarGlyph(ctx, x, y, 4, radius);
        return;
      }

      if (variant === 2) {
        drawStarGlyph(ctx, x, y, 5, radius);
        return;
      }

      drawStarGlyph(ctx, x, y, 6, radius);
    });
  }, []);

  const requestDraw = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [stars, constellations] = await Promise.all([
          fetch("/data/stars.json").then(
            (res) => res.json() as Promise<StarCollection>,
          ),
          fetch("/data/constellations.lines.json").then(
            (res) => res.json() as Promise<LineCollection>,
          ),
        ]);

        if (cancelled) return;
        dataRef.current = { stars, constellations };
        requestDraw();
      } catch (error) {
        console.error("Failed to load starmap data:", error);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [requestDraw]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => requestDraw());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", requestDraw);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", requestDraw);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [requestDraw]);

  return (
    <section className={styles.root}>
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import clsx from "clsx";
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

type PreparedStar = {
  coordinates: [number, number];
  mag: number;
  variant: number;
};

type SkyData = {
  stars: PreparedStar[];
  constellations: LineCollection;
  magnitudeExtent: [number, number];
};

const BASE_HEIGHT = 1080;
const BASE_SCALE = 1000;
const MIN_SCALE_FACTOR = 0.72;
const HASH_SIN_MULTIPLIER = 12.9898;
const HASH_SPREAD_MULTIPLIER = 43758.5453;
const STAR_VARIANT_COUNT = 4;
const STAR_RADIUS_MAX = 15;
const STAR_RADIUS_MIN = 1.1;
const MIN_DRAWABLE_STAR_RADIUS = 1.2;
const THEME_COLOR_48_FALLBACK = "rgba(122, 28, 28, 0.48)";
const THEME_COLOR_25_FALLBACK = "rgba(122, 28, 28, 0.25)";

function seededVariant(seed: number) {
  const value = Math.abs(
    Math.sin(seed * HASH_SIN_MULTIPLIER) * HASH_SPREAD_MULTIPLIER,
  );
  const fraction = value - Math.floor(value);
  return Math.floor(fraction * STAR_VARIANT_COUNT);
}

function mapMagnitudeToRadius(
  mag: number,
  magnitudeExtent: [number, number],
): number {
  const [minMag, maxMag] = magnitudeExtent;
  const domain = maxMag - minMag;
  if (!Number.isFinite(domain) || domain <= 0) {
    return STAR_RADIUS_MIN;
  }

  const t = (mag - minMag) / domain;
  return STAR_RADIUS_MAX + t * (STAR_RADIUS_MIN - STAR_RADIUS_MAX);
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

type StarmapProps = {
  className?: string;
};

type CanvasLayout = {
  width: number;
  height: number;
  dpr: number;
};

export default function Starmap({ className }: StarmapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<SkyData | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasLayoutRef = useRef<CanvasLayout | null>(null);
  const themeColor48Ref = useRef<string>(THEME_COLOR_48_FALLBACK);
  const themeColor25Ref = useRef<string>(THEME_COLOR_25_FALLBACK);

  const readThemeColors = useCallback(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const themeColor = rootStyles.getPropertyValue("--theme-color-48").trim();
    const themeColor25 = rootStyles.getPropertyValue("--theme-color-25").trim();
    themeColor48Ref.current = themeColor || THEME_COLOR_48_FALLBACK;
    themeColor25Ref.current = themeColor25 || THEME_COLOR_25_FALLBACK;
  }, []);

  const draw = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const data = dataRef.current;
    if (!container || !canvas || !data) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const viewport = window.visualViewport;
    const vw = Math.floor(viewport?.width ?? window.innerWidth);
    const vh = Math.floor(viewport?.height ?? window.innerHeight);
    // Prefer actual container size to avoid drawing a larger-than-needed bitmap.
    // Fall back to viewport only if layout is temporarily reporting zero.
    const width = Math.max(1, Math.floor(rect.width > 0 ? rect.width : vw));
    const height = Math.max(1, Math.floor(rect.height > 0 ? rect.height : vh));

    const lastLayout = canvasLayoutRef.current;
    const layoutChanged =
      !lastLayout ||
      lastLayout.width !== width ||
      lastLayout.height !== height ||
      lastLayout.dpr !== dpr;

    if (layoutChanged) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvasLayoutRef.current = { width, height, dpr };
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const themeColor = themeColor48Ref.current;
    const themeColor25 = themeColor25Ref.current;

    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 2])
      // Keep perspective stable across narrow viewports (avoid min(width,height) compression).
      .scale(Math.max(MIN_SCALE_FACTOR, height / BASE_HEIGHT) * BASE_SCALE)
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
      .domain(data.magnitudeExtent)
      .range([STAR_RADIUS_MAX, STAR_RADIUS_MIN]);

    ctx.fillStyle = themeColor;
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 0.7;
    for (const star of data.stars) {
      const projected = projection(star.coordinates);
      if (!projected) continue;
      const [x, y] = projected;
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      const radius = magnitudeScale(star.mag);
      if (radius <= 1.6) {
        drawCrossGlyph(ctx, x, y, Math.max(1.4, radius * 1.8));
        continue;
      }

      if (star.variant === 1) {
        drawRectangularFourPointGlyph(ctx, x, y, radius);
        continue;
      }

      if (star.variant === 0) {
        drawStarGlyph(ctx, x, y, 4, radius);
        continue;
      }

      if (star.variant === 2) {
        drawStarGlyph(ctx, x, y, 5, radius);
        continue;
      }

      drawStarGlyph(ctx, x, y, 6, radius);
    }
  }, []);

  const requestDraw = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw();
    });
  }, [draw]);

  useEffect(() => {
    let cancelled = false;
    readThemeColors();

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
        // Pre-filter invalid stars and precompute static values once.
        const preparedStars: PreparedStar[] = [];
        for (const feature of stars.features) {
          const coordinates = feature.geometry?.coordinates;
          const mag = feature.properties?.mag;
          if (
            !coordinates ||
            !Array.isArray(coordinates) ||
            coordinates.length < 2 ||
            !Number.isFinite(coordinates[0]) ||
            !Number.isFinite(coordinates[1]) ||
            !Number.isFinite(mag)
          ) {
            continue;
          }

          const normalizedCoordinates: [number, number] = [
            coordinates[0],
            coordinates[1],
          ];
          const seed =
            normalizedCoordinates[0] * 1000 + normalizedCoordinates[1] * 1000;
          preparedStars.push({
            coordinates: normalizedCoordinates,
            mag,
            variant: seededVariant(seed),
          });
        }

        const rawMagnitudeExtent = d3.extent(preparedStars, (star) => star.mag);
        const magnitudeExtentBeforeFilter: [number, number] =
          rawMagnitudeExtent[0] !== undefined && rawMagnitudeExtent[1] !== undefined
            ? [rawMagnitudeExtent[0], rawMagnitudeExtent[1]]
            : [0, 1];

        const drawableStars = preparedStars.filter(
          (star) =>
            mapMagnitudeToRadius(star.mag, magnitudeExtentBeforeFilter) >=
            MIN_DRAWABLE_STAR_RADIUS,
        );

        const filteredMagnitudeExtentRaw = d3.extent(
          drawableStars,
          (star) => star.mag,
        );
        const magnitudeExtent: [number, number] =
          filteredMagnitudeExtentRaw[0] !== undefined &&
          filteredMagnitudeExtentRaw[1] !== undefined
            ? [filteredMagnitudeExtentRaw[0], filteredMagnitudeExtentRaw[1]]
            : magnitudeExtentBeforeFilter;

        dataRef.current = {
          stars: drawableStars,
          constellations,
          magnitudeExtent,
        };
        requestDraw();
      } catch (error) {
        console.error("Failed to load starmap data:", error);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [readThemeColors, requestDraw]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => requestDraw());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", requestDraw);
    window.addEventListener("resize", readThemeColors);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", requestDraw);
      window.removeEventListener("resize", readThemeColors);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [readThemeColors, requestDraw]);

  return (
    <div ref={containerRef} className={clsx(styles.root, className)}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

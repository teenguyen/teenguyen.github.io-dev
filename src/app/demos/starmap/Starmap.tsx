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

type ProjectedConstellation = {
  lines: [number, number][][];
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
// static fallback for solid theme color on the cream background so star transparency doesn't ovelap
const THEME_COLOR_48_SOLID_FALLBACK = "rgba(186, 139, 137, 1)";
const THEME_COLOR_25_FALLBACK = "rgba(122, 28, 28, 0.25)";
const ROTATION_DEGREES_PER_SECOND = 1;
const STAR_REVEAL_DURATION_MS = 700;
const CONSTELLATION_DRAW_SPEED_PX_PER_SECOND = 250;
const MAX_CONSTELLATION_SEGMENT_GAP_FACTOR = 0.2;

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
  beginCelestialReveal?: boolean;
};

type CanvasLayout = {
  width: number;
  height: number;
  dpr: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function toLinePoint(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const x = value[0];
  const y = value[1];
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return [x, y];
}

function getLineLength(points: [number, number][]) {
  if (points.length < 2) return 0;
  let length = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [fromX, fromY] = points[i];
    const [toX, toY] = points[i + 1];
    length += Math.hypot(toX - fromX, toY - fromY);
  }
  return length;
}

function splitLineOnProjectionGaps(
  points: [number, number][],
  maxGapPx: number,
): [number, number][][] {
  if (points.length < 2) return [];
  if (!Number.isFinite(maxGapPx) || maxGapPx <= 0) return [points];

  const segments: [number, number][][] = [];
  let currentSegment: [number, number][] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const previousPoint = points[i - 1];
    const currentPoint = points[i];
    const gap = Math.hypot(
      currentPoint[0] - previousPoint[0],
      currentPoint[1] - previousPoint[1],
    );

    if (gap > maxGapPx) {
      if (currentSegment.length >= 2) {
        segments.push(currentSegment);
      }
      currentSegment = [currentPoint];
      continue;
    }

    currentSegment.push(currentPoint);
  }

  if (currentSegment.length >= 2) {
    segments.push(currentSegment);
  }

  return segments;
}

function drawLineByDistance(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  distance: number,
) {
  if (points.length < 2 || distance <= 0) return;
  const [startX, startY] = points[0];
  ctx.moveTo(startX, startY);

  let remainingDistance = distance;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [fromX, fromY] = points[i];
    const [toX, toY] = points[i + 1];
    const segmentLength = Math.hypot(toX - fromX, toY - fromY);
    if (segmentLength <= 0) continue;

    if (remainingDistance >= segmentLength) {
      ctx.lineTo(toX, toY);
      remainingDistance -= segmentLength;
      continue;
    }

    if (remainingDistance > 0) {
      const ratio = remainingDistance / segmentLength;
      const x = fromX + (toX - fromX) * ratio;
      const y = fromY + (toY - fromY) * ratio;
      ctx.lineTo(x, y);
    }
    break;
  }
}

export default function Starmap({
  className,
  beginCelestialReveal = false,
}: StarmapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<SkyData | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasLayoutRef = useRef<CanvasLayout | null>(null);
  const themeColor48Ref = useRef<string>(THEME_COLOR_48_SOLID_FALLBACK);
  const themeColor25Ref = useRef<string>(THEME_COLOR_25_FALLBACK);
  const animationStartRef = useRef<number | null>(null);
  const revealStartRef = useRef<number | null>(null);
  const beginCelestialRevealRef = useRef(beginCelestialReveal);

  const readThemeColors = useCallback(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const themeColor48 = rootStyles
      .getPropertyValue("--theme-color-48-solid")
      .trim();
    const themeColor25 = rootStyles.getPropertyValue("--theme-color-25").trim();
    themeColor48Ref.current = themeColor48 || THEME_COLOR_48_SOLID_FALLBACK;
    themeColor25Ref.current = themeColor25 || THEME_COLOR_25_FALLBACK;
  }, []);

  const draw = useCallback((timeMs: number) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const data = dataRef.current;
    if (!container || !canvas || !data) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const rootEl = document.documentElement;
    const vw = Math.floor(rootEl.clientWidth || window.innerWidth);
    const vh = Math.floor(rootEl.clientHeight || window.innerHeight);

    const width = Math.max(
      1,
      Math.floor(
        container.clientWidth > 0
          ? container.clientWidth
          : rect.width > 0
            ? rect.width
            : vw,
      ),
    );
    const height = Math.max(
      1,
      Math.floor(
        container.clientHeight > 0
          ? container.clientHeight
          : rect.height > 0
            ? rect.height
            : vh,
      ),
    );

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
    let revealElapsedMs = 0;
    let starOpacity = 0;
    let constellationDrawDistance = 0;

    if (beginCelestialRevealRef.current) {
      if (revealStartRef.current === null) {
        revealStartRef.current = timeMs;
      }
      revealElapsedMs = timeMs - revealStartRef.current;
      starOpacity = clamp01(revealElapsedMs / STAR_REVEAL_DURATION_MS);
      constellationDrawDistance =
        (Math.max(0, revealElapsedMs - STAR_REVEAL_DURATION_MS) / 1000) *
        CONSTELLATION_DRAW_SPEED_PX_PER_SECOND;
    }

    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 2])
      // Keep perspective stable across narrow viewports (avoid min(width,height) compression).
      .scale(Math.max(MIN_SCALE_FACTOR, height / BASE_HEIGHT) * BASE_SCALE)
      .rotate([
        -(
          ((timeMs - (animationStartRef.current ?? timeMs)) / 1000) *
          ROTATION_DEGREES_PER_SECOND
        ),
        0,
      ])
      .angle(15);

    const graticulePath = d3.geoPath(projection, ctx);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    graticulePath(d3.geoGraticule10());
    ctx.stroke();

    if (
      constellationDrawDistance > 0 &&
      revealElapsedMs > STAR_REVEAL_DURATION_MS
    ) {
      ctx.strokeStyle = themeColor25;

      const projectedConstellations: ProjectedConstellation[] = [];
      const maxSegmentGapPx =
        Math.max(width, height) * MAX_CONSTELLATION_SEGMENT_GAP_FACTOR;
      for (const line of data.constellations.features) {
        const rawCoordinates = line.geometry?.coordinates;
        if (!Array.isArray(rawCoordinates)) continue;

        const projectedLines: [number, number][][] = [];
        for (const rawLine of rawCoordinates) {
          if (!Array.isArray(rawLine)) continue;
          const points: [number, number][] = [];
          for (const rawPoint of rawLine) {
            const linePoint = toLinePoint(rawPoint);
            if (!linePoint) continue;
            const projected = projection(linePoint);
            if (!projected) continue;
            const [x, y] = projected;
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            points.push([x, y]);
          }
          if (points.length >= 2) {
            const splitLines = splitLineOnProjectionGaps(points, maxSegmentGapPx);
            if (splitLines.length > 0) {
              projectedLines.push(...splitLines);
            }
          }
        }

        if (projectedLines.length === 0) continue;
        projectedConstellations.push({ lines: projectedLines });
      }

      projectedConstellations.forEach((constellation) => {
        let remainingDistance = constellationDrawDistance;
        ctx.beginPath();
        ctx.lineWidth = 0.8;

        for (const linePoints of constellation.lines) {
          const lineLength = getLineLength(linePoints);
          if (lineLength <= 0) continue;

          if (remainingDistance >= lineLength) {
            drawLineByDistance(ctx, linePoints, lineLength);
            remainingDistance -= lineLength;
            continue;
          }

          if (remainingDistance > 0) {
            drawLineByDistance(ctx, linePoints, remainingDistance);
          }
          break;
        }

        ctx.stroke();
      });
    }

    const magnitudeScale = d3
      .scaleLinear()
      .domain(data.magnitudeExtent)
      .range([STAR_RADIUS_MAX, STAR_RADIUS_MIN]);

    if (starOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = starOpacity;
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
      ctx.restore();
    }
  }, []);

  const requestDraw = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame((timeMs) => {
      rafRef.current = null;
      draw(timeMs);
    });
  }, [draw]);

  const startAnimation = useCallback(() => {
    if (rafRef.current !== null) return;
    const tick = (timeMs: number) => {
      if (animationStartRef.current === null) {
        animationStartRef.current = timeMs;
      }
      draw(timeMs);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
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
          rawMagnitudeExtent[0] !== undefined &&
          rawMagnitudeExtent[1] !== undefined
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
        startAnimation();
      } catch (error) {
        console.error("Failed to load starmap data:", error);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [readThemeColors, startAnimation]);

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
      animationStartRef.current = null;
    };
  }, [readThemeColors, requestDraw]);

  useEffect(() => {
    beginCelestialRevealRef.current = beginCelestialReveal;
    if (!beginCelestialReveal) {
      revealStartRef.current = null;
    }
  }, [beginCelestialReveal]);

  return (
    <div ref={containerRef} className={clsx(styles.root, className)}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

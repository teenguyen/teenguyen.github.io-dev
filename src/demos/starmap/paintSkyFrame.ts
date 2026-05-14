import * as d3 from "d3";
import {
  drawCrossGlyph,
  drawRectangularFourPointGlyph,
  drawStarGlyph,
} from "./glyphs";
import {
  drawLineByDistance,
  getLineLength,
  splitLineOnProjectionGaps,
  toLinePoint,
} from "./lineGeometry";
import { STAR_RADIUS_MAX, STAR_RADIUS_MIN } from "./stars";
import type { ProjectedConstellation, SkyData } from "./types";

export function resolveLabelFont(): string {
  const rootStyles = getComputedStyle(document.documentElement);
  const family =
    rootStyles.getPropertyValue("--font-open-sans").trim() || "Open Sans";
  return `400 11px ${family}, sans-serif`;
}

export function paintSkyFrame(options: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  perspectiveHeight: number;
  projection: d3.GeoProjection;
  themeColor: string;
  themeColor25: string;
  data: SkyData;
  starOpacity: number;
  constellationDrawDistance: number;
  constellationsVisible: boolean;
  showLabels: boolean;
  labelFont: string;
  /** Orthographic explorer: clip + cull back hemisphere; sparser graticule */
  interactive?: boolean;
  /** Interactive: multiply star glyph radii by projection.scale / baseScale (reference = default zoom). */
  starSizeScale?: number;
}): void {
  const {
    ctx,
    width,
    height,
    perspectiveHeight,
    projection,
    themeColor,
    themeColor25,
    data,
    starOpacity,
    constellationDrawDistance,
    constellationsVisible,
    showLabels,
    labelFont,
    interactive = false,
    starSizeScale = 1,
  } = options;

  const [tx, ty] = projection.translate();
  let centerGeo: [number, number] | null = null;
  if (interactive && projection.invert) {
    const inv = projection.invert([tx, ty]);
    if (
      inv &&
      inv.length >= 2 &&
      Number.isFinite(inv[0]) &&
      Number.isFinite(inv[1])
    ) {
      centerGeo = [inv[0], inv[1]];
    }
  }

  const onFrontHemisphere = (lon: number, lat: number) => {
    if (!interactive) return true;
    if (!centerGeo) return false;
    return d3.geoDistance([lon, lat], centerGeo) <= Math.PI / 2 + 1e-9;
  };

  if (interactive) {
    const r = projection.scale();
    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty, r, 0, 2 * Math.PI);
    ctx.clip();
  }

  const graticuleFeature = interactive
    ? d3.geoGraticule().stepMajor([45, 45]).stepMinor([90, 90])()
    : d3.geoGraticule10();

  const graticulePath = d3.geoPath(projection, ctx);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
  graticulePath(graticuleFeature);
  ctx.stroke();

  if (constellationDrawDistance > 0 && constellationsVisible) {
    ctx.strokeStyle = themeColor25;

    const projectedConstellations: ProjectedConstellation[] = [];
    const maxSegmentGapPx = Math.max(width, perspectiveHeight) * 0.2;
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
          if (!onFrontHemisphere(linePoint[0], linePoint[1])) continue;
          const projected = projection(linePoint);
          if (!projected) continue;
          const [x, y] = projected;
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
          points.push([x, y]);
        }
        if (points.length >= 2) {
          const splitLines = splitLineOnProjectionGaps(
            points,
            maxSegmentGapPx,
          );
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
    ctx.lineWidth = Math.max(0.35, 0.7 * starSizeScale);
    for (const star of data.stars) {
      if (
        !onFrontHemisphere(star.coordinates[0], star.coordinates[1])
      ) {
        continue;
      }
      const projected = projection(star.coordinates);
      if (!projected) continue;
      const [x, y] = projected;
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      const radius = magnitudeScale(star.mag) * starSizeScale;
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

  if (
    showLabels &&
    starOpacity > 0 &&
    data.constellationNames &&
    data.constellationNames.length > 0
  ) {
    ctx.save();
    ctx.globalAlpha = starOpacity;
    ctx.font = labelFont;
    ctx.fillStyle = themeColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const item of data.constellationNames) {
      if (
        !onFrontHemisphere(item.coordinates[0], item.coordinates[1])
      ) {
        continue;
      }
      const projected = projection(item.coordinates);
      if (!projected) continue;
      const [x, y] = projected;
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      if (x < -40 || y < -20 || x > width + 40 || y > height + 20) continue;
      ctx.fillText(item.label, x, y);
    }
    ctx.restore();
  }

  if (interactive) {
    ctx.restore();
  }
}

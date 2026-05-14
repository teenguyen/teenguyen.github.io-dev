import * as d3 from "d3";
import type { PreparedStar, StarCollection } from "./types";

const HASH_SIN_MULTIPLIER = 12.9898;
const HASH_SPREAD_MULTIPLIER = 43758.5453;
export const STAR_VARIANT_COUNT = 4;

export function seededVariant(seed: number) {
  const value = Math.abs(
    Math.sin(seed * HASH_SIN_MULTIPLIER) * HASH_SPREAD_MULTIPLIER,
  );
  const fraction = value - Math.floor(value);
  return Math.floor(fraction * STAR_VARIANT_COUNT);
}

export const STAR_RADIUS_MAX = 15;
export const STAR_RADIUS_MIN = 1.1;

export function mapMagnitudeToRadius(
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

export function prepareStarsFromCollection(stars: StarCollection): {
  drawableStars: PreparedStar[];
  magnitudeExtent: [number, number];
} {
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
      mapMagnitudeToRadius(star.mag, magnitudeExtentBeforeFilter) >= 1.2,
  );

  const filteredMagnitudeExtentRaw = d3.extent(drawableStars, (star) => star.mag);
  const magnitudeExtent: [number, number] =
    filteredMagnitudeExtentRaw[0] !== undefined &&
    filteredMagnitudeExtentRaw[1] !== undefined
      ? [filteredMagnitudeExtentRaw[0], filteredMagnitudeExtentRaw[1]]
      : magnitudeExtentBeforeFilter;

  return { drawableStars, magnitudeExtent };
}

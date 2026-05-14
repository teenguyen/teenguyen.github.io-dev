import type {
  ConstellationNamePoint,
  LineCollection,
  NameCollection,
  SkyData,
  StarCollection,
} from "./types";
import { prepareStarsFromCollection } from "./stars";

export async function fetchStarsAndLines(): Promise<
  Pick<SkyData, "stars" | "constellations" | "magnitudeExtent">
> {
  const [stars, constellations] = await Promise.all([
    fetch("/data/stars.json").then(
      (res) => res.json() as Promise<StarCollection>,
    ),
    fetch("/data/constellations.lines.json").then(
      (res) => res.json() as Promise<LineCollection>,
    ),
  ]);

  const { drawableStars, magnitudeExtent } = prepareStarsFromCollection(stars);

  return {
    stars: drawableStars,
    constellations,
    magnitudeExtent,
  };
}

export async function fetchConstellationNames(): Promise<
  ConstellationNamePoint[]
> {
  const data = await fetch("/data/constellations.names.json").then(
    (res) => res.json() as Promise<NameCollection>,
  );

  const out: ConstellationNamePoint[] = [];
  for (const f of data.features) {
    const name = f.properties?.name;
    if (!name || typeof name !== "string") continue;
    const coords = f.geometry?.coordinates;
    if (
      !Array.isArray(coords) ||
      coords.length < 2 ||
      !Number.isFinite(coords[0]) ||
      !Number.isFinite(coords[1])
    ) {
      continue;
    }
    out.push({
      coordinates: [coords[0], coords[1]],
      label: name,
    });
  }
  return out;
}

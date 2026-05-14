export const THEME_COLOR_48_SOLID_FALLBACK = "rgba(186, 139, 137, 1)";
export const THEME_COLOR_25_FALLBACK = "rgba(122, 28, 28, 0.25)";
export const STAR_REVEAL_DURATION_MS = 720;

export const AUTO_SPIN_DEG_PER_SEC = 1;
export const INTERACTIVE_IDLE_RESUME_MS = 4000;
export const MERCATOR_PHI_CLAMP = 80;
export const ZOOM_WHEEL_SENSITIVITY = 0.0012;
export const ZOOM_CLOSEST_FACTOR = 1.22;
export const FIT_MARGIN_PX = 24;
export const DRAG_SPEED_REF_PX_PER_SEC = 1200;
export const DRAG_LON_PER_PX = 0.035;
export const DRAG_LAT_PER_PX = 0.027;

export type StarFeature = {
  geometry: { coordinates: [number, number] };
  properties: { mag: number; bv?: number };
};

export type LineFeature = {
  geometry: { type: string; coordinates: unknown };
};

export type StarCollection = { features: StarFeature[] };
export type LineCollection = { features: LineFeature[] };

export type NamePointFeature = {
  geometry: { type: string; coordinates: unknown };
  properties: { name?: string };
};

export type NameCollection = { features: NamePointFeature[] };

export type PreparedStar = {
  coordinates: [number, number];
  mag: number;
  variant: number;
};

export type ConstellationNamePoint = {
  coordinates: [number, number];
  label: string;
};

export type ProjectedConstellation = {
  lines: [number, number][][];
};

export type SkyData = {
  stars: PreparedStar[];
  constellations: LineCollection;
  magnitudeExtent: [number, number];
  constellationNames?: ConstellationNamePoint[];
};

export type CanvasLayout = {
  width: number;
  height: number;
  dpr: number;
};

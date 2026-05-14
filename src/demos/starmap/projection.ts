import * as d3 from "d3";
import {
  AUTO_SPIN_DEG_PER_SEC,
  FIT_MARGIN_PX,
  ZOOM_CLOSEST_FACTOR,
} from "./types";

/** Max zoom-out scale for interactive orthographic (visible hemisphere). */
export function computeGlobeFitScale(width: number, height: number): number {
  const w = Math.max(width, FIT_MARGIN_PX * 2 + 2);
  const h = Math.max(height, FIT_MARGIN_PX * 2 + 2);
  const projection = d3.geoOrthographic().clipAngle(90);
  projection.fitExtent(
    [
      [FIT_MARGIN_PX, FIT_MARGIN_PX],
      [w - FIT_MARGIN_PX, h - FIT_MARGIN_PX],
    ],
    { type: "Sphere" },
  );
  return projection.scale();
}

export function buildStarmapProjection(options: {
  width: number;
  height: number;
  perspectiveHeight: number;
  timeMs: number;
  animationStartMs: number | null;
  interactive: boolean;
  userLambda: number;
  userPhi: number;
  userZoomFactor: number;
  scaleMinFit: number;
  autoSpinPaused: boolean;
  frozenAutoSpinLambda: number;
}): d3.GeoProjection {
  const baseScale = Math.max(0.72, options.perspectiveHeight / 1000) * 1000;

  let scale: number;
  let autoSpinLambda: number;

  if (options.interactive) {
    const scaleMax = baseScale * ZOOM_CLOSEST_FACTOR;
    const rawScale = options.userZoomFactor * baseScale;
    scale = Math.min(scaleMax, Math.max(options.scaleMinFit, rawScale));

    if (options.autoSpinPaused) {
      autoSpinLambda = options.frozenAutoSpinLambda;
    } else {
      const t0 = options.animationStartMs ?? options.timeMs;
      autoSpinLambda = -((options.timeMs - t0) / 1000) * AUTO_SPIN_DEG_PER_SEC;
    }

    const lambdaTotal = options.userLambda + autoSpinLambda;

    return d3
      .geoOrthographic()
      .translate([options.width / 2, options.height / 2])
      .scale(scale)
      .rotate([lambdaTotal, options.userPhi, 0])
      .clipAngle(90);
  }

  scale = baseScale;
  const t0 = options.animationStartMs ?? options.timeMs;
  autoSpinLambda = -((options.timeMs - t0) / 1000) * AUTO_SPIN_DEG_PER_SEC;

  return d3
    .geoMercator()
    .translate([options.width / 2, options.height / 2])
    .scale(scale)
    .rotate([autoSpinLambda, 0, 0])
    .angle(15);
}

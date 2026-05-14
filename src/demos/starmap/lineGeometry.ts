export function toLinePoint(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const x = value[0];
  const y = value[1];
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return [x, y];
}

export function getLineLength(points: [number, number][]) {
  if (points.length < 2) return 0;
  let length = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [fromX, fromY] = points[i];
    const [toX, toY] = points[i + 1];
    length += Math.hypot(toX - fromX, toY - fromY);
  }
  return length;
}

export function splitLineOnProjectionGaps(
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

export function drawLineByDistance(
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

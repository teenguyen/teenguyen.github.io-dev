export function drawStarGlyph(
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

export function drawRectangularFourPointGlyph(
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

export function drawCrossGlyph(
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

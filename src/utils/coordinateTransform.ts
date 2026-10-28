export interface TransformConfig {
  xDomain: [number, number];
  yDomain: [number, number];
  width: number;
  height: number;
  padding?: number;
}

export interface CoordinateTransform {
  toPixelX: (x: number) => number;
  toPixelY: (y: number) => number;
  toPixel: (x: number, y: number) => { px: number; py: number };
  toDataX: (px: number) => number;
  toDataY: (py: number) => number;
  toData: (px: number, py: number) => { x: number; y: number };
  width: number;
  height: number;
  padding: number;
  xDomain: [number, number];
  yDomain: [number, number];
}

export function createTransform(config: TransformConfig): CoordinateTransform {
  const { xDomain, yDomain, width, height, padding = 40 } = config;
  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const toPixelX = (x: number) => {
    if (xMax === xMin) return padding + innerWidth / 2;
    return padding + ((x - xMin) / (xMax - xMin)) * innerWidth;
  };

  const toPixelY = (y: number) => {
    if (yMax === yMin) return padding + innerHeight / 2;
    // SVG y-axis is inverted (0 at top)
    return height - padding - ((y - yMin) / (yMax - yMin)) * innerHeight;
  };

  const toPixel = (x: number, y: number) => ({
    px: toPixelX(x),
    py: toPixelY(y),
  });

  const toDataX = (px: number) => {
    return xMin + ((px - padding) / innerWidth) * (xMax - xMin);
  };

  const toDataY = (py: number) => {
    return yMin + ((height - padding - py) / innerHeight) * (yMax - yMin);
  };

  const toData = (px: number, py: number) => ({
    x: toDataX(px),
    y: toDataY(py),
  });

  return {
    toPixelX,
    toPixelY,
    toPixel,
    toDataX,
    toDataY,
    toData,
    width,
    height,
    padding,
    xDomain,
    yDomain,
  };
}

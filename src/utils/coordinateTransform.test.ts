import { describe, it, expect } from 'vitest';
import { createTransform } from './coordinateTransform';

describe('createTransform', () => {
  it('maps data coordinates to pixel coordinates correctly', () => {
    const transform = createTransform({
      xDomain: [-10, 10],
      yDomain: [-10, 10],
      width: 400,
      height: 400,
      padding: 0,
    });

    expect(transform.toPixelX(0)).toBe(200);
    expect(transform.toPixelY(0)).toBe(200);

    expect(transform.toPixelX(10)).toBe(400);
    expect(transform.toPixelY(10)).toBe(0); // inverted SVG y

    expect(transform.toPixelX(-10)).toBe(0);
    expect(transform.toPixelY(-10)).toBe(400);
  });

  it('maps pixels back to data coordinates', () => {
    const transform = createTransform({
      xDomain: [0, 100],
      yDomain: [0, 100],
      width: 500,
      height: 500,
      padding: 50,
    });

    const { x, y } = transform.toData(250, 250);
    expect(x).toBe(50);
    expect(y).toBe(50);
  });
});

import React from 'react';
import { createTransform, CoordinateTransform } from '../../../utils/coordinateTransform';
import { Point } from '../primitives/Point';
import { DashedProjection } from '../primitives/DashedProjection';
import { Line, CirclePrimitive, PolygonPrimitive, PolylinePrimitive } from '../primitives/Primitives';

export interface CartesianPlaneProps {
  domain?: {
    x?: [number, number];
    y?: [number, number];
  };
  x_range?: [number, number];
  y_range?: [number, number];
  grid?: boolean;
  axes?: {
    arrows?: boolean;
  };
  x_label?: string;
  y_label?: string;
  children?: any[];
  elements?: any[];
  width?: number;
  height?: number;
}

export const CartesianPlane: React.FC<CartesianPlaneProps> = ({
  domain,
  x_range,
  y_range,
  grid = false,
  axes = { arrows: true },
  x_label = 'x',
  y_label = 'y',
  children,
  elements,
  width = 400,
  height = 300,
}) => {
  const xDomain = domain?.x || x_range || [-6, 6];
  const yDomain = domain?.y || y_range || [-6, 6];

  const transform = createTransform({
    xDomain,
    yDomain,
    width,
    height,
    padding: 35,
  });

  const originPx = transform.toPixelX(0);
  const originPy = transform.toPixelY(0);

  const renderChild = (child: any, key: number) => {
    if (!child) return null;
    const type = child.type;

    switch (type) {
      case 'circle':
        return (
          <React.Fragment key={key}>
            <CirclePrimitive
              center={child.center || [0, 0]}
              radius={child.radius || 1}
              color={child.color || '#2563eb'}
              transform={transform}
            />
            {child.label && child.center && (
              <Point coords={child.center} label={child.label} transform={transform} />
            )}
          </React.Fragment>
        );
      case 'point':
        if (child.dashed_to_axis || child.dashed) {
          return (
            <DashedProjection
              key={key}
              coords={child.coords || [child.x || 0, child.y || 0]}
              label={child.label}
              toAxis={child.dashed_to_axis || child.dashed}
              transform={transform}
            />
          );
        }
        return (
          <Point
            key={key}
            coords={child.coords || [child.x || 0, child.y || 0]}
            label={child.label}
            labelPosition={child.label_position}
            transform={transform}
          />
        );
      case 'line':
        return (
          <Line
            key={key}
            p1={child.p1}
            p2={child.p2}
            points={child.points}
            slope={child.slope}
            intercept={child.intercept}
            color={child.color}
            transform={transform}
          />
        );
      case 'polygon':
        return (
          <PolygonPrimitive
            key={key}
            points={child.points || []}
            color={child.color}
            fill={child.fill}
            transform={transform}
          />
        );
      case 'polyline':
        return (
          <PolylinePrimitive
            key={key}
            points={child.points || []}
            color={child.color}
            transform={transform}
          />
        );
      default:
        return null;
    }
  };

  const childList = children || elements || [];

  return (
    <svg width={width} height={height} className="cartesian-plane bg-white rounded border border-slate-200">
      {/* Grid Lines */}
      {grid && (
        <g className="grid-lines" stroke="#e2e8f0" strokeWidth={1}>
          {Array.from({ length: Math.floor(xDomain[1] - xDomain[0]) + 1 }).map((_, i) => {
            const val = Math.ceil(xDomain[0]) + i;
            const px = transform.toPixelX(val);
            return <line key={`gx-${i}`} x1={px} y1={0} x2={px} y2={height} />;
          })}
          {Array.from({ length: Math.floor(yDomain[1] - yDomain[0]) + 1 }).map((_, i) => {
            const val = Math.ceil(yDomain[0]) + i;
            const py = transform.toPixelY(val);
            return <line key={`gy-${i}`} x1={0} y1={py} x2={width} y2={py} />;
          })}
        </g>
      )}

      {/* X and Y Axes */}
      <line x1={0} y1={originPy} x2={width} y2={originPy} stroke="#334155" strokeWidth={1.5} />
      <line x1={originPx} y1={0} x2={originPx} y2={height} stroke="#334155" strokeWidth={1.5} />

      {/* Axis Labels */}
      <text x={width - 15} y={originPy - 8} fontSize={12} fontWeight="bold" fill="#334155">
        {x_label}
      </text>
      <text x={originPx + 8} y={15} fontSize={12} fontWeight="bold" fill="#334155">
        {y_label}
      </text>

      {/* Render Primitive Children */}
      {childList.map((child, idx) => renderChild(child, idx))}
    </svg>
  );
};

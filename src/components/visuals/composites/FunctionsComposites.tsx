import React from 'react';
import { CartesianPlane } from './CartesianPlane';
import { createTransform } from '../../../utils/coordinateTransform';
import { Point } from '../primitives/Point';

export interface FunctionPlotProps {
  form?: 'quadratic' | 'linear' | 'piecewise';
  params?: {
    a?: number;
    b?: number;
    c?: number;
    slope?: number;
    intercept?: number;
  };
  annotations?: {
    vertex?: [number, number];
    axisOfSymmetry?: number;
    roots?: number[];
  };
  domain?: {
    x?: [number, number];
    y?: [number, number];
  };
  width?: number;
  height?: number;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  form = 'quadratic',
  params = { a: 1, b: 0, c: -4 },
  annotations,
  domain,
  width = 400,
  height = 300,
}) => {
  const xDomain = domain?.x || [-5, 5];
  const yDomain = domain?.y || [-6, 6];

  const transform = createTransform({
    xDomain,
    yDomain,
    width,
    height,
    padding: 35,
  });

  // Generate sampled path points
  const points: [number, number][] = [];
  const step = (xDomain[1] - xDomain[0]) / 100;

  for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
    let y = 0;
    if (form === 'quadratic') {
      const a = params.a ?? 1;
      const b = params.b ?? 0;
      const c = params.c ?? 0;
      y = a * x * x + b * x + c;
    } else if (form === 'linear') {
      const m = params.slope ?? 1;
      const b = params.intercept ?? 0;
      y = m * x + b;
    }
    points.push([x, y]);
  }

  const pathD = points
    .map((pt, idx) => {
      const { px, py } = transform.toPixel(pt[0], pt[1]);
      return `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
    })
    .join(' ');

  return (
    <div className="relative inline-block">
      <CartesianPlane domain={domain} width={width} height={height} />
      <svg
        width={width}
        height={height}
        className="absolute top-0 left-0 pointer-events-none"
      >
        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2.5} />

        {/* Axis of Symmetry */}
        {annotations?.axisOfSymmetry !== undefined && (
          <line
            x1={transform.toPixelX(annotations.axisOfSymmetry)}
            y1={0}
            x2={transform.toPixelX(annotations.axisOfSymmetry)}
            y2={height}
            stroke="#e11d48"
            strokeDasharray="4,4"
            strokeWidth={1.5}
          />
        )}

        {/* Vertex Annotation */}
        {annotations?.vertex && (
          <Point
            coords={annotations.vertex}
            label={`V(${annotations.vertex[0]}, ${annotations.vertex[1]})`}
            color="#e11d48"
            transform={transform}
          />
        )}
      </svg>
    </div>
  );
};

export interface MultiViewGridProps {
  layout?: {
    rows: number;
    cols: number;
  };
  views?: Array<{
    id?: string;
    label?: string;
    visual?: any;
  }>;
  width?: number;
  height?: number;
  renderVisual?: (visualSpec: any) => React.ReactNode;
}

export const MultiViewGrid: React.FC<MultiViewGridProps> = ({
  layout = { rows: 2, cols: 2 },
  views = [],
  renderVisual,
}) => {
  const cols = layout.cols || 2;

  return (
    <div
      className="multi-view-grid grid gap-3 p-2 bg-slate-50 border border-slate-200 rounded"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {views.map((view, idx) => (
        <div
          key={view.id || idx}
          className="view-item flex flex-col items-center bg-white p-2 rounded shadow-sm border border-slate-100"
        >
          {view.label && (
            <div className="text-sm font-bold text-slate-700 mb-1">{view.label}</div>
          )}
          {renderVisual ? (
            renderVisual(view.visual)
          ) : (
            <CartesianPlane {...view.visual} width={220} height={180} />
          )}
        </div>
      ))}
    </div>
  );
};

export interface CurveRegionProps {
  curvePoints?: [number, number][];
  boundedRegion?: [number, number][];
  width?: number;
  height?: number;
  domain?: { x?: [number, number]; y?: [number, number] };
}

export const CurveRegion: React.FC<CurveRegionProps> = ({
  curvePoints = [[0, 0], [2, 4], [4, 0]],
  width = 400,
  height = 250,
  domain = { x: [-1, 5], y: [-1, 5] },
}) => {
  return (
    <CartesianPlane
      domain={domain}
      width={width}
      height={height}
      children={[
        { type: 'polyline', points: curvePoints, color: '#0284c7' },
        ...curvePoints.map((pt, i) => ({
          type: 'point',
          coords: pt,
          label: `P${i + 1}`,
        })),
      ]}
    />
  );
};

export interface TransformationOverlayProps {
  polygons?: { points: [number, number][]; label?: string; color?: string }[];
  transformations?: { type: string; fromLabel?: string; toLabel?: string }[];
  domain?: { x?: [number, number]; y?: [number, number] };
  width?: number;
  height?: number;
}

export const TransformationOverlay: React.FC<TransformationOverlayProps> = ({
  polygons = [],
  domain = { x: [-6, 6], y: [-6, 6] },
  width = 400,
  height = 300,
}) => {
  const children = polygons.map((poly) => ({
    type: 'polygon',
    points: poly.points,
    color: poly.color || '#2563eb',
  }));

  return (
    <CartesianPlane domain={domain} width={width} height={height} children={children} />
  );
};

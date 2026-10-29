import React from 'react';
import { CartesianCanvas } from './CartesianPlane';
import { createTransform } from '../../../utils/coordinateTransform';
import { smoothPath } from '../../../utils/smoothPath';
import { Point } from '../primitives/Point';

const CURVE_COLOR = 'var(--visual-primary, #2563eb)';
const ANNOTATION_COLOR = 'var(--visual-annotation, #e11d48)';

interface QuadraticCoeffs {
  a: number;
  b: number;
  c: number;
}

function deriveQuadratic(params: any): QuadraticCoeffs {
  if (
    params?.a !== undefined ||
    params?.b !== undefined ||
    params?.c !== undefined
  ) {
    return {
      a: params?.a ?? 1,
      b: params?.b ?? 0,
      c: params?.c ?? 0,
    };
  }

  const vertex = params?.vertex as [number, number] | undefined;
  const roots = params?.roots as number[] | undefined;

  if (vertex && roots && roots.length >= 2) {
    const [r1, r2] = roots;
    const h = vertex[0];
    const k = vertex[1];
    const denom = (h - r1) * (h - r2);
    const sign = params?.opens === 'down' ? -1 : 1;
    const a = denom !== 0 ? k / denom : sign;
    return { a, b: -a * (r1 + r2), c: a * r1 * r2 };
  }

  return { a: 1, b: 0, c: -4 };
}

export interface FunctionPlotProps {
  form?: 'quadratic' | 'linear' | 'piecewise' | 'sqrt' | 'exponential' | 'logarithmic' | string;
  params?: any;
  annotations?: any;
  domain?: { x?: [number, number]; y?: [number, number] };
  width?: number;
  height?: number;
  function_label?: string;
  x_label?: string;
  y_label?: string;
  grid?: boolean;
}

export const FunctionPlot: React.FC<FunctionPlotProps> = ({
  form = 'quadratic',
  params = {},
  annotations,
  domain,
  width = 400,
  height = 300,
  function_label,
  x_label = 'x',
  y_label = 'y',
  grid = false,
}) => {
  const xDomain = domain?.x || [-5, 5];
  const yDomain = domain?.y || [-6, 6];

  const transform = createTransform({
    xDomain,
    yDomain,
    width,
    height,
    padding: 35,
    preserveAspect: false,
  });

  const points: [number, number][] = [];
  const step = (xDomain[1] - xDomain[0]) / 180;

  if (form === 'linear') {
    const m = params?.slope ?? params?.m ?? 1;
    const b = params?.intercept ?? params?.b ?? 0;
    for (let x = xDomain[0]; x <= xDomain[1] + step; x += step) {
      points.push([x, m * x + b]);
    }
  } else if (form === 'sqrt') {
    const a = params?.a ?? 1;
    const h = params?.h ?? params?.origin?.[0] ?? 0;
    const k = params?.k ?? params?.origin?.[1] ?? 0;
    const startX = Math.max(xDomain[0], h);
    for (let x = startX; x <= xDomain[1] + step; x += step) {
      const val = x - h;
      if (val >= 0) {
        points.push([x, a * Math.sqrt(val) + k]);
      }
    }
  } else if (form === 'exponential') {
    const a = params?.a ?? 1;
    const b = params?.base ?? params?.b ?? Math.E;
    const c = params?.c ?? params?.vertical_shift ?? 0;
    const rate = params?.k ?? 1;
    for (let x = xDomain[0]; x <= xDomain[1] + step; x += step) {
      const yVal = a * Math.pow(b, rate * x) + c;
      if (Number.isFinite(yVal) && yVal >= yDomain[0] - 10 && yVal <= yDomain[1] + 10) {
        points.push([x, yVal]);
      }
    }
  } else if (form === 'logarithmic') {
    const a = params?.a ?? 1;
    const b = params?.base ?? params?.b ?? Math.E;
    const h = params?.h ?? params?.asymptote ?? 0;
    const k = params?.k ?? 0;
    const startX = Math.max(xDomain[0], h + 0.01);
    for (let x = startX; x <= xDomain[1] + step; x += step) {
      const val = x - h;
      if (val > 0) {
        const logVal = Math.log(val) / Math.log(b);
        const yVal = a * logVal + k;
        if (Number.isFinite(yVal) && yVal >= yDomain[0] - 10 && yVal <= yDomain[1] + 10) {
          points.push([x, yVal]);
        }
      }
    }
  } else if (form === 'piecewise' && Array.isArray(params?.points)) {
    points.push(...params.points);
  } else {
    const { a, b, c } = deriveQuadratic(params);
    for (let x = xDomain[0]; x <= xDomain[1] + step; x += step) {
      points.push([x, a * x * x + b * x + c]);
    }
  }

  const pathD = smoothPath(points, transform);

  const coeffs = form === 'quadratic' ? deriveQuadratic(params) : null;
  const vertexFromCoeffs: [number, number] | undefined = coeffs
    ? [-coeffs.b / (2 * coeffs.a), coeffs.c - (coeffs.b * coeffs.b) / (4 * coeffs.a)]
    : undefined;

  const vertex: [number, number] =
    (Array.isArray(params?.vertex) && (params.vertex as [number, number])) ||
    (Array.isArray(annotations?.vertex) && (annotations.vertex as [number, number])) ||
    vertexFromCoeffs ||
    [0, 0];

  const roots: number[] = Array.isArray(params?.roots)
    ? params.roots
    : Array.isArray(annotations?.roots)
    ? annotations.roots
    : [];

  const showVertex = annotations?.vertex?.show !== false;
  const showRoots = annotations?.roots?.show !== false;
  const showAxis = annotations?.axis_of_symmetry?.show === true;
  const axisX = annotations?.axis_of_symmetry?.x ?? vertex[0];

  const vertexLabel =
    annotations?.vertex?.label ||
    (vertexFromCoeffs ? `V(${vertex[0]}, ${vertex[1]})` : undefined);

  const rootLabels: string[] = annotations?.roots?.labels || roots.map((r) => String(r));

  const overlay = (
    <g>
      {/* Axis of symmetry */}
      {showAxis && (
        <line
          x1={transform.toPixelX(axisX)}
          y1={transform.offsetY}
          x2={transform.toPixelX(axisX)}
          y2={transform.offsetY + transform.plotHeight}
          stroke={ANNOTATION_COLOR}
          strokeDasharray="4,4"
          strokeWidth={1.5}
        />
      )}

      {/* Function curve */}
      <path d={pathD} fill="none" stroke={CURVE_COLOR} strokeWidth={2.5} strokeLinejoin="round" />

      {/* Function label */}
      {function_label && (
        <text
          x={transform.toPixelX(vertex[0]) + 14}
          y={transform.toPixelY(vertex[1]) - 14}
          fontSize={13}
          fontWeight="bold"
          fontStyle="italic"
          fill={CURVE_COLOR}
          stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
          strokeWidth="3.5px"
          paintOrder="stroke fill"
          strokeLinejoin="round"
        >
          {function_label}
        </text>
      )}

      {/* Roots */}
      {showRoots &&
        roots.map((r, i) => (
          <Point
            key={`root-${i}`}
            coords={[r, 0]}
            label={rootLabels[i] ?? String(r)}
            labelPosition="bottom"
            color={ANNOTATION_COLOR}
            transform={transform}
          />
        ))}

      {/* Vertex */}
      {showVertex && (
        <Point
          coords={vertex}
          label={vertexLabel}
          labelPosition={params?.opens === 'down' ? 'bottom' : 'top'}
          color={ANNOTATION_COLOR}
          transform={transform}
        />
      )}

      {/* Vertex projections to axes */}
      {annotations?.vertex?.project_to?.map((axis: string, i: number) => (
        <React.Fragment key={`proj-${i}`}>
          {axis === 'x' && (
            <line
              x1={transform.toPixelX(vertex[0])}
              y1={transform.toPixelY(vertex[1])}
              x2={transform.toPixelX(vertex[0])}
              y2={transform.toPixelY(0)}
              stroke={ANNOTATION_COLOR}
              strokeDasharray="4,4"
              strokeWidth={1.2}
            />
          )}
          {axis === 'y' && (
            <line
              x1={transform.toPixelX(vertex[0])}
              y1={transform.toPixelY(vertex[1])}
              x2={transform.toPixelX(0)}
              y2={transform.toPixelY(vertex[1])}
              stroke={ANNOTATION_COLOR}
              strokeDasharray="4,4"
              strokeWidth={1.2}
            />
          )}
        </React.Fragment>
      ))}
    </g>
  );

  return (
    <CartesianCanvas
      domain={domain}
      width={width}
      height={height}
      grid={grid}
      x_label={x_label}
      y_label={y_label}
      preserveAspect={false}
      overlay={overlay}
    />
  );
};

export interface MultiViewGridProps {
  layout?: {
    rows: number;
    cols: number;
    original?: boolean;
  };
  views?: Array<{
    id?: string;
    label?: string;
    visual?: any;
  }>;
  original?: {
    label?: string;
    visual?: any;
  };
  width?: number;
  height?: number;
  renderVisual?: (visualSpec: any) => React.ReactNode;
}

export const MultiViewGrid: React.FC<MultiViewGridProps> = ({
  layout = { rows: 2, cols: 2 },
  views = [],
  original,
  renderVisual,
}) => {
  const cols = layout.cols || 2;

  const renderView = (view: any) => {
    const content = renderVisual ? renderVisual(view.visual) : null;
    return (
      <div className="view-item flex flex-col items-center bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-xs border border-zinc-200 dark:border-zinc-800 transition-colors w-full">
        {view.label && (
          <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
            {view.label}
          </div>
        )}
        {content}
      </div>
    );
  };

  return (
    <div className="multi-view-grid w-full space-y-2 p-2 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-colors">
      {original && (
        <div className="view-item flex flex-col items-center bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-xs border border-zinc-200 dark:border-zinc-800 transition-colors">
          {original.label && (
            <div className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              {original.label}
            </div>
          )}
          {renderVisual ? renderVisual(original.visual) : null}
        </div>
      )}
      <div
        className="grid gap-2 grid-cols-1 sm:grid-cols-2"
        style={{
          gridTemplateColumns:
            cols > 2
              ? `repeat(auto-fit, minmax(180px, 1fr))`
              : undefined,
        }}
      >
        {views.map((view, idx) => (
          <div key={view.id || idx} className="flex justify-center w-full">
            {renderView(view)}
          </div>
        ))}
      </div>
    </div>
  );
};

export interface CurveRegionProps {
  path?: {
    points?: [number, number][];
    label?: string;
  };
  curvePoints?: [number, number][];
  straight_segments?: Array<{ from: [number, number]; to: [number, number] }>;
  base?: { from: [number, number]; to: [number, number] };
  width?: number;
  height?: number;
  domain?: { x?: [number, number]; y?: [number, number] };
  grid?: boolean;
}

export const CurveRegion: React.FC<CurveRegionProps> = ({
  path,
  curvePoints,
  straight_segments = [],
  base,
  width = 400,
  height = 260,
  domain = { x: [-1, 5], y: [-1, 5] },
  grid = true,
}) => {
  const pathPoints = path?.points || curvePoints || [];

  const children: any[] = [];
  if (pathPoints.length > 0) {
    children.push({ type: 'path', points: pathPoints, color: '#0284c7', strokeWidth: 2.5 });
  }
  straight_segments.forEach((seg) => {
    children.push({ type: 'line', p1: seg.from, p2: seg.to, color: '#1e293b', strokeWidth: 2 });
  });
  if (base) {
    children.push({ type: 'line', p1: base.from, p2: base.to, color: '#1e293b', strokeWidth: 2 });
  }

  return (
    <CartesianCanvas domain={domain} width={width} height={height} grid={grid}>
      {children}
    </CartesianCanvas>
  );
};

export interface TransformationOverlayProps {
  figures?: Array<{
    type?: string;
    vertices?: [number, number][];
    points?: [number, number][];
    label?: string;
    color?: string;
  }>;
  polygons?: { points: [number, number][]; label?: string; color?: string }[];
  transformations?: { type: string; fromLabel?: string; toLabel?: string }[];
  domain?: { x?: [number, number]; y?: [number, number] };
  width?: number;
  height?: number;
  grid?: boolean;
}

export const TransformationOverlay: React.FC<TransformationOverlayProps> = ({
  figures,
  polygons = [],
  domain = { x: [-6, 6], y: [-6, 6] },
  width = 400,
  height = 300,
  grid = true,
}) => {
  const children: any[] = [];

  const figureList: Array<{
    vertices?: [number, number][];
    points?: [number, number][];
    label?: string;
    color?: string;
  }> = figures
    ? figures
    : polygons.map((poly) => ({
        vertices: poly.points,
        label: poly.label,
        color: poly.color,
      }));

  figureList.forEach((fig) => {
    const points = fig.vertices || fig.points || [];
    if (points.length === 0) return;
    const labels = fig.label ? [fig.label] : undefined;
    children.push({
      type: 'polygon',
      vertices: points,
      color: fig.color || '#2563eb',
      fill: fig.color ? `${fig.color}22` : 'rgba(37, 99, 235, 0.1)',
      labels,
    });
  });

  return (
    <CartesianCanvas domain={domain} width={width} height={height} grid={grid}>
      {children}
    </CartesianCanvas>
  );
};

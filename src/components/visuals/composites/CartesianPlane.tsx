import React, { useId } from 'react';
import { createTransform, CoordinateTransform } from '../../../utils/coordinateTransform';
import { niceTicks } from '../../../utils/ticks';
import { smoothPath } from '../../../utils/smoothPath';
import { Point } from '../primitives/Point';
import { DashedProjection } from '../primitives/DashedProjection';
import {
  Line,
  CirclePrimitive,
  PolygonPrimitive,
  PolylinePrimitive,
} from '../primitives/Primitives';

export interface CartesianCanvasProps {
  domain?: { x?: [number, number]; y?: [number, number] };
  x_range?: [number, number];
  y_range?: [number, number];
  grid?: boolean;
  axes?: { arrows?: boolean };
  show_ticks?: boolean;
  show_tick_labels?: boolean;
  show_numbers?: boolean;
  x_label?: string;
  y_label?: string;
  children?: any[];
  elements?: any[];
  width?: number;
  height?: number;
  maxWidth?: number | string;
  padding?: number;
  preserveAspect?: boolean;
  overlay?: React.ReactNode;
}

const AXIS_COLOR = 'var(--visual-axis, currentColor)';
const GRID_COLOR = 'var(--visual-grid, #e2e8f0)';
const TICK_COLOR = 'var(--visual-tick, #64748b)';

const COLOR_MAP: Record<string, string> = {
  'indigo-600': 'var(--visual-primary, #4f46e5)',
  'indigo-500': 'var(--visual-primary, #6366f1)',
  'indigo-700': 'var(--visual-primary, #4338ca)',
  'indigo-50/20': 'rgba(99, 102, 241, 0.12)',
  'indigo-50/30': 'rgba(99, 102, 241, 0.18)',
  'stone-800': 'var(--visual-text, #27272a)',
  'stone-900': 'var(--visual-text, #18181b)',
  'stone-400': '#a1a1aa',
  'amber-600': '#d97706',
};

const resolveColor = (child: any, fallback: string) => {
  const raw = child.color || child.stroke || fallback;
  return COLOR_MAP[raw] || raw;
};

const resolveWidth = (child: any, fallback: number) =>
  child.strokeWidth ?? child.width ?? fallback;

export function renderPrimitive(child: any, transform: CoordinateTransform, key: number): React.ReactNode {
  if (!child) return null;
  const type = child.type;

  switch (type) {
    case 'circle':
      return (
        <React.Fragment key={key}>
          <CirclePrimitive
            center={child.center || [0, 0]}
            radius={child.radius || 1}
            color={resolveColor(child, 'var(--visual-primary, #2563eb)')}
            fill={COLOR_MAP[child.fill] || child.fill || 'none'}
            strokeWidth={resolveWidth(child, 2)}
            dashed={child.dashed}
            transform={transform}
          />
          {child.label && child.center && (
            <Point coords={child.center} label={child.label} transform={transform} color={resolveColor(child, 'var(--visual-primary, #2563eb)')} />
          )}
        </React.Fragment>
      );

    case 'point': {
      const coords: [number, number] = child.coords || [child.x ?? 0, child.y ?? 0];
      if (child.dashed_to_axis || child.dashed) {
        return (
          <DashedProjection
            key={key}
            coords={coords}
            label={child.label}
            toAxis={child.dashed_to_axis || child.dashed}
            color={resolveColor(child, 'var(--visual-tick, #64748b)')}
            transform={transform}
          />
        );
      }
      return (
        <Point
          key={key}
          coords={coords}
          label={child.label}
          labelPosition={child.label_position}
          color={resolveColor(child, 'var(--visual-primary, #2563eb)')}
          radius={child.radius}
          transform={transform}
        />
      );
    }

    case 'dashed_projection': {
      const coords: [number, number] = child.from || child.coords || [child.x ?? 0, child.y ?? 0];
      return (
        <DashedProjection
          key={key}
          coords={coords}
          toAxis={child.to_axis || child.toAxis || 'both'}
          label={child.label}
          color={resolveColor(child, '#64748b')}
          transform={transform}
        />
      );
    }

    case 'line': {
      const through: [number, number][] | undefined =
        child.through || (child.p1 && child.p2 ? [child.p1, child.p2] : undefined);
      return (
        <Line
          key={key}
          p1={child.p1}
          p2={child.p2}
          points={child.points || through}
          slope={child.slope}
          intercept={child.intercept}
          color={resolveColor(child, 'currentColor')}
          strokeWidth={resolveWidth(child, 2)}
          dashed={child.dashed}
          transform={transform}
        />
      );
    }

    case 'ray': {
      const origin: [number, number] = child.origin || [0, 0];
      const direction = child.direction || 'up-right';
      const dirMap: Record<string, [number, number]> = {
        'up-right': [1, 1],
        'down-right': [1, -1],
        'up-left': [-1, 1],
        'down-left': [-1, -1],
        'left-horizontal': [-1, 0],
        'right-horizontal': [1, 0],
        'up-vertical': [0, 1],
        'down-vertical': [0, -1],
      };
      const [dx, dy] = dirMap[direction] || [1, 1];
      const span = child.length || Math.max(
        transform.xDomain[1] - transform.xDomain[0],
        transform.yDomain[1] - transform.yDomain[0]
      );
      const end: [number, number] = [origin[0] + dx * span, origin[1] + dy * span];
      const pt1 = transform.toPixel(origin[0], origin[1]);
      const pt2 = transform.toPixel(end[0], end[1]);
      const markerEnd = child.arrow !== false ? 'url(#curve-arrow)' : undefined;
      return (
        <React.Fragment key={key}>
          <line
            x1={pt1.px}
            y1={pt1.py}
            x2={pt2.px}
            y2={pt2.py}
            stroke={resolveColor(child, 'currentColor')}
            strokeWidth={resolveWidth(child, 2)}
            strokeDasharray={child.dashed ? '4,4' : undefined}
            markerEnd={markerEnd}
          />
          {child.label && <Point coords={origin} label={child.label} transform={transform} color={resolveColor(child, 'currentColor')} />}
        </React.Fragment>
      );
    }

    case 'polyline':
      return (
        <PolylinePrimitive
          key={key}
          points={child.points || []}
          color={resolveColor(child, 'var(--visual-primary, #2563eb)')}
          strokeWidth={resolveWidth(child, 2)}
          dashed={child.dashed}
          transform={transform}
        />
      );

    case 'path': {
      const points: [number, number][] = child.points || [];
      if (points.length === 0) return null;
      const d = smoothPath(points, transform);
      const markerEnd = child.arrow === 'end' || child.arrow === 'both' || child.arrow === true ? 'url(#curve-arrow)' : undefined;
      const markerStart = child.arrow === 'start' || child.arrow === 'both' ? 'url(#curve-arrow-start)' : undefined;
      return (
        <path
          key={key}
          d={d}
          fill="none"
          stroke={resolveColor(child, 'currentColor')}
          strokeWidth={resolveWidth(child, 2)}
          strokeDasharray={child.dashed ? '4,4' : undefined}
          strokeLinejoin="round"
          strokeLinecap="round"
          markerEnd={markerEnd}
          markerStart={markerStart}
        />
      );
    }

    case 'polygon': {
      const points: [number, number][] = child.vertices || child.points || [];
      const labels: string[] = child.labels || child.vertex_labels || [];

      // Compute centroid of polygon for automatic outward label positioning
      let cx = 0;
      let cy = 0;
      if (points.length > 0) {
        cx = points.reduce((acc, p) => acc + p[0], 0) / points.length;
        cy = points.reduce((acc, p) => acc + p[1], 0) / points.length;
      }

      return (
        <React.Fragment key={key}>
          <PolygonPrimitive
            points={points}
            color={resolveColor(child, 'var(--visual-primary, #2563eb)')}
            fill={COLOR_MAP[child.fill] || child.fill || 'rgba(37, 99, 235, 0.15)'}
            strokeWidth={resolveWidth(child, 2)}
            transform={transform}
          />
          {labels.map((label, i) => {
            const pt = points[i];
            if (!pt) return null;
            const dx = pt[0] - cx;
            const dy = pt[1] - cy;
            let labelPos: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' = 'top-right';
            if (dx >= 0 && dy >= 0) labelPos = 'top-right';
            else if (dx < 0 && dy >= 0) labelPos = 'top-left';
            else if (dx < 0 && dy < 0) labelPos = 'bottom-left';
            else labelPos = 'bottom-right';

            return (
              <Point
                key={`${key}-label-${i}`}
                coords={pt}
                label={label}
                labelPosition={child.label_positions?.[i] || labelPos}
                transform={transform}
                color={resolveColor(child, '#2563eb')}
              />
            );
          })}
        </React.Fragment>
      );
    }

    case 'label': {
      const coords: [number, number] = child.coords || [child.x ?? 0, child.y ?? 0];
      return <Point key={key} coords={coords} label={child.text || child.label} radius={0} color="transparent" transform={transform} />;
    }

    case 'arrow': {
      const from: [number, number] = child.from || child.p1 || [0, 0];
      const to: [number, number] = child.to || child.p2 || [1, 1];
      return (
        <React.Fragment key={key}>
          <Line p1={from} p2={to} color={resolveColor(child, 'currentColor')} strokeWidth={resolveWidth(child, 2)} transform={transform} />
        </React.Fragment>
      );
    }

    default:
      return null;
  }
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = (props) => {
  const {
    domain,
    x_range,
    y_range,
    grid = false,
    axes = { arrows: true },
    show_ticks,
    show_tick_labels,
    show_numbers,
    x_label = 'x',
    y_label = 'y',
    children,
    elements,
    width = 400,
    height = 300,
    maxWidth,
    padding = 24,
    preserveAspect,
    overlay,
  } = props;
  const effectiveMaxWidth = maxWidth
    ? typeof maxWidth === 'number'
      ? `${maxWidth}px`
      : maxWidth
    : `${Math.max(width, 650)}px`;
  const clipId = useId().replace(/:/g, '');
  const xDomain = domain?.x || x_range || [-6, 6];
  const yDomain = domain?.y || y_range || [-6, 6];

  const childList = children || elements || [];
  const effectivePreserveAspect =
    preserveAspect ??
    childList.some((c) => c?.type === 'circle' || c?.type === 'polygon');

  const transform = createTransform({
    xDomain,
    yDomain,
    width,
    height,
    padding,
    preserveAspect: effectivePreserveAspect,
  });

  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;

  const plotLeft = transform.offsetX;
  const plotRight = transform.offsetX + transform.plotWidth;
  const plotTop = transform.offsetY;
  const plotBottom = transform.offsetY + transform.plotHeight;

  const xInDomain = xMin <= 0 && xMax >= 0;
  const yInDomain = yMin <= 0 && yMax >= 0;

  const originPx = transform.toPixelX(0);
  const originPy = transform.toPixelY(0);

  const xAxisPy = yInDomain ? originPy : plotBottom;
  const yAxisPx = xInDomain ? originPx : plotLeft;

  const xTicks = niceTicks(xMin, xMax, width < 300 ? 6 : 8);
  const yTicks = niceTicks(yMin, yMax, height < 240 ? 5 : 7);

  const ticksVisible = (props as any).show_ticks !== false;
  const showTickLabels =
    ticksVisible &&
    (props as any).show_tick_labels !== false &&
    (props as any).show_numbers !== false &&
    width >= 220;

  return (
    <div className="w-full flex justify-center items-center my-3 max-w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: effectiveMaxWidth,
          backgroundColor: 'var(--visual-bg, #ffffff)',
          shapeRendering: 'geometricPrecision',
          textRendering: 'optimizeLegibility',
        }}
        className="cartesian-plane rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 transition-colors"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={plotLeft} y={plotTop} width={transform.plotWidth} height={transform.plotHeight} />
          </clipPath>
          <marker
            id="curve-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--visual-axis, currentColor)" />
          </marker>
          <marker
            id="curve-arrow-start"
            viewBox="0 0 10 10"
            refX="2"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--visual-axis, currentColor)" />
          </marker>
        </defs>

        {/* Grid Lines */}
        {grid && (
          <g stroke={GRID_COLOR} strokeWidth={1} strokeDasharray="2,2">
            {xTicks.map((val, i) => {
              const px = transform.toPixelX(val);
              return <line key={`gx-${i}`} x1={px} y1={plotTop} x2={px} y2={plotBottom} />;
            })}
            {yTicks.map((val, i) => {
              const py = transform.toPixelY(val);
              return <line key={`gy-${i}`} x1={plotLeft} y1={py} x2={plotRight} y2={py} />;
            })}
          </g>
        )}

        {/* Axes */}
        {yInDomain && (
          <line x1={plotLeft} y1={originPy} x2={plotRight} y2={originPy} stroke={AXIS_COLOR} strokeWidth={2} />
        )}
        {xInDomain && (
          <line x1={originPx} y1={plotTop} x2={originPx} y2={plotBottom} stroke={AXIS_COLOR} strokeWidth={2} />
        )}

        {/* Arrowheads */}
        {axes?.arrows && yInDomain && (
          <polygon
            points={`${plotRight},${originPy} ${plotRight - 8},${originPy - 4} ${plotRight - 8},${originPy + 4}`}
            fill={AXIS_COLOR}
          />
        )}
        {axes?.arrows && xInDomain && (
          <polygon
            points={`${originPx},${plotTop} ${originPx - 4},${plotTop + 8} ${originPx + 4},${plotTop + 8}`}
            fill={AXIS_COLOR}
          />
        )}

        {/* Tick marks and labels */}
        {ticksVisible && (
          <g stroke={TICK_COLOR} strokeWidth={1.25}>
            {xTicks.map((val, i) => {
              const px = transform.toPixelX(val);
              return (
                <React.Fragment key={`xt-${i}`}>
                  <line x1={px} y1={xAxisPy - 4} x2={px} y2={xAxisPy + 4} />
                  {showTickLabels && Math.abs(val) > 1e-9 && (
                    <text
                      x={px}
                      y={xAxisPy + 14}
                      fontSize={10}
                      fontWeight="bold"
                      fill="var(--visual-text, currentColor)"
                      stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
                      strokeWidth="3px"
                      paintOrder="stroke fill"
                      strokeLinejoin="round"
                      textAnchor="middle"
                    >
                      {val}
                    </text>
                  )}
                </React.Fragment>
              );
            })}
            {yTicks.map((val, i) => {
              const py = transform.toPixelY(val);
              return (
                <React.Fragment key={`yt-${i}`}>
                  <line x1={yAxisPx - 4} y1={py} x2={yAxisPx + 4} y2={py} />
                  {showTickLabels && Math.abs(val) > 1e-9 && (
                    <text
                      x={yAxisPx - 7}
                      y={py + 3.5}
                      fontSize={10}
                      fontWeight="bold"
                      fill="var(--visual-text, currentColor)"
                      stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
                      strokeWidth="3px"
                      paintOrder="stroke fill"
                      strokeLinejoin="round"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  )}
                </React.Fragment>
              );
            })}
          </g>
        )}

        {/* Axis Labels */}
        <text
          x={plotRight - 4}
          y={xAxisPy - 8}
          fontSize={12}
          fontWeight="900"
          fill="var(--visual-text, currentColor)"
          stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
          strokeWidth="3px"
          paintOrder="stroke fill"
          strokeLinejoin="round"
          textAnchor="end"
        >
          {x_label}
        </text>
        <text
          x={yAxisPx + 10}
          y={plotTop - 4}
          fontSize={12}
          fontWeight="900"
          fill="var(--visual-text, currentColor)"
          stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
          strokeWidth="3px"
          paintOrder="stroke fill"
          strokeLinejoin="round"
          textAnchor="start"
        >
          {y_label}
        </text>

        {/* Primitive Children (clipped to plot area) */}
        <g clipPath={`url(#${clipId})`}>
          {childList.map((child, idx) => renderPrimitive(child, transform, idx))}
          {overlay}
        </g>
      </svg>
    </div>
  );
};

export interface CartesianPlaneProps {
  domain?: { x?: [number, number]; y?: [number, number] };
  x_range?: [number, number];
  y_range?: [number, number];
  grid?: boolean;
  axes?: { arrows?: boolean };
  x_label?: string;
  y_label?: string;
  children?: any[];
  elements?: any[];
  width?: number;
  height?: number;
  maxWidth?: number | string;
  padding?: number;
  preserveAspect?: boolean;
}

export const CartesianPlane: React.FC<CartesianPlaneProps> = (props) => {
  return <CartesianCanvas {...props} />;
};

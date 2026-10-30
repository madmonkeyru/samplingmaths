import React from 'react';
import { TextRenderer } from '../../common/TextRenderer';
import { niceTicks } from '../../../utils/ticks';
import { smoothPath } from '../../../utils/smoothPath';

export interface TableSpecProps {
  variant?: 'frequency' | 'weighted' | 'summary' | 'contingency' | 'stats' | string;
  headers?: string[];
  columns?: string[];
  rows?: (string | number)[][];
  title?: string;
  totalRow?: (string | number)[];
  total_row?: (string | number)[];
}

export const TableComponent: React.FC<TableSpecProps> = ({
  headers,
  columns,
  rows = [],
  title,
  totalRow,
  total_row,
}) => {
  const headerCells = columns || headers || [];
  const totalCells = total_row || totalRow;

  return (
    <div className="table-visual-component my-2 w-full max-w-full overflow-x-auto flex flex-col items-center">
      {title && (
        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 text-center mb-2">
          {title}
        </div>
      )}
      <table className="min-w-0 border-collapse border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-center shadow-xs rounded-xl overflow-hidden transition-colors">
        {headerCells.length > 0 && (
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold border-b border-zinc-300 dark:border-zinc-700">
              {headerCells.map((h, i) => (
                <th key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 border-r border-zinc-300 dark:border-zinc-700 last:border-r-0">
                  <TextRenderer content={String(h)} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-1.5 sm:px-4 sm:py-2 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                  <TextRenderer content={String(cell)} />
                </td>
              ))}
            </tr>
          ))}
          {totalCells && (
            <tr className="bg-zinc-100 dark:bg-zinc-800 font-bold border-t-2 border-zinc-300 dark:border-zinc-700">
              {totalCells.map((cell, idx) => (
                <td key={idx} className="px-3 py-1.5 sm:px-4 sm:py-2 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                  <TextRenderer content={String(cell)} />
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export interface BoxPlotGroup {
  name?: string;
  label?: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface BoxPlotProps {
  groups?: BoxPlotGroup[];
  min?: number;
  q1?: number;
  median?: number;
  q3?: number;
  max?: number;
  axis?: { label?: string; min?: number; max?: number };
  width?: number;
  height?: number;
}

export const BoxPlotComponent: React.FC<BoxPlotProps> = ({
  groups,
  min,
  q1,
  median,
  q3,
  max,
  axis,
  width = 440,
  height,
}) => {
  const plotData: BoxPlotGroup[] = groups || [
    {
      label: 'Datos',
      min: min ?? 10,
      q1: q1 ?? 20,
      median: median ?? 30,
      q3: q3 ?? 40,
      max: max ?? 50,
    },
  ];

  const computedHeight = height || Math.max(140, plotData.length * 48 + 55);

  const allMins = plotData.map((g) => g.min);
  const allMaxs = plotData.map((g) => g.max);
  const minVal = axis?.min ?? Math.min(...allMins) - 2;
  const maxVal = axis?.max ?? Math.max(...allMaxs) + 2;

  const plotLeft = 75;
  const plotRight = width - 20;
  const axisPy = computedHeight - 32;

  const toPx = (v: number) =>
    plotLeft + ((v - minVal) / (maxVal - minVal)) * (plotRight - plotLeft);

  const rowHeight = (computedHeight - 50) / plotData.length;
  const ticks = niceTicks(minVal, maxVal, 7);

  return (
    <svg
      viewBox={`0 0 ${width} ${computedHeight}`}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: `${width}px`,
        backgroundColor: 'var(--visual-bg, #ffffff)',
        shapeRendering: 'geometricPrecision',
        textRendering: 'optimizeLegibility',
      }}
      className="box-plot-component rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 transition-colors"
    >
      {/* Axis line */}
      <line x1={plotLeft} y1={axisPy} x2={plotRight} y2={axisPy} stroke="var(--visual-axis, #09090b)" strokeWidth={1.5} />

      {/* Axis title */}
      {axis?.label && (
        <text
          x={(plotLeft + plotRight) / 2}
          y={computedHeight - 6}
          fontSize={11}
          fontWeight="bold"
          fill="var(--visual-text, currentColor)"
          textAnchor="middle"
        >
          {axis.label}
        </text>
      )}

      {/* Ticks */}
      {ticks.map((v, i) => {
        const px = toPx(v);
        return (
          <g key={`tick-${i}`}>
            <line x1={px} y1={axisPy - 3} x2={px} y2={axisPy + 3} stroke="var(--visual-tick, #64748b)" strokeWidth={1} />
            <text x={px} y={axisPy + 14} fontSize={10} fontWeight="600" fill="var(--visual-tick, #64748b)" textAnchor="middle">
              {v}
            </text>
          </g>
        );
      })}

      {plotData.map((group, idx) => {
        const y = 12 + idx * rowHeight + (rowHeight - 24) / 2;
        const boxH = Math.min(rowHeight - 16, 26);

        const xMin = toPx(group.min);
        const xQ1 = toPx(group.q1);
        const xMed = toPx(group.median);
        const xQ3 = toPx(group.q3);
        const xMax = toPx(group.max);
        const midY = y + boxH / 2;

        return (
          <g key={idx}>
            {/* Label */}
            <text
              x={10}
              y={midY + 4}
              fontSize={11}
              fontWeight="bold"
              fill="var(--visual-text, currentColor)"
            >
              {group.label || group.name || `Grupo ${idx + 1}`}
            </text>

            {/* Whiskers */}
            <line x1={xMin} y1={midY} x2={xQ1} y2={midY} stroke="var(--visual-secondary, #0284c7)" strokeWidth={2} />
            <line x1={xQ3} y1={midY} x2={xMax} y2={midY} stroke="var(--visual-secondary, #0284c7)" strokeWidth={2} />

            {/* End caps */}
            <line x1={xMin} y1={y + 2} x2={xMin} y2={y + boxH - 2} stroke="var(--visual-secondary, #0284c7)" strokeWidth={2} />
            <line x1={xMax} y1={y + 2} x2={xMax} y2={y + boxH - 2} stroke="var(--visual-secondary, #0284c7)" strokeWidth={2} />

            {/* Box */}
            <rect
              x={xQ1}
              y={y}
              width={Math.max(0, xQ3 - xQ1)}
              height={boxH}
              fill="rgba(56, 189, 248, 0.25)"
              stroke="var(--visual-secondary, #0284c7)"
              strokeWidth={2}
            />

            {/* Median */}
            <line x1={xMed} y1={y} x2={xMed} y2={y + boxH} stroke="var(--visual-annotation, #e11d48)" strokeWidth={2.5} />
          </g>
        );
      })}
    </svg>
  );
};

export interface DistributionCurveProps {
  skew?: 'negative' | 'positive' | 'symmetric' | 'left' | 'right';
  mean?: number;
  median?: number;
  mode?: number;
  markers?: Array<{ label: string; value: number; dashed?: boolean; dashed_to_axis?: string; color?: string }>;
  x_axis?: { label?: string; ticks?: number[]; arrows?: boolean };
  width?: number;
  height?: number;
}

export const DistributionCurveComponent: React.FC<DistributionCurveProps> = ({
  skew = 'negative',
  mean,
  median,
  mode,
  markers: inputMarkers,
  x_axis,
  width = 400,
  height = 190,
}) => {
  const normSkew: 'negative' | 'positive' | 'symmetric' =
    skew === 'left' || skew === 'negative'
      ? 'negative'
      : skew === 'right' || skew === 'positive'
      ? 'positive'
      : 'symmetric';

  const defaultMarkers = [
    { label: '80', value: 80, dashed: true },
    { label: '85', value: 85, dashed: true },
  ];

  let resolvedMarkers = inputMarkers;
  if (!resolvedMarkers || resolvedMarkers.length === 0) {
    if (median !== undefined && mode !== undefined) {
      resolvedMarkers = [
        { label: String(median), value: median, dashed: true },
        { label: String(mode), value: mode, dashed: true },
      ];
    } else {
      resolvedMarkers = defaultMarkers;
    }
  }

  const markerValues = resolvedMarkers.map((m) => m.value);
  const tickValues = x_axis?.ticks || [];
  const allKnown = [...markerValues, ...tickValues];
  const dataMin = allKnown.length ? Math.min(...allKnown) : 70;
  const dataMax = allKnown.length ? Math.max(...allKnown) : 95;

  const pad = Math.max((dataMax - dataMin) * 0.45, 8);
  const xMin = dataMin - pad;
  const xMax = dataMax + pad;

  const left = 32;
  const right = width - 24;
  const baseline = height - 32;
  const amplitude = baseline - 35;

  const toPx = (v: number) => left + ((v - xMin) / (xMax - xMin)) * (right - left);

  // Peak of distribution curve is at mode
  const peakValue =
    mode !== undefined
      ? mode
      : normSkew === 'negative'
      ? dataMax
      : normSkew === 'positive'
      ? dataMin
      : (dataMin + dataMax) / 2;

  // In negative skew (skewed to left), left tail is longer/wider (larger sigmaLeft) and right is steeper (smaller sigmaRight)
  const sigmaLeft = (xMax - xMin) * (normSkew === 'negative' ? 0.28 : normSkew === 'positive' ? 0.12 : 0.2);
  const sigmaRight = (xMax - xMin) * (normSkew === 'negative' ? 0.12 : normSkew === 'positive' ? 0.28 : 0.2);

  const getYAt = (val: number) => {
    const sigma = val < peakValue ? sigmaLeft : sigmaRight;
    const gauss = Math.exp(-0.5 * Math.pow((val - peakValue) / sigma, 2));
    return baseline - amplitude * gauss;
  };

  const points: [number, number][] = [];
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const v = xMin + ((xMax - xMin) * i) / steps;
    points.push([v, getYAt(v)]);
  }

  const curveD = smoothPath(points, {
    toPixel: (x, y) => ({ px: toPx(x), py: y }),
  });

  const fillD = `${curveD} L ${toPx(xMax)} ${baseline} L ${toPx(xMin)} ${baseline} Z`;

  const ticks = x_axis?.ticks;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: `${width}px`,
        backgroundColor: 'var(--visual-bg, #ffffff)',
        shapeRendering: 'geometricPrecision',
        textRendering: 'optimizeLegibility',
      }}
      className="distribution-curve rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 transition-colors"
    >
      <defs>
        <marker
          id="dist-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--visual-axis, currentColor)" />
        </marker>
      </defs>

      {/* Axis */}
      <line
        x1={left - 8}
        y1={baseline}
        x2={right + 8}
        y2={baseline}
        stroke="var(--visual-axis, currentColor)"
        strokeWidth={1.5}
        markerEnd="url(#dist-arrow)"
      />

      {x_axis?.label && (
        <text
          x={(left + right) / 2}
          y={height - 6}
          fontSize={11}
          fontWeight="bold"
          fill="var(--visual-text, currentColor)"
          textAnchor="middle"
        >
          {x_axis.label}
        </text>
      )}

      {/* Ticks if specified */}
      {ticks &&
        ticks.map((v, i) => {
          const px = toPx(v);
          return (
            <g key={`tick-${i}`}>
              <line x1={px} y1={baseline - 3} x2={px} y2={baseline + 3} stroke="var(--visual-tick, #64748b)" strokeWidth={1} />
              <text x={px} y={baseline + 14} fontSize={10} fontWeight="600" fill="var(--visual-tick, #64748b)" textAnchor="middle">
                {v}
              </text>
            </g>
          );
        })}

      {/* Curve */}
      <path d={fillD} fill="rgba(37, 99, 235, 0.12)" stroke="none" />
      <path d={curveD} fill="none" stroke="var(--visual-primary, #2563eb)" strokeWidth={2} strokeLinejoin="round" />

      {/* Markers */}
      {resolvedMarkers.map((m, i) => {
        const posX = toPx(m.value);
        const curveY = getYAt(m.value);
        return (
          <g key={i}>
            <line
              x1={posX}
              y1={curveY}
              x2={posX}
              y2={baseline}
              stroke="var(--visual-annotation, #475569)"
              strokeDasharray={m.dashed !== false ? '4,3' : undefined}
              strokeWidth={1.5}
            />
            {/* Tick mark on baseline */}
            <line x1={posX} y1={baseline - 3} x2={posX} y2={baseline + 3} stroke="var(--visual-axis, currentColor)" strokeWidth={1.5} />
            <text
              x={posX}
              y={baseline + 16}
              fontSize={12}
              fontWeight="bold"
              fill="var(--visual-text, currentColor)"
              stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
              strokeWidth="3px"
              paintOrder="stroke fill"
              strokeLinejoin="round"
              textAnchor="middle"
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export interface VennDiagramProps {
  sets?: Array<string | { label: string; color?: string }>;
  region_values?: Record<string, number | string>;
  regions?: Record<string, number | string>;
  total?: number;
  region_labels_visible?: boolean;
  width?: number;
  height?: number;
}

const VENN_COLORS = ['#2563eb', '#dc2626', '#059669'];
const VENN_FILLS = ['rgba(59, 130, 246, 0.15)', 'rgba(239, 68, 68, 0.15)', 'rgba(16, 185, 129, 0.15)'];

export const VennDiagramComponent: React.FC<VennDiagramProps> = ({
  sets = [],
  region_values,
  regions,
  total,
  region_labels_visible = true,
  width = 380,
  height = 250,
}) => {
  const setLabels = sets.map((s, i) => (typeof s === 'string' ? s : s.label || `Set ${i + 1}`));
  const values = region_values || regions || {};
  const showValues = region_labels_visible && Object.keys(values).length > 0;

  const circles = [
    { cx: 180, cy: 95, r: 72 },
    { cx: 118, cy: 165, r: 72 },
    { cx: 242, cy: 165, r: 72 },
  ];

  const setLabelPos = [
    { x: 215, y: 38 },
    { x: 48, y: 210 },
    { x: 312, y: 210 },
  ];

  const regionPos: Record<string, { x: number; y: number }> = {
    A_only: { x: 180, y: 56 },
    B_only: { x: 72, y: 180 },
    C_only: { x: 288, y: 180 },
    A_B_only: { x: 118, y: 122 },
    A_C_only: { x: 242, y: 122 },
    B_C_only: { x: 180, y: 188 },
    A_B_C: { x: 180, y: 142 },
    outside: { x: 330, y: 48 },
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: `${width}px`,
        backgroundColor: 'var(--visual-bg, #ffffff)',
        shapeRendering: 'geometricPrecision',
        textRendering: 'optimizeLegibility',
      }}
      className="venn-diagram rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 shadow-xs text-zinc-900 dark:text-zinc-100 transition-colors p-1"
    >
      {circles.slice(0, sets.length || 3).map((c, i) => (
        <circle
          key={`circle-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill={VENN_FILLS[i % VENN_FILLS.length]}
          stroke={VENN_COLORS[i % VENN_COLORS.length]}
          strokeWidth={2}
        />
      ))}

      {setLabels.map((label, i) => (
        <text
          key={`set-${i}`}
          x={setLabelPos[i]?.x ?? 0}
          y={setLabelPos[i]?.y ?? 0}
          fontSize={13}
          fontWeight="bold"
          fill={VENN_COLORS[i % VENN_COLORS.length]}
          stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
          strokeWidth="3px"
          paintOrder="stroke fill"
          strokeLinejoin="round"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}

      {showValues &&
        Object.keys(regionPos).map((key) => {
          const value = values[key];
          if (value === undefined || value === null || value === '') return null;
          const pos = regionPos[key];
          return (
            <text
              key={key}
              x={pos.x}
              y={pos.y}
              fontSize={11}
              fontWeight="bold"
              fill="var(--visual-text, currentColor)"
              stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
              strokeWidth="2.5px"
              paintOrder="stroke fill"
              strokeLinejoin="round"
              textAnchor="middle"
            >
              {value}
            </text>
          );
        })}

      {total !== undefined && (
        <text x={width - 12} y={height - 10} fontSize={10} fontWeight="bold" fill="var(--visual-tick, #64748b)" textAnchor="end">
          Total: {total}
        </text>
      )}
    </svg>
  );
};

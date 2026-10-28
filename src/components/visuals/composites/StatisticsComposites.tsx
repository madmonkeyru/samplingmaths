import React from 'react';
import { TextRenderer } from '../../common/TextRenderer';

export interface TableSpecProps {
  variant?: 'frequency' | 'weighted' | 'summary' | 'contingency' | 'stats' | string;
  headers?: string[];
  rows?: (string | number)[][];
  title?: string;
  totalRow?: (string | number)[];
}

export const TableComponent: React.FC<TableSpecProps> = ({
  headers = [],
  rows = [],
  title,
  totalRow,
}) => {
  return (
    <div className="table-visual-component my-3 overflow-x-auto">
      {title && (
        <div className="text-sm font-bold text-slate-800 text-center mb-2">{title}</div>
      )}
      <table className="min-w-full border-collapse border border-slate-300 text-sm bg-white text-center shadow-sm rounded">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-2 border-r border-slate-300 last:border-r-0">
                  <TextRenderer content={String(h)} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-slate-200 hover:bg-slate-50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2 border-r border-slate-200 last:border-r-0">
                  <TextRenderer content={String(cell)} />
                </td>
              ))}
            </tr>
          ))}
          {totalRow && (
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
              {totalRow.map((cell, idx) => (
                <td key={idx} className="px-4 py-2 border-r border-slate-200 last:border-r-0">
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

export interface BoxPlotProps {
  groups?: Array<{
    name: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  }>;
  min?: number;
  q1?: number;
  median?: number;
  q3?: number;
  max?: number;
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
  width = 400,
  height = 200,
}) => {
  const plotData = groups || [
    {
      name: 'Datos',
      min: min ?? 10,
      q1: q1 ?? 20,
      median: median ?? 30,
      q3: q3 ?? 40,
      max: max ?? 50,
    },
  ];

  const allVals = plotData.flatMap((g) => [g.min, g.max]);
  const minVal = Math.min(...allVals) - 5;
  const maxVal = Math.max(...allVals) + 5;

  const toPx = (v: number) => {
    return 60 + ((v - minVal) / (maxVal - minVal)) * (width - 100);
  };

  const rowHeight = (height - 40) / plotData.length;

  return (
    <svg width={width} height={height} className="box-plot-component bg-white border border-slate-200 rounded">
      {/* Axis line */}
      <line x1={60} y1={height - 25} x2={width - 40} y2={height - 25} stroke="#64748b" strokeWidth={1.5} />

      {plotData.map((group, idx) => {
        const y = 20 + idx * rowHeight + rowHeight / 2 - 10;
        const boxH = Math.min(rowHeight - 20, 30);

        const xMin = toPx(group.min);
        const xQ1 = toPx(group.q1);
        const xMed = toPx(group.median);
        const xQ3 = toPx(group.q3);
        const xMax = toPx(group.max);

        return (
          <g key={idx}>
            {/* Label */}
            <text x={10} y={y + boxH / 2 + 4} fontSize={11} fontWeight="bold" fill="#334155">
              {group.name}
            </text>

            {/* Whiskers */}
            <line x1={xMin} y1={y + boxH / 2} x2={xQ1} y2={y + boxH / 2} stroke="#0284c7" strokeWidth={2} />
            <line x1={xQ3} y1={y + boxH / 2} x2={xMax} y2={y + boxH / 2} stroke="#0284c7" strokeWidth={2} />

            {/* Min and Max end caps */}
            <line x1={xMin} y1={y + 2} x2={xMin} y2={y + boxH - 2} stroke="#0284c7" strokeWidth={2} />
            <line x1={xMax} y1={y + 2} x2={xMax} y2={y + boxH - 2} stroke="#0284c7" strokeWidth={2} />

            {/* Box Q1 -> Q3 */}
            <rect
              x={xQ1}
              y={y}
              width={xQ3 - xQ1}
              height={boxH}
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#0284c7"
              strokeWidth={2}
            />

            {/* Median line */}
            <line x1={xMed} y1={y} x2={xMed} y2={y + boxH} stroke="#e11d48" strokeWidth={2.5} />
          </g>
        );
      })}
    </svg>
  );
};

export interface DistributionCurveProps {
  skew?: 'negative' | 'positive' | 'symmetric';
  markers?: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
}

export const DistributionCurveComponent: React.FC<DistributionCurveProps> = ({
  skew = 'negative',
  markers = [
    { label: 'Mediana (80)', value: 80 },
    { label: 'Moda (85)', value: 85 },
  ],
  width = 400,
  height = 200,
}) => {
  let pathD = 'M 40 160 Q 120 160 220 50 Q 320 150 360 160';
  if (skew === 'positive') {
    pathD = 'M 40 160 Q 80 150 180 50 Q 280 160 360 160';
  }

  return (
    <svg width={width} height={height} className="distribution-curve bg-white border border-slate-200 rounded">
      <line x1={30} y1={160} x2={370} y2={160} stroke="#334155" strokeWidth={1.5} />
      <path d={pathD} fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" strokeWidth={2.5} />

      {/* Markers */}
      {markers.map((m, i) => {
        const posX = 200 + i * 40;
        return (
          <g key={i}>
            <line x1={posX} y1={60 + i * 20} x2={posX} y2={160} stroke="#e11d48" strokeDasharray="4,4" strokeWidth={1.5} />
            <text x={posX - 20} y={45 + i * 15} fontSize={10} fontWeight="bold" fill="#e11d48">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export interface VennDiagramProps {
  sets?: Array<{ label: string; color?: string }>;
  regions?: Record<string, number | string>;
  width?: number;
  height?: number;
}

export const VennDiagramComponent: React.FC<VennDiagramProps> = ({
  sets = [{ label: 'Música' }, { label: 'Pintura' }, { label: 'Ballet' }],
  regions = {},
  width = 380,
  height = 280,
}) => {
  return (
    <svg width={width} height={height} className="venn-diagram bg-white border border-slate-200 rounded p-2">
      {/* Circle 1: Top */}
      <circle cx={190} cy={110} r={75} fill="rgba(59, 130, 246, 0.15)" stroke="#2563eb" strokeWidth={2} />
      <text x={190} y={50} fontSize={12} fontWeight="bold" fill="#1e3a8a" textAnchor="middle">
        {sets[0]?.label || 'Set A'}
      </text>

      {/* Circle 2: Bottom-Left */}
      <circle cx={135} cy={180} r={75} fill="rgba(239, 68, 68, 0.15)" stroke="#dc2626" strokeWidth={2} />
      <text x={80} y={220} fontSize={12} fontWeight="bold" fill="#991b1b" textAnchor="middle">
        {sets[1]?.label || 'Set B'}
      </text>

      {/* Circle 3: Bottom-Right */}
      <circle cx={245} cy={180} r={75} fill="rgba(16, 185, 129, 0.15)" stroke="#059669" strokeWidth={2} />
      <text x={300} y={220} fontSize={12} fontWeight="bold" fill="#065f46" textAnchor="middle">
        {sets[2]?.label || 'Set C'}
      </text>

      {/* Center region text example if supplied */}
      {Object.keys(regions).length > 0 && (
        <text x={190} y={160} fontSize={11} fontWeight="bold" fill="#0f172a" textAnchor="middle">
          {regions['abc'] || ''}
        </text>
      )}
    </svg>
  );
};

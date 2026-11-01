import React from 'react';
import { TextRenderer } from '../../common/TextRenderer';

export type Solid3DShapeType = 'sphere' | 'cylinder' | 'cone' | 'frustum' | 'prism' | 'cube';

export type Solid3DCrossSectionType =
  | 'parallel' // parallel to base (circles in cylinder/cone, horizontal circle in sphere)
  | 'axial' // through axis (rectangle in cylinder, right/isosceles triangle in cone, trapezoid in frustum)
  | 'oblique' // cutting lateral surface at an angle without touching bases (ellipse in cylinder & cone)
  | 'chord' // vertical cut parallel to axis but offset from center (smaller rectangle in cylinder)
  | 'parabolic' // cutting cone parallel to slant edge
  | 'hyperbolic' // cutting cone perpendicular to base / parallel to axis
  | 'base'; // base polygon/circle

export interface CuttingPlaneSpec {
  show?: boolean;
  label?: string; // e.g. "α", "β", "Plano secante"
  tilt?: number; // tilt angle in degrees or relative slope
  offset?: number; // offset along axis
  color?: string; // custom fill or stroke
  hatch?: boolean;
}

export interface Solid3DPoint {
  id?: string;
  coords: [number, number]; // 2D projected coordinate on SVG canvas
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showPoint?: boolean;
}

export interface Solid3DSegment {
  from: [number, number];
  to: [number, number];
  dashed?: boolean;
  color?: string;
  strokeWidth?: number;
  label?: string;
}

export interface Solid3DPerpendicularMark {
  corner: [number, number];
  dir1: [number, number]; // vector along first arm
  dir2: [number, number]; // vector along second arm
  size?: number;
}

export interface ReferenceBoxSpec {
  title?: string;
  lines: string[];
  position?: 'top-right' | 'bottom-right' | 'right' | 'top-left';
}

export interface Solid3DSpec {
  type?: 'solid_3d';
  shape: Solid3DShapeType;
  width?: number;
  height?: number;
  parameters?: Record<string, any>;
  showCrossSection?: boolean;
  crossSectionType?: Solid3DCrossSectionType;
  crossSectionOffset?: number; // e.g. for sphere plane cut distance from center or cylinder chord offset
  crossSectionHatched?: boolean;
  hatchAngle?: number;
  cuttingPlane?: CuttingPlaneSpec;
  labels?: Record<string, string>;
  points?: Solid3DPoint[];
  segments?: Solid3DSegment[];
  rightAngles?: Solid3DPerpendicularMark[];
  referenceBox?: ReferenceBoxSpec;
  showAxes?: boolean;
}

export const Solid3D: React.FC<Solid3DSpec> = ({
  shape,
  width = 380,
  height = 280,
  parameters = {},
  showCrossSection = true,
  crossSectionType = 'parallel',
  crossSectionOffset = 0,
  crossSectionHatched = true,
  hatchAngle = -45,
  cuttingPlane,
  labels = {},
  points = [],
  segments = [],
  rightAngles = [],
  referenceBox,
  showAxes = true,
}) => {
  const patternId = React.useId().replace(/:/g, '_') + '_hatch';

  const renderLabel = (
    text: string,
    x: number,
    y: number,
    pos: string = 'top-right',
    fontSize = 13,
    key?: string | number
  ) => {
    let dx = 8;
    let dy = -6;
    let anchor: 'start' | 'middle' | 'end' = 'start';

    switch (pos) {
      case 'top':
        dx = 0;
        dy = -10;
        anchor = 'middle';
        break;
      case 'bottom':
        dx = 0;
        dy = 16;
        anchor = 'middle';
        break;
      case 'left':
        dx = -10;
        dy = 4;
        anchor = 'end';
        break;
      case 'right':
        dx = 10;
        dy = 4;
        anchor = 'start';
        break;
      case 'top-left':
        dx = -8;
        dy = -8;
        anchor = 'end';
        break;
      case 'bottom-left':
        dx = -8;
        dy = 14;
        anchor = 'end';
        break;
      case 'bottom-right':
        dx = 8;
        dy = 14;
        anchor = 'start';
        break;
      case 'top-right':
      default:
        dx = 8;
        dy = -8;
        anchor = 'start';
        break;
    }

    const isMath = text.includes('$') || text.includes('\\') || text.length > 8;

    if (isMath) {
      return (
        <foreignObject
          key={key}
          x={x + (anchor === 'end' ? dx - 80 : anchor === 'middle' ? dx - 40 : dx)}
          y={y + dy - 12}
          width={80}
          height={30}
          className="overflow-visible pointer-events-none"
        >
          <div
            className="text-xs font-semibold flex items-center px-1 rounded backdrop-blur-xs"
            style={{
              color: 'var(--visual-text, #09090b)',
              backgroundColor: 'var(--visual-halo, rgba(255, 255, 255, 0.85))',
              width: 'fit-content',
            }}
          >
            <TextRenderer content={text} />
          </div>
        </foreignObject>
      );
    }

    return (
      <text
        key={key}
        x={x + dx}
        y={y + dy}
        textAnchor={anchor}
        fontSize={fontSize}
        fontWeight="bold"
        fill="var(--visual-text, #09090b)"
        stroke="var(--visual-halo, rgba(255, 255, 255, 0.95))"
        strokeWidth="3.5px"
        paintOrder="stroke fill"
        strokeLinejoin="round"
      >
        {text}
      </text>
    );
  };

  const renderRightAngle = (mark: Solid3DPerpendicularMark, key: string | number) => {
    const { corner, dir1, dir2, size = 9 } = mark;
    const len1 = Math.hypot(dir1[0], dir1[1]) || 1;
    const len2 = Math.hypot(dir2[0], dir2[1]) || 1;
    const u1 = [(dir1[0] / len1) * size, (dir1[1] / len1) * size];
    const u2 = [(dir2[0] / len2) * size, (dir2[1] / len2) * size];

    const p1 = [corner[0] + u1[0], corner[1] + u1[1]];
    const pCorner = [corner[0] + u1[0] + u2[0], corner[1] + u1[1] + u2[1]];
    const p2 = [corner[0] + u2[0], corner[1] + u2[1]];

    return (
      <path
        key={key}
        d={`M ${p1[0]} ${p1[1]} L ${pCorner[0]} ${pCorner[1]} L ${p2[0]} ${p2[1]}`}
        fill="none"
        stroke="var(--visual-stroke, #09090b)"
        strokeWidth={1.5}
      />
    );
  };

  // Visual center anchor (offset to left if referenceBox is present)
  const hasRefBox = Boolean(referenceBox && referenceBox.lines && referenceBox.lines.length > 0);
  const cx = hasRefBox ? width * 0.32 : width * 0.5;
  const cy = height * 0.52;

  // Shapes render logic
  const renderShapeGeometry = () => {
    switch (shape) {
      case 'sphere': {
        const R = parameters.radius || 75;
        const d = crossSectionOffset || parameters.distance || 38; // Distance from center S to section plane O
        // Cut circle radius: rCut = sqrt(R^2 - d^2)
        const rCut = Math.sqrt(Math.max(0, R * R - d * d));
        // Under orthographic tilt, horizontal circle becomes ellipse with ryCut = rCut * tilt
        const tilt = 0.28;
        const ryCut = rCut * tilt;
        const planeY = cy - d;

        // Equator ellipse
        const ryEquator = R * tilt;

        const centerS: [number, number] = [cx, cy];
        const centerO: [number, number] = [cx, planeY];
        const pointP: [number, number] = [cx - rCut, planeY];
        const pointN: [number, number] = [cx + rCut, planeY];

        const showCuttingPlaneOverlay = cuttingPlane?.show;
        const planeLabel = cuttingPlane?.label || 'α';

        return (
          <g className="solid-sphere">
            {/* Outline sphere circle */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Equator (dashed rear, solid front if showAxes or parameters.showEquator) */}
            {parameters.showEquator && (
              <>
                <path
                  d={`M ${cx - R} ${cy} A ${R} ${ryEquator} 0 0 1 ${cx + R} ${cy}`}
                  fill="none"
                  stroke="var(--visual-muted, #71717a)"
                  strokeWidth={1.2}
                  strokeDasharray="4 4"
                />
                <path
                  d={`M ${cx - R} ${cy} A ${R} ${ryEquator} 0 0 0 ${cx + R} ${cy}`}
                  fill="none"
                  stroke="var(--visual-muted, #71717a)"
                  strokeWidth={1.2}
                />
              </>
            )}

            {/* Planar cross-section ellipse (top offset) */}
            {showCrossSection && (
              <g className="cross-section-plane">
                {/* Rear half (dashed) */}
                <path
                  d={`M ${pointP[0]} ${pointP[1]} A ${rCut} ${ryCut} 0 0 1 ${pointN[0]} ${pointN[1]}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                />
                {/* Front half (solid) */}
                <path
                  d={`M ${pointP[0]} ${pointP[1]} A ${rCut} ${ryCut} 0 0 0 ${pointN[0]} ${pointN[1]}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={2}
                />
                {/* Full hatched elliptical disc */}
                <ellipse
                  cx={cx}
                  cy={planeY}
                  rx={rCut}
                  ry={ryCut}
                  fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                  stroke="none"
                />
              </g>
            )}

            {/* Visual Cutting Plane Parallelogram (Alpha) if enabled */}
            {showCuttingPlaneOverlay && (
              <g className="cutting-plane-alpha">
                <polygon
                  points={`${cx - rCut - 35},${planeY + 12} ${cx + rCut + 15},${planeY + 12} ${cx + rCut + 35},${planeY - 14} ${cx - rCut - 15},${planeY - 14}`}
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.2}
                />
                {renderLabel(`$\\text{Plano } ${planeLabel}$`, cx - rCut - 25, planeY - 14, 'left', 12, 'lbl_alpha')}
              </g>
            )}

            {/* Distance segment from S (sphere center) to O (plane center) */}
            {showAxes && (
              <line
                x1={centerS[0]}
                y1={centerS[1]}
                x2={centerO[0]}
                y2={centerO[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Planar radius segment from O to N */}
            {parameters.showPlaneRadius !== false && (
              <line
                x1={centerO[0]}
                y1={centerO[1]}
                x2={pointN[0]}
                y2={pointN[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Hypotenuse radius from S to N if requested */}
            {parameters.showSphereRadius && (
              <line
                x1={centerS[0]}
                y1={centerS[1]}
                x2={pointN[0]}
                y2={pointN[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="3 3"
              />
            )}

            {/* Right angle at centerO between axis SO and radius ON */}
            {parameters.showRightAngle && (
              renderRightAngle(
                { corner: centerO, dir1: [0, 1], dir2: [1, 0], size: 8 },
                'sphere_ra'
              )
            )}

            {/* Center points */}
            <circle cx={centerS[0]} cy={centerS[1]} r={3.5} fill="var(--visual-stroke, #09090b)" />
            <circle cx={centerO[0]} cy={centerO[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            <circle cx={pointP[0]} cy={pointP[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            <circle cx={pointN[0]} cy={pointN[1]} r={3} fill="var(--visual-stroke, #09090b)" />

            {/* Default points labels */}
            {renderLabel(labels.sphereCenter || 'S', centerS[0], centerS[1], 'bottom', 13, 'lbl_S')}
            {renderLabel(labels.planeCenter || 'O', centerO[0], centerO[1], 'top-left', 13, 'lbl_O')}
            {renderLabel(labels.planeLeft || 'M', pointP[0], pointP[1], 'left', 13, 'lbl_P')}
            {renderLabel(labels.planeRight || 'R', pointN[0], pointN[1], 'right', 13, 'lbl_N')}
          </g>
        );
      }

      case 'cylinder': {
        const rx = parameters.radius || 75;
        const ry = rx * 0.26;
        const H = parameters.height || 110;
        const topY = cy - H / 2;
        const botY = cy + H / 2;

        const ptA: [number, number] = [cx - rx, topY];
        const ptB: [number, number] = [cx, topY];
        const ptC: [number, number] = [cx + rx, topY];
        const ptD: [number, number] = [cx - rx, botY];
        const ptE: [number, number] = [cx, botY];
        const ptF: [number, number] = [cx + rx, botY];

        const showCuttingPlaneOverlay = cuttingPlane?.show;
        const planeLabel = cuttingPlane?.label || 'α';

        // Oblique cut parameters
        // A plane cutting the cylinder obliquely across its lateral surface without intersecting bases
        const obliqueAngle = parameters.obliqueAngle || 24; // degrees
        const rad = (obliqueAngle * Math.PI) / 180;
        const obliqueMajor = rx / Math.cos(rad);
        const obliqueMinor = ry * 1.35;

        // Chord cut parameters: plane perpendicular to bases at distance d from axis
        const chordDist = crossSectionOffset || parameters.chordDistance || rx * 0.6;
        const halfChord = Math.sqrt(Math.max(0, rx * rx - chordDist * chordDist));
        const chordX1 = cx + chordDist;
        const chordYTop = topY + Math.sqrt(Math.max(0, 1 - (chordDist / rx) ** 2)) * ry * 0.4;
        const chordYBot = botY + Math.sqrt(Math.max(0, 1 - (chordDist / rx) ** 2)) * ry * 0.4;

        return (
          <g className="solid-cylinder">
            {/* Visual Cutting Plane Polygon (Plano secante alpha) */}
            {showCuttingPlaneOverlay && crossSectionType === 'oblique' && (
              <g className="cutting-plane-oblique">
                <polygon
                  points={`${cx - rx - 35},${cy + 42} ${cx + rx + 30},${cy - 24} ${cx + rx + 45},${cy - 48} ${cx - rx - 20},${cy + 18}`}
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.2}
                />
                {renderLabel(`$\\text{Plano } ${planeLabel}$`, cx + rx + 35, cy - 35, 'top-right', 12, 'lbl_plano_ob')}
              </g>
            )}

            {/* Axial cross-section rectangle */}
            {showCrossSection && crossSectionType === 'axial' && (
              <polygon
                points={`${ptA[0]},${ptA[1]} ${ptC[0]},${ptC[1]} ${ptF[0]},${ptF[1]} ${ptD[0]},${ptD[1]}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                stroke="none"
              />
            )}

            {/* Chord cross-section rectangle (perpendicular to base, offset from center) */}
            {showCrossSection && crossSectionType === 'chord' && (
              <g className="cylinder-chord-section">
                <rect
                  x={chordX1 - 1}
                  y={topY}
                  width={2}
                  height={H}
                  fill="none"
                />
                {/* 2D chord slice plane rendered as vertical stripe / rectangle */}
                <polygon
                  points={`${chordX1},${topY - ry * 0.3} ${chordX1},${topY + ry * 0.7} ${chordX1},${botY + ry * 0.7} ${chordX1},${botY - ry * 0.3}`}
                  fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.15)'}
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.6}
                />
                {/* Triangle in base to show chord relation */}
                <line x1={cx} y1={botY} x2={chordX1} y2={botY} stroke="var(--visual-stroke, #09090b)" strokeWidth={1.4} strokeDasharray="3 3" />
                <line x1={cx} y1={botY} x2={chordX1} y2={botY + ry * 0.7} stroke="var(--visual-stroke, #09090b)" strokeWidth={1.4} strokeDasharray="3 3" />
                {renderLabel(labels.distance || 'd', (cx + chordX1) / 2, botY - 2, 'bottom', 11, 'lbl_cdist')}
              </g>
            )}

            {/* Oblique cross-section: tilted ellipse */}
            {showCrossSection && crossSectionType === 'oblique' && (
              <g className="cylinder-oblique-section" transform={`rotate(${-obliqueAngle}, ${cx}, ${cy})`}>
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={obliqueMajor * 0.95}
                  ry={obliqueMinor}
                  fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                  stroke="none"
                />
                {/* Rear arc (dashed) */}
                <path
                  d={`M ${cx - obliqueMajor * 0.95} ${cy} A ${obliqueMajor * 0.95} ${obliqueMinor} 0 0 1 ${cx + obliqueMajor * 0.95} ${cy}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.6}
                  strokeDasharray="4 4"
                />
                {/* Front arc (solid) */}
                <path
                  d={`M ${cx - obliqueMajor * 0.95} ${cy} A ${obliqueMajor * 0.95} ${obliqueMinor} 0 0 0 ${cx + obliqueMajor * 0.95} ${cy}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={2}
                />
              </g>
            )}

            {/* Bottom ellipse: rear dashed, front solid */}
            <path
              d={`M ${ptD[0]} ${ptD[1]} A ${rx} ${ry} 0 0 1 ${ptF[0]} ${ptF[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
            />
            <path
              d={`M ${ptD[0]} ${ptD[1]} A ${rx} ${ry} 0 0 0 ${ptF[0]} ${ptF[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Top ellipse: full solid */}
            <ellipse
              cx={cx}
              cy={topY}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Lateral envelope lines */}
            <line x1={ptA[0]} y1={ptA[1]} x2={ptD[0]} y2={ptD[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={ptC[0]} y1={ptC[1]} x2={ptF[0]} y2={ptF[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />

            {/* Central Axis BE */}
            {showAxes && (
              <line
                x1={ptB[0]}
                y1={ptB[1]}
                x2={ptE[0]}
                y2={ptE[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Top diameter AC dashed */}
            {parameters.showTopDiameter !== false && crossSectionType !== 'oblique' && (
              <line
                x1={ptA[0]}
                y1={ptA[1]}
                x2={ptC[0]}
                y2={ptC[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Bottom diameter DF dashed */}
            {parameters.showBottomDiameter !== false && crossSectionType !== 'oblique' && (
              <line
                x1={ptD[0]}
                y1={ptD[1]}
                x2={ptF[0]}
                y2={ptF[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Center and vertex points */}
            {crossSectionType !== 'oblique' && (
              <>
                <circle cx={ptA[0]} cy={ptA[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptB[0]} cy={ptB[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptC[0]} cy={ptC[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptD[0]} cy={ptD[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptE[0]} cy={ptE[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptF[0]} cy={ptF[1]} r={3} fill="var(--visual-stroke, #09090b)" />

                {renderLabel(labels.topLeft || 'A', ptA[0], ptA[1], 'left', 13, 'lbl_A')}
                {renderLabel(labels.topCenter || 'B', ptB[0], ptB[1], 'top', 13, 'lbl_B')}
                {renderLabel(labels.topRight || 'C', ptC[0], ptC[1], 'right', 13, 'lbl_C')}
                {renderLabel(labels.bottomLeft || 'D', ptD[0], ptD[1], 'left', 13, 'lbl_D')}
                {renderLabel(labels.bottomCenter || 'E', ptE[0], ptE[1], 'bottom', 13, 'lbl_E')}
                {renderLabel(labels.bottomRight || 'F', ptF[0], ptF[1], 'right', 13, 'lbl_F')}
              </>
            )}
            {crossSectionType === 'oblique' && (
              <>
                <circle cx={ptB[0]} cy={ptB[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={ptE[0]} cy={ptE[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                {renderLabel(labels.topCenter || 'O_1', ptB[0], ptB[1], 'top', 13, 'lbl_O1')}
                {renderLabel(labels.bottomCenter || 'O_2', ptE[0], ptE[1], 'bottom', 13, 'lbl_O2')}
              </>
            )}
          </g>
        );
      }

      case 'cone': {
        const rx = parameters.radius || 75;
        const ry = rx * 0.28;
        const H = parameters.height || 120;
        const apexY = cy - H * 0.58;
        const baseY = cy + H * 0.42;

        const apex: [number, number] = [cx, apexY];
        const baseCenter: [number, number] = [cx, baseY];
        const baseLeft: [number, number] = [cx - rx, baseY];
        const baseRight: [number, number] = [cx + rx, baseY];

        const showCuttingPlaneOverlay = cuttingPlane?.show;
        const planeLabel = cuttingPlane?.label || 'α';

        // Parallel planar cut
        const cutHeightFraction = parameters.cutHeightFraction || 0.45; // 0 (base) to 1 (apex)
        const cutY = baseY - H * cutHeightFraction;
        const cutRx = rx * (1 - cutHeightFraction);
        const cutRy = cutRx * 0.28;
        const cutCenter: [number, number] = [cx, cutY];
        const cutLeft: [number, number] = [cx - cutRx, cutY];
        const cutRight: [number, number] = [cx + cutRx, cutY];

        // Oblique cut parameters on cone (generates ellipse)
        const obliqueAngle = parameters.obliqueAngle || 20; // degrees
        const obliqueCenterY = baseY - H * 0.42;

        // Parabolic cut: plane parallel to slant height
        const isParabolic = crossSectionType === 'parabolic';
        // Hyperbolic cut: plane perpendicular to base
        const isHyperbolic = crossSectionType === 'hyperbolic';

        return (
          <g className="solid-cone">
            {/* Visual Cutting Plane Overlay if requested */}
            {showCuttingPlaneOverlay && (
              <g className="cone-cutting-plane">
                {crossSectionType === 'oblique' ? (
                  <polygon
                    points={`${cx - rx - 25},${obliqueCenterY + 35} ${cx + rx + 25},${obliqueCenterY - 25} ${cx + rx + 38},${obliqueCenterY - 48} ${cx - rx - 12},${obliqueCenterY + 12}`}
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="var(--visual-stroke, #09090b)"
                    strokeWidth={1.2}
                  />
                ) : isParabolic ? (
                  <polygon
                    points={`${cx - rx - 15},${baseY + 15} ${cx + 10},${apexY + 20} ${cx + 40},${apexY + 10} ${cx + 15},${baseY + 15}`}
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="var(--visual-stroke, #09090b)"
                    strokeWidth={1.2}
                  />
                ) : isHyperbolic ? (
                  <polygon
                    points={`${cx + rx * 0.4},${apexY + 20} ${cx + rx * 0.4},${baseY + 20} ${cx + rx + 20},${baseY + 20} ${cx + rx + 20},${apexY + 20}`}
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="var(--visual-stroke, #09090b)"
                    strokeWidth={1.2}
                  />
                ) : (
                  <polygon
                    points={`${cx - rx - 25},${cutY + 12} ${cx + rx + 15},${cutY + 12} ${cx + rx + 28},${cutY - 14} ${cx - rx - 12},${cutY - 14}`}
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="var(--visual-stroke, #09090b)"
                    strokeWidth={1.2}
                  />
                )}
                {renderLabel(`$\\text{Plano } ${planeLabel}$`, cx + rx + 15, (crossSectionType === 'oblique' ? obliqueCenterY - 30 : cutY - 14), 'top-right', 12, 'lbl_plano_cone')}
              </g>
            )}

            {/* Axial cross-section right triangle */}
            {showCrossSection && crossSectionType === 'axial' && (
              <polygon
                points={`${apex[0]},${apex[1]} ${baseCenter[0]},${baseCenter[1]} ${baseRight[0]},${baseRight[1]}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                stroke="none"
              />
            )}

            {/* Oblique cross-section (ellipse) in cone */}
            {showCrossSection && crossSectionType === 'oblique' && (
              <g className="cone-oblique-ellipse" transform={`rotate(${-obliqueAngle}, ${cx}, ${obliqueCenterY})`}>
                <ellipse
                  cx={cx}
                  cy={obliqueCenterY}
                  rx={rx * 0.52}
                  ry={ry * 0.9}
                  fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                  stroke="none"
                />
                <path
                  d={`M ${cx - rx * 0.52} ${obliqueCenterY} A ${rx * 0.52} ${ry * 0.9} 0 0 1 ${cx + rx * 0.52} ${obliqueCenterY}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.6}
                  strokeDasharray="3 3"
                />
                <path
                  d={`M ${cx - rx * 0.52} ${obliqueCenterY} A ${rx * 0.52} ${ry * 0.9} 0 0 0 ${cx + rx * 0.52} ${obliqueCenterY}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={2}
                />
              </g>
            )}

            {/* Parabolic cross-section in cone */}
            {showCrossSection && isParabolic && (
              <path
                d={`M ${cx - rx * 0.5} ${baseY} Q ${cx - 5} ${apexY + 35} ${cx + rx * 0.4} ${baseY}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.15)'}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={2}
              />
            )}

            {/* Hyperbolic cross-section in cone */}
            {showCrossSection && isHyperbolic && (
              <path
                d={`M ${cx + rx * 0.3} ${baseY + 5} Q ${cx + rx * 0.55} ${cy} ${cx + rx * 0.3} ${apexY + 40}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.15)'}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={2}
              />
            )}

            {/* Base ellipse: rear dashed, front solid */}
            <path
              d={`M ${baseLeft[0]} ${baseLeft[1]} A ${rx} ${ry} 0 0 1 ${baseRight[0]} ${baseRight[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
            />
            <path
              d={`M ${baseLeft[0]} ${baseLeft[1]} A ${rx} ${ry} 0 0 0 ${baseRight[0]} ${baseRight[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Parallel planar cross section */}
            {showCrossSection && crossSectionType === 'parallel' && (
              <g className="cone-cross-section">
                <path
                  d={`M ${cutLeft[0]} ${cutLeft[1]} A ${cutRx} ${cutRy} 0 0 1 ${cutRight[0]} ${cutRight[1]}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                />
                <path
                  d={`M ${cutLeft[0]} ${cutLeft[1]} A ${cutRx} ${cutRy} 0 0 0 ${cutRight[0]} ${cutRight[1]}`}
                  fill="none"
                  stroke="var(--visual-stroke, #09090b)"
                  strokeWidth={2}
                />
                {crossSectionHatched && (
                  <ellipse
                    cx={cx}
                    cy={cutY}
                    rx={cutRx}
                    ry={cutRy}
                    fill={`url(#${patternId})`}
                    stroke="none"
                  />
                )}
                {/* Center of section */}
                <circle cx={cutCenter[0]} cy={cutCenter[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={cutLeft[0]} cy={cutLeft[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={cutRight[0]} cy={cutRight[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                {renderLabel(labels.cutLeft || 'G', cutLeft[0], cutLeft[1], 'left', 13, 'lbl_G')}
                {renderLabel(labels.cutCenter || 'H', cutCenter[0], cutCenter[1], 'top-left', 13, 'lbl_H')}
                {renderLabel(labels.cutRight || 'E', cutRight[0], cutRight[1], 'right', 13, 'lbl_E')}
              </g>
            )}

            {/* Lateral outline lines */}
            <line x1={apex[0]} y1={apex[1]} x2={baseLeft[0]} y2={baseLeft[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={apex[0]} y1={apex[1]} x2={baseRight[0]} y2={baseRight[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />

            {/* Cone axis height (dashed) */}
            {showAxes && (
              <line
                x1={apex[0]}
                y1={apex[1]}
                x2={baseCenter[0]}
                y2={baseCenter[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Base diameter or radius */}
            {parameters.showBaseDiameter !== false && (
              <line
                x1={baseLeft[0]}
                y1={baseLeft[1]}
                x2={baseRight[0]}
                y2={baseRight[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Right angle at baseCenter if axial cut */}
            {crossSectionType === 'axial' && (
              renderRightAngle(
                { corner: baseCenter, dir1: [0, -1], dir2: [1, 0], size: 8 },
                'cone_ra'
              )
            )}

            {/* Key vertices */}
            <circle cx={apex[0]} cy={apex[1]} r={3.5} fill="var(--visual-stroke, #09090b)" />
            <circle cx={baseCenter[0]} cy={baseCenter[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            {crossSectionType !== 'oblique' && (
              <>
                <circle cx={baseLeft[0]} cy={baseLeft[1]} r={3} fill="var(--visual-stroke, #09090b)" />
                <circle cx={baseRight[0]} cy={baseRight[1]} r={3} fill="var(--visual-stroke, #09090b)" />
              </>
            )}

            {/* Labels */}
            {renderLabel(labels.apex || 'V', apex[0], apex[1], 'top', 13, 'lbl_Apex')}
            {renderLabel(labels.baseCenter || 'O', baseCenter[0], baseCenter[1], 'bottom', 13, 'lbl_BaseCenter')}
            {crossSectionType !== 'oblique' && (
              <>
                {renderLabel(labels.baseLeft || 'A', baseLeft[0], baseLeft[1], 'left', 13, 'lbl_BaseLeft')}
                {renderLabel(labels.baseRight || 'C', baseRight[0], baseRight[1], 'right', 13, 'lbl_BaseRight')}
              </>
            )}
          </g>
        );
      }

      case 'frustum': {
        const R = parameters.bottomRadius || 75;
        const r = parameters.topRadius || 42;
        const ryB = R * 0.26;
        const ryT = r * 0.26;
        const H = parameters.height || 115;
        const topY = cy - H / 2;
        const botY = cy + H / 2;

        const ptD: [number, number] = [cx, topY];
        const ptA: [number, number] = [cx + r, topY];
        const ptTopLeft: [number, number] = [cx - r, topY];

        const ptC: [number, number] = [cx, botY];
        const ptB: [number, number] = [cx + R, botY];
        const ptBotLeft: [number, number] = [cx - R, botY];

        return (
          <g className="solid-frustum">
            {/* Axial trapezoid cross-section (right half) */}
            {showCrossSection && (
              <polygon
                points={`${ptD[0]},${ptD[1]} ${ptA[0]},${ptA[1]} ${ptB[0]},${ptB[1]} ${ptC[0]},${ptC[1]}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.12)'}
                stroke="none"
              />
            )}

            {/* Bottom ellipse: rear dashed, front solid */}
            <path
              d={`M ${ptBotLeft[0]} ${ptBotLeft[1]} A ${R} ${ryB} 0 0 1 ${ptB[0]} ${ptB[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
            />
            <path
              d={`M ${ptBotLeft[0]} ${ptBotLeft[1]} A ${R} ${ryB} 0 0 0 ${ptB[0]} ${ptB[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Top ellipse: full solid */}
            <ellipse
              cx={cx}
              cy={topY}
              rx={r}
              ry={ryT}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Envelope sides */}
            <line x1={ptTopLeft[0]} y1={ptTopLeft[1]} x2={ptBotLeft[0]} y2={ptBotLeft[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={ptA[0]} y1={ptA[1]} x2={ptB[0]} y2={ptB[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />

            {/* Central Axis DC */}
            {showAxes && (
              <line
                x1={ptD[0]}
                y1={ptD[1]}
                x2={ptC[0]}
                y2={ptC[1]}
                stroke="var(--visual-stroke, #09090b)"
                strokeWidth={1.8}
                strokeDasharray="4 4"
              />
            )}

            {/* Top radius DA */}
            <line
              x1={ptD[0]}
              y1={ptD[1]}
              x2={ptA[0]}
              y2={ptA[1]}
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
            />

            {/* Bottom radius CB */}
            <line
              x1={ptC[0]}
              y1={ptC[1]}
              x2={ptB[0]}
              y2={ptB[1]}
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
            />

            {/* Points */}
            <circle cx={ptD[0]} cy={ptD[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            <circle cx={ptA[0]} cy={ptA[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            <circle cx={ptC[0]} cy={ptC[1]} r={3} fill="var(--visual-stroke, #09090b)" />
            <circle cx={ptB[0]} cy={ptB[1]} r={3} fill="var(--visual-stroke, #09090b)" />

            {/* Labels */}
            {renderLabel(labels.topCenter || 'D', ptD[0], ptD[1], 'top-left', 13, 'lbl_D')}
            {renderLabel(labels.topRight || 'A', ptA[0], ptA[1], 'top-right', 13, 'lbl_A')}
            {renderLabel(labels.bottomCenter || 'C', ptC[0], ptC[1], 'bottom-left', 13, 'lbl_C')}
            {renderLabel(labels.bottomRight || 'B', ptB[0], ptB[1], 'bottom-right', 13, 'lbl_B')}
            {renderLabel(labels.topRadius || 'r', (ptD[0] + ptA[0]) / 2, ptD[1] - 4, 'bottom', 12, 'lbl_r')}
            {renderLabel(labels.bottomRadius || 'R', (ptC[0] + ptB[0]) / 2, ptC[1] + 6, 'bottom', 12, 'lbl_R')}
            {renderLabel(labels.height || 'h', ptD[0] - 10, (ptD[1] + ptC[1]) / 2, 'left', 12, 'lbl_h')}
            {renderLabel(labels.slant || 'g', (ptA[0] + ptB[0]) / 2 + 8, (ptA[1] + ptB[1]) / 2, 'right', 12, 'lbl_g')}
          </g>
        );
      }

      case 'cube':
      case 'prism': {
        const w = parameters.width || parameters.boxWidth || 100;
        const h = parameters.height || parameters.boxHeight || 75;
        const depth = parameters.depth || parameters.boxDepth || 55;
        const angle = (parameters.projectionAngle || 35) * (Math.PI / 180);
        const dx = depth * Math.cos(angle);
        const dy = depth * Math.sin(angle);

        // Front Face bottom-left anchor
        const x0 = cx - (w + dx) / 2;
        const y0 = cy + (h - dy) / 2;

        // Front Face: 4 vertices
        const fBL: [number, number] = [x0, y0];
        const fBR: [number, number] = [x0 + w, y0];
        const fTR: [number, number] = [x0 + w, y0 - h];
        const fTL: [number, number] = [x0, y0 - h];

        // Back Face: 4 vertices
        const bBL: [number, number] = [x0 + dx, y0 - dy];
        const bBR: [number, number] = [x0 + w + dx, y0 - dy];
        const bTR: [number, number] = [x0 + w + dx, y0 - h - dy];
        const bTL: [number, number] = [x0 + dx, y0 - h - dy];

        return (
          <g className="solid-prism">
            {/* Shaded bottom face if showCrossSection is true */}
            {showCrossSection && (
              <polygon
                points={`${fBL[0]},${fBL[1]} ${fBR[0]},${fBR[1]} ${bBR[0]},${bBR[1]} ${bBL[0]},${bBL[1]}`}
                fill={crossSectionHatched ? `url(#${patternId})` : 'rgba(37,99,235,0.15)'}
                stroke="none"
              />
            )}

            {/* Rear hidden edges (dashed) */}
            <line x1={fBL[0]} y1={fBL[1]} x2={bBL[0]} y2={bBL[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={1.8} strokeDasharray="4 4" />
            <line x1={bBL[0]} y1={bBL[1]} x2={bBR[0]} y2={bBR[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={1.8} strokeDasharray="4 4" />
            <line x1={bBL[0]} y1={bBL[1]} x2={bTL[0]} y2={bTL[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={1.8} strokeDasharray="4 4" />

            {/* Visible Front Face */}
            <polygon
              points={`${fBL[0]},${fBL[1]} ${fBR[0]},${fBR[1]} ${fTR[0]},${fTR[1]} ${fTL[0]},${fTL[1]}`}
              fill="none"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth={2}
            />

            {/* Visible Back/Top/Right Edges */}
            <line x1={fTL[0]} y1={fTL[1]} x2={bTL[0]} y2={bTL[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={fTR[0]} y1={fTR[1]} x2={bTR[0]} y2={bTR[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={bTL[0]} y1={bTL[1]} x2={bTR[0]} y2={bTR[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={fBR[0]} y1={fBR[1]} x2={bBR[0]} y2={bBR[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />
            <line x1={bBR[0]} y1={bBR[1]} x2={bTR[0]} y2={bTR[1]} stroke="var(--visual-stroke, #09090b)" strokeWidth={2} />

            {/* Dimension indicators if provided */}
            {labels.width && renderLabel(labels.width, (fBL[0] + fBR[0]) / 2, fBL[1] + 8, 'bottom', 12, 'lbl_w')}
            {labels.height && renderLabel(labels.height, fBL[0] - 8, (fBL[1] + fTL[1]) / 2, 'left', 12, 'lbl_h')}
            {labels.depth && renderLabel(labels.depth, (fBR[0] + bBR[0]) / 2 + 8, (fBR[1] + bBR[1]) / 2 + 4, 'right', 12, 'lbl_d')}
          </g>
        );
      }

      default:
        return null;
    }
  };

  // Render extra custom segments or points if specified
  const renderAdditionalGeometry = () => {
    return (
      <g className="solid-additional">
        {segments.map((seg, idx) => (
          <g key={`seg_${idx}`}>
            <line
              x1={seg.from[0]}
              y1={seg.from[1]}
              x2={seg.to[0]}
              y2={seg.to[1]}
              stroke={seg.color || 'var(--visual-stroke, #09090b)'}
              strokeWidth={seg.strokeWidth || 1.8}
              strokeDasharray={seg.dashed ? '4 4' : undefined}
            />
            {seg.label &&
              renderLabel(
                seg.label,
                (seg.from[0] + seg.to[0]) / 2,
                (seg.from[1] + seg.to[1]) / 2,
                'top',
                12,
                `seg_lbl_${idx}`
              )}
          </g>
        ))}

        {rightAngles.map((ra, idx) => renderRightAngle(ra, `extra_ra_${idx}`))}

        {points.map((pt, idx) => (
          <g key={`pt_${idx}`}>
            {pt.showPoint !== false && (
              <circle
                cx={pt.coords[0]}
                cy={pt.coords[1]}
                r={3.2}
                fill="var(--visual-stroke, #09090b)"
              />
            )}
            {pt.label &&
              renderLabel(
                pt.label,
                pt.coords[0],
                pt.coords[1],
                pt.labelPosition || 'top-right',
                13,
                `pt_lbl_${idx}`
              )}
          </g>
        ))}
      </g>
    );
  };

  // Reference side box (standard in MEP exams for Collinearity and Center definitions)
  const renderReferenceBox = () => {
    if (!hasRefBox || !referenceBox) return null;

    const boxW = 160;
    const boxX = width - boxW - 12;
    const lineSpacing = 18;
    const boxH = Math.max(50, 16 + referenceBox.lines.length * lineSpacing);
    const boxY = 16;

    return (
      <g className="solid-reference-box">
        <rect
          x={boxX}
          y={boxY}
          width={boxW}
          height={boxH}
          fill="var(--visual-bg, #ffffff)"
          stroke="var(--visual-stroke, #09090b)"
          strokeWidth={1.5}
          rx={2}
        />
        {referenceBox.title && (
          <text
            x={boxX + boxW / 2}
            y={boxY + 16}
            textAnchor="middle"
            fontSize={11}
            fontWeight="bold"
            fill="var(--visual-text, #09090b)"
          >
            {referenceBox.title}
          </text>
        )}
        {referenceBox.lines.map((line, idx) => (
          <text
            key={`box_line_${idx}`}
            x={boxX + boxW / 2}
            y={boxY + (referenceBox.title ? 28 : 18) + idx * lineSpacing}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight="medium"
            fill="var(--visual-text, #09090b)"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div
      className="solid-3d-container flex justify-center items-center w-full max-w-full select-none"
      style={{
        ['--visual-stroke' as any]: 'currentColor',
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        className="max-w-[440px] text-zinc-900 dark:text-zinc-100 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={patternId}
            width="8"
            height="8"
            patternTransform={`rotate(${hatchAngle})`}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="var(--visual-stroke, #09090b)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>

        {renderShapeGeometry()}
        {renderAdditionalGeometry()}
        {renderReferenceBox()}
      </svg>
    </div>
  );
};

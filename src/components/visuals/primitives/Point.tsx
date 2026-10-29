import React from 'react';
import { CoordinateTransform } from '../../../utils/coordinateTransform';
import { TextRenderer } from '../../common/TextRenderer';

export interface PointProps {
  coords?: [number, number];
  x?: number;
  y?: number;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  color?: string;
  radius?: number;
  transform: CoordinateTransform;
}

export const Point: React.FC<PointProps> = ({
  coords,
  x,
  y,
  label,
  labelPosition = 'top-right',
  color = 'var(--visual-primary, #2563eb)',
  radius = 4,
  transform,
}) => {
  const ptX = coords ? coords[0] : x ?? 0;
  const ptY = coords ? coords[1] : y ?? 0;
  const { px, py } = transform.toPixel(ptX, ptY);

  // Calculate smart offsets based on position
  let dx = 8;
  let dy = -8;
  let textAnchor: 'start' | 'middle' | 'end' = 'start';

  switch (labelPosition) {
    case 'top':
      dx = 0;
      dy = -(radius + 8);
      textAnchor = 'middle';
      break;
    case 'bottom':
      dx = 0;
      dy = radius + 14;
      textAnchor = 'middle';
      break;
    case 'left':
      dx = -(radius + 8);
      dy = 4;
      textAnchor = 'end';
      break;
    case 'right':
      dx = radius + 8;
      dy = 4;
      textAnchor = 'start';
      break;
    case 'top-left':
      dx = -(radius + 6);
      dy = -(radius + 6);
      textAnchor = 'end';
      break;
    case 'bottom-left':
      dx = -(radius + 6);
      dy = radius + 12;
      textAnchor = 'end';
      break;
    case 'bottom-right':
      dx = radius + 6;
      dy = radius + 12;
      textAnchor = 'start';
      break;
    case 'top-right':
    default:
      dx = radius + 6;
      dy = -(radius + 6);
      textAnchor = 'start';
      break;
  }

  const isMathOrComplex = label && (label.includes('$') || label.includes('\\') || label.length > 10);

  return (
    <g className="primitive-point">
      {radius > 0 && (
        <circle
          cx={px}
          cy={py}
          r={radius}
          fill={color}
          stroke="var(--visual-bg, #ffffff)"
          strokeWidth={1.5}
        />
      )}
      {label && (
        isMathOrComplex ? (
          <foreignObject
            x={px + (textAnchor === 'end' ? dx - 80 : textAnchor === 'middle' ? dx - 40 : dx)}
            y={py + dy - 12}
            width={80}
            height={32}
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
              <TextRenderer content={label} />
            </div>
          </foreignObject>
        ) : (
          <text
            x={px + dx}
            y={py + dy}
            textAnchor={textAnchor}
            fontSize={12}
            fontWeight="bold"
            fill="var(--visual-text, #09090b)"
            stroke="var(--visual-halo, rgba(255, 255, 255, 0.92))"
            strokeWidth="3.5px"
            paintOrder="stroke fill"
            strokeLinejoin="round"
          >
            {label}
          </text>
        )
      )}
    </g>
  );
};

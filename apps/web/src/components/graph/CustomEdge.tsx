import type { EdgeProps } from '@xyflow/react';
import { getSmoothStepPath } from '@xyflow/react';

// Define edge style interface for type safety
interface EdgeStyle {
  stroke?: string;
  strokeWidth?: number;
}

export function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
  } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Extract stroke color from style to apply as SVG attribute
  const edgeStyle = style as EdgeStyle;
  const stroke = edgeStyle?.stroke || '#6b7280';
  const strokeWidth = edgeStyle?.strokeWidth || 2;

  return (
    <>
      <path
        id={id}
        d={edgePath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={markerEnd}
        className="react-flow__edge-path"
      />
      {label && (
        <g>
          {labelShowBg && (
            <rect
              x={labelX - (labelBgPadding?.[0] ?? 2)}
              y={labelY - (labelBgPadding?.[1] ?? 2)}
              width={(labelBgPadding?.[0] ?? 2) * 2}
              height={(labelBgPadding?.[1] ?? 2) * 2}
              rx={labelBgBorderRadius ?? 2}
              ry={labelBgBorderRadius ?? 2}
              style={labelBgStyle}
              className="react-flow__edge-label-bg"
            />
          )}
          <text
            x={labelX}
            y={labelY}
            style={labelStyle}
            className="react-flow__edge-text"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
}

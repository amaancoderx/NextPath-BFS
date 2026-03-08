import { ConnectionLineComponentProps } from "@xyflow/react";
import React from "react";
import { getStraightPath } from "@xyflow/react";

function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle } : ConnectionLineComponentProps) {
    const [edgePath] = getStraightPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
    });

    return (
        <g>
            <path style={connectionLineStyle} fill="none" d={edgePath} strokeWidth={3} />
            <circle
                cx={toX}
                cy={toY}
                fill="black"
                r={3}
                stroke="black"
                strokeWidth={1.5}
            />
        </g>
    );
}

export default CustomConnectionLine;

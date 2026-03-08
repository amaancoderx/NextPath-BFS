import {
    useInternalNode,
    getBezierPath,
    getStraightPath,
    useStore,
    BaseEdge,
    type EdgeProps,
    type ReactFlowState,
    EdgeLabelRenderer,
} from "@xyflow/react";

import { getEdgeParams } from "@/app/utils/xyflowUtils/util";
import { useNodeStore } from "@/app/store/nodeStore";
import { Plane } from "lucide-react";

type GetSpecialPathParams = {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
};

const getSpecialPath = (
    { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
    offset: number
): [string, number, number] => {
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    const path = `M ${sourceX} ${sourceY} Q ${centerX} ${
        centerY + offset
    } ${targetX} ${targetY}`;

    // Label position is at the control point of the quadratic Bezier curve
    const labelX = centerX;
    const labelY = centerY + offset + (offset < 0 ? 12 : -12); // Adjust label position based on offset

    return [path, labelX, labelY];
};

export default function FloatingEdgeWithBidirectionalSupport({ id, source, target, markerEnd, style, label, animated, data }: EdgeProps) {
    const { n_isDirected, showWeights, map } = useNodeStore();

    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);
    const isFreeFlow = map === "freeFlow";

    const isBiDirectionEdge = useStore((s: ReactFlowState) =>
        s.edges.some(
            (e) =>
                e.id !== id &&
                ((e.source === target && e.target === source) ||
                    (e.target === target && e.source === source))
        )
    );

    if (!sourceNode || !targetNode) return null;

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
        sourceNode,
        targetNode
    );

    let path: string;
    let labelX: number = 0;
    let labelY: number = 0;

    if (isBiDirectionEdge && n_isDirected) {
        const offset = sx < tx ? 25 : -25;
        [path, labelX, labelY] = getSpecialPath(
            { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty },
            offset
        );
    } else if (isFreeFlow) {
        if (data && data.isReversed){
            [path, labelX, labelY] = getBezierPath({
                sourceX: tx,
                sourceY: ty,
                sourcePosition: targetPos,
                targetX: sx,
                targetY: sy,
                targetPosition: sourcePos,
            });
        } else {
            [path, labelX, labelY] = getBezierPath({
                sourceX: sx,
                sourceY: sy,
                sourcePosition: sourcePos,
                targetX: tx,
                targetY: ty,
                targetPosition: targetPos,
            });
        }
    } else {
        if (data && data.isReversed){
            [path, labelX, labelY] = getStraightPath({
                sourceX: tx,
                sourceY: ty,
                targetX: sx,
                targetY: sy,
            });
        } else {
            [path, labelX, labelY] = getStraightPath({
                sourceX: sx,
                sourceY: sy,
                targetX: tx,
                targetY: ty,
            });
        }
    }

    const markerEndType = n_isDirected ? markerEnd : undefined;

    return (
        <>
            <BaseEdge path={path} markerEnd={markerEndType} style={style} />
            {showWeights && label && (
                <EdgeLabelRenderer>
                    <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="nodrag nopan bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700" >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
            {animated && (
                <svg width={17} height={17} xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <Plane width={17} height={17} color="none" fill="#000000" className="fill-black dark:fill-white" />
                        <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            fill="freeze"
                            path={path}
                            rotate="auto"
                        />
                    </g>
                </svg>
            )}
        </>
    );
}

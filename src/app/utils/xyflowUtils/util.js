import { Position, MarkerType } from "@xyflow/react";

function getNodeIntersection(intersectionNode, targetNode) {
    const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
        intersectionNode.measured;
    const intersectionNodePosition =
        intersectionNode.internals.positionAbsolute;
    const targetPosition = targetNode.internals.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + targetNode.measured.width / 2;
    const y1 = targetPosition.y + targetNode.measured.height / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.internals.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + n.measured.width - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    if (py >= n.y + n.measured.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

export function createNodesAndEdges() {
    const nodes = [];
    const edges = [];
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    nodes.push({ id: "target", data: { label: "Target" }, position: center });

    for (let i = 0; i < 8; i++) {
        const degrees = i * (360 / 8);
        const radians = degrees * (Math.PI / 180);
        const x = 250 * Math.cos(radians) + center.x;
        const y = 250 * Math.sin(radians) + center.y;

        nodes.push({
            id: `${i}`,
            data: { label: "Source" },
            position: { x, y },
        });

        edges.push({
            id: `edge-${i}`,
            target: "target",
            source: `${i}`,
            type: "floating",
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
        });
    }

    return { nodes, edges };
}

export const getInitialNodes = () => {
    const nodes = [
        {
            id: "0",
            type: "custom",
            position: {
                x: 100,
                y: 100,
            },
            data: {
                label: "Node 0",
                isStart: true,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "1",
            type: "custom",
            position: {
                x: 215.5,
                y: 258,
            },
            data: {
                label: "Node 1",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "2",
            type: "custom",
            position: {
                x: 215.5,
                y: -46,
            },
            data: {
                label: "Node 2",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "3",
            type: "custom",
            position: {
                x: 302,
                y: 43,
            },
            data: {
                label: "Node 3",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "4",
            type: "custom",
            position: {
                x: 302,
                y: 161,
            },
            data: {
                label: "Node 4",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "5",
            type: "custom",
            position: {
                x: 487,
                y: 100,
            },
            data: {
                label: "Node 5",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "6",
            type: "custom",
            position: {
                x: 642,
                y: 190,
            },
            data: {
                label: "Node 6",
                isStart: false,
                isEnd: false,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
        {
            id: "7",
            type: "custom",
            position: {
                x: 642,
                y: 15,
            },
            data: {
                label: "Node 7",
                isStart: false,
                isEnd: true,
                visited: false,
                isWall: false,
                isPath: false,
            },
        },
    ];
    return nodes;
};

export const getInitialEdges = () => {
    const edges = [
        // Node 0 connections
        {
            id: "xy-edge__0-3",
            source: "0",
            target: "3",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        {
            id: "xy-edge__0-4",
            source: "0",
            target: "4",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 1 connections
        {
            id: "xy-edge__1-2",
            source: "1",
            target: "2",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        {
            id: "xy-edge__4-1",
            source: "4",
            target: "1",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 2 connections
        {
            id: "xy-edge__3-2",
            source: "3",
            target: "2",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 3 connections
        {
            id: "xy-edge__3-5",
            source: "3",
            target: "5",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        {
            id: "xy-edge__3-4",
            source: "3",
            target: "4",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 4 connections
        {
            id: "xy-edge__4-5",
            source: "4",
            target: "5",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 5 connections
        {
            id: "xy-edge__5-6",
            source: "5",
            target: "6",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        {
            id: "xy-edge__5-7",
            source: "5",
            target: "7",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
        // Node 6 connections
        {
            id: "xy-edge__7-6",
            source: "7",
            target: "6",
            type: "floating",
            label: "1",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { isReversed: false },
        },
    ];
    return edges;
};

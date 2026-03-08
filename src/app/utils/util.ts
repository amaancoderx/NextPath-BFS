import { Node, Edge } from "@xyflow/react";
import { useGraphStore } from "../store/gridStore";
import { useNodeStore } from "../store/nodeStore";
import pako from 'pako';
import { Buffer } from 'buffer';
import base64url from 'base64url';

export const directions = [
    { row: 0, col: 1 }, // Right
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: -1, col: 0 }, // Up
];

export function isValidPosition(row: number, col: number, rows: number, cols: number): boolean {
    return row >= 0 && row < rows && col >= 0 && col < cols;
};

// Utility to calculate grid defaults based on screen size
export const calculateCellSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const widthScalingFactor = screenWidth / 1536;
    const heightScalingFactor = screenHeight / 731;

    // Calculate the average scaling factor
    const averageScalingFactor = (widthScalingFactor + heightScalingFactor) / 2;

    // Calculate and round off the new cell size
    const newCellSize = 55 * averageScalingFactor;

    // Round off to the specified decimal places
    return Math.round(newCellSize);
};

export const getRowColBasedCellSize = (defaultRows: number, defaultCols: number, newRows: number, newColumns: number, originalCellSize: number) => {
    const originalRowCells = defaultRows;
    const originalColCells = defaultCols;

    // Scale the cell size based on the ratio of total cells
    const newCellSize1 = originalCellSize * (originalRowCells / newRows);
    const newCellSize2 = originalCellSize * (originalColCells / newColumns);
    const newCellSize = Math.min(newCellSize1, newCellSize2, 150);

    return Math.round(newCellSize);
};

export const getGridDefaults = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 640) {
        return { defRows: 8, defCols: 8, defCellSize: 35 };
    }

    return { defRows: 10, defCols: 20, defCellSize: 50 };
};

export function constructAdjacencyList(nodes: Node[], edges: Edge[], isDirected: boolean) {
    const adjacencyList = new Map<string, Array<{ neighbor: string; weight: number }>>();

    nodes.forEach((node) => {
        adjacencyList.set(node.id, []);
    });

    edges.forEach((edge) => {
        const weight = edge.label ? parseInt(String(edge.label)) : 1;

        adjacencyList.get(edge.source)!.push({ neighbor: edge.target, weight });
        if (!isDirected) {
            adjacencyList.get(edge.target)!.push({ neighbor: edge.source, weight });
        }
    });

    return adjacencyList;
};

export function getEdgesForNodes(path: string[], storeEdges: Edge[], toggleEdgeReverse: (id: string) => void) {
    const PathEdges: string[] = [];

    for (let i = 1; i < path.length; i++) {
        let edgeId = `xy-edge__${path[i - 1]}-${path[i]}`;
        if (!storeEdges.some((edge) => edge.id === edgeId)) {
            edgeId = `xy-edge__${path[i]}-${path[i - 1]}`;
            toggleEdgeReverse(edgeId);
        }
        PathEdges.push(edgeId);
    }

    return PathEdges;
}

export async function constructLinkData() {
    const { type, rows, cols, cellSize, maze, speed, algorithm, isWeighted, startNode, endNode, walls, defaultRows, defaultCols, defaultCellSize } = useGraphStore.getState();
    const { n_id, n_algorithm, n_isDirected, n_isWeighted, n_speed, storeNodes, storeEdges, StartNodeId, EndNodeId, map } = useNodeStore.getState();

    const processedWalls = walls.map((wall) => {
        return [wall.row, wall.col];
    });

    const processedNodes = storeNodes.map((node) => {
        return [node.id, node.position.x, node.position.y, node.data.label, node.data.isStart ? 1 : 0, node.data.isEnd ? 1 : 0];
    });

    const processedEdges = storeEdges.map((edge) => {
        return [edge.id, edge.source, edge.target, edge.label];
    });

    const data = {
        grid: {
            t: type,
            r: rows,
            c: cols,
            cs: cellSize,
            m: maze,
            s: speed,
            alg: algorithm,
            isw: isWeighted ? 1 : 0,
            sn: [startNode.row, startNode.col],
            en: [endNode.row, endNode.col],
            w: processedWalls,
            dr: defaultRows,
            dc: defaultCols,
            dcs: defaultCellSize
        },
        node: {
            id: n_id,
            alg: n_algorithm,
            isd: n_isDirected ? 1 : 0,
            isw: n_isWeighted ? 1 : 0,
            s: n_speed,
            n: map === "freeFlow" ? processedNodes : [],
            e: map === "freeFlow" ? processedEdges : [],
            sn: StartNodeId,
            en: EndNodeId,
            m: map
        }
    };

    const linkData = data;
    const stringedLinkData = JSON.stringify(linkData);
    const compressed = pako.deflate(stringedLinkData, { level: 9 });
    const encoded = base64url.encode(Buffer.from(compressed));

    return encoded;
}
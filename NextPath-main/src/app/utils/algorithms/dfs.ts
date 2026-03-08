"use client";

import { Position, useGraphStore, Node } from "@/app/store/gridStore";
import { addAnimationForEdges, addPathsWithDelay, addPathsWithDelayForNodes, addVisitedWithDelay, addVisitedWithDelayForNodes } from "../animation";
import { constructAdjacencyList, directions, getEdgesForNodes, isValidPosition } from "../util";
import { useNodeStore } from "@/app/store/nodeStore";

function dfsHelper(
    row: number,
    col: number,
    grid: Node[][],
    visited: boolean[][],
    visitedNodesInOrder: Position[],
    path: Position[]
): boolean {
    if (
        !isValidPosition(row, col, grid.length, grid[0].length) ||
        visited[row][col] ||
        grid[row][col].isWall
    ) {
        return false;
    }

    visited[row][col] = true;
    visitedNodesInOrder.push({ row: row, col: col });
    path.push({ row: row, col: col });

    if (grid[row][col].isEnd) {
        return true;
    }

    if (
        dfsHelper(row, col + 1, grid, visited, visitedNodesInOrder, path) || // Right
        dfsHelper(row + 1, col, grid, visited, visitedNodesInOrder, path) || // Down
        dfsHelper(row, col - 1, grid, visited, visitedNodesInOrder, path) || // Left
        dfsHelper(row - 1, col, grid, visited, visitedNodesInOrder, path) // Up
    ) {
        return true;
    }

    path.pop();
    return false;
}

export async function applyDFSAlgorithm(): Promise<boolean> {
    const { grid, rows, cols, startNode, speed, toggleVisited, togglePath } =
        useGraphStore.getState();

    const visitedNodesInOrder: Position[] = [];
    const visited: boolean[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
    );
    const path: Position[] = [];
    let isEndReached = false;

    visited[startNode.row][startNode.col] = true;
    for (const { row, col } of directions) {
        const newRow = startNode.row + row;
        const newCol = startNode.col + col;

        if (
            dfsHelper(newRow, newCol, grid, visited, visitedNodesInOrder, path)
        ) {
            isEndReached = true;
            break;
        }
        path.length = 0; // Clear path for next iteration
    }

    await addVisitedWithDelay(visitedNodesInOrder, speed, toggleVisited);
    if (isEndReached) {
        await addPathsWithDelay(path, speed, toggleVisited, togglePath);
    }

    return true;
}

function dfsHelperForNodes(node: string, visited: { [key: string]: boolean }, visitedNodesInOrder: string[], path: string[], adjacencyList: Map<string, {neighbor: string;weight: number;}[]>, EndNodeId: string, walls: string[]): boolean {
    if(visited[node] || walls.includes(node)) {
        return false;
    }
    if (node === EndNodeId) {
        path.push(node);
        return true;
    }

    visited[node] = true;
    visitedNodesInOrder.push(node);
    path.push(node);
    
    const neighbors = adjacencyList.get(node) || [];
    for (const neighbor of neighbors) {
        if (dfsHelperForNodes(neighbor.neighbor, visited, visitedNodesInOrder, path, adjacencyList, EndNodeId, walls)) {
            return true;
        }
    }

    path.pop();
    return false;
}

export async function applyDFSAlgorithmForNodes(): Promise<boolean> {
    const { storeNodes, storeEdges, n_isDirected, StartNodeId, EndNodeId, n_speed, toggleVisited, togglePath, toggleAnimatedEdge, toggleEdgeReverse } = useNodeStore.getState();

    const walls: string[] = storeNodes.filter((node) => node.data.isWall).map((node) => node.id);
    const adjacencyList = constructAdjacencyList(storeNodes, storeEdges, n_isDirected);
    const visitedNodesInOrder: string[] = [];
    const path: string[] = [];
    const visited: { [key: string]: boolean } = { [StartNodeId]: true };
    
    let isEndReached = false;

    for (const node of adjacencyList.get(StartNodeId)!) {
        path.push(StartNodeId);

        if (dfsHelperForNodes(node.neighbor, visited, visitedNodesInOrder, path, adjacencyList, EndNodeId, walls)) {
            isEndReached = true;
            break;
        }
        path.length = 0; // Clear path for next iteration
    }

    await addVisitedWithDelayForNodes(visitedNodesInOrder, n_speed, toggleVisited);
    if (isEndReached) {
        await addPathsWithDelayForNodes(path, n_speed, toggleVisited, togglePath);
        
        const PathEdges: string[] = getEdgesForNodes(path, storeEdges, toggleEdgeReverse);
        addAnimationForEdges(PathEdges, n_speed, toggleAnimatedEdge);
    }

    return true;
}
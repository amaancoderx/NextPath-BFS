"use client";

import { useGraphStore, Node, Position } from "../../store/gridStore";
import { constructAdjacencyList, directions, getEdgesForNodes, isValidPosition } from "../util";
import { addVisitedWithDelay, addPathsWithDelay, addVisitedWithDelayForNodes, addPathsWithDelayForNodes, addAnimationForEdges } from "../animation";
import { useNodeStore } from "@/app/store/nodeStore";

function reconstructPath(
    cameFrom: (Position | null)[][],
    start: Node,
    end: Node
): Position[] {
    const path: Position[] = [];
    let current: Position | null = { row: end.row, col: end.col };

    while (
        current &&
        !(current.row === start.row && current.col === start.col)
    ) {
        path.push(current);
        current = cameFrom[current.row][current.col];
    }

    path.push({ row: start.row, col: start.col });
    return path.reverse(); // From start to end
}

export async function applyBFSAlgorithm(): Promise<boolean> {
    const { grid, rows, cols, startNode, speed, toggleVisited, togglePath } =
        useGraphStore.getState();
    const queue: Node[] = [];
    const visitedNodesInOrder: Position[] = [];

    const visited: boolean[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
    );
    const parent: (Position | null)[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(null)
    );

    queue.push(grid[startNode.row][startNode.col]);
    visited[startNode.row][startNode.col] = true;

    let endReached = false;

    while (queue.length > 0) {
        const currentNode = queue.shift()!;
        visitedNodesInOrder.push({
            row: currentNode.row,
            col: currentNode.col,
        });

        if (currentNode.isEnd) {
            endReached = true;
            break;
        }

        for (const { row: dRow, col: dCol } of directions) {
            const newRow = currentNode.row + dRow;
            const newCol = currentNode.col + dCol;

            if (
                isValidPosition(newRow, newCol, rows, cols) &&
                !visited[newRow][newCol] &&
                !grid[newRow][newCol].isWall
            ) {
                queue.push(grid[newRow][newCol]);
                visited[newRow][newCol] = true;
                parent[newRow][newCol] = {
                    row: currentNode.row,
                    col: currentNode.col,
                };
            }
        }
    }

    await addVisitedWithDelay(visitedNodesInOrder, speed, toggleVisited);
    if (endReached) {
        const shortestPath = reconstructPath(
            parent,
            grid[startNode.row][startNode.col],
            grid
                .find((row) => row.find((node) => node.isEnd))!
                .find((node) => node.isEnd)!
        );
        await addPathsWithDelay(shortestPath, speed, toggleVisited, togglePath);
    }

    return true;
};

export async function applyBFSAlgorithmForNodes(): Promise<boolean> {
    const { storeNodes, storeEdges, n_isDirected, StartNodeId, EndNodeId, n_speed, toggleVisited, togglePath, toggleAnimatedEdge, toggleEdgeReverse } = useNodeStore.getState();

    const adjacencyList = constructAdjacencyList(storeNodes, storeEdges, n_isDirected);
    const walls: string[] = storeNodes.filter((node) => node.data.isWall).map((node) => node.id);

    const queue: string[] = [StartNodeId];
    const visited: { [key: string]: boolean } = { [StartNodeId]: true };
    const parent: { [key: string]: string | null } = { [StartNodeId]: null };
    const visitedNodesInOrder: string[] = [];

    let endReached = false;
    while (queue.length > 0) {
        const currentNodeId = queue.shift()!;
        visitedNodesInOrder.push(currentNodeId);

        if (walls.includes(currentNodeId)) {
            continue;
        }

        if (currentNodeId === EndNodeId) {
            endReached = true;
            break;
        }

        for (const n of adjacencyList.get(currentNodeId)!) {
            const neighbor = n.neighbor;
            if (!visited[neighbor]) {
                queue.push(neighbor);
                visited[neighbor] = true;
                parent[neighbor] = currentNodeId;
            }
        }
    }

    await addVisitedWithDelayForNodes(visitedNodesInOrder, n_speed, toggleVisited);
    if (endReached) {
        const path: string[] = [];

        let currentNodeId: string | null = EndNodeId;
        while (currentNodeId !== null) {
            path.push(currentNodeId);
            currentNodeId = parent[currentNodeId];
        }

        path.reverse();
        addPathsWithDelayForNodes(path, n_speed, toggleVisited, togglePath);

        const PathEdges: string[] = getEdgesForNodes(path, storeEdges, toggleEdgeReverse);
        addAnimationForEdges(PathEdges, n_speed, toggleAnimatedEdge);
    }

    return true;
};
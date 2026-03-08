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

export async function applyDijkstraAlgorithm(): Promise<boolean> {
    const { grid, rows, cols, startNode, speed, toggleVisited, togglePath } =
        useGraphStore.getState();
    const visitedNodesInOrder: Position[] = [];

    const distances: number[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(Infinity)
    );
    const parent: (Position | null)[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(null)
    );
    const queue: Node[] = [];

    distances[startNode.row][startNode.col] = 0;
    queue.push(grid[startNode.row][startNode.col]);

    let endReached = false;

    while (queue.length > 0) {
        queue.sort((a, b) => distances[a.row][a.col] - distances[b.row][b.col]);
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
                !grid[newRow][newCol].isWall
            ) {
                const newDistance =
                    distances[currentNode.row][currentNode.col] +
                    grid[newRow][newCol].weight;

                if (newDistance < distances[newRow][newCol]) {
                    distances[newRow][newCol] = newDistance;
                    parent[newRow][newCol] = {
                        row: currentNode.row,
                        col: currentNode.col,
                    };
                    queue.push(grid[newRow][newCol]);
                }
            }
        }
    }

    await addVisitedWithDelay(visitedNodesInOrder, speed, toggleVisited);
    if (endReached) {
        const endNode = grid
            .find((row) => row.find((node) => node.isEnd))!
            .find((node) => node.isEnd)!;
        const shortestPath = reconstructPath(
            parent,
            grid[startNode.row][startNode.col],
            endNode
        );
        await addPathsWithDelay(shortestPath, speed, toggleVisited, togglePath);
    }

    return true;
};

export async function applyDijkstraAlgorithmForNodes(): Promise<boolean> {
    const { storeNodes, storeEdges, n_isDirected, StartNodeId, EndNodeId, n_speed, toggleVisited, togglePath, toggleAnimatedEdge, toggleEdgeReverse } = useNodeStore.getState();
    
    if (!StartNodeId || !EndNodeId || !storeNodes.find((node) => node.id === StartNodeId) || !storeNodes.find((node) => node.id === EndNodeId)) {
        return false;
    }

    const walls = new Set<string>(storeNodes.filter((node) => node.data.isWall).map((node) => node.id));
    const adjacencyList = constructAdjacencyList(storeNodes, storeEdges, n_isDirected);
    const distances = new Map<string, number>();
    const previous  = new Map<string, string | null>();
    const visited = new Set<string>();
    const visitedNodesInOrder: string[] = [];

    storeNodes.forEach(node => {
        distances.set(node.id, Infinity);
        previous.set(node.id, null);
    });
    distances.set(StartNodeId, 0);

    let endReached = false;

    while (true) {
        // pick the unvisited node with smallest distance
        let current: string | null = null;
        let minDist = Infinity;
        for (const [id, dist] of distances.entries()) {
            if (!visited.has(id) && dist < minDist) {
                minDist = dist;
                current = id;
            }
        }
        visitedNodesInOrder.push(current!);

        if (current === null) {
            break;
        }
        if (current === EndNodeId) {
            endReached = true;
            break;
        }

        visited.add(current);

        for (const { neighbor, weight } of adjacencyList.get(current)!) {
            if (visited.has(neighbor) || walls.has(neighbor)) {
                continue;
            }
            const alt = distances.get(current)! + weight;
            
            if (alt < distances.get(neighbor)!) {
                distances.set(neighbor, alt);
                previous.set(neighbor, current);
            }
        }
    }

    await addVisitedWithDelayForNodes(visitedNodesInOrder, n_speed, toggleVisited);
    if (endReached) {
        const path: string[] = [];
        let u: string | null = EndNodeId;
        if (previous.get(u) !== null || u === StartNodeId) {
            while (u) {
                path.unshift(u);
                u = previous.get(u)!;
            }
        }
        await addPathsWithDelayForNodes(path, n_speed, toggleVisited, togglePath);

        const PathEdges: string[] = getEdgesForNodes(path, storeEdges, toggleEdgeReverse);
        addAnimationForEdges(PathEdges, n_speed, toggleAnimatedEdge);
    }

    return true;
}
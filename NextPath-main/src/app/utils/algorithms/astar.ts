import { useNodeStore } from "@/app/store/nodeStore";
import { useGraphStore, Node, Position } from "../../store/gridStore";
import { addAnimationForEdges, addPathsWithDelay, addPathsWithDelayForNodes, addVisitedWithDelay, addVisitedWithDelayForNodes } from "../animation";
import { constructAdjacencyList, directions, getEdgesForNodes, isValidPosition } from "../util";

function getNeighbors(node: Position, grid: Node[][], rows: number, cols: number): Position[] {
    const { row, col } = node;

    const neighbors: Position[] = [];
    for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        if (isValidPosition(newRow, newCol, rows, cols) && !grid[newRow][newCol].isWall) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}

export async function applyAStarAlgorithm(): Promise<boolean> {
    const { grid, rows, cols, startNode, endNode, speed, toggleVisited, togglePath } =
        useGraphStore.getState();

    if (!startNode || !endNode) return false;

    const key = (pos: Position) => `${pos.row},${pos.col}`;
    const heuristic = (a: Position, b: Position) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

    const openSet: Position[] = [startNode];
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const visitedNodesInOrder: Position[] = [];
    let isEndReached = false;

    gScore.set(key(startNode), 0);
    fScore.set(key(startNode), heuristic(startNode, endNode));

    while (openSet.length > 0) {
        openSet.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
        const current = openSet.shift()!;
        visitedNodesInOrder.push({ row: current.row, col: current.col });

        if (current.row === endNode.row && current.col === endNode.col) {
            isEndReached = true;
            break;
        }

        for (const neighbor of getNeighbors(current, grid, rows, cols)) {
            const neighborKey = key(neighbor);
            const tentativeG = (gScore.get(key(current)) ?? Infinity) + grid[neighbor.row][neighbor.col].weight;

            if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + heuristic(neighbor, endNode));

                if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    await addVisitedWithDelay(visitedNodesInOrder, speed, toggleVisited);

    if (isEndReached) {
        const shortestPath: Position[] = [];
        let tempKey = key(endNode);
        shortestPath.push({ row: endNode.row, col: endNode.col });

        while (cameFrom.has(tempKey)) {
            const prev = cameFrom.get(tempKey)!;
            shortestPath.unshift({ row: prev.row, col: prev.col });
            tempKey = key(prev);
        }
        await addPathsWithDelay(shortestPath, speed, toggleVisited, togglePath);
    }

    return true;
};

export async function applyAStarAlgorithmForNodes(): Promise<boolean> {
    const { storeNodes, storeEdges, n_isDirected, StartNodeId, EndNodeId, n_speed, toggleVisited, togglePath, toggleAnimatedEdge, toggleEdgeReverse } = useNodeStore.getState();
    
    if (!StartNodeId || !EndNodeId || !storeNodes.find((node) => node.id === StartNodeId) || !storeNodes.find((node) => node.id === EndNodeId)) {
        return false;
    }

    const walls = new Set(storeNodes.filter((node) => node.data.isWall).map((node) => node.id));
    const adjacencyList = constructAdjacencyList(storeNodes, storeEdges, n_isDirected);
    const visitedNodesInOrder: string[] = [];
    const cameFrom = new Map<string, string>();
    const visited = new Set<string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const openSet: string[] = [StartNodeId];
    let endReached = false;

    const getPos = (id: string) => storeNodes.find(n => n.id === id)!;

    const heuristic = (a: string, b: string): number => {
        const na = getPos(a);
        const nb = getPos(b);
        const scaleFactor = storeNodes.length * 3.8;
        return (Math.abs(na.position.x - nb.position.x) + Math.abs(na.position.y - nb.position.y)) / scaleFactor;
    };

    gScore.set(StartNodeId, 0);
    fScore.set(StartNodeId, heuristic(StartNodeId, EndNodeId));

    while (openSet.length > 0) {
        openSet.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
        const current = openSet.shift()!;
        visitedNodesInOrder.push(current);
        visited.add(current);

        if (current === EndNodeId) {
            endReached = true;
            break;
        }

        for (const { neighbor, weight } of adjacencyList.get(current) ?? []) {
            if (visited.has(neighbor) || walls.has(neighbor)) continue;

            const tentativeG = (gScore.get(current) ?? Infinity) + weight;

            if (tentativeG < (gScore.get(neighbor) ?? Infinity)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeG);
                fScore.set(neighbor, tentativeG + heuristic(neighbor, EndNodeId));

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    await addVisitedWithDelayForNodes(visitedNodesInOrder, n_speed, toggleVisited);
    if (endReached) {
        const path: string[] = [];
        let current = EndNodeId;
        path.unshift(current);

        while (cameFrom.has(current)) {
            current = cameFrom.get(current)!;
            path.unshift(current);
        }

        await addPathsWithDelayForNodes(path, n_speed, toggleVisited, togglePath);

        const PathEdges: string[] = getEdgesForNodes(path, storeEdges, toggleEdgeReverse);
        addAnimationForEdges(PathEdges, n_speed, toggleAnimatedEdge);
    }

    return true;
};
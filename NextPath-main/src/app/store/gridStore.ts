import { create } from "zustand";
import { produce } from "immer";

export type GraphType = "grid" | "node";
export type Algorithm = undefined | "bfs" | "dfs" | "dijkstra" | "aStar";
export type Maze = undefined | "none" | "random" | "terrain" | "recursive";
export type Position = { row: number; col: number };
export type Node = {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    visited: boolean;
    isWall: boolean;
    isPath: boolean;
    weight: number;
};

interface GraphStore {
    type: GraphType;
    rows: number;
    cols: number;
    cellSize: number;
    algorithm: Algorithm;
    maze: Maze;
    speed: number;
    isWeighted: boolean;
    startNode: Position;
    endNode: Position;
    walls: Position[];
    grid: Node[][];
    isLoading: boolean;

    defaultRows: number;
    defaultCols: number;
    defaultCellSize: number;

    setType: (type: GraphType) => void;
    setSize: (rows: number, cols: number) => void;
    setAlgorithm: (algo: Algorithm) => void;
    setMaze: (maze: Maze) => void;
    setSpeed: (speed: number) => void;
    setCellSize: (size: number) => void;
    setWeighted: (isWeighted: boolean) => void;
    setDefaultSize: (rows: number, cols: number, cellSize: number) => void;
    setStartNode: (row: number, col: number) => void;
    setEndNode: (row: number, col: number) => void;
    toggleWall: (row: number, col: number) => void;
    clearWalls: () => void;
    toggleVisited: (row: number, col: number) => void;
    togglePath: (row: number, col: number) => void;
    initializeGrid: () => void;
    clearPaths: () => void;
    setLoading: (isLoading: boolean) => void;
    setRandomWeights: () => void;
    setWeightsToOne: () => void;
    setWalls: (walls: Position[]) => void;
}

const initializeGrid = (rows: number, cols: number, startNode: Position, endNode: Position, walls: Position[]): { grid: Node[][]; validStartNode: Position; validEndNode: Position } => {
    const validStartNode: Position = {
        row: startNode.row >= 0 && startNode.row < rows ? startNode.row : 0,
        col: startNode.col >= 0 && startNode.col < cols ? startNode.col : 0,
    };

    const validEndNode: Position = {
        row: endNode.row >= 0 && endNode.row < rows ? endNode.row : rows - 1,
        col: endNode.col >= 0 && endNode.col < cols ? endNode.col : cols - 1,
    };

    const grid: Node[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            row,
            col,
            isStart: row === validStartNode.row && col === validStartNode.col,
            isEnd: row === validEndNode.row && col === validEndNode.col,
            isWall: walls.some((wall) => wall.row === row && wall.col === col),
            visited: false,
            isPath: false,
            weight: 1,
        }))
    );
    return { grid, validStartNode, validEndNode };
};

export const useGraphStore = create<GraphStore>((set) => ({
    type: "grid",
    rows: 10,
    cols: 20,
    cellSize: 50,
    algorithm: undefined,
    maze: undefined,
    speed: 1,
    isWeighted: false,
    startNode: { row: 2, col: 2 }, // Top-left corner
    endNode: { row: 7, col: 17 }, // Bottom-right corner
    walls: [],
    grid: initializeGrid(10, 20, { row: 2, col: 2 }, { row: 7, col: 17 }, []).grid,
    isLoading: false,

    defaultRows: 10,
    defaultCols: 20,
    defaultCellSize: 55,

    setType: (type) => set({ type }),
    setSize: (rows, cols) =>
        set(produce((state) => {
            state.rows = rows;
            state.cols = cols;
            const { grid, validStartNode, validEndNode } = initializeGrid(
                rows,
                cols,
                state.startNode,
                state.endNode,
                state.walls
            );
            state.grid = grid;
            state.startNode = validStartNode;
            state.endNode = validEndNode;
        })
    ),
    setAlgorithm: (algo) => set({ algorithm: algo }),
    setMaze: (maze) => set({ maze }),
    setSpeed: (speed) => set({ speed }),
    setCellSize: (size) => set({ cellSize: size }),
    setWeighted: (isWeighted) => set({ isWeighted }),
    setDefaultSize: (rows, cols, cellSize) => set({ defaultRows: rows, defaultCols: cols, defaultCellSize: cellSize }),
    setLoading: (isLoading) => set({ isLoading }),

    setStartNode: (row, col) =>
        set(produce((state) => {
            const prevStart = state.startNode;
            state.grid[prevStart.row][prevStart.col].isStart = false;
            state.grid[row][col].isStart = true;
            state.startNode = { row, col };
        })
    ),

    setEndNode: (row, col) =>
        set(produce((state) => {
            const prevEnd = state.endNode;
            state.grid[prevEnd.row][prevEnd.col].isEnd = false;
            state.grid[row][col].isEnd = true;
            state.endNode = { row, col };
        })
    ),

    toggleWall: (row, col) =>
        set(produce((state) => {
            const isWall = state.grid[row][col].isWall;
            state.grid[row][col].isWall = !isWall;
            if (!isWall) {
                state.walls.push({ row, col });
            } else {
                state.walls = state.walls.filter((wall: Node) => !(wall.row === row && wall.col === col));
            }
        })
    ),

    toggleVisited: (row, col) =>
        set(produce((state) => {
            state.grid[row][col].visited = !state.grid[row][col].visited;
        })
    ),

    togglePath: (row, col) =>
        set(produce((state) => {
            state.grid[row][col].isPath = !state.grid[row][col].isPath;
        })
    ),

    clearWalls: () =>
        set(produce((state) => {
            state.walls = [];
            state.grid.forEach((row: Node[]) => row.forEach((node) => (node.isWall = false)));
        })
    ),

    initializeGrid: () =>
        set(produce((state) => {
            state.grid = initializeGrid(state.rows, state.cols, state.startNode, state.endNode, state.walls);
        })
    ),

    clearPaths: () =>
        set(produce((state) => {
            state.grid.forEach((row: Node[]) => row.forEach((node) => {
                node.isPath = false
                node.visited = false;
            }));
        })
    ),

    setRandomWeights: () =>
        set(produce((state) => {
            state.grid.forEach((row: Node[]) => row.forEach((node) => {
                node.weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
            }));
        })
    ),

    setWeightsToOne: () =>
        set(produce((state) => {
            state.grid.forEach((row: Node[]) => row.forEach((node) => {
                node.weight = 1; // Set weight to 1
            }));
        })
    ),

    setWalls: (walls) =>
        set(produce((state) => {
            state.walls = walls;
        })
    ),
}));

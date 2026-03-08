"use client";

import { Position, Node } from "../../store/gridStore";
import { useGraphStore } from "../../store/gridStore";
import { createNoise2D } from "simplex-noise";

export async function applyRandomMaze(): Promise<boolean> {
    const { grid, rows, cols, startNode, endNode, speed, toggleWall } =
        useGraphStore.getState();

    const wallDensity = 0.25; // Adjust this value to control the density of walls (0 to 1)
    const newWalls: Position[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Skip the start and end nodes
            if (
                (row === startNode.row && col === startNode.col) ||
                (row === endNode.row && col === endNode.col)
            ) {
                continue;
            }

            // Randomly decide whether to place a wall based on the density
            if (Math.random() < wallDensity) {
                newWalls.push({ row, col });
            }
        }
    }

    await addWallsWithDelay(grid, shuffleArray(newWalls), speed, toggleWall);
    return true;
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function removeDuplicatePositions(positions: Position[]): Position[] {
    const unique = new Set<string>();
    const result: Position[] = [];

    for (const pos of positions) {
        const key = `${pos.row}-${pos.col}`;
        if (!unique.has(key)) {
            unique.add(key);
            result.push(pos);
        }
    }

    return result;
}

async function addWallsWithDelay(
    grid: Node[][],
    walls: Position[],
    speed: number,
    toggleWall: (row: number, col: number) => void
) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    walls = removeDuplicatePositions(walls);
    for (let i = 0; i < walls.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, walls.length); j++) {
            const { row, col } = walls[j];
            if (grid[row][col].isStart || grid[row][col].isEnd) {
                continue; // Skip start and end nodes
            }

            toggleWall(row, col);
        }
        await delay(curSpeed);
    }
}

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function applyRecursiveDivision(): Promise<boolean> {
    const { grid, rows, cols, startNode, endNode, speed, toggleWall } =
        useGraphStore.getState();
    const walls: Position[] = [];

    function recursiveDivision(
        rowStart: number,
        rowEnd: number,
        colStart: number,
        colEnd: number,
        orientation: string,
        surroundingWalls = false
    ) {
        if (rowEnd < rowStart || colEnd < colStart) {
            return;
        }

        // draw the outer boundary exactly once
        if (!surroundingWalls) {
            // top & bottom edges
            for (let c = 0; c < cols; c++) {
                walls.push({ row: 0, col: c });
                walls.push({ row: rows - 1, col: c });
            }
            // left & right edges
            for (let r = 1; r < rows - 1; r++) {
                walls.push({ row: r, col: 0 });
                walls.push({ row: r, col: cols - 1 });
            }
            surroundingWalls = true;
        }

        if (orientation === "horizontal") {
            // choose an even row for the wall
            const possibleRows: number[] = [];
            for (let r = rowStart; r <= rowEnd; r += 2) {
                possibleRows.push(r);
            }

            // choose an odd column for the single passage
            const possibleCols: number[] = [];
            for (let c = colStart - 1; c <= colEnd + 1; c += 2) {
                possibleCols.push(c);
            }

            const wallRow =
                possibleRows[Math.floor(Math.random() * possibleRows.length)];
            const passageCol =
                possibleCols[Math.floor(Math.random() * possibleCols.length)];

            // build the wall on wallRow, skipping passageCol
            for (let c = colStart - 1; c <= colEnd + 1; c++) {
                if (c === passageCol) {
                    continue;
                }
                if (
                    (wallRow === startNode.row && c === startNode.col) ||
                    (wallRow === endNode.row && c === endNode.col)
                ) {
                    continue;
                }
                if (wallRow >= 0 && wallRow < rows && c >= 0 && c < cols) {
                    walls.push({ row: wallRow, col: c });
                }
            }

            // recurse into top & bottom subregions
            const topEnd = wallRow - 2;
            const botStart = wallRow + 2;
            const regionW = colEnd - colStart;
            const topH = topEnd - rowStart;
            const botH = rowEnd - botStart;
            const topOrient = topH > regionW ? orientation : "vertical";
            const botOrient = botH > regionW ? orientation : "vertical";

            if (topEnd >= rowStart) {
                recursiveDivision(
                    rowStart,
                    topEnd,
                    colStart,
                    colEnd,
                    orientation === "horizontal" ? topOrient : "vertical",
                    true
                );
            }
            if (botStart <= rowEnd) {
                recursiveDivision(
                    botStart,
                    rowEnd,
                    colStart,
                    colEnd,
                    orientation === "horizontal" ? botOrient : "vertical",
                    true
                );
            }
        } else {
            // vertical split
            const possibleCols: number[] = [];
            for (let c = colStart; c <= colEnd; c += 2) {
                possibleCols.push(c);
            }

            const possibleRows: number[] = [];
            for (let r = rowStart - 1; r <= rowEnd + 1; r += 2) {
                possibleRows.push(r);
            }

            const wallCol =
                possibleCols[Math.floor(Math.random() * possibleCols.length)];
            const passageRow =
                possibleRows[Math.floor(Math.random() * possibleRows.length)];

            // build the wall on wallCol, skipping passageRow
            for (let r = rowStart - 1; r <= rowEnd + 1; r++) {
                if (r === passageRow) {
                    continue;
                }
                if (
                    (r === startNode.row && wallCol === startNode.col) ||
                    (r === endNode.row && wallCol === endNode.col)
                ) {
                    continue;
                }
                if (r >= 0 && r < rows && wallCol >= 0 && wallCol < cols) {
                    walls.push({ row: r, col: wallCol });
                }
            }

            // recurse into left & right subregions
            const leftEnd = wallCol - 2;
            const rightStart = wallCol + 2;

            if (leftEnd >= colStart) {
                recursiveDivision(
                    rowStart,
                    rowEnd,
                    colStart,
                    leftEnd,
                    "vertical",
                    true
                );
            }
            if (rightStart <= colEnd) {
                recursiveDivision(
                    rowStart,
                    rowEnd,
                    rightStart,
                    colEnd,
                    "horizontal",
                    true
                );
            }
        }
    }

    // start the recursive build on the inner area
    const initialOrientation = Math.random() < 0.5 ? "horizontal" : "vertical";

    recursiveDivision(1, rows - 2, 1, cols - 2, initialOrientation, false);
    await addWallsWithDelay(grid, walls, speed, toggleWall);

    return true;
}

export async function applyRandomTerrain(): Promise<boolean> {
    const { grid, rows, cols, startNode, endNode, speed, toggleWall } =
        useGraphStore.getState();

    const newWalls: Position[] = [];
    const SCALE = 0.1; // zoom of the noise
    const OCTAVES = 10; // how many layers of noise
    const PERSISTENCE = 0.5; // amplitude falloff per octave
    const THRESHOLD = 0.05; // cutoff for land (wall) vs water

    const simplex = createNoise2D();

    // fractal (multi‐octave) noise
    function fractalNoise(x: number, y: number) {
        let amplitude = 1;
        let frequency = 1;
        let sum = 0;
        let max = 0;

        for (let o = 0; o < OCTAVES; o++) {
            sum += amplitude * simplex(x * frequency, y * frequency);
            max += amplitude;
            amplitude *= PERSISTENCE;
            frequency *= 2;
        }

        return sum / max;
    }

    // ——— Build islands as walls ———
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Skip the start and end nodes
            if (
                (row === startNode.row && col === startNode.col) ||
                (row === endNode.row && col === endNode.col)
            ) {
                continue;
            }
            const nx = col * SCALE;
            const ny = row * SCALE;
            const noiseVal = fractalNoise(nx, ny);

            // radial fade so edges tend to be water
            const dx = col / cols - 0.5;
            const dy = row / rows - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(0.5);
            const islandFactor = 1 - dist;

            if (noiseVal * islandFactor > THRESHOLD) {
                newWalls.push({ row, col });
            }
        }
    }
    await addWallsWithDelay(grid, newWalls, speed, toggleWall);
    return true;
}

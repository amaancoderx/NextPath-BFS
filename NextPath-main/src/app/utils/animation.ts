"use client";

import { Position } from "../store/gridStore";

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function addPathsWithDelay(
    path: Position[],
    speed: number,
    toggleVisited: (row: number, col: number) => void,
    togglePath: (row: number, col: number) => void
) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    for (let i = 0; i < path.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, path.length); j++) {
            const { row, col } = path[j];
            toggleVisited(row, col);
            togglePath(row, col);
        }
        await delay(curSpeed);
    }
}

export async function addVisitedWithDelay(
    walls: Position[],
    speed: number,
    toggleVisited: (row: number, col: number) => void
) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    for (let i = 0; i < walls.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, walls.length); j++) {
            const { row, col } = walls[j];
            toggleVisited(row, col);
        }
        await delay(curSpeed);
    }
}

export async function addVisitedWithDelayForNodes(nodes: string[], speed: number, toggleVisited: (id: string) => void) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    for (let i = 0; i < nodes.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, nodes.length); j++) {
            const id = nodes[j];
            toggleVisited(id);
        }
        await delay(curSpeed);
    }
};

export async function addPathsWithDelayForNodes(nodes: string[], speed: number, toggleVisited: (id: string) => void, togglePath: (id: string) => void) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    for (let i = 0; i < nodes.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, nodes.length); j++) {
            const id = nodes[j];
            toggleVisited(id);
            togglePath(id);
        }
        await delay(curSpeed);
    }
};

export async function addAnimationForEdges(edges: string[], speed: number, toggleAnimatedEdge: (id: string) => void) {
    const curSpeed = 1000 * (1 - speed);
    const adjustedSpeed = speed - 1;

    let batch = 1;
    if (adjustedSpeed > 0) {
        batch += Math.floor(adjustedSpeed * 10);
    }

    await delay(curSpeed);
    for (let i = 0; i < edges.length; i += batch) {
        for (let j = i; j < Math.min(i + batch, edges.length); j++) {
            const id = edges[j];
            toggleAnimatedEdge(id);
        }
    }
}
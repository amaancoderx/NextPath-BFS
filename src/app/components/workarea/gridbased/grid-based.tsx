"use client";

import { useState, useEffect } from "react";
import { useGraphStore } from "@/app/store/gridStore";
import { GridCell } from "./grid-cell";
import { calculateCellSize, getRowColBasedCellSize } from "@/app/utils/util";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Eye, EyeOff, Route, CloudOff } from "lucide-react";
import { HelpCard } from "../help-card";

const legends = [
    { label: "Start Node", color: "bg-[#ADF7B6] dark:bg-[#C1FF9B]" },
    { label: "End Node", color: "bg-[#FF7477] dark:bg-[#F25757]" },
    { label: "Obstacle", color: "bg-[#DEDEDE] dark:bg-[#999999]" },
    {
        label: "Shortest Path",
        color: "bg-[#FAE588] dark:bg-[#F9DC5C]",
    },
    {
        label: "Visited Node",
        color: "bg-[#BFD8FF] dark:bg-[#7FA7D5]",
    },
    { label: "Unvisited", color: "bg-transparent border border-muted" },
];

export function GridBasedGraph() {
    const [showWeight, setShowWeight] = useState(false);
    const {
        grid,
        rows,
        cols,
        isWeighted,
        defaultRows,
        defaultCols,
        isLoading,
        setCellSize,
        clearWalls,
        setMaze,
        clearPaths,
    } = useGraphStore();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const clearPath = () => {
        setMaze("none");
        clearPaths();
    };

    const clearObstacle = () => {
        setMaze("none");
        clearWalls();
    };

    useEffect(() => {
        const handleResize = () => {
            const newCellSize = calculateCellSize();
            const cellSize = getRowColBasedCellSize(
                defaultRows,
                defaultCols,
                rows,
                cols,
                newCellSize
            );
            setCellSize(cellSize);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [cols, defaultCols, defaultRows, rows, setCellSize]);

    return (
        <div className="p-5 h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold"></h2>
                <div className="flex items-center gap-1">
                    {isMobile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-5 w-5 animate-spin3x" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onClick={clearPath}
                                    disabled={isLoading}
                                >
                                    <Route className="h-4 w-4" />
                                    Clear Path
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={clearObstacle}
                                    disabled={isLoading}
                                >
                                    <CloudOff className="h-4 w-4" />
                                    Clear Obstacle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setShowWeight(!showWeight)}
                                    disabled={!isWeighted}
                                >
                                    {showWeight ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            <span className="">
                                                Hide Weights
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            <span className="">
                                                Show Weights
                                            </span>
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                onClick={clearPath}
                                disabled={isLoading}
                                id="clear-path"
                            >
                                <Route className="h-4 w-4" />
                                Clear Path
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearObstacle}
                                disabled={isLoading}
                                id="clear-obstacle"
                            >
                                <CloudOff className="h-4 w-4" />
                                Clear Obstacle
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowWeight(!showWeight)}
                                disabled={isLoading}
                                id="toggle-weights"
                            >
                                {showWeight ? (
                                    <>
                                        <EyeOff className="h-4 w-4" />
                                        <span className="">Hide Weights</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4" />
                                        <span className="">Show Weights</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    <HelpCard legends={legends}/>
                </div>
            </div>

            <div
                className={`flex ${
                    !isMobile ? "h-full" : ""
                } w-full flex-col items-center justify-center overflow-auto p-0`}
            >
                <div className="outline-none" tabIndex={0} id="grid-canvas">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {row.map((node) => (
                                <GridCell
                                    key={`${node.row}-${node.col}`}
                                    node={node}
                                    showWeight={showWeight}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

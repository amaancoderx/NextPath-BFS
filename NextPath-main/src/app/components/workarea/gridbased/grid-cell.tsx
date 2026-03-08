import { memo } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Plane, LandPlot, Cloudy, CloudOff } from "lucide-react";
import { useGraphStore, Node } from "../../../store/gridStore";

interface GridCellProps {
    node: Node;
    showWeight: boolean;
}

export const GridCell = memo(function GridCell({
    node,
    showWeight,
}: GridCellProps) {
    const { row, col, isStart, isEnd, isWall, weight, visited, isPath } = node;
    const { cellSize, setStartNode, setEndNode, toggleWall } =
        useGraphStore.getState();
    const updateCellType = (type: "start" | "end" | "wall") => {
        if (type === "start" && !isWall) {
            setStartNode(row, col);
        } else if (type === "end" && !isWall) {
            setEndNode(row, col);
        } else if (type === "wall") {
            toggleWall(row, col);
        }
    };

    const weightText = (
        <span className="text-sm text-black dark:text-white">{weight}</span>
    );

    const baseColor = isStart
        ? "bg-[#ADF7B6] dark:bg-[#C1FF9B] "
        : isEnd
        ? "bg-[#FF7477] dark:bg-[#F25757] "
        : isWall
        ? "bg-[#DEDEDE] dark:bg-[#999999] "
        : isPath
        ? "bg-[#FAE588] dark:bg-[#F9DC5C] animate-short-path dark:animate-short-path-dark"
        : visited
        ? "bg-[#BFD8FF] dark:bg-[#7FA7D5] animate-wave dark:animate-wave-dark"
        : "bg-transparent ";

    const cellTypeIcon = isStart ? (
        <Plane className="h-4 w-4 animate-pulse" color="#000000" />
    ) : isEnd ? (
        <LandPlot className="h-4 w-4 animate-pulse" color="#000000" />
    ) : isWall ? (
        <Cloudy className="h-4 w-4" color="#000000" />
    ) : null;

    const toggleWallOnClick = () => {
        if (!isStart && !isEnd) {
            toggleWall(row, col);
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    className={`
                        ${baseColor}
                        flex items-center justify-center 
                        border border-[var(--border)] 
                        transition-all ${
                            visited
                                ? "duration-500 ease-out"
                                : "duration-300 ease-in-out"
                        }
                        hover: hover:scale-110 hover:shadow-lg 
                        dark:border-[var(--border)] 
                        dark:hover: dark:hover:scale-110 dark:hover:shadow-lg
                    `}
                    style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        fontSize: `${Math.max(8, cellSize / 2)}px`,
                        margin: "1px",
                    }}
                    title={`Cell (${row}, ${col})`}
                    id={`cell-${row}-${col}`}
                    onClick={toggleWallOnClick}
                >
                    {showWeight ? weightText : cellTypeIcon}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => updateCellType("start")}>
                    <Plane className="h-4 w-4 mr-2" />
                    Set as Start
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updateCellType("end")}>
                    <LandPlot className="h-4 w-4 mr-2" />
                    Set as End
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updateCellType("wall")}>
                    {isWall ? (
                        <>
                            <CloudOff className="h-4 w-4 mr-2" />
                            Remove Obstacle
                        </>
                    ) : (
                        <>
                            <Cloudy className="h-4 w-4 mr-2" />
                            Mark as Obstacle
                        </>
                    )}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
});

import { Handle, Position, useConnection } from "@xyflow/react";
import { memo } from "react";
import { Move, PlaneTakeoff, Trash2, LandPlot, CloudOff, Cloudy } from "lucide-react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Data, useNodeStore } from "@/app/store/nodeStore";

export const NodeCell = memo(function NodeCell({ id, data }: { id: string, data: Data }) {
    const { isStart, isEnd, isPath, isWall, visited } = data;
    const { map, showLabels, setStart, setEnd, deleteNode, toggleWall } = useNodeStore();

    const connection = useConnection();
    const isTarget = connection.inProgress && connection.fromNode.id !== id;
    const isFreeFlow = map === "freeFlow";

    const baseColor = isStart
        ? "bg-[#ADF7B6] dark:bg-[#C1FF9B] "
        : isEnd
        ? "bg-[#FF7477] dark:bg-[#F25757] "
        : isWall
        ? "bg-[#A3A3A3] dark:bg-[#4A4A4A] "
        : isPath
        ? "bg-[#FAE588] dark:bg-[#F9DC5C] animate-short-path dark:animate-short-path-dark"
        : visited
        ? "bg-[#BFD8FF] dark:bg-[#7FA7D5] animate-wave dark:animate-wave-dark"
        : "bg-[#DEDEDE] dark:bg-[#999999] ";

    const cellTypeIcon = isStart ? (
            <PlaneTakeoff className="h-5 w-5 animate-pulse" color="#000000" />
        ) : isEnd ? (
            <LandPlot className="h-5 w-5 animate-pulse" color="#000000" />
        ) : isWall ? (
            <Cloudy className="h-5 w-5" color="#000000" />
        ) : null;

    const animateClass = isStart ? "motion-safe:animate-ping bg-green-200 dark:bg-green-400" : isEnd ? "motion-safe:animate-ping bg-red-200 dark:bg-red-400" : "";

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className={`customNode ${baseColor}`} id={`node-${id}`}>
                    <div className={`absolute inline-flex h-full w-full rounded-lg opacity-75 ${animateClass}`} />
                    {isFreeFlow && (
                        <div className={`customNodeIcon ${baseColor}`}>
                            <Move size={12} strokeWidth={2.5} />
                        </div>
                    )}
                    {!connection.inProgress && (
                        <Handle
                            className="targetHandle"
                            type="source"
                            position={Position.Right}
                            style={{
                                right: -6,
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        />
                    )}
                    {(!connection.inProgress || isTarget) && (
                        <Handle
                            className="targetHandle"
                            type="target"
                            position={Position.Left}
                            isConnectableStart={false}
                            style={{
                                left: -6,
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                        />
                    )}
                    {/* Label */}
                    <div className="flex items-center justify-center h-full w-full pointer-events-none">
                        {cellTypeIcon}
                    </div>
                    {!isFreeFlow && showLabels && (
                        <div className="absolute text-xl font-bold text-gray-800 dark:text-gray-200 pointer-events-none whitespace-nowrap text-shadow-lg">
                            {data.label}
                        </div>
                    )}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => setStart(id)}>
                    <PlaneTakeoff className="h-4 w-4 mr-2"/>
                    Set as Start
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setEnd(id)}>
                    <LandPlot className="h-4 w-4 mr-2" />
                    Set as End
                </ContextMenuItem>
                <ContextMenuItem onClick={() => toggleWall(id)}>
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
                {isFreeFlow && (
                    <ContextMenuItem onClick={() => deleteNode(id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Node
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
});

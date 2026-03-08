"use client";

import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    OnConnect,
    Node,
    applyNodeChanges,
    OnNodesChange,
    useReactFlow,
    OnConnectEnd,
    BackgroundVariant
} from "@xyflow/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ZoomSlider } from "@/components/zoom-slider";
import { NodeCell } from "./node-cell";
import FloatingConnectionLine from "./floating-connection-line";
import FloatingEdge from "./floating-edge";
import { useNodeStore } from "@/app/store/nodeStore";
import { useCallback, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LayoutDashboard, Route, Settings } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { useGraphStore } from "@/app/store/gridStore";
import { getRandomEndNode, getRandomStartNode, getUSALinks, getUSANodes } from "@/app/utils/xyflowUtils/usa-map";
import { getRandomMAStartNode, getRandomMAEndNode, getMANodes, getMALinks } from "@/app/utils/xyflowUtils/ma-map";
import { getInitialEdges, getInitialNodes } from "@/app/utils/xyflowUtils/util";
import { HelpCard } from "../help-card";

const elk = new ELK();

const connectionLineStyle = {
    stroke: "#b1b1b7",
};

const nodeTypes = {
    custom: NodeCell,
};

const edgeTypes = {
    floating: FloatingEdge,
};

const defaultEdgeOptions = {
    type: "floating",
    animated: false,
    label: "1",
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#b1b1b7",
    },
    data: {
        isReversed: false,
    }
};


const legends = [
    { label: "Start Node", color: "bg-[#ADF7B6] dark:bg-[#C1FF9B]" },
    { label: "End Node", color: "bg-[#FF7477] dark:bg-[#F25757]" },
    { label: "Obstacle", color: "bg-[#A3A3A3] dark:bg-[#4A4A4A]" },
    {
        label: "Shortest Path",
        color: "bg-[#FAE588] dark:bg-[#F9DC5C]",
    },
    {
        label: "Visited Node",
        color: "bg-[#BFD8FF] dark:bg-[#7FA7D5]",
    },
    { label: "Unvisited", color: "bg-[#DEDEDE] dark:bg-[#999999]" },
];

export function NodeBasedGraph() {
    const { storeNodes, storeEdges, showWeights, map, showLabels, toggleLabels, addNode, setStoreNodes, setStoreEdges, toggleWeights, getID, clearNodePaths, setStart, setEnd } = useNodeStore();
    const { isLoading } = useGraphStore();

    const [nodes, setNodes] = useNodesState(storeNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
    const { fitView, screenToFlowPosition } = useReactFlow();

    const isMobile = useMediaQuery("(max-width: 768px)");
    const isFreeFlow = map === "freeFlow";

    const onConnect: OnConnect = useCallback(
        (params) => {
            if (!isFreeFlow) return; // Prevent connections in map mode
            setEdges((eds) => {
                const updatedEdges = addEdge(params, eds);
                setStoreEdges(updatedEdges);
                return updatedEdges;
            });
        },
        [isFreeFlow, setEdges, setStoreEdges]
    );

    const onConnectEnd: OnConnectEnd = useCallback(
        (event, connectionState) => {
            if (!isFreeFlow) {
                fitView({ duration: 500 });
                return; // Prevent connections in map mode
            }
            if (!connectionState.isValid) {
                const id = getID();
                const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
                const newNode: Node = {
                    id: id,
                    type: "custom",
                    position: screenToFlowPosition({
                        x: clientX,
                        y: clientY,
                    }),
                    data: {
                        label: `Node ${id}`,
                        isStart: false,
                        isEnd: false,
                        visited: false,
                        isWall: false,
                        isPath: false,
                    },
                };
        
                addNode(newNode);
                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) => {
                    const updatedEdges = eds.concat({
                        id: `xy-edge__${connectionState.fromNode?.id}-${id}`, 
                        source: connectionState.fromNode?.id ?? "0",
                        target: id,
                        type: "floating",
                        animated: false,
                        label: "1",
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: "#b1b1b7",
                        },
                        data: {
                            isReversed: false,
                        },
                    });
                    setStoreEdges(updatedEdges);
                    return updatedEdges;
                });
            }
        },
        [addNode, getID, isFreeFlow, fitView, screenToFlowPosition, setEdges, setNodes, setStoreEdges],
    );

    const handleNodesChange: OnNodesChange = useCallback(
        (changes) => {
            if (!isFreeFlow) return; // Prevent changes in map mode
            setNodes((nds) => {
                const updatedNodes = applyNodeChanges(changes, nds);
                setStoreNodes(updatedNodes); // Update the store with the new nodes
                return updatedNodes;
            });
        },
        [isFreeFlow, setNodes, setStoreNodes]
    );

    // Auto Layout using ELK
    const handleAutoLayout = async () => {
        const layouted = await elk.layout({
            id: "root",
            layoutOptions: {
                'elk.algorithm': 'stress',
                'elk.stress.desiredEdgeLength': '175', // Longer edges
            },
            children: nodes.map((node) => ({
                id: node.id,
                width: node.width || 150,
                height: node.height || 50,
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                sources: [edge.source],
                targets: [edge.target],
            })),
        });

        const positionedNodes: Node[] = nodes.map((node) => {
            const layoutNode = layouted.children?.find((n) => n.id === node.id);
            return {
                ...node,
                position: {
                    x: layoutNode?.x || 0,
                    y: layoutNode?.y || 0,
                },
            };
        });

        setNodes(positionedNodes);
        setStoreNodes(positionedNodes);
        fitView({ duration: 500 });
    };

    useEffect(() => {
        setNodes(storeNodes);
        setEdges(storeEdges);
        fitView({ duration: 500 });
    }, [storeNodes, storeEdges, setNodes, setEdges, fitView]);

    useEffect(() => {
        const getAndRemove = (key: string): string | null => {
            const value = localStorage.getItem(key);
            if (value) localStorage.removeItem(key);
            return value;
        };

        const nodes = getAndRemove("nodes");
        const edges = getAndRemove("edges");
        const startNodeId = getAndRemove("startNodeId");
        const endNodeId = getAndRemove("endNodeId");

        if (map === "freeFlow") {
            if (nodes && edges) {
                try {
                    setStoreNodes(JSON.parse(nodes));
                    setStoreEdges(JSON.parse(edges));
                } catch {
                    setStoreNodes(getInitialNodes());
                    setStoreEdges(getInitialEdges());
                }
                setStart(startNodeId ?? "0");
                setEnd(endNodeId ?? "7");
            } else if(!(storeNodes[0].data.label as string).includes("Node")) {
                setStoreNodes(getInitialNodes());
                setStoreEdges(getInitialEdges());
                setStart("0");
                setEnd("7");
            }
        }

        if (map === "usa") {
            setStoreNodes(getUSANodes());
            setStoreEdges(getUSALinks());
            setStart(startNodeId ?? getRandomStartNode());
            setEnd(endNodeId ?? getRandomEndNode());
        }

        if (map === "ma") {
            setStoreNodes(getMANodes());
            setStoreEdges(getMALinks());
            setStart(startNodeId ?? getRandomMAStartNode());
            setEnd(endNodeId ?? getRandomMAEndNode());
        }

        fitView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, fitView, setStoreNodes, setStoreEdges, setStart, setEnd]);

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
                                <DropdownMenuItem onClick={clearNodePaths} disabled={isLoading}>
                                    <Route className="h-4 w-4" />
                                    Clear Path
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleWeights()}>
                                    {showWeights ? (
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
                                {!isFreeFlow && (
                                    <DropdownMenuItem onClick={() => toggleLabels()}>
                                        {showLabels ? (
                                            <>
                                                <EyeOff className="h-4 w-4" />
                                                <span className="">Hide Labels</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4" />
                                                <span className="">Show Labels</span>
                                            </>
                                        )}
                                    </DropdownMenuItem> 
                                )}
                                {isFreeFlow && (
                                    <DropdownMenuItem onClick={handleAutoLayout}>
                                        <LayoutDashboard className="h-4 w-4" />
                                        Beautify
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                onClick={clearNodePaths}
                                disabled={isLoading}
                                id="clear-path-btn"
                            >
                                <Route className="h-4 w-4" />
                                Clear Path
                            </Button>
                            <Button variant="outline" onClick={() => toggleWeights()} id="toggle-weights-btn">
                                {showWeights ? (
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
                            {!isFreeFlow && (
                                <Button variant="outline" onClick={() => toggleLabels()} >
                                    {showLabels ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            <span className="">Hide Labels</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            <span className="">Show Labels</span>
                                        </>
                                    )}
                                </Button> 
                            )}
                            {isFreeFlow && (
                                <Button variant="outline" onClick={handleAutoLayout} id="beautify-btn">
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Beautify
                                </Button>
                            )}
                            <HelpCard legends={legends}/>
                        </div>
                    )}
                </div>
            </div>

            <div className="react-flow-wrapper w-full h-full flex-col items-center justify-center overflow-auto p-0 rounded-lg outline color-ring">
                <ReactFlow
                    id="node-canvas"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectEnd={onConnectEnd}
                    fitView
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionLineComponent={FloatingConnectionLine}
                    connectionLineStyle={connectionLineStyle}
                    nodesDraggable={isFreeFlow}
                    nodesConnectable={isFreeFlow}
                    nodesFocusable={isFreeFlow}
                    panOnDrag={isFreeFlow}
                    panOnScroll={isFreeFlow}
                    zoomOnPinch={isFreeFlow}
                    zoomOnScroll={isFreeFlow}
                    zoomOnDoubleClick={isFreeFlow}
                    minZoom={0.0000001}
                >
                    <Background gap={25} size={1} variant={BackgroundVariant.Dots} />
                    {isFreeFlow && (
                        <ZoomSlider position="bottom-right" id="zoom-controls" />
                    )}
                </ReactFlow>
            </div>
        </div>
    );
};

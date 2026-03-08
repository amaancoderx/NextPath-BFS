"use client";
import * as React from "react";
import { motion } from "framer-motion";

// GraphVisualization component
export const GraphVisualization: React.FC = () => {
    const nodes = [
        { id: 0, x: 60, y: 30 },
        { id: 1, x: 130, y: 30 },
        { id: 2, x: 150, y: 80 },
        { id: 3, x: 90, y: 110 },
        { id: 4, x: 30, y: 80 },
    ];

    const edges = React.useMemo(
        () => [
            { source: 0, target: 1 },
            { source: 1, target: 2 },
            { source: 2, target: 3 },
            { source: 3, target: 4 },
            { source: 4, target: 0 },
            { source: 0, target: 2 },
            { source: 1, target: 3 },
        ],
        []
    );

    const [activeNode, setActiveNode] = React.useState(0);
    const [visitedNodes, setVisitedNodes] = React.useState([0]);
    const [activeEdges, setActiveEdges] = React.useState<string[]>([]);

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const animateTraversal = () => {
            const connectedEdges = edges.filter(
                (edge) => edge.source === activeNode
            );

            if (
                connectedEdges.length === 0 ||
                visitedNodes.length >= nodes.length
            ) {
                setActiveNode(0);
                setVisitedNodes([0]);
                setActiveEdges([]);
                timeoutId = setTimeout(animateTraversal, 1000);
                return;
            }

            const nextEdge = connectedEdges.find(
                (edge) => !visitedNodes.includes(edge.target)
            );

            if (nextEdge) {
                setActiveNode(nextEdge.target);
                setVisitedNodes((prev) => [...prev, nextEdge.target]);
                setActiveEdges((prev) => [
                    ...prev,
                    `${nextEdge.source}-${nextEdge.target}`,
                ]);
            } else {
                const nodeWithUnvisitedNeighbors = visitedNodes.find(
                    (nodeId) => {
                        const neighbors = edges
                            .filter((edge) => edge.source === nodeId)
                            .map((edge) => edge.target);
                        return neighbors.some(
                            (neighbor) => !visitedNodes.includes(neighbor)
                        );
                    }
                );

                if (nodeWithUnvisitedNeighbors !== undefined) {
                    setActiveNode(nodeWithUnvisitedNeighbors);
                } else {
                    setActiveNode(0);
                    setVisitedNodes([0]);
                    setActiveEdges([]);
                }
            }

            timeoutId = setTimeout(animateTraversal, 1000);
        };

        timeoutId = setTimeout(animateTraversal, 1000);
        return () => clearTimeout(timeoutId);
    }, [activeNode, edges, nodes.length, visitedNodes]);

    return (
        <svg
            width="200"
            height="120"
            viewBox="0 0 200 120"
            className="opacity-90"
        >
            {/* Pulsing effect for active node */}
            {nodes.map(
                (node, i) =>
                    i === activeNode && (
                        <motion.circle
                            key={`pulse-${i}`}
                            cx={node.x}
                            cy={node.y}
                            r={12}
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 1.5,
                                ease: "easeOut",
                            }}
                            fill="var(--chart-3)"
                        />
                    )
            )}

            {/* Edges with animated dash effect */}
            {edges.map((edge, i) => (
                <motion.line
                    key={`edge-${i}`}
                    x1={nodes[edge.source].x}
                    y1={nodes[edge.source].y}
                    x2={nodes[edge.target].x}
                    y2={nodes[edge.target].y}
                    stroke={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? "var(--chart-1)"
                            : "var(--border)"
                    }
                    strokeWidth={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? 2
                            : 1
                    }
                    strokeOpacity={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? 1
                            : 0.8
                    }
                    strokeDasharray={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? "0"
                            : "3 3"
                    }
                    initial={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? { pathLength: 0 }
                            : {}
                    }
                    animate={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? { pathLength: 1 }
                            : {}
                    }
                    transition={
                        activeEdges.includes(`${edge.source}-${edge.target}`)
                            ? { duration: 0.5 }
                            : {}
                    }
                />
            ))}

            {/* Nodes with spring animation */}
            {nodes.map((node, i) => (
                <motion.circle
                    key={`node-${i}`}
                    cx={node.x}
                    cy={node.y}
                    r={activeNode === i ? 8 : visitedNodes.includes(i) ? 6 : 5}
                    fill={
                        activeNode === i
                            ? "var(--chart-3)"
                            : visitedNodes.includes(i)
                            ? "var(--chart-1)"
                            : "var(--muted)"
                    }
                    initial={{ scale: 0 }}
                    animate={{
                        scale: 1,
                        y: activeNode === i ? -3 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: i * 0.1,
                    }}
                />
            ))}
        </svg>
    );
};

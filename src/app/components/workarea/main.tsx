"use client";

import { GridBasedGraph } from "./gridbased/grid-based";
import { NodeBasedGraph } from "./nodebased/node-based";
import { useGraphStore } from "../../store/gridStore";
import { ReactFlowProvider } from "@xyflow/react";
import WelcomeDialog from "../onboarding/welcome/welcome-dialog";

export function Main() {
    const { type } = useGraphStore();
    const isMatrix = type === "grid";

    return (
        <>
            <WelcomeDialog />
            {isMatrix ? (
                <GridBasedGraph />
            ) : (
                <ReactFlowProvider>
                    <NodeBasedGraph />
                </ReactFlowProvider>
            )}
        </>
    );
}

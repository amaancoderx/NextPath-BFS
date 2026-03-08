/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGraphStore } from "./store/gridStore";
import Pako from "pako";
import base64url from "base64url";
import { useNodeStore } from "./store/nodeStore";
import { MarkerType } from "@xyflow/react";

export default function CatchAllRedirect() {
    const router = useRouter();
    const { setType, setSize, setAlgorithm, setMaze, setSpeed, setCellSize, setWeighted, setDefaultSize, setWalls } = useGraphStore();
    const { setId, setNodeAlgorithm, setNodeDirected, setNodeWeighted, setNodeSpeed, setMap } = useNodeStore();

    useEffect(() => {
        const updateGridStates = (data: any) => {
            const { t, r, c, cs, m, s, alg, isw, sn, en, w, dr, dc, dcs } = data;
            setType(t);
            setAlgorithm(alg);
            setMaze(m);
            setSpeed(s);
            setWeighted(isw == 1);
            setWalls(w.map((wall: any) => ({ row: wall[0], col: wall[1] })));

            localStorage.setItem("rows", r);
            localStorage.setItem("cols", c);
            localStorage.setItem("startNode", JSON.stringify(sn));
            localStorage.setItem("endNode", JSON.stringify(en));
            localStorage.setItem("cellSize", cs);
            localStorage.setItem("defaultRows", dr);
            localStorage.setItem("defaultCols", dc);
            localStorage.setItem("defaultCellSize", dcs);
        };

        const updateNodeStates = (data: any) => {
            const { id, alg, isd, isw, s, n, e, sn, en, m } = data;
            setId(id);
            setMap(m);
            setNodeAlgorithm(alg);
            setNodeDirected(isd == 1);
            setNodeWeighted(isw == 1);
            setNodeSpeed(s);

            const nodes = n.map((node: any) => ({ id: node[0], type: "custom", position: { x: node[1], y: node[2] }, data: { label: node[3], isStart: node[4] == 1, isEnd: node[5] == 1, visited: false, isWall: false, isPath: false } }));
            const edges = e.map((edge: any) => ({ id: edge[0], source: edge[1], target: edge[2], label: edge[3], type: "floating", animated: false, markerEnd: { type: MarkerType.ArrowClosed }, data: { isReversed: false },  }));      
            
            localStorage.setItem("nodes", JSON.stringify(nodes));
            localStorage.setItem("edges", JSON.stringify(edges));
            localStorage.setItem("startNodeId", sn);
            localStorage.setItem("endNodeId", en);
        };
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get("type");
        const dataParam = urlParams.get("data");

        if (typeParam) {
            if (typeParam === "node") {
                setType("node");
            }
        }
        if (dataParam) {
            const decode64 = base64url.toBuffer(dataParam);
            const inflate = Pako.inflate(decode64, { to: "string" });
            const decodedData = JSON.parse(inflate);

            updateGridStates(decodedData["grid"]);
            updateNodeStates(decodedData["node"]);
        } 
        
        router.push("/");
    }, [router, setAlgorithm, setCellSize, setDefaultSize, setId, setMap, setMaze, setNodeAlgorithm, setNodeDirected, setNodeSpeed, setNodeWeighted, setSize, setSpeed, setType, setWalls, setWeighted]);

    return null;
}

import { create } from "zustand";
import { Edge, Node } from "@xyflow/react";
import { getInitialEdges, getInitialNodes } from "../utils/xyflowUtils/util";
import { Algorithm } from "./gridStore";

export type Data = {
  label: string;
  isStart: boolean;
  isEnd: boolean;
  visited: boolean;
  isWall: boolean;
  isPath: boolean;
};

interface NodeStore {
  n_id: number;
  n_algorithm: Algorithm;
  n_isDirected: boolean;
  n_isWeighted: boolean;
  n_speed: number;
  n_isLoading: boolean;

  storeNodes: Node[];
  storeEdges: Edge[];
  StartNodeId: string;
  EndNodeId: string;

  showWeights: boolean;
  showLabels: boolean;
  map: string;

  setNodeAlgorithm: (algo: Algorithm) => void;
  setNodeDirected: (isDirected: boolean) => void;
  setNodeWeighted: (isWeighted: boolean) => void;
  setNodeSpeed: (speed: number) => void;
  setNodeLoading: (isLoading: boolean) => void;

  setStart: (id: string) => void;
  setEnd: (id: string) => void;

  toggleWall: (id: string) => void;
  toggleVisited: (id: string) => void;
  togglePath: (id: string) => void;

  clearNodePaths: () => void;

  toggleAnimatedEdge: (id: string) => void;
  toggleEdgeReverse: (id: string) => void;

  setStoreNodes: (nodes: Node[]) => void;
  setStoreEdges: (edges: Edge[]) => void;

  toggleWeights: () => void;
  toggleLabels: () => void;

  deleteNode: (id: string) => void;
  addNode: (node: Node) => void;

  getID: () => string;
  setMap: (map: string) => void;
  setId: (id: number) => void;
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  n_id: 8,
  n_algorithm: undefined,
  n_isDirected: true,
  n_isWeighted: false,
  n_speed: 1,
  n_isLoading: false,

  storeNodes: getInitialNodes(),
  storeEdges: getInitialEdges(),

  StartNodeId: "0",
  EndNodeId: "7",

  showWeights: false,
  showLabels: true,
  map: "freeFlow",

  setNodeAlgorithm: (algo) => set({ n_algorithm: algo }),

  setNodeDirected: (isDirected) => set({ n_isDirected: isDirected }),

  setNodeWeighted: (isWeighted) =>
    set((state) => {
      const edges = state.storeEdges.map((edge) => ({
        ...edge,
        label: isWeighted ? Math.floor(Math.random() * 10) + 1 : 1,
      }));

      return {
        n_isWeighted: isWeighted,
        storeEdges: edges,
      };
    }),

  setNodeSpeed: (speed) => set({ n_speed: speed }),

  setNodeLoading: (isLoading) => set({ n_isLoading: isLoading }),

  setStart: (id) =>
    set((state) => {
      const nodes = state.storeNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isStart: node.id === id,
        },
      }));

      return { storeNodes: nodes, StartNodeId: id };
    }),

  setEnd: (id) =>
    set((state) => {
      const nodes = state.storeNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEnd: node.id === id,
        },
      }));

      return { storeNodes: nodes, EndNodeId: id };
    }),

  toggleWall: (id) =>
    set((state) => ({
      storeNodes: state.storeNodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, isWall: !node.data.isWall } }
          : node
      ),
    })),

  toggleVisited: (id) =>
    set((state) => ({
      storeNodes: state.storeNodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, visited: !node.data.visited } }
          : node
      ),
    })),

  togglePath: (id) =>
    set((state) => ({
      storeNodes: state.storeNodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, isPath: !node.data.isPath } }
          : node
      ),
    })),

  clearNodePaths: () =>
    set((state) => ({
      storeNodes: state.storeNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isPath: false,
          visited: false,
        },
      })),
      storeEdges: state.storeEdges.map((edge) => ({
        ...edge,
        animated: false,
        data: {
          ...edge.data,
          isReversed: false,
        },
      })),
    })),

  toggleAnimatedEdge: (id) =>
    set((state) => ({
      storeEdges: state.storeEdges.map((edge) =>
        edge.id === id ? { ...edge, animated: !edge.animated } : edge
      ),
    })),

  toggleEdgeReverse: (id) =>
    set((state) => ({
      storeEdges: state.storeEdges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, isReversed: !edge.data?.isReversed } }
          : edge
      ),
    })),

  setStoreNodes: (nodes) => set({ storeNodes: nodes }),

  setStoreEdges: (edges) => set({ storeEdges: edges }),

  toggleWeights: () =>
    set((state) => ({ showWeights: !state.showWeights })),

  toggleLabels: () =>
    set((state) => ({ showLabels: !state.showLabels })),

  deleteNode: (id) =>
    set((state) => ({
      storeNodes: state.storeNodes.filter((node) => node.id !== id),
      storeEdges: state.storeEdges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  addNode: (node) =>
    set((state) => ({
      storeNodes: [...state.storeNodes, node],
    })),

  getID: () => {
    const newId = get().n_id + 1;
    set({ n_id: newId });
    return String(newId);
  },

  setMap: (map) => set({ map }),

  setId: (id) => set({ n_id: id }),
}));
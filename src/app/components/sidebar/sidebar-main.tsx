"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
    Grid3x3,
    Waypoints,
    Gauge,
    TableCellsSplit,
    Workflow,
    Columns2,
    Rows2,
    Weight,
    Clapperboard,
    Compass,
    Map,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import loading2 from "react-useanimations/lib/loading2";
import UseAnimations from "react-useanimations";
import Image from "next/image";
import logo from "@/assets/image/logo.png";
import { useGraphStore, Maze, Algorithm } from "@/app/store/gridStore";
import { getGridDefaults, getRowColBasedCellSize } from "../../utils/util";
import {
    applyRandomMaze,
    applyRandomTerrain,
    applyRecursiveDivision,
} from "@/app/utils/algorithms/maze";
import {
    applyBFSAlgorithm,
    applyBFSAlgorithmForNodes,
} from "@/app/utils/algorithms/bfs";
import {
    applyDFSAlgorithm,
    applyDFSAlgorithmForNodes,
} from "@/app/utils/algorithms/dfs";
import { useEffect, useState } from "react";
import {
    applyDijkstraAlgorithm,
    applyDijkstraAlgorithmForNodes,
} from "@/app/utils/algorithms/dijkstra";
import { useNodeStore } from "@/app/store/nodeStore";
import { applyAStarAlgorithm, applyAStarAlgorithmForNodes } from "@/app/utils/algorithms/astar";

export function AppSidebar() {
    const [highlightAlgorithm, setHighlightAlgorithm] = useState(false);
    const [isSettingsDisabled, setIsSettingsDisabled] = useState(false);
    const [isDirectionEdgeDisbled, setIsDirectionEdgeDisabled] =
        useState(false);
    const {
        rows,
        cols,
        speed,
        maze,
        type,
        isWeighted,
        isLoading,
        algorithm,
        defaultRows,
        defaultCols,
        defaultCellSize,
        setSize,
        setType,
        setCellSize,
        setDefaultSize,
        setWeighted,
        setAlgorithm,
        setSpeed,
        setMaze,
        clearWalls,
        clearPaths,
        setLoading,
        setRandomWeights,
        setWeightsToOne,
        setStartNode,
        setEndNode,
    } = useGraphStore();

    const {
        n_algorithm,
        n_isDirected,
        n_isWeighted,
        n_speed,
        map,

        setNodeAlgorithm,
        setNodeDirected,
        setNodeWeighted,
        setNodeSpeed,
        clearNodePaths,
        setMap,
    } = useNodeStore();

    const { isMobile, setOpenMobile } = useSidebar();
    const updateCell = (newRows: number, newCols: number) => {
        if (newRows < 2 || newCols < 2) return;

        if (newRows > 25 || newCols > 50) return;

        setSize(newRows, newCols);
        const newCellSize = getRowColBasedCellSize(
            defaultRows,
            defaultCols,
            newRows,
            newCols,
            defaultCellSize
        );
        setCellSize(newCellSize);
    };
    const updateMaze = async (value: Maze) => {
        setMaze(value);
        setIsSettingsDisabled(true);
        setLoading(true);
        clearWalls();
        clearPaths();
        let isMazed;
        if (value === "none") {
            isMazed = true;
        } else if (value === "random") {
            isMazed = await applyRandomMaze();
        } else if (value === "terrain") {
            isMazed = await applyRandomTerrain();
        } else if (value === "recursive") {
            isMazed = await applyRecursiveDivision();
        }
        setIsSettingsDisabled(!isMazed);
        setLoading(false);
    };
    const onAlgorithmChange = (value: Algorithm) => {
        setAlgorithm(value);
        setHighlightAlgorithm(false);
    };
    const onNodeAlgorithmChange = (value: Algorithm) => {
        setNodeAlgorithm(value);
        setHighlightAlgorithm(false);
    };
    const handleVisualize = async () => {
        if (type === "grid") {
            if (algorithm === undefined) {
                setHighlightAlgorithm(true);
                return;
            }
            if (isMobile) {
                setOpenMobile(false);
            }
            if (isLoading) return;

            setLoading(true);
            setIsSettingsDisabled(true);
            clearPaths();
            let isVisualized = false;
            if (algorithm === "bfs") {
                isVisualized = await applyBFSAlgorithm();
            } else if (algorithm === "dfs") {
                isVisualized = await applyDFSAlgorithm();
            } else if (algorithm === "dijkstra") {
                isVisualized = await applyDijkstraAlgorithm();
            } else if (algorithm === "aStar") {
                isVisualized = await applyAStarAlgorithm();
            }
            setLoading(false);
            setIsSettingsDisabled(!isVisualized);
        } else if (type === "node") {
            if (n_algorithm === undefined) {
                setHighlightAlgorithm(true);
                return;
            }
            if (isMobile) {
                setOpenMobile(false);
            }
            if (isLoading) return;

            setLoading(true);
            setIsSettingsDisabled(true);
            clearNodePaths();
            let isVisualized = false;
            if (n_algorithm === "bfs") {
                isVisualized = await applyBFSAlgorithmForNodes();
            } else if (n_algorithm === "dfs") {
                isVisualized = await applyDFSAlgorithmForNodes();
            } else if (n_algorithm === "dijkstra") {
                isVisualized = await applyDijkstraAlgorithmForNodes();
            } else if (n_algorithm === "aStar") {
                isVisualized = await applyAStarAlgorithmForNodes();
            }
            setLoading(false);
            setIsSettingsDisabled(!isVisualized);
        }
    };
    const handleWeighted = (value: string) => {
        const isWeighted = value === "weighted";
        setWeighted(isWeighted);
        if (isWeighted) {
            setRandomWeights();
        } else {
            setWeightsToOne();
        }
    };
    const updateMap = (value: string) => {
        setMap(value);
        setIsDirectionEdgeDisabled(value === "freeFlow" ? false : true);
        setNodeDirected(value === "freeFlow");
        setNodeWeighted(value === "freeFlow" ? false : true);
        clearNodePaths();
    };

    useEffect(() => {
        const { defRows, defCols, defCellSize } = getGridDefaults();

        const getAndRemove = (key: string): string | null => {
            const value = localStorage.getItem(key);
            if (value) localStorage.removeItem(key);
            return value;
        };

        const parseNumber = (value: string | null, fallback: number): number =>
            value !== null && !isNaN(Number(value))
                ? parseInt(value, 10)
                : fallback;

        // Cell Size
        const savedCellSize = getAndRemove("cellSize");
        setCellSize(parseNumber(savedCellSize, defCellSize));

        // Default Size
        const defaultRows = parseNumber(getAndRemove("defaultRows"), defRows);
        const defaultCols = parseNumber(getAndRemove("defaultCols"), defCols);
        const defaultCellSize = parseNumber(
            getAndRemove("defaultCellSize"),
            defCellSize
        );
        setDefaultSize(defaultRows, defaultCols, defaultCellSize);

        // Grid Size
        const rows = parseNumber(getAndRemove("rows"), defRows);
        const cols = parseNumber(getAndRemove("cols"), defCols);
        setSize(rows, cols);

        // Start Node
        const savedStartNode = getAndRemove("startNode");
        if (savedStartNode) {
            try {
                const [row, col] = JSON.parse(savedStartNode);
                setStartNode(row, col);
            } catch {}
        }

        // End Node
        const savedEndNode = getAndRemove("endNode");
        if (savedEndNode) {
            try {
                const [row, col] = JSON.parse(savedEndNode);
                setEndNode(row, col);
            } catch {}
        }
    }, [setDefaultSize, setCellSize, setSize, setStartNode, setEndNode]);

    return (
        <Sidebar>
            <SidebarHeader className="flex shrink-0 items-center justify-center px-4">
                <a href="https://github.com/Lakshman-99/NextPath" target="_blank" rel="noopener noreferrer">
                    <Image
                        className="dark:invert"
                        src={logo}
                        alt="NextPath logo"
                        width={200}
                        height={40}
                        priority
                    />
                </a>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <Tabs id="settings" className="w-full p-2" value={type}>
                        <TabsList
                            id="graphType"
                            className={`grid grid-cols-2 w-full ${
                                isSettingsDisabled
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                            }`}
                        >
                            <TabsTrigger
                                value="grid"
                                onClick={() => setType("grid")}
                            >
                                <Grid3x3 className="h-4 w-4" />
                                Grid-Based
                            </TabsTrigger>
                            <TabsTrigger
                                value="node"
                                onClick={() => setType("node")}
                            >
                                <Waypoints className="h-4 w-4" />
                                Network-Based
                            </TabsTrigger>
                        </TabsList>
                        <div className="relative z-10 h-full">
                            <Card className="max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Graph Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TabsContent
                                        value="grid"
                                        className={`space-y-6 ${
                                            isSettingsDisabled
                                                ? "opacity-50 pointer-events-none"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className="grid w-full items-center gap-4 space-y-2.5"
                                            id="rows-cols"
                                        >
                                            {" "}
                                            {/* Grid Size */}
                                            <div className="flex gap-4 justify-between">
                                                <div className="flex flex-col space-y-2.5">
                                                    <Label>
                                                        <Rows2 className="h-4 w-4" />
                                                        Rows (m)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 10"
                                                        value={rows}
                                                        min={2}
                                                        max={25}
                                                        onChange={(e) => {
                                                            const value =
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                );
                                                            if (value < 2) {
                                                                updateCell(
                                                                    2,
                                                                    cols
                                                                );
                                                                e.target.value =
                                                                    "2";
                                                            } else if (
                                                                value > 25
                                                            ) {
                                                                updateCell(
                                                                    25,
                                                                    cols
                                                                );
                                                                e.target.value =
                                                                    "25";
                                                            } else {
                                                                updateCell(
                                                                    value,
                                                                    cols
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-2.5">
                                                    <Label>
                                                        <Columns2 className="h-4 w-4" />
                                                        Columns (n)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g., 15"
                                                        value={cols}
                                                        min={2}
                                                        max={50}
                                                        onChange={(e) => {
                                                            const value =
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                );
                                                            if (value < 2) {
                                                                updateCell(
                                                                    rows,
                                                                    2
                                                                );
                                                                e.target.value =
                                                                    "2";
                                                            } else if (
                                                                value > 50
                                                            ) {
                                                                updateCell(
                                                                    rows,
                                                                    50
                                                                );
                                                                e.target.value =
                                                                    "50";
                                                            } else {
                                                                updateCell(
                                                                    rows,
                                                                    value
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Algorithm */}
                                        <div
                                            className="flex flex-col space-y-2.5"
                                            id="algorithm-selector"
                                        >
                                            <Label>
                                                <Workflow className="h-4 w-4" />
                                                Algorithm
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    onAlgorithmChange(
                                                        value as Algorithm
                                                    )
                                                }
                                                value={algorithm}
                                            >
                                                <SelectTrigger
                                                    className={`
                                                    w-full transition-all duration-300
                                                    ${
                                                        highlightAlgorithm
                                                            ? "ring-3 ring-red-400"
                                                            : ""
                                                    }
                                                `}
                                                >
                                                    <SelectValue placeholder="Choose an algorithm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bfs">
                                                        Breath First Search
                                                    </SelectItem>
                                                    <SelectItem value="dfs">
                                                        Depth First Search
                                                    </SelectItem>
                                                    <SelectItem value="dijkstra">
                                                        Dijkstra&rsquo;s
                                                        Algorithm
                                                    </SelectItem>
                                                    <SelectItem value="aStar">
                                                        A* Algorithm
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Maze Generator */}
                                        <div
                                            className="flex flex-col space-y-2.5"
                                            id="maze-generator"
                                        >
                                            <Label>
                                                <TableCellsSplit className="h-4 w-4" />
                                                Maze Generator
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    updateMaze(value as Maze)
                                                }
                                                value={maze}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choose a maze type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        None
                                                    </SelectItem>
                                                    <SelectItem value="random">
                                                        Random Maze
                                                    </SelectItem>
                                                    <SelectItem value="terrain">
                                                        Random Terrain
                                                    </SelectItem>
                                                    <SelectItem value="recursive">
                                                        Random Division
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Graph Type */}
                                        <div
                                            className="flex flex-col space-y-2.5"
                                            id="type-selector"
                                        >
                                            <Label>
                                                <Weight className="h-4 w-4" />
                                                Type
                                            </Label>
                                            <RadioGroup
                                                defaultValue={
                                                    isWeighted
                                                        ? "weighted"
                                                        : "unweighted"
                                                }
                                                value={
                                                    isWeighted
                                                        ? "weighted"
                                                        : "unweighted"
                                                }
                                                className="flex justify-between gap-4"
                                                onValueChange={handleWeighted}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="unweighted"
                                                        id="unweighted"
                                                    />
                                                    <Label htmlFor="unweighted">
                                                        Un-Weighted
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="weighted"
                                                        id="weighted"
                                                    />
                                                    <Label htmlFor="weighted">
                                                        Weighted
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        {/* Speed */}
                                        <div
                                            className="flex flex-col space-y-2.5"
                                            id="animation-speed"
                                        >
                                            <Label>
                                                <Gauge className="h-4 w-4" />
                                                Animation Speed
                                            </Label>
                                            <Slider
                                                value={[speed]}
                                                min={0.6}
                                                max={1.5}
                                                step={0.1}
                                                onValueChange={(value) =>
                                                    setSpeed(value[0])
                                                }
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="node"
                                        className={`space-y-6 ${
                                            isSettingsDisabled
                                                ? "opacity-50 pointer-events-none"
                                                : ""
                                        }`}
                                    >
                                        <div className="grid w-full items-center gap-4 space-y-2.5">
                                            {/* Map */}
                                            <div
                                                className="flex flex-col space-y-2.5"
                                                id="map-selector"
                                            >
                                                <Label>
                                                    <Map className="h-4 w-4" />
                                                    Map
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        updateMap(
                                                            value as string
                                                        )
                                                    }
                                                    value={map}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Choose a map type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="freeFlow">
                                                            Free Flow
                                                        </SelectItem>
                                                        <SelectItem value="usa">
                                                            United States
                                                        </SelectItem>
                                                        <SelectItem value="ma">
                                                            Massachusetts
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Algorithm */}
                                            <div
                                                className="flex flex-col space-y-2.5"
                                                id="algorithm-selector"
                                            >
                                                <Label>
                                                    <Workflow className="h-4 w-4" />
                                                    Algorithm
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        onNodeAlgorithmChange(
                                                            value as Algorithm
                                                        )
                                                    }
                                                    value={n_algorithm}
                                                >
                                                    <SelectTrigger
                                                        className={`w-full transition-all duration-300 ${
                                                            highlightAlgorithm
                                                                ? "ring-3 ring-red-400"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="Choose an algorithm" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="bfs">
                                                            Breath First Search
                                                        </SelectItem>
                                                        <SelectItem value="dfs">
                                                            Depth First Search
                                                        </SelectItem>
                                                        <SelectItem value="dijkstra">
                                                            Dijkstra&rsquo;s
                                                            Algorithm
                                                        </SelectItem>
                                                        <SelectItem value="aStar">
                                                            A* Algorithm
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Graph Direction */}
                                            <div
                                                className={`flex flex-col space-y-2.5 ${
                                                    isDirectionEdgeDisbled
                                                        ? "opacity-50 pointer-events-none"
                                                        : ""
                                                } `}
                                                id="direction-toggle"
                                            >
                                                <Label>
                                                    <Compass className="h-4 w-4" />
                                                    Direction
                                                </Label>
                                                <RadioGroup
                                                    defaultValue={
                                                        n_isDirected
                                                            ? "directed"
                                                            : "undirected"
                                                    }
                                                    value={
                                                        n_isDirected
                                                            ? "directed"
                                                            : "undirected"
                                                    }
                                                    className="flex gap-4"
                                                    onValueChange={(value) =>
                                                        setNodeDirected(
                                                            value === "directed"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="undirected"
                                                            id="undirected"
                                                        />
                                                        <Label htmlFor="undirected">
                                                            Un-Directed
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="directed"
                                                            id="directed"
                                                        />
                                                        <Label htmlFor="directed">
                                                            Directed
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Graph Type */}
                                            <div
                                                className={`flex flex-col space-y-2.5 ${
                                                    isDirectionEdgeDisbled
                                                        ? "opacity-50 pointer-events-none"
                                                        : ""
                                                } `}
                                                id="weight-toggle"
                                            >
                                                <Label>
                                                    <Weight className="h-4 w-4" />
                                                    Type
                                                </Label>
                                                <RadioGroup
                                                    defaultValue={
                                                        n_isWeighted
                                                            ? "weighted"
                                                            : "unweighted"
                                                    }
                                                    value={
                                                        n_isWeighted
                                                            ? "weighted"
                                                            : "unweighted"
                                                    }
                                                    className="flex gap-4"
                                                    onValueChange={(value) =>
                                                        setNodeWeighted(
                                                            value === "weighted"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="unweighted"
                                                            id="unweighted"
                                                        />
                                                        <Label htmlFor="unweighted">
                                                            Un-Weighted
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="weighted"
                                                            id="weighted"
                                                        />
                                                        <Label htmlFor="weighted">
                                                            Weighted
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Speed */}
                                            <div
                                                className="flex flex-col space-y-2.5"
                                                id="animation-nspeed"
                                            >
                                                <Label>
                                                    <Gauge className="h-4 w-4" />
                                                    Animation Speed
                                                </Label>
                                                <Slider
                                                    value={[n_speed]}
                                                    min={0.6}
                                                    max={1.5}
                                                    step={0.1}
                                                    onValueChange={(value) =>
                                                        setNodeSpeed(value[0])
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full cursor-pointer"
                                        id="visualize-btn"
                                        onClick={handleVisualize}
                                    >
                                        {" "}
                                        {isLoading ? (
                                            <UseAnimations
                                                animation={loading2}
                                                size={28}
                                                fillColor="#fff"
                                                className="dark:invert"
                                            />
                                        ) : (
                                            <Clapperboard className="h-4 w-4" />
                                        )}
                                        Visualize
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </Tabs>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

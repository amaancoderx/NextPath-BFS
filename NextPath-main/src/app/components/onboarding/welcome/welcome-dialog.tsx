"use client";
import * as React from "react";
import { useOnborda } from "onborda";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft } from "lucide-react";

import { contentVariants, buttonVariants } from "./animation-variants";
import { AnimatedBackground } from "./animated-background";
import { GraphVisualization } from "./graph-visualization";
import { FeatureCard } from "./feature-card";
import { AlgorithmCard } from "./algorithm-card";
import { useGraphStore } from "@/app/store/gridStore";
import { useNodeStore } from "@/app/store/nodeStore";
import { useSidebar } from "@/components/ui/sidebar";

const algorithmData = [
    {
        title: "Breadth-First Search (BFS)",
        description:
            "Explores all neighbors at the present depth before moving to nodes at the next depth level.",
        icon: "Network",
        bgColor: "bg-chart-1/10",
        iconColor: "text-chart-1",
    },
    {
        title: "Depth-First Search (DFS)",
        description:
            "Explores as far as possible along each branch before backtracking.",
        icon: "Zap",
        bgColor: "bg-chart-2/10",
        iconColor: "text-chart-2",
    },
    {
        title: "Dijkstra's Algorithm",
        description:
            "Finds the shortest path between nodes in a graph with non-negative edge weights.",
        icon: "Compass",
        bgColor: "bg-chart-3/10",
        iconColor: "text-chart-3",
    },
    {
        title: "A* Search Algorithm",
        description:
            "Uses heuristics to find the shortest path more efficiently than Dijkstra's.",
        icon: "Lightbulb",
        bgColor: "bg-chart-4/10",
        iconColor: "text-chart-4",
    },
];

// Main component
export function WelcomeDialog() {
    const [open, setDialogOpen] = React.useState(true);
    const [activeView, setActiveView] = React.useState("welcome");
    const { setType } = useGraphStore();
    const { setMap, setNodeDirected, setNodeWeighted } = useNodeStore();
    const { setOpen } = useSidebar();
    const { startOnborda } = useOnborda();

    // Button handlers
    const handleStart = () => {
        setType("grid");
        setMap("freeFlow");
        startOnborda("onboarding-tour");
        setDialogOpen(false);
    };

    const handleInteractiveEditor = () => {
        setType("node");
        setDialogOpen(false);
    };

    const handleMapVisualization = () => {
        setType("node");
        setMap("usa");
        setNodeDirected(false);
        setNodeWeighted(true);
        setDialogOpen(false);
    };

    const showAlgorithms = () => {
        setActiveView("algorithms");
    };

    const showWelcome = () => {
        setActiveView("welcome");
    };

    React.useEffect(() => {
        setOpen(true);
    }, [setOpen]);

    return (
        <AnimatePresence>
            {open && (
                <Dialog open={open} onOpenChange={setDialogOpen}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <DialogContent className="sm:max-w-xl p-0 rounded-xl shadow-xl border bg-background/95 backdrop-blur-sm overflow-hidden focus:outline-none focus-visible:outline-none">
                            <AnimatedBackground />

                            <AnimatePresence mode="wait">
                                {activeView === "welcome" && (
                                    <motion.div
                                        key="welcome-view"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={contentVariants}
                                    >
                                        {/* Header with dynamic graph */}
                                        <div className="p-6 relative">
                                            <div className="absolute top-0 right-0 -mt-4 -mr-2 rotate-6 opacity-90">
                                                <GraphVisualization />
                                            </div>

                                            <DialogHeader>
                                                <motion.div
                                                    variants={{
                                                        hidden: {
                                                            opacity: 0,
                                                            x: -20,
                                                        },
                                                        visible: {
                                                            opacity: 1,
                                                            x: 0,
                                                            transition: {
                                                                duration: 0.5,
                                                            },
                                                        },
                                                    }}
                                                    className="mb-3 px-3 py-1.5 w-fit rounded-full bg-chart-1/10 text-chart-1 text-xs font-medium"
                                                >
                                                    <motion.span
                                                        animate={{
                                                            opacity: [
                                                                0.7, 1, 0.7,
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            repeatType:
                                                                "mirror",
                                                        }}
                                                    >
                                                        Visualize • Learn •
                                                        Master
                                                    </motion.span>
                                                </motion.div>

                                                <DialogTitle className="text-3xl font-bold tracking-tight">
                                                    <motion.div
                                                        variants={{
                                                            hidden: {
                                                                opacity: 0,
                                                                y: 20,
                                                            },
                                                            visible: {
                                                                opacity: 1,
                                                                y: 0,
                                                                transition: {
                                                                    duration: 0.5,
                                                                    delay: 0.1,
                                                                },
                                                            },
                                                        }}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="bg-gradient-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent">
                                                            NextPath
                                                        </div>

                                                        <motion.div
                                                            initial={{
                                                                rotate: -10,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                rotate: 0,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 260,
                                                                damping: 20,
                                                                delay: 0.4,
                                                            }}
                                                        >
                                                            <svg
                                                                width="32"
                                                                height="32"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <motion.path
                                                                    d="M3 17L9 11L13 15L21 7"
                                                                    stroke="url(#gradient)"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    initial={{
                                                                        pathLength: 0,
                                                                    }}
                                                                    animate={{
                                                                        pathLength: 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 1.5,
                                                                        delay: 0.5,
                                                                    }}
                                                                />
                                                                <motion.path
                                                                    d="M17 7H21V11"
                                                                    stroke="url(#gradient)"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    initial={{
                                                                        pathLength: 0,
                                                                    }}
                                                                    animate={{
                                                                        pathLength: 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.8,
                                                                        delay: 1.2,
                                                                    }}
                                                                />
                                                                <defs>
                                                                    <linearGradient
                                                                        id="gradient"
                                                                        x1="3"
                                                                        y1="7"
                                                                        x2="21"
                                                                        y2="17"
                                                                        gradientUnits="userSpaceOnUse"
                                                                    >
                                                                        <stop stopColor="var(--chart-1)" />
                                                                        <stop
                                                                            offset="1"
                                                                            stopColor="var(--chart-3)"
                                                                        />
                                                                    </linearGradient>
                                                                </defs>
                                                            </svg>
                                                        </motion.div>
                                                    </motion.div>
                                                </DialogTitle>

                                                <DialogDescription className="mt-3 text-base" asChild>
                                                    <motion.div
                                                        variants={{
                                                            hidden: {
                                                                opacity: 0,
                                                            },
                                                            visible: {
                                                                opacity: 1,
                                                                transition: {
                                                                    duration: 0.5,
                                                                    delay: 0.2,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        Visualize, understand,
                                                        and master graph
                                                        algorithms through
                                                        <motion.span
                                                            className="font-medium text-foreground"
                                                            animate={{
                                                                color: [
                                                                    "var(--chart-1)",
                                                                    "var(--chart-2)",
                                                                    "var(--chart-3)",
                                                                    "var(--foreground)",
                                                                ],
                                                            }}
                                                            transition={{
                                                                duration: 5,
                                                                repeat: Number.POSITIVE_INFINITY,
                                                                repeatType:
                                                                    "reverse",
                                                            }}
                                                        >
                                                            {" "}
                                                            interactive
                                                            animations
                                                        </motion.span>{" "}
                                                        and
                                                        <span className="font-medium text-foreground">
                                                            {" "}
                                                            intuitive design
                                                        </span>
                                                        .
                                                    </motion.div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </div>

                                        {/* Feature cards with enhanced animations */}
                                        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                                            <motion.div
                                                className="col-span-2"
                                                variants={{
                                                    hidden: {
                                                        opacity: 0,
                                                        y: 20,
                                                    },
                                                    visible: {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: {
                                                            duration: 0.4,
                                                            delay: 0.3,
                                                        },
                                                    },
                                                }}
                                            >
                                                <FeatureCard
                                                    title="Popular Algorithms"
                                                    description="BFS, DFS, Dijkstra, A* and more"
                                                    icon="Brain"
                                                    color="bg-chart-1"
                                                    bgGradient="bg-gradient-to-r from-chart-1/20 to-chart-3/30"
                                                    onClick={showAlgorithms}
                                                />
                                            </motion.div>

                                            <motion.div
                                                variants={{
                                                    hidden: {
                                                        opacity: 0,
                                                        y: 20,
                                                    },
                                                    visible: {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: {
                                                            duration: 0.4,
                                                            delay: 0.4,
                                                        },
                                                    },
                                                }}
                                            >
                                                <FeatureCard
                                                    title="Map Visualization" 
                                                    description="Visualize algorithms on USA, Massachusetts, or custom geographic maps"
                                                    icon="Map"
                                                    color="bg-chart-2"
                                                    onClick={handleMapVisualization}
                                                />
                                            </motion.div>

                                            <motion.div
                                                variants={{
                                                    hidden: {
                                                        opacity: 0,
                                                        y: 20,
                                                    },
                                                    visible: {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: {
                                                            duration: 0.4,
                                                            delay: 0.5,
                                                        },
                                                    },
                                                }}
                                            >
                                                <FeatureCard
                                                    title="Interactive Editor"
                                                    description="Build your own custom graph structures"
                                                    icon="Compass"
                                                    color="bg-chart-3"
                                                    onClick={handleInteractiveEditor}
                                                />
                                            </motion.div>
                                        </div>

                                        <DialogFooter className="p-6 pt-0">
                                            <motion.div
                                                className="w-full"
                                                variants={buttonVariants}
                                                initial="initial"
                                                animate="animate"
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    onClick={handleStart}
                                                    className="w-full bg-gradient-to-r from-chart-1 to-chart-3 text-white font-medium py-6 rounded-full relative overflow-hidden group"
                                                >
                                                    <motion.span
                                                        className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        initial={{ x: "-100%" }}
                                                        whileHover={{
                                                            x: "100%",
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            ease: "easeInOut",
                                                        }}
                                                    />
                                                    Begin Your Journey
                                                    <motion.div
                                                        animate={{
                                                            x: [0, 5, 0],
                                                        }}
                                                        transition={{
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            duration: 1.5,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="ml-2"
                                                    >
                                                        <ArrowRight size={18} />
                                                    </motion.div>
                                                </Button>
                                            </motion.div>
                                        </DialogFooter>
                                    </motion.div>
                                )}

                                {activeView === "algorithms" && (
                                    <motion.div
                                        key="algorithms-view"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={contentVariants}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <motion.button
                                                    variants={{
                                                        hidden: {
                                                            opacity: 0,
                                                            x: -10,
                                                        },
                                                        visible: {
                                                            opacity: 1,
                                                            x: 0,
                                                            transition: {
                                                                duration: 0.3,
                                                            },
                                                        },
                                                    }}
                                                    whileHover={{
                                                        x: -3,
                                                        color: "var(--foreground)",
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={showWelcome}
                                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ChevronLeft size={16} />
                                                    Back
                                                </motion.button>

                                                <motion.div
                                                    variants={{
                                                        hidden: {
                                                            opacity: 0,
                                                            scale: 0.9,
                                                        },
                                                        visible: {
                                                            opacity: 1,
                                                            scale: 1,
                                                            transition: {
                                                                duration: 0.4,
                                                            },
                                                        },
                                                    }}
                                                    className="text-sm font-medium bg-gradient-to-r from-chart-1 to-chart-3 bg-clip-text text-transparent px-3 py-1 rounded-full bg-chart-1/5"
                                                >
                                                    Algorithm Library
                                                </motion.div>
                                            </div>

                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: {
                                                        opacity: 1,
                                                        transition: {
                                                            staggerChildren: 0.1,
                                                            delayChildren: 0.2,
                                                        },
                                                    },
                                                }}
                                                className="space-y-4"
                                            >
                                                {algorithmData.map(
                                                    (algorithm, index) => (
                                                        <AlgorithmCard
                                                            key={index}
                                                            {...algorithm}
                                                            index={index}
                                                        />
                                                    )
                                                )}
                                            </motion.div>
                                        </div>

                                        <DialogFooter className="p-6 pt-3">
                                            <motion.div
                                                className="w-full"
                                                variants={buttonVariants}
                                                initial="initial"
                                                animate="animate"
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    onClick={handleStart}
                                                    className="w-full bg-gradient-to-r from-chart-1 to-chart-3 text-white font-medium py-6 rounded-full relative overflow-hidden group"
                                                >
                                                    <motion.span
                                                        className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        initial={{ x: "-100%" }}
                                                        whileHover={{
                                                            x: "100%",
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            ease: "easeInOut",
                                                        }}
                                                    />
                                                    Start Interactive Tour
                                                    <motion.div
                                                        animate={{
                                                            x: [0, 5, 0],
                                                        }}
                                                        transition={{
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            duration: 1.5,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="ml-2"
                                                    >
                                                        <ArrowRight size={18} />
                                                    </motion.div>
                                                </Button>
                                            </motion.div>
                                        </DialogFooter>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </DialogContent>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    );
}

export default WelcomeDialog;

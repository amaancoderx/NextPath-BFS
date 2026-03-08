"use client";
import type * as React from "react";
import { motion } from "framer-motion";

// AnimatedBackground component
export const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                        x: `${Math.random() * 90 + 5}%`,
                        y: `${Math.random() * 90 + 5}%`,
                        scale: Math.random() * 0.6 + 0.2,
                        opacity: Math.random() * 0.3 + 0.1,
                        background:
                            i % 3 === 0
                                ? "var(--chart-1)"
                                : i % 3 === 1
                                ? "var(--chart-2)"
                                : "var(--chart-3)",
                    }}
                    animate={{
                        x: `${Math.random() * 90 + 5}%`,
                        y: `${Math.random() * 90 + 5}%`,
                        opacity: Math.random() * 0.2 + 0.05,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                    style={{
                        width: `${Math.random() * 20 + 8}px`,
                        height: `${Math.random() * 20 + 8}px`,
                        filter: `blur(${Math.random() * 5 + 2}px)`,
                    }}
                />
            ))}
        </div>
    );
};

// GraphBackground component
export const GraphBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="240" height="120" viewBox="0 0 240 120">
                <g stroke="currentColor" fill="none" strokeWidth="1">
                    <circle cx="60" cy="60" r="8" />
                    <circle cx="120" cy="30" r="8" />
                    <circle cx="180" cy="60" r="8" />
                    <circle cx="120" cy="90" r="8" />
                    <line x1="60" y1="60" x2="120" y2="30" />
                    <line x1="120" y1="30" x2="180" y2="60" />
                    <line x1="180" y1="60" x2="120" y2="90" />
                    <line x1="120" y1="90" x2="60" y2="60" />
                    <line x1="60" y1="60" x2="180" y2="60" />
                    <line x1="120" y1="30" x2="120" y2="90" />
                </g>
            </svg>
        </div>
    );
};

// AnimatedSteps component
export const AnimatedMap: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
            {/* Simple, clean map grid background */}
            <svg
                width="240"
                height="120"
                viewBox="0 0 240 120"
                className="overflow-visible"
            >
                {/* Grid lines */}
                {[...Array(6)].map((_, i) => (
                    <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 24}
                        x2="240"
                        y2={i * 24}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                        opacity="1"
                    />
                ))}
                {[...Array(7)].map((_, i) => (
                    <line
                        key={`v-${i}`}
                        x1={i * 40}
                        y1="0"
                        x2={i * 40}
                        y2="120"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                        opacity="1"
                    />
                ))}

                {/* US outline - minimal, abstract version */}
                <path
                    d="M40,30 C60,25 80,35 100,30 C120,25 140,30 160,35 C180,40 200,30 220,40"
                    stroke="var(--chart-2)"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="1"
                />

                {/* Main locations/nodes */}
                <circle
                    cx="60"
                    cy="30"
                    r="3"
                    fill="var(--chart-2)"
                    opacity="1"
                />
                <circle
                    cx="120"
                    cy="28"
                    r="3"
                    fill="var(--chart-2)"
                    opacity="1"
                />
                <circle
                    cx="180"
                    cy="35"
                    r="3"
                    fill="var(--chart-2)"
                    opacity="1"
                />

                {/* Location coordinates text */}
                <text
                    x="60"
                    y="22"
                    fontSize="6"
                    fill="currentColor"
                    textAnchor="middle"
                    opacity="1"
                >
                    37°N 95°W
                </text>
                <text
                    x="180"
                    y="27"
                    fontSize="6"
                    fill="currentColor"
                    textAnchor="middle"
                    opacity="1"
                >
                    40°N 74°W
                </text>
            </svg>
        </div>
    );
};

// EditorUI component
export const EditorUI: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                className="w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 50,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <g stroke="currentColor" fill="none" strokeWidth="1">
                        <circle cx="50" cy="50" r="40" strokeDasharray="10 5" />
                        <circle cx="50" cy="50" r="25" strokeDasharray="5 3" />
                        <line
                            x1="10"
                            y1="50"
                            x2="90"
                            y2="50"
                            strokeDasharray="2 2"
                        />
                        <line
                            x1="50"
                            y1="10"
                            x2="50"
                            y2="90"
                            strokeDasharray="2 2"
                        />
                    </g>
                </svg>
            </motion.div>
        </div>
    );
};

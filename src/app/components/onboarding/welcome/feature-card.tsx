"use client";
import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { ArrowRight, Brain, Compass, Map, Network } from "lucide-react";

import {
    GraphBackground,
    AnimatedMap,
    EditorUI,
} from "./animated-background";

// Types
interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    bgGradient?: string;
    onClick: () => void;
}

// FeatureCard component
export const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    icon,
    color,
    bgGradient,
    onClick,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    // Parallax effect values
    const y = useMotionValue(0);
    const x = useMotionValue(0);

    // Transform the motion values
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    // Map icon string to component
    const IconComponent = () => {
        switch (icon) {
            case "Brain":
                return <Brain size={20} />;
            case "Map":
                return <Map size={20} />;
            case "Compass":
                return <Compass size={20} />;
            default:
                return <Network size={20} />;
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="relative h-40 rounded-xl overflow-hidden cursor-pointer transition-all duration-100 group focus:outline-none focus-visible:outline-none"
        >
            <div
                className={`absolute inset-0 ${
                    bgGradient || color
                } opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
            />

            {/* Dynamic background graphic based on card type */}
            {title === "Popular Algorithms" && <GraphBackground />}
            {title === "Map Visualization" && <AnimatedMap />}
            {title === "Interactive Editor" && <EditorUI />}

            {/* Content with 3D effect */}
            <div
                className="absolute inset-0 flex flex-col justify-between p-4"
                style={{ transform: "translateZ(20px)" }}
            >
                <div className="flex justify-between items-start">
                    <motion.div
                        className={`p-2 rounded-lg ${color} text-white`}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <IconComponent />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            delay: 0.4,
                        }}
                        className="w-7 h-7 rounded-full bg-background/80 border border-border/50 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300"
                    >
                        <ArrowRight size={14} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs mt-1 text-muted-foreground">
                        {description}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

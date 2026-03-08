"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Compass, Lightbulb, Network, Sparkles, Zap } from "lucide-react";

// Types
interface AlgorithmCardProps {
    title: string;
    description: string;
    icon: string;
    bgColor: string;
    iconColor: string;
    index: number;
}

// AlgorithmCard component
export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
    title,
    description,
    icon,
    bgColor,
    iconColor,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    // Map icon string to component
    const IconComponent = () => {
        switch (icon) {
            case "Network":
                return <Network size={16} />;
            case "Zap":
                return <Zap size={16} />;
            case "Compass":
                return <Compass size={16} />;
            case "Lightbulb":
                return <Lightbulb size={16} />;
            default:
                return <Network size={16} />;
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.1 }}
            whileHover={{
                scale: 1.02,
                boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.98 }}
            className={`${bgColor} p-4 rounded-xl border border-border/50 relative overflow-hidden cursor-pointer group`}
        >
            {/* Animated highlight effect */}
            <motion.div
                className="absolute -right-10 -top-10 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                    background: `var(${iconColor.replace("text", "bg")})`,
                }}
            />

            <div className="flex items-start gap-3">
                <motion.div
                    className={`mt-1 p-2 rounded-lg bg-background/80 border border-border/50 ${iconColor}`}
                    whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.2 },
                    }}
                >
                    <IconComponent />
                </motion.div>

                <div className="flex-1">
                    <motion.h3
                        className="font-medium text-sm flex items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {title}
                        <motion.span
                            className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{
                                y: [0, -3, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                            }}
                        >
                            <Sparkles size={12} className={iconColor} />
                        </motion.span>
                    </motion.h3>

                    <motion.p
                        className="text-xs text-muted-foreground mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        className="mt-2 h-1 w-0 group-hover:w-full rounded-full transition-all duration-700"
                        style={{
                            background: `var(${iconColor.replace(
                                "text",
                                "bg"
                            )})`,
                            opacity: 0.3,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

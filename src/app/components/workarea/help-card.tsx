"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeHelp } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export function HelpCard({ legends }: { legends: { label: string; color: string }[] }) {
    const [open, setOpen] = React.useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const cellSize = 20;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size={isMobile ? "icon" : "default"}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md shadow-sm"
                    id="legends-btn"
                >
                    <BadgeHelp className="w-4 h-4" />
                    {isMobile ? "" : "Legends" }
                </Button>
            </DialogTrigger>

            <AnimatePresence>
                {open && (
                    <DialogContent forceMount className="sm:max-w-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="p-3"
                        >
                            <DialogHeader>
                                <DialogTitle>Graph Color Legend</DialogTitle>
                                <DialogDescription>
                                    A quick visual reference for how each cell is used while visualizing algorithms like BFS or Dijkstra.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                {legends.map(({ label, color }) => (
                                    <motion.div
                                        key={label}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="flex items-center gap-3 cursor-default"
                                    >
                                        <div
                                            className={`rounded-md border border-border ${color}`}
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.2)",
                                            }}
                                        />
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-4 text-xs text-muted-foreground">
                                Tip: As the algorithm runs, you’ll see visited nodes and shortest paths animate in real time using these colors.
                            </div>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return !isMobile ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleTheme} id="theme-toggle-btn">
                        <Sun className="h-4 w-4 transition-all dark:scale-0 dark:hidden" />
                        <Moon className="h-4 w-4 transition-all hidden dark:block" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Toggle Theme
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <div onClick={toggleTheme} className="flex items-center gap-2">
            <Sun className="h-4 w-4 transition-all dark:scale-0 dark:hidden" />
            <Moon className="h-4 w-4 transition-all hidden dark:block" />
            Toggle theme
        </div>
    );
}

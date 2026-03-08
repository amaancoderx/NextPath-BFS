"use client";
import { useState } from "react";

import { Copy, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { constructLinkData } from "@/app/utils/util";
import { useMediaQuery } from "usehooks-ts";

export function ExportGraph() {
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState("");
    const isMobile = useMediaQuery("(max-width: 768px)");

    const constructLink = async () => {
        const baseUrl = window.location.origin;
        const linkData = await constructLinkData();
        const link = `${baseUrl}/graph?data=${linkData}`;
        
        setLink(link);
    };

    const handleCopyClick = async  () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={isMobile ? "icon" : "default"} onClick={constructLink} id="export-graph">
                    <Share className={`w-4 ${isMobile ? "h3" : "h-4"}`} />
                    {isMobile ? "" : "Export" }
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={link}
                            readOnly
                        />
                    </div>
                    <Tooltip open={copied}>
                        <TooltipTrigger asChild>
                            <Button size="sm" className="px-3 cursor-pointer" onClick={handleCopyClick}>
                                <span className="sr-only">Copy</span>
                                <Copy size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            Copied!
                        </TooltipContent>
                    </Tooltip>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            className="cursor-pointer"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

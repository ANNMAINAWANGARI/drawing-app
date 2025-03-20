import React from 'react';
import { Undo2, Redo2, Download, Save, Wand2, Square, Pencil, Share2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"
import type { Layer } from '@/schema/schema';
import ColorPicker from './ColorPicker';
import BrushPreview from './BrushPreview';


interface ToolbarProps {
    color: string;
    strokeWidth: number;
    canUndo: boolean;
    canRedo: boolean;
    layers: Layer[];
    activeLayerId: string;
    onColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
    onUndo: () => void;
    onRedo: () => void;
    onSave: () => void;
    onExport: (format: "react" | "svg" | "png" | "png2x" | "png4x") => void;
    onEnhanceLastStroke: () => void;
    onShare: () => Promise<string>;
}

const Toolbar = ({
    color,
    strokeWidth,
    canUndo,
    canRedo,
    layers,
    activeLayerId,
    onColorChange,
    onStrokeWidthChange,
    onUndo,
    onRedo,
    onSave,
    onExport,
    onEnhanceLastStroke,
    onShare,
  }: ToolbarProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
            <ColorPicker color={color} onColorChange={onColorChange}/>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                       <BrushPreview color={color} strokeWidth={strokeWidth} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>Brush Preview </TooltipContent>
            </Tooltip>
        </div>
    </div>
  )
}

export default Toolbar
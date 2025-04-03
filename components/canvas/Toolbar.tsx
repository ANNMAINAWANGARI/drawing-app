'use client'
import React,{useState} from 'react';
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
  return (
    <div className="flex items-center gap-4 p-2  rounded-lg shadow-sm justify-center bg-zinc-500">
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
        <div className='w-40'>
            <Slider
            value={[strokeWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={(v) => onStrokeWidthChange(v[0])}
            />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant={'outline'}
              size={'icon'}
              disabled={!canUndo}
              onClick={onUndo}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant={'outline'}
              size={'icon'}
              disabled={!canRedo}
              onClick={onRedo}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'outline'} size={'icon'}>
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>{}}>Export as React Component</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{}}>Export as SVG</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{}}>Export as PNG (1x)</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{}}>Export as PNG (2x)</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{}}>Export as PNG (4x)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
               variant="outline"
               size="icon">
                <Wand2 className='h-4 w-4'/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Get AI Suggestions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
              variant="outline"
              size="icon">
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Recognize Shape</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
              variant={'outline'}
              size={'icon'}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enhance Stroke</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant={'outline'}
              size={'icon'}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Drawing</TooltipContent>
          </Tooltip>
        </div>
    </div>
  )
}

export default Toolbar
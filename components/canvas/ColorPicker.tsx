'use client'
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React,{ useCallback, useState } from "react";

const COLORS = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
];
  
interface ColorPickerProps {
    color: string;
    onColorChange: (color: string) => void;
}

const ColorPicker = ({color,onColorChange}:ColorPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleSelect = useCallback((newColor: string) => {
        onColorChange(newColor);
        setIsOpen(false);
      }, [onColorChange]);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="w-10 h-10 p-0"
               style={{ backgroundColor: color }}
            />
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
            <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c)=>(
                    <Button 
                    key={c}
                    className="w-8 h-8 p-0"
                    style={{ backgroundColor: c }}
                    onClick={() => handleSelect(c)}
                    ></Button>
                ))}
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
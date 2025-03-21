'use client'
import {DrawingCanvas} from "@/components/canvas/DrawingCanvas";
import Toolbar from "@/components/canvas/Toolbar";
import { Layer, Path } from "@/schema/schema";
import { useState,useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner"


export default function Home() {
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: nanoid(),
      name: "Layer 1",
      visible: true,
      opacity: 100,
      paths: [],
      shader: "normal",
      shaderStrength: 0
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState(layers[0].id);
  const [undoStack, setUndoStack] = useState<{layerId: string, path: Path}[]>([]);
  const [redoStack, setRedoStack] = useState<{layerId: string, path: Path}[]>([]);
  
  const handlePathComplete = useCallback((path: Path) => {
    if (path.points.length < 2) return;
    setLayers(prev => prev.map(layer =>
      layer.id === activeLayerId
        ? { ...layer, paths: [...layer.paths, path] }
        : layer
    ));
    setRedoStack([]); // Clear redo stack when new path is added
  }, [activeLayerId]);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/**toolbar */}
      <div className="p-2">
        <Toolbar
        color={color}
        onColorChange={setColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}/>
      </div>
      {/**canvas and layer */}
      <div className="flex flex-1 p-2  ">
        <div className="basis-1/3 bg-stone-700">layer section</div>
        <div className="flex-grow  p-2 basis-2/3 ">
           <DrawingCanvas
           ref={canvasRef}
           color={color}
           strokeWidth={strokeWidth}
           layers={layers}
           activeLayerId={activeLayerId}
           onPathComplete={handlePathComplete}/>
        </div>
      </div>
    </div>
  );
}

'use client'
import { drawPath } from '@/lib/drawing';
import { applyShaderEffect } from '@/lib/shaders';
import { Layer, Path, Point } from '@/schema/schema';
import React, {useRef,forwardRef,useEffect,useState} from 'react'


interface DrawingCanvasProps {
    color: string;
    strokeWidth: number;
    layers: Layer[];
    activeLayerId: string;
    onPathComplete: (path: Path) => void;
    readOnly?: boolean;
   
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
function DrawingCanvas ({ color, strokeWidth, layers, activeLayerId, onPathComplete, readOnly = false }, ref)  {
    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || localCanvasRef;
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<Path>({ points: [], color, strokeWidth });
    
    const redrawLayers = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      layers.forEach(layer => {
        if (!layer.visible) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        layer.paths.forEach(path => drawPath(tempCtx, path));

        if (layer.shader !== "normal" && layer.shaderStrength > 0) {
          // Apply the new shader effects
          applyShaderEffect(tempCtx, tempCanvas, layer.shader, {
            strength: layer.shaderStrength,
            time: Date.now() / 1000
          });

          ctx.save();
          ctx.globalAlpha = layer.opacity / 100;
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = layer.opacity / 100;
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.restore();
        }
      });
    };
    useEffect(()=>{
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const handleResize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        redrawLayers();
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },[])

    useEffect(() => {
        redrawLayers();
    }, [layers]);

    //Starts a new path when user presses down
    const handlePointerDown = (e:React.PointerEvent) =>{
        if (readOnly) return;

        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const point: Point = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        setIsDrawing(true);
        setCurrentPath({ points: [point], color, strokeWidth });
    }
    //Adds points to the current path during mouse/touch movement
    const handlePointerMove = (e:React.PointerEvent) =>{
      if (readOnly) return;
      if (!isDrawing || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const point: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const newPath = {
        ...currentPath,
        points: [...currentPath.points, point],
      };

      setCurrentPath(newPath);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        redrawLayers();
        drawPath(ctx, newPath);
      }
    }
    //Completes the path and triggers a callback
    const handlePointerUp = () => {
        if (readOnly) return;
        if (isDrawing) {
          onPathComplete(currentPath);
          setIsDrawing(false);
        }
      };
  return (
    <canvas
    ref={canvasRef}
    className="w-full h-full border border-border rounded-lg bg-background"
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerLeave={handlePointerUp}
    onPointerUp={handlePointerUp}
    style={{
        touchAction: "none",
        cursor: readOnly ? "default" : "crosshair"
    }}/>
  )
})

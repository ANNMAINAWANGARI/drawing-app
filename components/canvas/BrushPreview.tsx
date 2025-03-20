'use client'
import React,{useRef,useEffect} from 'react';
import { cn } from "@/lib/utils";

interface BrushPreviewProps {
    color: string;
    strokeWidth: number;
    className?: string;
}


const BrushPreview = ({ color, strokeWidth, className }: BrushPreviewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number | undefined>(undefined);
    const positionRef = useRef({ x: 0, y: 0 });


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
    
        // Set canvas size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    
        let time = 0;
        const animate = () => {
          time += 0.05;
    
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
    
          // Calculate position
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 20;
    
          positionRef.current = {
            x: centerX + Math.cos(time) * radius,
            y: centerY + Math.sin(time) * radius
          };
    
          // Draw brush preview
          ctx.beginPath();
          ctx.arc(positionRef.current.x, positionRef.current.y, strokeWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
    
          frameRef.current = requestAnimationFrame(animate);
        };
    
        animate();
    
        return () => {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
          }
        };
      }, [color, strokeWidth]);
    
  return (
    <canvas
      ref={canvasRef}
      className={cn("w-20 h-20 rounded-lg border border-border", className)}
      title="Brush Preview"
    />
  )
}

export default BrushPreview
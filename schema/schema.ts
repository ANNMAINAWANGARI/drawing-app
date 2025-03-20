import { z } from "zod";
import type { ShaderType } from "@/types/shaders";

export const pointSchema = z.object({
    x: z.number(),
    y: z.number(),
});

export type Point = z.infer<typeof pointSchema>;

// Define Path schema and type
export const pathSchema = z.object({
    points: z.array(pointSchema),
    color: z.string(),
    strokeWidth: z.number(),
  });
export type Path = z.infer<typeof pathSchema>;
  
// Define Layer schema and type
export const layerSchema = z.object({
    id: z.string(),
    name: z.string(),
    visible: z.boolean(),
    opacity: z.number(),
    paths: z.array(pathSchema),
    shader: z.custom<ShaderType>(),
    shaderStrength: z.number(),
});

export type Layer = z.infer<typeof layerSchema>;

// Define DrawingContent schema and type
export const drawingContentSchema = z.object({
  layers: z.array(layerSchema),
  activeLayerId: z.string(),
});
export type DrawingContent = z.infer<typeof drawingContentSchema>;

// Define Drawing schema and type
export const drawingSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: drawingContentSchema,
});
export type Drawing = z.infer<typeof drawingSchema>;

// Define schema for inserting new drawings
export const insertDrawingSchema = z.object({
    name: z.string(),
    content: drawingContentSchema,
});
export type InsertDrawing = z.infer<typeof insertDrawingSchema>;
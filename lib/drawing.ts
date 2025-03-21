import { Path } from "@/schema/schema";


export function drawPath(ctx: CanvasRenderingContext2D, path: Path) {
    if (path.points.length < 2) return;
  
    ctx.beginPath();
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  
    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
  }
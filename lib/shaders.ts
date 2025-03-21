// WebGL shader utility functions and basic shader collection
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_texCoord;
  }
`;

// Define available shader types
export const shaders = {
  normal: {
    name: "Normal",
  },
  neonGlow: {
    name: "Neon Glow",
  },
  plasma: {
    name: "Plasma",
  },
  matrix: {
    name: "Matrix Rain",
  },
  kaleidoscope: {
    name: "Kaleidoscope",
  },
  psychedelic: {
    name: "Psychedelic",
  },
  glitch: {
    name: "Glitch",
  },
  liquid:{
    name:"Liquid"
  },
  sandy:{
    name:"Sandy"
  },
  pixelate:{
    name:'Pixelate'
  },
  ripple:{
    name:"Ripple"
  }
};

export type ShaderType = keyof typeof shaders;

export type ShaderParams = {
  strength?: number;
  time?: number;
};

function applyNeonGlowEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const s = strength / 50;
  ctx.shadowBlur = 20 * s;
  ctx.shadowColor = "rgba(0, 255, 255, 0.8)";

  // Create a temporary canvas for the original content
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(canvas, 0, 0);

  // Clear and redraw with glow
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  // Add colored edge detection
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    if (brightness > 100) {
      pixels[i] = Math.min(255, pixels[i] + 100 * s);
      pixels[i + 1] = Math.min(255, pixels[i + 1] + 150 * s);
      pixels[i + 2] = Math.min(255, pixels[i + 2] + 255 * s);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyPlasmaEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const time = Date.now() / 1000;
  const s = strength / 50;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;

      const plasma = Math.sin(x / 10 * s + time) 
                  + Math.sin(y / 10 * s + time)
                  + Math.sin((x + y) / 10 * s + time)
                  + Math.sin(Math.sqrt(x * x + y * y) / 10);

      const r = Math.sin(plasma * Math.PI) * 255;
      const g = Math.cos(plasma * Math.PI) * 255;
      const b = Math.sin(plasma * Math.PI + time) * 255;

      pixels[idx] = Math.min(255, pixels[idx] + r * s);
      pixels[idx + 1] = Math.min(255, pixels[idx + 1] + g * s);
      pixels[idx + 2] = Math.min(255, pixels[idx + 2] + b * s);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyMatrixEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const time = Date.now() / 1000;
  const s = strength / 50;

  const columns = Math.floor(canvas.width / 20);
  const dropSpeeds = new Array(columns).fill(0).map(() => Math.random() * 5 + 1);

  for (let x = 0; x < canvas.width; x++) {
    const col = Math.floor(x / 20);
    const offset = (time * dropSpeeds[col]) % canvas.height;

    for (let y = 0; y < canvas.height; y++) {
      const idx = (y * canvas.width + x) * 4;
      const yPos = (y + offset) % canvas.height;

      if (Math.random() < 0.1 * s) {
        pixels[idx] = 0;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 0;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyKaleidoscopeEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const segments = Math.floor(strength / 10) + 2;
  const angle = (Math.PI * 2) / segments;

  // Create a temporary canvas for the transformed image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d')!;

  // Draw the original image
  tempCtx.drawImage(canvas, 0, 0);

  // Clear the main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw kaleidoscope segments
  for (let i = 0; i < segments; i++) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * i);
    ctx.drawImage(tempCanvas, -centerX, -centerY);
    ctx.restore();
  }
}

function applyPsychedelicEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const time = Date.now() / 1000;
  const s = strength / 50;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;

      const wave = Math.sin(x / 20 + time * 2) * Math.cos(y / 20 + time * 2) * s;
      const hueShift = (Math.sin(time) + 1) * 180 * s;

      // Convert RGB to HSL, shift hue, convert back to RGB
      const r = pixels[idx] / 255;
      const g = pixels[idx + 1] / 255;
      const b = pixels[idx + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        h = r === max ? (g - b) / (max - min) : 
            g === max ? 2 + (b - r) / (max - min) : 
            4 + (r - g) / (max - min);
      }

      h = ((h * 60 + hueShift) + 360) % 360;

      // Apply wave distortion
      pixels[idx] += wave * 255;
      pixels[idx + 1] += wave * 255;
      pixels[idx + 2] += wave * 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyGlitchEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const s = strength / 50;
  const numGlitches = Math.floor(s * 20);
  const time = Date.now() / 1000;

  // Create a temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(canvas, 0, 0);

  // Clear original canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);

  // Apply random glitch effects
  for (let i = 0; i < numGlitches; i++) {
    // Random slice
    const sliceY = Math.random() * canvas.height;
    const sliceHeight = Math.random() * 50 * s + 10;
    const offset = (Math.random() - 0.5) * 100 * s;

    // RGB shift
    ctx.drawImage(tempCanvas, 
      0, sliceY, canvas.width, sliceHeight,  // source
      offset, sliceY, canvas.width, sliceHeight // destination
    );

    // Color channel splitting
    if (Math.random() < 0.5) {
      const imageData = ctx.getImageData(0, sliceY, canvas.width, sliceHeight);
      const pixels = imageData.data;

      for (let j = 0; j < pixels.length; j += 4) {
        // Randomly shift color channels
        if (Math.random() < 0.1) {
          const temp = pixels[j];
          pixels[j] = pixels[j + 1];
          pixels[j + 1] = pixels[j + 2];
          pixels[j + 2] = temp;
        }
      }

      ctx.putImageData(imageData, Math.random() * 10 - 5, sliceY);
    }
  }

  // Add noise
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (Math.random() < 0.1 * s) {
      pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.random() * 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyLiquidEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const time = Date.now() / 1000;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Calculate displacement
      const displacement = Math.sin(x / 20 + time) * Math.cos(y / 20 + time) * strength;

      // Get source coordinates with displacement
      const sourceX = Math.floor(x + displacement);
      const sourceY = Math.floor(y + displacement);

      // Ensure we stay within bounds
      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;

        // Copy pixel data
        pixels[targetIndex] = pixels[sourceIndex];
        pixels[targetIndex + 1] = pixels[sourceIndex + 1];
        pixels[targetIndex + 2] = pixels[sourceIndex + 2];
        pixels[targetIndex + 3] = pixels[sourceIndex + 3];
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applySandyEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * strength;
    pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyPixelateEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const size = Math.max(2, Math.floor(strength / 5));
  const w = canvas.width;
  const h = canvas.height;

  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const pixel = ctx.getImageData(x, y, 1, 1);
      ctx.fillStyle = `rgba(${pixel.data[0]},${pixel.data[1]},${pixel.data[2]},${pixel.data[3]})`;
      ctx.fillRect(x, y, size, size);
    }
  }
}


function applyRippleEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, strength: number) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const time = Date.now() / 1000;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const distance = Math.sqrt(
        Math.pow(x - canvas.width / 2, 2) + 
        Math.pow(y - canvas.height / 2, 2)
      );

      const displacement = Math.sin(distance / 10 - time * 5) * strength;

      const sourceX = Math.floor(x + displacement);
      const sourceY = Math.floor(y + displacement);

      if (sourceX >= 0 && sourceX < canvas.width && sourceY >= 0 && sourceY < canvas.height) {
        const targetIndex = (y * canvas.width + x) * 4;
        const sourceIndex = (sourceY * canvas.width + sourceX) * 4;

        pixels[targetIndex] = pixels[sourceIndex];
        pixels[targetIndex + 1] = pixels[sourceIndex + 1];
        pixels[targetIndex + 2] = pixels[sourceIndex + 2];
        pixels[targetIndex + 3] = pixels[sourceIndex + 3];
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function applyShaderEffect(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  type: ShaderType,
  params: ShaderParams = {}
): void {
  const strength = params.strength || 0;

  switch (type) {
    case "liquid":
      applyLiquidEffect(ctx, canvas, strength);
      break;
    case "sandy":
      applySandyEffect(ctx, canvas, strength);
      break;
    case "pixelate":
      applyPixelateEffect(ctx, canvas, strength);
      break;
    case "glitch":
      applyGlitchEffect(ctx, canvas, strength);
      break;
    case "ripple":
      applyRippleEffect(ctx, canvas, strength);
      break;
    case "neonGlow":
      applyNeonGlowEffect(ctx, canvas, strength);
      break;
    case "plasma":
      applyPlasmaEffect(ctx, canvas, strength);
      break;
    case "matrix":
      applyMatrixEffect(ctx, canvas, strength);
      break;
    case "kaleidoscope":
      applyKaleidoscopeEffect(ctx, canvas, strength);
      break;
    case "psychedelic":
      applyPsychedelicEffect(ctx, canvas, strength);
      break;
  }
}
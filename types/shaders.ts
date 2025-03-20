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
    }
};
export type ShaderType = keyof typeof shaders;
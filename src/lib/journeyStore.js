// A tiny mutable store the GSAP ScrollTrigger writes into, and the R3F
// bottle reads from inside useFrame. Kept outside React state so the 3D
// scene never re-renders on scroll — only the animation frame updates.

export const journey = {
  progress: 0, // 0 -> 1 across the whole page
  reducedMotion: false,
};

export const SCENES = [
  { key: "hero", from: 0.0, to: 0.1, label: "PARTY STOP" },
  { key: "rotate", from: 0.1, to: 0.22, label: "PARTY STOP" },
  { key: "beer", from: 0.22, to: 0.34, label: "COLD BEER" },
  { key: "wine", from: 0.34, to: 0.44, label: "WINE SELECTION" },
  { key: "liquor", from: 0.44, to: 0.55, label: "LIQUOR" },
  { key: "spin", from: 0.55, to: 0.68, label: "LIQUOR" },
  { key: "essentials", from: 0.68, to: 0.82, label: "PARTY ESSENTIALS" },
  { key: "about", from: 0.82, to: 0.92, label: "PARTY ESSENTIALS" },
  { key: "location", from: 0.92, to: 1.0, label: "PARTY STOP" },
];

export function sceneForProgress(p) {
  for (const s of SCENES) {
    if (p >= s.from && p <= s.to) return s;
  }
  return SCENES[SCENES.length - 1];
}

// Remap a value from [inMin,inMax] to [outMin,outMax], clamped.
export function clampMap(v, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = Math.min(1, Math.max(0, (v - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

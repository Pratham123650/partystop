export const journey = { progress: 0, reducedMotion: false };

export function clampMap(value, inMin, inMax, outMin, outMax) {
  const progress = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
  return outMin + progress * (outMax - outMin);
}

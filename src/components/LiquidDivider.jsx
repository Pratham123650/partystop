import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';

/**
 * Amber "pour" transition between the dark alcohol side of the site
 * and the warm cream everyday-essentials side. Pure SVG masking —
 * no expensive fluid simulation.
 */
export default function LiquidDivider() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ld-cream',
        { attr: { d: wavePath(0.15) } },
        {
          attr: { d: wavePath(1) },
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 90%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        }
      );
      gsap.fromTo(
        '.ld-amber',
        { attr: { d: wavePath(0.05) } },
        {
          attr: { d: wavePath(0.9) },
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 90%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <svg
      ref={root}
      className="liquid-divider"
      viewBox="0 0 1440 190"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="amber ld-amber" d={wavePath(reduced ? 0.9 : 0.05)} />
      <path className="ld-cream" d={wavePath(reduced ? 1 : 0.15)} />
    </svg>
  );
}

/** Wave that rises with progress p (0..1) from the bottom of the box */
function wavePath(p) {
  const y = 190 - p * 190;
  const amp = 26 * (1 - Math.abs(p - 0.5) * 1.2);
  return `M0 ${y + amp} C 240 ${y - amp}, 480 ${y + amp}, 720 ${y} C 960 ${
    y - amp
  }, 1200 ${y + amp}, 1440 ${y - amp / 2} L1440 190 L0 190 Z`;
}

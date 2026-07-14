import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion, useIsMobile } from '../lib/hooks.js';

const BALLS = [
  { n: 7, cls: 'blue', size: 150, x: '12%', y: '18%', depth: 1 },
  { n: 23, cls: 'burgundy', size: 110, x: '78%', y: '14%', depth: 1.5 },
  { n: 44, cls: 'amber', size: 90, x: '68%', y: '66%', depth: 0.8 },
  { n: 12, cls: 'cream', size: 130, x: '18%', y: '64%', depth: 1.2 },
  { n: 31, cls: 'blue blur', size: 70, x: '48%', y: '10%', depth: 2 },
  { n: 8, cls: 'burgundy blur', size: 60, x: '88%', y: '46%', depth: 2.2 },
];

/**
 * Lottery moment: numbered circles drift with depth as you scroll,
 * then one warm-cream ball grows to fill the viewport and becomes
 * the background of the next (ivory) section.
 */
export default function Lottery() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const pinned = !reduced && !isMobile;

  useEffect(() => {
    if (!pinned) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
        defaults: { ease: 'none' },
      });

      root.current.querySelectorAll('.lotto-ball[data-depth]').forEach((b) => {
        const d = parseFloat(b.dataset.depth);
        tl.fromTo(
          b,
          { y: 60 * d, rotation: -4 * d },
          { y: -90 * d, rotation: 4 * d, duration: 0.9 },
          0
        );
      });

      tl.fromTo(
        '.lottery__copy',
        { y: 40 },
        { y: -30, duration: 0.7 },
        0
      ).to('.lottery__copy', { opacity: 0, duration: 0.15 }, 0.62);

      // The hero ball approaches the camera and fills the viewport
      tl.fromTo(
        '.lotto-ball--hero',
        { scale: 1, xPercent: -50, yPercent: -50 },
        { scale: 30, duration: 0.35, ease: 'power2.in' },
        0.62
      ).to('.lotto-ball--hero .n', { opacity: 0, duration: 0.08 }, 0.66);
    }, root);
    return () => ctx.revert();
  }, [pinned]);

  return (
    <section
      className={`lottery ${pinned ? '' : 'lottery--static'}`}
      ref={root}
      style={pinned ? { height: '220vh' } : undefined}
      aria-label="Lottery at Party Stop"
    >
      <div className="lottery__sticky">
        {BALLS.map((b) => (
          <div
            key={b.n}
            data-depth={b.depth}
            className={`lotto-ball ${b.cls
              .split(' ')
              .map((c) => `lotto-ball--${c}`)
              .join(' ')}`}
            style={{
              width: b.size,
              height: b.size,
              left: b.x,
              top: b.y,
              fontSize: b.size,
            }}
            aria-hidden="true"
          >
            <span className="n">{b.n}</span>
          </div>
        ))}

        {pinned && (
          <div
            className="lotto-ball lotto-ball--cream lotto-ball--hero"
            style={{
              width: 170,
              height: 170,
              left: '50%',
              top: '72%',
              fontSize: 170,
            }}
            aria-hidden="true"
          >
            <span className="n">17</span>
          </div>
        )}

        <div className="lottery__copy">
          <p className="label">Feeling Lucky?</p>
          <h2 className="headline" style={{ marginTop: 16 }}>
            Maybe today&rsquo;s
            <br />
            the <em>day.</em>
          </h2>
          <p>Michigan Lottery tickets available in store.</p>
        </div>
      </div>
    </section>
  );
}

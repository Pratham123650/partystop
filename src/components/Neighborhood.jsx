import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import { withBasePath } from '../lib/assetPath.js';

/**
 * REPLACEABLE IMAGE: drop the real storefront photo at
 * public/storefront.jpg (high resolution, landscape). Until then a
 * branded panel is shown instead — never a broken image.
 */
export default function Neighborhood() {
  const root = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hood__media',
        { clipPath: 'inset(6% 26% 6% 26% round 22px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 22px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hood__media',
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }
      );
      gsap.fromTo(
        root.current.querySelectorAll('[data-fade]'),
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="hood" ref={root}>
      <div className="container">
        <header className="hood__head">
          <p className="label" data-fade>
            Allen Park
          </p>
          <h2 className="headline" style={{ marginTop: 18 }} data-fade>
            Your neighborhood <em>stop.</em>
          </h2>
          <p className="lede" data-fade>
            Party Stop brings drinks, snacks, lottery, groceries, and everyday
            essentials together in one convenient Allen Park location.
          </p>
        </header>

        <div className="hood__media">
          {hasPhoto ? (
            <img
              src={withBasePath('/storefront.jpg')}
              alt="The Party Stop storefront on Allen Road in Allen Park, Michigan"
              loading="lazy"
              onError={() => setHasPhoto(false)}
            />
          ) : (
            <div className="hood__placeholder">
              <div className="inner">
                <span className="wordmark">
                  <span className="wordmark__arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="wordmark__party">Party</span>
                  <span className="wordmark__stop">Stop</span>
                  <span className="wordmark__arrow" aria-hidden="true">
                    ←
                  </span>
                </span>
                <p className="addr">7235 Allen Rd · Allen Park, MI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

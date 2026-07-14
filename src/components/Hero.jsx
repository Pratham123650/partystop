import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion, useMediaQuery } from '../lib/hooks.js';
import { STORE } from '../lib/constants.js';
import StaticBottle from './StaticBottle.jsx';

const BottleScene = lazy(() => import('../three/BottleScene.jsx'));

/**
 * Motion tiers:
 *  - desktop  (>=1024px): full pinned bottle-to-amber transition, pointer tilt
 *  - tablet   (768-1023): shorter pin, no pointer effects
 *  - mobile   (<768px): no pinning - entrance rotation + light scroll turn
 */
export default function Hero({ ready }) {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const copyRef = useRef(null);
  const bottleRef = useRef(null);
  const veilRef = useRef(null);
  const progressRef = useRef(0);
  const bottleApi = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const pinned = !reduced && !isMobile;

  // Entrance once the loader hands off
  useEffect(() => {
    if (!ready || !copyRef.current || reduced) return;
    const els = copyRef.current.querySelectorAll('[data-rise]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.09,
          ease: 'power3.out',
          delay: 0.05,
        }
      );
    });
    return () => ctx.revert();
  }, [ready, reduced]);

  // Signature scroll transition (desktop full / tablet shortened)
  useEffect(() => {
    if (!pinned) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            bottleApi.current?.invalidate();
          },
        },
        defaults: { ease: 'none' },
      });
      tl.to(copyRef.current, { y: -110, opacity: 0, duration: 0.3 }, 0.06)
        .fromTo(
          veilRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: 'power2.inOut' },
          0.44
        )
        .to(bottleRef.current, { opacity: 0, duration: 0.08 }, 0.7)
        .to(
          stickyRef.current,
          { backgroundColor: '#263C32', backgroundImage: 'none', duration: 0.05 },
          0.72
        )
        .to(veilRef.current, { opacity: 0, duration: 0.22, ease: 'power2.out' }, 0.78);
    }, wrapRef);
    return () => ctx.revert();
  }, [pinned, isTablet]);

  // Mobile / reduced motion: gentle 6-10 degree turn while scrolling away
  useEffect(() => {
    if (pinned || reduced) return;
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: '+=70%',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress * 0.22;
        bottleApi.current?.invalidate();
      },
    });
    return () => st.kill();
  }, [pinned, reduced]);

  const wrapHeight = pinned ? (isTablet ? '180vh' : '260vh') : undefined;

  return (
    <section
      className={`hero ${pinned ? '' : 'hero--static'}`}
      ref={wrapRef}
      style={wrapHeight ? { height: wrapHeight } : undefined}
      aria-label="Welcome to Party Stop"
    >
      <div className="hero__sticky" ref={stickyRef}>
        <div className="hero__inner">
          <div className="hero__copy" ref={copyRef}>
            <p className="label hero__label" data-rise>
              Allen Park, Michigan
            </p>
            <h1 className="hero__title headline">
              <span className="line">
                <span data-rise>Your first stop</span>
              </span>
              <span className="line">
                <span data-rise>
                  for a <em>good night.</em>
                </span>
              </span>
            </h1>
            <p className="hero__sub" data-rise>
              Beer, wine, spirits, cold drinks, snacks, lottery, and everyday
              essentials—all in one neighborhood stop.
            </p>
            <div className="hero__actions" data-rise>
              <a
                className="btn btn--primary"
                href={STORE.directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions <span className="btn__arrow">→</span>
              </a>
              <a className="btn btn--ghost" href={STORE.phoneHref}>
                Call the Store
              </a>
            </div>
          </div>

          <div className="hero__bottle" ref={bottleRef}>
            <Suspense fallback={<StaticBottle />}>
              <BottleScene
                progressRef={progressRef}
                apiRef={bottleApi}
                interactive={!isMobile && !isTablet && !reduced}
                quality={isMobile ? 'lite' : 'high'}
              />
            </Suspense>
          </div>
        </div>

        <div className="hero__arrows" aria-hidden="true">
          <span className="a">↓</span>
          <span className="a">↓</span>
          <span>SCROLL</span>
        </div>

        <div className="hero__veil" ref={veilRef} aria-hidden="true" />
      </div>
    </section>
  );
}

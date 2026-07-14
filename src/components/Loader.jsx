import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';

/**
 * Cinematic opening: green screen → amber reflection → bottle silhouette
 * edge → light sweep reveals the wordmark → amber fills the viewport and
 * hands off to the hero. Plays once per session (sessionStorage).
 */
export default function Loader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.body.classList.add('no-scroll');

    // `handoff` fires as the final fade begins, so the hero entrance is
    // already underway when the loader reveals it — one continuous shot.
    const handoff = () => doneRef.current?.();
    const finish = () => {
      document.body.classList.remove('no-scroll');
      setGone(true);
    };

    const seen = sessionStorage.getItem('ps-loader-played');

    // Repeat visit in the same session, or reduced motion: short branded fade.
    if (seen || reduced) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        el.querySelector('.loader__mark'),
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
        .to(el.querySelector('.loader__mark'), {
          opacity: 0,
          duration: 0.35,
          delay: 0.35,
          ease: 'power2.out',
        })
        .to(el, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          onStart: handoff,
        }, '-=0.1');
      return () => tl.kill();
    }

    sessionStorage.setItem('ps-loader-played', '1');

    const q = (s) => el.querySelector(s);
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: finish,
    });

    // SCENE 1 — thin amber reflection
    tl.fromTo(
      q('.loader__line'),
      { opacity: 0, scaleY: 0.2 },
      { opacity: 1, scaleY: 1, duration: 0.45 }
    );

    // SCENE 2 — reflection widens; bottle shoulder edge appears
    tl.to(q('.loader__line'), { scaleX: 5, opacity: 0.5, duration: 0.35 }, 0.4)
      .fromTo(
        q('.loader__bottle'),
        { opacity: 0, clipPath: 'inset(0 49% 0 49%)' },
        { opacity: 1, clipPath: 'inset(0 26% 0 26%)', duration: 0.45 },
        0.5
      )
      .to(q('.loader__line'), { opacity: 0, duration: 0.25 }, 0.7);

    // SCENE 3 — light sweep reveals label + arrows move inward
    tl.to(
      q('.loader__bottle'),
      { clipPath: 'inset(0 0% 0 0%)', duration: 0.5, ease: 'power2.inOut' },
      0.85
    )
      .to(q('.loader__sweep'), { x: '220%', duration: 0.7, ease: 'power2.inOut' }, 0.85)
      .fromTo(
        q('.loader__mark'),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45 },
        1.0
      )
      .fromTo(
        q('.loader__mark .arrow--l'),
        { x: -14 },
        { x: 0, duration: 0.5 },
        1.0
      )
      .fromTo(
        q('.loader__mark .arrow--r'),
        { x: 14 },
        { x: 0, duration: 0.5 },
        1.0
      );

    // SCENE 4 — camera into the amber glass; hand off to hero
    tl.to(
      q('.loader__bottle'),
      { scale: 2.6, y: 60, duration: 0.7, ease: 'power4.inOut' },
      1.55
    )
      .to(q('.loader__mark'), { opacity: 0, duration: 0.25 }, 1.55)
      .to(
        q('.loader__veil'),
        { clipPath: 'circle(120% at 50% 46%)', duration: 0.65, ease: 'power4.inOut' },
        1.65
      )
      .to(
        el,
        { opacity: 0, duration: 0.5, ease: 'power2.out', onStart: handoff },
        2.25
      );

    return () => tl.kill();
  }, [reduced]);

  if (gone) return null;

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__grain" />
      <div className="loader__stage">
        <div className="loader__line" />
        <svg
          className="loader__bottle"
          viewBox="0 0 120 260"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ldrGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a3a10" />
              <stop offset="0.42" stopColor="#c88a2d" />
              <stop offset="0.58" stopColor="#e0a94f" />
              <stop offset="1" stopColor="#7a4d14" />
            </linearGradient>
          </defs>
          <path
            d="M50 12 h20 v10 c0 3 -2 5 -2 8 v22 c0 12 18 20 18 42 v144 a12 12 0 0 1 -12 12 H46 a12 12 0 0 1 -12 -12 V94 c0 -22 18 -30 18 -42 V30 c0 -3 -2 -5 -2 -8 z"
            fill="url(#ldrGlass)"
          />
          <rect x="48" y="6" width="24" height="12" rx="3" fill="#1b1c1a" />
          <rect x="38" y="132" width="44" height="58" rx="3" fill="#f5f0e7" />
          <text
            x="60"
            y="158"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="10"
            fill="#7c292d"
          >
            PARTY
          </text>
          <text
            x="60"
            y="172"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="10"
            fill="#264d73"
          >
            STOP
          </text>
        </svg>
        <div className="loader__sweep" />
        <div className="loader__mark">
          <span className="arrow arrow--l" aria-hidden="true">
            →
          </span>
          <span>PARTY STOP</span>
          <span className="arrow arrow--r" aria-hidden="true">
            ←
          </span>
        </div>
      </div>
      <div className="loader__veil" />
    </div>
  );
}

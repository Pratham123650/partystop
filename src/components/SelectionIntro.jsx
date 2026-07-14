import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../lib/hooks.js';

const CATS = [
  {
    id: 'beer',
    name: 'Beer',
    desc: 'Domestics, imports, and local Michigan favorites—always cold.',
    art: 'beer',
  },
  {
    id: 'wine',
    name: 'Wine',
    desc: 'Reds, whites, and everything worth opening tonight.',
    art: 'wine',
  },
  {
    id: 'spirits',
    name: 'Spirits',
    desc: 'Whiskey, vodka, tequila, cognac, and beyond.',
    art: 'spirits',
  },
  {
    id: 'cold',
    name: 'Cold Drinks',
    desc: 'Mixers, sodas, energy, and water—ready to go.',
    art: 'cold',
  },
];

/* Simple abstract glassware silhouettes per category */
function Glassware({ type }) {
  const common = { fill: 'none', stroke: 'rgba(251,249,245,0.5)', strokeWidth: 2.5 };
  return (
    <svg className="cat-panel__glass" viewBox="0 0 120 200" aria-hidden="true">
      {type === 'beer' && (
        <g {...common}>
          <path d="M35 40 h44 v120 a8 8 0 0 1 -8 8 H43 a8 8 0 0 1 -8 -8 z" />
          <path d="M79 60 h14 a8 8 0 0 1 8 8 v40 a8 8 0 0 1 -8 8 h-14" />
          <path d="M35 58 h44" opacity="0.5" />
        </g>
      )}
      {type === 'wine' && (
        <g {...common}>
          <path d="M38 30 h44 c0 40 -8 56 -22 60 c-14 -4 -22 -20 -22 -60 z" />
          <path d="M60 90 v58 M40 158 h40" />
          <path d="M42 52 h36" opacity="0.5" />
        </g>
      )}
      {type === 'spirits' && (
        <g {...common}>
          <path d="M42 24 h36 v14 c0 6 10 10 10 26 v92 a10 10 0 0 1 -10 10 H42 a10 10 0 0 1 -10 -10 V64 c0 -16 10 -20 10 -26 z" />
          <rect x="44" y="92" width="32" height="40" rx="2" opacity="0.6" />
        </g>
      )}
      {type === 'cold' && (
        <g {...common}>
          <path d="M40 34 l6 130 a8 8 0 0 0 8 7 h12 a8 8 0 0 0 8 -7 l6 -130 z" />
          <path d="M44 70 h32" opacity="0.5" />
          <path d="M74 34 l10 -16" />
        </g>
      )}
    </svg>
  );
}

export default function SelectionIntro() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const panels = root.current.querySelectorAll('.cat-panel');
    const triggers = [];
    panels.forEach((panel, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      );
    });

    let ctx;
    if (!reduced) {
      ctx = gsap.context(() => {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { clipPath: 'inset(0 0 26% 0 round 18px)', y: 40, opacity: 0.4 },
            {
              clipPath: 'inset(0 0 0% 0 round 18px)',
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: { trigger: panel, start: 'top 82%' },
            }
          );
        });
        gsap.fromTo(
          root.current.querySelectorAll('.selection__head > *'),
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          }
        );
      }, root);
    }
    return () => {
      triggers.forEach((t) => t.kill());
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section className="selection" id="selection" ref={root}>
      <div className="container">
        <header className="selection__head">
          <p className="label">The Selection</p>
          <h2 className="headline" style={{ marginTop: 18 }}>
            Something for
            <br />
            every <em>pour.</em>
          </h2>
          <p className="lede">
            Explore Party Stop&rsquo;s selection of beer, wine, spirits, and
            cold drinks.
          </p>
        </header>

        <div className="selection__body">
          <ol className="selection__index" aria-hidden="true">
            {CATS.map((c, i) => (
              <li key={c.id} className={i === active ? 'active' : ''}>
                <span className="num">0{i + 1}</span>
                <span className="dash" />
                <span>{c.name.toUpperCase()}</span>
              </li>
            ))}
          </ol>

          <div className="selection__panels">
            {CATS.map((c, i) => (
              <article
                key={c.id}
                className={`cat-panel ${i === active ? 'cat-panel--active' : ''}`}
              >
                <div className={`cat-panel__art cat-panel__art--${c.art}`} />
                <Glassware type={c.art} />
                <div className="cat-panel__inner">
                  <span className="cat-panel__num">0{i + 1}</span>
                  <h3 className="cat-panel__name">{c.name}</h3>
                  <p className="cat-panel__desc">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

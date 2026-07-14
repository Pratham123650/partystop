import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';

const FEATURES = [
  { name: 'Snacks', hint: 'Chips, candy & more' },
  { name: 'Groceries', hint: 'Milk, bread, butter' },
  { name: 'Pet Food', hint: 'For the one waiting at home' },
  { name: 'Household Essentials', hint: 'Foil, paper goods & basics' },
];

export default function Essentials() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Copy reveal
      gsap.fromTo(
        root.current.querySelectorAll('[data-fade]'),
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.09,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );

      // Still-life assembly — calm, professional placement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.still-life',
          start: 'top 80%',
          end: 'top 25%',
          scrub: 0.6,
        },
        defaults: { ease: 'power3.out' },
      });
      tl.fromTo('#sl-bread', { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
        .fromTo('#sl-milk', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.25)
        .fromTo('#sl-pet', { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.5)
        .fromTo(
          '#sl-foil',
          { rotation: -10, y: 28, opacity: 0, transformOrigin: '50% 50%' },
          { rotation: 0, y: 0, opacity: 1, duration: 0.8 },
          0.75
        )
        .fromTo(
          ['#sl-snack1', '#sl-snack2'],
          { y: 42, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
          1
        );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="essentials" id="essentials" ref={root}>
      <div className="container essentials__grid">
        <div>
          <p className="label" data-fade>
            More Than Drinks
          </p>
          <h2 className="headline" style={{ marginTop: 18 }} data-fade>
            The things you forgot
            <br />
            on the way <em>home.</em>
          </h2>
          <p className="lede" data-fade>
            Snacks, groceries, pet food, and everyday household
            essentials—because sometimes one stop should actually be enough.
          </p>
          <ul className="essentials__list" data-fade>
            {FEATURES.map((f, i) => (
              <li key={f.name}>
                <span className="num">0{i + 1}</span>
                <span>{f.name}</span>
                <span className="hint">{f.hint}</span>
              </li>
            ))}
          </ul>
        </div>

        <StillLife />
      </div>
    </section>
  );
}

/** Editorial still-life of generic, unbranded everyday products */
function StillLife() {
  return (
    <svg
      className="still-life"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Still life of everyday essentials: a grocery bag, bread, milk, pet food, foil, and snacks"
    >
      <defs>
        <linearGradient id="slBag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfae78" />
          <stop offset="0.5" stopColor="#dfc394" />
          <stop offset="1" stopColor="#c6a26a" />
        </linearGradient>
        <linearGradient id="slFoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e8e6" />
          <stop offset="0.5" stopColor="#b9bcbe" />
          <stop offset="1" stopColor="#d7d8d6" />
        </linearGradient>
        <linearGradient id="slMilk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eee9dd" />
        </linearGradient>
        <linearGradient id="slBackdrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe7d6" />
          <stop offset="1" stopColor="#e6dbc2" />
        </linearGradient>
      </defs>

      {/* backdrop + table */}
      <rect x="40" y="30" width="720" height="470" rx="18" fill="url(#slBackdrop)" />
      <rect x="40" y="470" width="720" height="30" rx="8" fill="#d3c3a0" />

      {/* soft shadows */}
      <ellipse cx="330" cy="492" rx="150" ry="14" fill="#8a7a58" opacity="0.18" />
      <ellipse cx="560" cy="492" rx="110" ry="12" fill="#8a7a58" opacity="0.15" />
      <ellipse cx="180" cy="494" rx="80" ry="10" fill="#8a7a58" opacity="0.14" />

      {/* bread — rises from the bag */}
      <g id="sl-bread">
        <g transform="rotate(-24 300 270)">
          <ellipse cx="300" cy="270" rx="38" ry="95" fill="#d9a45c" />
          <ellipse cx="290" cy="268" rx="30" ry="88" fill="#e2b16c" />
          <path d="M282 200 l24 14 M276 232 l26 14 M272 264 l26 14 M272 296 l26 14" stroke="#b07f3c" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* grocery bag — anchor of the composition */}
      <g id="sl-bag">
        <path d="M228 300 L252 490 h150 L426 300 z" fill="url(#slBag)" />
        <path d="M228 300 L252 490 h30 L262 300 z" fill="#b9955e" opacity="0.55" />
        <path d="M238 300 h180 l-4 -18 h-172 z" fill="#c6a26a" />
        <path d="M262 300 v-14 M330 300 v-16 M396 300 v-14" stroke="#a5824c" strokeWidth="3" />
        <path d="M290 380 h74" stroke="#a5824c" strokeWidth="3" opacity="0.5" />
        <path d="M320 336 l8 6 8 -6" stroke="#7c292d" strokeWidth="4" fill="none" strokeLinecap="round" />
        <text x="327" y="430" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#7c292d">PARTY STOP</text>
      </g>

      {/* milk — slides in beside the bag */}
      <g id="sl-milk">
        <path d="M432 372 h74 v118 h-74 z" fill="url(#slMilk)" />
        <path d="M432 372 l14 -30 h46 l14 30 z" fill="#f4f1e8" />
        <path d="M446 342 h46 l-8 18 h-30 z" fill="#264d73" />
        <rect x="432" y="418" width="74" height="26" fill="#264d73" opacity="0.9" />
        <text x="469" y="436" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="14" fill="#fbf9f5">MILK</text>
      </g>

      {/* pet food — reveals from behind the milk */}
      <g id="sl-pet">
        <path d="M524 318 a12 12 0 0 1 12 -12 h84 a12 12 0 0 1 12 12 v172 h-108 z" fill="#263c32" />
        <path d="M524 318 a12 12 0 0 1 12 -12 h22 v184 h-34 z" fill="#1d2f27" />
        <circle cx="582" cy="386" r="30" fill="#f5f0e7" />
        <g fill="#263c32">
          <ellipse cx="582" cy="394" rx="10" ry="8" />
          <circle cx="570" cy="380" r="4.5" />
          <circle cx="582" cy="375" r="4.5" />
          <circle cx="594" cy="380" r="4.5" />
        </g>
        <rect x="546" y="438" width="72" height="18" rx="9" fill="#c88a2d" />
        <text x="582" y="451" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="11" fill="#263c32">PET FOOD</text>
      </g>

      {/* foil — settles into the foreground */}
      <g id="sl-foil">
        <rect x="108" y="452" width="150" height="40" rx="20" fill="url(#slFoil)" />
        <ellipse cx="258" cy="472" rx="12" ry="20" fill="#9fa3a6" />
        <ellipse cx="258" cy="472" rx="5" ry="12" fill="#6d7174" />
        <path d="M118 452 l16 -16 h96 l-14 16 z" fill="#dcdedd" />
        <path d="M118 452 l16 -16" stroke="#aeb2b4" strokeWidth="2" />
      </g>

      {/* snacks — last touch */}
      <g id="sl-snack1">
        <g transform="rotate(6 668 430)">
          <path d="M632 368 q6 -10 0 -18 h72 q-6 8 0 18 l6 116 q-42 14 -84 0 z" fill="#7c292d" />
          <path d="M632 350 h72 q-6 8 0 18 h-72 q6 -10 0 -18" fill="#5f1f23" />
          <ellipse cx="668" cy="428" rx="26" ry="20" fill="#f5f0e7" opacity="0.9" />
          <text x="668" y="433" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="12" fill="#7c292d">CHIPS</text>
        </g>
      </g>
      <g id="sl-snack2">
        <g transform="rotate(-5 508 464)">
          <path d="M482 420 q4 -8 0 -14 h52 q-4 6 0 14 l4 72 q-30 10 -60 0 z" fill="#264d73" />
          <ellipse cx="508" cy="462" rx="18" ry="14" fill="#f5f0e7" opacity="0.9" />
          <text x="508" y="466" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="9" fill="#264d73">SNACK</text>
        </g>
      </g>
    </svg>
  );
}

# Party Stop

An elegant, editorial website for Party Stop at 7235 Allen Rd in Allen Park, Michigan. The experience pairs warm hospitality-inspired design with a restrained procedural 3D house bottle.

## Stack

- React + Vite
- React Three Fiber / Three.js
- GSAP ScrollTrigger + Lenis
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

The Vite base path and package homepage are configured for `Pratham123650/partystop`.

## Content notes

- The address and phone links use 7235 Allen Rd and (313) 928-7580.
- The rating section displays the supplied 4.4 Google rating and 120 reviews without fabricated quotes.
- `public/images/storefront-placeholder.webp` and `public/images/interior-placeholder.webp` are generated editorial placeholders, not documentary photos of the real store. Replace them with real Party Stop photography when available.
- The generic bottle is modeled procedurally and does not copy a commercial alcohol brand. Its premium paper label is wrapped around the bottle at runtime.
- The 3D canvas is lazy-loaded, uses adaptive resolution, and renders on demand. Reduced-motion preferences keep the bottle static, and mobile uses a simplified bottle treatment.

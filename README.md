# Party Stop — Website

A scroll-driven, animated website for Party Stop (7235 Allen Rd, Allen Park, MI),
built around a 3D bottle that travels through the page as you scroll.

**Stack:** React + Vite · React Three Fiber / Three.js (3D bottle) · GSAP
ScrollTrigger (scroll-synced bottle journey) · Framer Motion (UI/interface
animation).

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Deploy to GitHub Pages

This is set up the same way as your other sites:

```bash
npm install
npm run deploy
```

`npm run deploy` builds the site and pushes `dist/` to a `gh-pages` branch via
the `gh-pages` package. Before your first deploy:

1. Push this project to a GitHub repo.
2. In `package.json`, update `"homepage"` to your real GitHub Pages URL,
   e.g. `https://<your-username>.github.io/party-stop`.
3. In GitHub → repo **Settings → Pages**, set the source to the `gh-pages`
   branch (it's created automatically the first time you run `npm run
   deploy`).

`vite.config.js` uses `base: './'` (relative paths), so it works whether the
site lives at the root of a domain or in a subfolder — no path editing needed
there.

## What's built in

- **Loading screen** — PARTY / STOP wordmark with arrow accents, ~1.5–2s, first load only.
- **Age gate** — "I am 21+" / "Exit" modal, remembers the choice in `localStorage` (no birthdate collected).
- **3D bottle** (`src/components/Bottle.jsx`) — a fully custom, generic house-brand
  bottle (glass shader + canvas-drawn label), not modeled on any real alcohol brand.
  Its rotation/position/tilt is driven every frame by scroll progress
  (`src/lib/journeyStore.js` + `src/lib/useScrollJourney.js`), with the label
  text swapping per scene (Cold Beer → Wine Selection → Liquor → Party
  Essentials → Party Stop).
- **Scroll scenes**: Hero → bottle rotation → marquee → "What's Your Stop?"
  categories → 360° spin moment → Party Essentials → About → Gallery →
  Google rating → Location/map → Footer.
- **Sticky nav** that blurs on scroll, plus a full-screen mobile menu.
- **Mobile sticky action bar** (Call / Directions) after the hero.
- Reduced-motion, keyboard focus states, and a static-image fallback if WebGL
  isn't available.

## Content you'll want to fill in

- **Google review link**: `src/components/Reviews.jsx` — the "Read Our
  Google Reviews" button is a placeholder (`href="#"`) until you drop in the
  real Google Business listing URL.
- **Gallery photos**: `src/components/Gallery.jsx` — currently styled
  placeholders ("Storefront," "Beer Aisle," etc.) since no real store photos
  were provided. Swap in real images when you have them.
- **Store hours**: intentionally left out (not in the structured data or
  anywhere on the site) since they weren't provided — ask if you'd like them added.
- **Phone / address** are already wired in from what you gave me (313-928-7580,
  7235 Allen Rd, Allen Park, MI 48101) — used for `tel:` links, the Directions
  links, the embedded map, and the SEO structured data.

## Notes on the 3D bottle

- It's a procedural geometry (Three.js `LatheGeometry`) with a `meshPhysicalMaterial`
  glass shader — no external `.glb` file to manage, so there's nothing to swap
  out or Draco-compress. If you'd rather use a real modeled bottle asset later,
  it's a straightforward swap inside `Bottle.jsx`.
- `AdaptiveDpr` caps resolution on lower-end devices, and the canvas is capped
  at DPR 1.75 to keep frame rate healthy on high-res screens.

# Party Stop — Website

A cinematic, premium single-page website for **Party Stop**, the neighborhood
liquor & convenience store at 7235 Allen Rd, Allen Park, MI 48101.

Built with **React + Vite**, **GSAP ScrollTrigger** (major scroll sequences),
**Framer Motion** (UI transitions), **React Three Fiber / Three.js**
(the signature 3D bottle), and **Lenis** (smooth scrolling, desktop only).

## Run it

```bash
npm install
npm run dev       # local development
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Adding real products

All inventory lives in **`src/data/products.js`** — one central file.
Add an object to the `products` array and it automatically appears in the
right category, in search, and (with `featured: true`) in the Featured
Selection section. Only `id`, `name`, and `category` are required:

```js
{
  id: 'example-bourbon',
  name: 'Small Batch Bourbon',
  brand: 'Example Brand',
  category: 'bourbon',          // ids in CATEGORIES at the top of the file
  image: '/products/example-bourbon.webp',
  size: '750ml',
  price: 39.99,
  featured: true,
}
```

Categories are configured once in `CATEGORIES` in the same file —
add, remove, rename, or reorder them there and the whole UI follows.

Data access goes through `src/services/inventory.js`; swap its `source`
object to point at a REST API, Supabase, Firebase, or a CMS later without
touching any component.

## Adding real photos

- **Product images** → `public/products/<id>.webp` (AVIF/WebP recommended,
  transparent or white background). Missing images fall back to a branded
  placeholder automatically.
- **Storefront photo** → `public/storefront.jpg` (high-res landscape).
- **Gallery photos** → `public/gallery/1.jpg` … `public/gallery/5.jpg`.
  Empty slots show an elegant "photo coming soon" panel, never a broken image.

## Notes

- The cinematic loader plays once per browser session; repeat visits get a
  short branded fade.
- `prefers-reduced-motion` is respected everywhere: pinned camera moves,
  smooth-scroll interpolation, and depth animation are all disabled in
  favor of simple fades.
- No ecommerce: the inventory is a browsing experience; actions are
  **Call for Availability** and **Get Directions** by design.

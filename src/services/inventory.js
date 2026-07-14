/**
 * INVENTORY SERVICE
 * -----------------
 * All product data access goes through this adapter. Today it reads
 * from local data (src/data/products.js). Later it can be swapped to
 * a REST API, Supabase, Firebase, or a headless CMS by replacing the
 * `source` implementation — the UI never touches raw data directly.
 */
import { products as localProducts, CATEGORIES } from '../data/products.js';
import { withBasePath } from '../lib/assetPath.js';

const FALLBACK_IMAGE = withBasePath('/products/fallback.svg');

function normalize(p, i) {
  return {
    id: p.id ?? `product-${i}`,
    name: p.name ?? '',
    brand: p.brand ?? '',
    category: p.category ?? '',
    subcategory: p.subcategory ?? '',
    image: p.image ? withBasePath(p.image) : FALLBACK_IMAGE,
    description: p.description ?? '',
    size: p.size ?? '',
    price: p.price ?? null,
    salePrice: p.salePrice ?? null,
    featured: !!p.featured,
    newArrival: !!p.newArrival,
    staffPick: !!p.staffPick,
    inStock: p.inStock !== false,
    tags: Array.isArray(p.tags) ? p.tags : [],
    displayOrder: p.displayOrder ?? 0,
    placeholder: !!p.placeholder,
  };
}

// Swappable data source. Replace with async fetchers later if needed.
const source = {
  all: () =>
    localProducts
      .map(normalize)
      .sort((a, b) => a.displayOrder - b.displayOrder),
};

export function getProducts() {
  return source.all();
}

export function getFeaturedProducts() {
  return source.all().filter((p) => p.featured);
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return source.all();
  return source.all().filter((p) => p.category === category);
}

export function searchProducts(query, list = source.all()) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => {
    const catLabel =
      CATEGORIES.find((c) => c.id === p.category)?.label ?? p.category;
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      catLabel.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export { CATEGORIES, FALLBACK_IMAGE };

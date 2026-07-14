/**
 * PARTY STOP — CENTRAL PRODUCT DATA
 * ---------------------------------
 * This is the single source of truth for the inventory browser.
 * Add a product object below and it will automatically appear in
 * the correct category, in search, and (if `featured: true`) in
 * the Featured Selection section.
 *
 * Product shape (only `id`, `name`, `category` are required):
 * {
 *   id: 'unique-id',
 *   name: 'Product Name',
 *   brand: 'Brand',
 *   category: 'whiskey',            // one of CATEGORIES ids below
 *   subcategory: 'single-malt',
 *   image: '/products/unique-id.webp',
 *   description: 'Short description.',
 *   size: '750ml',
 *   price: 39.99,
 *   salePrice: 34.99,
 *   featured: false,
 *   newArrival: false,
 *   staffPick: false,
 *   inStock: true,
 *   tags: ['smooth', 'gift'],
 *   displayOrder: 0,
 * }
 */

// Centralized category configuration.
// Add / remove / rename / reorder here — the UI updates everywhere.
export const CATEGORIES = [
  { id: 'beer', label: 'Beer', group: 'drinks' },
  { id: 'wine', label: 'Wine', group: 'drinks' },
  { id: 'whiskey', label: 'Whiskey', group: 'drinks' },
  { id: 'bourbon', label: 'Bourbon', group: 'drinks' },
  { id: 'vodka', label: 'Vodka', group: 'drinks' },
  { id: 'tequila', label: 'Tequila', group: 'drinks' },
  { id: 'rum', label: 'Rum', group: 'drinks' },
  { id: 'cognac', label: 'Cognac', group: 'drinks' },
  { id: 'gin', label: 'Gin', group: 'drinks' },
  { id: 'liqueurs', label: 'Liqueurs', group: 'drinks' },
  { id: 'champagne', label: 'Champagne & Sparkling', group: 'drinks' },
  { id: 'mixers', label: 'Mixers', group: 'drinks' },
  { id: 'cold-drinks', label: 'Cold Drinks', group: 'drinks' },
  { id: 'snacks', label: 'Snacks', group: 'everyday' },
  { id: 'groceries', label: 'Groceries', group: 'everyday' },
  { id: 'pet-food', label: 'Pet Food', group: 'everyday' },
  { id: 'household', label: 'Household Essentials', group: 'everyday' },
];

// The store's real inventory gets added here over time.
// An empty list is handled gracefully by the site.
export const products = [];

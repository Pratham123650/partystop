import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CATEGORIES,
  getProducts,
  searchProducts,
} from '../services/inventory.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';
import { STORE } from '../lib/constants.js';

const PAGE_SIZE = 12;

// Development-only placeholder cards so the layout can be checked
const DEV_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => ({
  id: `ph-${i}`,
  placeholder: true,
}));

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Inventory() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);

  const all = useMemo(() => getProducts(), []);
  const filtered = useMemo(() => {
    const byCat =
      category === 'all' ? all : all.filter((p) => p.category === category);
    return searchProducts(query, byCat);
  }, [all, category, query]);

  const shown = filtered.slice(0, visible);
  const isEmpty = all.length === 0;

  const pick = (id) => {
    setCategory(id);
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="inventory" id="inventory" aria-label="Our selection">
      <div className="container">
        <header className="inventory__head">
          <p className="label">Our Selection</p>
          <h2 className="headline" style={{ marginTop: 18 }}>
            Find your next <em>favorite.</em>
          </h2>
          <p className="lede">
            Explore Party Stop&rsquo;s selection of beer, wine, spirits, and
            more.
          </p>
          <p className="inventory__note">
            Selection may vary. Visit or call the store for current
            availability.
          </p>
        </header>

        {isEmpty && !import.meta.env.DEV ? (
          <div className="inv-empty">
            <h3>Our selection is being updated.</h3>
            <p>
              Visit Party Stop or call us for current availability—we&rsquo;re
              happy to help you find what you need.
            </p>
            <div className="inv-empty__actions">
              <a className="btn btn--light" href={STORE.phoneHref}>
                Call the Store
              </a>
              <a
                className="btn btn--ghost-light"
                href={STORE.directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions <span className="btn__arrow">→</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="inv-toolbar">
              <div className="inv-search">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search our selection"
                  aria-label="Search our selection"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisible(PAGE_SIZE);
                  }}
                />
              </div>
              <div className="inv-cats" role="tablist" aria-label="Product categories">
                {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={category === c.id}
                    className={`inv-cat ${category === c.id ? 'inv-cat--active' : ''}`}
                    onClick={() => pick(c.id)}
                  >
                    {category === c.id && (
                      <motion.span
                        layoutId="inv-cat-pill"
                        className="inv-cat__pill"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {isEmpty ? (
              <div className="inv-grid">
                {DEV_PLACEHOLDERS.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : shown.length > 0 ? (
              <>
                <div className="inv-grid">
                  {shown.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={i < 8 ? { opacity: 0, y: 22 } : false}
                      whileInView={i < 8 ? { opacity: 1, y: 0 } : undefined}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                    >
                      <ProductCard product={p} onSelect={setSelected} />
                    </motion.div>
                  ))}
                </div>
                {filtered.length > visible && (
                  <div className="inv-loadmore">
                    <button
                      className="btn btn--ghost-light"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    >
                      Load More ({filtered.length - visible} more)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="inv-none">
                Nothing matches that search. Try another name, brand, or
                category—or call us at{' '}
                <a href={STORE.phoneHref} style={{ color: 'inherit' }}>
                  {STORE.phoneDisplay}
                </a>
                .
              </p>
            )}
          </>
        )}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

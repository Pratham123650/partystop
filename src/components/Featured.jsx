import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedProducts } from '../services/inventory.js';
import ProductCard from './ProductCard.jsx';
import ProductModal from './ProductModal.jsx';

/**
 * Automatically shows products marked `featured: true`.
 * Hidden entirely in production while no featured products exist;
 * shows a clean explanatory placeholder in development mode.
 */
export default function Featured() {
  const featured = useMemo(() => getFeaturedProducts(), []);
  const [selected, setSelected] = useState(null);

  if (featured.length === 0 && !import.meta.env.DEV) return null;

  return (
    <section className="featured" aria-label="Featured selection">
      <div className="container">
        <p className="label">Featured Selection</p>
        <h2 className="headline" style={{ marginTop: 18, fontSize: 'clamp(34px,4.6vw,60px)' }}>
          Worth picking up <em>tonight.</em>
        </h2>

        {featured.length > 0 ? (
          <div className="featured__row">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} onSelect={setSelected} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="featured__dev">
            DEV NOTE — this section renders automatically once products in
            src/data/products.js are marked <code>featured: true</code>. It is
            hidden from production visitors while empty.
          </div>
        )}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getCategoryLabel, FALLBACK_IMAGE } from '../services/inventory.js';
import { formatPrice } from './ProductCard.jsx';
import { STORE } from '../lib/constants.js';

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.toggle('no-scroll', !!product);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <div
          className="pmodal"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <motion.div
            className="pmodal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="pmodal__panel"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pmodal__media">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  if (e.currentTarget.src.indexOf(FALLBACK_IMAGE) === -1) {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }
                }}
              />
            </div>
            <div className="pmodal__body">
              {product.brand && <p className="pmodal__brand">{product.brand}</p>}
              <h3 className="pmodal__name">{product.name}</h3>
              <div className="pmodal__meta">
                <span className="pmodal__chip">
                  {getCategoryLabel(product.category)}
                </span>
                {product.size && (
                  <span className="pmodal__chip">{product.size}</span>
                )}
                {product.tags.map((t) => (
                  <span className="pmodal__chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              {product.description && (
                <p className="pmodal__desc">{product.description}</p>
              )}
              {(product.price != null || product.salePrice != null) && (
                <p className="pmodal__price">
                  {product.salePrice != null && (
                    <s>{formatPrice(product.price)}</s>
                  )}
                  {formatPrice(product.salePrice ?? product.price)}
                </p>
              )}
              <div className="pmodal__actions">
                <a className="btn btn--primary" href={STORE.phoneHref}>
                  Call for Availability
                </a>
                <a
                  className="btn btn--ghost"
                  href={STORE.directionsHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions <span className="btn__arrow">→</span>
                </a>
              </div>
            </div>
            <button
              className="pmodal__close"
              onClick={onClose}
              aria-label="Close product details"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

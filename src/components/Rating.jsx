import { motion } from 'framer-motion';
import { STORE } from '../lib/constants.js';

function Star({ fill = 1, index = 0 }) {
  const id = `star-${index}-${fill}`;
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset={fill} stopColor="currentColor" />
          <stop offset={fill} stopColor="currentColor" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

export default function Rating() {
  return (
    <section className="rating" aria-label="Google rating">
      <div className="container">
        <motion.p
          className="rating__num"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {STORE.rating}
        </motion.p>
        <div className="rating__stars">
          {[1, 1, 1, 1, 0.4].map((f, i) => (
            <Star key={i} fill={f} index={i} />
          ))}
        </div>
        <p className="rating__meta">
          Google Rating · {STORE.reviewCount} Reviews
        </p>
        <a
          className="btn btn--ghost rating__link"
          href={STORE.reviewsHref}
          target="_blank"
          rel="noreferrer"
        >
          Read Google Reviews <span className="btn__arrow">→</span>
        </a>
      </div>
    </section>
  );
}

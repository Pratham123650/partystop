import { motion } from "framer-motion";

export default function Reviews() {
  return (
    <section className="section reviews">
      <div className="section-inner reviews-inner">
        <div className="reviews-score">
          <motion.span
            className="reviews-number"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            4.4
          </motion.span>

          <div className="reviews-stars" aria-label="4.4 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className="review-star"
                initial={{ opacity: 0.15, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.12 }}
              >
                ★
              </motion.span>
            ))}
          </div>

          <span className="eyebrow reviews-label">Google Rating</span>
          <span className="reviews-count">100+ Reviews</span>

          <a
            className="btn btn-dark reviews-btn"
            href="#"
            title="Google review link to be configured"
          >
            Read Our Google Reviews <span className="btn-arrow">→</span>
          </a>
          <span className="reviews-config-note">Link needs configuration</span>
        </div>
      </div>
    </section>
  );
}

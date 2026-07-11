import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="section hero">
      <div className="section-inner hero-inner">
        <motion.span
          className="eyebrow front-bottle hero-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
        >
          Allen Park, Michigan
        </motion.span>

        <motion.h1
          className="hero-title front-bottle"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your First Stop
          <br />
          for the Party.
        </motion.h1>

        <motion.p
          className="hero-sub front-bottle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          Cold drinks, great selection, snacks, and everything you need to keep
          the party going.
        </motion.p>

        <motion.div
          className="hero-actions front-bottle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.6 }}
        >
          <a
            className="btn btn-primary"
            href="https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101"
            target="_blank" rel="noreferrer"
          >
            Get Directions <span className="btn-arrow">→</span>
          </a>
          <a className="btn btn-outline" href="tel:+13139287580">
            Call Party Stop
          </a>
        </motion.div>
      </div>

      <div className="hero-scroll-cue front-bottle" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}

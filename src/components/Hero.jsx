import { motion } from "framer-motion";

const directions = "https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101";

export default function Hero() {
  return (
    <section id="home" className="section hero">
      <div className="hero-light" aria-hidden="true" />
      <div className="section-inner hero-inner">
        <div className="hero-copy front-bottle">
          <motion.p className="eyebrow hero-eyebrow" {...reveal(0.08)}>
            Allen Park, Michigan
          </motion.p>
          <motion.h1 className="hero-title" {...reveal(0.16)}>
            Your first stop<br />for the occasion.
          </motion.h1>
          <motion.p className="hero-sub" {...reveal(0.26)}>
            A neighborhood destination for beer, wine, spirits, cold drinks, snacks, and everyday essentials.
          </motion.p>
          <motion.div className="hero-actions" {...reveal(0.34)}>
            <a className="btn btn-primary" href={directions} target="_blank" rel="noreferrer">
              Get directions <span aria-hidden="true">↗</span>
            </a>
            <a className="text-button" href="tel:+13139287580">
              Call the store <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        <div className="hero-product-space" aria-hidden="true">
          <span className="bottle-caption front-bottle">Party Stop · House bottle</span>
        </div>
      </div>

      <motion.div className="hero-footnote front-bottle" {...reveal(0.46)}>
        <span>7235 Allen Rd</span><i /> <span>Allen Park, MI 48101</span>
      </motion.div>
    </section>
  );
}

function reveal(delay) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.9 + delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  };
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLACEHOLDERS = [
  { id: 1, label: "Storefront", tall: false },
  { id: 2, label: "Beer Aisle", tall: true },
  { id: 3, label: "Wine Wall", tall: false },
  { id: 4, label: "Snack Corner", tall: false },
  { id: 5, label: "Checkout", tall: true },
  { id: 6, label: "Lotto Counter", tall: false },
];

export default function Gallery() {
  const [active, setActive] = useState(null);

  return (
    <section id="gallery" className="section gallery">
      <div className="section-inner">
        <span className="eyebrow">Gallery</span>
        <h2 className="gallery-title">Inside Party Stop</h2>
        <p className="gallery-note">Real store photos coming soon — placeholders shown below.</p>
      </div>

      <div className="gallery-grid section-inner">
        {PLACEHOLDERS.map((p, i) => (
          <motion.button
            key={p.id}
            className={`gallery-item ${p.tall ? "gallery-item-tall" : ""}`}
            onClick={() => setActive(p)}
            data-cursor="View"
            initial={{ opacity: 0, clipPath: "inset(12% round 4px)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% round 4px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            aria-label={`View ${p.label} photo`}
          >
            <span className="gallery-item-label">{p.label}</span>
            <span className="gallery-item-hint">View</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="lightbox-frame"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{active.label}</span>
              <p>Photo placeholder — real image to be added.</p>
              <button className="btn btn-outline" onClick={() => setActive(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

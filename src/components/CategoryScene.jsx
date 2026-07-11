import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Beer", depth: "behind-bottle", size: "lg" },
  { name: "Wine", depth: "front-bottle", size: "md" },
  { name: "Liquor", depth: "behind-bottle", size: "xl" },
  { name: "Cold Drinks", depth: "front-bottle", size: "md" },
  { name: "Snacks", depth: "front-bottle", size: "lg" },
  { name: "Lotto", depth: "behind-bottle", size: "md" },
];

export default function CategoryScene() {
  return (
    <section id="selection" className="section category-scene">
      <div className="section-inner">
        <motion.span
          className="eyebrow front-bottle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Selection
        </motion.span>
        <motion.h2
          className="category-title front-bottle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          What's Your Stop?
        </motion.h2>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            className={`category-panel category-${cat.size} ${cat.depth}`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {cat.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

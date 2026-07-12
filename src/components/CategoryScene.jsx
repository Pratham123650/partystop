import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Beer", note: "Cold favorites", pos: "12%", accent: "navy" },
  { name: "Wine", note: "For the table", pos: "42%", accent: "burgundy" },
  { name: "Spirits", note: "For the shelf", pos: "57%", accent: "forest" },
  { name: "Cold drinks", note: "Ready to go", pos: "2%", accent: "champagne" },
  { name: "Snacks", note: "Sweet and savory", pos: "82%", accent: "stone" },
  { name: "Lotto", note: "Try your luck", pos: "67%", accent: "ivory" },
];

export default function CategoryScene() {
  return (
    <section id="selection" className="section selection">
      <div className="section-inner">
        <header className="section-heading front-bottle">
          <div>
            <span className="eyebrow">Curated selection</span>
            <h2>Curated for every occasion.</h2>
          </div>
          <p>From everyday favorites to something for the weekend, Party Stop brings the essentials together in one convenient place.</p>
        </header>

        <div className="category-grid front-bottle">
          {CATEGORIES.map((category, index) => (
            <motion.a
              key={category.name}
              href="#visit"
              className={`category-card accent-${category.accent}`}
              style={{ "--image-position": category.pos }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.72, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="category-image" aria-hidden="true" />
              <div className="category-card-body">
                <div><span>0{index + 1}</span><h3>{category.name}</h3></div>
                <p>{category.note}</p>
                <i aria-hidden="true">↗</i>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

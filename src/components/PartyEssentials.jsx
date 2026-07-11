import { motion } from "framer-motion";

const ITEMS = [
  { label: "Cold Drinks", depth: "front-bottle", pos: { top: "8%", left: "6%" } },
  { label: "Mixers", depth: "behind-bottle", pos: { top: "18%", right: "10%" } },
  { label: "Snacks", depth: "front-bottle", pos: { bottom: "26%", left: "12%" } },
  { label: "Ice & Drinks", depth: "behind-bottle", pos: { bottom: "14%", right: "8%" } },
  { label: "Party Essentials", depth: "front-bottle", pos: { top: "44%", left: "42%" } },
];

export default function PartyEssentials() {
  return (
    <section className="section essentials">
      <div className="section-inner">
        <span className="eyebrow front-bottle">Party Essentials</span>
        <h2 className="essentials-title front-bottle">
          Everything You Need to
          <br />
          Keep the Party Going.
        </h2>
      </div>

      <div className="essentials-field">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.label}
            className={`essentials-card ${it.depth}`}
            style={it.pos}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {it.label}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

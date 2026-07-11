import { motion } from "framer-motion";

const LINES = ["YOUR", "NEIGHBORHOOD", "STOP."];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="section-inner">
        <div className="about-title">
          {LINES.map((line, i) => (
            <div className="about-title-row" key={line}>
              {line.split("").map((ch, j) => (
                <motion.span
                  key={`${line}-${j}`}
                  className={i === 1 ? "behind-bottle" : "front-bottle"}
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: j * 0.02, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <motion.p
          className="about-copy front-bottle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Party Stop is your local destination for cold drinks, beer, wine,
          liquor, snacks, and everyday party essentials. Conveniently located
          on Allen Road in Allen Park, we're here to make sure your next stop
          is a good one.
        </motion.p>
      </div>
    </section>
  );
}

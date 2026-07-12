import { motion } from "framer-motion";

const DETAILS = ["Cold drinks", "Beer, wine & spirits", "Snacks & essentials", "Lotto"];

export default function PartyEssentials() {
  return (
    <section id="about" className="section experience">
      <div className="section-inner experience-layout">
        <motion.figure
          className="experience-photo front-bottle"
          initial={{ opacity: 0, clipPath: "inset(8% 0 0 0 round 20px)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0 round 20px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src="./images/storefront-placeholder.webp" alt="Editorial storefront placeholder for Party Stop" loading="lazy" />
          <figcaption><span>Allen Park, Michigan</span><span>Storefront image placeholder</span></figcaption>
        </motion.figure>

        <div className="experience-copy front-bottle">
          <span className="eyebrow">The store experience</span>
          <h2>A neighborhood favorite.</h2>
          <p className="experience-lead">Party Stop is a convenient local destination for drinks, snacks, and everyday essentials in Allen Park.</p>
          <p>Whether you are planning the weekend or making one quick stop, everything you need is close at hand and easy to find.</p>
          <ul aria-label="Available at Party Stop">
            {DETAILS.map((detail, index) => (
              <motion.li key={detail} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.05 }}>
                <span>0{index + 1}</span>{detail}
              </motion.li>
            ))}
          </ul>
          <a className="text-button" href="#visit">Plan your visit <span aria-hidden="true">↘</span></a>
        </div>
      </div>
    </section>
  );
}

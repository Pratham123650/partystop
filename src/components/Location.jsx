import { motion } from "framer-motion";

const directions = "https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101";

export default function Location() {
  return (
    <section id="visit" className="section location">
      <div className="section-inner">
        <header className="location-heading front-bottle">
          <span className="eyebrow">Allen Park, Michigan</span>
          <h2>Visit Party Stop</h2>
        </header>

        <div className="location-layout front-bottle">
          <motion.div className="location-details" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="location-wordmark"><span>Party</span> Stop</div>
            <address>7235 Allen Rd<br />Allen Park, MI 48101</address>
            <a className="location-phone" href="tel:+13139287580">(313) 928-7580</a>
            <div className="location-actions">
              <a className="btn btn-primary" href={directions} target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a>
              <a className="btn btn-quiet" href="tel:+13139287580">Call now <span aria-hidden="true">→</span></a>
            </div>
          </motion.div>

          <div className="location-map-frame">
            <iframe title="Map showing Party Stop at 7235 Allen Road in Allen Park" src="https://maps.google.com/maps?q=7235%20Allen%20Rd%2C%20Allen%20Park%2C%20MI%2048101&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a href={directions} target="_blank" rel="noreferrer">Open in maps <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

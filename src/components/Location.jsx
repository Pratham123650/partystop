import { motion } from "framer-motion";

export default function Location() {
  return (
    <section id="visit" className="section location">
      <div className="section-inner location-inner">
        <span className="eyebrow front-bottle">Visit Us</span>
        <motion.h2
          className="location-title front-bottle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Make Party Stop
          <br />
          Your Next Stop.
        </motion.h2>

        <div className="location-body">
          <div className="location-details front-bottle">
            <p className="location-name">PARTY STOP</p>
            <p>7235 Allen Rd<br />Allen Park, MI 48101</p>
            <p><a href="tel:+13139287580">(313) 928-7580</a></p>

            <div className="location-actions">
              <a
                className="btn btn-primary"
                href="https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101"
                target="_blank" rel="noreferrer"
              >
                Get Directions <span className="btn-arrow">→</span>
              </a>
              <a className="btn btn-outline" href="tel:+13139287580">Call Us</a>
            </div>
          </div>

          <div className="location-map-frame front-bottle">
            <div className="map-pin" aria-hidden="true">
              <span className="map-pin-dot" />
            </div>
            <iframe
              title="Party Stop location map"
              src="https://maps.google.com/maps?q=7235%20Allen%20Rd%2C%20Allen%20Park%2C%20MI%2048101&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

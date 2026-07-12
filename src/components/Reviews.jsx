import { motion } from "framer-motion";

const reviewsLink = "https://www.google.com/maps/search/?api=1&query=Party+Stop+7235+Allen+Rd+Allen+Park+MI+48101";

export default function Reviews() {
  return (
    <section className="section reviews" aria-labelledby="reviews-title">
      <div className="section-inner reviews-layout">
        <div className="reviews-copy">
          <span className="eyebrow">Google rating</span>
          <h2 id="reviews-title">A trusted neighborhood stop.</h2>
        </div>

        <motion.div className="rating" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
          <div className="rating-score"><strong>4.4</strong><span>out of 5</span></div>
          <div className="rating-stars" aria-label="4.4 out of 5 stars">★★★★★</div>
          <p>120 Google reviews</p>
          <a className="text-button" href={reviewsLink} target="_blank" rel="noreferrer">Read Google reviews <span aria-hidden="true">↗</span></a>
        </motion.div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GALLERY = [
  { id: 1, title: "The storefront", image: "./images/storefront-placeholder.webp", position: "center 48%", wide: true },
  { id: 2, title: "Cold drinks", image: "./images/interior-placeholder.webp", position: "left center" },
  { id: 3, title: "Wine & spirits", image: "./images/interior-placeholder.webp", position: "center center" },
  { id: 4, title: "Snacks & extras", image: "./images/interior-placeholder.webp", position: "right center" },
];

export default function Gallery() {
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (event) => event.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="gallery" className="section gallery">
      <div className="section-inner">
        <div className="section-heading section-heading-light">
          <div><span className="eyebrow">Gallery</span><h2>Inside Party Stop</h2></div>
          <p>A quiet look at the selection and store experience. Editorial placeholders are shown until real Party Stop photography is available.</p>
        </div>

        <div className="gallery-grid">
          {GALLERY.map((item, index) => (
            <motion.button
              key={item.id}
              className={`gallery-item ${item.wide ? "gallery-item-wide" : ""}`}
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
              aria-label={`View ${item.title} placeholder`}
            >
              <img src={item.image} alt="" loading="lazy" style={{ objectPosition: item.position }} />
              <span>{item.title}</span>
              <i aria-hidden="true">↗</i>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={`${active.title} image preview`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="lightbox-frame" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <img src={active.image} alt={`${active.title} editorial placeholder`} style={{ objectPosition: active.position }} />
              <div><span>{active.title}</span><small>Editorial placeholder</small></div>
              <button ref={closeRef} onClick={() => setActive(null)} aria-label="Close image preview">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

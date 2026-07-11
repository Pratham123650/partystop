import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="mobile-action-bar"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="tel:+13139287580" className="mobile-action-btn call">Call</a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101"
            target="_blank" rel="noreferrer"
            className="mobile-action-btn dir"
          >
            Directions
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

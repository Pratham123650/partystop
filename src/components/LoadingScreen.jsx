import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="loading-arrows" aria-hidden="true">
            <motion.span
              className="arrow-glyph"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              &gt;&gt;&gt;
            </motion.span>

            <div className="loading-word-stack">
              <motion.span
                className="loading-word party"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                PARTY
              </motion.span>
              <motion.span
                className="loading-word stop"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.12, 1], opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
              >
                STOP
              </motion.span>
            </div>

            <motion.span
              className="arrow-glyph"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              &lt;&lt;&lt;
            </motion.span>
          </div>

          <motion.svg
            className="loading-bottle"
            viewBox="0 0 100 200"
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 0.9, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <path
              d="M38 10 L62 10 L66 40 L72 100 L72 185 Q72 195 60 195 L40 195 Q28 195 28 185 L28 100 L34 40 Z"
              fill="#201e1b"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

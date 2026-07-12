import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="loading-screen" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <motion.div className="loading-mark" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span>PARTY</span><strong>STOP</strong><i>→</i>
          </motion.div>
          <div className="loading-line"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }} /></div>
          <small>Allen Park, Michigan</small>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

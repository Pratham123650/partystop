import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "party-stop-21-ack";

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const ack = window.localStorage.getItem(STORAGE_KEY);
    if (!ack) setOpen(true);
  }, []);

  const confirm = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const exit = () => {
    setExiting(true);
  };

  return (
    <AnimatePresence>
      {open && !exiting && (
        <motion.div
          className="age-gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="age-gate-card"
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow age-gate-eyebrow">Welcome to</span>
            <h2 id="age-gate-title" className="age-gate-title">PARTY STOP</h2>
            <p className="age-gate-copy">Please confirm you are of legal drinking age.</p>
            <div className="age-gate-actions">
              <button className="btn btn-primary" onClick={confirm}>
                I am 21+ <span className="btn-arrow">→</span>
              </button>
              <button className="btn btn-outline age-gate-exit" onClick={exit}>
                Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {exiting && (
        <motion.div
          className="age-gate age-gate-farewell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Come back when you're 21+. See you at Party Stop.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

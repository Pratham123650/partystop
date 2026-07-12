import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "party-stop-21-ack";

export default function AgeGate() {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(!localStorage.getItem(STORAGE_KEY)), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  const confirm = () => { localStorage.setItem(STORAGE_KEY, "true"); setOpen(false); };

  return (
    <AnimatePresence>
      {open && !exiting && (
        <motion.div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="age-gate-card" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            <div className="age-gate-brand"><span>PARTY</span><strong>STOP</strong><i>→</i></div>
            <span className="eyebrow">Before you come in</span>
            <h2 id="age-gate-title">Are you 21 or older?</h2>
            <p>Please confirm you’re of legal drinking age to explore Party Stop.</p>
            <div className="age-gate-actions"><button className="btn btn-primary" onClick={confirm}>Yes, I’m 21+ <span>→</span></button><button className="btn btn-secondary" onClick={() => setExiting(true)}>No, exit</button></div>
          </motion.div>
        </motion.div>
      )}
      {exiting && <motion.div className="age-gate age-gate-farewell" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><p>We’ll see you another time.</p></motion.div>}
    </AnimatePresence>
  );
}

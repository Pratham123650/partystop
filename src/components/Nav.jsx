import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const directions = "https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101";
const LINKS = [
  ["Home", "#home"], ["About", "#about"], ["Selection", "#selection"], ["Gallery", "#gallery"], ["Visit", "#visit"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" aria-label="Party Stop home"><span className="logo-party">PARTY</span><span className="logo-stop">STOP</span><i aria-hidden="true">→</i></a>
          <nav className="nav-links" aria-label="Primary navigation">
            {LINKS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <a href={directions} target="_blank" rel="noreferrer" className="btn btn-primary nav-cta">Get directions <span aria-hidden="true">↗</span></a>
          <button className="nav-burger" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><span /><span /></button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <div className="mobile-menu-head"><span>PARTY <b>STOP</b></span><button aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button></div>
            <nav aria-label="Mobile navigation">
              {LINKS.map(([label, href], index) => (
                <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + index * 0.04 }}>{label}<span>↘</span></motion.a>
              ))}
            </nav>
            <div className="mobile-menu-actions"><a className="btn btn-primary" href={directions} target="_blank" rel="noreferrer">Get directions</a><a className="btn btn-secondary" href="tel:+13139287580">Call the store</a></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

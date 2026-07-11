import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Selection", href: "#selection" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit Us", href: "#visit" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            PARTY<span>STOP</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>

          <a href="tel:+13139287580" className="btn btn-primary nav-cta">
            Get Directions <span className="btn-arrow">→</span>
          </a>

          <button
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          >
            <button className="mobile-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              ×
            </button>

            <div className="mobile-menu-arrows" aria-hidden="true">→ → →</div>

            <nav className="mobile-menu-links" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="mobile-menu-actions">
              <a href="tel:+13139287580" className="btn btn-dark">Call Party Stop</a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=7235+Allen+Rd+Allen+Park+MI+48101"
                target="_blank" rel="noreferrer"
                className="btn btn-primary"
              >
                Get Directions
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

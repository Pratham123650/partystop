import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Wordmark from './Wordmark.jsx';
import { STORE } from '../lib/constants.js';

const LINKS = [
  { href: '#main', label: 'Home' },
  { href: '#selection', label: 'Selection' },
  { href: '#essentials', label: 'Essentials' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#visit', label: 'Visit' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Wordmark />
          <nav aria-label="Primary">
            <ul className="nav__links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a className="nav__link" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            className="nav__cta"
            href={STORE.directionsHref}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
          <button
            className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mnav"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
                >
                  <a
                    className="mnav__link"
                    href={l.href}
                    onClick={() => setOpen(false)}
                  >
                    <small>0{i + 1}</small>
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </nav>
            <motion.div
              className="mnav__actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a className="btn btn--light" href={STORE.phoneHref}>
                Call
              </a>
              <a
                className="btn btn--ghost-light"
                href={STORE.directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                Directions <span className="btn__arrow">→</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock while the menu is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  // Escape to close + focus trap inside the overlay menu
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusables = () =>
      menu
        ? Array.from(
            menu.querySelectorAll('a[href], button:not([disabled])')
          ).filter((el) => el.offsetParent !== null)
        : [];

    const first = focusables()[0];
    first?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [burgerRef.current, ...focusables()].filter(Boolean);
      if (items.length === 0) return;
      const idx = items.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && idx === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}
      >
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
          <a
            className="nav__mini-dir"
            href={STORE.directionsHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Get directions to Party Stop"
          >
            →
          </a>
          <button
            ref={burgerRef}
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
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.35 }}
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
              transition={{ delay: 0.34 }}
            >
              <a className="btn btn--primary" href={STORE.phoneHref}>
                Call the Store
              </a>
              <a
                className="btn btn--ghost"
                href={STORE.directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions <span className="btn__arrow">→</span>
              </a>
            </motion.div>
            <motion.address
              className="mnav__info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
            >
              {STORE.address1} · {STORE.address2}
              <br />
              <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
            </motion.address>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

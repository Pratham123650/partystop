import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import { withBasePath } from '../lib/assetPath.js';

/**
 * REPLACEABLE IMAGES: drop real store photos at
 * public/gallery/1.jpg … public/gallery/5.jpg. Slots without a photo
 * show an elegant labeled panel — never a broken image.
 */
const SLOTS = [
  { src: withBasePath('/gallery/1.jpg'), alt: 'Inside Party Stop — the main aisle' },
  { src: withBasePath('/gallery/2.jpg'), alt: 'Inside Party Stop — the wine selection' },
  { src: withBasePath('/gallery/3.jpg'), alt: 'Inside Party Stop — coolers of cold drinks' },
  { src: withBasePath('/gallery/4.jpg'), alt: 'Inside Party Stop — spirits shelf' },
  { src: withBasePath('/gallery/5.jpg'), alt: 'Inside Party Stop — snacks and essentials' },
];

export default function Gallery() {
  const root = useRef(null);
  const cursorRef = useRef(null);
  const [loadedMap, setLoadedMap] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [cursorOn, setCursorOn] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gitem',
        { clipPath: 'inset(12% 0 12% 0 round 16px)', opacity: 0, y: 26 },
        {
          clipPath: 'inset(0% 0 0% 0 round 16px)',
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // "VIEW" cursor only over gallery images (desktop pointer)
  useEffect(() => {
    if (!cursorOn) return;
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [cursorOn]);

  const markLoaded = (i) => setLoadedMap((m) => ({ ...m, [i]: true }));

  return (
    <section className="gallery" id="gallery" ref={root}>
      <div className="container">
        <p className="label">Inside Party Stop</p>
        <h2 className="headline" style={{ marginTop: 18, fontSize: 'clamp(34px,4.6vw,60px)' }}>
          Take a look <em>around.</em>
        </h2>

        <div className="gallery__grid">
          {SLOTS.map((s, i) => (
            <button
              key={s.src}
              className="gitem"
              onClick={() => loadedMap[i] && setLightbox(s)}
              onMouseEnter={() => loadedMap[i] && setCursorOn(true)}
              onMouseLeave={() => setCursorOn(false)}
              aria-label={loadedMap[i] ? `Open photo: ${s.alt}` : 'Photo coming soon'}
              style={!loadedMap[i] ? { cursor: 'default' } : undefined}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                style={loadedMap[i] ? undefined : { display: 'none' }}
                onLoad={() => markLoaded(i)}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              {!loadedMap[i] && (
                <span className="gitem__ph">
                  <span>PHOTO COMING SOON</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {cursorOn && !lightbox && (
        <div className="gcursor" ref={cursorRef} aria-hidden="true">
          VIEW
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <button
              className="lightbox__close"
              onClick={() => setLightbox(null)}
              aria-label="Close photo"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

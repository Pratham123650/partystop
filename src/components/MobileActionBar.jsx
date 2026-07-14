import { useEffect, useState } from 'react';
import { STORE } from '../lib/constants.js';

/**
 * Sticky call/directions bar (mobile only, via CSS). Slides away while
 * the footer is on screen so it never covers the store info there.
 */
export default function MobileActionBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => setHidden(e.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`mobilebar ${hidden ? 'mobilebar--hidden' : ''}`}
      role="navigation"
      aria-label="Quick actions"
    >
      <a href={STORE.phoneHref}>
        <span className="dot" aria-hidden="true">
          ●
        </span>
        CALL
      </a>
      <a href={STORE.directionsHref} target="_blank" rel="noreferrer">
        <span className="dot" aria-hidden="true">
          →
        </span>
        DIRECTIONS
      </a>
    </div>
  );
}

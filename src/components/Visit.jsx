import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import { STORE } from '../lib/constants.js';

export default function Visit() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current.querySelectorAll('[data-fade]'),
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="visit" id="visit" ref={root}>
      <div className="container visit__grid">
        <div>
          <p className="label" data-fade>
            Visit Us
          </p>
          <h2 className="headline" style={{ marginTop: 18 }} data-fade>
            Make Party Stop
            <br />
            your next <em>stop.</em>
          </h2>
          <address className="visit__info" data-fade>
            <strong>Party Stop</strong>
            {STORE.address1}
            <br />
            {STORE.address2}
            <br />
            <a href={STORE.phoneHref}>{STORE.phoneDisplay}</a>
          </address>
          <div className="visit__actions" data-fade>
            <a
              className="btn btn--light"
              href={STORE.directionsHref}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions <span className="btn__arrow">→</span>
            </a>
            <a className="btn btn--ghost-light" href={STORE.phoneHref}>
              Call Now
            </a>
          </div>
        </div>

        <div className="visit__map" data-fade>
          <div className="visit__pin">
            <strong>Party Stop</strong>
            7235 Allen Rd, Allen Park
          </div>
          <iframe
            src={STORE.mapEmbed}
            title="Map showing the location of Party Stop, 7235 Allen Rd, Allen Park, MI"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

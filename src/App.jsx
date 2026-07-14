import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Loader from './components/Loader.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import SelectionIntro from './components/SelectionIntro.jsx';
import Featured from './components/Featured.jsx';
import Inventory from './components/Inventory.jsx';
import LiquidDivider from './components/LiquidDivider.jsx';
import Essentials from './components/Essentials.jsx';
import Lottery from './components/Lottery.jsx';
import Neighborhood from './components/Neighborhood.jsx';
import Gallery from './components/Gallery.jsx';
import Rating from './components/Rating.jsx';
import Visit from './components/Visit.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import { usePrefersReducedMotion } from './lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Smooth scrolling — Lenis driven by GSAP's ticker so ScrollTrigger
  // and Lenis share one clock. Skipped for touch devices & reduced motion.
  useEffect(() => {
    if (reduced) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor navigation through Lenis
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute('href'));
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -70 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  // Refresh ScrollTrigger once fonts/layout settle
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader onDone={() => setReady(true)} />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <SelectionIntro />
        <Featured />
        <Inventory />
        <LiquidDivider />
        <Essentials />
        <Lottery />
        <Neighborhood />
        <Gallery />
        <Rating />
        <Visit />
      </main>
      <Footer />
      <MobileActionBar />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

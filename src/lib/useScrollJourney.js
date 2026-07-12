import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { journey } from "./journeyStore";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollJourney(containerRef) {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    journey.reducedMotion = motionQuery.matches;
    const onMotionChange = () => { journey.reducedMotion = motionQuery.matches; };
    motionQuery.addEventListener?.("change", onMotionChange);

    const lenis = motionQuery.matches ? null : new Lenis({
      duration: 1.02,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
    });

    const updateLenis = (time) => lenis?.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.85,
      onUpdate: (self) => { journey.progress = self.progress; },
    });

    return () => {
      trigger.kill();
      lenis?.destroy();
      gsap.ticker.remove(updateLenis);
      motionQuery.removeEventListener?.("change", onMotionChange);
    };
  }, [containerRef]);
}

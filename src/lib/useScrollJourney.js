import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "./journeyStore";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollJourney(containerRef) {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    journey.reducedMotion = mql.matches;
    const onChange = () => (journey.reducedMotion = mql.matches);
    mql.addEventListener?.("change", onChange);

    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        journey.progress = self.progress;
      },
    });

    return () => {
      st.kill();
      mql.removeEventListener?.("change", onChange);
    };
  }, [containerRef]);
}

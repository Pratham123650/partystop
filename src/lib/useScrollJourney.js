import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "./journeyStore";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollJourney(containerRef, onSceneVisibilityChange) {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    journey.reducedMotion = mql.matches;
    const onChange = () => (journey.reducedMotion = mql.matches);
    mql.addEventListener?.("change", onChange);

    if (!containerRef.current) return;

    let sceneVisible = true;
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        journey.progress = self.progress;
        const nextSceneVisible = self.progress < 0.9;
        if (nextSceneVisible !== sceneVisible) {
          sceneVisible = nextSceneVisible;
          onSceneVisibilityChange?.(nextSceneVisible);
        }
      },
    });

    return () => {
      st.kill();
      mql.removeEventListener?.("change", onChange);
    };
  }, [containerRef, onSceneVisibilityChange]);
}

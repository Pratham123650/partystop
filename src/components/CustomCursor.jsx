import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(isFine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const move = (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${pointerX}px, ${pointerY}px)`;
        }
        frameId = 0;
      });
    };

    const over = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) {
        setExpand(true);
        setLabel(t.getAttribute("data-cursor") || "");
      } else if (e.target.closest("a, button")) {
        setExpand(true);
        setLabel("");
      } else {
        setExpand(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className={`custom-cursor ${expand ? "expand" : ""}`}>
      {label && <span>{label}</span>}
    </div>
  );
}

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import Bottle from "./Bottle";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch { return false; }
}

function InvalidateOnPageChange() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const render = () => invalidate();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render, { passive: true });
    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [invalidate]);
  return null;
}

function FallbackBottle() {
  return <div className="bottle-fallback" role="img" aria-label="Party Stop house bottle"><div className="fallback-cork" /><div className="fallback-neck" /><div className="fallback-body"><div className="fallback-label"><b><span>Party</span> Stop</b><small>Your first stop for the party</small></div></div></div>;
}

export default function Scene3D({ className }) {
  const [webgl, setWebgl] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL());
    const media = window.matchMedia("(max-width: 759px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  if (!webgl) return <FallbackBottle />;

  return (
    <div className={className} aria-hidden="true">
      <Canvas frameloop="demand" dpr={mobile ? [0.75, 1.2] : [1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0, 0.35, 7], fov: 31 }} performance={{ min: 0.65 }}>
        <InvalidateOnPageChange />
        <ambientLight intensity={0.5} color="#f4efe6" />
        <rectAreaLight position={[3.5, 3.5, 4]} rotation={[-0.35, 0.58, 0]} width={4.2} height={5.8} intensity={4.9} color="#f8ebd1" />
        <rectAreaLight position={[-3.6, 1.7, 2]} rotation={[0, -0.8, 0]} width={2.5} height={4.8} intensity={2.1} color="#9aa8b7" />
        <spotLight position={[-3, 4.4, -3]} intensity={31} angle={0.55} penumbra={1} color="#d1ae70" />

        <Suspense fallback={null}>
          <Bottle />
          <Environment resolution={96}>
            <Lightformer form="rect" intensity={1.8} color="#faf8f3" position={[3, 1, 4]} scale={[4, 6, 1]} />
            <Lightformer form="rect" intensity={0.85} color="#7f91a3" position={[-4, 1, 1]} scale={[2, 5, 1]} />
          </Environment>
          <ContactShadows position={[0, -2.05, 0]} opacity={0.2} scale={4.8} blur={3.1} far={3} frames={1} resolution={160} />
        </Suspense>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}

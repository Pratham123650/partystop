import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import Bottle from "./Bottle";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function StaticBottleFallback() {
  return (
    <div className="bottle-fallback" role="img" aria-label="Party Stop bottle">
      <svg viewBox="0 0 220 420" width="220" height="420">
        <rect x="70" y="0" width="20" height="40" fill="#1d4e89" rx="6" />
        <path
          d="M78 40 L142 40 L150 90 L158 220 L158 400 Q158 415 143 415 L77 415 Q62 415 62 400 L62 220 L70 90 Z"
          fill="#2f6b4f"
          opacity="0.85"
        />
        <rect x="62" y="240" width="96" height="120" fill="#f7f1e1" stroke="#201e1b" strokeWidth="4" />
        <text x="110" y="285" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="24" fill="#1d4e89">PARTY</text>
        <text x="110" y="325" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="36" fill="#d62828">STOP</text>
      </svg>
    </div>
  );
}

export default function Scene3D({ active = true, className }) {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  if (!active) return null;
  if (!webglOk) return <StaticBottleFallback />;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[0.85, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6.2], fov: 32 }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color={"#fff3d6"} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color={"#2f6fc4"} />

        <Suspense fallback={null}>
          <Bottle />
        </Suspense>

        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}

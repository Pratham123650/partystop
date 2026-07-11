import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows } from "@react-three/drei";
import Bottle from "./Bottle";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch (e) {
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

export default function Scene3D({ className }) {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  if (!webglOk) return <StaticBottleFallback />;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6.2], fov: 32 }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color={"#fff3d6"} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color={"#2f6fc4"} />
        <pointLight position={[0, -2, 3]} intensity={0.4} color={"#f4b400"} />
        <pointLight position={[2, 3, -2]} intensity={0.5} color={"#ffffff"} />

        <Suspense fallback={null}>
          <Bottle />
          <ContactShadows position={[0, -2.05, 0]} opacity={0.35} scale={6} blur={2.4} far={3} />
        </Suspense>

        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}

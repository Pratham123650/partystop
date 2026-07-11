import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Bottle from "./Bottle";
import { journey, sceneForProgress } from "../lib/journeyStore";

const LIGHTING = {
  hero: { key: "#fff0c7", edge: "#2454a6", accent: "#f5c542", ambient: 0.72, keyPower: 1.7, edgePower: 0.65 },
  rotate: { key: "#fff0c7", edge: "#2454a6", accent: "#c92d2d", ambient: 0.68, keyPower: 1.75, edgePower: 0.72 },
  beer: { key: "#fff4d8", edge: "#2454a6", accent: "#c92d2d", ambient: 0.62, keyPower: 1.65, edgePower: 0.95 },
  wine: { key: "#fff4d8", edge: "#c92d2d", accent: "#2454a6", ambient: 0.6, keyPower: 1.65, edgePower: 0.9 },
  liquor: { key: "#f5c542", edge: "#f7f0dd", accent: "#c92d2d", ambient: 0.5, keyPower: 1.9, edgePower: 1.0 },
  spin: { key: "#f5c542", edge: "#f7f0dd", accent: "#c92d2d", ambient: 0.48, keyPower: 2.0, edgePower: 1.05 },
  essentials: { key: "#fff0c7", edge: "#2454a6", accent: "#f5c542", ambient: 0.68, keyPower: 1.75, edgePower: 0.72 },
  about: { key: "#f7f0dd", edge: "#f5c542", accent: "#2454a6", ambient: 0.56, keyPower: 1.85, edgePower: 0.88 },
  location: { key: "#f7f0dd", edge: "#f5c542", accent: "#2454a6", ambient: 0.5, keyPower: 2.0, edgePower: 0.9 },
};

function LightingRig() {
  const ambient = useRef();
  const key = useRef();
  const edge = useRef();
  const accent = useRef();
  const targetKey = useRef(new THREE.Color(LIGHTING.hero.key));
  const targetEdge = useRef(new THREE.Color(LIGHTING.hero.edge));
  const targetAccent = useRef(new THREE.Color(LIGHTING.hero.accent));
  const activeScene = useRef("hero");

  useFrame((_, delta) => {
    const sceneKey = sceneForProgress(journey.progress).key;
    const preset = LIGHTING[sceneKey] ?? LIGHTING.hero;

    if (activeScene.current !== sceneKey) {
      activeScene.current = sceneKey;
      targetKey.current.set(preset.key);
      targetEdge.current.set(preset.edge);
      targetAccent.current.set(preset.accent);
    }

    const blend = 1 - Math.exp(-delta * 3.2);
    key.current.color.lerp(targetKey.current, blend);
    edge.current.color.lerp(targetEdge.current, blend);
    accent.current.color.lerp(targetAccent.current, blend);
    ambient.current.intensity = THREE.MathUtils.damp(ambient.current.intensity, preset.ambient, 3.2, delta);
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, preset.keyPower, 3.2, delta);
    edge.current.intensity = THREE.MathUtils.damp(edge.current.intensity, preset.edgePower, 3.2, delta);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={LIGHTING.hero.ambient} />
      <directionalLight ref={key} position={[3.4, 5, 4]} intensity={LIGHTING.hero.keyPower} color={LIGHTING.hero.key} />
      <directionalLight ref={edge} position={[-4, 2.4, -2.8]} intensity={LIGHTING.hero.edgePower} color={LIGHTING.hero.edge} />
      <pointLight ref={accent} position={[2.2, -1.2, 3]} intensity={0.55} color={LIGHTING.hero.accent} distance={9} />
      <pointLight position={[-2.6, 3.1, 1.5]} intensity={0.35} color="#f7f0dd" distance={8} />
    </>
  );
}

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
          fill="#8a5a2f"
          opacity="0.88"
        />
        <rect x="62" y="240" width="96" height="120" fill="#f7f0dd" stroke="#242424" strokeWidth="4" />
        <text x="110" y="285" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="24" fill="#2454a6">PARTY</text>
        <text x="110" y="325" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="36" fill="#c92d2d">STOP</text>
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
        dpr={[0.85, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6.2], fov: 32 }}
        performance={{ min: 0.55 }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <LightingRig />

        <Suspense fallback={null}>
          <Bottle />
          <ContactShadows position={[0, -2.05, 0]} opacity={0.3} scale={5.5} blur={2.2} far={3} frames={1} resolution={256} />
        </Suspense>

        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}

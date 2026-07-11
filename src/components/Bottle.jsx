import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey, sceneForProgress, clampMap } from "../lib/journeyStore";

// ---------------------------------------------------------------------------
// Bottle silhouette (lathe profile). Units are arbitrary "bottle space".
// ---------------------------------------------------------------------------
const PROFILE = [
  [0.0, 0.0],
  [0.62, 0.0],
  [0.62, 0.09],
  [0.58, 0.16],
  [0.56, 0.62],
  [0.56, 1.55],
  [0.5, 1.85],
  [0.3, 2.05],
  [0.22, 2.2],
  [0.2, 2.55],
  [0.19, 3.05],
  [0.19, 3.35],
].map(([x, y]) => new THREE.Vector2(x, y));

function useLatheGeometry() {
  return useMemo(() => {
    const geo = new THREE.LatheGeometry(PROFILE, 48);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

// ---------------------------------------------------------------------------
// Canvas label texture — redraws when the "scene" label text changes.
// ---------------------------------------------------------------------------
function useLabelTexture(text) {
  const canvasRef = useRef(document.createElement("canvas"));
  const textureRef = useRef(null);

  if (!textureRef.current) {
    const c = canvasRef.current;
    c.width = 1024;
    c.height = 640;
    textureRef.current = new THREE.CanvasTexture(c);
    textureRef.current.colorSpace = THREE.SRGBColorSpace;
  }

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    // cream label background
    ctx.fillStyle = "#f7f1e1";
    ctx.fillRect(0, 0, c.width, c.height);

    // charcoal border
    ctx.strokeStyle = "#201e1b";
    ctx.lineWidth = 14;
    ctx.strokeRect(24, 24, c.width - 48, c.height - 48);

    // blue directional arrows, left + right
    ctx.fillStyle = "#1d4e89";
    const arrow = (x, dir) => {
      ctx.beginPath();
      ctx.moveTo(x, 120);
      ctx.lineTo(x + dir * 70, 160);
      ctx.lineTo(x, 200);
      ctx.closePath();
      ctx.fill();
    };
    arrow(110, 1);
    arrow(c.width - 110, -1);

    // PARTY (blue)
    ctx.textAlign = "center";
    ctx.fillStyle = "#1d4e89";
    ctx.font = "700 130px 'Space Grotesk', sans-serif";
    ctx.fillText("PARTY", c.width / 2, 250);

    // STOP (red, bold)
    ctx.fillStyle = "#d62828";
    ctx.font = "900 190px Arial, sans-serif";
    ctx.fillText("STOP", c.width / 2, 440);

    // small yellow rule
    ctx.fillStyle = "#f4b400";
    ctx.fillRect(c.width / 2 - 160, 470, 320, 10);

    // dynamic sub-label (category text)
    ctx.fillStyle = "#201e1b";
    ctx.font = "700 54px 'JetBrains Mono', monospace";
    ctx.fillText(text.toUpperCase(), c.width / 2, 560);

    textureRef.current.needsUpdate = true;
  }, [text]);

  return textureRef.current;
}

// ---------------------------------------------------------------------------
// Bottle component
// ---------------------------------------------------------------------------
export default function Bottle({ scale = 1 }) {
  const group = useRef();
  const bodyRef = useRef();
  const capRef = useRef();

  const geometry = useLatheGeometry();
  const [labelText, setLabelText] = useState("PARTY STOP");
  const labelTexture = useLabelTexture(labelText);

  // smoothing targets, mutated each frame (no react state -> no re-renders)
  const current = useRef({
    rotY: 0,
    posX: 0,
    posY: 0,
    tilt: 0,
    scale: 1.15,
  });

  useFrame((_, delta) => {
    const p = journey.progress;
    const scene = sceneForProgress(p);
    if (scene.label !== labelText) setLabelText(scene.label);

    // Compute target pose per the scroll journey scenes -----------------
    const target = { rotY: 0, posX: 0, posY: 0, tilt: 0, scale: 1.15 };

    if (p <= 0.1) {
      // Hero: big, centered, gentle reveal rotation
      target.rotY = clampMap(p, 0, 0.1, -0.35, 0.15);
      target.posX = 0;
      target.posY = -0.15;
      target.scale = clampMap(p, 0, 0.1, 1.3, 1.15);
    } else if (p <= 0.22) {
      // Scene 2: rotate 90-180deg, drift right
      target.rotY = clampMap(p, 0.1, 0.22, 0.15, Math.PI * 0.85);
      target.posX = clampMap(p, 0.1, 0.22, 0, 1.35);
      target.posY = -0.05;
      target.scale = 1.05;
    } else if (p <= 0.55) {
      // Scenes 3-4: categories — drift back toward center, keep rotating slowly
      target.rotY = clampMap(p, 0.22, 0.55, Math.PI * 0.85, Math.PI * 1.9);
      target.posX = clampMap(p, 0.22, 0.55, 1.35, -0.15);
      target.posY = 0.05;
      target.scale = 1.0;
    } else if (p <= 0.68) {
      // Scene 6: the signature 360 spin moment, centered
      target.rotY = clampMap(p, 0.55, 0.68, Math.PI * 1.9, Math.PI * 3.9);
      target.posX = 0;
      target.posY = 0.1;
      target.scale = 1.1;
    } else if (p <= 0.82) {
      // Scene 5 visually reused here as tilt+diagonal drift (essentials)
      target.rotY = clampMap(p, 0.68, 0.82, Math.PI * 3.9, Math.PI * 4.3);
      target.posX = clampMap(p, 0.68, 0.82, 0, -1.1);
      target.posY = clampMap(p, 0.68, 0.82, 0.1, -0.35);
      target.tilt = clampMap(p, 0.68, 0.82, 0, 0.28);
      target.scale = 0.95;
    } else if (p <= 0.92) {
      // About: settle slightly right, tilt easing out
      target.rotY = clampMap(p, 0.82, 0.92, Math.PI * 4.3, Math.PI * 4.55);
      target.posX = clampMap(p, 0.82, 0.92, -1.1, 0.9);
      target.posY = -0.1;
      target.tilt = clampMap(p, 0.82, 0.92, 0.28, 0.05);
      target.scale = 1.0;
    } else {
      // Location: settle upright, centered, facing camera
      const twoPi = Math.PI * 2;
      const nearestFull = Math.round((Math.PI * 4.55) / twoPi) * twoPi;
      target.rotY = clampMap(p, 0.92, 1, Math.PI * 4.55, nearestFull);
      target.posX = clampMap(p, 0.92, 1, 0.9, 0);
      target.posY = 0;
      target.tilt = clampMap(p, 0.92, 1, 0.05, 0);
      target.scale = 1.2;
    }

    // gentle idle float only at the very top of the page
    const idleFloat = p < 0.02 ? Math.sin(performance.now() * 0.0006) * 0.05 : 0;
    target.posY += idleFloat;

    // smooth interpolation so motion never feels jerky
    const s = journey.reducedMotion ? 1 : Math.min(1, delta * 4.2);
    const c = current.current;
    c.rotY += (target.rotY - c.rotY) * s;
    c.posX += (target.posX - c.posX) * s;
    c.posY += (target.posY - c.posY) * s;
    c.tilt += (target.tilt - c.tilt) * s;
    c.scale += (target.scale - c.scale) * s;

    if (group.current) {
      group.current.rotation.y = c.rotY;
      group.current.rotation.z = c.tilt;
      group.current.position.x = c.posX;
      group.current.position.y = c.posY;
      const sc = c.scale * scale;
      group.current.scale.set(sc, sc, sc);
    }
  });

  return (
    <group ref={group}>
      <group position={[0, -1.6, 0]}>
        {/* Glass body */}
        <mesh ref={bodyRef} geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={"#2f6b4f"}
            transmission={0.88}
            thickness={1.1}
            roughness={0.08}
            metalness={0}
            ior={1.45}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
            attenuationColor={"#2f6b4f"}
            attenuationDistance={1.2}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Label wrap */}
        <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI * 0.15, 0]}>
          <cylinderGeometry args={[0.585, 0.6, 1.05, 48, 1, true, 0, Math.PI * 1.35]} />
          <meshStandardMaterial
            map={labelTexture}
            roughness={0.55}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Cap */}
        <mesh ref={capRef} position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.16, 0.19, 0.32, 24]} />
          <meshStandardMaterial color={"#1d4e89"} roughness={0.35} metalness={0.4} />
        </mesh>
        <mesh position={[0, 3.7, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={"#f4b400"} roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

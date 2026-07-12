import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clampMap, journey } from "../lib/journeyStore";

const GLASS_PROFILE = [
  [0, 0], [0.58, 0], [0.66, 0.05], [0.69, 0.16], [0.7, 0.34],
  [0.7, 2.15], [0.68, 2.35], [0.6, 2.56], [0.46, 2.75], [0.28, 2.9],
  [0.22, 3.08], [0.22, 3.48], [0.2, 3.58],
].map(([x, y]) => new THREE.Vector2(x, y));

const LIQUID_PROFILE = [
  [0, 0.13], [0.58, 0.13], [0.62, 0.22], [0.64, 0.38], [0.64, 2.18],
  [0.61, 2.34], [0.52, 2.5], [0.36, 2.64], [0.23, 2.72], [0, 2.72],
].map(([x, y]) => new THREE.Vector2(x, y));

function createLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 8) {
    ctx.fillStyle = y % 16 ? "rgba(95,73,45,.018)" : "rgba(255,255,255,.08)";
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.strokeStyle = "#6e2528";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 30, canvas.width - 64, canvas.height - 60);
  ctx.strokeStyle = "rgba(23,35,49,.3)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(44, 42, canvas.width - 88, canvas.height - 84);

  ctx.textAlign = "center";
  ctx.fillStyle = "#172331";
  ctx.font = "600 30px Manrope, Arial, sans-serif";
  ctx.fillText("ALLEN PARK, MICHIGAN", 600, 116);

  ctx.fillStyle = "#172331";
  ctx.font = "700 118px Georgia, serif";
  ctx.fillText("PARTY", 430, 275);
  ctx.fillStyle = "#6e2528";
  ctx.fillText("STOP", 790, 275);

  ctx.fillStyle = "#cbaf72";
  ctx.fillRect(350, 310, 500, 5);
  ctx.fillStyle = "#171716";
  ctx.font = "600 27px Manrope, Arial, sans-serif";
  ctx.fillText("YOUR FIRST STOP FOR THE PARTY", 600, 374);

  ctx.fillStyle = "#172331";
  ctx.font = "600 30px Arial, sans-serif";
  ctx.fillText("→", 126, 382);
  ctx.fillStyle = "#6e2528";
  ctx.fillText("←", 1074, 382);

  ctx.fillStyle = "rgba(23,35,49,.68)";
  ctx.font = "600 20px Manrope, Arial, sans-serif";
  ctx.fillText("A NEIGHBORHOOD FAVORITE  •  7235 ALLEN RD", 600, 456);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function Bottle() {
  const bottle = useRef(null);
  const glassGeometry = useMemo(() => new THREE.LatheGeometry(GLASS_PROFILE, 72), []);
  const liquidGeometry = useMemo(() => new THREE.LatheGeometry(LIQUID_PROFILE, 64), []);
  const labelTexture = useMemo(createLabelTexture, []);
  const pose = useRef({ x: 1.3, y: -0.1, z: 0, ry: -0.22, rz: 0, scale: 1 });

  useEffect(() => () => {
    glassGeometry.dispose();
    liquidGeometry.dispose();
    labelTexture.dispose();
  }, [glassGeometry, liquidGeometry, labelTexture]);

  useFrame((state, delta) => {
    if (!bottle.current) return;
    const p = journey.progress;
    const mobile = state.size.width < 760;
    const target = journey.reducedMotion ? getPose(0, mobile) : getPose(p, mobile);

    const speed = journey.reducedMotion ? 1 : 1 - Math.exp(-delta * 4.8);
    const current = pose.current;
    Object.keys(current).forEach((key) => { current[key] += (target[key] - current[key]) * speed; });
    bottle.current.position.set(current.x, current.y, current.z);
    bottle.current.rotation.set(0.015, current.ry, current.rz);
    bottle.current.scale.setScalar(current.scale);
    const remaining = Object.keys(current).reduce((sum, key) => sum + Math.abs(target[key] - current[key]), 0);
    if (remaining > 0.001) state.invalidate();
  });

  return (
    <group ref={bottle}>
      <group position={[0, -1.78, 0]}>
        <mesh geometry={liquidGeometry} position={[0, 0.02, 0]}>
          <meshPhysicalMaterial color="#75411f" roughness={0.2} transmission={0.05} thickness={1.2} clearcoat={0.4} attenuationColor="#9b5b2c" attenuationDistance={1.15} />
        </mesh>

        <mesh geometry={glassGeometry} castShadow>
          <meshPhysicalMaterial color="#554332" transparent opacity={0.7} transmission={0.38} thickness={0.46} roughness={0.16} ior={1.47} clearcoat={0.9} clearcoatRoughness={0.12} attenuationColor="#aa7648" attenuationDistance={2.5} envMapIntensity={1.18} side={THREE.FrontSide} />
        </mesh>

        <mesh position={[0, 1.56, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.708, 0.708, 1.2, 72, 1, true]} />
          <meshStandardMaterial map={labelTexture} roughness={0.68} metalness={0} />
        </mesh>

        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.65, 0.66, 0.13, 72]} />
          <meshPhysicalMaterial color="#d7a263" transparent opacity={0.32} transmission={0.65} roughness={0.12} ior={1.46} />
        </mesh>

        <mesh position={[0, 3.68, 0]}>
          <cylinderGeometry args={[0.205, 0.205, 0.27, 48]} />
          <meshStandardMaterial color="#6f4329" roughness={0.86} />
        </mesh>
        <mesh position={[0, 3.56, 0]}>
          <cylinderGeometry args={[0.235, 0.235, 0.11, 48]} />
          <meshStandardMaterial color="#172331" roughness={0.34} metalness={0.45} />
        </mesh>
        <mesh position={[0, 3.83, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.035, 48]} />
          <meshStandardMaterial color="#cbaf72" roughness={0.3} metalness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

function getPose(progress, mobile) {
  if (mobile) {
    if (progress <= 0.14) return { x: 0, y: -1.42, z: 0, ry: -0.06, rz: 0, scale: 0.79 };
    return { x: 1.52, y: 0.16, z: 0, ry: 0.08, rz: 0, scale: 0.38 };
  }
  if (progress <= 0.2) return { x: 1.36, y: -0.12, z: 0, ry: clampMap(progress, 0, 0.2, -0.08, 0.18), rz: 0, scale: 1.02 };
  if (progress <= 0.43) return { x: clampMap(progress, 0.2, 0.43, 1.36, 0.28), y: -0.02, z: 0, ry: clampMap(progress, 0.2, 0.43, 0.18, 0.58), rz: 0.035, scale: 0.86 };
  if (progress <= 0.63) return { x: clampMap(progress, 0.43, 0.63, 0.28, -1.18), y: 0.02, z: 0, ry: clampMap(progress, 0.43, 0.63, 0.58, 0.88), rz: -0.04, scale: 0.67 };
  if (progress <= 0.84) return { x: 1.42, y: -0.18, z: 0, ry: clampMap(progress, 0.63, 0.84, 0.88, 1.02), rz: 0.02, scale: 0.55 };
  return { x: -1.48, y: -0.08, z: 0.05, ry: clampMap(progress, 0.84, 1, 1.02, 0.02), rz: 0, scale: 0.61 };
}

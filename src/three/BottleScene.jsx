import { Component, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import StaticBottle from '../components/StaticBottle.jsx';

/* ------------------------------------------------------------------ */
/* Label texture — drawn once to a canvas and UV-wrapped on a cylinder */
/* ------------------------------------------------------------------ */
function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const x = c.getContext('2d');

  // warm cream paper
  const bg = x.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#f6efdf');
  bg.addColorStop(1, '#efe5cf');
  x.fillStyle = bg;
  x.fillRect(0, 0, 1024, 512);

  // subtle paper speckle
  x.globalAlpha = 0.05;
  for (let i = 0; i < 900; i++) {
    x.fillStyle = i % 2 ? '#8a7a5a' : '#ffffff';
    x.fillRect(Math.random() * 1024, Math.random() * 512, 1.6, 1.6);
  }
  x.globalAlpha = 1;

  // fine double border
  x.strokeStyle = '#7c292d';
  x.lineWidth = 7;
  x.strokeRect(28, 28, 968, 456);
  x.lineWidth = 2;
  x.strokeRect(50, 50, 924, 412);

  const center = 512;

  // small blue arrows either side of the top rule
  x.fillStyle = '#264d73';
  x.font = '600 34px Georgia, serif';
  x.textAlign = 'center';
  x.fillText('→', center - 210, 148);
  x.fillText('←', center + 210, 148);

  x.fillStyle = '#264d73';
  x.font = '600 26px Georgia, serif';
  x.fillText('A L L E N   P A R K ,   M I C H I G A N', center, 146);

  // main mark
  x.fillStyle = '#7c292d';
  x.font = '96px Georgia, serif';
  x.fillText('PARTY STOP', center, 268);

  // thin amber rule
  x.strokeStyle = '#c88a2d';
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(center - 250, 312);
  x.lineTo(center + 250, 312);
  x.stroke();

  x.fillStyle = '#4a3c2a';
  x.font = '400 27px Georgia, serif';
  x.fillText('YOUR FIRST STOP FOR A GOOD NIGHT', center, 372);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 8, 128, 128, 120);
  g.addColorStop(0, 'rgba(20,18,12,0.42)');
  g.addColorStop(0.6, 'rgba(20,18,12,0.16)');
  g.addColorStop(1, 'rgba(20,18,12,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/* ------------------------------------------------------------------ */
/* Bottle                                                              */
/* ------------------------------------------------------------------ */
const PROFILE = [
  [0.0, 0.02],
  [0.3, 0.02],
  [0.52, 0.05],
  [0.6, 0.13],
  [0.62, 0.38],
  [0.62, 1.72],
  [0.6, 1.88],
  [0.5, 2.04],
  [0.33, 2.19],
  [0.21, 2.33],
  [0.17, 2.5],
  [0.165, 2.84],
  [0.19, 2.89],
  [0.19, 3.0],
  [0.165, 3.02],
];

function Bottle({ progressRef, interactive, quality }) {
  const group = useRef();
  const inner = useRef();
  const pointer = useRef({ x: 0, y: 0 });

  const lathePoints = useMemo(
    () => PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
    []
  );
  const labelTex = useMemo(() => makeLabelTexture(), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);

  const glassMat = useMemo(() => {
    if (quality === 'high') {
      return new THREE.MeshPhysicalMaterial({
        color: '#9c5a16',
        roughness: 0.07,
        metalness: 0,
        transmission: 0.72,
        thickness: 1.4,
        ior: 1.45,
        attenuationColor: new THREE.Color('#7a4210'),
        attenuationDistance: 1.6,
        clearcoat: 0.55,
        clearcoatRoughness: 0.18,
        envMapIntensity: 0.9,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#8a4c12',
      roughness: 0.12,
      metalness: 0.05,
      transparent: true,
      opacity: 0.97,
      clearcoat: 0.5,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.0,
    });
  }, [quality]);

  useFrame((state) => {
    if (!group.current) return;
    const p = progressRef ? progressRef.current : 0;
    const t = state.clock.elapsedTime;

    if (interactive) {
      pointer.current.x +=
        (state.pointer.x - pointer.current.x) * 0.06;
      pointer.current.y +=
        (state.pointer.y - pointer.current.y) * 0.06;
    }

    // Base pose + gentle idle sway + pointer tilt (≈3–5°) + scroll rotation
    const targetY =
      0.35 + Math.sin(t * 0.25) * 0.03 + pointer.current.x * 0.08 + p * 1.5;
    const targetX = 0.02 - pointer.current.y * 0.05 + p * 0.06;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.12;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.12;

    // Signature transition: camera appears to dive into the glass
    const s = 1 + p * 1.9;
    inner.current.scale.setScalar(s);
    inner.current.position.z = p * 1.6;
    inner.current.position.y = -p * 0.35;
  });

  return (
    <group ref={inner}>
      <group ref={group} position={[0, -1.58, 0]}>
        {/* glass body */}
        <mesh castShadow>
          <latheGeometry args={[lathePoints, 96]} />
          <primitive object={glassMat} attach="material" />
        </mesh>

        {/* label — wraps the body at mid-height, just above the glass */}
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry
            args={[0.632, 0.632, 0.98, 64, 1, true, -1.15, 2.3]}
          />
          <meshStandardMaterial
            map={labelTex}
            roughness={0.65}
            metalness={0}
            side={THREE.FrontSide}
            transparent
          />
        </mesh>

        {/* cap */}
        <mesh position={[0, 3.12, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 48]} />
          <meshStandardMaterial
            color="#1b1c1a"
            roughness={0.38}
            metalness={0.25}
          />
        </mesh>
        <mesh position={[0, 2.94, 0]}>
          <cylinderGeometry args={[0.175, 0.175, 0.06, 48]} />
          <meshStandardMaterial color="#7c292d" roughness={0.5} />
        </mesh>

        {/* soft contact shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial
            map={shadowTex}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* Nudge the label into place: cylinder is centered at group origin, so
   wrap it in a positioned group instead. Simplest: patch via onUpdate. */

function Lights({ interactive }) {
  const key = useRef();
  useFrame((state) => {
    if (!key.current || !interactive) return;
    key.current.position.x +=
      (3 + state.pointer.x * 1.1 - key.current.position.x) * 0.05;
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      {/* large soft key */}
      <directionalLight ref={key} position={[3, 5, 4]} intensity={2.1} color="#fff6e8" />
      {/* warm rim */}
      <directionalLight position={[-4.5, 3, -3]} intensity={1.3} color="#ffb45e" />
      {/* cool fill */}
      <directionalLight position={[-2.5, 1.2, 4]} intensity={0.55} color="#9fc0e8" />
    </>
  );
}

function Env() {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl, scene]);
  return null;
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticBottle /> : this.props.children;
  }
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export default function BottleScene({
  progressRef,
  interactive = true,
  quality = 'high',
}) {
  if (typeof window !== 'undefined' && !webglAvailable()) {
    return <StaticBottle />;
  }
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 6.3], fov: 33 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <Env />
        <Lights interactive={interactive} />
        <Bottle
          progressRef={progressRef}
          interactive={interactive}
          quality={quality}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}

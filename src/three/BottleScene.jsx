import { Component, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import StaticBottle from '../components/StaticBottle.jsx';

/* ==================================================================
   TEXTURES (all generated once - no downloads, nothing to compress)
   ================================================================== */

/** Refined, smaller label: cream paper, fine burgundy border, blue details. */
function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 640;
  const x = c.getContext('2d');

  const bg = x.createLinearGradient(0, 0, 0, 640);
  bg.addColorStop(0, '#f7f0e1');
  bg.addColorStop(1, '#efe4cd');
  x.fillStyle = bg;
  x.fillRect(0, 0, 1024, 640);

  x.globalAlpha = 0.045;
  for (let i = 0; i < 1200; i++) {
    x.fillStyle = i % 2 ? '#8a7a5a' : '#ffffff';
    x.fillRect(Math.random() * 1024, Math.random() * 640, 1.4, 1.4);
  }
  x.globalAlpha = 1;

  x.strokeStyle = '#7c292d';
  x.lineWidth = 4;
  x.strokeRect(24, 24, 976, 592);
  x.lineWidth = 1.5;
  x.strokeRect(42, 42, 940, 556);

  const cx = 512;
  x.textAlign = 'center';

  x.fillStyle = '#264d73';
  x.font = '600 30px Georgia, serif';
  x.fillText('→', cx - 232, 136);
  x.fillText('←', cx + 232, 136);
  x.font = '600 24px Georgia, serif';
  x.fillText('A L L E N   P A R K ,   M I C H I G A N', cx, 134);

  x.fillStyle = '#7c292d';
  x.font = '112px Georgia, serif';
  x.fillText('PARTY STOP', cx, 316);

  x.strokeStyle = '#c88a2d';
  x.lineWidth = 2.5;
  x.beginPath();
  x.moveTo(cx - 260, 366);
  x.lineTo(cx - 14, 366);
  x.moveTo(cx + 14, 366);
  x.lineTo(cx + 260, 366);
  x.stroke();
  x.save();
  x.translate(cx, 366);
  x.rotate(Math.PI / 4);
  x.fillStyle = '#c88a2d';
  x.fillRect(-5, -5, 10, 10);
  x.restore();

  x.fillStyle = '#4a3c2a';
  x.font = '400 26px Georgia, serif';
  x.fillText('YOUR FIRST STOP FOR A GOOD NIGHT', cx, 436);

  x.fillStyle = '#264d73';
  x.font = '600 20px Georgia, serif';
  x.fillText('BEER  •  WINE  •  SPIRITS  •  ESSENTIALS', cx, 542);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Natural cork speckle. */
function makeCorkTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#c09263';
  x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 420; i++) {
    x.fillStyle = i % 3 ? 'rgba(122,84,46,0.35)' : 'rgba(230,200,160,0.4)';
    const w = 2 + Math.random() * 6;
    x.fillRect(Math.random() * 256, Math.random() * 256, w, w * 0.6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft elliptical contact shadow. */
function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 6, 128, 128, 118);
  g.addColorStop(0, 'rgba(24,18,10,0.4)');
  g.addColorStop(0.55, 'rgba(24,18,10,0.14)');
  g.addColorStop(1, 'rgba(24,18,10,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/** Warm amber floor glow under the glass. */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 4, 128, 128, 120);
  g.addColorStop(0, 'rgba(200,138,45,0.35)');
  g.addColorStop(0.5, 'rgba(200,138,45,0.12)');
  g.addColorStop(1, 'rgba(200,138,45,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ==================================================================
   GEOMETRY - slimmer body, elegant shoulders, thick base, flared lip
   ================================================================== */
const PROFILE = [
  [0.0, 0.02],
  [0.3, 0.02],
  [0.46, 0.05],
  [0.52, 0.16],
  [0.535, 0.44],
  [0.535, 1.95],
  [0.52, 2.12],
  [0.44, 2.3],
  [0.3, 2.46],
  [0.2, 2.6],
  [0.157, 2.78],
  [0.15, 3.1],
  [0.172, 3.14],
  [0.172, 3.24],
  [0.148, 3.26],
];

// Inner "liquid" body for visual depth behind the glass (desktop only)
const LIQUID = [
  [0.0, 0.3],
  [0.44, 0.3],
  [0.47, 0.5],
  [0.47, 1.9],
  [0.4, 2.1],
  [0.24, 2.32],
  [0.13, 2.5],
  [0.0, 2.5],
];

const toVec2 = (pts) => pts.map(([r, y]) => new THREE.Vector2(r, y));

/* ==================================================================
   BOTTLE
   ================================================================== */
function Bottle({ progressRef, interactive, quality, entrance }) {
  const spin = useRef();
  const outer = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  const lathePoints = useMemo(() => toVec2(PROFILE), []);
  const liquidPoints = useMemo(() => toVec2(LIQUID), []);
  const labelTex = useMemo(() => makeLabelTexture(), []);
  const corkTex = useMemo(() => makeCorkTexture(), []);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);

  const glassMat = useMemo(() => {
    if (quality === 'high') {
      // Translucent amber glass - tuned approximation, not a simulation
      return new THREE.MeshPhysicalMaterial({
        color: '#c08434',
        roughness: 0.16,
        metalness: 0,
        transmission: 0.62,
        thickness: 1.1,
        ior: 1.5,
        attenuationColor: new THREE.Color('#5e3208'),
        attenuationDistance: 1.05,
        clearcoat: 0.55,
        clearcoatRoughness: 0.25,
        envMapIntensity: 0.7,
        specularIntensity: 0.85,
      });
    }
    // Mobile: cheap but still glassy - no transmission pass
    return new THREE.MeshPhysicalMaterial({
      color: '#94581a',
      roughness: 0.18,
      metalness: 0.04,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.5,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.9,
    });
  }, [quality]);

  // Mobile entrance: one subtle 8-degree settle, driven through invalidate()
  useEffect(() => {
    if (!entrance || !spin.current) return;
    const state = { r: -0.14 };
    const tween = gsap.to(state, {
      r: 0,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        if (spin.current) spin.current.rotation.y = 0.32 + state.r;
        invalidate();
      },
    });
    return () => tween.kill();
  }, [entrance, invalidate]);

  useFrame((state) => {
    if (!spin.current || !outer.current) return;
    const p = progressRef ? progressRef.current : 0;
    const t = state.clock.elapsedTime;

    if (interactive) {
      pointer.current.x += (state.pointer.x - pointer.current.x) * 0.06;
      pointer.current.y += (state.pointer.y - pointer.current.y) * 0.06;
    }

    if (!entrance) {
      // pointer tilt kept to ~2-4 degrees, slow idle sway of a few pixels
      const targetY =
        0.32 + Math.sin(t * 0.22) * 0.025 + pointer.current.x * 0.06 + p * 1.4;
      const targetX = 0.01 - pointer.current.y * 0.04 + p * 0.05;
      spin.current.rotation.y += (targetY - spin.current.rotation.y) * 0.1;
      spin.current.rotation.x += (targetX - spin.current.rotation.x) * 0.1;
      outer.current.position.y = Math.sin(t * 0.35) * 0.02 - p * 0.35;
    } else {
      // mobile: mostly stable; only the small scroll rotation
      spin.current.rotation.y = 0.32 + p * 0.5;
    }

    // signature transition: scale toward camera as the hero pin scrubs
    const s = 1 + p * 1.9;
    outer.current.scale.setScalar(s);
    outer.current.position.z = p * 1.7;
  });

  return (
    <group ref={outer}>
      <group position={[0, -1.72, 0]}>
        <group ref={spin} rotation={[0, 0.32, 0]}>
          {/* subtle elliptical cross-section so it never reads as a
              primitive cylinder */}
          <group scale={[1, 1, 0.9]}>
            {/* glass body */}
            <mesh>
              <latheGeometry args={[lathePoints, 96]} />
              <primitive object={glassMat} attach="material" />
            </mesh>

            {/* inner amber liquid - depth + darker core (desktop only) */}
            {quality === 'high' && (
              <mesh scale={[0.96, 1, 0.96]}>
                <latheGeometry args={[liquidPoints, 64]} />
                <meshStandardMaterial
                  color="#622f07"
                  roughness={0.35}
                  metalness={0}
                  transparent
                  opacity={0.92}
                />
              </mesh>
            )}

            {/* label - smaller, wrapped on the body */}
            <mesh position={[0, 1.14, 0]}>
              <cylinderGeometry
                args={[0.542, 0.542, 0.62, 64, 1, true, -0.95, 1.9]}
              />
              <meshStandardMaterial
                map={labelTex}
                bumpMap={quality === 'high' ? labelTex : null}
                bumpScale={0.0015}
                roughness={0.72}
                metalness={0}
                side={THREE.FrontSide}
                transparent
              />
            </mesh>

            {/* thin glass ring at the neck - small premium detail */}
            <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.168, 0.012, 12, 48]} />
              <primitive object={glassMat} attach="material" />
            </mesh>
          </group>

          {/* brushed dark-metal collar */}
          <mesh position={[0, 3.16, 0]}>
            <cylinderGeometry args={[0.162, 0.155, 0.24, 48]} />
            <meshStandardMaterial
              color="#3a3f45"
              metalness={0.85}
              roughness={0.38}
              envMapIntensity={1.1}
            />
          </mesh>
          <mesh position={[0, 3.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.158, 0.008, 10, 48]} />
            <meshStandardMaterial color="#23262a" metalness={0.8} roughness={0.4} />
          </mesh>

          {/* natural cork with rounded top */}
          <mesh position={[0, 3.36, 0]}>
            <cylinderGeometry args={[0.128, 0.135, 0.18, 40]} />
            <meshStandardMaterial map={corkTex} roughness={0.9} metalness={0} />
          </mesh>
          <mesh position={[0, 3.45, 0]}>
            <sphereGeometry args={[0.128, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial map={corkTex} roughness={0.9} metalness={0} />
          </mesh>
        </group>

        {/* grounded contact shadow - offset away from the upper-left key */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0.22, 0.004, 0]}
          scale={[1.45, 0.7, 1]}
        >
          <planeGeometry args={[2.2, 2.2]} />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
        {/* reflected amber glow beneath the glass */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.002, 0]}
          scale={[1.1, 0.5, 1]}
        >
          <planeGeometry args={[2.4, 2.4]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ==================================================================
   LIGHTING - product-photography setup
   ================================================================== */
function Lights({ interactive }) {
  const key = useRef();
  useFrame((state) => {
    if (!key.current || !interactive) return;
    key.current.position.x +=
      (-4 + state.pointer.x * 0.9 - key.current.position.x) * 0.05;
  });
  return (
    <>
      <ambientLight intensity={0.32} />
      {/* large soft key - upper left */}
      <directionalLight
        ref={key}
        position={[-4, 5.5, 3.5]}
        intensity={1.9}
        color="#fff5e6"
      />
      {/* warm rim - behind right, catches the shoulder */}
      <directionalLight position={[4, 3.2, -3.5]} intensity={1.15} color="#ffb45e" />
      {/* soft cool fill - front right */}
      <directionalLight position={[3, 1.2, 4]} intensity={0.45} color="#9fc0e8" />
      {/* soft front reflection card */}
      <directionalLight position={[0, 1.6, 6]} intensity={0.25} color="#fdf8ef" />
    </>
  );
}

function Env({ quality }) {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(
      new RoomEnvironment(),
      quality === 'high' ? 0.04 : 0.1
    ).texture;
  }, [gl, scene, quality]);
  return null;
}

/** Exposes invalidate() to the host so scroll updates can request frames. */
function InvalidateBridge({ apiRef }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (apiRef) apiRef.current = { invalidate };
    return () => {
      if (apiRef) apiRef.current = null;
    };
  }, [apiRef, invalidate]);
  return null;
}

/* ==================================================================
   BOUNDARIES / SUPPORT
   ================================================================== */
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

/* ==================================================================
   PUBLIC COMPONENT
   quality: 'high' (desktop/tablet) | 'lite' (mobile - demand frames,
   cheaper material, no transmission, entrance rotation only)
   ================================================================== */
export default function BottleScene({
  progressRef,
  interactive = true,
  quality = 'high',
  apiRef,
}) {
  const holder = useRef(null);
  const lite = quality !== 'high';
  // Pause continuous rendering whenever the canvas leaves the viewport.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!holder.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(holder.current);
    return () => io.disconnect();
  }, []);

  if (typeof window !== 'undefined' && !webglAvailable()) {
    return <StaticBottle />;
  }

  const frameloop = lite ? 'demand' : inView ? 'always' : 'demand';

  return (
    <div ref={holder} style={{ width: '100%', height: '100%' }}>
      <SceneErrorBoundary>
        <Canvas
          frameloop={frameloop}
          dpr={lite ? [1, 1.5] : [1, 1.75]}
          camera={{ position: [0.1, 0.15, 7], fov: 30 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <Env quality={quality} />
          <Lights interactive={interactive} />
          <Bottle
            progressRef={progressRef}
            interactive={interactive}
            quality={quality}
            entrance={lite}
          />
          <InvalidateBridge apiRef={apiRef} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

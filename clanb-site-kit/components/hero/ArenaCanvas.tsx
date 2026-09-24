"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeArenaTexture } from "./makeArenaTexture";
import { usePrefersReducedMotion } from "@/lib/motion";

export interface ArenaCanvasApi {
  setZoom: (v: number) => void;
  setPulse: (v: number) => void;
}

interface ArenaCanvasProps {
  className?: string;
  onReady?: (api: ArenaCanvasApi) => void;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform float uTime, uZoom, uPulse, uHover;
uniform vec2 uResolution, uImageSize;
uniform vec3 uSignal, uCyan;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
  float sa = res.x / max(res.y, 1.0);
  float ia = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  if (sa > ia) s.y = ia / sa; else s.x = sa / ia;
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float z = mix(1.0, 1.45, clamp(uZoom, 0.0, 1.0));
  vec2 uv = coverUv(vUv, uResolution, uImageSize);
  uv -= 0.5;
  uv *= 1.0 / z;
  uv.x += 0.05;
  uv.x += sin(uTime * 0.12) * 0.008 * (0.4 + uHover);
  uv.y += cos(uTime * 0.1) * 0.006;
  uv += 0.5;

  vec4 tex = texture2D(uMap, clamp(uv, 0.001, 0.999));
  float glowMask = smoothstep(0.12, 0.52, max(tex.g, tex.b) - tex.r * 0.35);

  vec2 rainUv = vec2(uv.x * 55.0, uv.y * 90.0 - uTime * 6.0);
  float col = hash(vec2(floor(rainUv.x), 0.0));
  float stream = step(0.62, col) * step(0.7, fract(rainUv.y + col * 4.0 + uTime)) * smoothstep(0.18, 0.85, glowMask);

  float d = length(uv - vec2(0.58, 0.5));
  float ring = smoothstep(0.02, 0.0, abs(d - fract(uTime * 0.15) * 0.55)) * (0.35 + uPulse * 0.45);

  float n1 = smoothstep(0.992, 1.0, sin(uv.x * 48.0 + uTime * 0.25) * sin(uv.y * 36.0));
  float arc = smoothstep(0.012, 0.0, abs(uv.y - 0.42 - 0.04 * sin(uv.x * 9.0 + uTime * 0.35)));
  arc += smoothstep(0.01, 0.0, abs(uv.x - 0.62 - 0.03 * cos(uv.y * 8.0)));

  vec3 color = tex.rgb;
  color += mix(uSignal, uCyan, 0.55) * glowMask * (0.12 + uPulse * 0.18 + uHover * 0.14);
  color += uCyan * stream * 0.4;
  color += uSignal * ring * glowMask;
  color += mix(uCyan, uSignal, 0.4) * (n1 * 0.45 + arc * 0.2);

  float vig = smoothstep(1.2, 0.28, length((vUv - 0.5) * vec2(1.12, 1.05)));
  color *= mix(0.62, 1.0, vig);
  color = pow(color, vec3(0.96));

  gl_FragColor = vec4(color, 1.0);
}
`;

function Scene({
  zoomRef,
  pulseRef,
  hoverRef,
}: {
  zoomRef: React.RefObject<number>;
  pulseRef: React.RefObject<number>;
  hoverRef: React.RefObject<number>;
}) {
  const { viewport, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Particles refs
  const pointsARef = useRef<THREE.Points>(null);
  const pointsBRef = useRef<THREE.Points>(null);
  const materialBRef = useRef<THREE.PointsMaterial>(null);

  // Generate procedural plate texture
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return makeArenaTexture();
  }, []);

  const uniforms = useMemo(() => {
    return {
      uMap: { value: texture },
      uTime: { value: 0 },
      uZoom: { value: 0 },
      uPulse: { value: 0.35 },
      uHover: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageSize: { value: new THREE.Vector2(2048, 1152) },
      uSignal: { value: new THREE.Color("#5CF111") },
      uCyan: { value: new THREE.Color("#06B6D4") },
    };
  }, [texture, size.width, size.height]);

function createParticlesA(): THREE.BufferGeometry {
  const count = 110;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = Math.abs(Math.sin(i * 12.9898 + 1.234)) % 1;
    const r2 = Math.abs(Math.sin(i * 78.233 + 4.567)) % 1;
    const r3 = Math.abs(Math.sin(i * 45.123 + 8.901)) % 1;
    positions[i * 3 + 0] = (r1 - 0.5) * 6; // ±3
    positions[i * 3 + 1] = (r2 - 0.5) * 4; // ±2
    positions[i * 3 + 2] = -1.6 + r3 * 1.4; // [-1.6, -0.2]
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geom;
}

function createParticlesB(): THREE.BufferGeometry {
  const count = 40;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = Math.abs(Math.sin(i * 91.234 + 2.345)) % 1;
    const r2 = Math.abs(Math.sin(i * 37.567 + 6.789)) % 1;
    const r3 = Math.abs(Math.sin(i * 63.891 + 1.112)) % 1;
    positions[i * 3 + 0] = (r1 - 0.15) * 4.5;
    positions[i * 3 + 1] = (r2 - 0.5) * 3.2; // ±1.6
    positions[i * 3 + 2] = 0.05 + r3 * 0.35; // [.05, .4]
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geom;
}

// In Scene:
  // Particles A: 110 points cyan
  const particlesA = useMemo(() => createParticlesA(), []);

  // Particles B: 40 points lime
  const particlesB = useMemo(() => createParticlesB(), []);

  useFrame(() => {
    const t = performance.now() / 1000;
    const currentHover = hoverRef.current ?? 0;
    const currentZoom = zoomRef.current ?? 0;
    const currentPulse = pulseRef.current ?? 0.35;

    // Plane group motion
    if (groupRef.current) {
      groupRef.current.rotation.y = 0.06 * Math.sin(0.35 * t) + 0.08 * currentHover;
      groupRef.current.rotation.x = 0.03 * Math.cos(0.28 * t) - 0.04 * currentHover;
      groupRef.current.rotation.z = 0.015 * Math.sin(0.2 * t);

      const k = (1 + 0.18 * currentZoom) * (1 + 0.014 * Math.sin(1.5 * t) * (0.5 + currentPulse));
      groupRef.current.scale.set(
        k * (1 + 0.08 * currentZoom),
        k * (1 + 0.12 * currentZoom),
        1
      );
    }

    // Material uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uZoom.value = currentZoom;
      materialRef.current.uniforms.uPulse.value = currentPulse;
      materialRef.current.uniforms.uHover.value +=
        (currentHover - materialRef.current.uniforms.uHover.value) * 0.07;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }

    // Particles A animation
    if (pointsARef.current) {
      pointsARef.current.rotation.y = 0.03 * t;
      const scaleA = 1 + 0.15 * currentZoom;
      pointsARef.current.scale.set(scaleA, scaleA, scaleA);
    }

    // Particles B animation
    if (pointsBRef.current) {
      pointsBRef.current.rotation.z = 0.04 * Math.sin(0.15 * t);
      if (materialBRef.current) {
        materialBRef.current.opacity = 0.35 + 0.2 * Math.sin(2.2 * t);
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <planeGeometry args={[1.1 * viewport.width, 1.1 * viewport.height]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            uniforms={uniforms}
          />
        </mesh>
      </group>

      {/* Particles A (Cyan) */}
      <points ref={pointsARef} geometry={particlesA}>
        <pointsMaterial
          size={0.018}
          color="#06B6D4"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>

      {/* Particles B (Lime) */}
      <points ref={pointsBRef} geometry={particlesB}>
        <pointsMaterial
          ref={materialBRef}
          size={0.03}
          color="#5CF111"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export function ArenaCanvas({ className, onReady }: ArenaCanvasProps) {
  const zoomRef = useRef<number>(0);
  const pulseRef = useRef<number>(0.35);
  const hoverRef = useRef<number>(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (onReady) {
      onReady({
        setZoom: (v: number) => {
          zoomRef.current = v;
        },
        setPulse: (v: number) => {
          pulseRef.current = v;
        },
      });
    }
  }, [onReady]);

  return (
    <div
      className={className}
      onPointerEnter={() => {
        hoverRef.current = 1;
        pulseRef.current = 0.9;
      }}
      onPointerLeave={() => {
        hoverRef.current = 0;
        pulseRef.current = 0.35;
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <color attach="background" args={["#030706"]} />
        <ambientLight intensity={0.4} />
        <Scene zoomRef={zoomRef} pulseRef={pulseRef} hoverRef={hoverRef} />
      </Canvas>
    </div>
  );
}

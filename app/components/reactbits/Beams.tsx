"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
}

function BeamMesh({
  beamWidth = 2,
  beamHeight = 8,
  beamNumber = 12,
  lightColor = "#8b5cf6",
  speed = 1,
  noiseIntensity = 0.6,
  scale = 1,
  rotation = 0,
}: BeamsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const color = useMemo(() => new THREE.Color(lightColor), [lightColor]);

  // Create beam geometries
  const beams = useMemo(() => {
    const arr = [];
    for (let i = 0; i < beamNumber; i++) {
      const x = (i / beamNumber - 0.5) * beamWidth * 4;
      const z = (Math.random() - 0.5) * 2;
      const w = 0.02 + Math.random() * 0.08;
      const h = beamHeight * (0.5 + Math.random() * 0.5);
      const opacity = 0.1 + Math.random() * 0.3;
      const phaseOffset = Math.random() * Math.PI * 2;
      arr.push({ x, z, w, h, opacity, phaseOffset });
    }
    return arr;
  }, [beamNumber, beamWidth, beamHeight]);

  const vertexShader = `
    varying vec2 vUv;
    varying float vY;
    uniform float uTime;
    uniform float uNoiseIntensity;
    uniform float uPhaseOffset;

    // Simple noise
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    float noise(float p) {
      float i = floor(p);
      float f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash(i), hash(i + 1.0), f);
    }

    void main() {
      vUv = uv;
      vY = position.y;
      vec3 pos = position;

      // Wavy displacement
      float n = noise(pos.y * 2.0 + uTime + uPhaseOffset) * 2.0 - 1.0;
      pos.x += n * uNoiseIntensity * 0.3;

      // Slight sway
      pos.x += sin(uTime * 0.5 + uPhaseOffset) * 0.1;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vY;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;

    void main() {
      // Vertical fade
      float fadeY = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
      // Horizontal fade (beam edges)
      float fadeX = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

      // Glow pulse
      float pulse = 0.8 + sin(uTime * 2.0 + vY * 3.0) * 0.2;

      float alpha = fadeY * fadeX * uOpacity * pulse;

      // Core glow
      float core = smoothstep(0.5, 0.0, abs(vUv.x - 0.5)) * 0.5;
      vec3 col = uColor + core * 0.3;

      gl_FragColor = vec4(col, alpha);
    }
  `;

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    meshRefs.current.forEach((mesh) => {
      if (mesh) {
        const mat = mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = t;
      }
    });
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {beams.map((beam, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          position={[beam.x, 0, beam.z]}
        >
          <planeGeometry args={[beam.w, beam.h, 1, 32]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            uniforms={{
              uTime: { value: 0 },
              uColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
              uOpacity: { value: beam.opacity },
              uNoiseIntensity: { value: noiseIntensity },
              uPhaseOffset: { value: beam.phaseOffset },
            }}
          />
        </mesh>
      ))}
      {/* Ambient directional light for glow */}
      <directionalLight color={lightColor} intensity={0.5} position={[0, 5, 3]} />
      <ambientLight intensity={0.05} />
    </group>
  );
}

export default function Beams(props: BeamsProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: false }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <BeamMesh {...props} />
    </Canvas>
  );
}

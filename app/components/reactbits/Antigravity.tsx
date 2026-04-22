"use client";

import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AntigravityParticlesProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "circle" | "square";
  fieldStrength?: number;
}

function Particles({
  count = 200,
  magnetRadius = 8,
  ringRadius = 3,
  waveSpeed = 1.5,
  waveAmplitude = 0.5,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = "#06b6d4",
  autoAnimate = true,
  particleVariance = 0.8,
  rotationSpeed = 0.3,
  depthFactor = 1.5,
  pulseSpeed = 1,
  particleShape = "circle",
  fieldStrength = 1,
}: AntigravityParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, pointer } = useThree();
  const mousePos = useRef(new THREE.Vector2(0, 0));
  const autoTime = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Particle data
  const particles = useMemo(() => {
    const arr: {
      position: THREE.Vector3;
      target: THREE.Vector3;
      home: THREE.Vector3;
      speed: number;
      offset: number;
      scale: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * depthFactor * 4;
      const home = new THREE.Vector3(x, y, z);
      arr.push({
        position: home.clone(),
        target: home.clone(),
        home: home.clone(),
        speed: 0.8 + Math.random() * particleVariance,
        offset: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.6,
      });
    }
    return arr;
  }, [count, viewport.width, viewport.height, depthFactor, particleVariance]);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Update mouse position
    if (autoAnimate) {
      autoTime.current += 0.008;
      const ax = Math.sin(autoTime.current * 0.7) * viewport.width * 0.3;
      const ay = Math.cos(autoTime.current * 0.5) * viewport.height * 0.3;
      mousePos.current.set(
        pointer.x * viewport.width * 0.5 + ax * 0.3,
        pointer.y * viewport.height * 0.5 + ay * 0.3
      );
    } else {
      mousePos.current.set(
        pointer.x * viewport.width * 0.5,
        pointer.y * viewport.height * 0.5
      );
    }

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const dx = p.position.x - mousePos.current.x;
      const dy = p.position.y - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < magnetRadius) {
        // Push towards ring around cursor
        const angle = Math.atan2(dy, dx) + time * rotationSpeed * p.speed;
        const wave =
          Math.sin(time * waveSpeed + p.offset) * waveAmplitude;
        const r = ringRadius + wave;
        p.target.x = mousePos.current.x + Math.cos(angle) * r;
        p.target.y = mousePos.current.y + Math.sin(angle) * r;
        p.target.z = Math.sin(time * pulseSpeed + p.offset) * depthFactor;
      } else {
        // Return home with gentle float
        p.target.x =
          p.home.x + Math.sin(time * 0.5 + p.offset) * 0.3 * fieldStrength;
        p.target.y =
          p.home.y + Math.cos(time * 0.3 + p.offset) * 0.3 * fieldStrength;
        p.target.z = p.home.z + Math.sin(time * 0.2 + p.offset) * 0.5;
      }

      // Lerp to target
      p.position.lerp(p.target, lerpSpeed * p.speed);

      // Update instance matrix
      dummy.position.copy(p.position);
      const s = p.scale * particleSize * 0.1;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    if (particleShape === "square") {
      return new THREE.PlaneGeometry(1, 1);
    }
    return new THREE.CircleGeometry(0.5, 16);
  }, [particleShape]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <meshBasicMaterial color={colorObj} transparent opacity={0.6} />
    </instancedMesh>
  );
}

interface AntigravityProps extends AntigravityParticlesProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Antigravity({
  className = "",
  style,
  ...particleProps
}: AntigravityProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 35 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles {...particleProps} />
      </Canvas>
    </div>
  );
}

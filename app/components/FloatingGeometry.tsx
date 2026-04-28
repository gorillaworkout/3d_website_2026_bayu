'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  shape,
  color,
  speed,
  scale,
}: {
  position: [number, number, number];
  shape: 'octahedron' | 'torus' | 'icosahedron' | 'box';
  color: string;
  speed: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialProps = useMemo(
    () => ({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    }),
    [color]
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.3;
      meshRef.current.rotation.y += delta * speed * 0.2;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 8, 16]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      default:
        return <octahedronGeometry args={[1, 0]} />;
    }
  }, [shape]);

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshBasicMaterial {...materialProps} />
      </mesh>
    </Float>
  );
}

interface FloatingGeometryProps {
  accentColor?: string;
  className?: string;
}

export default function FloatingGeometry({
  accentColor = '#22d3ee',
  className = '',
}: FloatingGeometryProps) {
  const shapes = useMemo(
    () => [
      { position: [-3, 2, -5] as [number, number, number], shape: 'octahedron' as const, speed: 1.5, scale: 0.6 },
      { position: [4, -1, -8] as [number, number, number], shape: 'torus' as const, speed: 1.0, scale: 0.8 },
      { position: [-2, -3, -6] as [number, number, number], shape: 'icosahedron' as const, speed: 2.0, scale: 0.4 },
      { position: [3, 3, -10] as [number, number, number], shape: 'box' as const, speed: 0.8, scale: 0.5 },
      { position: [0, -2, -12] as [number, number, number], shape: 'octahedron' as const, speed: 1.2, scale: 0.3 },
    ],
    []
  );

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        {shapes.map((s, i) => (
          <FloatingShape
            key={i}
            position={s.position}
            shape={s.shape}
            color={accentColor}
            speed={s.speed}
            scale={s.scale}
          />
        ))}
      </Canvas>
    </div>
  );
}

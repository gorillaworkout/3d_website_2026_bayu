"use client"

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    // Subtle mouse parallax
    const px = state.pointer.x * 0.3
    const py = state.pointer.y * 0.3
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, px, 0.02)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, py, 0.02)
  })

  return (
    <group ref={groupRef}>
      {/* Main torus */}
      <Float speed={2} floatIntensity={2} rotationIntensity={1.5}>
        <mesh position={[3, 1.5, -2]}>
          <torusGeometry args={[1.2, 0.4, 32, 64]} />
          <MeshDistortMaterial
            color="#06b6d4"
            distort={0.3}
            speed={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Octahedron */}
      <Float speed={1.5} floatIntensity={1.5} rotationIntensity={2}>
        <mesh position={[-3.5, -1, -3]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Icosahedron */}
      <Float speed={3} floatIntensity={1} rotationIntensity={1}>
        <mesh position={[4.5, -2, -5]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <MeshDistortMaterial
            color="#ec4899"
            distort={0.2}
            speed={3}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </Float>

      {/* Small sphere */}
      <Float speed={4} floatIntensity={2} rotationIntensity={0.5}>
        <mesh position={[-2, 2.5, -4]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Ring */}
      <Float speed={1} floatIntensity={0.5} rotationIntensity={3}>
        <mesh position={[0, 0, -6]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Second ring */}
      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={2}>
        <mesh position={[0, 0, -6]} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[2.5, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Sparkles */}
      <Sparkles
        count={200}
        scale={[20, 10, 15]}
        size={3}
        speed={0.3}
        opacity={0.4}
        color="#06b6d4"
      />
    </group>
  )
}

export default function HeroScene({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#06b6d4" />
          <pointLight position={[0, 5, 0]} intensity={0.8} color="#8b5cf6" />
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  )
}

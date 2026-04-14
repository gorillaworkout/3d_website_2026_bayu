"use client"

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, CameraControls, Text, Grid, Sparkles, Edges } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const WAYPOINTS = {
  home: { position: [0, 2, 8], target: [0, 0, 0] },
  about: { position: [0, -18, 8], target: [0, -20, 0] },     // Bawah
  portfolio: { position: [0, -38, 8], target: [0, -40, 0] }, // Bawah lagi
  services: { position: [35, 15, 10], target: [35, 15, 0] },  // Kanan Atas
  contact: { position: [-35, 25, 10], target: [-35, 25, 0] }  // Kiri Atas
}

function CameraRig({ activeMenu }: { activeMenu: string }) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      const { position, target } = WAYPOINTS[activeMenu as keyof typeof WAYPOINTS] || WAYPOINTS.home
      controlsRef.current.setLookAt(
        position[0], position[1], position[2], 
        target[0], target[1], target[2], 
        true 
      )
    }
  }, [activeMenu])

  return <CameraControls ref={controlsRef} smoothTime={0.8} />
}

function CyberCity() {
  const buildings = useMemo(() => {
    return Array.from({ length: 150 }).map(() => ({
      x: (Math.random() - 0.5) * 120, // Sebar lebih luas ke Kiri & Kanan (X)
      y: 30 - Math.random() * 100,    // Sebar lebih tinggi ke Atas & Bawah (Y)
      z: -10 - Math.random() * 50,    // Sebar ke belakang
      w: 2 + Math.random() * 5,
      h: 10 + Math.random() * 40,
      d: 2 + Math.random() * 5,
      color: Math.random() > 0.6 ? "#06b6d4" : Math.random() > 0.3 ? "#ec4899" : "#8b5cf6",
      isWireframe: Math.random() > 0.8
    }))
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          {b.isWireframe ? (
            <meshBasicMaterial color={b.color} wireframe />
          ) : (
            <>
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
              <Edges scale={1} threshold={15} color={b.color} />
            </>
          )}
        </mesh>
      ))}
    </group>
  )
}

export default function Scene({ activeMenu }: { activeMenu: string }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <color attach="background" args={['#050511']} />
        <fog attach="fog" args={['#050511', 10, 50]} />

        <Environment files="/studio.exr" background={false} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ec4899" />
        
        <CameraRig activeMenu={activeMenu} />
        <CyberCity />

        {/* Efek Debu Kosmik Diperluas */}
        <Sparkles count={3000} scale={[100, 150, 50]} position={[0, -10, -10]} size={4} speed={0.4} opacity={0.3} color="#06b6d4" />

        <Grid 
          position={[0, -3, 0]} args={[150, 150]} 
          cellSize={1} cellThickness={1} cellColor="#06b6d4" 
          sectionSize={5} sectionThickness={1.5} sectionColor="#ec4899" 
          fadeDistance={50} fadeStrength={1} 
        />

        {/* --- LANTAI 1: HOME (Tengah) --- */}
        <group position={[0, 0, 0]}>
          <Float speed={2} floatIntensity={2}>
            <mesh>
              <torusKnotGeometry args={[1.2, 0.3, 128, 64]} />
              <MeshDistortMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} distort={0.4} speed={2} />
            </mesh>
          </Float>
        </group>

        {/* --- LANTAI 2: ABOUT (Bawah) --- */}
        <group position={[0, -20, 0]}>
          <Float speed={2} floatIntensity={2}>
            <mesh>
              <octahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.5} wireframe />
            </mesh>
          </Float>
          <Text position={[3, 0, 0]} fontSize={0.8} color="#8b5cf6" anchorX="left" anchorY="middle">
            ABOUT THE CORE
          </Text>
        </group>

        {/* --- LANTAI 3: PORTFOLIO (Paling Bawah) --- */}
        <group position={[0, -40, 0]}>
          <Float speed={3} floatIntensity={3}>
            <mesh>
              <icosahedronGeometry args={[1.5, 0]} />
              <MeshDistortMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} distort={0.2} speed={1} />
            </mesh>
          </Float>
          <Text position={[-3, 0, 0]} fontSize={0.8} color="#ec4899" anchorX="right" anchorY="middle">
            OUR PROJECTS
          </Text>
        </group>

        {/* --- BARU: SERVICES (Kanan Atas) --- */}
        <group position={[35, 15, 0]}>
          <Float speed={2} floatIntensity={2}>
            <mesh>
              <dodecahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} wireframe />
            </mesh>
          </Float>
          <Text position={[0, -2.5, 0]} fontSize={0.8} color="#fbbf24" anchorX="center" anchorY="middle">
            SERVICES
          </Text>
        </group>

        {/* --- BARU: CONTACT (Kiri Atas) --- */}
        <group position={[-35, 25, 0]}>
          <Float speed={4} floatIntensity={4}>
            <mesh>
              <torusGeometry args={[1.2, 0.4, 16, 100]} />
              <MeshDistortMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} distort={0.3} speed={3} />
            </mesh>
          </Float>
          <Text position={[0, -2.5, 0]} fontSize={0.8} color="#10b981" anchorX="center" anchorY="middle">
            CONTACT US
          </Text>
        </group>

        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

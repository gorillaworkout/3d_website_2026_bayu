"use client"

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, CameraControls, Text, Grid, Sparkles, Edges } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const WAYPOINTS = {
  home: { position: [0, 2, 8], target: [0, 0, 0] },
  about: { position: [0, -18, 8], target: [0, -20, 0] },
  portfolio: { position: [0, -38, 8], target: [0, -40, 0] }
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

// --- KOMPONEN KOTA CYBERPUNK (PROCEDURAL) ---
function CyberCity() {
  // Generate posisi gedung secara acak di belakang dan sekeliling kamera
  const buildings = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      x: (Math.random() - 0.5) * 80, // Sebar di sumbu X
      y: 10 - Math.random() * 80,    // Sebar dari atas ke lantai paling bawah (Y)
      z: -10 - Math.random() * 40,   // Taruh di belakang target (Sumbu Z minus)
      w: 2 + Math.random() * 5,      // Lebar gedung
      h: 10 + Math.random() * 40,    // Tinggi gedung
      d: 2 + Math.random() * 5,      // Kedalaman gedung
      // Warna neon acak: Cyan, Pink, atau Ungu
      color: Math.random() > 0.6 ? "#06b6d4" : Math.random() > 0.3 ? "#ec4899" : "#8b5cf6",
      isWireframe: Math.random() > 0.8 // 20% gedung berbentuk garis hologram murni
    }))
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          {b.isWireframe ? (
            // Gedung Hologram Wireframe
            <meshBasicMaterial color={b.color} wireframe />
          ) : (
            // Gedung Gelap dengan Garis Tepi Neon (Tron Style)
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
        <fog attach="fog" args={['#050511', 10, 40]} />

        <Environment files="/studio.exr" background={false} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ec4899" />
        
        <CameraRig activeMenu={activeMenu} />

        {/* PANGGIL KOTA CYBERPUNK DI SINI */}
        <CyberCity />

        {/* Efek Debu Kosmik */}
        <Sparkles count={2000} scale={[40, 100, 40]} position={[0, -20, -10]} size={4} speed={0.4} opacity={0.3} color="#06b6d4" />

        <Grid 
          position={[0, -3, 0]} args={[100, 100]} 
          cellSize={1} cellThickness={1} cellColor="#06b6d4" 
          sectionSize={5} sectionThickness={1.5} sectionColor="#ec4899" 
          fadeDistance={40} fadeStrength={1} 
        />

        {/* --- LANTAI 1: HOME (Y: 0) --- */}
        <group position={[0, 0, 0]}>
          <Float speed={2} floatIntensity={2}>
            <mesh>
              <torusKnotGeometry args={[1.2, 0.3, 128, 64]} />
              <MeshDistortMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} distort={0.4} speed={2} />
            </mesh>
          </Float>
        </group>

        {/* --- LANTAI 2: ABOUT (Y: -20) --- */}
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

        {/* --- LANTAI 3: PORTFOLIO (Y: -40) --- */}
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

        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

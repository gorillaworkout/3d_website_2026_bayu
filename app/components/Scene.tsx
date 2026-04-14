"use client"

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, CameraControls, Text, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'

// 1. KOORDINAT VERTIKAL (Darat, Laut, Angkasa)
const WAYPOINTS = {
  home: { position: [0, 2, 12], target: [0, 0, 0] },          // Darat (Y: 0)
  about: { position: [0, -28, 12], target: [0, -30, 0] },     // Bawah Laut (Y: -30)
  portfolio: { position: [0, -58, 12], target: [0, -60, 0] }, // Palung Laut (Y: -60)
  services: { position: [0, 28, 12], target: [0, 30, 0] },    // Atas Awan (Y: 30)
  contact: { position: [0, 58, 12], target: [0, 60, 0] }      // Luar Angkasa (Y: 60)
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

  return (
    <CameraControls 
      ref={controlsRef} 
      smoothTime={0.8} 
      mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 0, two: 0, three: 0 }}
      minDistance={0}
      maxDistance={Infinity}
    />
  )
}

function InteractiveWorld({ children }: { children: React.ReactNode }) {
  const worldRef = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!worldRef.current) return;
    const targetX = state.pointer.x * 1; 
    const targetY = state.pointer.y * 1;
    worldRef.current.position.x = THREE.MathUtils.lerp(worldRef.current.position.x, targetX, 0.05);
    worldRef.current.position.y = THREE.MathUtils.lerp(worldRef.current.position.y, targetY, 0.05);
  })
  return <group ref={worldRef}>{children}</group>
}

// 2. THEME CONTROLLER (Ubah Warna Background & Kabut sesuai Ketinggian)
function ThemeController() {
  const { scene, camera } = useThree()
  
  // Warna-warni Tema
  const colorSpace = new THREE.Color("#020617") // Hitam Angkasa
  const colorSky = new THREE.Color("#38bdf8")   // Biru Cerah Darat/Awan
  const colorSea = new THREE.Color("#0891b2")   // Biru Laut
  const colorAbyss = new THREE.Color("#020617") // Hitam Palung Laut
  
  useFrame(() => {
    let targetColor = colorSky // Default
    
    const y = camera.position.y
    if (y > 45) targetColor = colorSpace
    else if (y < -15 && y >= -45) targetColor = colorSea
    else if (y < -45) targetColor = colorAbyss

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetColor, 0.05)
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(targetColor, 0.05)
    }
  })
  return null
}

export default function Scene({ activeMenu }: { activeMenu: string }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <Suspense fallback={null}>
          <color attach="background" args={['#38bdf8']} />
          <fog attach="fog" args={['#38bdf8', 10, 40]} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
          
          <CameraRig activeMenu={activeMenu} />
          <ThemeController />

          {/* Bintang hanya di area Luar Angkasa (Y: 60) */}
          <group position={[0, 60, 0]}>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          </group>

          <InteractiveWorld>
            
            {/* --- ZONA 1: DARATAN (Y: 0) --- */}
            <group position={[0, 0, 0]}>
              {/* Tanah */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#22c55e" roughness={0.8} /> {/* Hijau Rumput */}
              </mesh>
              <Float speed={2} floatIntensity={1}>
                <mesh position={[-2, 0, 0]}>
                  <boxGeometry args={[1.5, 1.5, 1.5]} />
                  <meshStandardMaterial color="#fcd34d" />
                </mesh>
              </Float>
              <Text position={[2, 0, 0]} fontSize={1} color="#ffffff" anchorX="left" anchorY="middle">
                SURFACE
              </Text>
            </group>

            {/* --- ZONA 2: BAWAH LAUT (Y: -30) --- */}
            <group position={[0, -30, 0]}>
              {/* Gelembung Air */}
              <Sparkles count={500} scale={[20, 20, 20]} size={6} speed={0.4} opacity={0.6} color="#ffffff" />
              <group position={[2, 0, 0]}>
                <Float speed={3} floatIntensity={3}>
                  <mesh>
                    <torusGeometry args={[1, 0.4, 32, 64]} />
                    <MeshDistortMaterial color="#22d3ee" distort={0.5} speed={2} /> {/* Jellyfish feel */}
                  </mesh>
                </Float>
              </group>
              <Text position={[-2, 0, 0]} fontSize={1} color="#ffffff" anchorX="right" anchorY="middle">
                OCEAN
              </Text>
            </group>

            {/* --- ZONA 3: PALUNG LAUT (Y: -60) --- */}
            <group position={[0, -60, 0]}>
              {/* Plankton menyala di kegelapan */}
              <Sparkles count={800} scale={[30, 30, 30]} size={3} speed={0.2} opacity={0.8} color="#06b6d4" />
              <group position={[-2, 0, 0]}>
                <Float speed={1} floatIntensity={1}>
                  <mesh>
                    <octahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#020617" wireframe />
                  </mesh>
                </Float>
              </group>
              <Text position={[2, 0, 0]} fontSize={1} color="#06b6d4" anchorX="left" anchorY="middle">
                THE ABYSS
              </Text>
            </group>

            {/* --- ZONA 4: ATAS AWAN (Y: 30) --- */}
            <group position={[0, 30, 0]}>
              {/* Awan buatan (kumpulan bola putih) */}
              <group position={[0, -3, -5]}>
                <mesh position={[-3, 0, 0]}><sphereGeometry args={[2, 32, 32]}/><meshStandardMaterial color="white" /></mesh>
                <mesh position={[0, 1, 0]}><sphereGeometry args={[2.5, 32, 32]}/><meshStandardMaterial color="white" /></mesh>
                <mesh position={[3, 0, 0]}><sphereGeometry args={[2, 32, 32]}/><meshStandardMaterial color="white" /></mesh>
              </group>
              <group position={[2, 0, 0]}>
                <Float speed={2} floatIntensity={2}>
                  <mesh>
                    <cylinderGeometry args={[1, 1, 2, 32]} />
                    <meshStandardMaterial color="#fbcfe8" />
                  </mesh>
                </Float>
              </group>
              <Text position={[-2, 0, 0]} fontSize={1} color="#ffffff" anchorX="right" anchorY="middle">
                SKY
              </Text>
            </group>

            {/* --- ZONA 5: LUAR ANGKASA (Y: 60) --- */}
            <group position={[0, 60, 0]}>
              <group position={[-2, 0, 0]}>
                <Float speed={4} floatIntensity={2}>
                  <mesh>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.2} /> {/* Asteroid */}
                  </mesh>
                </Float>
              </group>
              <Text position={[2, 0, 0]} fontSize={1} color="#ffffff" anchorX="left" anchorY="middle">
                SPACE
              </Text>
            </group>

          </InteractiveWorld>
        </Suspense>
      </Canvas>
    </div>
  )
}

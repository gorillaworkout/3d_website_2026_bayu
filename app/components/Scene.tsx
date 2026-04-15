"use client"

import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, CameraControls, Text, Sparkles, Stars, Edges, MeshTransmissionMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

// Harus menggunakan DotLottie React karena filenya berformat .lottie (terkompresi), bukan JSON Lottie standar
const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then(mod => mod.DotLottiePlayer),
  { ssr: false }
)

// KOORDINAT ZOOM-IN TRANSISI MULTI-ALAM
const WAYPOINTS = {
  // Koordinat asli:
  home: { position: [0, 2, 12], target: [0, 0, 0] },          // Padang Rumput / Savana (Y: 0)
  about: { position: [0, -28, 12], target: [0, -30, 0] },     // Bawah Laut (Y: -30)
  work: { position: [0, -58, 12], target: [0, -60, 0] },      // Palung Laut Dalam (Y: -60)
  services: { position: [0, 28, 12], target: [0, 30, 0] },    // Atas Awan (Y: 30)
  contact: { position: [0, 58, 12], target: [0, 60, 0] },     // Luar Angkasa (Y: 60)

  // Koordinat ZOOM-IN saat panel terbuka
  home_zoom: { position: [0, 1, 5], target: [0, 0, 0] },
  about_zoom: { position: [0, -29, 5], target: [0, -30, 0] },
  work_zoom: { position: [0, -59, 5], target: [0, -60, 0] },
  services_zoom: { position: [0, 29, 5], target: [0, 30, 0] },
  contact_zoom: { position: [0, 59, 5], target: [0, 60, 0] }
}

function CameraRig({ activeMenu, isPanelOpen }: { activeMenu: string, isPanelOpen: boolean }) {
  const controlsRef = useRef<any>(null)
  
  useEffect(() => {
    if (controlsRef.current) {
      let targetKey = activeMenu;
      if (isPanelOpen) targetKey = `${activeMenu}_zoom`;

      const { position, target } = WAYPOINTS[targetKey as keyof typeof WAYPOINTS] || WAYPOINTS.home
      controlsRef.current.smoothTime = isPanelOpen ? 1.2 : 0.8;
      
      controlsRef.current.setLookAt(
        position[0], position[1], position[2], 
        target[0], target[1], target[2], 
        true 
      )
    }
  }, [activeMenu, isPanelOpen])

  return (
    <CameraControls 
      ref={controlsRef} smoothTime={0.8} 
      mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 0, two: 0, three: 0 }}
      minDistance={0} maxDistance={Infinity}
    />
  )
}

function InteractiveWorld({ children }: { children: React.ReactNode }) {
  const worldRef = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!worldRef.current) return;
    const targetX = state.pointer.x * 0.5; 
    const targetY = state.pointer.y * 0.5;
    worldRef.current.position.x = THREE.MathUtils.lerp(worldRef.current.position.x, targetX, 0.05);
    worldRef.current.position.y = THREE.MathUtils.lerp(worldRef.current.position.y, targetY, 0.05);
  })
  return <group ref={worldRef}>{children}</group>
}

// Komponen Lottie Khusus file .lottie (DotLottie)
function GorillaLottie() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <group position={[-2.5, -2, 0]}>
      {mounted && (
        <Html 
          transform 
          occlude 
          position={[0, 1.5, 0]} 
          scale={0.5} 
          style={{ width: '400px', height: '400px' }}
        >
          <DotLottiePlayer
            src="/gorilla.lottie"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </Html>
      )}
    </group>
  )
}

// 2. THEME CONTROLLER: Multi-Alam (Darat, Langit, Luar Angkasa, Laut)
function ThemeController() {
  const { scene, camera } = useThree()
  
  // Warna-warni Tema Alam
  const colorSpace = new THREE.Color("#020617") // Hitam Angkasa
  const colorSky = new THREE.Color("#38bdf8")   // Biru Cerah Atas Awan
  const colorSurface = new THREE.Color("#0f172a") // Langit Senja / Malam Savana (Gelap elegan)
  const colorOcean = new THREE.Color("#0891b2")   // Biru Bawah Laut
  const colorAbyss = new THREE.Color("#000000") // Hitam Palung Laut
  
  useFrame(() => {
    let targetColor = colorSurface
    
    const y = camera.position.y
    if (y > 45) targetColor = colorSpace
    else if (y > 15 && y <= 45) targetColor = colorSky
    else if (y < -15 && y >= -45) targetColor = colorOcean
    else if (y < -45) targetColor = colorAbyss

    if (scene.background instanceof THREE.Color) scene.background.lerp(targetColor, 0.05)
    if (scene.fog instanceof THREE.Fog) scene.fog.color.lerp(targetColor, 0.05)
  })
  return null
}

export default function Scene({ activeMenu, isPanelOpen }: { activeMenu: string, isPanelOpen: boolean }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <Suspense fallback={null}>
          <color attach="background" args={['#0f172a']} />
          <fog attach="fog" args={['#0f172a', 10, 40]} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -20, -10]} intensity={1} color="#38bdf8" />
          
          <CameraRig activeMenu={activeMenu} isPanelOpen={isPanelOpen} />
          <ThemeController />

          {/* Bintang hanya terlihat di Luar Angkasa (Y: 60) dan sedikit di Savana malam */}
          <group position={[0, 60, 0]}>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          </group>
          <group position={[0, 5, -20]}>
            <Stars radius={30} depth={30} count={1000} factor={2} saturation={0} fade speed={0.5} />
          </group>

          <InteractiveWorld>
            
            {/* --- ZONA 1: DARATAN / SAVANA (Y: 0) --- */}
            <group position={[0, 0, 0]}>
              {/* Tanah Rumput Savana */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[150, 150, 64, 64]} />
                <MeshDistortMaterial color="#064e3b" roughness={0.9} distort={0.15} speed={0.2} /> {/* Hijau gelap/moss */}
              </mesh>
              {/* Kabut tanah / Embun */}
              <Sparkles count={500} scale={[40, 2, 40]} position={[0, -1, 0]} size={2} speed={0.2} opacity={0.3} color="#a7f3d0" />

              <GorillaLottie />
              
              <Text position={[2, 0, 0]} fontSize={0.9} color="#e2e8f0" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                SURFACE
              </Text>
            </group>

            {/* --- ZONA 2: BAWAH LAUT (Y: -30) --- */}
            <group position={[0, -30, 0]}>
              {/* Gelembung Air */}
              <Sparkles count={800} scale={[30, 30, 30]} position={[0, 0, 0]} size={4} speed={0.6} opacity={0.5} color="#cffafe" />
              <group position={[2, 0, 0]}>
                <Float speed={3} floatIntensity={3} rotationIntensity={1}>
                  <mesh>
                    <torusGeometry args={[1, 0.4, 32, 64]} />
                    <MeshDistortMaterial color="#22d3ee" distort={0.5} speed={2} metalness={0.5} roughness={0} />
                  </mesh>
                </Float>
              </group>
              <Text position={[-1.5, 0, 0]} fontSize={0.9} color="#a5f3fc" anchorX="right" anchorY="middle" letterSpacing={0.2}>
                OCEAN
              </Text>
            </group>

            {/* --- ZONA 3: PALUNG LAUT (Y: -60) --- */}
            <group position={[0, -60, 0]}>
              {/* Plankton Bioluminescence */}
              <Sparkles count={1000} scale={[40, 40, 40]} position={[0, 0, 0]} size={2} speed={0.1} opacity={0.8} color="#38bdf8" />
              <group position={[-2, 0, 0]}>
                <Float speed={1} floatIntensity={1} rotationIntensity={1}>
                  <mesh>
                    <octahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial color="#020617" wireframe />
                  </mesh>
                </Float>
              </group>
              <Text position={[1.5, 0, 0]} fontSize={0.9} color="#38bdf8" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                ABYSS
              </Text>
            </group>

            {/* --- ZONA 4: ATAS AWAN (Y: 30) --- */}
            <group position={[0, 30, 0]}>
              {/* Awan buatan (kumpulan bola putih) */}
              <group position={[0, -4, -8]}>
                <Float speed={1} floatIntensity={0.5}>
                  <mesh position={[-4, 0, 0]}><sphereGeometry args={[2.5, 32, 32]}/><meshStandardMaterial color="#f8fafc" roughness={1} /></mesh>
                  <mesh position={[0, 1.5, 0]}><sphereGeometry args={[3, 32, 32]}/><meshStandardMaterial color="#f8fafc" roughness={1} /></mesh>
                  <mesh position={[4, 0, 0]}><sphereGeometry args={[2.5, 32, 32]}/><meshStandardMaterial color="#f8fafc" roughness={1} /></mesh>
                </Float>
              </group>
              <group position={[2, 0, 0]}>
                <Float speed={2} floatIntensity={1.5} rotationIntensity={2}>
                  <mesh rotation={[Math.PI/3, 0, 0]}>
                    <torusGeometry args={[1.5, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#fbcfe8" emissive="#fbcfe8" emissiveIntensity={0.5} />
                  </mesh>
                  <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <MeshTransmissionMaterial transmission={1} thickness={2} roughness={0} color="#ffffff" />
                  </mesh>
                </Float>
              </group>
              <Text position={[-1.5, 0, 0]} fontSize={0.9} color="#f8fafc" anchorX="right" anchorY="middle" letterSpacing={0.2}>
                SKY
              </Text>
            </group>

            {/* --- ZONA 5: LUAR ANGKASA (Y: 60) --- */}
            <group position={[0, 60, 0]}>
              <group position={[-2, 0, 0]}>
                <Float speed={4} floatIntensity={1} rotationIntensity={0.5}>
                  {/* Asteroid / Planet mati */}
                  <mesh>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <MeshDistortMaterial color="#475569" roughness={0.8} metalness={0.2} distort={0.1} speed={0} />
                  </mesh>
                  <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
                    <ringGeometry args={[1.8, 1.9, 64]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                  </mesh>
                </Float>
              </group>
              <Text position={[1.5, 0, 0]} fontSize={0.9} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                SPACE
              </Text>
            </group>

          </InteractiveWorld>
        </Suspense>
      </Canvas>
    </div>
  )
}

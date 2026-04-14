"use client"

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, CameraControls, Text, Sparkles, Stars, Edges, MeshTransmissionMaterial, Svg } from '@react-three/drei'
import * as THREE from 'three'

// 1. KOORDINAT VERTIKAL (Elegan & Terstruktur)
const WAYPOINTS = {
  home: { position: [0, 2, 12], target: [0, 0, 0] },          // Origin (Y: 0)
  about: { position: [0, -28, 12], target: [0, -30, 0] },     // Fluidity (Y: -30)
  portfolio: { position: [0, -58, 12], target: [0, -60, 0] }, // Structure (Y: -60)
  services: { position: [0, 28, 12], target: [0, 30, 0] },    // Elevation (Y: 30)
  contact: { position: [0, 58, 12], target: [0, 60, 0] }      // Beyond (Y: 60)
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
    const targetX = state.pointer.x * 0.8; 
    const targetY = state.pointer.y * 0.8;
    worldRef.current.position.x = THREE.MathUtils.lerp(worldRef.current.position.x, targetX, 0.05);
    worldRef.current.position.y = THREE.MathUtils.lerp(worldRef.current.position.y, targetY, 0.05);
  })
  return <group ref={worldRef}>{children}</group>
}

// 2. THEME CONTROLLER (Warna Elegan: Navy, Dark Slate, Midnight)
function ThemeController() {
  const { scene, camera } = useThree()
  
  const colorSpace = new THREE.Color("#020617") // Deepest Black
  const colorSky = new THREE.Color("#0f172a")   // Slate 900
  const colorSurface = new THREE.Color("#082f49") // Cyan 900 (Gelap elegan)
  const colorOcean = new THREE.Color("#172554") // Sky 950
  const colorAbyss = new THREE.Color("#000000") // Pitch Black
  
  useFrame(() => {
    let targetColor = colorSurface
    
    const y = camera.position.y
    if (y > 45) targetColor = colorSpace
    else if (y > 15 && y <= 45) targetColor = colorSky
    else if (y < -15 && y >= -45) targetColor = colorOcean
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
          <color attach="background" args={['#082f49']} />
          <fog attach="fog" args={['#082f49', 10, 40]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, -20, -10]} intensity={1} color="#38bdf8" />
          
          <CameraRig activeMenu={activeMenu} />
          <ThemeController />

          {/* Partikel Universal Elegan */}
          <Sparkles count={1500} scale={[40, 150, 40]} position={[0, 0, -5]} size={1.5} speed={0.2} opacity={0.3} color="#e2e8f0" />

          {/* Bintang Elegan di Space */}
          <group position={[0, 60, 0]}>
            <Stars radius={50} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
          </group>

          <InteractiveWorld>
            
            {/* --- ZONA 1: ORIGIN / HOME (Y: 0) --- */}
            <group position={[0, 0, 0]}>
              {/* Lantai Kaca Reflektif Minimalis */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                <planeGeometry args={[100, 100]} />
                <MeshTransmissionMaterial transmission={0.9} roughness={0.1} color="#0f172a" />
              </mesh>
              
              {/* Logo Gorilla SVG (Diubah jadi 3D) */}
              <group position={[-3, 2, 0]}>
                <Float speed={2} floatIntensity={1.5} rotationIntensity={0.5}>
                  {/* Svg component memuat vektor dan mengekstrusi-nya (membuatnya tebal) secara otomatis */}
                  <Svg 
                    src="/gorilla.svg" 
                    scale={0.005} // SVG asli terlalu besar
                    position={[0, -1, 0]} // Posisikan ke tengah
                    rotation={[Math.PI, 0, 0]} // SVG bawaan biasanya terbalik
                    fillMaterial={{
                      color: "#38bdf8", 
                      roughness: 0.1, 
                      metalness: 0.8,
                    }}
                  />
                </Float>
              </group>
              
              <Text position={[2, 0, 0]} fontSize={1} color="#e2e8f0" anchorX="left" anchorY="middle" letterSpacing={0.2} font="/orbitron.woff">
                ORIGIN
              </Text>
            </group>

            {/* --- ZONA 2: FLUIDITY / ABOUT (Y: -30) --- */}
            <group position={[0, -30, 0]}>
              <group position={[2, 0, 0]}>
                <Float speed={3} floatIntensity={2} rotationIntensity={1}>
                  <mesh>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    {/* Metal cair elegan */}
                    <MeshDistortMaterial color="#94a3b8" metalness={1} roughness={0.1} distort={0.4} speed={1.5} />
                  </mesh>
                </Float>
              </group>
              <Text position={[-1.5, 0, 0]} fontSize={0.9} color="#94a3b8" anchorX="right" anchorY="middle" letterSpacing={0.2}>
                FLUIDITY
              </Text>
            </group>

            {/* --- ZONA 3: STRUCTURE / WORK (Y: -60) --- */}
            <group position={[0, -60, 0]}>
              <group position={[-2, 0, 0]}>
                <Float speed={1} floatIntensity={1} rotationIntensity={1}>
                  <mesh>
                    {/* Struktur data kompleks */}
                    <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                    <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
                    <Edges scale={1} threshold={15} color="#38bdf8" />
                  </mesh>
                </Float>
              </group>
              <Text position={[1.5, 0, 0]} fontSize={0.9} color="#38bdf8" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                STRUCTURE
              </Text>
            </group>

            {/* --- ZONA 4: ELEVATION / SKILLS (Y: 30) --- */}
            <group position={[0, 30, 0]}>
              <group position={[2, 0, 0]}>
                <Float speed={2} floatIntensity={1.5} rotationIntensity={2}>
                  {/* Cincin konsentris (Skill layers) */}
                  <mesh rotation={[Math.PI/3, 0, 0]}>
                    <torusGeometry args={[1.5, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.5} />
                  </mesh>
                  <mesh rotation={[-Math.PI/3, 0, 0]} scale={0.7}>
                    <torusGeometry args={[1.5, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
                  </mesh>
                  <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <MeshTransmissionMaterial transmission={1} thickness={2} roughness={0} color="#ffffff" />
                  </mesh>
                </Float>
              </group>
              <Text position={[-1.5, 0, 0]} fontSize={0.9} color="#818cf8" anchorX="right" anchorY="middle" letterSpacing={0.2}>
                ELEVATION
              </Text>
            </group>

            {/* --- ZONA 5: BEYOND / CONTACT (Y: 60) --- */}
            <group position={[0, 60, 0]}>
              <group position={[-2, 0, 0]}>
                <Float speed={1} floatIntensity={1} rotationIntensity={0.5}>
                  {/* Gerhana / Black Hole kecil */}
                  <mesh>
                    <sphereGeometry args={[1.2, 64, 64]} />
                    <meshStandardMaterial color="#000000" roughness={0.5} metalness={0.5} />
                  </mesh>
                  <mesh position={[0, 0, -0.2]}>
                    <ringGeometry args={[1.3, 1.35, 64]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                  </mesh>
                </Float>
              </group>
              <Text position={[1.5, 0, 0]} fontSize={0.9} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                BEYOND
              </Text>
            </group>

          </InteractiveWorld>
        </Suspense>
      </Canvas>
    </div>
  )
}

"use client"

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, CameraControls, Text, Grid, Sparkles, Edges } from '@react-three/drei'
import * as THREE from 'three'

const WAYPOINTS = {
  home: { position: [0, 2, 8], target: [0, 0, 0] },
  about: { position: [0, -18, 8], target: [0, -20, 0] },
  portfolio: { position: [0, -38, 8], target: [0, -40, 0] },
  services: { position: [35, 15, 15], target: [35, 15, 0] },  
  contact: { position: [-35, 25, 15], target: [-35, 25, 0] }  
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
      touches={{ one: 0, laid: 0, two: 0, three: 0 }}
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

// Komponen Grid Cyberpunk Futuristik
function CyberGrid() {
  const gridRef = useRef<any>(null)
  
  useFrame((state) => {
    // Membuat grid seolah-olah bergerak mundur (efek kecepatan)
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 1
    }
  })

  return (
    <group position={[0, -3, 0]}>
      <Grid 
        ref={gridRef}
        args={[150, 150]} 
        cellSize={1} cellThickness={1.5} cellColor="#0ea5e9" // Cyan lebih terang
        sectionSize={5} sectionThickness={2.5} sectionColor="#db2777" // Pink tebal
        fadeDistance={40} fadeStrength={2} 
      />
      {/* Lantai kaca gelap memantulkan cahaya grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export default function Scene({ activeMenu }: { activeMenu: string }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <color attach="background" args={['#03030b']} />
        <fog attach="fog" args={['#03030b', 5, 45]} />

        <Environment files="/studio.exr" background={false} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ec4899" />
        <directionalLight position={[-10, 10, -5]} intensity={2} color="#06b6d4" />
        
        <CameraRig activeMenu={activeMenu} />

        <InteractiveWorld>
          <CyberGrid />
          
          <Sparkles count={4000} scale={[100, 150, 50]} position={[0, -10, -10]} size={2} speed={0.8} opacity={0.6} color="#22d3ee" />

          {/* HOME (Z=0, Object di tengah, No Text) */}
          <group position={[0, 0, 0]}>
            <Float speed={2} floatIntensity={2}>
              <mesh>
                <torusKnotGeometry args={[1.2, 0.4, 200, 64]} />
                <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
                <Edges scale={1} threshold={15} color="#06b6d4" />
                <Edges scale={1.05} threshold={15} color="#ec4899" />
              </mesh>
            </Float>
          </group>

          {/* ABOUT */}
          <group position={[0, -20, 0]}>
            <group position={[-2, 0, 0]}>
              <Float speed={2} floatIntensity={2}>
                <mesh>
                  <octahedronGeometry args={[1.5, 0]} />
                  <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
                  <Edges color="#818cf8" scale={1.1} />
                </mesh>
              </Float>
            </group>
            <Text position={[2, 0, 0]} font="/orbitron.woff" fontSize={1.2} color="#818cf8" anchorX="left" anchorY="middle" whiteSpace="nowrap">
              01
            </Text>
          </group>

          {/* PORTFOLIO */}
          <group position={[0, -40, 0]}>
            <group position={[2, 0, 0]}>
              <Float speed={3} floatIntensity={3}>
                <mesh>
                  <icosahedronGeometry args={[1.5, 0]} />
                  <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
                  <Edges color="#f472b6" scale={1.1} />
                </mesh>
              </Float>
            </group>
            <Text position={[-2, 0, 0]} font="/orbitron.woff" fontSize={1.2} color="#f472b6" anchorX="right" anchorY="middle" whiteSpace="nowrap">
              02
            </Text>
          </group>

          {/* SERVICES */}
          <group position={[35, 15, 0]}>
            <group position={[-2, 0, 0]}>
              <Float speed={2} floatIntensity={2}>
                <mesh>
                  <dodecahedronGeometry args={[1.5, 0]} />
                  <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
                  <Edges color="#fbbf24" scale={1.1} />
                </mesh>
              </Float>
            </group>
            <Text position={[2, 0, 0]} font="/orbitron.woff" fontSize={1.2} color="#fbbf24" anchorX="left" anchorY="middle" whiteSpace="nowrap">
              03
            </Text>
          </group>

          {/* CONTACT */}
          <group position={[-35, 25, 0]}>
            <group position={[2, 0, 0]}>
              <Float speed={4} floatIntensity={4}>
                <mesh>
                  <torusGeometry args={[1.2, 0.4, 16, 100]} />
                  <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
                  <Edges color="#10b981" scale={1.1} />
                </mesh>
              </Float>
            </group>
            <Text position={[-2, 0, 0]} font="/orbitron.woff" fontSize={1.2} color="#10b981" anchorX="right" anchorY="middle" whiteSpace="nowrap">
              04
            </Text>
          </group>

        </InteractiveWorld>
      </Canvas>
    </div>
  )
}

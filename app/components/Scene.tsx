"use client"

import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, CameraControls, Text, Sparkles, Stars, MeshTransmissionMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  { ssr: false }
)

const WAYPOINTS = {
  home: { position: [0, 2, 12], target: [0, 0, 0] },
  about: { position: [0, -26, -20], target: [0, -30, -40] },
  portfolio: { position: [40, -56, -20], target: [40, -60, -40] },
  services: { position: [-40, 32, -5], target: [-40, 30, -20] },
  contact: { position: [0, 62, 35], target: [0, 60, 20] },

  home_zoom: { position: [0, 1, 6], target: [0, 0, 0] },
  about_zoom: { position: [0, -28, -32], target: [0, -30, -40] },
  portfolio_zoom: { position: [40, -58, -32], target: [40, -60, -40] },
  services_zoom: { position: [-40, 31, -13], target: [-40, 30, -20] },
  contact_zoom: { position: [0, 61, 27], target: [0, 60, 20] }
}

function CameraRig({ activeMenu, isPanelOpen }: { activeMenu: string, isPanelOpen: boolean }) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      let targetKey = activeMenu;
      if (isPanelOpen) targetKey = `${activeMenu}_zoom`;

      const { position, target } = WAYPOINTS[targetKey as keyof typeof WAYPOINTS] || WAYPOINTS.home

      controlsRef.current.smoothTime = isPanelOpen ? 1.5 : 1.2;

      controlsRef.current.setLookAt(
        position[0], position[1], position[2],
        target[0], target[1], target[2],
        true
      )
    }
  }, [activeMenu, isPanelOpen])

  return (
    <CameraControls
      ref={controlsRef} smoothTime={1.2}
      mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 0, two: 0, three: 0 }}
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

function GorillaLottie() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <group position={[-2.5, -0.5, 0]}>
      {mounted && (
        <Html transform occlude position={[0, 1, 0]} scale={0.5} style={{ width: '500px', height: '500px' }}>
          <DotLottieReact src="/gorilla.lottie" loop autoplay />
        </Html>
      )}
    </group>
  )
}

function ThemeController() {
  const { scene, camera } = useThree()

  const colorSpace = new THREE.Color("#020617")
  const colorSky = new THREE.Color("#38bdf8")
  const colorSurface = new THREE.Color("#082f49")
  const colorOcean = new THREE.Color("#1e3a8a")
  const colorAbyss = new THREE.Color("#000000")

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

export default function Scene({ activeMenu, isPanelOpen }: {
  activeMenu: string,
  isPanelOpen: boolean
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <Suspense fallback={null}>
          <color attach="background" args={['#082f49']} />
          <fog attach="fog" args={['#082f49', 10, 40]} />

          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -20, -10]} intensity={1} color="#38bdf8" />

          <CameraRig activeMenu={activeMenu} isPanelOpen={isPanelOpen} />
          <ThemeController />

          <group position={[0, 60, 20]}>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          </group>

          <InteractiveWorld>

            {/* --- HOME --- */}
            <group position={[0, 0, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[150, 150, 64, 64]} />
                <MeshDistortMaterial color="#064e3b" roughness={0.9} distort={0.15} speed={0.2} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
                <planeGeometry args={[150, 150, 32, 32]} />
                <meshBasicMaterial color="#34d399" wireframe opacity={0.1} transparent />
              </mesh>
              <Sparkles count={500} scale={[60, 2, 60]} position={[0, -1, 0]} size={3} speed={0.2} opacity={0.4} color="#a7f3d0" />

              <GorillaLottie />

              <Text position={[2, 0, 0]} fontSize={1} color="#e2e8f0" anchorX="left" anchorY="middle" letterSpacing={0.2}>
                HOME
              </Text>
            </group>

            {/* --- ABOUT --- */}
            <group position={[0, -30, -40]}>
              <Sparkles count={800} scale={[40, 40, 40]} position={[0, 0, 0]} size={4} speed={0.6} opacity={0.5} color="#cffafe" />
              <group position={[2, 0, 0]}>
                <Float speed={3} floatIntensity={3} rotationIntensity={1}>
                  <mesh>
                    <torusGeometry args={[1, 0.4, 32, 64]} />
                    <MeshDistortMaterial color="#38bdf8" distort={0.5} speed={2} metalness={0.5} roughness={0} />
                  </mesh>
                </Float>
              </group>
              <Text position={[-1.5, 0, 0]} fontSize={0.9} color="#bae6fd" anchorX="right" anchorY="middle" letterSpacing={0.2}>
                ABOUT
              </Text>
            </group>

            {/* --- WORK --- */}
            <group position={[40, -60, -40]}>
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
                WORK
              </Text>
            </group>

            {/* --- SKILLS --- */}
            <group position={[-40, 30, -20]}>
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
                SKILLS
              </Text>
            </group>

            {/* --- CONTACT --- */}
            <group position={[0, 60, 20]}>
              <group position={[-2, 0, 0]}>
                <Float speed={4} floatIntensity={1} rotationIntensity={0.5}>
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
                CONTACT
              </Text>
            </group>

          </InteractiveWorld>
        </Suspense>
      </Canvas>
    </div>
  )
}

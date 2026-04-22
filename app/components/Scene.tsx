"use client"

import { useRef, useEffect, Suspense, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, CameraControls, Text, Sparkles, Stars, Edges, MeshTransmissionMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { projectsData } from '../data/projects'

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  { ssr: false }
)

/* ── Skills data ──────────────────────────────────────────── */
const skillCategories = [
  { title: 'Frontend & UI', color: '#60a5fa', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
  { title: '3D & WebGL', color: '#c084fc', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
  { title: 'Backend & Database', color: '#34d399', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
  { title: 'DevOps & Cloud', color: '#fb923c', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
  { title: 'AI & Integrations', color: '#f472b6', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
]

/* ── Contact data ─────────────────────────────────────────── */
const contactLinks = [
  { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout', color: '#a78bfa' },
  { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900', color: '#22c55e' },
  { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com', color: '#f59e0b' },
]

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

/* ═══════════════════════════════════════════════════════════════
   3D CONTENT COMPONENTS — floating Html elements in the scene
   ═══════════════════════════════════════════════════════════════ */

/* ── Floating Skill Card ─────────────────────────────────── */
function SkillCard({ category, position }: { category: typeof skillCategories[0], position: [number, number, number] }) {
  return (
    <Float speed={1.5 + Math.random()} floatIntensity={0.8} rotationIntensity={0.1}>
      <Html
        transform
        position={position}
        distanceFactor={12}
        style={{ pointerEvents: 'none' }}
      >
        <div className="w-[200px] p-3 rounded-xl bg-slate-950/50 backdrop-blur-sm border border-white/10 select-none">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: category.color }}>
            {category.title}
          </h4>
          <div className="flex flex-wrap gap-1">
            {category.techs.map(tech => (
              <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/5 text-slate-300 text-[9px] rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </Float>
  )
}

/* ── Skills Zone (scattered cards) ────────────────────────── */
function SkillsContent() {
  const positions: [number, number, number][] = [
    [-4, 3, 2],
    [3, 2, -3],
    [-3, -1, 3],
    [4, 3, -1],
    [-1, 4, -4],
  ]
  
  return (
    <group position={[-40, 30, -20]}>
      {skillCategories.map((cat, i) => (
        <SkillCard key={cat.title} category={cat} position={positions[i]} />
      ))}
    </group>
  )
}

/* ── Floating Project Card ────────────────────────────────── */
function ProjectCard({ project, position, onSelect }: { 
  project: typeof projectsData[0], 
  position: [number, number, number],
  onSelect: (project: typeof projectsData[0]) => void
}) {
  const colorMap: Record<string, string> = {
    'text-blue-400': '#60a5fa',
    'text-emerald-400': '#34d399',
    'text-pink-400': '#f472b6',
    'text-amber-400': '#fbbf24',
    'text-violet-400': '#a78bfa',
    'text-cyan-400': '#22d3ee',
    'text-rose-400': '#fb7185',
  }
  const accentColor = colorMap[project.colorClass] || '#22d3ee'

  return (
    <Float speed={1.2 + Math.random() * 0.8} floatIntensity={0.6} rotationIntensity={0.05}>
      <Html
        transform
        position={position}
        distanceFactor={14}
        style={{ pointerEvents: 'auto' }}
      >
        <div
          onClick={() => onSelect(project)}
          className="w-[220px] p-4 rounded-xl bg-slate-950/50 backdrop-blur-sm border border-white/10 cursor-pointer select-none transition-all duration-300 hover:bg-slate-900/70 hover:border-white/20 hover:scale-105 group"
        >
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="text-xs font-semibold text-white leading-tight pr-2 group-hover:text-cyan-300 transition-colors">
              {project.title}
            </h3>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-white/10 text-slate-500 shrink-0" style={{ borderColor: `${accentColor}33` }}>
              {project.year}
            </span>
          </div>
          <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1.5">{project.shortTech}</p>
          <p className="text-[10px] text-slate-400/80 font-light leading-relaxed line-clamp-2">{project.shortDesc}</p>
          <div className="mt-2 text-[8px] uppercase tracking-widest font-bold flex items-center gap-1.5 text-slate-600 group-hover:text-cyan-400 transition-all duration-300">
            <span className="h-px w-3 bg-slate-600 group-hover:w-6 group-hover:bg-cyan-400 transition-all duration-300" />
            View Details
          </div>
        </div>
      </Html>
    </Float>
  )
}

/* ── Portfolio Zone (scattered project cards) ─────────────── */
function PortfolioContent({ onProjectSelect }: { onProjectSelect: (project: typeof projectsData[0]) => void }) {
  const positions: [number, number, number][] = [
    [-5, 3, 2],
    [4, 2, -3],
    [-3, -2, 3],
    [5, -1, -1],
    [-4, 4, -3],
    [3, -3, 2],
    [-1, 1, -5],
  ]
  
  return (
    <group position={[40, -60, -40]}>
      {projectsData.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={positions[i % positions.length]}
          onSelect={onProjectSelect}
        />
      ))}
    </group>
  )
}

/* ── About Zone (floating bio elements) ───────────────────── */
function AboutContent() {
  return (
    <group position={[0, -30, -40]}>
      {/* Bio card - slightly off-center */}
      <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.05}>
        <Html
          transform
          position={[3, 2, 3]}
          distanceFactor={13}
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-[280px] p-5 rounded-xl bg-slate-950/50 backdrop-blur-sm border border-white/10 select-none">
            <div className="text-[9px] text-cyan-400 tracking-[0.3em] mb-2 font-bold">01 // ABOUT ME</div>
            <h3 className="text-base font-medium text-white tracking-tight mb-3">The Architect.</h3>
            <div className="space-y-2 text-slate-300 font-light text-[10px] leading-relaxed">
              <p>I&apos;m <b className="text-white font-medium">Bayu Darmawan</b>, a Full-Stack Developer and Creative Technologist based in <b className="text-white font-medium">Bandung, Indonesia</b>.</p>
              <p>Currently <b className="text-white font-medium">Technology Lead for Crown Allstar</b> (15x Indonesian National Cheerleading Champion).</p>
              <p className="italic text-cyan-300/80">&quot;Code is poetry, optimization is art, and every interface should feel alive.&quot;</p>
            </div>
          </div>
        </Html>
      </Float>

      {/* Quick facts - scattered */}
      <Float speed={1.8} floatIntensity={0.7} rotationIntensity={0.08}>
        <Html transform position={[-4, 1, 2]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="w-[130px] p-3 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-cyan-400/20 select-none">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Location</div>
            <div className="text-[11px] text-white font-medium">Bandung, ID</div>
          </div>
        </Html>
      </Float>

      <Float speed={2} floatIntensity={0.9} rotationIntensity={0.1}>
        <Html transform position={[-3, -2, 1]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="w-[130px] p-3 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-cyan-400/20 select-none">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Experience</div>
            <div className="text-[11px] text-white font-medium">5+ Years</div>
          </div>
        </Html>
      </Float>

      <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.06}>
        <Html transform position={[4, -1, -2]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="w-[130px] p-3 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-cyan-400/20 select-none">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Specialty</div>
            <div className="text-[11px] text-white font-medium">Full-Stack & WebGL</div>
          </div>
        </Html>
      </Float>

      <Float speed={1.3} floatIntensity={0.8} rotationIntensity={0.07}>
        <Html transform position={[2, 3, -3]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="w-[150px] p-3 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-cyan-400/20 select-none">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Current Role</div>
            <div className="text-[11px] text-white font-medium">Tech Lead @ Crown</div>
          </div>
        </Html>
      </Float>

      <Float speed={1.6} floatIntensity={0.5} rotationIntensity={0.04}>
        <Html transform position={[-1, -3, 3]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="w-[150px] p-3 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-cyan-400/20 select-none">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">Also At</div>
            <div className="text-[11px] text-white font-medium">Dupoin (Fintech)</div>
          </div>
        </Html>
      </Float>
    </group>
  )
}

/* ── Contact Zone (floating links) ────────────────────────── */
function ContactContent() {
  const positions: [number, number, number][] = [
    [-3, 2, 3],
    [3, 1, -2],
    [-1, -2, 2],
  ]

  return (
    <group position={[0, 60, 20]}>
      {/* Title */}
      <Float speed={1} floatIntensity={0.3} rotationIntensity={0.02}>
        <Html transform position={[0, 4, 2]} distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="text-center select-none">
            <div className="text-[9px] text-amber-400 tracking-[0.3em] font-bold mb-1">04 // GET IN TOUCH</div>
            <h3 className="text-lg font-medium text-white tracking-tight">Let&apos;s Connect.</h3>
            <p className="text-[10px] text-slate-400 font-light mt-1 max-w-[200px]">
              Ready to build something amazing together.
            </p>
          </div>
        </Html>
      </Float>

      {/* Contact links as individual floating elements */}
      {contactLinks.map((contact, i) => (
        <Float key={contact.label} speed={1.5 + i * 0.3} floatIntensity={0.7} rotationIntensity={0.05}>
          <Html
            transform
            position={positions[i]}
            distanceFactor={12}
            style={{ pointerEvents: 'auto' }}
          >
            <a
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[180px] p-3 rounded-xl bg-slate-950/50 backdrop-blur-sm border border-white/10 cursor-pointer select-none transition-all duration-300 hover:bg-slate-900/70 hover:border-white/20 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors">{contact.label}</div>
                  <div className="text-[8px] text-slate-400 tracking-widest uppercase mt-0.5">{contact.sub}</div>
                </div>
                <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-0.5 text-sm">→</div>
              </div>
            </a>
          </Html>
        </Float>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SCENE EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function Scene({ activeMenu, isPanelOpen, onProjectSelect }: { 
  activeMenu: string, 
  isPanelOpen: boolean,
  onProjectSelect?: (project: any) => void 
}) {
  const handleProjectSelect = useCallback((project: any) => {
    onProjectSelect?.(project)
  }, [onProjectSelect])

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

            {/* --- ABOUT: Floating content --- */}
            <AboutContent />

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

            {/* --- WORK: Floating project cards --- */}
            <PortfolioContent onProjectSelect={handleProjectSelect} />

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

            {/* --- SKILLS: Floating skill cards --- */}
            <SkillsContent />

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

            {/* --- CONTACT: Floating links --- */}
            <ContactContent />

          </InteractiveWorld>
        </Suspense>
      </Canvas>
    </div>
  )
}

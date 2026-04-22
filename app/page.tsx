"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Scene from './components/Scene'
import ProjectModal from './components/ProjectModal'
import ElectricBorder from './components/ElectricBorder'
import ClickSpark from './components/ClickSpark'
import SpotlightCard from './components/reactbits/SpotlightCard'
import AnimatedContent from './components/reactbits/AnimatedContent'
import GradientText from './components/reactbits/GradientText'
import Magnet from './components/reactbits/Magnet'
import { projectsData } from './data/projects'

/* ── lazy blob cursor (client only, no SSR) ─────────────── */
import dynamic from 'next/dynamic'
const BlobCursor = dynamic(() => import('./components/BlobCursor'), { ssr: false })

/* ── scramble text hook ─────────────────────────────────── */
function useScramble(text: string, trigger: boolean, speed = 30) {
  const [display, setDisplay] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
  useEffect(() => {
    if (!trigger) { setDisplay(text); return }
    let revealed = 0
    const id = setInterval(() => {
      revealed++
      setDisplay(text.split('').map((c, i) =>
        i < revealed ? c : c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
      ).join(''))
      if (revealed >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])
  return display
}

function useTypingEffect(text: string, trigger: boolean, speed = 60) {
  const [display, setDisplay] = useState('')
  useEffect(() => {
    if (!trigger) { setDisplay(''); return }
    let i = 0; setDisplay('')
    const id = setInterval(() => { i++; setDisplay(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])
  return display
}

/* ── color helper ───────────────────────────────────────── */
function getSpotlightColor(colorClass: string): `rgba(${number}, ${number}, ${number}, ${number})` {
  if (colorClass.includes('blue')) return 'rgba(59, 130, 246, 0.15)'
  if (colorClass.includes('emerald')) return 'rgba(16, 185, 129, 0.15)'
  if (colorClass.includes('pink')) return 'rgba(236, 72, 153, 0.15)'
  if (colorClass.includes('amber')) return 'rgba(245, 158, 11, 0.15)'
  if (colorClass.includes('violet')) return 'rgba(139, 92, 246, 0.15)'
  if (colorClass.includes('cyan')) return 'rgba(6, 182, 212, 0.15)'
  if (colorClass.includes('rose')) return 'rgba(244, 63, 94, 0.15)'
  return 'rgba(6, 182, 212, 0.15)'
}

/* ── Camera transition delay (ms) ──────────────────────── */
const CAMERA_TRAVEL_MS = 1600

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const heroTitle = useScramble('Crafting digital', mounted, 40)
  const heroSub = useTypingEffect('experiences that last.', mounted, 50)

  /* ── Navigation handler with timing logic ─────────────── */
  const handleMenuClick = useCallback((menu: string) => {
    // Clear any pending content timer
    if (contentTimerRef.current) {
      clearTimeout(contentTimerRef.current)
      contentTimerRef.current = null
    }

    if (menu === 'home') {
      // Fade out content FIRST, then move camera
      setContentVisible(false)
      setTimeout(() => {
        setIsPanelOpen(false)
        setActiveMenu('home')
      }, 400) // wait for content fade-out
    } else {
      // 1. Fade out any existing content immediately
      setContentVisible(false)
      
      // 2. Move camera immediately
      setTimeout(() => {
        setActiveMenu(menu)
        setIsPanelOpen(true)
      }, contentVisible ? 400 : 0) // if content was visible, wait for fade-out

      // 3. Show content AFTER camera arrives
      contentTimerRef.current = setTimeout(() => {
        setContentVisible(true)
      }, (contentVisible ? 400 : 0) + CAMERA_TRAVEL_MS)
    }
  }, [contentVisible])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (contentTimerRef.current) clearTimeout(contentTimerRef.current)
    }
  }, [])

  return (
    <ClickSpark sparkColor="#06b6d4" sparkSize={12} sparkRadius={25} sparkCount={10} duration={500} extraScale={1.5}>
      <main className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        
        {/* Blob Cursor — desktop only */}
        <div className="hidden md:block">
          {mounted && <BlobCursor 
            fillColor="#06b6d4" 
            trailCount={3} 
            sizes={[40, 90, 55]} 
            innerSizes={[12, 25, 18]} 
            innerColor="rgba(255,255,255,0.6)"
            opacities={[0.3, 0.2, 0.15]}
            shadowBlur={0} shadowOffsetX={0} shadowOffsetY={0}
            zIndex={50}
          />}
        </div>

        {/* 3D Scene — always present */}
        <Scene activeMenu={activeMenu} isPanelOpen={isPanelOpen} />

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 w-full p-6 md:p-10 z-30 flex justify-between items-center pointer-events-auto transition-all duration-300 ${isPanelOpen ? "text-white mix-blend-difference" : "bg-slate-950/80 backdrop-blur-md text-white border-b border-white/5"}`}>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[0.2em] text-slate-400">PORTFOLIO</span>
            <span className="text-xl md:text-2xl font-black tracking-widest uppercase mt-1">BAYU DARMAWAN</span>
          </div>
          <ul className="flex gap-4 md:gap-8 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
            {[
              { key: 'home', label: 'Home' },
              { key: 'about', label: 'About' },
              { key: 'portfolio', label: 'Work' },
              { key: 'services', label: 'Skills' },
              { key: 'contact', label: 'Contact' }
            ].map(item => (
              <li key={item.key}>
                <Magnet padding={40} magnetStrength={3}>
                  <button 
                    onClick={() => handleMenuClick(item.key)} 
                    className={`hover:text-white transition-all duration-300 relative group cursor-pointer ${activeMenu === item.key ? 'text-white' : 'text-slate-400'}`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === item.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </button>
                </Magnet>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hero Text — Home */}
        <div className={`fixed bottom-12 left-6 md:left-12 z-10 max-w-3xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${!isPanelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-cyan-400 font-bold tracking-[0.3em] mb-4 text-xs md:text-sm">FULL-STACK DEVELOPER &amp; CREATIVE TECHNOLOGIST</h2>
          <h1 className="text-5xl md:text-[5.5rem] font-medium mb-6 text-white leading-[1.1] tracking-tight">
            <span className="font-mono">{heroTitle}</span>
            <br/>
            <span className="italic font-light text-slate-400">{heroSub}<span className="animate-pulse">|</span></span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl font-light leading-relaxed border-l border-cyan-400/50 pl-4">
            Building high-performance web applications, immersive 3D interfaces, and AI-powered tools. From enterprise dashboards to WebGL portfolios.
          </p>
          <Magnet padding={60} magnetStrength={4}>
            <button onClick={() => handleMenuClick('about')} className="mt-8 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] font-bold pointer-events-auto cursor-pointer">
              Explore My World
            </button>
          </Magnet>
        </div>

        {/* ═══════════════════════════════════════════════════════
            CONTENT PANELS — elegant side panels, not fullscreen
            Each section waits for camera transition to complete
        ═══════════════════════════════════════════════════════ */}

        {/* ── PORTFOLIO: Spotlight Cards in elegant list ── */}
        {activeMenu === 'portfolio' && (
          <div className="fixed inset-0 z-20 pointer-events-none">
            <div className="w-full h-full flex items-center justify-end p-6 md:p-12">
              <AnimatedContent
                show={contentVisible}
                distance={80}
                direction="horizontal"
                reverse
                duration={0.9}
                delay={0}
                className="w-full max-w-xl max-h-[80vh] overflow-y-auto pointer-events-auto scrollbar-thin scrollbar-thumb-white/10 pr-2"
              >
                <div className="mb-6">
                  <div className="text-[10px] text-blue-400 tracking-[0.3em] mb-3 font-bold">02 // SELECTED WORKS</div>
                  <GradientText
                    colors={['#60a5fa', '#38bdf8', '#818cf8', '#60a5fa']}
                    animationSpeed={6}
                    className="!mx-0 !justify-start"
                  >
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
                      Project Archive.
                    </h2>
                  </GradientText>
                </div>
                
                <div className="space-y-4">
                  {projectsData.map((project, index) => (
                    <SpotlightCard
                      key={project.id}
                      spotlightColor={getSpotlightColor(project.colorClass)}
                      className="!p-0 !rounded-2xl border-white/[0.06] bg-slate-900/60 backdrop-blur-md cursor-pointer group transition-all duration-300 hover:border-white/15 hover:scale-[1.01]"
                    >
                      <div 
                        className="p-5"
                        onClick={() => setSelectedProject(project)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`text-base font-semibold text-white group-hover:${project.colorClass} transition-colors duration-300`}>
                            {project.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-slate-500 shrink-0 ml-3">
                            {project.year}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">{project.shortTech}</p>
                        <p className="text-xs text-slate-400/80 font-light leading-relaxed line-clamp-2">{project.shortDesc}</p>
                        <div className="mt-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-slate-600 group-hover:text-cyan-400 transition-all duration-300">
                          <span className="h-px w-4 bg-slate-600 group-hover:w-8 group-hover:bg-cyan-400 transition-all duration-300" />
                          View Details
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </AnimatedContent>
            </div>
          </div>
        )}

        {/* ── ABOUT: Elegant side panel with ElectricBorder ── */}
        {activeMenu === 'about' && (
          <div className="fixed inset-0 z-20 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
              <AnimatedContent
                show={contentVisible}
                distance={100}
                duration={1}
                delay={0}
                className="w-full max-w-3xl pointer-events-auto"
              >
                <ElectricBorder color="#06b6d4" speed={0.5} chaos={0.06} borderRadius={24}>
                  <div className="p-8 md:p-12 bg-slate-950/80 backdrop-blur-xl rounded-3xl">
                    <div className="text-[10px] text-cyan-400 tracking-[0.3em] mb-4 font-bold">01 // ABOUT ME</div>
                    <GradientText
                      colors={['#22d3ee', '#06b6d4', '#67e8f9', '#22d3ee']}
                      animationSpeed={5}
                      className="!mx-0 !justify-start mb-8"
                    >
                      <h2 className="text-4xl font-medium tracking-tight">The Architect.</h2>
                    </GradientText>
                    <div className="space-y-5 text-slate-300 font-light text-sm leading-relaxed">
                      <p>I&apos;m <b className="text-white font-medium">Bayu Darmawan</b>, a Full-Stack Developer and Creative Technologist based in <b className="text-white font-medium">Bandung, Indonesia</b>. I specialize in building end-to-end web applications — from database architecture to immersive 3D front-end experiences.</p>
                      <p>Currently serving as the <b className="text-white font-medium">Technology Lead for Crown Allstar</b> (15x Indonesian National Cheerleading Champion, ICU World Cup representative), where I manage all digital platforms, data systems, and AI-powered tools.</p>
                      <p>I also work at <b className="text-white font-medium">Dupoin</b>, a financial services company, where I build internal enterprise dashboards integrating Lark HR, PostgreSQL, and Xero accounting APIs.</p>
                      <p>My philosophy: <span className="italic text-cyan-300">&quot;Code is poetry, optimization is art, and every interface should feel alive.&quot;</span></p>
                    </div>
                    <div className="mt-10 pt-6 border-t border-white/10">
                      <h3 className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.2em]">Quick Facts</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div><span className="text-slate-500">Location</span><br/><span className="text-white">Bandung, Indonesia</span></div>
                        <div><span className="text-slate-500">Experience</span><br/><span className="text-white">5+ Years</span></div>
                        <div><span className="text-slate-500">Specialty</span><br/><span className="text-white">Full-Stack &amp; WebGL</span></div>
                        <div><span className="text-slate-500">Current Role</span><br/><span className="text-white">Tech Lead @ Crown Allstar</span></div>
                      </div>
                    </div>
                  </div>
                </ElectricBorder>
              </AnimatedContent>
            </div>
          </div>
        )}

        {/* ── SKILLS: Clean panel ── */}
        {activeMenu === 'services' && (
          <div className="fixed inset-0 z-20 pointer-events-none">
            <div className="w-full h-full flex items-center justify-start p-6 md:p-12">
              <AnimatedContent
                show={contentVisible}
                distance={80}
                direction="horizontal"
                duration={0.9}
                delay={0}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto pointer-events-auto scrollbar-thin scrollbar-thumb-white/10 ml-0 md:ml-8"
              >
                <div className="p-8 md:p-10 bg-slate-950/70 backdrop-blur-xl rounded-3xl border border-white/[0.06]">
                  <div className="text-[10px] text-indigo-400 tracking-[0.3em] mb-4 font-bold">03 // CAPABILITIES</div>
                  <GradientText
                    colors={['#a78bfa', '#818cf8', '#c4b5fd', '#a78bfa']}
                    animationSpeed={5}
                    className="!mx-0 !justify-start mb-8"
                  >
                    <h2 className="text-4xl font-medium tracking-tight">Technical Stack.</h2>
                  </GradientText>
                  <div className="space-y-7">
                    {[
                      { title: 'Frontend & UI', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
                      { title: '3D & WebGL', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
                      { title: 'Backend & Database', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
                      { title: 'DevOps & Cloud', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
                      { title: 'AI & Integrations', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
                    ].map(category => (
                      <div key={category.title}>
                        <h3 className="text-[10px] text-white/50 mb-3 uppercase tracking-[0.2em]">{category.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {category.techs.map(tech => (
                            <span key={tech} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs transition-colors cursor-default rounded-lg">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        )}

        {/* ── CONTACT: Centered panel with ElectricBorder ── */}
        {activeMenu === 'contact' && (
          <div className="fixed inset-0 z-20 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
              <AnimatedContent
                show={contentVisible}
                distance={80}
                duration={0.9}
                delay={0}
                reverse
                className="w-full max-w-lg pointer-events-auto"
              >
                <ElectricBorder color="#f59e0b" speed={0.5} chaos={0.06} borderRadius={24}>
                  <div className="p-8 md:p-10 bg-slate-950/80 backdrop-blur-xl rounded-3xl">
                    <div className="text-[10px] text-amber-400 tracking-[0.3em] mb-4 font-bold">04 // GET IN TOUCH</div>
                    <GradientText
                      colors={['#fbbf24', '#f59e0b', '#fcd34d', '#fbbf24']}
                      animationSpeed={5}
                      className="!mx-0 !justify-start mb-6"
                    >
                      <h2 className="text-4xl font-medium tracking-tight">Let&apos;s Connect.</h2>
                    </GradientText>
                    <p className="text-slate-300 font-light text-sm leading-relaxed mb-8">
                      Interested in working together? Whether it&apos;s a complex enterprise dashboard, an immersive 3D experience, or AI-powered automation — I&apos;m ready to build it.
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout' },
                        { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900' },
                        { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com' },
                      ].map(c => (
                        <Magnet key={c.label} padding={30} magnetStrength={5}>
                          <a href={c.href} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group w-full">
                            <div>
                              <div className="text-sm font-medium text-white">{c.label}</div>
                              <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-0.5">{c.sub}</div>
                            </div>
                            <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</div>
                          </a>
                        </Magnet>
                      ))}
                    </div>
                  </div>
                </ElectricBorder>
              </AnimatedContent>
            </div>
          </div>
        )}

        {/* Close button — visible when any section is open */}
        <button 
          onClick={() => handleMenuClick('home')}
          className={`fixed top-28 right-8 z-30 text-[10px] tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-500 uppercase group flex items-center gap-2 cursor-pointer pointer-events-auto ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <span className="w-6 h-px bg-slate-400 group-hover:bg-white group-hover:w-8 transition-all" /> CLOSE
        </button>

        {/* Project Detail Modal */}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      </main>
    </ClickSpark>
  )
}

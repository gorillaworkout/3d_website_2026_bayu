"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Scene from './components/Scene'
import ProjectModal from './components/ProjectModal'
import ClickSpark from './components/ClickSpark'
import Magnet from './components/reactbits/Magnet'

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

/* ── Camera transition delay (ms) ──────────────────────── */
const CAMERA_TRAVEL_MS = 1600

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
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
      setIsPanelOpen(false)
      setActiveMenu('home')
    } else {
      setActiveMenu(menu)
      setIsPanelOpen(true)
    }
  }, [])

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

        {/* 3D Scene — contains all section content now */}
        <Scene 
          activeMenu={activeMenu} 
          isPanelOpen={isPanelOpen} 
          onProjectSelect={(project) => setSelectedProject(project)}
        />

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

        {/* Close button — visible when any section is open */}
        <button 
          onClick={() => handleMenuClick('home')}
          className={`fixed top-28 right-8 z-30 text-[10px] tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-500 uppercase group flex items-center gap-2 cursor-pointer pointer-events-auto ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <span className="w-6 h-px bg-slate-400 group-hover:bg-white group-hover:w-8 transition-all" /> CLOSE
        </button>

        {/* Project Detail Modal — still an overlay (makes sense for detailed view) */}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      </main>
    </ClickSpark>
  )
}

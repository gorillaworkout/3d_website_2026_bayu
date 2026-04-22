"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Scene from './components/Scene'
import ProjectModal from './components/ProjectModal'
import ClickSpark from './components/ClickSpark'
import { projectsData } from './data/projects'

/* ── lazy blob cursor (client only, no SSR) ─────────────── */
import dynamic from 'next/dynamic'
const BlobCursor = dynamic(() => import('./components/BlobCursor'), { ssr: false })

/* ── Skills data (moved from Scene.tsx) ──────────────────── */
const skillCategories = [
  { title: 'Frontend & UI', color: '#60a5fa', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
  { title: '3D & WebGL', color: '#c084fc', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
  { title: 'Backend & Database', color: '#34d399', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
  { title: 'DevOps & Cloud', color: '#fb923c', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
  { title: 'AI & Integrations', color: '#f472b6', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
]

/* ── Contact data (moved from Scene.tsx) ─────────────────── */
const contactLinks = [
  { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout', color: '#a78bfa' },
  { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900', color: '#22c55e' },
  { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com', color: '#f59e0b' },
]

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
const CAMERA_TRAVEL_MS = 1500

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [visibleSection, setVisibleSection] = useState<string | null>(null)
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

    // Instantly hide current content
    setContentVisible(false)

    if (menu === 'home') {
      setIsPanelOpen(false)
      setActiveMenu('home')
      setVisibleSection(null)
    } else {
      setActiveMenu(menu)
      setIsPanelOpen(true)
      // Show content AFTER camera arrives
      contentTimerRef.current = setTimeout(() => {
        setVisibleSection(menu)
        setContentVisible(true)
      }, CAMERA_TRAVEL_MS)
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (contentTimerRef.current) clearTimeout(contentTimerRef.current)
    }
  }, [])

  /* ── Color map for project accent colors ─────────────── */
  const colorMap: Record<string, string> = {
    'text-blue-400': '#60a5fa',
    'text-emerald-400': '#34d399',
    'text-pink-400': '#f472b6',
    'text-amber-400': '#fbbf24',
    'text-violet-400': '#a78bfa',
    'text-cyan-400': '#22d3ee',
    'text-rose-400': '#fb7185',
  }

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

        {/* 3D Scene — only visual atmosphere + camera transitions */}
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
                <button
                  onClick={() => handleMenuClick(item.key)}
                  className={`hover:text-white transition-all duration-300 relative group cursor-pointer ${activeMenu === item.key ? 'text-white' : 'text-slate-400'}`}
                >
                  {item.label}
                  <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === item.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </button>
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
          <button onClick={() => handleMenuClick('about')} className="mt-8 px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] font-bold pointer-events-auto cursor-pointer">
            Explore My World
          </button>
        </div>

        {/* Close button — visible when any section is open */}
        <button
          onClick={() => handleMenuClick('home')}
          className={`fixed top-28 right-8 z-30 text-[10px] tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-500 uppercase group flex items-center gap-2 cursor-pointer pointer-events-auto ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <span className="w-6 h-px bg-slate-400 group-hover:bg-white group-hover:w-8 transition-all" /> CLOSE
        </button>

        {/* ═══════════════════════════════════════════════════
            2D OVERLAY PANELS — appear after camera arrives
           ═══════════════════════════════════════════════════ */}

        {/* ── ABOUT PANEL ── Left side */}
        {visibleSection === 'about' && (
          <div
            className={`fixed left-8 top-28 bottom-8 z-20 max-w-sm w-full pointer-events-auto overflow-y-auto transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="text-[9px] text-cyan-400 tracking-[0.3em] font-bold">01 // ABOUT ME</div>
              <h3 className="text-lg font-medium text-white tracking-tight">The Architect.</h3>
              <div className="space-y-3 text-slate-300 font-light text-sm leading-relaxed">
                <p>I&apos;m <b className="text-white font-medium">Bayu Darmawan</b>, a Full-Stack Developer based in <b className="text-white font-medium">Bandung, Indonesia</b>.</p>
                <p><b className="text-white font-medium">Tech Lead @ Crown Allstar</b> — 15x National Cheerleading Champion.</p>
                <p className="italic text-cyan-300/80">&quot;Code is poetry, optimization is art.&quot;</p>
              </div>

              <div className="h-px bg-white/10 my-4" />

              {/* Quick facts */}
              {[
                { label: 'Location', value: 'Bandung, ID' },
                { label: 'Experience', value: '5+ Years' },
                { label: 'Specialty', value: 'Full-Stack & WebGL' },
                { label: 'Also At', value: 'Dupoin (Fintech)' },
              ].map((fact, index) => (
                <div
                  key={fact.label}
                  className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{fact.label}</span>
                  <span className="text-xs text-white font-medium">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PORTFOLIO (WORK) PANEL ── Right side scrollable */}
        {visibleSection === 'portfolio' && (
          <div
            className={`fixed right-8 top-28 bottom-8 z-20 max-w-md w-full pointer-events-auto overflow-y-auto transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="space-y-3">
              {projectsData.map((project, index) => {
                const accentColor = colorMap[project.colorClass] || '#22d3ee'
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`bg-black/40 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all duration-700 ease-out hover:border-white/25 hover:scale-[1.02] hover:bg-black/50 group ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${accentColor}15, inset 0 1px 0 ${accentColor}20`
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-white leading-tight pr-3 group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full border shrink-0 text-slate-400"
                        style={{ borderColor: `${accentColor}44` }}
                      >
                        {project.year}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1.5">{project.shortTech}</p>
                    <p className="text-xs text-slate-400/80 font-light leading-relaxed line-clamp-2">{project.shortDesc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── SKILLS PANEL ── Bottom horizontal scroll */}
        {visibleSection === 'services' && (
          <div
            className={`fixed bottom-8 left-8 right-8 z-20 pointer-events-auto transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {skillCategories.map((cat, index) => (
                <div
                  key={cat.title}
                  className={`flex-shrink-0 w-56 bg-black/40 border border-white/10 rounded-2xl p-4 transition-all duration-700 ease-out hover:border-white/25 hover:scale-[1.02] ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${cat.color}15, inset 0 1px 0 ${cat.color}20`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: cat.color }}>
                    {cat.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.techs.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-white/5 border border-white/5 text-slate-300 text-[10px] rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTACT PANEL ── Right side centered */}
        {visibleSection === 'contact' && (
          <div
            className={`fixed right-8 top-1/2 -translate-y-1/2 z-20 max-w-xs w-full pointer-events-auto transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-[-46%]'}`}
          >
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="text-[9px] text-amber-400 tracking-[0.3em] font-bold">04 // GET IN TOUCH</div>
              <h3 className="text-lg font-medium text-white tracking-tight">Let&apos;s Connect.</h3>

              <div className="h-px bg-white/10" />

              {contactLinks.map((contact, index) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-3 rounded-xl border border-white/10 transition-all duration-700 ease-out hover:border-white/25 hover:scale-[1.02] group ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{
                    transitionDelay: `${(index + 1) * 100}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${contact.color}15, inset 0 1px 0 ${contact.color}20`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors">{contact.label}</div>
                      <div className="text-[10px] text-slate-400 tracking-wider mt-0.5">{contact.sub}</div>
                    </div>
                    <div className="text-slate-500 group-hover:text-white transition-colors text-sm">→</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      </main>
    </ClickSpark>
  )
}

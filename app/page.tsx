"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Home, User, Cpu, Briefcase, Mail } from 'lucide-react'

/* ── Existing components ──────────────────────────── */
import ProjectModal from './components/ProjectModal'

/* ── ReactBits components ─────────────────────────── */
import GradientText from './components/reactbits/GradientText'
import CountUp from './components/reactbits/CountUp'

/* ── Data ─────────────────────────────────────────── */
import { projectsData } from './data/projects'

/* ── Lazy loaded heavy components (no SSR) ────────── */
const Particles = dynamic(() => import('./components/reactbits/Particles'), { ssr: false })

/* ── Data ─────────────────────────────────────────── */
const skillCategories = [
  { title: 'Frontend & UI', color: '#60a5fa', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
  { title: '3D & WebGL', color: '#c084fc', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
  { title: 'Backend & Database', color: '#34d399', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
  { title: 'DevOps & Cloud', color: '#fb923c', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
  { title: 'AI & Integrations', color: '#f472b6', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
]

const contactLinks = [
  { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout', color: '#a78bfa' },
  { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900', color: '#22c55e' },
  { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com', color: '#f59e0b' },
  { label: 'LinkedIn', sub: 'Bayu Darmawan', href: 'https://linkedin.com/in/bayudarmawan', color: '#0ea5e9' },
]

const stats = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: 'x', label: 'National Champion' },
]

const sections = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'projects', label: 'Work', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
]

const colorMap: Record<string, string> = {
  'text-blue-400': '#60a5fa',
  'text-emerald-400': '#34d399',
  'text-pink-400': '#f472b6',
  'text-amber-400': '#fbbf24',
  'text-violet-400': '#a78bfa',
  'text-cyan-400': '#22d3ee',
  'text-rose-400': '#fb7185',
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════ */

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const lastWheelTime = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  // Navigate to section
  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= sections.length || isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex(index)

    if (viewportRef.current) {
      viewportRef.current.style.transform = `translateY(-${index * 100}vh)`
    }

    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning])

  // Wheel handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if a project modal is open
      if (selectedProject) return

      const now = Date.now()
      if (now - lastWheelTime.current < 1000) return
      lastWheelTime.current = now

      if (e.deltaY > 30) {
        goToSection(activeIndex + 1)
      } else if (e.deltaY < -30) {
        goToSection(activeIndex - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeIndex, goToSection, selectedProject])

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedProject) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goToSection(activeIndex + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToSection(activeIndex - 1)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex, goToSection, selectedProject])

  // Touch handler for mobile
  useEffect(() => {
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (selectedProject) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) {
        if (delta > 0) goToSection(activeIndex + 1)
        else goToSection(activeIndex - 1)
      }
    }
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeIndex, goToSection, selectedProject])

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050510] text-slate-100 font-[family-name:var(--font-geist-sans)]">

      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* ═══════════════════════════════════════════
          SIDEBAR NAV — Desktop
         ═══════════════════════════════════════════ */}
      <nav className="sidebar-nav hidden md:flex">
        <div className="sidebar-active-line" style={{ top: `${activeIndex * 56 + 8}px` }} />
        {sections.map((sec, i) => {
          const Icon = sec.icon
          return (
            <div
              key={sec.id}
              className={`sidebar-nav-item ${activeIndex === i ? 'active' : ''}`}
              onClick={() => goToSection(i)}
            >
              <span className="nav-number">{String(i + 1).padStart(2, '0')}</span>
              <div className="nav-icon">
                <Icon size={18} color={activeIndex === i ? '#22d3ee' : '#64748b'} />
              </div>
              <span className="nav-label">{sec.label}</span>
            </div>
          )
        })}
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE NAV — Bottom bar
         ═══════════════════════════════════════════ */}
      <nav className="mobile-nav md:hidden">
        {sections.map((sec, i) => {
          const Icon = sec.icon
          return (
            <div
              key={sec.id}
              className={`mobile-nav-item ${activeIndex === i ? 'active' : ''}`}
              onClick={() => goToSection(i)}
            >
              <Icon size={18} className="mobile-nav-icon" />
              <span className="mobile-nav-label">{sec.label}</span>
            </div>
          )
        })}
      </nav>

      {/* ═══════════════════════════════════════════
          SECTION VIEWPORT — slides vertically
         ═══════════════════════════════════════════ */}
      <div
        ref={viewportRef}
        className="sections-viewport"
        style={{ transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)' }}
      >

        {/* ═══════════════════════════════════════════
            SECTION 0: HERO
           ═══════════════════════════════════════════ */}
        <section className="section-panel circuit-bg" style={{ top: '0vh' }}>
          {/* Particles BG */}
          {mounted && (
            <div className="absolute inset-0 z-0">
              <Particles
                count={100}
                color="#22d3ee"
                speed={0.15}
                connectDistance={100}
              />
            </div>
          )}

          <div className="relative z-10 flex items-center justify-center h-full px-6 md:pl-20">
            <div className="text-center max-w-4xl">
              {/* Name */}
              <h1 className="hero-name mb-4">
                <span
                  className="cyber-glitch block text-[clamp(3rem,11vw,9rem)] font-black tracking-tighter leading-[0.85] font-[family-name:var(--font-geist-mono)] neon-cyan"
                  data-text="BAYU"
                >
                  BAYU
                </span>
                <span
                  className="cyber-glitch block text-[clamp(2.5rem,9vw,7rem)] font-black tracking-tighter leading-[0.85] font-[family-name:var(--font-geist-mono)] mt-2"
                  data-text="DARMAWAN"
                  style={{ color: '#ec4899', textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}
                >
                  DARMAWAN
                </span>
              </h1>

              {/* Animated line */}
              <div className="animated-line w-48 md:w-72 mx-auto my-8" />

              {/* Subtitle */}
              <div className="subtitle-pulse">
                <span className="text-xs md:text-sm font-[family-name:var(--font-geist-mono)] tracking-[0.3em] uppercase text-cyan-400">
                  Full-Stack Developer · Creative Technologist
                </span>
              </div>

              {/* Tagline */}
              <div className="mt-6">
                <GradientText
                  colors={['#22d3ee', '#8b5cf6', '#ec4899', '#22d3ee']}
                  animationSpeed={6}
                  className="text-lg md:text-2xl font-light tracking-wide"
                >
                  Crafting digital experiences
                </GradientText>
              </div>

              {/* Scroll hint */}
              <div className="mt-16 flex flex-col items-center gap-2 opacity-50">
                <span className="text-[9px] tracking-[0.3em] uppercase font-[family-name:var(--font-geist-mono)] text-slate-500">
                  Scroll or use nav
                </span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-400/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 1: ABOUT
           ═══════════════════════════════════════════ */}
        <section className="section-panel" style={{ top: '100vh' }}>
          <div className="section-panel-inner">
            <div className="neon-line-h w-full" />
            <div className="min-h-screen flex items-center py-16 md:py-0">
              <div className="max-w-5xl mx-auto px-6 md:pl-24 md:pr-12 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                  {/* Left — Bio */}
                  <div>
                    <span className="text-[10px] font-[family-name:var(--font-geist-mono)] text-cyan-400 tracking-[0.3em] uppercase">
                      01 // About Me
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-3 mb-2 font-[family-name:var(--font-geist-mono)]">
                      The Architect<span className="typing-cursor" />
                    </h2>
                    <div className="heading-line mb-8" />

                    <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed mb-6">
                      I&apos;m Bayu Darmawan, a Full-Stack Developer based in Bandung, Indonesia.
                      Tech Lead at Crown Allstar — a 15x National Cheerleading Champion team.
                      I bridge the gap between creative design and robust engineering.
                    </p>
                    <p className="text-sm md:text-base text-slate-500 font-light leading-relaxed italic mb-8">
                      &quot;Code is poetry, optimization is art.&quot;
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {stats.map((stat) => (
                        <div key={stat.label} className="stat-box">
                          <div className="text-2xl md:text-3xl font-black font-[family-name:var(--font-geist-mono)] neon-cyan">
                            <CountUp to={stat.value} duration={2.5} suffix={stat.suffix} />
                          </div>
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-2 font-[family-name:var(--font-geist-mono)]">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick facts */}
                    <div className="mt-8 space-y-2">
                      {[
                        { label: 'Location', value: 'Bandung, ID' },
                        { label: 'Specialty', value: 'Full-Stack & WebGL' },
                        { label: 'Also At', value: 'Dupoin (Fintech)' },
                      ].map((fact) => (
                        <div
                          key={fact.label}
                          className="flex items-center justify-between py-2 border-b border-white/5"
                        >
                          <span className="text-[10px] text-slate-600 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
                            {fact.label}
                          </span>
                          <span className="text-xs text-cyan-400 font-medium font-[family-name:var(--font-geist-mono)]">
                            {fact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — Decorative card */}
                  <div className="flex items-center justify-center">
                    <div className="cyber-card cyber-corners p-8 w-full max-w-sm">
                      <div className="text-[10px] font-[family-name:var(--font-geist-mono)] text-cyan-400/60 tracking-widest uppercase mb-4">
                        sys://profile.dat
                      </div>
                      <div className="space-y-3 font-[family-name:var(--font-geist-mono)] text-xs">
                        <div className="flex gap-2">
                          <span className="text-magenta-400" style={{ color: '#ec4899' }}>const</span>
                          <span className="text-cyan-400">developer</span>
                          <span className="text-slate-500">=</span>
                          <span className="text-slate-300">{`{`}</span>
                        </div>
                        <div className="pl-4 space-y-1 text-[11px]">
                          <div><span className="text-purple-400">name</span><span className="text-slate-500">:</span> <span className="text-green-400">&quot;Bayu Darmawan&quot;</span>,</div>
                          <div><span className="text-purple-400">role</span><span className="text-slate-500">:</span> <span className="text-green-400">&quot;Full-Stack Dev&quot;</span>,</div>
                          <div><span className="text-purple-400">stack</span><span className="text-slate-500">:</span> <span className="text-amber-400">[</span><span className="text-green-400">&quot;React&quot;</span>, <span className="text-green-400">&quot;Node&quot;</span>, <span className="text-green-400">&quot;3D&quot;</span><span className="text-amber-400">]</span>,</div>
                          <div><span className="text-purple-400">passion</span><span className="text-slate-500">:</span> <span className="text-green-400">&quot;∞&quot;</span>,</div>
                          <div><span className="text-purple-400">coffee</span><span className="text-slate-500">:</span> <span className="text-cyan-400">true</span>,</div>
                        </div>
                        <div className="text-slate-300">{`}`}</div>
                      </div>
                      <div className="mt-6 neon-line-h" />
                      <div className="mt-4 text-[9px] text-slate-600 font-[family-name:var(--font-geist-mono)] tracking-wider">
                        STATUS: <span className="text-green-400">● ONLINE</span> | LAST BUILD: 2026
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2: SKILLS
           ═══════════════════════════════════════════ */}
        <section className="section-panel" style={{ top: '200vh' }}>
          <div className="section-panel-inner">
            <div className="neon-line-h w-full" />
            <div className="min-h-screen flex items-center py-16 md:py-0">
              <div className="max-w-5xl mx-auto px-6 md:pl-24 md:pr-12 w-full">
                <span className="text-[10px] font-[family-name:var(--font-geist-mono)] text-purple-400 tracking-[0.3em] uppercase">
                  02 // Skills
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-3 mb-2 font-[family-name:var(--font-geist-mono)]">
                  Tech Arsenal<span className="typing-cursor" />
                </h2>
                <div className="heading-line mb-10" style={{ background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillCategories.map((cat) => (
                    <div
                      key={cat.title}
                      className="cyber-card p-6 rounded-xl"
                      style={{ '--card-accent': cat.color } as any}
                    >
                      <div
                        className="text-xs font-bold uppercase tracking-[0.12em] mb-4 font-[family-name:var(--font-geist-mono)]"
                        style={{ color: cat.color }}
                      >
                        {cat.title}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.techs.map(tech => (
                          <span
                            key={tech}
                            className="tech-tag px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[10px] font-[family-name:var(--font-geist-mono)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3: PROJECTS
           ═══════════════════════════════════════════ */}
        <section className="section-panel" style={{ top: '300vh' }}>
          <div className="section-panel-inner">
            <div className="neon-line-h w-full" />
            <div className="min-h-screen py-16 md:py-20">
              <div className="max-w-5xl mx-auto px-6 md:pl-24 md:pr-12 w-full">
                <span className="text-[10px] font-[family-name:var(--font-geist-mono)] text-emerald-400 tracking-[0.3em] uppercase">
                  03 // Work
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-3 mb-2 font-[family-name:var(--font-geist-mono)]">
                  Selected Projects<span className="typing-cursor" />
                </h2>
                <div className="heading-line mb-10" style={{ background: '#34d399', boxShadow: '0 0 10px #34d399' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsData.map((project, index) => {
                    const accentColor = colorMap[project.colorClass] || '#22d3ee'
                    const num = String(index + 1).padStart(2, '0')
                    return (
                      <div
                        key={project.id}
                        className="project-card-cyber p-6 group"
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Number + title */}
                        <div className="flex items-start gap-3 mb-3">
                          <span
                            className="text-3xl font-black font-[family-name:var(--font-geist-mono)] opacity-20"
                            style={{ color: accentColor }}
                          >
                            {num}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors font-[family-name:var(--font-geist-mono)]">
                              {project.title}
                            </h3>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-[family-name:var(--font-geist-mono)]">
                              {project.shortTech}
                            </p>
                          </div>
                          <span
                            className="text-[9px] px-2 py-1 rounded border font-[family-name:var(--font-geist-mono)] text-slate-500 shrink-0"
                            style={{ borderColor: `${accentColor}44` }}
                          >
                            {project.year}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-light leading-relaxed mb-4 line-clamp-2">
                          {project.shortDesc}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 group-hover:text-cyan-400 transition-colors font-[family-name:var(--font-geist-mono)]">
                          <span>View Details</span>
                          <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        {/* Accent glow */}
                        <div
                          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full"
                          style={{ background: `radial-gradient(ellipse at top right, ${accentColor}, transparent 70%)` }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 4: CONTACT
           ═══════════════════════════════════════════ */}
        <section className="section-panel" style={{ top: '400vh' }}>
          <div className="section-panel-inner">
            <div className="neon-line-h w-full" />
            <div className="min-h-screen flex items-center py-16 md:py-0">
              <div className="max-w-3xl mx-auto px-6 md:pl-24 md:pr-12 w-full">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-[family-name:var(--font-geist-mono)] text-amber-400 tracking-[0.3em] uppercase">
                    04 // Contact
                  </span>
                  <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight mt-3 mb-2 font-[family-name:var(--font-geist-mono)]">
                    Let&apos;s Connect<span className="typing-cursor" />
                  </h2>
                  <div className="heading-line mx-auto mb-6" style={{ background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
                  <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md mx-auto">
                    Have a project in mind or just want to say hello?
                    I&apos;m always open to discussing new ideas and opportunities.
                  </p>
                </div>

                {/* Contact links */}
                <div className="space-y-3">
                  {contactLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-link"
                      style={{ '--link-color': link.color } as any}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-[family-name:var(--font-geist-mono)]"
                        style={{ background: `${link.color}15`, color: link.color }}
                      >
                        {link.label[0]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white font-[family-name:var(--font-geist-mono)]">
                          {link.label}
                        </div>
                        <div className="text-[11px] text-slate-500 font-[family-name:var(--font-geist-mono)]">
                          {link.sub}
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-600" />
                    </a>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-6 border-t border-white/5 text-center">
                  <p className="text-[9px] text-slate-600 tracking-[0.2em] uppercase font-[family-name:var(--font-geist-mono)]">
                    © 2026 · Bayu Darmawan · Built with obsession
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}

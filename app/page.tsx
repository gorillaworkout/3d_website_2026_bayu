"use client"

import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import ProjectModal from './components/ProjectModal'
import ElectricBorder from './components/ElectricBorder'
import ClickSpark from './components/ClickSpark'
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
function getProjectColor(colorClass: string): string {
  if (colorClass.includes('blue')) return '#3b82f6'
  if (colorClass.includes('emerald')) return '#10b981'
  if (colorClass.includes('pink')) return '#ec4899'
  if (colorClass.includes('amber')) return '#f59e0b'
  if (colorClass.includes('violet')) return '#8b5cf6'
  if (colorClass.includes('cyan')) return '#06b6d4'
  if (colorClass.includes('rose')) return '#f43f5e'
  return '#06b6d4'
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const heroTitle = useScramble('Crafting digital', mounted, 40)
  const heroSub = useTypingEffect('experiences that last.', mounted, 50)

  const handleMenuClick = (menu: string) => {
    if (menu === 'home') {
      setIsPanelOpen(false)
      setTimeout(() => setActiveMenu('home'), 200)
    } else {
      setActiveMenu(menu)
      setIsPanelOpen(true)
    }
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
                <button 
                  onClick={() => handleMenuClick(item.key)} 
                  className={`hover:text-white transition-all duration-300 relative group ${activeMenu === item.key ? 'text-white' : 'text-slate-400'}`}
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

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT OVERLAY — appears on top of 3D scene
            Each section fades in when its menu is active
        ═══════════════════════════════════════════════════════ */}

        {/* ── PORTFOLIO: Electric Border Cards in Main View ── */}
        <div className={`fixed inset-0 z-20 pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'portfolio' && isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-6xl max-h-[80vh] overflow-y-auto pointer-events-auto scrollbar-thin scrollbar-thumb-white/10">
              <div className="text-[10px] text-blue-400 tracking-[0.3em] mb-2 font-bold">02 // SELECTED WORKS</div>
              <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight drop-shadow-lg">
                Project <span className="italic font-light text-slate-400">Archive</span>.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsData.map((project) => (
                  <ElectricBorder
                    key={project.id}
                    color={getProjectColor(project.colorClass)}
                    speed={hoveredProject === project.id ? 3 : 0.5}
                    chaos={hoveredProject === project.id ? 0.18 : 0.06}
                    borderRadius={20}
                    className="transition-all duration-300"
                  >
                    <div 
                      className="p-6 bg-slate-950/70 backdrop-blur-md rounded-[20px] cursor-pointer group min-h-[180px] flex flex-col justify-between"
                      onClick={() => setSelectedProject(project)}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`text-xl font-semibold text-white transition-colors duration-300 ${hoveredProject === project.id ? project.colorClass : ''}`}>
                            {project.title}
                          </h3>
                          <span className={`text-[10px] px-2 py-1 rounded-full border shrink-0 ml-3 transition-colors duration-300 ${
                            hoveredProject === project.id 
                              ? 'border-white/30 text-white' 
                              : 'border-white/10 text-slate-500'
                          }`}>{project.year}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">{project.shortTech}</p>
                        <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">{project.shortDesc}</p>
                      </div>
                      <div className={`mt-4 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all duration-300 ${
                        hoveredProject === project.id ? 'text-cyan-400 translate-x-2' : 'text-slate-600'
                      }`}>
                        <span className={`h-px transition-all duration-300 ${hoveredProject === project.id ? 'w-8 bg-cyan-400' : 'w-4 bg-slate-600'}`} />
                        View Details
                      </div>
                    </div>
                  </ElectricBorder>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ABOUT: Main overlay ── */}
        <div className={`fixed inset-0 z-20 pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'about' && isPanelOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-3xl pointer-events-auto">
              <ElectricBorder color="#06b6d4" speed={0.5} chaos={0.06} borderRadius={24}>
                <div className="p-8 md:p-12 bg-slate-950/80 backdrop-blur-xl rounded-3xl">
                  <div className="text-[10px] text-cyan-400 tracking-[0.3em] mb-4 font-bold">01 // ABOUT ME</div>
                  <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">The <span className="italic font-light text-slate-400">Architect</span>.</h2>
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
            </div>
          </div>
        </div>

        {/* ── SKILLS: Main overlay ── */}
        <div className={`fixed inset-0 z-20 pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'services' && isPanelOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto pointer-events-auto">
              <ElectricBorder color="#8b5cf6" speed={0.5} chaos={0.06} borderRadius={24}>
                <div className="p-8 md:p-12 bg-slate-950/80 backdrop-blur-xl rounded-3xl">
                  <div className="text-[10px] text-indigo-400 tracking-[0.3em] mb-4 font-bold">03 // CAPABILITIES</div>
                  <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Technical <span className="italic font-light text-slate-400">Stack</span>.</h2>
                  <div className="space-y-8">
                    {[
                      { title: 'Frontend & UI', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
                      { title: '3D & WebGL', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
                      { title: 'Backend & Database', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
                      { title: 'DevOps & Cloud', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
                      { title: 'AI & Integrations', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
                    ].map(category => (
                      <div key={category.title}>
                        <h3 className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.2em]">{category.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {category.techs.map(tech => (
                            <span key={tech} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs transition-colors cursor-default rounded-lg">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>
        </div>

        {/* ── CONTACT: Main overlay ── */}
        <div className={`fixed inset-0 z-20 pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'contact' && isPanelOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-2xl pointer-events-auto">
              <ElectricBorder color="#f59e0b" speed={0.5} chaos={0.06} borderRadius={24}>
                <div className="p-8 md:p-12 bg-slate-950/80 backdrop-blur-xl rounded-3xl">
                  <div className="text-[10px] text-amber-400 tracking-[0.3em] mb-4 font-bold">04 // GET IN TOUCH</div>
                  <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Let&apos;s <span className="italic font-light text-slate-400">Connect</span>.</h2>
                  <p className="text-slate-300 font-light text-sm leading-relaxed mb-10">
                    Interested in working together? Whether it&apos;s a complex enterprise dashboard, an immersive 3D experience, or AI-powered automation — I&apos;m ready to build it.
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout' },
                      { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900' },
                      { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com' },
                    ].map(c => (
                      <a key={c.label} href={c.href} target="_blank" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
                        <div>
                          <div className="text-sm font-medium text-white">{c.label}</div>
                          <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">{c.sub}</div>
                        </div>
                        <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</div>
                      </a>
                    ))}
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>
        </div>

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

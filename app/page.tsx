"use client"

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ProjectModal from './components/ProjectModal'
import ElectricBorder from './components/ElectricBorder'
import ClickSpark from './components/ClickSpark'
import { projectsData } from './data/projects'

const Scene = dynamic(() => import('./components/Scene'), { ssr: false })
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
      setDisplay(
        text.split('').map((c, i) =>
          i < revealed ? c : c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      )
      if (revealed >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])

  return display
}

/* ── typing effect hook ─────────────────────────────────── */
function useTypingEffect(text: string, trigger: boolean, speed = 60) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!trigger) { setDisplay(''); return }
    let i = 0
    setDisplay('')
    const id = setInterval(() => {
      i++
      setDisplay(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])

  return display
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
        
        {/* Blob Cursor — hidden on mobile */}
        <div className="hidden md:block">
          {mounted && <BlobCursor 
            fillColor="#06b6d4" 
            trailCount={3} 
            sizes={[40, 90, 55]} 
            innerSizes={[12, 25, 18]} 
            innerColor="rgba(255,255,255,0.6)"
            opacities={[0.3, 0.2, 0.15]}
            shadowBlur={0}
            shadowOffsetX={0}
            shadowOffsetY={0}
            zIndex={50}
          />}
        </div>

        <Scene activeMenu={activeMenu} isPanelOpen={isPanelOpen} />

        {/* Navigasi */}
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

        {/* Hero Text */}
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

        {/* Side Panel */}
        <div 
          className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-slate-950/80 backdrop-blur-xl border-l border-white/5 pt-28 p-8 md:p-12 flex flex-col z-20 pointer-events-auto transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button 
            onClick={() => handleMenuClick('home')}
            className="absolute top-10 right-8 text-[10px] tracking-[0.2em] text-slate-400 hover:text-white transition-all uppercase group flex items-center gap-2 cursor-pointer"
          >
            <span className="w-6 h-px bg-slate-400 group-hover:bg-white group-hover:w-8 transition-all" /> CLOSE
          </button>

          <div className="mt-16 space-y-6 flex-1">
            
            {/* ==================== ABOUT ==================== */}
            {activeMenu === 'about' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
                <div className="text-[10px] text-cyan-400 tracking-[0.3em] mb-4 font-bold">01 // ABOUT ME</div>
                <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">The <span className="italic font-light text-slate-400">Architect</span>.</h2>
                <div className="space-y-5 text-slate-300 font-light text-sm leading-relaxed">
                  <p>
                    I&apos;m <b className="text-white font-medium">Bayu Darmawan</b>, a Full-Stack Developer and Creative Technologist based in <b className="text-white font-medium">Bandung, Indonesia</b>. I specialize in building end-to-end web applications — from database architecture to immersive 3D front-end experiences.
                  </p>
                  <p>
                    Currently serving as the <b className="text-white font-medium">Technology Lead for Crown Allstar</b> (15x Indonesian National Cheerleading Champion, ICU World Cup representative), where I manage all digital platforms, data systems, and AI-powered tools.
                  </p>
                  <p>
                    I also work at <b className="text-white font-medium">Dupoin</b>, a financial services company, where I build internal enterprise dashboards integrating Lark HR, PostgreSQL, and Xero accounting APIs.
                  </p>
                  <p>
                    My philosophy: <span className="italic text-cyan-300">&quot;Code is poetry, optimization is art, and every interface should feel alive.&quot;</span>
                  </p>
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
            )}

            {/* ==================== WORK / PORTFOLIO ==================== */}
            {activeMenu === 'portfolio' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
                <div className="text-[10px] text-blue-400 tracking-[0.3em] mb-4 font-bold">02 // SELECTED WORKS</div>
                <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Project <span className="italic font-light text-slate-400">Archive</span>.</h2>
                
                <div className="space-y-6">
                  {projectsData.map((project) => (
                    <ElectricBorder
                      key={project.id}
                      color={project.colorClass.replace('text-', '').includes('blue') ? '#3b82f6' : 
                             project.colorClass.includes('emerald') ? '#10b981' :
                             project.colorClass.includes('pink') ? '#ec4899' :
                             project.colorClass.includes('amber') ? '#f59e0b' :
                             project.colorClass.includes('violet') ? '#8b5cf6' :
                             project.colorClass.includes('cyan') ? '#06b6d4' :
                             project.colorClass.includes('rose') ? '#f43f5e' : '#06b6d4'}
                      speed={hoveredProject === project.id ? 3 : 0.5}
                      chaos={hoveredProject === project.id ? 0.15 : 0.06}
                      borderRadius={16}
                      className="cursor-pointer transition-all duration-300"
                    >
                      <div 
                        className="p-5 bg-slate-900/60 backdrop-blur-sm rounded-2xl"
                        onClick={() => setSelectedProject(project)}
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className={`text-lg font-medium text-white transition-colors ${project.textHover}`}>
                            {project.title}
                          </h3>
                          <span className="text-[10px] text-slate-500 mt-1 shrink-0 ml-4">{project.year}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-3">{project.shortTech}</p>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">{project.shortDesc}</p>
                        <div className={`mt-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${hoveredProject === project.id ? 'text-cyan-400 translate-x-2' : 'text-slate-600'}`}>
                          View Details →
                        </div>
                      </div>
                    </ElectricBorder>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== SKILLS ==================== */}
            {activeMenu === 'services' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
                <div className="text-[10px] text-indigo-400 tracking-[0.3em] mb-4 font-bold">03 // CAPABILITIES</div>
                <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Technical <span className="italic font-light text-slate-400">Stack</span>.</h2>
                <p className="text-slate-300 font-light text-sm leading-relaxed mb-10">
                  Battle-tested frameworks and tools for building everything from enterprise dashboards to immersive 3D web experiences.
                </p>
                
                <div className="space-y-8">
                  {[
                    { title: 'Frontend & UI', color: '#06b6d4', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
                    { title: '3D & WebGL', color: '#8b5cf6', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
                    { title: 'Backend & Database', color: '#10b981', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
                    { title: 'DevOps & Cloud', color: '#f59e0b', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
                    { title: 'AI & Integrations', color: '#ec4899', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
                  ].map(category => (
                    <div key={category.title}>
                      <h3 className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.2em]">{category.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.techs.map(tech => (
                          <ElectricBorder 
                            key={tech} 
                            color={category.color} 
                            speed={0.3} 
                            chaos={0.04} 
                            borderRadius={8}
                          >
                            <span className="block px-4 py-2 bg-slate-900/80 text-slate-300 text-xs cursor-default rounded-lg">
                              {tech}
                            </span>
                          </ElectricBorder>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== CONTACT ==================== */}
            {activeMenu === 'contact' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
                <div className="text-[10px] text-amber-400 tracking-[0.3em] mb-4 font-bold">04 // GET IN TOUCH</div>
                <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Let&apos;s <span className="italic font-light text-slate-400">Connect</span>.</h2>
                <p className="text-slate-300 font-light text-sm leading-relaxed mb-10">
                  Interested in working together? Whether it&apos;s a complex enterprise dashboard, an immersive 3D experience, or AI-powered automation — I&apos;m ready to build it.
                </p>
                
                <div className="space-y-4">
                  {[
                    { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout', color: '#8b5cf6' },
                    { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900', color: '#10b981' },
                    { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com', color: '#06b6d4' },
                  ].map(contact => (
                    <ElectricBorder key={contact.label} color={contact.color} speed={0.5} chaos={0.06} borderRadius={12}>
                      <a href={contact.href} target="_blank" className="flex items-center justify-between p-5 bg-slate-900/60 rounded-xl transition-colors group">
                        <div>
                          <div className="text-sm font-medium text-white">{contact.label}</div>
                          <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">{contact.sub}</div>
                        </div>
                        <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</div>
                      </a>
                    </ElectricBorder>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      </main>
    </ClickSpark>
  )
}

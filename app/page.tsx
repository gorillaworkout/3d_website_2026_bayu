"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Home, User, Wrench, Briefcase, Mail, ArrowUpRight, ChevronDown } from 'lucide-react'

/* ── Existing components ──────────────────────────── */
import ProjectModal from './components/ProjectModal'
import ClickSpark from './components/ClickSpark'
import SmoothScroller from './components/SmoothScroller'
import ElectricBorder from './components/ElectricBorder'

/* ── ReactBits components (existing) ──────────────── */
import GradientText from './components/reactbits/GradientText'
import SpotlightCard from './components/reactbits/SpotlightCard'
import Magnet from './components/reactbits/Magnet'

/* ── ReactBits components (new) ───────────────────── */
import SplitText from './components/reactbits/SplitText'
import DecryptedText from './components/reactbits/DecryptedText'
import ShinyText from './components/reactbits/ShinyText'
import CountUp from './components/reactbits/CountUp'
import ScrollFloat from './components/reactbits/ScrollFloat'
import Aurora from './components/reactbits/Aurora'
import Particles from './components/reactbits/Particles'
import TiltedCard from './components/reactbits/TiltedCard'
import Dock from './components/reactbits/Dock'

/* ── Data ─────────────────────────────────────────── */
import { projectsData } from './data/projects'

/* ── Lazy loaded heavy components (no SSR) ────────── */
const BlobCursor = dynamic(() => import('./components/BlobCursor'), { ssr: false })
const HeroScene = dynamic(() => import('./components/HeroScene'), { ssr: false })

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
]

const stats = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: 'x', label: 'National Champion' },
]

/* ── Color map ────────────────────────────────────── */
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
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => { setMounted(true) }, [])

  const scrollTo = useCallback((id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const dockItems = [
    { icon: <Home size={20} />, label: 'Home', onClick: () => scrollTo('hero') },
    { icon: <User size={20} />, label: 'About', onClick: () => scrollTo('about') },
    { icon: <Wrench size={20} />, label: 'Skills', onClick: () => scrollTo('skills') },
    { icon: <Briefcase size={20} />, label: 'Work', onClick: () => scrollTo('projects') },
    { icon: <Mail size={20} />, label: 'Contact', onClick: () => scrollTo('contact') },
  ]

  return (
    <ClickSpark sparkColor="#06b6d4" sparkSize={12} sparkRadius={25} sparkCount={10} duration={500} extraScale={1.5}>
      <SmoothScroller>
        <main className="relative w-full min-h-screen bg-[#0a0a1a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">

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

          {/* ═══════════════════════════════════════════
              SECTION 1: HERO
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['hero'] = el }}
            id="hero"
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            {/* Aurora Background */}
            <Aurora />

            {/* 3D Scene Background */}
            {mounted && <HeroScene />}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-[#0a0a1a]/40 z-[1]" />

            {/* Hero Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <div className="mb-6">
                <ShinyText className="text-cyan-400 font-bold tracking-[0.3em] text-xs md:text-sm uppercase" speed={4}>
                  Full-Stack Developer &amp; Creative Technologist
                </ShinyText>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6">
                {mounted && (
                  <DecryptedText
                    text="BAYU DARMAWAN"
                    speed={40}
                    className="text-white font-mono"
                    trigger="mount"
                  />
                )}
              </h1>

              <div className="mb-8">
                <GradientText
                  colors={['#06b6d4', '#8b5cf6', '#ec4899', '#06b6d4']}
                  animationSpeed={6}
                  className="text-lg md:text-2xl font-light tracking-wide"
                >
                  Crafting digital experiences that last.
                </GradientText>
              </div>

              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed mb-10">
                Building high-performance web applications, immersive 3D interfaces, and AI-powered tools.
                From enterprise dashboards to WebGL portfolios.
              </p>

              <button
                onClick={() => scrollTo('about')}
                className="px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[10px] font-bold cursor-pointer"
              >
                Explore My World
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 scroll-indicator z-10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase">Scroll</span>
                <ChevronDown size={16} className="text-slate-500 animate-bounce" />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 2: ABOUT
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['about'] = el }}
            id="about"
            className="relative w-full min-h-screen flex items-center py-24 md:py-32"
          >
            <div className="gradient-line w-full absolute top-0" />
            <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left — Text */}
                <div>
                  <ScrollFloat>
                    <span className="text-[10px] text-cyan-400 tracking-[0.3em] font-bold uppercase">01 // About Me</span>
                  </ScrollFloat>

                  <SplitText
                    text="The Architect."
                    className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-8"
                    as="h2"
                    staggerAmount={0.08}
                  />

                  <ScrollFloat distance={30}>
                    <div className="space-y-4 text-slate-300 font-light text-sm md:text-base leading-relaxed">
                      <p>
                        I&apos;m <b className="text-white font-medium">Bayu Darmawan</b>, a Full-Stack Developer
                        based in <b className="text-white font-medium">Bandung, Indonesia</b>.
                      </p>
                      <p>
                        <b className="text-white font-medium">Tech Lead @ Crown Allstar</b> — a
                        15x National Cheerleading Champion team. I bridge the gap between
                        creative design and robust engineering.
                      </p>
                      <p className="italic text-cyan-300/80">
                        &quot;Code is poetry, optimization is art.&quot;
                      </p>
                    </div>
                  </ScrollFloat>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mt-10">
                    {stats.map((stat, i) => (
                      <ScrollFloat key={stat.label} distance={40}>
                        <div className="text-center" style={{ animationDelay: `${i * 150}ms` }}>
                          <div className="text-3xl md:text-4xl font-black text-white">
                            <CountUp to={stat.value} duration={2.5} suffix={stat.suffix} />
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                            {stat.label}
                          </div>
                        </div>
                      </ScrollFloat>
                    ))}
                  </div>

                  {/* Quick facts */}
                  <ScrollFloat distance={30}>
                    <div className="mt-10 space-y-3">
                      {[
                        { label: 'Location', value: 'Bandung, ID' },
                        { label: 'Specialty', value: 'Full-Stack & WebGL' },
                        { label: 'Also At', value: 'Dupoin (Fintech)' },
                      ].map((fact) => (
                        <div
                          key={fact.label}
                          className="flex items-center justify-between py-2 border-b border-white/5"
                        >
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">{fact.label}</span>
                          <span className="text-xs text-white font-medium">{fact.value}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollFloat>
                </div>

                {/* Right — Visual element */}
                <div className="flex items-center justify-center">
                  <ScrollFloat distance={60}>
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                      {/* Decorative circles */}
                      <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: '20s' }} />
                      <div className="absolute inset-4 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                      <div className="absolute inset-8 rounded-full border border-pink-400/20 animate-spin" style={{ animationDuration: '25s' }} />
                      {/* Center glow */}
                      <div className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
                      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <span className="text-4xl md:text-5xl font-black text-white/80 font-mono">BD</span>
                      </div>
                    </div>
                  </ScrollFloat>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 3: SKILLS
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['skills'] = el }}
            id="skills"
            className="relative w-full min-h-screen flex items-center py-24 md:py-32"
          >
            <div className="gradient-line w-full absolute top-0" />

            {/* Particles background */}
            <Particles count={60} color="#8b5cf6" speed={0.2} connectDistance={100} />

            <div className="max-w-6xl mx-auto px-6 md:px-12 w-full relative z-10">
              <ScrollFloat>
                <span className="text-[10px] text-purple-400 tracking-[0.3em] font-bold uppercase">02 // Skills</span>
              </ScrollFloat>

              <SplitText
                text="Technologies I Work With."
                className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-12"
                as="h2"
                staggerAmount={0.06}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {skillCategories.map((cat, index) => (
                  <ScrollFloat key={cat.title} distance={40}>
                    <SpotlightCard
                      className="h-full bg-slate-900/60 border-white/5 p-6"
                      spotlightColor={`rgba(${parseInt(cat.color.slice(1, 3), 16)}, ${parseInt(cat.color.slice(3, 5), 16)}, ${parseInt(cat.color.slice(5, 7), 16)}, 0.15)`}
                    >
                      <GradientText
                        colors={[cat.color, '#ffffff', cat.color]}
                        animationSpeed={4}
                        className="text-sm font-bold uppercase tracking-[0.15em] mb-4"
                      >
                        {cat.title}
                      </GradientText>
                      <div className="flex flex-wrap gap-2">
                        {cat.techs.map(tech => (
                          <span
                            key={tech}
                            className="tech-tag px-3 py-1.5 bg-white/5 border border-white/5 text-slate-300 text-[11px] rounded-lg cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </ScrollFloat>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 4: PROJECTS
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['projects'] = el }}
            id="projects"
            className="relative w-full py-24 md:py-32"
          >
            <div className="gradient-line w-full absolute top-0" />

            <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
              <ScrollFloat>
                <span className="text-[10px] text-emerald-400 tracking-[0.3em] font-bold uppercase">03 // Work</span>
              </ScrollFloat>

              <SplitText
                text="Selected Projects."
                className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-4 mb-12"
                as="h2"
                staggerAmount={0.06}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsData.map((project, index) => {
                  const accentColor = colorMap[project.colorClass] || '#22d3ee'
                  return (
                    <ScrollFloat key={project.id} distance={50}>
                      <TiltedCard maxTilt={8} scale={1.02} className="h-full">
                        <div
                          onClick={() => setSelectedProject(project)}
                          className="h-full bg-slate-900/60 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-white/20 group"
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accentColor}15, inset 0 1px 0 ${accentColor}20`
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                          }}
                        >
                          {/* Header image placeholder */}
                          <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 mb-4 flex items-center justify-center overflow-hidden relative">
                            <span className="text-white/5 font-black text-5xl tracking-tighter uppercase">
                              {project.title.substring(0, 4)}
                            </span>
                            <div
                              className="absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                            />
                          </div>

                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold text-white leading-tight pr-3 group-hover:text-cyan-300 transition-colors">
                              {project.title}
                            </h3>
                            <span
                              className="text-[9px] px-2 py-0.5 rounded-full border shrink-0 text-slate-400"
                              style={{ borderColor: `${accentColor}44` }}
                            >
                              {project.year}
                            </span>
                          </div>

                          <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">{project.shortTech}</p>
                          <p className="text-xs text-slate-400/80 font-light leading-relaxed line-clamp-2 mb-3">
                            {project.shortDesc}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                            <span>View Details</span>
                            <ArrowUpRight size={12} />
                          </div>
                        </div>
                      </TiltedCard>
                    </ScrollFloat>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 5: CONTACT
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['contact'] = el }}
            id="contact"
            className="relative w-full min-h-screen flex items-center py-24 md:py-32"
          >
            <div className="gradient-line w-full absolute top-0" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 w-full text-center">
              <ScrollFloat>
                <span className="text-[10px] text-amber-400 tracking-[0.3em] font-bold uppercase">04 // Contact</span>
              </ScrollFloat>

              <SplitText
                text="Let's Connect."
                className="text-4xl md:text-6xl font-bold text-white tracking-tight mt-4 mb-6"
                as="h2"
                staggerAmount={0.1}
              />

              <ScrollFloat distance={30}>
                <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed mb-12">
                  Have a project in mind or just want to say hello? I&apos;m always open to discussing
                  new ideas and opportunities.
                </p>
              </ScrollFloat>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {contactLinks.map((contact, index) => (
                  <ScrollFloat key={contact.label} distance={40}>
                    <Magnet padding={50} magnetStrength={3}>
                      <a
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card block p-6 rounded-2xl bg-slate-900/60 border border-white/10 group transition-all duration-300 hover:border-white/20"
                        style={{ '--card-color': contact.color } as React.CSSProperties}
                      >
                        <div className="text-base font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          {contact.label}
                        </div>
                        <div className="text-[11px] text-slate-400 tracking-wider">
                          {contact.sub}
                        </div>
                        <div className="mt-3 text-slate-500 group-hover:text-white transition-colors">
                          <ArrowUpRight size={16} className="mx-auto" />
                        </div>
                      </a>
                    </Magnet>
                  </ScrollFloat>
                ))}
              </div>

              {/* Footer */}
              <ScrollFloat distance={20}>
                <div className="mt-24 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">
                    © 2026 Bayu Darmawan. Built with Next.js, Three.js &amp; ❤️
                  </p>
                </div>
              </ScrollFloat>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              FIXED ELEMENTS
             ═══════════════════════════════════════════ */}

          {/* Dock Navigation */}
          <Dock items={dockItems} />

          {/* Project Detail Modal */}
          {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

          {/* Bottom spacer for dock */}
          <div className="h-20" />
        </main>
      </SmoothScroller>
    </ClickSpark>
  )
}

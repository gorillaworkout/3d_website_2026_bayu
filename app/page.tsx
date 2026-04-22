"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'

/* ── Existing components ──────────────────────────── */
import ProjectModal from './components/ProjectModal'
import ClickSpark from './components/ClickSpark'
import SmoothScroller from './components/SmoothScroller'
import Terminal from './components/Terminal'

/* ── ReactBits components ─────────────────────────── */
import GradientText from './components/reactbits/GradientText'
import Magnet from './components/reactbits/Magnet'
import SplitText from './components/reactbits/SplitText'
import DecryptedText from './components/reactbits/DecryptedText'
import ShinyText from './components/reactbits/ShinyText'
import CountUp from './components/reactbits/CountUp'
import ScrollFloat from './components/reactbits/ScrollFloat'
import GooeyNav from './components/reactbits/GooeyNav'
import ScrollReveal from './components/reactbits/ScrollReveal'
import { ScrollStack, ScrollStackItem } from './components/reactbits/ScrollStack'
import { BentoCard, BentoGrid } from './components/reactbits/MagicBento'
import FlowingMenu from './components/reactbits/FlowingMenu'

/* ── Data ─────────────────────────────────────────── */
import { projectsData } from './data/projects'

/* ── Lazy loaded heavy components (no SSR) ────────── */
const BlobCursor = dynamic(() => import('./components/BlobCursor'), { ssr: false })
const Antigravity = dynamic(() => import('./components/reactbits/Antigravity'), { ssr: false })

/* ── Data ─────────────────────────────────────────── */
const skillCategories = [
  { title: 'Frontend & UI', color: '#60a5fa', techs: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis Scroll'] },
  { title: '3D & WebGL', color: '#c084fc', techs: ['Three.js', 'React Three Fiber', 'Drei', 'HDRI / Environment Maps', 'Lottie Animation'] },
  { title: 'Backend & Database', color: '#34d399', techs: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'Firebase / Firestore'] },
  { title: 'DevOps & Cloud', color: '#fb923c', techs: ['Docker', 'PM2', 'Nginx', 'Oracle Cloud VPS', 'Vercel', 'Cloudflare R2'] },
  { title: 'AI & Integrations', color: '#f472b6', techs: ['DeepSeek AI', 'OpenAI API', 'Lark Base API', 'Xero API', 'Linear API', 'Puppeteer'] }
]

const contactLinks = [
  { label: 'GitHub', sub: '@gorillaworkout', href: 'https://github.com/gorillaworkout', color: '#a78bfa', text: 'GitHub — @gorillaworkout', image: '' },
  { label: 'WhatsApp', sub: '+62 851-3352-4900', href: 'https://wa.me/6285133524900', color: '#22c55e', text: 'WhatsApp — Chat Now', image: '' },
  { label: 'Email', sub: 'darmawanbayu1@gmail.com', href: 'mailto:darmawanbayu1@gmail.com', color: '#f59e0b', text: 'Email — darmawanbayu1@gmail.com', image: '' },
  { label: 'LinkedIn', sub: 'Bayu Darmawan', href: 'https://linkedin.com/in/bayudarmawan', color: '#0ea5e9', text: 'LinkedIn — Connect', image: '' },
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

  const navItems = [
    { label: 'Home', href: '#hero', onClick: () => scrollTo('hero') },
    { label: 'About', href: '#about', onClick: () => scrollTo('about') },
    { label: 'Skills', href: '#skills', onClick: () => scrollTo('skills') },
    { label: 'Work', href: '#projects', onClick: () => scrollTo('projects') },
    { label: 'Contact', href: '#contact', onClick: () => scrollTo('contact') },
  ]

  const flowingMenuItems = contactLinks.map(c => ({
    link: c.href,
    text: c.text,
    image: c.image,
  }))

  return (
    <ClickSpark sparkColor="#06b6d4" sparkSize={12} sparkRadius={25} sparkCount={10} duration={500} extraScale={1.5}>
      <SmoothScroller>
        <main className="relative w-full min-h-screen bg-[#050510] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">

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
              FIXED NAV: GooeyNav at top
             ═══════════════════════════════════════════ */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <GooeyNav
              items={navItems}
              animationTime={600}
              particleCount={12}
              colors={["#06b6d4", "#8b5cf6"]}
              initialActiveIndex={0}
            />
          </div>

          {/* ═══════════════════════════════════════════
              SECTION 1: HERO — Antigravity Background
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['hero'] = el }}
            id="hero"
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            {/* Antigravity Background */}
            {mounted && (
              <Antigravity
                color="#06b6d4"
                count={200}
                particleSize={1.5}
                autoAnimate={true}
                magnetRadius={10}
                ringRadius={4}
                waveSpeed={1.5}
                lerpSpeed={0.04}
                depthFactor={2}
                rotationSpeed={0.4}
              />
            )}

            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-[#050510]/40 z-[1]" />

            {/* Hero Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
              {/* Giant Name */}
              <h1 className="mb-2">
                <span className="block text-[clamp(3.5rem,12vw,10rem)] font-black tracking-tighter leading-[0.9]">
                  {mounted && (
                    <DecryptedText
                      text="BAYU"
                      speed={35}
                      className="text-white font-mono"
                      trigger="mount"
                    />
                  )}
                </span>
                <span className="block text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-[0.9] mt-2">
                  {mounted && (
                    <DecryptedText
                      text="DARMAWAN"
                      speed={35}
                      className="text-white font-mono"
                      trigger="mount"
                    />
                  )}
                </span>
              </h1>

              {/* Animated gradient line */}
              <div className="animated-line w-48 md:w-72 mx-auto my-6" />

              {/* Subtitle */}
              <div className="mb-6">
                <ShinyText className="text-cyan-400 font-bold tracking-[0.3em] text-xs md:text-sm uppercase" speed={4}>
                  Full-Stack Developer · Creative Technologist
                </ShinyText>
              </div>

              {/* Tagline */}
              <div className="mb-10">
                <GradientText
                  colors={['#06b6d4', '#8b5cf6', '#ec4899', '#06b6d4']}
                  animationSpeed={6}
                  className="text-lg md:text-2xl font-light tracking-wide"
                >
                  Crafting digital experiences
                </GradientText>
              </div>
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
              SECTION 2: ABOUT — ScrollReveal Bio
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

                  {/* ScrollReveal bio */}
                  <ScrollReveal
                    enableBlur={true}
                    baseOpacity={0.1}
                    baseRotation={3}
                    blurStrength={4}
                    textClassName="text-slate-300 font-light"
                  >
                    I&apos;m Bayu Darmawan, a Full-Stack Developer based in Bandung, Indonesia. Tech Lead at Crown Allstar — a 15x National Cheerleading Champion team. I bridge the gap between creative design and robust engineering. Code is poetry, optimization is art.
                  </ScrollReveal>

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

                {/* Right — Terminal Mockup */}
                <div className="flex items-center justify-center">
                  <ScrollFloat distance={60}>
                    <Terminal className="w-full max-w-md" />
                  </ScrollFloat>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 3: SKILLS — MagicBento Grid
             ═══════════════════════════════════════════ */}
          <section
            ref={el => { sectionRefs.current['skills'] = el }}
            id="skills"
            className="relative w-full min-h-screen flex items-center py-24 md:py-32 grid-pattern"
          >
            <div className="gradient-line w-full absolute top-0" />

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

              <BentoGrid
                glowColor="rgba(6, 182, 212, 0.12)"
                spotlightRadius={400}
                enableSpotlight={true}
              >
                {skillCategories.map((cat) => (
                  <ScrollFloat key={cat.title} distance={40}>
                    <BentoCard
                      className="h-full p-6"
                      glowColor={`rgba(${parseInt(cat.color.slice(1, 3), 16)}, ${parseInt(cat.color.slice(3, 5), 16)}, ${parseInt(cat.color.slice(5, 7), 16)}, 0.3)`}
                      enableTilt={true}
                      clickEffect={true}
                      particleCount={6}
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
                            className="tech-tag px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-slate-300 text-[11px] cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </BentoCard>
                  </ScrollFloat>
                ))}
              </BentoGrid>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 4: PROJECTS — ScrollStack Cards
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

              <ScrollStack cardHeight={500} scaleStep={0.025} topOffset={100}>
                {projectsData.map((project, index) => {
                  const accentColor = colorMap[project.colorClass] || '#22d3ee'
                  const num = String(index + 1).padStart(2, '0')
                  return (
                    <ScrollStackItem key={project.id} className="mb-4">
                      <motion.div
                        onClick={() => setSelectedProject(project)}
                        className="group relative w-full rounded-2xl bg-[#0a0a1a] border border-white/[0.06] overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/[0.12]"
                        whileHover={{ y: -2 }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 60px ${accentColor}10, inset 0 1px 0 ${accentColor}15`
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] items-stretch">
                          {/* Left — Project info */}
                          <div className="p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                              <span
                                className="text-4xl md:text-5xl font-black font-mono opacity-15"
                                style={{ color: accentColor }}
                              >
                                {num}
                              </span>
                              <div>
                                <h3 className="text-lg md:text-xl font-semibold text-white leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                                  {project.title}
                                </h3>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{project.shortTech}</p>
                              </div>
                              <span
                                className="ml-auto text-[9px] px-3 py-1 rounded-full border shrink-0 text-slate-400 hidden sm:inline-block"
                                style={{ borderColor: `${accentColor}44` }}
                              >
                                {project.year}
                              </span>
                            </div>

                            <p className="text-sm text-slate-400/80 font-light leading-relaxed mb-4 max-w-xl">
                              {project.shortDesc}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
                              <span>View Details</span>
                              <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>

                          {/* Right — Gradient mesh preview */}
                          <div className="relative h-48 md:h-auto min-h-[160px] overflow-hidden">
                            <div
                              className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                              style={{
                                background: `
                                  radial-gradient(ellipse at 30% 50%, ${accentColor}40 0%, transparent 60%),
                                  radial-gradient(ellipse at 80% 30%, ${accentColor}20 0%, transparent 50%),
                                  radial-gradient(ellipse at 50% 80%, #8b5cf620 0%, transparent 50%)
                                `,
                              }}
                            />
                            <div className="absolute inset-0 bg-[#050510]/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white/[0.04] font-black text-6xl md:text-7xl tracking-tighter uppercase select-none">
                                {project.title.substring(0, 4)}
                              </span>
                            </div>
                            <div
                              className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </ScrollStackItem>
                  )
                })}
              </ScrollStack>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 5: CONTACT — FlowingMenu + Bold
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
                text="Let's Build Something."
                className="text-4xl md:text-7xl font-bold text-white tracking-tight mt-4 mb-6"
                as="h2"
                staggerAmount={0.1}
              />

              <ScrollFloat distance={30}>
                <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed mb-12">
                  Have a project in mind or just want to say hello? I&apos;m always open to discussing
                  new ideas and opportunities.
                </p>
              </ScrollFloat>

              {/* FlowingMenu contact links */}
              <ScrollFloat distance={40}>
                <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                  <FlowingMenu
                    items={flowingMenuItems}
                    speed={25}
                    textColor="#e2e8f0"
                    bgColor="transparent"
                    marqueeBgColor="#06b6d4"
                    marqueeTextColor="#ffffff"
                    borderColor="rgba(255, 255, 255, 0.06)"
                  />
                </div>
              </ScrollFloat>

              {/* Footer */}
              <ScrollFloat distance={20}>
                <div className="mt-24 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">
                    © 2026 · Built with obsession
                  </p>
                </div>
              </ScrollFloat>
            </div>
          </section>

          {/* Project Detail Modal */}
          {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

          {/* Bottom spacer */}
          <div className="h-20" />
        </main>
      </SmoothScroller>
    </ClickSpark>
  )
}

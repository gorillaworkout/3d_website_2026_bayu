"use client"

import { useState } from 'react'
import Scene from './components/Scene'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      <Scene activeMenu={activeMenu} />

      {/* Navigasi (Selalu di atas) */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 z-30 flex justify-between items-center pointer-events-auto mix-blend-difference text-white">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-[0.2em] text-slate-400">PORTFOLIO</span>
          <span className="text-xl md:text-2xl font-black tracking-widest uppercase mt-1">BAYU DARMAWAN</span>
        </div>
        <ul className="flex gap-4 md:gap-10 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
          <li>
            <button onClick={() => setActiveMenu('contact')} className={`hover:text-white transition-all duration-300 relative group ${activeMenu === 'contact' ? 'text-white' : 'text-slate-400'}`}>
              Beyond
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('services')} className={`hover:text-white transition-all duration-300 relative group ${activeMenu === 'services' ? 'text-white' : 'text-slate-400'}`}>
              Elevation
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === 'services' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('home')} className={`hover:text-white transition-all duration-300 relative group ${activeMenu === 'home' ? 'text-white' : 'text-slate-400'}`}>
              Origin
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('about')} className={`hover:text-white transition-all duration-300 relative group ${activeMenu === 'about' ? 'text-white' : 'text-slate-400'}`}>
              Fluidity
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('portfolio')} className={`hover:text-white transition-all duration-300 relative group ${activeMenu === 'portfolio' ? 'text-white' : 'text-slate-400'}`}>
              Structure
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-white transition-transform origin-left ${activeMenu === 'portfolio' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Text untuk Home/Origin */}
      <div className={`fixed bottom-12 left-6 md:left-12 z-10 max-w-3xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-cyan-400 font-bold tracking-[0.3em] mb-4 text-xs md:text-sm">CREATIVE ENGINEER</h2>
        <h1 className="text-5xl md:text-[5.5rem] font-medium mb-6 text-white leading-[1.1] tracking-tight">
          Crafting digital
          <br/>
          <span className="italic font-light text-slate-400">experiences</span> that last.
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-xl font-light leading-relaxed border-l border-cyan-400/50 pl-4">
          I build high-performance software and immersive WebGL interfaces. Seamlessly connecting robust backend architectures with stunning frontend aesthetics.
        </p>
      </div>

      {/* Laci Samping (Minimalis Elegan) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-950/80 backdrop-blur-xl border-l border-white/5 pt-28 p-8 md:p-12 flex flex-col z-20 pointer-events-auto transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${activeMenu !== 'home' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          onClick={() => setActiveMenu('home')}
          className="absolute top-10 right-8 text-[10px] tracking-[0.2em] text-slate-400 hover:text-white transition-all uppercase group flex items-center gap-2 cursor-pointer"
        >
          <span className="w-6 h-px bg-slate-400 group-hover:bg-white group-hover:w-8 transition-all" /> CLOSE
        </button>

        <div className="mt-16 space-y-6 flex-1 flex flex-col justify-center">
          
          {/* ABOUT SECTION */}
          {activeMenu === 'about' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
              <div className="text-[10px] text-cyan-400 tracking-[0.3em] mb-4 font-bold">01 // BENEATH THE SURFACE</div>
              <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">The <span className="italic font-light text-slate-400">Architect</span>.</h2>
              <div className="space-y-6 text-slate-300 font-light text-sm leading-relaxed">
                <p>
                  My name is Bayu Darmawan. Based in Indonesia, I specialize in bridging the gap between rigorous software engineering and fluid, interactive design.
                </p>
                <p>
                  As the technology lead for <b>Crown Allstar</b> and an active contributor to the Web3/WebGL ecosystem, I treat code as poetry and optimization as an art form. My goal is to build interfaces that not only work flawlessly but feel alive.
                </p>
              </div>
              <button className="mt-12 w-full py-4 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[10px] font-bold cursor-pointer">
                Download Resume
              </button>
            </div>
          )}

          {/* PORTFOLIO SECTION */}
          {activeMenu === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
              <div className="text-[10px] text-blue-400 tracking-[0.3em] mb-4 font-bold">02 // DEEP DIVES</div>
              <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Selected <span className="italic font-light text-slate-400">Works</span>.</h2>
              
              <div className="space-y-6">
                <div className="group cursor-pointer">
                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-blue-400/50 transition-colors" />
                  <h3 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors">ICA Cheerleading</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-3">Next.js • Supabase • Cloudflare R2</p>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">National database & registration platform handling thousands of athletes and secure data migrations.</p>
                </div>

                <div className="group cursor-pointer">
                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-emerald-400/50 transition-colors" />
                  <h3 className="text-xl font-medium text-white group-hover:text-emerald-400 transition-colors">Dupoin Enterprise</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-3">React • PostgreSQL • Lark API</p>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">Internal HR and Finance tool for tracking P&L and integrating multilateral trading data.</p>
                </div>

                <div className="group cursor-pointer">
                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-pink-400/50 transition-colors" />
                  <h3 className="text-xl font-medium text-white group-hover:text-pink-400 transition-colors">Crown AI Core</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-3">Node.js • DeepSeek AI • Puppeteer</p>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">AI-powered PDF proposal generator tailoring intelligent sponsorships per brand dynamically.</p>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES / SKILLS SECTION */}
          {activeMenu === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
              <div className="text-[10px] text-indigo-400 tracking-[0.3em] mb-4 font-bold">03 // THE ARSENAL</div>
              <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Technical <span className="italic font-light text-slate-400">Stack</span>.</h2>
              <p className="text-slate-300 font-light text-sm leading-relaxed mb-10">
                Equipped with modern, battle-tested frameworks to conquer both frontend aesthetics and backend complexities.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.2em]">Visual & Interface</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js', 'React', 'Three.js', 'WebGL', 'R3F', 'Tailwind', 'GSAP'].map(tech => (
                      <span key={tech} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs transition-colors cursor-default">{tech}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.2em]">Architecture & Cloud</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'PostgreSQL', 'Supabase', 'Firebase', 'Docker', 'PM2', 'Nginx'].map(tech => (
                      <span key={tech} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs transition-colors cursor-default">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT SECTION */}
          {activeMenu === 'contact' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-[800ms] delay-100">
              <div className="text-[10px] text-amber-400 tracking-[0.3em] mb-4 font-bold">04 // TRANSMISSION</div>
              <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">Initiate <span className="italic font-light text-slate-400">Contact</span>.</h2>
              <p className="text-slate-300 font-light text-sm leading-relaxed mb-10">
                Ready to build something out of this world? Establish a secure connection through the relay.
              </p>
              
              <div className="space-y-4">
                <a href="https://github.com/gorillaworkout" target="_blank" className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white">GitHub</div>
                    <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">@gorillaworkout</div>
                  </div>
                  <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</div>
                </a>

                <a href="https://wa.me/6285133524900" target="_blank" className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white">WhatsApp</div>
                    <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">+62 851-3352-4900</div>
                  </div>
                  <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

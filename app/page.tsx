"use client"

import { useState } from 'react'
import Scene from './components/Scene'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Background 3D Multi-Alam */}
      <Scene activeMenu={activeMenu} />

      {/* Navigasi (Selalu di atas) */}
      <nav className="fixed top-0 left-0 w-full p-6 z-30 flex justify-between items-center pointer-events-auto bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
        <div className="text-xl md:text-2xl font-black tracking-widest text-white flex flex-col">
          BAYU <span className="text-cyan-400 text-sm">DARMAWAN</span>
        </div>
        <ul className="flex gap-4 md:gap-8 text-[10px] md:text-sm uppercase tracking-widest font-bold">
          <li>
            <button onClick={() => setActiveMenu('home')} className={`hover:text-green-400 transition-all ${activeMenu === 'home' ? 'text-green-400 border-b-2 border-green-400' : 'text-slate-300'}`}>Start</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('about')} className={`hover:text-cyan-400 transition-all ${activeMenu === 'about' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-300'}`}>About</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('portfolio')} className={`hover:text-blue-500 transition-all ${activeMenu === 'portfolio' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-300'}`}>Work</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('services')} className={`hover:text-pink-400 transition-all ${activeMenu === 'services' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-slate-300'}`}>Skills</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('contact')} className={`hover:text-amber-400 transition-all ${activeMenu === 'contact' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300'}`}>Contact</button>
          </li>
        </ul>
      </nav>

      {/* Hero Text untuk Home/Surface */}
      <div className={`fixed bottom-12 left-6 md:left-12 z-10 max-w-3xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-green-400 font-bold tracking-[0.3em] mb-2 text-sm md:text-base">SYSTEM ONLINE</h2>
        <h1 className="text-5xl md:text-8xl font-black mb-4 text-white leading-tight">
          CREATIVE <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">DEVELOPER.</span>
        </h1>
        <p className="text-slate-200 font-sans text-base md:text-xl max-w-xl bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
          Bridging the gap between hardcore software engineering and immersive 3D WebGL experiences. Navigate the dimensions above to explore my universe.
        </p>
      </div>

      {/* Laci Samping */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-slate-950/80 backdrop-blur-2xl border-l border-white/10 pt-28 p-8 md:p-12 flex flex-col z-20 pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${activeMenu !== 'home' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          onClick={() => setActiveMenu('home')}
          className="absolute top-28 right-8 text-xs tracking-widest text-slate-400 hover:text-white transition-colors uppercase border border-slate-600/50 hover:border-slate-400 px-4 py-2 rounded-none cursor-pointer bg-black/20"
        >
          [ ESC ] CLOSE
        </button>

        <div className="mt-16 space-y-6">
          {/* ABOUT SECTION (OCEAN) */}
          {activeMenu === 'about' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-cyan-400 tracking-[0.3em] mb-2 font-bold">DEPTH: -30M // BENEATH THE SURFACE</div>
              <h2 className="text-4xl font-black text-white mb-6">WHO I AM.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-6">
                I am Bayu Darmawan, a Full-Stack Developer & Creative Technologist based in Indonesia. I don't just build websites; I engineer interactive digital dimensions.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                Currently managing technology and digital platforms for <b>Crown Allstar</b> and exploring the bleeding edge of Web3/WebGL ecosystems. My philosophy: "Code is poetry, optimization is art."
              </p>
              <button className="w-full py-4 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 transition-all uppercase tracking-widest text-xs font-bold cursor-pointer">
                Download Resume (PDF)
              </button>
            </div>
          )}

          {/* PORTFOLIO SECTION (ABYSS) */}
          {activeMenu === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-blue-500 tracking-[0.3em] mb-2 font-bold">DEPTH: -60M // DEEP DIVES</div>
              <h2 className="text-4xl font-black text-white mb-6">SELECTED WORKS.</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <h3 className="text-lg font-bold text-blue-400 group-hover:text-blue-300">ICA Cheerleading</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-2">Next.js • Supabase • Cloudflare R2</p>
                  <p className="text-sm text-slate-300">National cheerleading database & registration platform handling thousands of athletes and secure KTP/KK file migrations.</p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <h3 className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300">Dupoin HR Dashboard</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-2">React • PostgreSQL • Docker • Lark API</p>
                  <p className="text-sm text-slate-300">Enterprise internal tool for tracking P&L, integrating multilateral trading data with Lark Base HR.</p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <h3 className="text-lg font-bold text-pink-400 group-hover:text-pink-300">Crown Sponsorship AI</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-2">Node.js • DeepSeek AI • Puppeteer</p>
                  <p className="text-sm text-slate-300">AI-powered PDF proposal generator integrating custom LLM prompts to tailor sponsorships per brand.</p>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES / SKILLS SECTION (SKY) */}
          {activeMenu === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-pink-400 tracking-[0.3em] mb-2 font-bold">ALT: 30KM // THE ARSENAL</div>
              <h2 className="text-4xl font-black text-white mb-6">TECH STACK.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-6">
                Equipped with modern battle-tested frameworks to conquer both the frontend aesthetics and backend complexities.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Frontend & 3D</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">Next.js / React</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">Three.js / WebGL</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">React Three Fiber</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">GSAP / Lenis</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Backend & Cloud</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Node.js / Express</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">PostgreSQL</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Supabase / Firebase</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">Docker / PM2</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">VPS / Nginx</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT SECTION (SPACE) */}
          {activeMenu === 'contact' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-amber-400 tracking-[0.3em] mb-2 font-bold">ALT: 60KM // TRANSMISSION</div>
              <h2 className="text-4xl font-black text-white mb-6">INITIATE CONTACT.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                Ready to build something out of this world? Establish a secure connection through the hyperspace relay.
              </p>
              
              <div className="space-y-3">
                <a href="https://github.com/gorillaworkout" target="_blank" className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                    {/* Github Icon */}
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">GitHub</div>
                    <div className="text-xs text-slate-400">@gorillaworkout</div>
                  </div>
                </a>

                <a href="https://wa.me/6285133524900" target="_blank" className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                    {/* Phone/WA Icon */}
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">WhatsApp</div>
                    <div className="text-xs text-slate-400">+62 851-3352-4900</div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

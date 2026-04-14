"use client"

import { useState } from 'react'
import Scene from './components/Scene'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900 text-white font-sans">
      
      {/* Background 3D Multi-Alam */}
      <Scene activeMenu={activeMenu} />

      {/* Navigasi (Selalu di atas) */}
      <nav className="fixed top-0 left-0 w-full p-6 z-30 flex justify-between items-center pointer-events-auto bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
        <div className="text-2xl font-black tracking-widest text-white">
          THE <span className="text-amber-400">EXPANSE</span>
        </div>
        <ul className="flex gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest font-bold">
          <li>
            <button onClick={() => setActiveMenu('contact')} className={`hover:text-amber-400 transition-all ${activeMenu === 'contact' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-200'}`}>Space</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('services')} className={`hover:text-pink-400 transition-all ${activeMenu === 'services' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-slate-200'}`}>Sky</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('home')} className={`hover:text-green-400 transition-all ${activeMenu === 'home' ? 'text-green-400 border-b-2 border-green-400' : 'text-slate-200'}`}>Surface</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('about')} className={`hover:text-cyan-400 transition-all ${activeMenu === 'about' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-200'}`}>Ocean</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('portfolio')} className={`hover:text-blue-500 transition-all ${activeMenu === 'portfolio' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-200'}`}>Abyss</button>
          </li>
        </ul>
      </nav>

      {/* Hero Text untuk Home/Surface */}
      <div className={`fixed bottom-10 left-10 z-10 max-w-2xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-black mb-4 text-white">
          THE SURFACE.
        </h1>
        <p className="text-slate-100 font-sans text-lg md:text-xl max-w-lg bg-black/30 p-2 rounded-lg inline-block backdrop-blur-sm">
          Where life begins. Navigate through dimensions by clicking the elements above.
        </p>
      </div>

      {/* Laci Samping */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-950/80 backdrop-blur-2xl border-l border-white/10 pt-32 p-10 flex flex-col z-20 pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu !== 'home' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          onClick={() => setActiveMenu('home')}
          className="absolute top-28 right-8 text-xs tracking-widest text-slate-400 hover:text-white transition-colors uppercase border border-slate-600/50 hover:border-slate-400 px-4 py-2 rounded-none cursor-pointer"
        >
          [ ESC ] CLOSE
        </button>

        <div className="mt-12 space-y-6">
          {activeMenu === 'contact' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-amber-400 tracking-[0.3em] mb-2 font-bold">ALT: 60KM</div>
              <h2 className="text-4xl font-black text-white mb-6">DEEP SPACE.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                Zero gravity. Silence. Navigate the stars and orbit the unknown.
              </p>
            </div>
          )}

          {activeMenu === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-pink-400 tracking-[0.3em] mb-2 font-bold">ALT: 30KM</div>
              <h2 className="text-4xl font-black text-white mb-6">ABOVE CLOUDS.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                Soaring through the stratosphere. A perfect view of the horizon.
              </p>
            </div>
          )}

          {activeMenu === 'about' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-cyan-400 tracking-[0.3em] mb-2 font-bold">DEPTH: -30M</div>
              <h2 className="text-4xl font-black text-white mb-6">THE OCEAN.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                Diving into the blue waters. Surrounded by bubbles and mysterious currents.
              </p>
            </div>
          )}

          {activeMenu === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-blue-500 tracking-[0.3em] mb-2 font-bold">DEPTH: -60M</div>
              <h2 className="text-4xl font-black text-white mb-6">MARIANA TRENCH.</h2>
              <p className="text-slate-300 leading-relaxed text-sm mb-8">
                The deepest point. Pitch black. The only light comes from bioluminescent particles.
              </p>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

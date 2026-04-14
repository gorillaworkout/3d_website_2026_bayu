"use client"

import { useState } from 'react'
import Scene from './components/Scene'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900 text-white">
      
      {/* Background 3D */}
      <Scene activeMenu={activeMenu} />

      {/* Navigasi HTML Overlay (Atas Kiri) */}
      <nav className="fixed top-0 left-0 w-full p-8 z-10 flex justify-between items-center pointer-events-auto">
        <div className="text-2xl font-black tracking-tighter text-cyan-400 drop-shadow-md">3D CYBERPUNK</div>
        <ul className="flex gap-6 text-sm uppercase tracking-widest font-medium">
          <li>
            <button onClick={() => setActiveMenu('home')} className={`hover:text-cyan-400 transition-colors cursor-pointer ${activeMenu === 'home' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}>Home</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('about')} className={`hover:text-indigo-400 transition-colors cursor-pointer ${activeMenu === 'about' ? 'text-indigo-400 border-b border-indigo-400' : ''}`}>About</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('portfolio')} className={`hover:text-pink-400 transition-colors cursor-pointer ${activeMenu === 'portfolio' ? 'text-pink-400 border-b border-pink-400' : ''}`}>Portfolio</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('services')} className={`hover:text-amber-400 transition-colors cursor-pointer ${activeMenu === 'services' ? 'text-amber-400 border-b border-amber-400' : ''}`}>Services</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('contact')} className={`hover:text-emerald-400 transition-colors cursor-pointer ${activeMenu === 'contact' ? 'text-emerald-400 border-b border-emerald-400' : ''}`}>Contact</button>
          </li>
        </ul>
      </nav>

      {/* --- HERO TEXT (Kiri Bawah) - Hanya muncul di Home --- */}
      <div className={`fixed bottom-10 left-10 z-10 max-w-md pointer-events-none drop-shadow-lg transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">Discover the Future.</h1>
        <p className="text-slate-300">Click the menus above to explore the neon dimension.</p>
      </div>

      {/* --- PANEL KANAN (Popup ala KidSuper) --- */}
      {/* Panel ini akan meluncur masuk (translate-x-0) kalau menu bukan 'home', dan meluncur keluar (translate-x-full) kalau 'home' */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-slate-950/80 backdrop-blur-2xl border-l border-white/10 p-10 flex flex-col justify-center z-20 pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu !== 'home' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Tombol Close Panel */}
        <button 
          onClick={() => setActiveMenu('home')}
          className="absolute top-8 right-8 text-xs tracking-widest text-slate-400 hover:text-white transition-colors uppercase border border-slate-600 px-4 py-2 rounded-full cursor-pointer"
        >
          ✕ Close
        </button>

        {/* Konten Panel (Berubah sesuai Menu) */}
        <div className="space-y-6">
          {activeMenu === 'about' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <h2 className="text-4xl font-bold text-indigo-400 mb-6">The Core.</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                We build neon dreams and procedural cities. This is where innovation meets design in the vast space of WebGL.
              </p>
              <button className="mt-8 w-full py-4 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/50 transition-colors uppercase tracking-widest text-xs cursor-pointer">
                Read Full Story
              </button>
            </div>
          )}

          {activeMenu === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <h2 className="text-4xl font-bold text-pink-400 mb-6">Our Work.</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                WebGL experiences powered by React Three Fiber. Check out our latest interactive 3D platforms.
              </p>
              <button className="mt-8 w-full py-4 bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white border border-pink-500/50 transition-colors uppercase tracking-widest text-xs cursor-pointer">
                View Archive
              </button>
            </div>
          )}

          {activeMenu === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <h2 className="text-4xl font-bold text-amber-400 mb-6">What We Do.</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                From Interactive 3D, WebGL Animation, to Next.js Architecture. We elevate normal websites into digital journeys.
              </p>
              <button className="mt-8 w-full py-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white border border-amber-500/50 transition-colors uppercase tracking-widest text-xs cursor-pointer">
                Our Pricing
              </button>
            </div>
          )}

          {activeMenu === 'contact' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <h2 className="text-4xl font-bold text-emerald-400 mb-6">Connect.</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Ready to build the future? Reach us through the hyperspace network.
              </p>
              <button className="mt-8 w-full py-4 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/50 transition-colors uppercase tracking-widest text-xs cursor-pointer">
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

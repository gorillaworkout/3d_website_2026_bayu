"use client"

import { useState } from 'react'
import { Orbitron } from 'next/font/google'
import Scene from './components/Scene'

// Load Font Cyberpunk Modern
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] })

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className={`relative w-full h-screen overflow-hidden bg-slate-950 text-white ${orbitron.className}`}>
      
      {/* Background 3D */}
      <Scene activeMenu={activeMenu} />

      {/* Navigasi HTML Overlay (Diubah jadi z-30 agar SELALU di atas Sidebar) */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 z-30 flex justify-between items-center pointer-events-auto bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="text-2xl md:text-3xl font-black tracking-widest text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          NEXUS // CORE
        </div>
        <ul className="flex gap-4 md:gap-8 text-xs md:text-sm uppercase tracking-widest font-bold">
          <li>
            <button onClick={() => setActiveMenu('home')} className={`hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all cursor-pointer ${activeMenu === 'home' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-300'}`}>Home</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('about')} className={`hover:text-indigo-400 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] transition-all cursor-pointer ${activeMenu === 'about' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-300'}`}>About</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('portfolio')} className={`hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] transition-all cursor-pointer ${activeMenu === 'portfolio' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-slate-300'}`}>Portfolio</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('services')} className={`hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all cursor-pointer ${activeMenu === 'services' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-300'}`}>Services</button>
          </li>
          <li>
            <button onClick={() => setActiveMenu('contact')} className={`hover:text-emerald-400 hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all cursor-pointer ${activeMenu === 'contact' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-300'}`}>Contact</button>
          </li>
        </ul>
      </nav>

      {/* --- HERO TEXT (Kiri Bawah) - Hanya muncul di Home --- */}
      <div className={`fixed bottom-10 left-10 z-10 max-w-2xl pointer-events-none drop-shadow-lg transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          ENTER THE GRID.
        </h1>
        <p className="text-slate-300 font-sans text-lg md:text-xl max-w-lg">
          Navigate the neon dimension. Click the terminal links above to override the mainframe and dive deeper into the sectors.
        </p>
      </div>

      {/* --- PANEL KANAN (z-20, di bawah z-30 Navigasi) --- */}
      {/* Tambahkan pt-32 agar konten tidak tertutup oleh Navigasi Atas */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-950/60 backdrop-blur-3xl border-l border-white/5 pt-32 p-10 flex flex-col z-20 pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeMenu !== 'home' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Tombol Close diturunkan posisinya agar sejajar dan tidak nabrak Header */}
        <button 
          onClick={() => setActiveMenu('home')}
          className="absolute top-28 right-8 text-xs tracking-widest text-slate-400 hover:text-white transition-colors uppercase border border-slate-600/50 hover:border-slate-400 px-4 py-2 rounded-none cursor-pointer backdrop-blur-md"
        >
          [ ESC ] CLOSE
        </button>

        {/* Konten Panel */}
        <div className="mt-12 space-y-6">
          {activeMenu === 'about' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-indigo-400 tracking-[0.3em] mb-2 font-bold">/// SECTOR 01</div>
              <h2 className="text-4xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]">THE CORE.</h2>
              <p className="text-slate-300 leading-relaxed text-sm font-sans mb-8">
                We engineer neon dreams and construct procedural architectures. This is the zero-point where digital innovation merges with immersive WebGL space.
              </p>
              <button className="w-full py-4 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 transition-all uppercase tracking-widest text-xs font-bold cursor-pointer group">
                <span className="group-hover:tracking-[0.2em] transition-all">Initialize Sequence</span>
              </button>
            </div>
          )}

          {activeMenu === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-pink-400 tracking-[0.3em] mb-2 font-bold">/// SECTOR 02</div>
              <h2 className="text-4xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">ARCHIVES.</h2>
              <p className="text-slate-300 leading-relaxed text-sm font-sans mb-8">
                A classified collection of high-performance WebGL interfaces and React Three Fiber deployments. Access the vault to review our latest visual operations.
              </p>
              <button className="w-full py-4 bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white border border-pink-500/30 transition-all uppercase tracking-widest text-xs font-bold cursor-pointer group">
                <span className="group-hover:tracking-[0.2em] transition-all">Access Database</span>
              </button>
            </div>
          )}

          {activeMenu === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-amber-400 tracking-[0.3em] mb-2 font-bold">/// SECTOR 03</div>
              <h2 className="text-4xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">CAPABILITIES.</h2>
              <p className="text-slate-300 leading-relaxed text-sm font-sans mb-8">
                Executing complex 3D transformations, interactive spatial designs, and scalable Next.js infrastructures. We upgrade standard interfaces into deep digital dimensions.
              </p>
              <button className="w-full py-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/30 transition-all uppercase tracking-widest text-xs font-bold cursor-pointer group">
                <span className="group-hover:tracking-[0.2em] transition-all">View Protocols</span>
              </button>
            </div>
          )}

          {activeMenu === 'contact' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="text-xs text-emerald-400 tracking-[0.3em] mb-2 font-bold">/// SECTOR 04</div>
              <h2 className="text-4xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">TRANSMISSION.</h2>
              <p className="text-slate-300 leading-relaxed text-sm font-sans mb-8">
                Ready to override the system? Establish a secure connection through our hyperspace relay network. We are listening.
              </p>
              <button className="w-full py-4 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all uppercase tracking-widest text-xs font-bold cursor-pointer group">
                <span className="group-hover:tracking-[0.2em] transition-all">Open Channel</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

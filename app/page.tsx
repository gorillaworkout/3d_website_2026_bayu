"use client"

import { useState } from 'react'
import Scene from './components/Scene'

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('home')

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-900 text-white">
      
      {/* Background 3D dikendalikan oleh state activeMenu */}
      <Scene activeMenu={activeMenu} />

      {/* Navigasi HTML Overlay */}
      <nav className="fixed top-0 left-0 w-full p-8 z-10 flex justify-between items-center pointer-events-auto">
        <div className="text-2xl font-black tracking-tighter text-cyan-400 drop-shadow-md">3D CYBERPUNK</div>
        <ul className="flex gap-8 text-sm uppercase tracking-widest font-medium">
          <li>
            <button 
              onClick={() => setActiveMenu('home')}
              className={`hover:text-cyan-400 transition-colors cursor-pointer ${activeMenu === 'home' ? 'text-cyan-400 border-b border-cyan-400' : ''}`}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveMenu('about')}
              className={`hover:text-indigo-400 transition-colors cursor-pointer ${activeMenu === 'about' ? 'text-indigo-400 border-b border-indigo-400' : ''}`}
            >
              About
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveMenu('portfolio')}
              className={`hover:text-pink-400 transition-colors cursor-pointer ${activeMenu === 'portfolio' ? 'text-pink-400 border-b border-pink-400' : ''}`}
            >
              Portfolio
            </button>
          </li>
        </ul>
      </nav>

      {/* Konten HTML Dinamis di Pojok Kiri Bawah */}
      <div className="fixed bottom-10 left-10 z-10 max-w-md pointer-events-none drop-shadow-lg">
        {activeMenu === 'home' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-6xl font-bold mb-4 text-cyan-400">Discover the Future.</h1>
            <p className="text-slate-300">Click the menus above to dive into the Cyber City.</p>
          </div>
        )}
        {activeMenu === 'about' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-6xl font-bold mb-4 text-indigo-400">The Core.</h1>
            <p className="text-slate-300">We build neon dreams and procedural cities.</p>
          </div>
        )}
        {activeMenu === 'portfolio' && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-6xl font-bold mb-4 text-pink-400">Our Work.</h1>
            <p className="text-slate-300">WebGL experiences powered by React Three Fiber.</p>
          </div>
        )}
      </div>

    </main>
  )
}

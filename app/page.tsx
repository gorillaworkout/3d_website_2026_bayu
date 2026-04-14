import Scene from './components/Scene'
import SmoothScroller from './components/SmoothScroller'

export default function Home() {
  return (
    <SmoothScroller>
      {/* Latar Belakang 3D Canvas yang tetap (fixed) */}
      <Scene />

      {/* Konten HTML (harus berada di atas Canvas secara z-index) */}
      <main className="relative z-10 w-full">
        {/* Section 1: Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            THE FUTURE OF WEB
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
            Welcome to the new era of interactive digital experiences powered by WebGL and React Three Fiber.
          </p>
          <div className="mt-12 animate-bounce">
            <span className="text-slate-400 text-sm uppercase tracking-widest">Scroll Down</span>
            <div className="w-px h-16 bg-slate-400 mx-auto mt-4"></div>
          </div>
        </section>

        {/* Section 2: Features */}
        <section className="min-h-screen flex items-center bg-slate-900/50 backdrop-blur-sm border-y border-slate-800">
          <div className="container mx-auto px-8 grid md:grid-cols-2 gap-16">
            <div className="space-y-8 pointer-events-auto">
              <h2 className="text-4xl md:text-6xl font-bold">Immersive<br/>Storytelling</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                By blending HTML layout with a continuous 3D canvas background, you can create the illusion of depth. Just like RockTree Capital or Apple product pages.
              </p>
              <button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-full font-bold uppercase tracking-wider text-sm shadow-lg shadow-indigo-500/25">
                Explore More
              </button>
            </div>
            {/* Ruang kosong agar objek 3D di Canvas (z-index 0) terlihat menonjol */}
            <div></div> 
          </div>
        </section>

        {/* Section 3: Footer */}
        <section className="min-h-[50vh] flex flex-col items-center justify-center bg-black/80">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Build?</h2>
          <p className="text-slate-400">Created by Clawpatra for Bayu Darmawan</p>
        </section>
      </main>
    </SmoothScroller>
  )
}

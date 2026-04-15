import { X, ArrowUpRight } from 'lucide-react'

export default function ProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
  if (!project) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content - 3D Effect */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 transition-transform"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        
        {/* Header Image */}
        <div className="w-full h-48 md:h-80 bg-slate-800 relative overflow-hidden group">
           {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="text-white/10 font-black text-6xl md:text-8xl tracking-tighter uppercase blur-[2px]">{project.title.substring(0,3)}</span>
              </div>
           )}
           
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content Body */}
        <div className="p-8 md:p-10 relative -mt-20 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-3 ${project.colorClass}`}>
                {project.year}
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight drop-shadow-lg">
                {project.title}
              </h2>
            </div>
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-200 text-black rounded-full transition-all text-xs font-bold uppercase tracking-widest shrink-0 shadow-lg hover:scale-105"
              >
                Visit Site <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold mb-5">About Project</h3>
              <div className="space-y-5 text-slate-300 font-light text-sm md:text-base leading-relaxed">
                {project.fullDescription.map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold mb-5">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <span 
                    key={tech} 
                    className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-slate-300 text-xs tracking-wider backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

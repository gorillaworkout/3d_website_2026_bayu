"use client"

import { useState, useEffect, useRef } from 'react'

interface TerminalLine {
  text: string
  color: string
}

const lines: TerminalLine[] = [
  { text: '> const developer = {', color: '#8b5cf6' },
  { text: '    name: "Bayu Darmawan",', color: '#94a3b8' },
  { text: '    location: "Bandung, ID",', color: '#94a3b8' },
  { text: '    role: "Full-Stack Developer",', color: '#94a3b8' },
  { text: '    experience: "5+ years",', color: '#94a3b8' },
  { text: '    passion: "Building the future",', color: '#94a3b8' },
  { text: '  };', color: '#8b5cf6' },
  { text: '', color: '' },
  { text: '> developer.skills', color: '#06b6d4' },
  { text: '  ["React", "Next.js", "TypeScript",', color: '#34d399' },
  { text: '   "Three.js", "PostgreSQL", "Docker",', color: '#34d399' },
  { text: '   "AI Integration", "WebGL"]', color: '#34d399' },
  { text: '', color: '' },
  { text: '> developer.status', color: '#06b6d4' },
  { text: '  "Available for collaboration"', color: '#f59e0b' },
]

interface TerminalProps {
  className?: string
}

export default function Terminal({ className = '' }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [started, setStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )

    const el = containerRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [started])

  useEffect(() => {
    if (!started) return

    if (visibleLines >= lines.length) return

    const timeout = setTimeout(() => {
      setVisibleLines(prev => prev + 1)
    }, 80)

    return () => clearTimeout(timeout)
  }, [started, visibleLines])

  return (
    <div
      ref={containerRef}
      className={`rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a18] shadow-2xl ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-slate-500 font-mono tracking-wider">
          ~/bayu/profile.ts
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-[13px] leading-relaxed min-h-[320px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              opacity: i < visibleLines ? 1 : 0,
              transform: i < visibleLines ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: `${i * 30}ms`,
            }}
          >
            {line.text === '' ? (
              <div className="h-4" />
            ) : (
              <pre className="whitespace-pre" style={{ color: line.color }}>
                {line.text}
              </pre>
            )}
          </div>
        ))}

        {/* Blinking cursor */}
        {visibleLines >= lines.length && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-slate-500">&gt;</span>
            <span className="cursor-blink text-[#06b6d4] text-lg leading-none">▊</span>
          </div>
        )}
      </div>
    </div>
  )
}

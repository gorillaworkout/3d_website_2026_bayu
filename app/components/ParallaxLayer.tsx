"use client"

import { useRef, useEffect } from 'react'

interface ParallaxLayerProps {
  speed?: number // 0 = no movement, 1 = full movement
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
}

export default function ParallaxLayer({
  speed = 0.5,
  children,
  className = '',
  direction = 'vertical',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let animFrame: number
    const handleMouseMove = (e: MouseEvent) => {
      animFrame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * speed * 30
        const y = (e.clientY / window.innerHeight - 0.5) * speed * 30
        if (direction === 'horizontal') {
          el.style.transform = `translate3d(${x}px, 0, 0)`
        } else {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrame)
    }
  }, [speed, direction])

  return (
    <div
      ref={ref}
      className={`will-change-transform transition-transform duration-300 ease-out ${className}`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {children}
    </div>
  )
}

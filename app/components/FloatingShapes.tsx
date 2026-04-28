"use client"

import { useRef, useEffect, useMemo } from 'react'

interface FloatingShape {
  id: number
  type: 'circle' | 'ring' | 'dot' | 'line' | 'triangle' | 'cross'
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  delay: number
  color: string
}

interface FloatingShapesProps {
  count?: number
  colors?: string[]
  className?: string
}

export default function FloatingShapes({
  count = 15,
  colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#34d399'],
  className = '',
}: FloatingShapesProps) {
  const shapes = useMemo<FloatingShape[]>(() => {
    const types: FloatingShape['type'][] = ['circle', 'ring', 'dot', 'line', 'triangle', 'cross']
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 20,
      opacity: 0.05 + Math.random() * 0.15,
      speed: 15 + Math.random() * 30,
      delay: Math.random() * -20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [count, colors])

  const renderShape = (shape: FloatingShape) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      opacity: shape.opacity,
      animation: `floatShape ${shape.speed}s ease-in-out ${shape.delay}s infinite`,
      willChange: 'transform',
    }

    switch (shape.type) {
      case 'circle':
        return (
          <div key={shape.id} style={style}>
            <div
              style={{
                width: shape.size,
                height: shape.size,
                borderRadius: '50%',
                background: shape.color,
                filter: `blur(${shape.size > 12 ? 2 : 0}px)`,
              }}
            />
          </div>
        )
      case 'ring':
        return (
          <div key={shape.id} style={style}>
            <div
              style={{
                width: shape.size * 1.5,
                height: shape.size * 1.5,
                borderRadius: '50%',
                border: `1px solid ${shape.color}`,
                background: 'transparent',
              }}
            />
          </div>
        )
      case 'dot':
        return (
          <div key={shape.id} style={style}>
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: shape.color,
                boxShadow: `0 0 ${shape.size}px ${shape.color}`,
              }}
            />
          </div>
        )
      case 'line':
        return (
          <div key={shape.id} style={{ ...style, transform: `rotate(${Math.random() * 180}deg)` }}>
            <div
              style={{
                width: shape.size * 2,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${shape.color}, transparent)`,
              }}
            />
          </div>
        )
      case 'triangle':
        return (
          <div key={shape.id} style={style}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
                opacity: 0.5,
              }}
            />
          </div>
        )
      case 'cross':
        return (
          <div key={shape.id} style={style}>
            <div style={{ position: 'relative', width: shape.size, height: shape.size }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  width: '100%',
                  height: 1,
                  background: shape.color,
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  height: '100%',
                  width: 1,
                  background: shape.color,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map(renderShape)}
    </div>
  )
}

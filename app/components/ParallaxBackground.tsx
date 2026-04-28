'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ParallaxBackgroundProps {
  activeIndex: number;
  sectionIndex: number;
  accentColor?: string;
  variant?: 'grid' | 'dots' | 'lines' | 'circles';
}

/**
 * Multi-layer parallax background for each section.
 * Layer 1 (far): grid/pattern — moves slowest
 * Layer 2 (mid): floating geometric shapes
 * Layer 3 (near): handled by the content itself
 */
export default function ParallaxBackground({
  activeIndex,
  sectionIndex,
  accentColor = '#22d3ee',
  variant = 'grid',
}: ParallaxBackgroundProps) {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const diff = activeIndex - sectionIndex;

    // Parallax: layers move at different speeds relative to section transition
    if (layer1Ref.current) {
      gsap.to(layer1Ref.current, {
        y: diff * -20,
        duration: 1.2,
        ease: 'power2.out',
      });
    }
    if (layer2Ref.current) {
      gsap.to(layer2Ref.current, {
        y: diff * -40,
        duration: 1.2,
        ease: 'power2.out',
      });
    }
  }, [activeIndex, sectionIndex]);

  return (
    <div className="parallax-bg absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Far — grid pattern */}
      <div
        ref={layer1Ref}
        className="absolute inset-[-20%] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              variant === 'grid'
                ? `linear-gradient(${accentColor}08 1px, transparent 1px),
                   linear-gradient(90deg, ${accentColor}08 1px, transparent 1px)`
                : variant === 'dots'
                ? `radial-gradient(circle, ${accentColor}15 1px, transparent 1px)`
                : `linear-gradient(${accentColor}06 1px, transparent 1px)`,
            backgroundSize:
              variant === 'grid' ? '60px 60px' : variant === 'dots' ? '30px 30px' : '100% 40px',
          }}
        />
      </div>

      {/* Layer 2: Mid — floating geometric shapes */}
      <div
        ref={layer2Ref}
        className="absolute inset-[-30%] will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        {/* Geometric shapes */}
        <div
          className="parallax-shape absolute w-32 h-32 rounded-full"
          style={{
            top: '15%',
            left: '10%',
            background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
            animation: 'floatSlow 20s ease-in-out infinite alternate',
          }}
        />
        <div
          className="parallax-shape absolute w-20 h-20 border rounded-full"
          style={{
            top: '60%',
            right: '15%',
            borderColor: `${accentColor}10`,
            animation: 'floatMed 15s ease-in-out infinite alternate-reverse',
          }}
        />
        <div
          className="parallax-shape absolute w-1 h-24"
          style={{
            top: '30%',
            left: '70%',
            background: `linear-gradient(180deg, transparent, ${accentColor}15, transparent)`,
            animation: 'floatSlow 18s ease-in-out infinite alternate',
          }}
        />
        <div
          className="parallax-shape absolute w-16 h-16"
          style={{
            bottom: '25%',
            left: '25%',
            border: `1px solid ${accentColor}08`,
            transform: 'rotate(45deg)',
            animation: 'floatMed 22s ease-in-out infinite alternate-reverse',
          }}
        />
        <div
          className="parallax-shape absolute w-2 h-2 rounded-full"
          style={{
            top: '45%',
            right: '35%',
            background: accentColor,
            opacity: 0.15,
            animation: 'pulseDot 4s ease-in-out infinite',
          }}
        />
        <div
          className="parallax-shape absolute w-2 h-2 rounded-full"
          style={{
            top: '75%',
            left: '55%',
            background: accentColor,
            opacity: 0.1,
            animation: 'pulseDot 5s ease-in-out infinite 1s',
          }}
        />
      </div>
    </div>
  );
}

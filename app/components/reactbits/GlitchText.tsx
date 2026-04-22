'use client';

import React, { ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

export default function GlitchText({ children, className = '' }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : '';

  return (
    <span className={`glitch-text-wrapper group relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      {text && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-80 pointer-events-none z-20"
            style={{
              color: '#ff00ff',
              animation: 'glitchAnim1 0.3s infinite linear alternate-reverse',
              clipPath: 'polygon(0 0, 100% 0, 100% 33%, 0 33%)',
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-80 pointer-events-none z-20"
            style={{
              color: '#00ffff',
              animation: 'glitchAnim2 0.3s infinite linear alternate-reverse',
              clipPath: 'polygon(0 66%, 100% 66%, 100% 100%, 0 100%)',
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

'use client';

import React, { ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  shimmerColor?: string;
}

export default function ShinyText({
  children,
  className = '',
  speed = 3,
  shimmerColor = 'rgba(255, 255, 255, 0.3)',
}: ShinyTextProps) {
  return (
    <span
      className={`shiny-text-wrapper ${className}`}
      style={
        {
          '--shimmer-speed': `${speed}s`,
          '--shimmer-color': shimmerColor,
          position: 'relative',
          display: 'inline-block',
          backgroundImage: `linear-gradient(
            120deg,
            transparent 0%,
            transparent 35%,
            var(--shimmer-color) 50%,
            transparent 65%,
            transparent 100%
          )`,
          backgroundSize: '300% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'inherit',
          animation: `shinyTextMove var(--shimmer-speed) linear infinite`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

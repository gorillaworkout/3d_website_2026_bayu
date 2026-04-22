'use client';

import React from 'react';

interface AuroraProps {
  className?: string;
  colors?: string[];
}

export default function Aurora({
  className = '',
  colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
}: AuroraProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {colors.map((color, i) => (
        <div
          key={i}
          className="aurora-blob absolute rounded-full blur-[120px] opacity-30"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            width: `${40 + i * 15}%`,
            height: `${40 + i * 15}%`,
            top: `${-10 + i * 20}%`,
            left: `${-5 + i * 25}%`,
            animation: `auroraMove${i + 1} ${12 + i * 4}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

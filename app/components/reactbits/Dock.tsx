'use client';

import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface DockItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  magnification?: number;
  baseSize?: number;
}

export default function Dock({
  items,
  className = '',
  magnification = 1.6,
  baseSize = 44,
}: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = dockRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const getScale = (index: number) => {
    if (mouseX === null) return 1;
    const el = dockRef.current;
    if (!el) return 1;

    const itemWidth = baseSize + 12; // item width + gap
    const itemCenter = index * itemWidth + itemWidth / 2;
    const distance = Math.abs(mouseX - itemCenter);
    const maxDistance = itemWidth * 2.5;

    if (distance > maxDistance) return 1;
    const scale = 1 + (magnification - 1) * (1 - distance / maxDistance);
    return scale;
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className}`}>
      <div
        ref={dockRef}
        className="flex items-end gap-1 px-3 py-2 bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, index) => {
          const scale = getScale(index);
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 group cursor-pointer relative"
              style={{
                width: baseSize,
                transition: 'all 0.15s ease-out',
              }}
              title={item.label}
            >
              <div
                className="flex items-center justify-center rounded-xl bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white transition-colors"
                style={{
                  width: baseSize * scale,
                  height: baseSize * scale,
                  transition: 'all 0.15s ease-out',
                  marginBottom: (scale - 1) * baseSize * 0.5,
                }}
              >
                {item.icon}
              </div>
              <span
                className="text-[9px] text-slate-500 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 whitespace-nowrap"
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

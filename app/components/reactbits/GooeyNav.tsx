"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface GooeyNavItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  colors?: [string, string];
  initialActiveIndex?: number;
  className?: string;
}

export default function GooeyNav({
  items,
  animationTime = 600,
  particleCount = 15,
  colors = ["#06b6d4", "#8b5cf6"],
  initialActiveIndex = 0,
  className = "",
}: GooeyNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; vx: number; vy: number }[]
  >([]);
  const particleId = useRef(0);

  // Move blob to active item
  const moveBlob = useCallback(
    (index: number) => {
      const item = itemRefs.current[index];
      const nav = navRef.current;
      const blob = blobRef.current;
      if (!item || !nav || !blob) return;

      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const x = itemRect.left - navRect.left + itemRect.width / 2;
      const y = itemRect.top - navRect.top + itemRect.height / 2;

      blob.style.transition = `all ${animationTime}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      blob.style.left = `${x}px`;
      blob.style.top = `${y}px`;

      // Spawn particles
      const newParticles = Array.from({ length: particleCount }, () => ({
        id: particleId.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, animationTime);
    },
    [animationTime, particleCount]
  );

  useEffect(() => {
    moveBlob(activeIndex);
  }, [activeIndex, moveBlob]);

  // Initial position
  useEffect(() => {
    const timer = setTimeout(() => moveBlob(initialActiveIndex), 100);
    return () => clearTimeout(timer);
  }, [initialActiveIndex, moveBlob]);

  const handleClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setActiveIndex(index);
    const item = items[index];
    if (item.onClick) {
      item.onClick();
    } else if (item.href.startsWith("#")) {
      const target = document.querySelector(item.href);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`gooey-nav relative flex items-center gap-1 px-4 py-2 bg-[#050510]/80 backdrop-blur-2xl border border-white/[0.06] rounded-full ${className}`}
    >
      {/* SVG Filter for gooey effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gooey container */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
        style={{ filter: "url(#gooey-filter)" }}
      >
        {/* Main blob */}
        <div
          ref={blobRef}
          className="absolute w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        />

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: p.x,
              top: p.y,
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              transform: `translate(${p.vx}px, ${p.vy}px)`,
              transition: `transform ${animationTime}ms ease-out`,
              opacity: 0,
              animation: `gooeyParticleFade ${animationTime}ms ease-out forwards`,
            }}
          />
        ))}
      </div>

      {/* Nav items */}
      {items.map((item, i) => (
        <a
          key={item.label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          href={item.href}
          onClick={(e) => handleClick(e, i)}
          className={`relative z-10 px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors duration-300 whitespace-nowrap ${
            activeIndex === i
              ? "text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export default function ScrollFloat({
  children,
  className = '',
  distance = 60,
  duration = 1,
}: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: distance });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [distance, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

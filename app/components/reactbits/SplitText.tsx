'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerAmount?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  staggerAmount = 0.05,
  as: Tag = 'div',
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.split-word');

    gsap.set(words, { opacity: 0, y: 40, rotateX: -40 });

    const ctx = gsap.context(() => {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: staggerAmount,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [text, delay, staggerAmount]);

  const words = text.split(' ');

  return (
    <Tag ref={containerRef as any} className={className} style={{ perspective: '600px' }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="split-word inline-block"
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  );
}

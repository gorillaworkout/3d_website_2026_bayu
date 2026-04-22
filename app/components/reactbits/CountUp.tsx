'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export default function CountUp({
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();
            const durationMs = duration * 1000;

            const animate = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / durationMs, 1);
              
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * to;

              setCount(Number(current.toFixed(decimals)));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

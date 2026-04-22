'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  show: boolean;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  staggerChildren?: number;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  show,
  distance = 60,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  delay = 0,
  staggerChildren = 0,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;

    if (show) {
      // Animate in
      gsap.fromTo(el, 
        { [axis]: offset, opacity: 0, visibility: 'visible' },
        { [axis]: 0, opacity: 1, duration, ease, delay, visibility: 'visible' }
      );

      // Stagger children if requested
      if (staggerChildren > 0) {
        const childEls = el.children;
        gsap.fromTo(childEls,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: staggerChildren, delay: delay + 0.2 }
        );
      }

      hasAnimatedIn.current = true;
    } else if (hasAnimatedIn.current) {
      // Animate out
      gsap.to(el, {
        [axis]: reverse ? distance : -distance / 2,
        opacity: 0,
        duration: duration * 0.5,
        ease: 'power2.in'
      });
    } else {
      // Initial hidden state
      gsap.set(el, { opacity: 0, [axis]: offset, visibility: 'hidden' });
    }
  }, [show, distance, direction, reverse, duration, ease, delay, staggerChildren]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;

"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollStackItem({ children, className = "", style }: ScrollStackItemProps) {
  return (
    <div className={`scroll-stack-item ${className}`} style={style}>
      {children}
    </div>
  );
}

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  cardHeight?: number;
  scaleStep?: number;
  topOffset?: number;
}

export function ScrollStack({
  children,
  className = "",
  cardHeight = 400,
  scaleStep = 0.03,
  topOffset = 80,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLDivElement>(".scroll-stack-item");
    if (cards.length === 0) return;
    
    cardsRef.current = Array.from(cards);
    const totalCards = cards.length;

    // Each card gets a pinned ScrollTrigger
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      // Set initial styles
      gsap.set(card, {
        position: "relative",
        zIndex: i + 1,
      });

      if (i < totalCards - 1) {
        // Pin each card except the last
        const st = ScrollTrigger.create({
          trigger: card,
          start: `top ${topOffset}px`,
          end: `+=${cardHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            // Scale down as the next card comes in
            const scale = 1 - self.progress * scaleStep * (totalCards - i);
            const brightness = 1 - self.progress * 0.15;
            gsap.set(card, {
              scale,
              filter: `brightness(${brightness})`,
              transformOrigin: "center top",
            });
          },
        });
        triggers.push(st);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [children, cardHeight, scaleStep, topOffset]);

  return (
    <div ref={containerRef} className={`scroll-stack ${className}`}>
      {children}
    </div>
  );
}

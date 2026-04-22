"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom center",
  wordAnimationEnd = "bottom center",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => children.split(/\s+/), [children]);

  useEffect(() => {
    if (!containerRef.current) return;

    const wordElements = containerRef.current.querySelectorAll(".word");
    if (wordElements.length === 0) return;

    // Rotation animation for the container text
    gsap.fromTo(
      containerRef.current.querySelector(".scroll-reveal-text"),
      { rotateX: baseRotation },
      {
        rotateX: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    );

    // Word-by-word reveal
    gsap.fromTo(
      wordElements,
      {
        opacity: baseOpacity,
        filter: enableBlur ? `blur(${blurStrength}px)` : "none",
      },
      {
        opacity: 1,
        filter: enableBlur ? "blur(0px)" : "none",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current || t.trigger === containerRef.current?.querySelector(".scroll-reveal-text")) {
          t.kill();
        }
      });
    };
  }, [words, enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, wordAnimationEnd]);

  return (
    <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p
        className={`scroll-reveal-text ${textClassName}`}
        style={{ perspective: "500px", transformStyle: "preserve-3d" }}
      >
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span
              className="word"
              style={{
                opacity: baseOpacity,
                filter: enableBlur ? `blur(${blurStrength}px)` : "none",
                transition: "none",
                willChange: "opacity, filter",
              }}
            >
              {word}
            </span>
            {i < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}

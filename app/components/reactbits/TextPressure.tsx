"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

export default function TextPressure({
  text = "Hello",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1581441981/Compressa_VF_o2xbk2.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#ffffff",
  strokeColor = "#ff0000",
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  // Load font
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontUrl}') format('woff2');
        font-weight: 100 900;
        font-stretch: 50% 200%;
        font-style: oblique 0deg 20deg;
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    // Wait for font load
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, [fontFamily, fontUrl]);

  // Calculate font size to fit container
  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      // Estimate: each character takes about 0.6em width at default settings
      const charCount = text.length;
      let size = Math.floor(containerWidth / (charCount * 0.55));
      size = Math.max(minFontSize, Math.min(size, 200));
      setFontSize(size);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [fontLoaded, text, minFontSize]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  // Animation loop
  useEffect(() => {
    if (!fontLoaded) return;

    const animate = () => {
      const chars = charsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (!char) continue;

        const rect = char.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 300;
        const proximity = Math.max(0, 1 - dist / maxDist);

        // Calculate variation settings
        const wght = weight ? Math.round(100 + proximity * 800) : 400;
        const wdth = width ? Math.round(100 + proximity * 100) : 100;
        const ital = italic ? Math.round(proximity * 12) : 0;

        char.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;

        if (alpha) {
          char.style.opacity = String(0.3 + proximity * 0.7);
        }

        if (scale) {
          const s = 1 + proximity * 0.3;
          char.style.transform = `scale(${s})`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fontLoaded, weight, width, italic, alpha, scale]);

  if (!fontLoaded) {
    return (
      <div className={`text-center ${className}`}>
        <span style={{ fontSize: `${fontSize}px`, opacity: 0.1, color: textColor }}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`text-pressure-container select-none ${className}`}
      style={{
        display: flex ? "flex" : "block",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          style={{
            fontFamily: `'${fontFamily}', sans-serif`,
            fontSize: `${fontSize}px`,
            color: stroke ? "transparent" : textColor,
            WebkitTextStroke: stroke ? `1px ${strokeColor}` : undefined,
            display: "inline-block",
            fontVariationSettings: "'wght' 100, 'wdth' 100, 'ital' 0",
            transition: "font-variation-settings 0.1s ease-out",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

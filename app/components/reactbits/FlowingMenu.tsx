"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

interface FlowingMenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
}

export default function FlowingMenu({
  items,
  speed = 25,
  textColor = "#e2e8f0",
  bgColor = "transparent",
  marqueeBgColor = "#06b6d4",
  marqueeTextColor = "#ffffff",
  borderColor = "rgba(255, 255, 255, 0.06)",
  className = "",
}: FlowingMenuProps) {
  return (
    <div
      className={`flowing-menu overflow-hidden ${className}`}
      style={{ background: bgColor }}
    >
      {items.map((item, index) => (
        <FlowingMenuLink
          key={index}
          item={item}
          speed={speed}
          textColor={textColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
        />
      ))}
    </div>
  );
}

/* ── Individual menu item ── */

interface FlowingMenuLinkProps {
  item: FlowingMenuItem;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
}

function FlowingMenuLink({
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: FlowingMenuLinkProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!marqueeInnerRef.current) return;
    if (isHovered) {
      // Start marquee animation
      animRef.current = gsap.to(marqueeInnerRef.current, {
        xPercent: -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    } else {
      // Stop and reset
      animRef.current?.kill();
      if (marqueeInnerRef.current) {
        gsap.set(marqueeInnerRef.current, { xPercent: 0 });
      }
    }

    return () => {
      animRef.current?.kill();
    };
  }, [isHovered, speed]);

  // Repeat text enough times for seamless loop
  const repeatCount = 6;

  return (
    <a
      ref={itemRef}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flowing-menu-item group relative block overflow-hidden cursor-pointer"
      style={{
        borderBottom: `1px solid ${borderColor}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default state - static text */}
      <div
        className="flowing-menu-default relative flex items-center py-5 px-6 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0 : 1,
          color: textColor,
        }}
      >
        <span className="text-lg md:text-2xl font-semibold tracking-tight">
          {item.text}
        </span>
      </div>

      {/* Hover state - marquee */}
      <div
        ref={marqueeRef}
        className="flowing-menu-marquee absolute inset-0 flex items-center overflow-hidden transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: marqueeBgColor,
        }}
      >
        <div
          ref={marqueeInnerRef}
          className="flex items-center whitespace-nowrap"
          style={{ willChange: "transform" }}
        >
          {Array.from({ length: repeatCount }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span
                className="text-lg md:text-2xl font-bold px-6 tracking-tight"
                style={{ color: marqueeTextColor }}
              >
                {item.text}
              </span>
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="h-8 md:h-10 w-auto object-contain mx-4 rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}

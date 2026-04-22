"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  CSSProperties,
} from "react";

/* ─────────── GlobalSpotlight ─────────── */

interface GlobalSpotlightProps {
  className?: string;
  glowColor?: string;
  spotlightRadius?: number;
}

export function GlobalSpotlight({
  className = "",
  glowColor = "rgba(6, 182, 212, 0.15)",
  spotlightRadius = 350,
}: GlobalSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.background = `radial-gradient(${spotlightRadius}px circle at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
    };

    const handleLeave = () => {
      el.style.background = "transparent";
    };

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [glowColor, spotlightRadius]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none z-0 transition-[background] duration-300 ${className}`}
    />
  );
}

/* ─────────── BentoCard ─────────── */

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  particleCount?: number;
}

export function BentoCard({
  children,
  className = "",
  style,
  glowColor = "rgba(6, 182, 212, 0.4)",
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false,
  particleCount = 0,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; angle: number }[]
  >([]);
  const particleId = useRef(0);

  // Border glow on hover
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Border glow
      card.style.setProperty("--glow-x", `${x}px`);
      card.style.setProperty("--glow-y", `${y}px`);

      // Tilt
      if (enableTilt) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -4;
        const rotY = ((x - cx) / cx) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    },
    [enableTilt]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    if (enableTilt) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  }, [enableTilt]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!clickEffect) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 600);

      // Spawn particles on click
      if (particleCount > 0) {
        const newParticles = Array.from({ length: particleCount }, () => ({
          id: particleId.current++,
          x,
          y,
          angle: Math.random() * 360,
        }));
        setParticles((prev) => [...prev, ...newParticles]);
        setTimeout(() => {
          setParticles((prev) =>
            prev.filter((p) => !newParticles.find((np) => np.id === p.id))
          );
        }, 800);
      }
    },
    [clickEffect, particleCount]
  );

  return (
    <div
      ref={cardRef}
      className={`bento-card group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-[transform] duration-300 ease-out ${className}`}
      style={{
        ...style,
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Border glow */}
      <div
        className="bento-border-glow absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(200px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Ripple effect */}
      {ripple && (
        <span
          className="absolute rounded-full pointer-events-none animate-[bentoRipple_0.6s_ease-out_forwards]"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${glowColor}, transparent)`,
          }}
        />
      )}

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none animate-[bentoParticle_0.8s_ease-out_forwards]"
          style={{
            left: p.x,
            top: p.y,
            background: glowColor,
            ["--angle" as string]: `${p.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────── BentoGrid ─────────── */

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  spotlightRadius?: number;
  enableSpotlight?: boolean;
}

export function BentoGrid({
  children,
  className = "",
  glowColor = "rgba(6, 182, 212, 0.12)",
  spotlightRadius = 400,
  enableSpotlight = true,
}: BentoGridProps) {
  return (
    <div className={`bento-grid relative ${className}`}>
      {enableSpotlight && (
        <GlobalSpotlight
          glowColor={glowColor}
          spotlightRadius={spotlightRadius}
        />
      )}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  style?: React.CSSProperties;
  className?: string;
}

// Perlin noise implementation
class Perlin {
  private grad3: number[][];
  private perm: number[];

  constructor() {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
    ];
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);

    const n00 = this.dot(this.grad3[this.perm[X + this.perm[Y]] % 12], xf, yf);
    const n01 = this.dot(this.grad3[this.perm[X + this.perm[Y + 1]] % 12], xf, yf - 1);
    const n10 = this.dot(this.grad3[this.perm[X + 1 + this.perm[Y]] % 12], xf - 1, yf);
    const n11 = this.dot(this.grad3[this.perm[X + 1 + this.perm[Y + 1]] % 12], xf - 1, yf - 1);

    const x1 = this.lerp(n00, n10, u);
    const x2 = this.lerp(n01, n11, u);
    return this.lerp(x1, x2, v);
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }
}

export default function Waves({
  lineColor = "rgba(6, 182, 212, 0.15)",
  backgroundColor = "transparent",
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  xGap = 12,
  yGap = 36,
  friction = 0.925,
  tension = 0.012,
  maxCursorMove = 120,
  style,
  className = "",
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const perlin = new Perlin();
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    // Generate line points
    let lines: Array<Array<{ x: number; y: number; originX: number; originY: number; vx: number; vy: number }>> = [];

    const initLines = () => {
      lines = [];
      const numLines = Math.ceil(h / yGap) + 1;
      for (let l = 0; l < numLines; l++) {
        const lineY = l * yGap;
        const points = [];
        const numPoints = Math.ceil(w / xGap) + 1;
        for (let p = 0; p < numPoints; p++) {
          const px = p * xGap;
          points.push({
            x: px,
            y: lineY,
            originX: px,
            originY: lineY,
            vx: 0,
            vy: 0,
          });
        }
        lines.push(points);
      }
    };

    initLines();

    let timeX = 0;
    let timeY = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, w, h);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      timeX += waveSpeedX;
      timeY += waveSpeedY;

      const mouse = mouseRef.current;

      for (let l = 0; l < lines.length; l++) {
        const points = lines[l];

        for (let p = 0; p < points.length; p++) {
          const point = points[p];
          const noiseVal = perlin.noise(
            point.originX * 0.005 + timeX,
            point.originY * 0.005 + timeY
          );

          const targetX = point.originX + noiseVal * waveAmpX;
          const targetY = point.originY + noiseVal * waveAmpY;

          // Mouse interaction
          const dx = mouse.x - point.x;
          const dy = mouse.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = maxCursorMove;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 2;
            point.vx -= (dx / dist) * force;
            point.vy -= (dy / dist) * force;
          }

          // Spring back to target
          point.vx += (targetX - point.x) * tension;
          point.vy += (targetY - point.y) * tension;
          point.vx *= friction;
          point.vy *= friction;
          point.x += point.vx;
          point.y += point.vy;
        }

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        if (points.length > 0) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let p = 1; p < points.length - 1; p++) {
            const xc = (points[p].x + points[p + 1].x) / 2;
            const yc = (points[p].y + points[p + 1].y) / 2;
            ctx.quadraticCurveTo(points[p].x, points[p].y, xc, yc);
          }
          if (points.length > 1) {
            ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          }
        }
        ctx.stroke();
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);

    const resizeObs = new ResizeObserver(() => {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      initLines();
    });
    resizeObs.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObs.disconnect();
    };
  }, [
    lineColor, backgroundColor, waveSpeedX, waveSpeedY,
    waveAmpX, waveAmpY, xGap, yGap, friction, tension,
    maxCursorMove, handleMouseMove,
  ]);

  return (
    <div
      ref={containerRef}
      className={`waves ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

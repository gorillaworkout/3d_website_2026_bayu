"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface GhostCursorProps {
  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  brightness?: number;
  color?: string;
  mixBlendMode?: string;
  edgeIntensity?: number;
  maxDevicePixelRatio?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GhostCursor({
  trailLength = 20,
  inertia = 0.85,
  grainIntensity = 0.04,
  bloomStrength = 1.5,
  bloomRadius = 0.4,
  bloomThreshold = 0.1,
  brightness = 0.8,
  color = "#06b6d4",
  mixBlendMode = "screen",
  edgeIntensity = 0.4,
  maxDevicePixelRatio = 1.5,
  fadeDelayMs = 3000,
  fadeDurationMs = 1000,
  zIndex = 2,
  className = "",
  style,
}: GhostCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const composerRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastMoveRef = useRef(Date.now());
  const fadeRef = useRef(1.0);

  // Parse color to RGB
  const parseColor = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;

    // Dynamic import Three.js to avoid SSR issues
    const init = async () => {
      const THREE = await import("three");
      const { EffectComposer } = await import("three/examples/jsm/postprocessing/EffectComposer.js");
      const { RenderPass } = await import("three/examples/jsm/postprocessing/RenderPass.js");
      const { UnrealBloomPass } = await import("three/examples/jsm/postprocessing/UnrealBloomPass.js");
      const { ShaderPass } = await import("three/examples/jsm/postprocessing/ShaderPass.js");

      if (destroyed) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio, maxDevicePixelRatio);
      const col = parseColor(color);

      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Fullscreen quad material with FBM noise
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        precision mediump float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uTrail[${trailLength}];
        uniform int uTrailCount;
        uniform float uFade;
        uniform vec3 uColor;
        uniform float uBrightness;
        uniform float uGrainIntensity;
        uniform float uEdgeIntensity;

        // Simple hash/noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float sum = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 4; i++) {
            sum += noise(p) * amp;
            p *= 2.0;
            amp *= 0.5;
          }
          return sum;
        }

        void main() {
          vec2 uv = vUv;
          vec2 pixelCoord = uv * uResolution;
          float total = 0.0;

          for (int i = 0; i < ${trailLength}; i++) {
            if (i >= uTrailCount) break;
            vec2 trailPos = uTrail[i];
            if (trailPos.x < -900.0) continue;

            float dist = distance(pixelCoord, trailPos);
            float falloff = float(i) / float(uTrailCount);
            float radius = 60.0 * (1.0 - falloff * 0.5);
            float strength = smoothstep(radius, 0.0, dist) * (1.0 - falloff * 0.7);

            // Add noise distortion for smoky look
            vec2 noiseCoord = pixelCoord * 0.008 + uTime * 0.3;
            float n = fbm(noiseCoord + float(i) * 0.5);
            strength *= (0.6 + n * 0.8);

            total += strength;
          }

          total = clamp(total, 0.0, 1.0) * uBrightness * uFade;

          // Edge glow
          float edge = smoothstep(0.0, 0.3, total) - smoothstep(0.5, 1.0, total);
          total += edge * uEdgeIntensity;

          // Grain
          float grain = (hash(uv * uResolution + uTime * 100.0) - 0.5) * uGrainIntensity;

          vec3 col = uColor * total + grain;
          float alpha = total * 0.8;
          gl_FragColor = vec4(col, alpha);
        }
      `;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(w, h) },
          uTrail: { value: new Array(trailLength).fill(null).map(() => new THREE.Vector2(-1000, -1000)) },
          uTrailCount: { value: 0 },
          uFade: { value: 1.0 },
          uColor: { value: new THREE.Vector3(col.r, col.g, col.b) },
          uBrightness: { value: brightness },
          uGrainIntensity: { value: grainIntensity },
          uEdgeIntensity: { value: edgeIntensity },
        },
        transparent: true,
        depthTest: false,
      });
      materialRef.current = material;

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(quad);

      // Post-processing
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(w, h),
        bloomStrength,
        bloomRadius,
        bloomThreshold
      );
      composer.addPass(bloom);
      composerRef.current = composer;

      // Initialize trail
      trailRef.current = new Array(trailLength).fill(null).map(() => ({ x: -1000, y: -1000 }));

      // Animation loop
      const clock = new THREE.Clock();
      const animate = () => {
        if (destroyed) return;
        rafRef.current = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        const trail = trailRef.current;
        const mouse = mouseRef.current;

        // Update trail with inertia
        if (trail.length > 0) {
          trail[0].x += (mouse.x - trail[0].x) * (1 - inertia * 0.5);
          trail[0].y += (mouse.y - trail[0].y) * (1 - inertia * 0.5);

          for (let i = 1; i < trail.length; i++) {
            trail[i].x += (trail[i - 1].x - trail[i].x) * (1 - inertia);
            trail[i].y += (trail[i - 1].y - trail[i].y) * (1 - inertia);
          }
        }

        // Fade on inactivity
        const timeSinceMove = Date.now() - lastMoveRef.current;
        if (timeSinceMove > fadeDelayMs) {
          fadeRef.current = Math.max(0, fadeRef.current - (1 / 60) / (fadeDurationMs / 1000));
        } else {
          fadeRef.current = Math.min(1, fadeRef.current + (1 / 60) * 4);
        }

        // Update uniforms
        material.uniforms.uTime.value = elapsed;
        material.uniforms.uFade.value = fadeRef.current;

        const rect = container.getBoundingClientRect();
        for (let i = 0; i < trailLength; i++) {
          if (i < trail.length) {
            material.uniforms.uTrail.value[i].set(
              trail[i].x - rect.left,
              h - (trail[i].y - rect.top) // flip Y
            );
          }
        }
        material.uniforms.uTrailCount.value = trail.length;

        composer.render();
      };

      rafRef.current = requestAnimationFrame(animate);

      // Handle resize
      const onResize = () => {
        if (destroyed || !container) return;
        const nw = container.offsetWidth;
        const nh = container.offsetHeight;
        if (nw === 0 || nh === 0) return;
        renderer.setSize(nw, nh);
        composer.setSize(nw, nh);
        material.uniforms.uResolution.value.set(nw, nh);
      };

      const resizeObs = new ResizeObserver(onResize);
      resizeObs.observe(container);

      return () => {
        resizeObs.disconnect();
      };
    };

    const cleanup: Array<() => void> = [];
    init().then((c) => { if (c) cleanup.push(c); });

    // Mouse handlers
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMoveRef.current = Date.now();
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastMoveRef.current = Date.now();
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      cleanup.forEach((c) => c());
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [
    trailLength, inertia, grainIntensity, bloomStrength, bloomRadius,
    bloomThreshold, brightness, color, edgeIntensity, maxDevicePixelRatio,
    fadeDelayMs, fadeDurationMs, parseColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`ghost-cursor ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        mixBlendMode: mixBlendMode as any,
        ...style,
      }}
    />
  );
}

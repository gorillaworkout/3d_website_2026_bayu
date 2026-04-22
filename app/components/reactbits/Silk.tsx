"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

function SilkMesh({
  speed = 1,
  scale = 1,
  color = "#1a0a2e",
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  const meshRef = useRef<THREE.Mesh>(null);

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
    uniform float uScale;
    uniform float uNoiseIntensity;
    uniform float uRotation;
    uniform vec3 uColor;

    // Simplex-like noise
    vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
    vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x_) - 0.5;
      vec3 ox = floor(x_ + 0.5);
      vec3 a0 = x_ - ox;
      m *= 1.79284 - 0.85373 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      // Apply rotation
      float c = cos(uRotation);
      float s = sin(uRotation);
      vec2 center = vec2(0.5);
      uv = mat2(c, -s, s, c) * (uv - center) + center;

      // Multi-layered silk pattern
      float t = uTime * 0.3;
      vec2 p = uv * uScale * 3.0;

      float n1 = snoise(p + t) * uNoiseIntensity;
      float n2 = snoise(p * 2.0 - t * 0.7) * uNoiseIntensity * 0.5;
      float n3 = snoise(p * 4.0 + t * 0.3) * uNoiseIntensity * 0.25;

      float pattern = n1 + n2 + n3;

      // Create moiré/silk interference
      float silk1 = sin(uv.x * 40.0 + pattern * 3.0) * 0.5 + 0.5;
      float silk2 = sin(uv.y * 35.0 + pattern * 2.5 + t) * 0.5 + 0.5;
      float silk3 = sin((uv.x + uv.y) * 25.0 + pattern * 2.0) * 0.5 + 0.5;

      float silk = silk1 * silk2 * 0.5 + silk3 * 0.3;
      silk = smoothstep(0.15, 0.85, silk);

      // Color mixing
      vec3 col1 = uColor;
      vec3 col2 = uColor * 1.8 + vec3(0.05, 0.02, 0.1);
      vec3 col3 = uColor * 0.5;

      vec3 finalColor = mix(col1, col2, silk);
      finalColor = mix(finalColor, col3, smoothstep(0.6, 1.0, pattern * 0.3 + 0.5));

      // Subtle shimmer
      float shimmer = snoise(p * 8.0 + t * 2.0) * 0.05;
      finalColor += shimmer;

      // Vignette
      float vig = 1.0 - smoothstep(0.3, 1.4, length(vUv - 0.5) * 2.0);
      finalColor *= vig;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const uniforms = useMemo(() => {
    const parsed = new THREE.Color(color);
    return {
      uTime: { value: 0 },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
      uColor: { value: new THREE.Vector3(parsed.r, parsed.g, parsed.b) },
    };
  }, [scale, noiseIntensity, rotation, color]);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Silk(props: SilkProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: false }}
      camera={{ position: [0, 0, 1] }}
    >
      <SilkMesh {...props} />
    </Canvas>
  );
}

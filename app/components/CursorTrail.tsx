"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

// Reduced from 3000 to 150 for better performance
const MAX_PARTICLES = 150;

// Further reduce particles on low-end devices
const getMaxParticles = (): number => {
  // Check if we're on a low-end device
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  // deviceMemory might not be available in all browsers/environments
  const deviceMemory = (navigator as any).deviceMemory || 8; // GB

  // Reduce particles for low-end devices
  if (hardwareConcurrency <= 2 || deviceMemory <= 4) {
    return 80;
  }

  return MAX_PARTICLES;
};

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    // Create sprite once and reuse it
    let sprite = spriteRef.current;
    if (!sprite) {
      const spriteSize = 32;
      sprite = document.createElement("canvas");
      sprite.width = spriteSize;
      sprite.height = spriteSize;
      spriteRef.current = sprite;
      const spriteCtx = sprite.getContext("2d");
      if (!spriteCtx) return;
      const cx = spriteSize / 2;
      const cy = spriteSize / 2;
      const armLen = 13;
      const branchLen = 5;
      const branchPos = 7;
      spriteCtx.strokeStyle = "rgba(255,255,255,0.9)";
      spriteCtx.lineWidth = 1.5;
      spriteCtx.lineCap = "round";
      spriteCtx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        spriteCtx.moveTo(cx, cy);
        spriteCtx.lineTo(cx + Math.cos(angle) * armLen, cy + Math.sin(angle) * armLen);
      }
      spriteCtx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const bx = cx + Math.cos(angle) * branchPos;
        const by = cy + Math.sin(angle) * branchPos;
        for (const side of [-1, 1]) {
          const branchAngle = angle + (Math.PI / 3) * side;
          spriteCtx.beginPath();
          spriteCtx.moveTo(bx, by);
          spriteCtx.lineTo(bx + Math.cos(branchAngle) * branchLen, by + Math.sin(branchAngle) * branchLen);
          spriteCtx.stroke();
        }
      }
    }

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    let rafId = 0;
    let lastX = -1;
    let lastY = -1;
    let particles: Particle[] = [];

    const emit = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 0,
          maxLife: 40 + Math.random() * 40, // Reduced max life
          size: 0.5 + Math.random() * 1.5, // Reduced size range
        });
      }
      // Keep particle count bounded
      if (particles.length > getMaxParticles()) {
        particles.splice(0, particles.length - getMaxParticles());
      }
    };

    const onMove = (e: MouseEvent) => {
      const dist = lastX >= 0 && lastY >= 0 ? Math.hypot(e.clientX - lastX, e.clientY - lastY) : 0;
      lastX = e.clientX;
      lastY = e.clientY;
      if (dist > 1) {
        // Emit fewer particles based on movement speed
        emit(e.clientX, e.clientY, Math.min(5, Math.max(1, Math.round(dist / 10))));
      }
    };

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Update and render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Slightly more damping for smoother fade
        p.vy *= 0.96;
        const t = 1 - p.life / p.maxLife;
        const size = p.size * (0.5 + t * 1.5); // Adjusted size curve
        ctx.globalAlpha = t * 0.4; // Reduced opacity
        // Sprite is guaranteed to be non-null here because of the initialization above
        ctx.drawImage(sprite!, p.x - size, p.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
    };
    rafId = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[70]"
      aria-hidden
    />
  );
}
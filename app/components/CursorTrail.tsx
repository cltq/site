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

const MAX_PARTICLES = 3000;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastX = -1;
    let lastY = -1;
    let particles: Particle[] = [];

    const sprite = document.createElement("canvas");
    const spriteSize = 32;
    sprite.width = spriteSize;
    sprite.height = spriteSize;
    const spriteCtx = sprite.getContext("2d");
    if (!spriteCtx) return;
    const gradient = spriteCtx.createRadialGradient(
      spriteSize / 2,
      spriteSize / 2,
      0,
      spriteSize / 2,
      spriteSize / 2,
      spriteSize / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.25)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    spriteCtx.fillStyle = gradient;
    spriteCtx.fillRect(0, 0, spriteSize, spriteSize);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const emit = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 0,
          maxLife: 80 + Math.random() * 120,
          size: 1.5 + Math.random() * 4,
        });
      }
      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const onMove = (e: MouseEvent) => {
      const dist = lastX >= 0 && lastY >= 0 ? Math.hypot(e.clientX - lastX, e.clientY - lastY) : 0;
      lastX = e.clientX;
      lastY = e.clientY;
      emit(e.clientX, e.clientY, Math.max(3, Math.min(40, Math.round(dist / 1.5) + 3)));
    };

    const onDown = (e: MouseEvent) => emit(e.clientX, e.clientY, 50);

    const frame = () => {
      rafId = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        const t = 1 - p.life / p.maxLife;
        const size = p.size * (0.6 + t * 1.2);
        ctx.globalAlpha = t * 0.5;
        ctx.drawImage(sprite, p.x - size, p.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;
    };
    rafId = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
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

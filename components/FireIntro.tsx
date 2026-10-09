'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface FireIntroProps {
  onComplete: () => void;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function FireIntro({ onComplete }: FireIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDismissedRef = useRef(false);

  // Smooth cinematic dissolve exit into the restaurant homepage
  const handleDismiss = () => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    setFading(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  useEffect(() => {
    isDismissedRef.current = false;
    setFading(false);

    // Timeline progress ticker (Total 6.5s)
    const startTime = Date.now();
    const duration = 6500;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 97 && !isDismissedRef.current) {
        handleDismiss();
      }
    }, 40);

    // Setup High-DPI Canvas for 1440p / 4K razor-sharp particle sparks
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    }

    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle embers animation matching the fire bowls and lanterns
    const colors = ['#FFF8DC', '#FFE066', '#FFB703', '#FF7700', '#FF3B00', '#D4AF37'];
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const cvs = canvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          // 1. Embers rising from bottom-left fire bowl
          if (Math.random() < 0.35) {
            const bowlX = window.innerWidth * 0.12;
            sparksRef.current.push({
              x: bowlX + (Math.random() - 0.5) * 80,
              y: window.innerHeight * 0.92,
              vx: (Math.random() - 0.3) * 1.6,
              vy: -(2.0 + Math.random() * 3.5),
              size: 1.2 + Math.random() * 2.5,
              life: 1,
              maxLife: 1.4 + Math.random() * 1.8,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }

          // 2. Embers rising from bottom-right fire bowl
          if (Math.random() < 0.35) {
            const bowlX = window.innerWidth * 0.88;
            sparksRef.current.push({
              x: bowlX + (Math.random() - 0.5) * 80,
              y: window.innerHeight * 0.92,
              vx: (Math.random() - 0.7) * 1.6,
              vy: -(2.0 + Math.random() * 3.5),
              size: 1.2 + Math.random() * 2.5,
              life: 1,
              maxLife: 1.4 + Math.random() * 1.8,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }

          // 3. Ambient golden embers drifting across the center title
          if (Math.random() < 0.25) {
            sparksRef.current.push({
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              vx: (Math.random() - 0.5) * 1.4,
              vy: -(1.6 + Math.random() * 2.8),
              size: 1.0 + Math.random() * 2.0,
              life: 1,
              maxLife: 1.6 + Math.random() * 2.0,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }

          const aliveSparks: Spark[] = [];
          for (let i = 0; i < sparksRef.current.length; i++) {
            const sp = sparksRef.current[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.3 * dt;
            sp.vx *= 0.99;
            sp.life -= dt / sp.maxLife;

            if (sp.life > 0) {
              aliveSparks.push(sp);
              ctx.save();
              ctx.globalAlpha = Math.max(0, sp.life * 0.9);
              ctx.fillStyle = sp.color;
              ctx.shadowColor = sp.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          sparksRef.current = aliveSparks;
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameRef.current = requestAnimationFrame(renderLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(progressInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      id="arabian-intro-overlay"
      className={`fixed inset-0 z-[999999] bg-[#000000] select-none overflow-hidden flex items-center justify-center transition-all duration-700 ease-out ${
        fading
          ? 'opacity-0 scale-103 filter blur-md pointer-events-none'
          : 'opacity-100 scale-100 filter blur-0'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. DISCREET SKIP BUTTON (Top Right)
         ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/75 hover:bg-black text-[#fceda2] hover:text-white border border-[#d4af37]/45 hover:border-[#ffd700] shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-md transition-all duration-300 cursor-pointer text-xs font-bold tracking-widest uppercase"
        aria-label="Skip Intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#ffd700]" />
      </button>

      {/* ─────────────────────────────────────────────────────────────
          2. 100% INTROVID MATCH — 1440P / 4K MASTER CINEMATIC SCENE
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Master 4K Scene with Slow Cinematic Camera Push-In */}
        <img
          src="/images/arabian_intro_master.jpg"
          alt="S & H Arabian Mandi"
          className="w-full h-full max-w-[1500px] max-h-screen object-contain cinema-push-in"
          style={{
            imageRendering: 'crisp-edges',
          }}
        />

        {/* Ambient Warm Candle & Flame Light Pulse */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 animate-pulse"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(255,160,20,0.35) 0%, rgba(212,175,55,0.15) 40%, transparent 75%)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SUPERSAMPLED 1440P+ LIVE RISING FIRE EMBERS CANVAS
         ───────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* ─────────────────────────────────────────────────────────────
          4. SLEEK GOLD PROGRESS TIMELINE AT BOTTOM EDGE
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#ff7828] transition-all duration-75 ease-linear shadow-[0_0_15px_#ffd700]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. CINEMATIC CAMERA KEYFRAMES
         ───────────────────────────────────────────────────────────── */}
      <style jsx global>{`
        .cinema-push-in {
          animation: cameraPush 6.5s cubic-bezier(0.2, 0, 0.4, 1) forwards;
          will-change: transform;
        }

        @keyframes cameraPush {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

export const Wallpaper: React.FC = () => {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const appearance = useSettingsStore((s) => s.appearance);
  const isLight = appearance === 'light';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Controlled neutral node graph - understated and technical
    const particleCount = Math.min(Math.floor(width / 45), 32);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.2 + 0.8,
      baseAlpha: Math.random() * 0.15 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const nodeColor = isLight ? 'rgba(82, 82, 91,' : 'rgba(212, 212, 216,';

      if (wallpaper === 'cyber-mesh') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${nodeColor} ${p.baseAlpha})`;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * (isLight ? 0.08 : 0.06);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${nodeColor} ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      } else if (wallpaper === 'cosmic-grid') {
        // Perspective technical grid - clean and neutral
        const horizon = height * 0.65;
        const numLines = 10;
        const gridColor = isLight ? 'rgba(115, 115, 115,' : 'rgba(161, 161, 170,';

        const cx = width / 2;
        for (let i = -12; i <= 12; i++) {
          ctx.beginPath();
          ctx.moveTo(cx, horizon);
          ctx.lineTo(cx + i * (width / 12), height);
          ctx.strokeStyle = `${gridColor} ${isLight ? 0.05 : 0.04})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        for (let i = 1; i <= numLines; i++) {
          const progress = Math.pow(i / numLines, 2);
          const y = horizon + progress * (height - horizon);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.strokeStyle = `${gridColor} ${0.02 + progress * (isLight ? 0.06 : 0.05)})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [wallpaper, isLight]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-300">
      {/* Dark & Light Wallpaper Bases */}
      {wallpaper === 'cyber-mesh' && (
        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-[#F7F7F5] bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03),transparent_70%)]'
              : 'bg-[#0A0A0A] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]'
          }`}
        />
      )}

      {wallpaper === 'aurora' && (
        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-[#F7F7F5] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,0,0,0.04),transparent_80%)]'
              : 'bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.04),transparent_80%)]'
          }`}
        />
      )}

      {wallpaper === 'cosmic-grid' && (
        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-[#F7F7F5]'
              : 'bg-[#0A0A0A]'
          }`}
        />
      )}

      {wallpaper === 'minimalist' && (
        <div
          className={`absolute inset-0 ${
            isLight
              ? 'bg-[#F7F7F5]'
              : 'bg-[#0A0A0A]'
          }`}
        />
      )}

      {/* Subtle Micro-Grid Overlay */}
      <div
        className={`absolute inset-0 bg-[size:32px_32px] ${
          isLight
            ? 'bg-[radial-gradient(#17171708_1px,transparent_1px)]'
            : 'bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]'
        }`}
      />

      {/* Canvas for fine technical lines */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Watermark in background */}
      <div className="absolute bottom-16 right-8 text-right select-none opacity-20 pointer-events-none hidden md:block">
        <div className="text-3xl font-mono font-bold tracking-tight text-txt-muted">
          SUJITH OS
        </div>
        <div className="text-[11px] font-mono tracking-widest uppercase mt-0.5 text-txt-muted">
          v2.0 &bull; Workstation
        </div>
      </div>
    </div>
  );
};

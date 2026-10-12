import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { workspaceSound } from '../../utils/workspaceAudio';

interface WorkspaceArtisticLoaderProps {
  onComplete: () => void;
}

export const WorkspaceArtisticLoader: React.FC<WorkspaceArtisticLoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalSvgRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasDispatchedArrival = false;

    const triggerCameraArrival = () => {
      if (!hasDispatchedArrival) {
        hasDispatchedArrival = true;
        window.dispatchEvent(new CustomEvent('sujith_workspace_arrival'));
      }
    };

    const tl = gsap.timeline({
      onComplete: () => {
        triggerCameraArrival();
        onComplete();
      },
    });

    const counterObj = { value: 0 };
    const statusMessages = [
      'CALIBRATING PERSPECTIVE',
      'DRAFTING STUDIO ARCHITECTURE',
      'ILLUMINATING ENVIRONMENT',
      'ENTER STUDIO',
    ];

    if (prefersReducedMotion) {
      triggerCameraArrival();
      tl.to(counterObj, {
        value: 100,
        duration: 0.35,
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.value).toString().padStart(2, '0');
          }
        },
      }).to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      return () => {
        tl.kill();
      };
    }

    // 1. Pre-paint initial state setup
    gsap.set('.hex-outline-path', { strokeDasharray: 960, strokeDashoffset: 960 });
    gsap.set('.trestle-path', { strokeDasharray: 400, strokeDashoffset: 400 });
    gsap.set('.aperture-path', { strokeDasharray: 600, strokeDashoffset: 600 });
    gsap.set('.portal-facet', { opacity: 0, scale: 0.96, transformOrigin: 'center center' });
    gsap.set('.vertex-dot', { scale: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(brandRef.current, { opacity: 0, y: 12 });

    // 2. Phase 1: Precision architectural drafting
    tl.to(
      '.vertex-dot',
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.out',
      },
      0.05
    );

    tl.to(
      '.hex-outline-path',
      {
        strokeDashoffset: 0,
        duration: 1.05,
        ease: 'power3.inOut',
      },
      0.1
    );

    tl.to(
      '.trestle-path',
      {
        strokeDashoffset: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
      },
      0.4
    );

    tl.to(
      counterObj,
      {
        value: 52,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.value).toString().padStart(2, '0');
          }
        },
      },
      0.1
    );

    tl.call(
      () => {
        if (statusRef.current) statusRef.current.innerText = statusMessages[1];
      },
      [],
      0.55
    );

    // 3. Phase 2: Spatial planes & threshold doorway
    tl.to(
      '.portal-facet',
      {
        opacity: 0.85,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0.75
    );

    tl.to(
      '.aperture-path',
      {
        strokeDashoffset: 0,
        duration: 0.75,
        stagger: 0.06,
        ease: 'power3.out',
      },
      0.9
    );

    tl.call(
      () => {
        if (statusRef.current) statusRef.current.innerText = statusMessages[2];
      },
      [],
      1.15
    );

    tl.to(
      counterObj,
      {
        value: 100,
        duration: 0.75,
        ease: 'expo.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.value).toString().padStart(2, '0');
          }
        },
      },
      1.0
    );

    tl.to(
      brandRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
      },
      1.35
    );

    tl.call(
      () => {
        if (statusRef.current) statusRef.current.innerText = statusMessages[3];
        workspaceSound.playResolveChime();
      },
      [],
      1.65
    );

    // 4. Phase 3: Seamless Camera Handoff & Portal Iris Transition into the 3D Studio
    tl.call(triggerCameraArrival, [], 1.95);

    tl.to(
      portalSvgRef.current,
      {
        scale: 2.35,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.inOut',
      },
      1.95
    );

    tl.to(
      brandRef.current,
      {
        opacity: 0,
        y: -8,
        duration: 0.4,
        ease: 'power2.in',
      },
      1.95
    );

    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      },
      2.05
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerCameraArrival();
        tl.progress(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const safetyTimer = setTimeout(() => {
      triggerCameraArrival();
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
    };
  }, [onComplete]);

  const handleSkip = () => {
    window.dispatchEvent(new CustomEvent('sujith_workspace_arrival'));
    workspaceSound.playHover();
    onComplete();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#07080c] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
      }}
    >
      {/* Top Architectural Frame */}
      <header className="flex items-start justify-between text-xs font-mono tracking-wider">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-zinc-200 font-semibold tracking-[0.2em]">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span>SUJITH K</span>
          </div>
          <p className="text-[10px] tracking-[0.22em] text-zinc-500">
            FULL STACK DEVELOPER // KERALA, IN
          </p>
        </div>

        <div className="text-right space-y-1 hidden sm:block">
          <div className="text-[10px] tracking-[0.24em] text-zinc-400">
            EDITION // 2026
          </div>
          <div className="text-[10px] tracking-[0.2em] text-zinc-600">
            11.2588° N · 75.7804° E
          </div>
        </div>
      </header>

      {/* Centerpiece: Isometric Studio Portal */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
        <svg
          ref={portalSvgRef}
          viewBox="0 0 400 400"
          className="w-60 h-60 sm:w-72 sm:h-72 relative z-10 overflow-visible will-change-transform"
        >
          <defs>
            <linearGradient id="facetWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#181b24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0e1017" stopOpacity="0.96" />
            </linearGradient>

            <linearGradient id="facetFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#261b14" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#140f0c" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Left Wall Facet */}
          <polygon
            className="portal-facet"
            points="200,60 80,130 80,270 200,200"
            fill="url(#facetWallGrad)"
            stroke="#272c3a"
            strokeWidth="1"
          />

          {/* Floor Facet */}
          <polygon
            className="portal-facet"
            points="200,200 80,270 200,340 320,270"
            fill="url(#facetFloorGrad)"
            stroke="#36261d"
            strokeWidth="1"
          />

          {/* Right Wall Facet */}
          <polygon
            className="portal-facet"
            points="200,60 320,130 320,270 200,200"
            fill="url(#facetWallGrad)"
            stroke="#272c3a"
            strokeWidth="1"
          />

          {/* Inner Portal Doorway Cutout */}
          <polygon
            className="portal-facet"
            points="200,105 270,145 270,240 200,200"
            fill="#07080c"
            stroke="#f59e0b"
            strokeWidth="1.4"
            strokeOpacity="0.7"
          />

          {/* Outer Isometric Perimeter */}
          <path
            className="hex-outline-path"
            d="M200,50 L330,125 L330,275 L200,350 L70,275 L70,125 Z"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Structural Axis Lines */}
          <path
            className="trestle-path"
            d="M200,50 L200,350"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            className="trestle-path"
            d="M70,125 L330,275"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
          />
          <path
            className="trestle-path"
            d="M330,125 L70,275"
            fill="none"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Precision Aperture Ring */}
          <g>
            <circle
              className="aperture-path"
              cx="200"
              cy="200"
              r="38"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeOpacity="0.65"
            />
            <circle
              className="aperture-path"
              cx="200"
              cy="200"
              r="24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
          </g>

          {/* Vertex Registration Points */}
          <circle className="vertex-dot" cx="200" cy="50" r="2.5" fill="#f59e0b" />
          <circle className="vertex-dot" cx="330" cy="125" r="2.5" fill="#f59e0b" />
          <circle className="vertex-dot" cx="330" cy="275" r="2.5" fill="#f59e0b" />
          <circle className="vertex-dot" cx="200" cy="350" r="2.5" fill="#f59e0b" />
          <circle className="vertex-dot" cx="70" cy="275" r="2.5" fill="#f59e0b" />
          <circle className="vertex-dot" cx="70" cy="125" r="2.5" fill="#f59e0b" />
        </svg>

        {/* Minimal Typographic Signature */}
        <div ref={brandRef} className="text-center mt-5">
          <div className="text-sm sm:text-base font-mono tracking-[0.28em] text-zinc-200 uppercase">
            SUJITH K <span className="text-amber-400/80 mx-1.5">/</span> STUDIO ENVIRONMENT
          </div>
        </div>
      </div>

      {/* Footer Status & Numerical Progress */}
      <footer className="flex items-end justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-amber-400" />
          <div ref={statusRef} className="text-zinc-400 tracking-[0.22em] text-[10px] sm:text-[11px]">
            CALIBRATING PERSPECTIVE
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right tabular-nums">
            <span
              ref={counterRef}
              className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tracking-tighter"
            >
              00
            </span>
            <span className="text-xs text-amber-400/90 font-mono ml-1">%</span>
          </div>

          <button
            onClick={handleSkip}
            className="px-3 py-1.5 rounded border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-zinc-200 text-[10px] tracking-[0.2em] transition-colors cursor-pointer"
          >
            SKIP
          </button>
        </div>
      </footer>
    </div>
  );
};

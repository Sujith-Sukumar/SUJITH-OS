import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Cpu, Database, Globe, Layers, Zap } from 'lucide-react';
import { skillsData } from '../../../data/skills';
import { workspaceSound } from '../../../utils/workspaceAudio';

gsap.registerPlugin(ScrollTrigger);

interface SkillsRoomProps {
  onReturn: () => void;
}

const categoryIcons: Record<string, React.FC<any>> = {
  'frontend': Globe,
  'backend': Database,
  'core': Cpu,
  'tools': Layers,
};

const CIRCUMFERENCE = 251.2; // 2 * Math.PI * 40

const SkillsRoom: React.FC<SkillsRoomProps> = ({ onReturn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    workspaceSound.playOpen();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.skill-group-header, .skill-card-node', { opacity: 1, y: 0, scale: 1 });
        gsap.set('.connection-line', { scaleX: 1, opacity: 0.5 });
        return;
      }

      // Subtle ambient background pulse (GPU opacity only)
      gsap.to('.grid-bg', {
        opacity: 0.14,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Set clean initial states before browser paint to prevent any flash or jump
      const groups = groupRefs.current.filter(Boolean) as HTMLDivElement[];

      groups.forEach((groupEl) => {
        const header = groupEl.querySelector('.skill-group-header');
        const cards = groupEl.querySelectorAll('.skill-card-node');
        const lines = groupEl.querySelectorAll('.connection-line');
        const circles = groupEl.querySelectorAll<SVGCircleElement>('.skill-progress-ring');

        if (header) {
          gsap.set(header, { opacity: 0, y: 16, force3D: true });
        }
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 20, scale: 0.96, force3D: true });
        }
        if (lines.length) {
          gsap.set(lines, { scaleX: 0, opacity: 0, transformOrigin: 'left center', force3D: true });
        }
        circles.forEach((circle) => {
          gsap.set(circle, { strokeDashoffset: CIRCUMFERENCE });
        });
      });

      // Sequenced, scroll-triggered reveal per category group (runs once, never restarts)
      groups.forEach((groupEl, groupIdx) => {
        const header = groupEl.querySelector('.skill-group-header');
        const cards = groupEl.querySelectorAll('.skill-card-node');
        const lines = groupEl.querySelectorAll('.connection-line');
        const circles = groupEl.querySelectorAll<SVGCircleElement>('.skill-progress-ring');

        // Small initial cascade only for groups already in the initial viewport
        const initialDelay = groupIdx < 2 ? 0.08 + groupIdx * 0.12 : 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: groupEl,
            scroller: scroller,
            start: 'top 88%',
            once: true,
          },
          delay: initialDelay,
        });

        if (header) {
          tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            clearProps: 'transform',
          });
        }

        if (cards.length) {
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.045,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            '-=0.38'
          );
        }

        if (lines.length) {
          tl.to(
            lines,
            {
              scaleX: 1,
              opacity: 0.5,
              duration: 0.5,
              stagger: 0.04,
              ease: 'power2.out',
            },
            '-=0.52'
          );
        }

        if (circles.length) {
          tl.to(
            circles,
            {
              strokeDashoffset: (_i, target: SVGCircleElement) => {
                const targetOffset = parseFloat(target.dataset.targetOffset || '0');
                return targetOffset;
              },
              duration: 1.05,
              stagger: 0.045,
              ease: 'expo.out',
            },
            '-=0.55'
          );
        }
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleReturn = () => {
    workspaceSound.playClose();
    onReturn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden"
      ref={containerRef}
    >
      {/* Circuit Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]" />
      <div className="grid-bg absolute inset-0 z-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MFYweiIvPjwvZz48L3N2Zz4=')] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)] will-change-[opacity]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-emerald-500/20 bg-slate-950/70 backdrop-blur-md">
        <button
          onClick={handleReturn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO NEXUS
        </button>
        <div className="text-right">
          <div className="text-xs font-mono text-emerald-400/70">ROOM 03</div>
          <h1 className="text-xl font-bold tracking-wider text-emerald-400">NEURAL_NET</h1>
        </div>
      </div>

      {/* Content */}
      <div ref={scrollerRef} className="relative z-10 flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {skillsData.map((categoryGroup, groupIdx) => {
            const Icon = categoryIcons[categoryGroup.category.toLowerCase()] || Zap;

            return (
              <div
                key={categoryGroup.code}
                ref={(el) => {
                  groupRefs.current[groupIdx] = el;
                }}
                className="relative"
              >
                {/* Category Header Node */}
                <div className="skill-group-header flex items-center gap-4 mb-8 will-change-[transform,opacity]">
                  <div className="w-12 h-12 rounded-lg bg-emerald-900/40 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] relative z-10">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white capitalize">{categoryGroup.category}</h2>
                    <div className="text-sm font-mono text-emerald-500/70">
                      {categoryGroup.code} // {categoryGroup.status}
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pl-6 border-l border-emerald-500/20 py-4 ml-6 relative">
                  {categoryGroup.skills.map((skill) => {
                    const targetOffset = CIRCUMFERENCE - (CIRCUMFERENCE * skill.level) / 100;

                    return (
                      <div
                        key={skill.name}
                        className="skill-card-node group relative flex flex-col items-center p-4 rounded-xl border border-emerald-500/10 bg-slate-900/60 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-[background-color,border-color,box-shadow] duration-300 will-change-[transform,opacity]"
                      >
                        {/* Connecting Line from border */}
                        <div className="connection-line absolute top-1/2 -left-6 w-6 h-px bg-emerald-500/40 origin-left will-change-[transform,opacity]" />

                        {/* Radial Progress */}
                        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              className="stroke-slate-800"
                              strokeWidth="6"
                              fill="none"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              className="skill-progress-ring stroke-emerald-500"
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={CIRCUMFERENCE}
                              strokeDashoffset={targetOffset}
                              data-target-offset={targetOffset}
                              style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-emerald-400">{skill.level}</span>
                            <span className="text-[9px] font-mono text-emerald-500/60">LVL</span>
                          </div>
                        </div>

                        <h3 className="text-center font-medium text-slate-200 text-sm">{skill.name}</h3>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-slate-800 text-xs text-emerald-200 rounded border border-emerald-500/30 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-200 ease-out pointer-events-none z-20 shadow-xl">
                          <div>EXP: {skill.yearsExperience} YRS</div>
                          <div className="font-mono text-emerald-500/80">{skill.statusText}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export { SkillsRoom };
export default SkillsRoom;

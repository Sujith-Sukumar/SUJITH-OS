import React, { useState } from 'react';
import { portfolioConfig } from '../../data/portfolioData';
import { useWindowStore } from '../../store/windowStore';
import {
  FileText,
  Send,
  Terminal,
  ArrowUpRight,
  Compass,
  Layers,
  Cpu,
  Sparkles,
} from 'lucide-react';

type ChapterKey = 'who' | 'journey' | 'craft' | 'mindset';

const CHAPTERS: { key: ChapterKey; index: string; label: string }[] = [
  { key: 'who', index: '01', label: 'WHO I AM' },
  { key: 'journey', index: '02', label: 'MY JOURNEY' },
  { key: 'craft', index: '03', label: 'MY CRAFT' },
  { key: 'mindset', index: '04', label: 'MY MINDSET' },
];

export const AboutApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const { personal } = portfolioConfig;
  const [activeChapter, setActiveChapter] = useState<ChapterKey>('who');
  const [focusedStack, setFocusedStack] = useState<number>(0);

  const stackLayers = [
    {
      name: 'React.js',
      role: 'UI & State',
      detail: 'Modular component systems, custom hooks, and responsive interfaces.',
    },
    {
      name: 'Next.js',
      role: 'Full-Stack React',
      detail: 'Server Components, SSR/ISR rendering, and production performance.',
    },
    {
      name: 'Node.js',
      role: 'Server Runtime',
      detail: 'Non-blocking backend services and real-time WebSocket pipelines.',
    },
    {
      name: 'Express.js',
      role: 'REST API Layer',
      detail: 'Clean controllers, JWT authentication, and RBAC security middleware.',
    },
    {
      name: 'MongoDB',
      role: 'Document Data',
      detail: 'Scalable Mongoose schemas, compound indexing, and fast aggregations.',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#07080c] text-zinc-100 overflow-y-auto selection:bg-amber-400/20 selection:text-amber-200">
      {/* Top Bar */}
      <div className="shrink-0 px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#07080c]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
          <span className="font-mono text-[10px] tracking-[0.24em] text-zinc-300 uppercase">
            {personal.fullName} // DOSSIER
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1">
          {CHAPTERS.map((tab) => {
            const active = activeChapter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveChapter(tab.key)}
                className={`px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.16em] transition-all ${
                  active
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="opacity-60 mr-1">{tab.index}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 max-w-3xl mx-auto w-full flex flex-col justify-between">
        {activeChapter === 'who' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-amber-300 uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>01 / WHO I AM</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {personal.fullName}
              <span className="block text-lg sm:text-xl text-zinc-400 font-normal mt-1">
                Full Stack Developer
              </span>
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
              Based in {personal.location} with {personal.experienceYears} of experience building
              modern web applications across the MERN &amp; Next.js stack.
            </p>

            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-5 max-w-md">
              <div>
                <div className="font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                  EXPERIENCE
                </div>
                <div className="mt-1 font-display text-lg font-bold text-white">
                  {personal.experienceYears}
                </div>
              </div>
              <div className="border-l border-white/10 pl-4">
                <div className="font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                  STACK
                </div>
                <div className="mt-1 font-display text-lg font-bold text-white">MERN + Next</div>
              </div>
              <div className="border-l border-white/10 pl-4">
                <div className="font-mono text-[9px] tracking-[0.22em] text-zinc-500 uppercase">
                  LOCATION
                </div>
                <div className="mt-1 font-display text-lg font-bold text-white">
                  {personal.location}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeChapter === 'journey' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-amber-300 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 / MY JOURNEY</span>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              <div className="py-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-amber-300">
                  <span>MAY 2025 — PRESENT</span>
                  <span>ESTA ENTERPRISES · KOZHIKODE</span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-white">
                  Full Stack Developer
                </h3>
                <p className="mt-1 text-xs text-zinc-300">
                  Architecting and scaling end-to-end production platforms and enterprise systems.
                </p>
              </div>

              <div className="py-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-zinc-400">
                  <span>DEC 2024 — MAY 2025</span>
                  <span>SECLOB TECHNOLOGIES · KOZHIKODE</span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-white">
                  Full Stack Developer Intern
                </h3>
                <p className="mt-1 text-xs text-zinc-300">
                  Built production React interfaces and modular REST APIs in agile sprints.
                </p>
              </div>

              <div className="py-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-zinc-400">
                  <span>EDUCATION</span>
                  <span>CALICUT UNIVERSITY · KERALA</span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-white">
                  Computer Science Foundation
                </h3>
                <p className="mt-1 text-xs text-zinc-300">
                  Core grounding in algorithms, data structures, and software engineering.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeChapter === 'craft' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-amber-300 uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>03 / MY CRAFT</span>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {stackLayers.map((layer, idx) => {
                const isFocused = focusedStack === idx;
                return (
                  <div
                    key={layer.name}
                    onMouseEnter={() => setFocusedStack(idx)}
                    onClick={() => setFocusedStack(idx)}
                    className={`py-3 cursor-pointer transition-all ${
                      isFocused ? 'pl-3 border-l-2 border-amber-400 bg-amber-400/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-white">
                        {layer.name}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-amber-300/80 uppercase">
                        {layer.role}
                      </span>
                    </div>
                    {isFocused && (
                      <p className="mt-1 text-xs text-zinc-300">{layer.detail}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeChapter === 'mindset' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-amber-300 uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>04 / MY MINDSET</span>
            </div>

            <div className="space-y-4 border-l-2 border-amber-400/50 pl-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-amber-300 uppercase">
                  01 // SOLVE REAL PROBLEMS
                </div>
                <p className="mt-0.5 text-xs text-zinc-300">
                  Focusing on user bottlenecks and clean architecture over unnecessary complexity.
                </p>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-amber-300 uppercase">
                  02 // RELENTLESS CURIOSITY
                </div>
                <p className="mt-0.5 text-xs text-zinc-300">
                  Continuously exploring modern frameworks, system design, and web performance.
                </p>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-amber-300 uppercase">
                  03 // USEFUL DIGITAL EXPERIENCES
                </div>
                <p className="mt-0.5 text-xs text-zinc-300">
                  Crafting fast, intuitive software that feels effortless and reliable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openWindow('contact')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-amber-400/25 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>CONTACT</span>
            </button>
            <button
              onClick={() => openWindow('resume')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-200 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-white/[0.08] transition-colors"
            >
              <FileText className="w-3 h-3 text-zinc-400" />
              <span>CV</span>
            </button>
          </div>

          <button
            onClick={() => openWindow('terminal')}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-zinc-400 hover:text-amber-300 transition-colors"
          >
            <Terminal className="w-3 h-3" />
            <span>TERMINAL</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

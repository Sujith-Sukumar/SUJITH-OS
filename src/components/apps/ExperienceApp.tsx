import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experienceData } from '../../data/experience';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const ExperienceApp: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    playSystemSound('click');
  };

  const activeExp = experienceData[activeIndex];

  return (
    <div className="h-full flex flex-col justify-between bg-[#06060a] text-white overflow-y-auto select-none relative font-sans">
      {/* Subtle Architectural Perspective Lines */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.14),transparent_60%)]" />

      {/* Top Chapter Selector Strip */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-purple-300 uppercase">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>CAREER ODYSSEY // 2024 — PRESENT</span>
        </div>

        <div className="flex items-center gap-6">
          {experienceData.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id || idx}
                onClick={() => handleSelect(idx)}
                className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
              >
                <span
                  className={`text-xs font-mono transition-colors ${
                    isSelected ? 'text-purple-400 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {item.chapterNumber}
                </span>
                <span
                  className={`text-xs font-mono tracking-[0.15em] uppercase transition-colors ${
                    isSelected ? 'text-white font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {item.company}
                </span>
                <span
                  className={`h-[1.5px] transition-all duration-300 ${
                    isSelected ? 'w-6 bg-purple-400' : 'w-0 bg-transparent group-hover:w-3 group-hover:bg-zinc-600'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Editorial Stage */}
      <div className="relative z-10 flex-1 flex items-center px-6 sm:px-12 py-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExp.id || activeIndex}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mx-auto relative"
          >
            {/* Giant Hollow Watermark Numeral */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-2 -top-10 text-[clamp(8rem,20vw,15rem)] font-black font-mono leading-none text-transparent opacity-25"
              style={{ WebkitTextStroke: '1.5px rgba(168, 85, 247, 0.45)' }}
            >
              {activeExp.chapterNumber}
            </div>

            <div className="relative z-10 space-y-7">
              {/* Employment Dates */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/35 text-xs font-mono font-semibold tracking-[0.2em] text-purple-200 uppercase">
                  {activeExp.period}
                </span>
                <span className="h-px w-8 bg-purple-500/40" />
                <span className="text-[11px] font-mono tracking-[0.22em] text-zinc-400 uppercase">
                  CHAPTER {activeExp.chapterNumber}
                </span>
              </div>

              {/* Role Title & Company + Location */}
              <div className="space-y-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white leading-tight">
                  {activeExp.role}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  <span className="text-lg sm:text-2xl font-mono font-bold text-purple-300">
                    {activeExp.company}
                  </span>
                  <span className="text-zinc-600 font-mono">/</span>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{activeExp.location}</span>
                  </span>
                </div>
              </div>

              {/* Minimal 2-Highlight Architectural Ledger */}
              <div className="pt-3 border-t border-white/15 divide-y divide-white/10 max-w-2xl">
                {activeExp.responsibilities.slice(0, 2).map((resp, i) => (
                  <div key={i} className="py-4 flex items-baseline gap-5">
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-purple-400 shrink-0">
                      0{i + 1} /
                    </span>
                    <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed">
                      {resp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Chapter Switcher Bar */}
      <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>{activeExp.systemLogCode}</span>
        <button
          onClick={() => handleSelect((activeIndex + 1) % experienceData.length)}
          className="inline-flex items-center gap-1.5 text-purple-300 hover:text-white transition-colors cursor-pointer uppercase tracking-[0.2em]"
        >
          <span>
            Switch to Chapter {experienceData[(activeIndex + 1) % experienceData.length].chapterNumber}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

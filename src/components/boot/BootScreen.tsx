import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Terminal } from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

interface BootScreenProps {
  onEnter: () => void;
}

const BOOT_ITEMS = [
  'React 19 Core Framework',
  'TypeScript Type Safety Engine',
  'Node.js & Express Micro-architecture',
  'MongoDB Schema Persistence',
  'Production Repositories & Architecture',
  'Professional Experience Timelines',
  'System Telemetry & Window Manager',
];

export const BootScreen: React.FC<BootScreenProps> = ({ onEnter }) => {
  const [completedIndex, setCompletedIndex] = useState<number>(0);
  const [isSystemReady, setIsSystemReady] = useState<boolean>(false);

  useEffect(() => {
    if (completedIndex < BOOT_ITEMS.length) {
      const timer = setTimeout(() => {
        setCompletedIndex((prev) => prev + 1);
      }, 160);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsSystemReady(true);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [completedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnter = () => {
    playSystemSound('boot');
    onEnter();
  };

  const handleSkip = () => {
    playSystemSound('click');
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center p-6 text-txt-primary select-none overflow-hidden transition-colors duration-200">
      {/* Top right Skip button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border text-txt-secondary hover:text-txt-primary text-xs font-mono transition-colors flex items-center gap-1.5"
        >
          <span>Skip Boot</span>
          <span className="text-[10px] text-txt-muted">[Esc / Click]</span>
        </button>
      </div>

      {/* Center Console Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md rounded-xl bg-surface border border-border p-6 sm:p-7 shadow-os-elevated flex flex-col"
      >
        {/* Brand Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-border flex items-center justify-center font-mono font-bold text-txt-primary text-base">
              SO
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-txt-primary">
                SUJITH OS
              </h1>
              <div className="text-[11px] font-mono text-txt-muted tracking-tight">
                v2.0 &bull; Developer Workstation
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary border border-border text-txt-muted">
              BUILD 2026.10
            </span>
          </div>
        </div>

        {/* Initialization Checklist */}
        <div className="mb-5 space-y-2">
          <div className="text-xs font-mono text-txt-muted mb-2.5 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-txt-secondary" />
            <span>INITIALIZING SUBSYSTEMS...</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {BOOT_ITEMS.map((item, idx) => {
              const isChecked = idx < completedIndex;
              const isCurrent = idx === completedIndex;

              return (
                <div
                  key={item}
                  className={`flex items-center gap-2.5 transition-all duration-150 ${
                    isChecked
                      ? 'text-txt-primary'
                      : isCurrent
                      ? 'text-txt-primary font-semibold'
                      : 'text-txt-muted opacity-40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-surface-secondary text-txt-primary border border-border'
                        : isCurrent
                        ? 'bg-surface-secondary text-txt-primary border border-border animate-pulse'
                        : 'bg-surface-secondary text-transparent border border-border-subtle'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="tracking-tight">{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Progress Bar */}
        <div className="mb-5">
          <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden border border-border-subtle">
            <motion.div
              className="h-full bg-txt-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(completedIndex / BOOT_ITEMS.length) * 100}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-txt-muted mt-1.5">
            <span>READY STATE</span>
            <span>
              {isSystemReady ? '100% COMPLETE' : `${Math.round((completedIndex / BOOT_ITEMS.length) * 100)}%`}
            </span>
          </div>
        </div>

        {/* Status Callout & Enter Button */}
        <div>
          {isSystemReady ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleEnter}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-txt-primary text-bg font-semibold text-xs tracking-tight transition-all shadow-sm"
            >
              <span>ENTER WORKSTATION</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="w-full py-3 text-center text-xs font-mono text-txt-muted bg-surface-secondary rounded-lg border border-border flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-txt-secondary animate-ping" />
              <span>PREPARING ENVIRONMENT...</span>
            </div>
          )}
        </div>

        <div className="mt-3.5 text-center text-[11px] font-mono text-txt-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border text-txt-secondary text-[10px]">Enter ↵</kbd> to launch
        </div>
      </motion.div>
    </div>
  );
};

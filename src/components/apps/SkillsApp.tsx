import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { skillsData, generateBlockBar } from '../../data/skills';
import {
  Cpu,
  Info
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SkillsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const prefersReducedMotion = useReducedMotion();

  const filteredGroups = useMemo(
    () =>
      selectedCategory === 'all'
        ? skillsData
        : skillsData.filter((group) =>
            group.category.toLowerCase().includes(selectedCategory.toLowerCase())
          ),
    [selectedCategory]
  );

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    playSystemSound('click');
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto text-txt-primary bg-surface font-mono select-none">
      {/* Diagnostics Header & Telemetry Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-txt-muted" />
            <h1 className="text-base font-semibold tracking-tight text-txt-primary uppercase font-sans">
              SYSTEM DIAGNOSTICS & TELEMETRY
            </h1>
          </div>
          <p className="text-xs text-txt-muted mt-0.5">
            Kernel Stack: MERN (React 19 / Node.js 22 / Express / MongoDB)
          </p>
        </div>

        {/* Live system state chips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-txt-secondary text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            <span>SUBSYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
        {[
          { id: 'all', label: 'ALL SUBSYSTEMS' },
          { id: 'frontend', label: 'FRONTEND' },
          { id: 'backend', label: 'BACKEND' },
          { id: 'database', label: 'DATABASE' },
          { id: 'cloud', label: 'CLOUD & TOOLS' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id)}
            className={`px-2.5 py-1 rounded-md text-xs transition-colors duration-200 whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-txt-primary text-bg font-semibold'
                : 'bg-surface-secondary text-txt-secondary hover:text-txt-primary border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Diagnostics Grid of Subsystem Modules */}
      <div className="space-y-4 flex-1">
        {filteredGroups.map((group, groupIdx) => (
          <motion.div
            key={group.code}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.42,
              delay: prefersReducedMotion ? 0 : groupIdx * 0.06,
              ease: EASE_OUT_EXPO,
            }}
            className="p-3.5 rounded-lg bg-surface-secondary border border-border will-change-[transform,opacity]"
          >
            {/* Subsystem header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border-subtle text-xs">
              <div className="flex items-center gap-2">
                <span className="text-txt-primary font-bold">{group.code}</span>
                <span className="text-txt-muted">//</span>
                <span className="font-sans font-semibold text-txt-primary tracking-wide">
                  {group.category.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface text-txt-muted border border-border">
                {group.status}
              </span>
            </div>

            {/* Diagnostic Meter Rows */}
            <div className="space-y-2">
              {group.skills.map((skill, skillIdx) => {
                const blockBar = generateBlockBar(skill.level, 20);

                return (
                  <motion.div
                    key={skill.name}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.36,
                      delay: prefersReducedMotion ? 0 : groupIdx * 0.06 + skillIdx * 0.03,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="p-2 rounded-md bg-surface border border-border-subtle hover:border-border transition-colors duration-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs will-change-[transform,opacity]"
                  >
                    {/* Left: Skill Name */}
                    <div className="flex items-center gap-2 min-w-[190px]">
                      <span className="w-1 h-1 rounded-full bg-txt-muted" />
                      <span className="font-sans font-medium text-txt-primary">{skill.name}</span>
                      <span className="text-[10px] text-txt-muted ml-auto md:ml-0 font-mono">
                        {skill.yearsExperience}
                      </span>
                    </div>

                    {/* Center: ASCII Diagnostic Block Meter */}
                    <div className="flex items-center gap-2.5 flex-1 max-w-md">
                      <span className="text-txt-primary tracking-tighter text-[11px] select-all font-mono opacity-80">
                        {blockBar}
                      </span>
                      {/* Subtle thin neutral progress bar using GPU transform scaleX */}
                      <div className="flex-1 h-1 bg-surface-secondary rounded-full overflow-hidden hidden sm:block">
                        <motion.div
                          initial={prefersReducedMotion ? false : { scaleX: 0 }}
                          animate={{ scaleX: skill.level / 100 }}
                          transition={{
                            duration: 0.65,
                            delay: prefersReducedMotion ? 0 : groupIdx * 0.06 + skillIdx * 0.03 + 0.08,
                            ease: EASE_OUT_EXPO,
                          }}
                          style={{ transformOrigin: 'left center' }}
                          className="h-full w-full bg-txt-secondary rounded-full will-change-transform"
                        />
                      </div>
                    </div>

                    {/* Right: Telemetry label */}
                    <div className="text-[11px] text-txt-muted text-right min-w-[160px] font-mono">
                      {skill.statusText}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Diagnostic panel footer notice */}
      <div className="mt-5 pt-3 border-t border-border flex items-center gap-2 text-[11px] text-txt-muted">
        <Info className="w-3.5 h-3.5 text-txt-muted flex-shrink-0" />
        <span>
          DIAGNOSTIC TELEMETRY: Relative capability index visualization based on active production engineering.
        </span>
      </div>
    </div>
  );
};

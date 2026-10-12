import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Layers, Code2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import { projectsData } from '../../data/projects';
import { workspaceSound } from '../../utils/workspaceAudio';

interface WorkSceneOverlayProps {
  onReturn: () => void;
}

export const WorkSceneOverlay: React.FC<WorkSceneOverlayProps> = ({ onReturn }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectsData[0].id);

  const currentProject = projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];

  const handleReturnClick = () => {
    workspaceSound.playHover();
    onReturn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-30 pointer-events-auto bg-[#0a0c10]/90 backdrop-blur-xl text-zinc-100 flex flex-col overflow-hidden"
    >
      {/* Top Bar Navigation */}
      <header className="h-16 px-6 sm:px-10 border-b border-white/10 flex items-center justify-between shrink-0">
        <button
          onClick={handleReturnClick}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
          <span>RETURN TO WORKSPACE</span>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">[ ESC ]</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>DOOR 01 // SELECTED WORKS</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Stage Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: Projects Index Selector */}
        <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-white/10 p-4 sm:p-6 overflow-y-auto shrink-0 space-y-2.5">
          <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>Project Index</span>
            <span>({projectsData.length} Archives)</span>
          </div>

          {projectsData.map((project, index) => {
            const isSelected = project.id === selectedProjectId;
            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  workspaceSound.playHover();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-white/10 border-amber-400/50 shadow-lg shadow-amber-500/5'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-zinc-400">
                    0{index + 1} // {project.category}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">
                    {project.status}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'}`}>
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1">
                  {project.shortDescription}
                </p>
                {isSelected && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Column: In-Depth Project Architectural Review */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Project Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentProject.category} // {currentProject.version}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {currentProject.title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
              {currentProject.fullOverview}
            </p>

            {/* Project Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {currentProject.liveDemoUrl && currentProject.liveDemoUrl !== '#' && (
                <a
                  href={currentProject.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold tracking-wide transition-all shadow-md shadow-amber-400/10"
                >
                  <span>LIVE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>SOURCE CODE</span>
                </a>
              )}
            </div>
          </div>

          {/* Technology Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-wider text-zinc-400 uppercase flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Technology Architecture</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/10 text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Engineering Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Core Capabilities & Features</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {currentProject.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-400/80 mt-1">▹</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Architecture & Engineering Solves</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {currentProject.architectureHighlights.map((arch, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400/80 mt-1">▹</span>
                    <span>{arch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

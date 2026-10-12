import React from 'react';
import { ProjectItem } from '../../types/os';
import { projectsData } from '../../data/projects';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import { useWindowStore } from '../../store/windowStore';

interface ProjectDetailAppProps {
  project?: ProjectItem;
}

export const ProjectDetailApp: React.FC<ProjectDetailAppProps> = ({ project: propProject }) => {
  const { openWindow } = useWindowStore();
  const project = propProject || projectsData[0];

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto text-txt-primary bg-surface">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
        <button
          onClick={() => openWindow('projects')}
          className="flex items-center gap-1.5 text-xs font-mono text-txt-secondary hover:text-txt-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Explorer</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-txt-muted border border-border">
            {project.version}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-secondary text-status-success border border-border">
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Title & Action CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="text-[11px] font-mono uppercase text-txt-muted tracking-wider mb-1 font-semibold">
            {project.category} SPECIFICATION
          </div>
          <h1 className="text-xl font-bold tracking-tight text-txt-primary">{project.title}</h1>
          <p className="text-xs text-txt-secondary mt-1 max-w-2xl">{project.tagline}</p>
        </div>

        {/* Live Demo & GitHub Action Buttons */}
        <div className="flex items-center gap-2">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-txt-primary text-bg font-medium text-xs transition-opacity hover:opacity-90 shadow-sm"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-secondary hover:bg-surface-hover text-txt-primary border border-border font-medium text-xs transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Overview Block */}
      <div className="p-4 rounded-lg bg-surface-secondary border border-border mb-5">
        <h2 className="text-[11px] font-mono font-semibold uppercase text-txt-muted tracking-wider mb-1.5">
          PROJECT OVERVIEW
        </h2>
        <p className="text-xs text-txt-secondary leading-relaxed">{project.fullOverview}</p>
      </div>

      {/* Technology Stack Grid */}
      <div className="mb-5">
        <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-txt-muted" />
          <span>TECHNOLOGIES & TOOLING</span>
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border text-xs font-mono text-txt-primary shadow-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Main Features & Architecture Highlights */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {/* Core Features */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-txt-muted" />
            <span>KEY SYSTEM FEATURES</span>
          </h2>
          <div className="space-y-2">
            {project.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-txt-secondary leading-relaxed">
                <span className="text-txt-muted font-mono mt-0.5">&bull;</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-txt-muted" />
            <span>ARCHITECTURE HIGHLIGHTS</span>
          </h2>
          <div className="space-y-2">
            {project.architectureHighlights.map((arch, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-txt-secondary leading-relaxed">
                <span className="text-txt-muted font-mono mt-0.5">&bull;</span>
                <span>{arch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Contribution */}
      <div className="mb-5 p-4 rounded-lg bg-surface-secondary border border-border">
        <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2.5 flex items-center gap-2">
          <span>ENGINEERING CONTRIBUTIONS</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {project.myContribution.map((contrib, i) => (
            <div
              key={i}
              className="p-2.5 rounded-md bg-surface border border-border text-xs text-txt-secondary flex items-start gap-2"
            >
              <span className="font-mono text-txt-muted text-xs mt-0.5">0{i + 1}.</span>
              <span>{contrib}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Challenges & Solutions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-txt-muted" />
            <span>ENGINEERING CHALLENGES</span>
          </h2>
          <div className="space-y-2">
            {project.challenges.map((ch, i) => (
              <div key={i} className="text-xs text-txt-secondary leading-relaxed flex items-start gap-2">
                <span className="text-txt-muted font-mono">&gt;</span>
                <span>{ch}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-surface-secondary border border-border">
          <h2 className="text-xs font-mono font-semibold uppercase text-txt-muted tracking-wider mb-2 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-txt-muted" />
            <span>IMPLEMENTED ARCHITECTURAL SOLUTIONS</span>
          </h2>
          <div className="space-y-2">
            {project.solutions.map((sol, i) => (
              <div key={i} className="text-xs text-txt-secondary leading-relaxed flex items-start gap-2">
                <span className="text-txt-muted font-mono">&gt;</span>
                <span>{sol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
